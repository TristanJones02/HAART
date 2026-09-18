import type { Animal, AnimalStatus } from '@/lib/content/types';
import type { IndexRow } from '@/components/art';
import { ageBandOf, statusLabel } from '@/lib/animals/types';

export const animalPath = (a: Pick<Animal, 'species' | 'slug'>) => `/adopt/${a.species === 'dog' ? 'dogs' : 'cats'}/${a.slug}`;

export type SizeBand = NonNullable<Animal['size']>;
export type AgeBandName = NonNullable<Animal['ageBand']>;
/** One key for the bar, the word and the chip: foster-needed outranks available, never adopted. */
export type StatusKey = AnimalStatus | 'fosterNeeded';

export function ageLabel(a: Animal): string | null {
  if (a.ageText) return a.ageText;
  if (a.dateOfBirth) {
    const months = Math.max(0, Math.round((Date.now() - new Date(a.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
    if (months < 1) return 'Under a month';
    if (months < 24) return `${months} month${months === 1 ? '' : 's'}`;
    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? '' : 's'}`;
  }
  if (a.ageBand) return a.ageBand.charAt(0).toUpperCase() + a.ageBand.slice(1);
  return null;
}

/** Short facts for decks and metadata lines: age, sex, breed, size. */
export function animalFacts(a: Animal): string[] {
  const out: string[] = [];
  const age = ageLabel(a);
  if (age) out.push(age);
  if (a.sex) out.push(a.sex === 'male' ? 'Male' : 'Female');
  if (a.breed) out.push(a.breed);
  if (a.size) out.push(sizeLabel(a.size));
  return out;
}

export const triLabel = (v: 'yes' | 'no' | 'unknown') => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Ask us');

export const sizeLabel = (size: SizeBand) => (size === 'extra-large' ? 'Extra large' : size.charAt(0).toUpperCase() + size.slice(1));

export function feeLabel(a: Animal, catStandard?: number): string | null {
  if (typeof a.fee === 'number') return `$${a.fee}`;
  if (a.species === 'cat' && catStandard) return `$${catStandard}`;
  return null;
}

// ---------------------------------------------------------------------------
// Bands. The plate is drawn from the record, so a chihuahua and a mastiff
// never share a drawing; these two helpers are how the record answers.
// Both tolerate a half-filled record and neither ever throws.
// ---------------------------------------------------------------------------

const SIZE_ORDER: readonly SizeBand[] = ['small', 'medium', 'large', 'extra-large'];

/** Body size, not skull shape: what a volunteer would tick on the form. */
const DOG_BREEDS: ReadonlyArray<readonly [RegExp, SizeBand]> = [
  [/mastiff|great dane|wolfhound|deerhound|newfoundland|st bernard|saint bernard|leonberger|anatolian|maremma|dogue|cane corso/, 'extra-large'],
  [/shepherd|gsd\b|labrador|\blab\b|retriever|husky|malamute|doberman|rottweiler|ridgeback|bull arab|huntaway|dalmatian|greyhound|pointer|weimaraner|akita|setter|hound|boxer|samoyed|kangal/, 'large'],
  [/staff|amstaff|bull terrier|bulldog|border collie|\bcollie\b|kelpie|koolie|cattle dog|heeler|beagle|spaniel|cocker|poodle|schnauzer|shar pei|dingo|pit bull|american bully|basset|shiba/, 'medium'],
  [/chihuahua|jack russell|maltese|shih tzu|\bpug\b|pomeranian|dachshund|corgi|cavalier|miniature|\bmini\b|\btoy\b|papillon|silky|yorkshire|foxie|fox terrier|whippet|italian greyhound|bichon|lhasa|pekingese|\bterrier\b/, 'small'],
];

const CAT_BREEDS: ReadonlyArray<readonly [RegExp, SizeBand]> = [
  [/maine coon|ragdoll|norwegian forest|savannah|siberian|british shorthair/, 'large'],
  [/domestic|short ?hair|medium ?hair|long ?hair|\bdsh\b|\bdmh\b|\bdlh\b|moggy|tabby|burmese|siamese|bengal|russian blue|tortoiseshell/, 'medium'],
  [/munchkin|singapura|cornish rex|devon rex/, 'small'],
];

/** Weight in kilograms, where a volunteer has weighed the animal. */
function bandFromWeight(kg: number, species: Animal['species']): SizeBand | undefined {
  if (!Number.isFinite(kg) || kg <= 0) return undefined;
  if (species === 'cat') return kg < 3.5 ? 'small' : kg < 6 ? 'medium' : 'large';
  return kg < 10 ? 'small' : kg < 25 ? 'medium' : kg < 40 ? 'large' : 'extra-large';
}

/**
 * A cross is drawn at the size of its biggest parent: "German shepherd x
 * mastiff" is an extra-large dog, and drawing it as a fine-boned one would be
 * the exact mistake the plate assignment exists to prevent.
 */
function bandFromBreed(breed: string, species: Animal['species']): SizeBand | undefined {
  const text = breed.toLowerCase();
  const table = species === 'cat' ? CAT_BREEDS : DOG_BREEDS;
  let best: SizeBand | undefined;
  for (const [re, band] of table) {
    if (!re.test(text)) continue;
    if (!best || SIZE_ORDER.indexOf(band) > SIZE_ORDER.indexOf(best)) best = band;
  }
  return best;
}

/**
 * Size band for plate assignment: the recorded size first, then the recorded
 * weight, then the breed text. Undefined when the record says nothing, which
 * is a real answer — `plateFor` draws an unknown-size dog sitting.
 */
export function sizeBand(a: Pick<Animal, 'species' | 'size' | 'weightKg' | 'breed'> | undefined | null): SizeBand | undefined {
  if (!a) return undefined;
  if (a.size && SIZE_ORDER.includes(a.size)) return a.size;
  const species = a.species === 'cat' ? 'cat' : 'dog';
  if (typeof a.weightKg === 'number') {
    const byWeight = bandFromWeight(a.weightKg, species);
    if (byWeight) return byWeight;
  }
  if (a.breed) return bandFromBreed(a.breed, species);
  return undefined;
}

/**
 * Age band for plate assignment: the recorded band, then the date of birth,
 * then free-text age as HAART writes it ("10 weeks", "17 year old").
 * Undefined when nothing parses.
 */
export function ageBand(a: Animal | undefined | null): AgeBandName | undefined {
  if (!a) return undefined;
  return ageBandOf(a);
}

/** Everything `plateFor` reads, in one call, so the four card sites agree. */
export function plateSubject(a: Animal) {
  return {
    species: a.species,
    sizeBand: sizeBand(a) ?? null,
    ageBand: ageBand(a) ?? null,
    haartId: a.haartId,
    status: a.status,
  };
}

/** Foster-needed outranks available; adopted outranks everything. */
export function statusKey(a: Pick<Animal, 'status' | 'fosterNeeded'>): StatusKey {
  if (a.status === 'adopted') return 'adopted';
  return a.fosterNeeded ? 'fosterNeeded' : a.status;
}

/**
 * Captions state a fact, never sentiment. The plate's caption says a
 * photograph is coming; the day one arrives the same line credits it, and
 * nothing else in the frame moves.
 */
export function plateCaption(a: Animal): string {
  const photo = a.photos?.[0];
  if (photo) return photo.caption ?? `Photograph of ${a.name}.`;
  if (a.status === 'adopted') return `Illustration — ${a.name} has been adopted.`;
  return `Illustration — a photograph of ${a.name} is coming.`;
}

// ---------------------------------------------------------------------------
// Index rows. A missing value renders "Ask us" rather than collapsing the row.
// ---------------------------------------------------------------------------

/** The two fact rows on an animal card. */
export function cardFacts(a: Animal): IndexRow[] {
  return [
    { label: 'Breed', value: a.breed ?? null },
    { label: 'Age', value: ageLabel(a) },
  ];
}

/**
 * The profile sidebar index. Every row renders, so Beau's blank cells and
 * missing fee produce a full, deliberate-looking record instead of a broken
 * one.
 */
export function profileFacts(a: Animal, fee: string | null): IndexRow[] {
  const yesNo = (v: boolean | undefined) => (v === undefined ? null : v ? 'Yes' : 'No');
  const kids = triLabel(a.goodWith.kids);
  return [
    { label: 'Catalogue number', value: a.haartId },
    { label: 'Status', value: statusLabel(a.status) },
    { label: 'Species', value: a.species === 'dog' ? 'Dog' : 'Cat' },
    { label: 'Breed', value: a.breed ?? null },
    { label: 'Age', value: ageLabel(a) },
    { label: 'Sex', value: a.sex ? (a.sex === 'male' ? 'Male' : 'Female') : null },
    { label: 'Size', value: a.size ? sizeLabel(a.size) : null },
    { label: 'Weight', value: typeof a.weightKg === 'number' ? `${a.weightKg} kg` : null },
    { label: 'Good with children', value: a.goodWith.kidsAgeNote ? `${kids} — ${a.goodWith.kidsAgeNote}` : kids },
    { label: 'Good with cats', value: triLabel(a.goodWith.cats) },
    { label: 'Good with dogs', value: triLabel(a.goodWith.dogs) },
    { label: 'Desexed', value: yesNo(a.desexed) },
    { label: 'Vaccinated', value: yesNo(a.vaccinated) },
    { label: 'Microchipped', value: yesNo(a.microchipped) },
    { label: 'Adoption fee', value: fee },
  ];
}

// ---------------------------------------------------------------------------
// Counted sentences. Every count on the site is computed from the register,
// never typed by a volunteer, so none of them can go stale.
// ---------------------------------------------------------------------------

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

/** "Four" up to twelve, then figures, so a counted sentence still reads as a sentence. */
export function countWord(n: number, capitalised = false): string {
  const word = n >= 0 && n < WORDS.length ? WORDS[n] : String(n);
  return capitalised ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

export const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/** "Four animals are waiting on a foster home." */
export function fosterCountLine(n: number): string {
  if (n === 0) return 'No animal is waiting on a foster home right now.';
  return `${countWord(n, true)} ${plural(n, 'animal is', 'animals are')} waiting on a foster home.`;
}
