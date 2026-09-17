/**
 * PetRescue adapter. HAART is PetRescue group 10046 and lists animals there
 * under the same HAART IDs it uses on its own site, so a listing's name is
 * the join key.
 *
 * The PetRescue API is token-authenticated and its documentation
 * (https://www.petrescue.com.au/api/docs) could not be reached from the
 * environment this was written in, so `PetRescueListing` is a best-effort
 * shape and `mapListing` reads every field defensively. Nothing in this file
 * has run against a live token; see docs/blockers.md C2.
 */
import type { Animal, AnimalStatus, ImageWithAlt, Species, Tri } from '@/lib/content/types';
import { env } from '@/lib/env';
import { textToPortable } from '@/lib/sanity/portable';
import {
  AdapterUnavailableError,
  type AnimalFilters,
  type AnimalSource,
  ageBandFrom,
  applySourceFilters,
  extractHaartId,
  HAART_ID_IN_TEXT_RE,
  normaliseHaartId,
  slugFor,
  speciesFromHaartId,
  truncate,
} from './types';

// ---------------------------------------------------------------------------
// Best-effort wire shape
// ---------------------------------------------------------------------------

export type PetRescueImage =
  | string
  | {
      url?: string;
      original?: string;
      large?: string;
      medium?: string;
      small?: string;
      alt?: string;
    };

export type PetRescueNamed = string | { name?: string; id?: number | string };

/**
 * Fields the adapter reads. Every one is optional because the real response
 * has not been seen; unknown extra fields are ignored.
 */
export interface PetRescueListing {
  id: number | string;
  name: string;
  species?: PetRescueNamed;
  breeds?: PetRescueNamed[];
  breed?: string;
  /** Free text ("2 years 3 months"), a word ("Adult") or an object. */
  age?: string | { years?: number; months?: number; weeks?: number; text?: string };
  date_of_birth?: string;
  sex?: string;
  size?: string;
  description?: string;
  personality?: string;
  images?: PetRescueImage[];
  photos?: PetRescueImage[];
  adoption_fee?: string | number | null;
  /** Expected: active, on_hold, adopted, rehomed. */
  status?: string;
  url?: string;
  link?: string;
  good_with_kids?: boolean | string | null;
  good_with_cats?: boolean | string | null;
  good_with_dogs?: boolean | string | null;
  desexed?: boolean;
  vaccinated?: boolean;
  microchipped?: boolean;
  location?: string | { suburb?: string; state?: string; postcode?: string };
  group_id?: number | string;
  created_at?: string;
  updated_at?: string;
  adopted_at?: string;
}

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined);

const bool = (v: unknown): boolean | undefined => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    if (['true', 'yes', 'y', '1'].includes(s)) return true;
    if (['false', 'no', 'n', '0'].includes(s)) return false;
  }
  return undefined;
};

const tri = (v: unknown): Tri => {
  const b = bool(v);
  return b === undefined ? 'unknown' : b ? 'yes' : 'no';
};

const namedToString = (v: unknown): string | undefined => {
  if (typeof v === 'string') return str(v);
  if (isRecord(v)) return str(v.name);
  return undefined;
};

export function mapPetRescueStatus(raw: unknown): AnimalStatus {
  const s = str(raw)?.toLowerCase().replace(/[\s-]+/g, '_');
  switch (s) {
    case 'active':
    case 'available':
      return 'available';
    case 'on_hold':
    case 'held':
      return 'on_hold';
    case 'pending':
    case 'application_pending':
      return 'pending';
    case 'adopted':
    case 'rehomed':
      return 'adopted';
    default:
      // Unknown or missing statuses are treated as available: a listing that
      // PetRescue returns in a group search is, by default, a live one.
      return 'available';
  }
}

function mapSpecies(raw: unknown, haartId: string): Species | undefined {
  const s = namedToString(raw)?.toLowerCase();
  if (s?.includes('dog')) return 'dog';
  if (s?.includes('cat')) return 'cat';
  if (s) return undefined; // rabbits, birds and other species are not listed on the site
  return speciesFromHaartId(haartId);
}

function mapSex(raw: unknown): Animal['sex'] {
  const s = str(raw)?.toLowerCase();
  if (s === 'male' || s === 'm') return 'male';
  if (s === 'female' || s === 'f') return 'female';
  return undefined;
}

function mapSize(raw: unknown): Animal['size'] {
  const s = str(raw)?.toLowerCase().replace(/[\s_]+/g, '-');
  if (!s) return undefined;
  if (['extra-large', 'xl', 'x-large', 'giant', 'xlarge'].includes(s)) return 'extra-large';
  if (s === 'small' || s === 'medium' || s === 'large') return s;
  return undefined;
}

function mapBreed(listing: Record<string, unknown>): string | undefined {
  if (Array.isArray(listing.breeds)) {
    const names = listing.breeds.map(namedToString).filter((n): n is string => !!n);
    if (names.length) return names.join(' x ');
  }
  return str(listing.breed) ?? namedToString(listing.primary_breed);
}

function mapAge(raw: unknown): string | undefined {
  if (typeof raw === 'string') return str(raw);
  if (typeof raw === 'number' && Number.isFinite(raw)) return `${raw} years`;
  if (isRecord(raw)) {
    if (str(raw.text)) return str(raw.text);
    const parts: string[] = [];
    const y = Number(raw.years);
    const m = Number(raw.months);
    const w = Number(raw.weeks);
    if (Number.isFinite(y) && y > 0) parts.push(`${y} ${y === 1 ? 'year' : 'years'}`);
    if (Number.isFinite(m) && m > 0) parts.push(`${m} ${m === 1 ? 'month' : 'months'}`);
    if (Number.isFinite(w) && w > 0) parts.push(`${w} ${w === 1 ? 'week' : 'weeks'}`);
    return parts.length ? parts.join(' ') : undefined;
  }
  return undefined;
}

function mapFee(raw: unknown): { fee?: number; feeNote?: string } {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) return { fee: raw };
  const s = str(raw);
  if (!s) return {};
  const n = Number.parseFloat(s.replace(/[^0-9.]/g, ''));
  if (Number.isFinite(n) && /\d/.test(s)) return { fee: n };
  return { feeNote: s };
}

function mapLocation(raw: unknown): string | undefined {
  if (typeof raw === 'string') return str(raw);
  if (isRecord(raw)) {
    const parts = [str(raw.suburb), str(raw.state)].filter(Boolean);
    return parts.length ? parts.join(', ') : undefined;
  }
  return undefined;
}

function imageUrl(img: unknown): string | undefined {
  if (typeof img === 'string') return str(img);
  if (isRecord(img)) return str(img.large) ?? str(img.url) ?? str(img.original) ?? str(img.medium) ?? str(img.small);
  return undefined;
}

/** PetRescue descriptions may carry simple HTML. Keep paragraph breaks, drop tags. */
export function stripHtml(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const NAME_NOISE_RE = /\b(foster\s+carer\s+needed|foster\s+needed|on\s+hold|adopted)\b/gi;

/**
 * Maps one raw listing to an `Animal`. Never throws: anything that is not a
 * dog or cat with a name and an id comes back as null.
 */
export function mapListing(raw: unknown): Animal | null {
  try {
    if (!isRecord(raw)) return null;
    const id = typeof raw.id === 'number' || typeof raw.id === 'string' ? String(raw.id).trim() : '';
    const rawName = str(raw.name);
    if (!id || !rawName) return null;

    const haartId = extractHaartId(rawName) ?? extractHaartId(str(raw.description)?.slice(0, 400)) ?? `PR-${id}`;
    const species = mapSpecies(raw.species, haartId);
    if (!species) return null;

    const fosterNeeded = /foster\s+(carer\s+)?needed/i.test(rawName);
    const name =
      rawName
        .replace(new RegExp(HAART_ID_IN_TEXT_RE.source, 'gi'), ' ')
        .replace(NAME_NOISE_RE, ' ')
        .replace(/[*_~()[\]-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() || rawName;

    const breed = mapBreed(raw);
    const descriptionText = stripHtml([str(raw.description), str(raw.personality)].filter(Boolean).join('\n\n'));
    const dateOfBirth = str(raw.date_of_birth);
    const ageText = mapAge(raw.age);
    const status = mapPetRescueStatus(raw.status);
    const { fee, feeNote } = mapFee(raw.adoption_fee);

    const rawImages = Array.isArray(raw.images) ? raw.images : Array.isArray(raw.photos) ? raw.photos : [];
    const alt = `${name}, ${breed ?? species} available for adoption through HAART`;
    const photos: ImageWithAlt[] = rawImages
      .map((img) => ({ url: imageUrl(img), alt: (isRecord(img) && str(img.alt)) || alt }))
      .filter((p): p is ImageWithAlt & { url: string } => !!p.url)
      .map((p) => ({ _type: 'imageWithAlt' as const, alt: p.alt, url: p.url }));

    const animal: Animal = {
      _type: 'animal',
      _id: `petrescue-${id}`,
      name,
      slug: slugFor(name, haartId),
      haartId: normaliseHaartId(haartId),
      species,
      status,
      fosterNeeded,
      sex: mapSex(raw.sex),
      breed,
      dateOfBirth,
      ageText,
      ageBand: ageBandFrom(dateOfBirth ?? ageText, species),
      size: mapSize(raw.size),
      goodWith: { kids: tri(raw.good_with_kids), cats: tri(raw.good_with_cats), dogs: tri(raw.good_with_dogs) },
      fee,
      feeNote,
      desexed: bool(raw.desexed),
      vaccinated: bool(raw.vaccinated),
      microchipped: bool(raw.microchipped),
      summary: descriptionText ? truncate(descriptionText.split(/\n\s*\n/)[0] ?? '', 120) : undefined,
      description: descriptionText ? textToPortable(descriptionText) : [],
      photos,
      petrescueId: id,
      petrescueUrl: str(raw.url) ?? str(raw.link) ?? `https://www.petrescue.com.au/listings/${id}`,
      listedAt: str(raw.created_at),
      adoptedAt: status === 'adopted' ? (str(raw.adopted_at) ?? str(raw.updated_at)) : undefined,
      location: mapLocation(raw.location),
      source: 'petrescue',
    };

    // Drop undefined keys so records compare cleanly and serialise small.
    for (const key of Object.keys(animal) as (keyof Animal)[]) {
      if (animal[key] === undefined) delete animal[key];
    }
    return animal;
  } catch {
    return null;
  }
}

/** The list endpoint may return a bare array or wrap it; accept the common shapes. */
export function extractListings(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;
  if (isRecord(body)) {
    for (const key of ['listings', 'data', 'results', 'items']) {
      const v = body[key];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

export const PETRESCUE_PER_PAGE = 50;
export const PETRESCUE_MAX_PAGES = 5;
export const PETRESCUE_TIMEOUT_MS = 8_000;
export const PETRESCUE_REVALIDATE_SECONDS = 900;

export type PetRescueSourceOptions = {
  token?: string;
  groupId?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  maxPages?: number;
};

export function isPetRescueConfigured(): boolean {
  return Boolean(env.petrescue.token);
}

export function createPetRescueSource(options: PetRescueSourceOptions = {}): AnimalSource {
  const token = options.token ?? env.petrescue.token;
  const groupId = options.groupId ?? env.petrescue.groupId;
  const baseUrl = (options.baseUrl ?? env.petrescue.baseUrl).replace(/\/+$/, '');
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? PETRESCUE_TIMEOUT_MS;
  const maxPages = options.maxPages ?? PETRESCUE_MAX_PAGES;

  async function fetchPage(page: number): Promise<unknown[]> {
    if (!token) throw new AdapterUnavailableError('petrescue', 'PETRESCUE_API_TOKEN is not set');
    const url = `${baseUrl}/listings?group_id=${encodeURIComponent(groupId)}&per_page=${PETRESCUE_PER_PAGE}&page=${page}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetchImpl(url, {
        headers: {
          // TODO(tristan): confirm the header format against https://www.petrescue.com.au/api/docs
          // once a token is issued. The docs mention the token may also be passed as a
          // query parameter; switch to that here if the bearer header is rejected.
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        signal: controller.signal,
        next: { revalidate: PETRESCUE_REVALIDATE_SECONDS, tags: ['animals'] },
      });
      if (!res.ok) throw new AdapterUnavailableError('petrescue', `PetRescue responded ${res.status} for page ${page}`);
      return extractListings(await res.json());
    } catch (error) {
      if (error instanceof AdapterUnavailableError) throw error;
      const reason = error instanceof Error && error.name === 'AbortError' ? `timed out after ${timeoutMs} ms` : 'request failed';
      throw new AdapterUnavailableError('petrescue', `PetRescue ${reason} for page ${page}`, { cause: error });
    } finally {
      clearTimeout(timer);
    }
  }

  async function fetchAll(): Promise<Animal[]> {
    const animals: Animal[] = [];
    const seen = new Set<string>();
    for (let page = 1; page <= maxPages; page += 1) {
      const raw = await fetchPage(page);
      for (const item of raw) {
        const animal = mapListing(item);
        if (animal && !seen.has(animal.slug)) {
          seen.add(animal.slug);
          animals.push(animal);
        }
      }
      if (raw.length < PETRESCUE_PER_PAGE) break;
    }
    return animals;
  }

  return {
    name: 'petrescue',
    async list(filters?: AnimalFilters) {
      return applySourceFilters(await fetchAll(), filters);
    },
    async get(slug: string) {
      const all = await fetchAll();
      return all.find((a) => a.slug === slug) ?? null;
    },
    async getByHaartId(id: string) {
      const wanted = normaliseHaartId(id);
      const all = await fetchAll();
      return all.find((a) => a.haartId === wanted) ?? null;
    },
  };
}
