/**
 * Animal listings entry point. Resolves which adapter serves at runtime
 * (docs/decisions.md D3):
 *
 *   petrescue  when PETRESCUE_API_TOKEN is set
 *   sanity     when NEXT_PUBLIC_SANITY_PROJECT_ID is set
 *   mock       in development, or when ALLOW_MOCK_CONTENT=true
 *   empty      otherwise (production with nothing configured: an honest empty state)
 *
 * The first candidate that answers wins. An adapter that throws
 * `AdapterUnavailableError` is skipped, with one warning, and retried after a
 * cool-down so a transient outage does not pin the site to a fallback for
 * the life of the process. When PetRescue serves and Sanity is configured,
 * Sanity documents are overlaid by HAART ID for the fields PetRescue lacks.
 */
import type { Animal, Species } from '@/lib/content/types';
import { env } from '@/lib/env';
import { mockSource } from './mock';
import { createPetRescueSource, isPetRescueConfigured } from './petrescue';
import { createSanitySource, isSanityConfigured, overlayFromSanity, overlayOne } from './sanity';
import { AdapterUnavailableError, type AnimalFilters, type AnimalSource, applySourceFilters, normaliseHaartId, sortAnimals } from './types';

export * from './types';
export { createMockSource, mockSource } from './mock';
export { createPetRescueSource, isPetRescueConfigured, mapListing } from './petrescue';
export { createSanitySource, isSanityConfigured, mapSanityAnimal, overlayFromSanity, overlayOne } from './sanity';

export const emptySource: AnimalSource = {
  name: 'empty',
  list: async () => [],
  get: async () => null,
  getByHaartId: async () => null,
};

export const DEFAULT_COOLDOWN_MS = 5 * 60 * 1000;

export type ResolverOptions = {
  /** Ordered candidates. The last one should never throw; `emptySource` is appended if it is missing. */
  sources?: AnimalSource[];
  /** Overlaid onto results when the serving source is `petrescue`. Null disables the overlay. */
  overlay?: AnimalSource | null;
  /** How long a failed adapter is skipped before it is tried again. */
  cooldownMs?: number;
  warn?: (message: string) => void;
  now?: () => number;
};

export function mockContentAllowed(): boolean {
  return !env.isLiveSite || process.env.ALLOW_MOCK_CONTENT === 'true';
}

function defaultOptions(): Required<Pick<ResolverOptions, 'sources' | 'overlay'>> {
  const sources: AnimalSource[] = [];
  const sanity = isSanityConfigured() ? createSanitySource() : null;
  const petrescue = isPetRescueConfigured() ? createPetRescueSource() : null;
  if (petrescue) sources.push(petrescue);
  if (sanity) sources.push(sanity);
  if (mockContentAllowed()) sources.push(mockSource);
  return { sources, overlay: petrescue && sanity ? sanity : null };
}

/**
 * Builds a resolving `AnimalSource` over an ordered list of candidates. Its
 * `name` reports which adapter answered the most recent call.
 */
export function createAnimalSource(options: ResolverOptions = {}): AnimalSource {
  const defaults = options.sources ? { sources: options.sources, overlay: options.overlay ?? null } : defaultOptions();
  const overlay = options.overlay === undefined ? defaults.overlay : options.overlay;
  const candidates = defaults.sources.some((s) => s.name === 'empty') ? [...defaults.sources] : [...defaults.sources, emptySource];
  const cooldownMs = options.cooldownMs ?? DEFAULT_COOLDOWN_MS;
  const warn = options.warn ?? ((message: string) => console.warn(message));
  const now = options.now ?? Date.now;

  const failedUntil = new Map<AnimalSource, number>();
  let lastServed: AnimalSource = candidates[0];

  const available = (s: AnimalSource) => (failedUntil.get(s) ?? 0) <= now();

  function markFailed(s: AnimalSource, error: AdapterUnavailableError) {
    const wasHealthy = available(s);
    failedUntil.set(s, now() + cooldownMs);
    if (wasHealthy) warn(`[animals] ${s.name} adapter unavailable, falling back: ${error.message}`);
  }

  async function run<T>(op: (s: AnimalSource) => Promise<T>, fallback: T): Promise<{ source: AnimalSource | null; value: T }> {
    for (const candidate of candidates) {
      if (!available(candidate)) continue;
      try {
        const value = await op(candidate);
        lastServed = candidate;
        return { source: candidate, value };
      } catch (error) {
        if (error instanceof AdapterUnavailableError) {
          markFailed(candidate, error);
          continue;
        }
        throw error;
      }
    }
    return { source: null, value: fallback };
  }

  async function withOverlay<T>(source: AnimalSource | null, op: (o: AnimalSource) => Promise<T>, fallback: T): Promise<T> {
    if (!overlay || source?.name !== 'petrescue' || !available(overlay)) return fallback;
    try {
      return await op(overlay);
    } catch (error) {
      if (error instanceof AdapterUnavailableError) {
        markFailed(overlay, error);
        return fallback;
      }
      throw error;
    }
  }

  return {
    get name() {
      return lastServed.name;
    },
    async list(filters?: AnimalFilters) {
      const { source, value } = await run((s) => s.list(filters), [] as Animal[]);
      if (!overlay || source?.name !== 'petrescue') return value;
      // The overlay fetches everything: Sanity's own status is irrelevant to
      // matching, and Sanity-only animals are appended, so filter afterwards.
      const sanityAnimals = await withOverlay(source, (o) => o.list(), null);
      return sanityAnimals ? applySourceFilters(overlayFromSanity(value, sanityAnimals), filters) : value;
    },
    async get(slug: string) {
      const { source, value } = await run((s) => s.get(slug), null as Animal | null);
      if (!overlay || source?.name !== 'petrescue') return value;
      if (value) return overlayOne(value, await withOverlay(source, (o) => o.getByHaartId(value.haartId), null));
      return withOverlay(source, (o) => o.get(slug), null);
    },
    async getByHaartId(id: string) {
      const wanted = normaliseHaartId(id);
      const { source, value } = await run((s) => s.getByHaartId(wanted), null as Animal | null);
      if (!overlay || source?.name !== 'petrescue') return value;
      const doc = await withOverlay(source, (o) => o.getByHaartId(wanted), null);
      return value ? overlayOne(value, doc) : doc;
    },
  };
}

let cached: AnimalSource | undefined;

/**
 * The process-wide animal source. Pass options to build an uncached one, for
 * example in tests that inject fake adapters.
 */
export function getAnimalSource(options?: ResolverOptions): AnimalSource {
  if (options) return createAnimalSource(options);
  cached ??= createAnimalSource();
  return cached;
}

/** Forgets the cached source so the next call re-reads the environment. */
export function resetAnimalSource(): void {
  cached = undefined;
}

// ---------------------------------------------------------------------------
// Page-level helpers
// ---------------------------------------------------------------------------

export function listAnimals(filters?: AnimalFilters): Promise<Animal[]> {
  return getAnimalSource().list(filters);
}

export function getAnimal(slug: string): Promise<Animal | null> {
  return getAnimalSource().get(slug);
}

export function getAnimalByHaartId(id: string): Promise<Animal | null> {
  return getAnimalSource().getByHaartId(normaliseHaartId(id));
}

/** Adoptable animals flagged as needing a foster carer, newest first. */
export async function getFosterNeeded(limit?: number): Promise<Animal[]> {
  const animals = sortAnimals(await listAnimals({ fosterNeeded: true, status: 'adoptable' }), 'newest');
  return limit !== undefined ? animals.slice(0, limit) : animals;
}

/** Other adoptable animals of the same species, newest first, never the animal itself. */
export async function getRelatedAnimals(animal: Pick<Animal, 'species' | 'slug' | 'haartId'>, n = 3): Promise<Animal[]> {
  const same = await listAnimals({ species: animal.species, status: 'adoptable' });
  return sortAnimals(
    same.filter((a) => a.slug !== animal.slug),
    'newest',
  ).slice(0, n);
}

export async function countAdoptable(species?: Species): Promise<number> {
  return (await listAnimals({ status: 'adoptable', species })).length;
}
