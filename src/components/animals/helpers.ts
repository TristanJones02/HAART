import type { Animal } from '@/lib/content/types';

export const animalPath = (a: Pick<Animal, 'species' | 'slug'>) => `/adopt/${a.species === 'dog' ? 'dogs' : 'cats'}/${a.slug}`;

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

/** Short facts for cards and the profile header: age, sex, breed, size. */
export function animalFacts(a: Animal): string[] {
  const out: string[] = [];
  const age = ageLabel(a);
  if (age) out.push(age);
  if (a.sex) out.push(a.sex === 'male' ? 'Male' : 'Female');
  if (a.breed) out.push(a.breed);
  if (a.size) out.push(a.size.charAt(0).toUpperCase() + a.size.slice(1).replace('-', ' '));
  return out;
}

export const triLabel = (v: 'yes' | 'no' | 'unknown') => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Ask us');

export function feeLabel(a: Animal, catStandard?: number): string | null {
  if (typeof a.fee === 'number') return `$${a.fee}`;
  if (a.species === 'cat' && catStandard) return `$${catStandard}`;
  return null;
}
