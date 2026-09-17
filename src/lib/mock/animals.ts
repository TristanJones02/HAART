/**
 * The 36 animals indexed from haart.org.au, as captured in
 * docs/content-inventory.json (`documents.animal`). Fields come from the
 * inventory's `fields`; the write-ups are the verbatim fragments the search
 * index quoted, nothing more. Where the inventory has no breed, age or sex
 * the field is left undefined rather than guessed.
 *
 * Photos are placeholder SVGs (public/placeholders) with alt text that says
 * so. `listedAt` is derived from the ID so sorting is stable; it is not a
 * real intake date. Statuses are exactly as inventoried, including
 * `unknown` for the three stale listings in docs/blockers.md F8, and the
 * HD25-003 collision between Maxi and Tazzie (F7) is preserved on purpose.
 */
import type { Animal, ImageWithAlt, Species, Tri } from '@/lib/content/types';
import { ageBandFrom, normaliseHaartId, slugFor, truncate } from '@/lib/animals/types';
import { textToPortable } from '@/lib/sanity/portable';

type Seed = {
  name: string;
  haartId: string;
  species: Species;
  status: Animal['status'];
  fosterNeeded?: boolean;
  sex?: Animal['sex'];
  breed?: string;
  ageText?: string;
  dateOfBirth?: string;
  ageBand?: Animal['ageBand'];
  size?: Animal['size'];
  weightKg?: number;
  goodWith?: { kids?: boolean; cats?: boolean; dogs?: boolean };
  fee?: number;
  desexed?: boolean;
  vaccinated?: boolean;
  medicalNote?: string;
  /** Verbatim fragments from the inventory, in order. Empty when the inventory has none. */
  fragments: string[];
};

const DOGS: Seed[] = [
  {
    name: 'Artie',
    haartId: 'HD21-041',
    species: 'dog',
    status: 'unknown',
    fragments: [
      'Artie is a beautiful big boy who needs a family that has the time and patience to let him feel settled and safe.',
      'He was a hand raised neonate pup who would now do best in an only dog home with older (13+) children due to his size.',
      'He is dog reactive and currently working with a trainer, and his family will need to understand and follow the advice given to ensure he can be set up for success as he transitions to his forever home.',
    ],
  },
  { name: 'Mowgli', haartId: 'HD24-026', species: 'dog', status: 'available', fragments: [] },
  { name: 'Nova', haartId: 'HD24-049', species: 'dog', status: 'available', fragments: ['Bull Arab x Huntaway'] },
  {
    name: 'Maxi',
    haartId: 'HD25-003',
    species: 'dog',
    status: 'available',
    fosterNeeded: true,
    fragments: ['Maxi is a loving, playful companion who will grow into a loyal family dog.'],
  },
  {
    name: 'Tazzie',
    haartId: 'HD25-003',
    species: 'dog',
    status: 'available',
    sex: 'male',
    breed: 'Kelpie X Staffy',
    dateOfBirth: '2024-08-15',
    fee: 625,
    desexed: true,
    vaccinated: true,
    fragments: ['Male Kelpie X Staffy', 'Born 15/08/2024', 'Desexed and vaccinated', 'Adoption Cost: $625'],
  },
  {
    name: 'Sage',
    haartId: 'HD25-031',
    species: 'dog',
    status: 'available',
    fosterNeeded: true,
    breed: 'German Shepherd X Mastiff',
    fragments: ['Sage is a stunning German Shepherd X Mastiff mix and has a heart of gold and a playful spirit that will bring joy and laughter into your home.'],
  },
  { name: 'Jersey', haartId: 'HD25-120', species: 'dog', status: 'available', fragments: [] },
  { name: 'Evie', haartId: 'HD25-121', species: 'dog', status: 'available', fragments: [] },
  {
    name: 'Armani',
    haartId: 'HD25-308',
    species: 'dog',
    status: 'available',
    sex: 'female',
    ageText: '2 years',
    breed: 'Hound mix',
    goodWith: { kids: false },
    fragments: [
      'Armani is a beautiful 2-year-old hound mix searching for a calm, understanding home where she can continue to flourish.',
      'She thrives on routine and does best in a quiet adult-only home with no children.',
    ],
  },
  {
    name: 'Kuba',
    haartId: 'HD26-018',
    species: 'dog',
    status: 'available',
    breed: 'Kelpie',
    ageText: '18 months',
    fragments: ['Kuba is a gorgeous ~18-month-old Kelpie with a gentle nature and a playful streak.'],
  },
  {
    name: 'Blackberry',
    haartId: 'HD26-025',
    species: 'dog',
    status: 'available',
    sex: 'male',
    breed: 'Staffy',
    ageText: '8 months',
    medicalNote: 'recovering from leg trauma; strict rehab',
    fragments: [
      'Blackberry is an 8-month-old Staffy currently recovering from trauma to his leg and requires strict rehab.',
      'He needs a quiet, low-stress home where he can feel safe and decompress.',
    ],
  },
  {
    name: 'Petey',
    haartId: 'HD26-027',
    species: 'dog',
    status: 'available',
    fragments: ['Petey is a lively little fellow who brings fun and affection and is ready for either energetic play sessions or cosy cuddles.'],
  },
  {
    name: 'Beau',
    haartId: 'HD26-030',
    species: 'dog',
    status: 'available',
    sex: 'male',
    medicalNote: 'anxiety; ongoing treatment plan',
    fragments: [
      "Beau is a sweet, affectionate little guy with a big heart, but he's also an anxious dog who needs a very understanding home.",
      "Because of his anxiety, he's looking for a special family who can give him the stability, patience, and routine he needs to feel safe, and someone who is home most of the time.",
      'When he feels secure, Beau is an incredibly loving and loyal companion who thrives on routine, mental stimulation, and having a "job" to do.',
      'His future family will need to be committed to continuing his treatment plan and supporting his anxiety, including medication and vet guidance if needed.',
    ],
  },
  {
    name: 'Troop',
    haartId: 'HD26-040',
    species: 'dog',
    status: 'available',
    sex: 'male',
    breed: 'Border Collie x Staffy',
    ageText: '10 weeks',
    fragments: [
      'Troop is a 10-week-old Border Collie x Staffy with a big heart and an even bigger love for cuddles.',
      "He's looking for a loyal little companion who always wants to be by your side.",
    ],
  },
  {
    name: 'Dawn',
    haartId: 'HD26-041',
    species: 'dog',
    status: 'available',
    sex: 'female',
    breed: 'Border Collie x Staffy',
    ageText: '10 weeks',
    fragments: ['Dawn is a 10-week-old Border Collie x Staffy with a confident and independent spirit who is a brave little girl.'],
  },
  {
    name: 'Poppy',
    haartId: 'HD26-042',
    species: 'dog',
    status: 'available',
    sex: 'female',
    breed: 'American Staffy x Border Collie',
    fragments: ['Poppy is an American Staffy x Border Collie mix and one of our Anzac puppies who is already stealing hearts wherever she goes.'],
  },
  {
    name: 'Rosemary',
    haartId: 'HD26-44',
    species: 'dog',
    status: 'available',
    sex: 'female',
    breed: 'American Staffy x Border Collie',
    fragments: [
      'Rosemary (known as Rosie) is believed to be an American Staffy x Border Collie mix expected to grow into a medium-large dog (around 25–30kg when fully grown).',
      'Sweet',
    ],
  },
  {
    name: 'Monty',
    haartId: 'HD26-045',
    species: 'dog',
    status: 'available',
    sex: 'male',
    breed: 'Border Collie x Staffy',
    fragments: ['Monty is a Border Collie x Staffy with a tender heart, featuring soulful puppy-dog eyes and a playful nature.'],
  },
  {
    name: 'Creed',
    haartId: 'HD26-050',
    species: 'dog',
    status: 'available',
    sex: 'male',
    breed: 'Mastiff x Ridgeback',
    weightKg: 35,
    ageText: '4 years',
    goodWith: { kids: true, cats: true, dogs: true },
    fragments: [
      'Creed is a big, lovable boy who is a Mastiff x Ridgeback weighing around 35kg.',
      "He's fantastic with kids, cats, and other dogs, making him a wonderfully well-rounded companion.",
      'Creed enjoys nice strolls followed by quality couch time and cuddles, and at approaching his 5th birthday, he has left his puppy antics behind and is ready to settle into a relaxed, loving home.',
    ],
  },
  {
    name: 'Arabella',
    haartId: 'HD26-051',
    species: 'dog',
    status: 'available',
    sex: 'female',
    breed: 'Kelpie x Shar Pei',
    ageText: '7 years',
    size: 'medium',
    fragments: [
      'Arabella is a 7-year-old medium-sized Kelpie x Shar Pei mix who enjoys her daily walks, loves chasing the ball and bringing it back, and enjoys trips to the beach where she can splash around in the water.',
      'She is a loving girl who enjoys cuddles, playtime, car rides, and settles well at home, coping great with full-time workers.',
    ],
  },
  {
    name: 'Indi',
    haartId: 'HD26 - 065',
    species: 'dog',
    status: 'available',
    breed: 'Border Collie',
    ageText: '10 years',
    fragments: ['Indi is a 10-year-old Border Collie who is ready for a quieter lifestyle after years helping keep an eye on youngsters.'],
  },
];

const CATS: Seed[] = [
  {
    name: 'Charlotte',
    haartId: 'HC20-011',
    species: 'cat',
    status: 'on_hold',
    breed: 'Domestic Medium Hair',
    fragments: ['Domestic Medium Hair', 'A Gentle Soul Looking for Patient Love'],
  },
  { name: 'Wayne', haartId: 'HC21-027', species: 'cat', status: 'unknown', fragments: [] },
  { name: 'Thing', haartId: 'HC25-020', species: 'cat', status: 'on_hold', fragments: ['one of our hand-raised Halloween kittens'] },
  {
    name: 'Nia',
    haartId: 'HC25-024',
    species: 'cat',
    status: 'on_hold',
    sex: 'female',
    ageText: '17 years',
    fragments: ['Nia is a 17 year old girl who has spent too long roughing it after being abandoned several times.'],
  },
  {
    name: 'Charlie',
    haartId: 'HC25-025',
    species: 'cat',
    status: 'available',
    goodWith: { cats: true },
    fragments: ['Cat social and learning to accept canine companions.'],
  },
  {
    name: 'Bosley',
    haartId: 'HC25-026',
    species: 'cat',
    status: 'available',
    sex: 'male',
    fragments: ['Despite his busy schedule of exploration, Bosley is not averse to a bit of affection. He enjoys a cuddle, though not for too long as he has plenty of adventures waiting for him.'],
  },
  {
    name: 'Sabrina',
    haartId: 'HC25-028',
    species: 'cat',
    status: 'available',
    sex: 'female',
    goodWith: { cats: true },
    fragments: ['Living comfortably in a multi-cat household.'],
  },
  {
    name: 'Evie',
    haartId: 'HC25-035',
    species: 'cat',
    status: 'available',
    sex: 'female',
    ageBand: 'kitten',
    fragments: ['Evie is a cheeky and inquisitive kitten with boundless energy who loves playtime.'],
  },
  { name: 'Farrah', haartId: 'HC25-040', species: 'cat', status: 'available', fragments: [] },
  {
    name: 'Alex',
    haartId: 'HC25-041',
    species: 'cat',
    status: 'available',
    sex: 'male',
    goodWith: { cats: true, dogs: true },
    fragments: ["He's very cat social and is currently living happily with a dog, so with a slow and considerate introduction, he could adapt well to a canine companion in his new home."],
  },
  {
    name: 'Tiffany',
    haartId: 'HC25-042',
    species: 'cat',
    status: 'available',
    sex: 'female',
    fragments: ["Tiffany is anything but shy; she's always ready to step forward and has fought her way through life with determination and resilience. Now, she's looking ahead with enthusiasm, ready for the next chapter."],
  },
  {
    name: 'John Wayne',
    haartId: 'HC26-002',
    species: 'cat',
    status: 'on_hold',
    breed: 'Domestic Short Hair',
    ageBand: 'kitten',
    fragments: ['Domestic Short Hair kitten', 'curious confident, brave, and ready to explore by your side', 'Calm, cuddly, and ready to slot right into family life.'],
  },
  {
    name: 'Grace Kelly',
    haartId: 'HC26-005',
    species: 'cat',
    status: 'on_hold',
    breed: 'Domestic Short Hair',
    ageBand: 'kitten',
    fragments: ['Domestic Short Hair kitten who is fluffy, adventurous, and leads the way, described as the ringleader of the group.'],
  },
  {
    name: 'Lucky',
    haartId: 'HC26-009',
    species: 'cat',
    status: 'available',
    ageBand: 'kitten',
    fragments: ['Lucky is a quiet and calm kitten who loves hanging out with people and enjoys cuddles and play.', "A tiny, curious kitten that's always up for exploring."],
  },
  {
    name: 'Jasper',
    haartId: 'HC26-010',
    species: 'cat',
    status: 'available',
    sex: 'male',
    ageBand: 'kitten',
    fragments: ['Jasper is a playful and adventurous kitten who loves chasing toys and climbing.', 'Currently living with his sister and loves a good romp and rumble, but would also be happy as a solo cat.'],
  },
];

// ---------------------------------------------------------------------------
// Building
// ---------------------------------------------------------------------------

export const PLACEHOLDER_COUNT = 6;
export const CAT_STANDARD_FEE = 200;

const triOf = (v: boolean | undefined): Tri => (v === undefined ? 'unknown' : v ? 'yes' : 'no');

/**
 * A plausible listing date from the ID alone: the year from the two digits,
 * the day of year from the sequence (three days per intake, capped at
 * 31 December). HD26-051 becomes 2026-06-02. Not a real date.
 */
export function listedAtFromHaartId(haartId: string): string | undefined {
  const m = /^H[DC](\d{2})-(\d{3})$/.exec(normaliseHaartId(haartId));
  if (!m) return undefined;
  const year = 2000 + Number(m[1]);
  const day = Math.min(Math.max(Number(m[2]), 1) * 3, 365);
  return new Date(Date.UTC(year, 0, day)).toISOString().slice(0, 10);
}

function placeholderPhotos(species: Species, name: string, index: number): ImageWithAlt[] {
  const count = 1 + (index % 3);
  return Array.from({ length: count }, (_, k) => {
    const n = ((index + k) % PLACEHOLDER_COUNT) + 1;
    return {
      _type: 'imageWithAlt' as const,
      url: `/placeholders/${species}-${n}.svg`,
      width: 1200,
      height: 900,
      alt: k === 0 ? `Placeholder image standing in for a photo of ${name}` : `Placeholder image standing in for another photo of ${name}`,
    };
  });
}

function build(seed: Seed, index: number): Animal {
  const haartId = normaliseHaartId(seed.haartId);
  const fee = seed.fee ?? (seed.species === 'cat' ? CAT_STANDARD_FEE : undefined);
  const text = seed.fragments.join('\n\n');
  const animal: Animal = {
    _type: 'animal',
    _id: `mock-${slugFor(seed.name, haartId)}`,
    name: seed.name,
    slug: slugFor(seed.name, haartId),
    haartId,
    species: seed.species,
    status: seed.status,
    fosterNeeded: seed.fosterNeeded ?? false,
    sex: seed.sex,
    breed: seed.breed,
    dateOfBirth: seed.dateOfBirth,
    ageText: seed.ageText,
    ageBand: seed.ageBand ?? (seed.ageText ? ageBandFrom(seed.ageText, seed.species) : undefined),
    size: seed.size,
    weightKg: seed.weightKg,
    goodWith: { kids: triOf(seed.goodWith?.kids), cats: triOf(seed.goodWith?.cats), dogs: triOf(seed.goodWith?.dogs) },
    fee,
    feeNote: fee === undefined ? 'Confirm with HAART' : undefined,
    desexed: seed.desexed,
    vaccinated: seed.vaccinated,
    medicalNote: seed.medicalNote,
    summary: seed.fragments[0] ? truncate(seed.fragments[0], 120) : undefined,
    description: text ? textToPortable(text) : [],
    photos: placeholderPhotos(seed.species, seed.name, index),
    listedAt: listedAtFromHaartId(haartId),
    source: 'mock',
  };
  for (const key of Object.keys(animal) as (keyof Animal)[]) {
    if (animal[key] === undefined) delete animal[key];
  }
  return animal;
}

export const MOCK_ANIMALS: Animal[] = [...DOGS.map(build), ...CATS.map(build)];
