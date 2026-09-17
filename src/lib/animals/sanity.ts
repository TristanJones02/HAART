/**
 * Sanity adapter. Reads `animal` documents (studio/schemas/documents/animal.ts)
 * and also supplies the overlay that enriches PetRescue records with the
 * fields PetRescue does not hold: fosterNeeded, story, medicalNote and a
 * hand-written summary (docs/decisions.md D3).
 */
import type { FilteredResponseQueryOptions, SanityClient } from '@sanity/client';
import type { Animal, ImageWithAlt, Species, Tri } from '@/lib/content/types';
import { env } from '@/lib/env';
import { getReadClient, groq } from '@/lib/sanity/client';
import {
  AdapterUnavailableError,
  ADOPTABLE_STATUSES,
  type AnimalFilters,
  type AnimalSource,
  applySourceFilters,
  isAnimalStatus,
  normaliseHaartId,
  slugFor,
} from './types';

export const SANITY_REVALIDATE_SECONDS = 300;

const FETCH_OPTIONS: FilteredResponseQueryOptions = { next: { revalidate: SANITY_REVALIDATE_SECONDS, tags: ['animals'] } };

export const ANIMAL_PROJECTION = groq`{
  _id,
  _type,
  name,
  "slug": slug.current,
  haartId,
  species,
  status,
  fosterNeeded,
  sex,
  breed,
  dateOfBirth,
  ageText,
  ageBand,
  size,
  weightKg,
  goodWith,
  fee,
  feeNote,
  desexed,
  vaccinated,
  microchipped,
  medicalNote,
  summary,
  description,
  photos[]{
    _type,
    _key,
    alt,
    caption,
    sensitive,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "lqip": asset->metadata.lqip,
    hotspot,
    crop,
    "image": { "_type": "image", asset, hotspot, crop }
  },
  petrescueId,
  petrescueUrl,
  listedAt,
  adoptedAt,
  location,
  story->{ "slug": slug.current, title }
}`;

const ORDER = groq`| order(coalesce(listedAt, _createdAt) desc, name asc)`;

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined);
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
const boolOpt = (v: unknown): boolean | undefined => (typeof v === 'boolean' ? v : undefined);
const tri = (v: unknown): Tri => (v === 'yes' || v === 'no' ? v : 'unknown');

function mapPhotos(raw: unknown): ImageWithAlt[] {
  if (!Array.isArray(raw)) return [];
  const out: ImageWithAlt[] = [];
  for (const p of raw) {
    if (!isRecord(p)) continue;
    const url = str(p.url);
    const image = isRecord(p.image) && isRecord(p.image.asset) ? (p.image as ImageWithAlt['image']) : undefined;
    if (!url && !image) continue;
    out.push({
      _type: 'imageWithAlt',
      alt: str(p.alt) ?? '',
      caption: str(p.caption),
      sensitive: boolOpt(p.sensitive),
      url,
      width: num(p.width),
      height: num(p.height),
      lqip: str(p.lqip),
      image,
      hotspot: isRecord(p.hotspot) ? (p.hotspot as ImageWithAlt['hotspot']) : undefined,
    });
  }
  return out;
}

/** Maps one projected document to an `Animal`; null when it lacks a name or a species. */
export function mapSanityAnimal(doc: unknown): Animal | null {
  if (!isRecord(doc)) return null;
  const name = str(doc.name);
  const species = doc.species === 'dog' || doc.species === 'cat' ? (doc.species as Species) : undefined;
  if (!name || !species) return null;

  const haartId = normaliseHaartId(str(doc.haartId));
  const goodWith = isRecord(doc.goodWith) ? doc.goodWith : {};
  const story = isRecord(doc.story) && str(doc.story.slug) && str(doc.story.title) ? { slug: str(doc.story.slug)!, title: str(doc.story.title)! } : undefined;
  const sex = doc.sex === 'male' || doc.sex === 'female' ? doc.sex : undefined;
  const ageBand = ['puppy', 'young', 'adult', 'senior', 'kitten'].includes(doc.ageBand as string) ? (doc.ageBand as Animal['ageBand']) : undefined;
  const size = ['small', 'medium', 'large', 'extra-large'].includes(doc.size as string) ? (doc.size as Animal['size']) : undefined;

  const animal: Animal = {
    _type: 'animal',
    _id: str(doc._id),
    name,
    slug: str(doc.slug) ?? slugFor(name, haartId),
    haartId,
    species,
    status: isAnimalStatus(doc.status) ? doc.status : 'available',
    fosterNeeded: doc.fosterNeeded === true,
    sex,
    breed: str(doc.breed),
    dateOfBirth: str(doc.dateOfBirth),
    ageText: str(doc.ageText),
    ageBand,
    size,
    weightKg: num(doc.weightKg),
    goodWith: { kids: tri(goodWith.kids), cats: tri(goodWith.cats), dogs: tri(goodWith.dogs), kidsAgeNote: str(goodWith.kidsAgeNote) },
    fee: num(doc.fee),
    feeNote: str(doc.feeNote),
    desexed: boolOpt(doc.desexed),
    vaccinated: boolOpt(doc.vaccinated),
    microchipped: boolOpt(doc.microchipped),
    medicalNote: str(doc.medicalNote),
    summary: str(doc.summary),
    description: Array.isArray(doc.description) ? (doc.description as Animal['description']) : typeof doc.description === 'string' ? doc.description : [],
    photos: mapPhotos(doc.photos),
    petrescueId: str(doc.petrescueId),
    petrescueUrl: str(doc.petrescueUrl),
    listedAt: str(doc.listedAt),
    adoptedAt: str(doc.adoptedAt),
    location: str(doc.location),
    story,
    source: 'sanity',
  };
  for (const key of Object.keys(animal) as (keyof Animal)[]) {
    if (animal[key] === undefined) delete animal[key];
  }
  return animal;
}

// ---------------------------------------------------------------------------
// Source
// ---------------------------------------------------------------------------

export function isSanityConfigured(): boolean {
  return env.hasSanity;
}

function buildListQuery(filters: AnimalFilters | undefined): { query: string; params: Record<string, unknown> } {
  const clauses = ['_type == "animal"'];
  const params: Record<string, unknown> = {};
  if (filters?.species) {
    clauses.push('species == $species');
    params.species = filters.species;
  }
  if (filters?.status === 'adoptable') {
    clauses.push('status in $statuses');
    params.statuses = [...ADOPTABLE_STATUSES];
  } else if (filters?.status) {
    clauses.push('status == $status');
    params.status = filters.status;
  }
  if (filters?.fosterNeeded !== undefined) {
    clauses.push(filters.fosterNeeded ? 'fosterNeeded == true' : 'fosterNeeded != true');
  }
  const slice = filters?.limit !== undefined && filters.limit >= 0 ? `[0...${Math.floor(filters.limit)}]` : '';
  return { query: `*[${clauses.join(' && ')}] ${ORDER} ${slice} ${ANIMAL_PROJECTION}`, params };
}

export function createSanitySource(client: SanityClient | null = getReadClient()): AnimalSource {
  async function run<T>(query: string, params: Record<string, unknown>): Promise<T> {
    if (!client) throw new AdapterUnavailableError('sanity', 'Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID is empty)');
    try {
      return await client.fetch<T>(query, params, FETCH_OPTIONS);
    } catch (error) {
      throw new AdapterUnavailableError('sanity', 'Sanity query failed', { cause: error });
    }
  }

  return {
    name: 'sanity',
    async list(filters?: AnimalFilters) {
      const { query, params } = buildListQuery(filters);
      const docs = await run<unknown[]>(query, params);
      const animals = (Array.isArray(docs) ? docs : []).map(mapSanityAnimal).filter((a): a is Animal => a !== null);
      return applySourceFilters(animals, filters);
    },
    async get(slug: string) {
      const doc = await run<unknown>(groq`*[_type == "animal" && slug.current == $slug][0] ${ANIMAL_PROJECTION}`, { slug });
      return mapSanityAnimal(doc);
    },
    async getByHaartId(id: string) {
      const wanted = normaliseHaartId(id);
      if (!wanted) return null;
      const doc = await run<unknown>(groq`*[_type == "animal" && upper(haartId) == $id][0] ${ANIMAL_PROJECTION}`, { id: wanted });
      return mapSanityAnimal(doc);
    },
  };
}

// ---------------------------------------------------------------------------
// Overlay
// ---------------------------------------------------------------------------

/** Merges one Sanity document over one base record. Sanity's fosterNeeded, story, medicalNote and summary win; photos only fill a gap. */
export function overlayOne(base: Animal, sanity: Animal | null | undefined): Animal {
  if (!sanity) return base;
  return {
    ...base,
    fosterNeeded: sanity.fosterNeeded,
    story: sanity.story ?? base.story,
    medicalNote: sanity.medicalNote ?? base.medicalNote,
    summary: sanity.summary ?? base.summary,
    photos: base.photos.length ? base.photos : sanity.photos,
  };
}

export type OverlayOptions = {
  /** Also include Sanity animals that have no PetRescue counterpart (cats and short-term fosters that never go to PetRescue). Default true. */
  appendUnmatched?: boolean;
};

/**
 * Overlays Sanity documents onto a base list by HAART ID. Base records keep
 * their identity and source; matched Sanity fields are layered on top.
 */
export function overlayFromSanity(animals: Animal[], sanityAnimals: Animal[], options: OverlayOptions = {}): Animal[] {
  const appendUnmatched = options.appendUnmatched ?? true;
  const byId = new Map<string, Animal>();
  for (const s of sanityAnimals) {
    const id = normaliseHaartId(s.haartId);
    if (id && !byId.has(id)) byId.set(id, s);
  }
  const matched = new Set<string>();
  const merged = animals.map((base) => {
    const id = normaliseHaartId(base.haartId);
    const s = byId.get(id);
    if (s) matched.add(id);
    return overlayOne(base, s);
  });
  if (!appendUnmatched) return merged;
  const baseSlugs = new Set(merged.map((a) => a.slug));
  const extras = sanityAnimals.filter((s) => {
    const id = normaliseHaartId(s.haartId);
    return !(id && matched.has(id)) && !baseSlugs.has(s.slug);
  });
  return [...merged, ...extras];
}
