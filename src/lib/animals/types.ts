/**
 * Animal listings: the adapter interface and the pure helpers every adapter
 * and every page shares. Nothing in this file touches the network or the
 * environment, so it is safe to import from client components.
 *
 * See docs/decisions.md D3 for why there are three adapters behind one
 * interface, and docs/audit.md 4.2 for the ID and status mess these helpers
 * clean up.
 */
import type { Animal, AnimalStatus, Species } from '@/lib/content/types';

// ---------------------------------------------------------------------------
// Adapter contract
// ---------------------------------------------------------------------------

export type AnimalSourceName = 'petrescue' | 'sanity' | 'mock' | 'empty';

export type AnimalFilters = {
  species?: Species;
  /** 'adoptable' is available + pending + on_hold. */
  status?: AnimalStatus | 'adoptable';
  fosterNeeded?: boolean;
  limit?: number;
};

export interface AnimalSource {
  name: AnimalSourceName;
  list(filters?: AnimalFilters): Promise<Animal[]>;
  get(slug: string): Promise<Animal | null>;
  getByHaartId(id: string): Promise<Animal | null>;
}

/**
 * Thrown by an adapter when it cannot serve at all (no credential, network
 * failure, non-2xx). The resolver catches exactly this class and falls
 * through to the next source; anything else is a bug and propagates.
 */
export class AdapterUnavailableError extends Error {
  readonly source: AnimalSourceName;

  constructor(source: AnimalSourceName, message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'AdapterUnavailableError';
    this.source = source;
    if (options && 'cause' in options) this.cause = options.cause;
  }
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export const ADOPTABLE_STATUSES: readonly AnimalStatus[] = ['available', 'pending', 'on_hold'];

export const ANIMAL_STATUSES: readonly AnimalStatus[] = ['available', 'pending', 'on_hold', 'adopted', 'unknown'];

export function isAnimalStatus(value: unknown): value is AnimalStatus {
  return typeof value === 'string' && (ANIMAL_STATUSES as readonly string[]).includes(value);
}

export function isAdoptable(status: AnimalStatus): boolean {
  return ADOPTABLE_STATUSES.includes(status);
}

const STATUS_LABELS: Record<AnimalStatus, string> = {
  available: 'Available',
  pending: 'Application pending',
  on_hold: 'On hold',
  adopted: 'Adopted',
  unknown: 'Status unknown',
};

export function statusLabel(status: AnimalStatus | string | undefined): string {
  return (status && STATUS_LABELS[status as AnimalStatus]) || STATUS_LABELS.unknown;
}

// ---------------------------------------------------------------------------
// HAART IDs and slugs
// ---------------------------------------------------------------------------

/** Canonical form: HD26-051 (dogs) or HC26-005 (cats). */
export const HAART_ID_RE = /^H[DC]\d{2}-\d{3}$/;

/** Finds an ID inside free text such as a listing title, tolerating the spacing and padding seen on the current site. */
export const HAART_ID_IN_TEXT_RE = /H[DC]\s?\d{2}\s?-\s?\d{2,3}/i;

/**
 * Uppercases, strips whitespace and zero-pads the sequence:
 * "HD26 - 44" -> "HD26-044", "hd26-65" -> "HD26-065". Input that is not shaped
 * like a HAART ID is returned uppercased and de-spaced but otherwise as is,
 * so "3380-2" stays "3380-2"; use `isHaartId` to check.
 */
export function normaliseHaartId(raw: string | null | undefined): string {
  if (raw == null) return '';
  const compact = String(raw).toUpperCase().replace(/\s+/g, '');
  const m = /^(H[DC])(\d{2})-?(\d{1,3})$/.exec(compact);
  if (!m) return compact;
  return `${m[1]}${m[2]}-${m[3].padStart(3, '0')}`;
}

export function isHaartId(raw: string | null | undefined): boolean {
  return HAART_ID_RE.test(normaliseHaartId(raw));
}

/** Pulls the first HAART ID out of free text and normalises it, or null when there is none. */
export function extractHaartId(text: string | null | undefined): string | null {
  if (!text) return null;
  const m = HAART_ID_IN_TEXT_RE.exec(text);
  return m ? normaliseHaartId(m[0]) : null;
}

export function speciesFromHaartId(id: string | null | undefined): Species | undefined {
  const n = normaliseHaartId(id);
  if (n.startsWith('HD')) return 'dog';
  if (n.startsWith('HC')) return 'cat';
  return undefined;
}

export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * "Rosemary" + "HD26-44" -> "rosemary-hd26-044". An ID already present in the
 * name is removed first so it never appears twice.
 */
export function slugFor(name: string, haartId: string): string {
  const id = slugify(normaliseHaartId(haartId));
  const cleanName = slugify((name ?? '').replace(new RegExp(HAART_ID_IN_TEXT_RE.source, 'gi'), ' '));
  return [cleanName, id].filter(Boolean).join('-') || 'animal';
}

// ---------------------------------------------------------------------------
// Age
// ---------------------------------------------------------------------------

const DAYS_PER_MONTH = 30.44;
const WEEKS_PER_MONTH = 4.345;

/**
 * Age in months from an ISO date of birth or from free text as HAART writes
 * it ("10 weeks", "7 years", "~18-month-old", "17 year old", "1.5 years",
 * "2 years 3 months"). Undefined when nothing parses.
 */
export function ageInMonths(input: string | null | undefined, now: Date = new Date()): number | undefined {
  if (!input) return undefined;
  const s = String(input).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const dob = new Date(s);
    if (Number.isNaN(dob.getTime())) return undefined;
    return Math.max(0, (now.getTime() - dob.getTime()) / (DAYS_PER_MONTH * 24 * 60 * 60 * 1000));
  }
  const re = /(\d+(?:\.\d+)?)\s*-?\s*(weeks?|wks?|months?|mths?|mos?|years?|yrs?)\b/gi;
  let total = 0;
  let found = false;
  for (const m of s.matchAll(re)) {
    found = true;
    const n = Number.parseFloat(m[1]);
    const unit = m[2].toLowerCase();
    total += unit.startsWith('w') ? n / WEEKS_PER_MONTH : unit.startsWith('m') ? n : n * 12;
  }
  return found ? total : undefined;
}

type AgeBand = NonNullable<Animal['ageBand']>;

const BAND_WORDS: Array<[RegExp, AgeBand | 'baby']> = [
  [/\bkitten\b/i, 'kitten'],
  [/\bpupp(y|ies)\b/i, 'puppy'],
  [/\bbaby\b/i, 'baby'],
  [/\bsenior\b/i, 'senior'],
  [/\byoung\b/i, 'young'],
  [/\badult\b/i, 'adult'],
];

/**
 * Age band from a date of birth or free-text age. Dogs: puppy < 1y, young
 * 1-3y, adult 3-8y, senior 8y+. Cats: kitten < 1y, young 1-3y, adult 3-10y,
 * senior 10y+. Words like "kitten" or "senior" in the text win over numbers.
 */
export function ageBandFrom(input: string | null | undefined, species: Species, now: Date = new Date()): AgeBand | undefined {
  if (!input) return undefined;
  const text = String(input);
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) {
    for (const [re, band] of BAND_WORDS) {
      if (re.test(text)) return band === 'baby' ? (species === 'cat' ? 'kitten' : 'puppy') : band;
    }
  }
  const months = ageInMonths(text, now);
  if (months === undefined) return undefined;
  if (months < 12) return species === 'cat' ? 'kitten' : 'puppy';
  if (months < 36) return 'young';
  if (months < (species === 'cat' ? 120 : 96)) return 'adult';
  return 'senior';
}

const BAND_TYPICAL_MONTHS: Record<AgeBand, number> = { puppy: 6, kitten: 6, young: 24, adult: 60, senior: 120 };

/** Best available age band for an animal: the stored one, or derived from its date of birth or age text. */
export function ageBandOf(animal: Animal, now: Date = new Date()): AgeBand | undefined {
  return animal.ageBand ?? ageBandFrom(animal.dateOfBirth ?? animal.ageText, animal.species, now);
}

/** Age in months for sorting: exact when known, otherwise a typical value for the band, otherwise undefined. */
export function ageMonthsOf(animal: Animal, now: Date = new Date()): number | undefined {
  const exact = ageInMonths(animal.dateOfBirth ?? animal.ageText, now);
  if (exact !== undefined) return exact;
  return animal.ageBand ? BAND_TYPICAL_MONTHS[animal.ageBand] : undefined;
}

// ---------------------------------------------------------------------------
// Filtering and sorting
// ---------------------------------------------------------------------------

/** Adapter-level filters: what `AnimalSource.list` accepts. Shared so every adapter behaves the same. */
export function matchesFilters(animal: Animal, filters: AnimalFilters | undefined): boolean {
  if (!filters) return true;
  if (filters.species && animal.species !== filters.species) return false;
  if (filters.status === 'adoptable') {
    if (!isAdoptable(animal.status)) return false;
  } else if (filters.status && animal.status !== filters.status) {
    return false;
  }
  if (filters.fosterNeeded !== undefined && animal.fosterNeeded !== filters.fosterNeeded) return false;
  return true;
}

export function applySourceFilters(animals: Animal[], filters: AnimalFilters | undefined): Animal[] {
  const out = animals.filter((a) => matchesFilters(a, filters));
  return filters?.limit !== undefined && filters.limit >= 0 ? out.slice(0, filters.limit) : out;
}

const AGE_BANDS: readonly AgeBand[] = ['puppy', 'kitten', 'young', 'adult', 'senior'];
const SIZES: readonly NonNullable<Animal['size']>[] = ['small', 'medium', 'large', 'extra-large'];

export const isAgeBand = (v: unknown): v is AgeBand => typeof v === 'string' && (AGE_BANDS as readonly string[]).includes(v);
export const isSize = (v: unknown): v is NonNullable<Animal['size']> => typeof v === 'string' && (SIZES as readonly string[]).includes(v);

/**
 * What the listing page's filter bar can express. Booleans only narrow when
 * true. `ageBand` and `size` accept any string (form state, query params) and
 * an unrecognised value is ignored rather than matching nothing.
 */
export type UiFilters = {
  species?: Species;
  ageBand?: AgeBand | (string & {});
  size?: NonNullable<Animal['size']> | (string & {});
  goodWithKids?: boolean;
  goodWithCats?: boolean;
  goodWithDogs?: boolean;
  fosterNeeded?: boolean;
  /** Adopted animals are hidden unless this is true. Animals with an unknown status are always shown, labelled as such. */
  includeAdopted?: boolean;
};

export function applyFilters(animals: Animal[], ui: UiFilters = {}, now: Date = new Date()): Animal[] {
  return animals.filter((a) => {
    if (!ui.includeAdopted && a.status === 'adopted') return false;
    if (ui.species && a.species !== ui.species) return false;
    if (isAgeBand(ui.ageBand) && ageBandOf(a, now) !== ui.ageBand) return false;
    if (isSize(ui.size) && a.size !== ui.size) return false;
    if (ui.goodWithKids && a.goodWith?.kids !== 'yes') return false;
    if (ui.goodWithCats && a.goodWith?.cats !== 'yes') return false;
    if (ui.goodWithDogs && a.goodWith?.dogs !== 'yes') return false;
    if (ui.fosterNeeded && !a.fosterNeeded) return false;
    return true;
  });
}

export type AnimalSort = 'newest' | 'name' | 'age';

const byName = (a: Animal, b: Animal) => a.name.localeCompare(b.name, 'en-AU') || a.haartId.localeCompare(b.haartId);

/**
 * Returns a new sorted array. 'newest' is listedAt descending with undated
 * records last; 'age' is youngest first with unknown ages last; ties fall
 * back to name.
 */
export function sortAnimals(animals: Animal[], sort: AnimalSort, now: Date = new Date()): Animal[] {
  const copy = [...animals];
  switch (sort) {
    case 'name':
      return copy.sort(byName);
    case 'age': {
      const months = new Map(copy.map((a) => [a, ageMonthsOf(a, now)] as const));
      return copy.sort((a, b) => {
        const ma = months.get(a);
        const mb = months.get(b);
        if (ma === undefined && mb === undefined) return byName(a, b);
        if (ma === undefined) return 1;
        if (mb === undefined) return -1;
        return ma - mb || byName(a, b);
      });
    }
    case 'newest':
    default:
      return copy.sort((a, b) => {
        const ta = a.listedAt ? Date.parse(a.listedAt) : Number.NaN;
        const tb = b.listedAt ? Date.parse(b.listedAt) : Number.NaN;
        const va = Number.isNaN(ta);
        const vb = Number.isNaN(tb);
        if (va && vb) return byName(a, b);
        if (va) return 1;
        if (vb) return -1;
        return tb - ta || byName(a, b);
      });
  }
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

/** Cuts text to at most `max` characters on a word boundary, adding an ellipsis when it was cut. */
export function truncate(text: string, max = 120): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const head = clean.slice(0, max - 1);
  const cut = head.lastIndexOf(' ');
  return `${(cut > max / 2 ? head.slice(0, cut) : head).replace(/[\s,;:.-]+$/, '')}…`;
}
