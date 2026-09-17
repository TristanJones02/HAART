'use client';

import { AnimatePresence, LayoutGroup, LazyMotion, m, useReducedMotion } from 'motion/react';
import { useMemo, useState } from 'react';
import type { Animal, Species } from '@/lib/content/types';
import { applyFilters, sortAnimals } from '@/lib/animals/types';
import { AnimalCard } from './AnimalCard';

type Filters = { ageBand: string; size: string; goodWithKids: boolean; goodWithCats: boolean; goodWithDogs: boolean; fosterNeeded: boolean; includeAdopted: boolean; sort: 'newest' | 'name' | 'age' };

// Layout animations need Motion's larger feature set; loaded only on listing pages.
const loadMax = () => import('motion/react').then((mod) => mod.domMax);

const initial: Filters = { ageBand: '', size: '', goodWithKids: false, goodWithCats: false, goodWithDogs: false, fosterNeeded: false, includeAdopted: false, sort: 'newest' };

/**
 * Listing with filters. Filtering happens client-side on the already-loaded
 * list (a rescue lists dozens, not thousands). Layout animation is transform
 * only and disabled under reduced motion. The count is announced politely.
 */
export function AnimalGrid({ animals, species }: { animals: Animal[]; species: Species }) {
  const reduce = useReducedMotion();
  const [f, setF] = useState<Filters>(initial);
  const list = useMemo(
    () =>
      sortAnimals(
        applyFilters(animals, {
          species,
          ageBand: f.ageBand || undefined,
          size: f.size || undefined,
          goodWithKids: f.goodWithKids || undefined,
          goodWithCats: f.goodWithCats || undefined,
          goodWithDogs: f.goodWithDogs || undefined,
          fosterNeeded: f.fosterNeeded || undefined,
          includeAdopted: f.includeAdopted,
        }),
        f.sort,
      ),
    [animals, species, f],
  );
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setF((prev) => ({ ...prev, [key]: value }));
  const chip = (active: boolean) => `inline-flex h-10 items-center rounded-pill border px-3.5 text-small font-semibold transition-colors duration-150 ${active ? 'border-red-600 bg-red-50 text-red-700' : 'border-border bg-paper-0 text-charcoal-700 hover:border-charcoal-700'}`;
  const ageOptions = species === 'dog' ? [['puppy', 'Puppy'], ['young', 'Young'], ['adult', 'Adult'], ['senior', 'Senior']] : [['kitten', 'Kitten'], ['young', 'Young'], ['adult', 'Adult'], ['senior', 'Senior']];

  return (
    <div>
      <form className="mb-6 flex flex-col gap-4 rounded-card border border-border bg-paper-0 p-4 sm:p-5" onSubmit={(e) => e.preventDefault()} aria-label="Filter animals">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-small font-semibold text-charcoal-700">Good with</span>
          <button type="button" className={chip(f.goodWithKids)} aria-pressed={f.goodWithKids} onClick={() => set('goodWithKids', !f.goodWithKids)}>
            Children
          </button>
          <button type="button" className={chip(f.goodWithCats)} aria-pressed={f.goodWithCats} onClick={() => set('goodWithCats', !f.goodWithCats)}>
            Cats
          </button>
          <button type="button" className={chip(f.goodWithDogs)} aria-pressed={f.goodWithDogs} onClick={() => set('goodWithDogs', !f.goodWithDogs)}>
            Dogs
          </button>
          <span className="mx-2 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
          <button type="button" className={chip(f.fosterNeeded)} aria-pressed={f.fosterNeeded} onClick={() => set('fosterNeeded', !f.fosterNeeded)}>
            Needs a foster
          </button>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-small font-semibold text-charcoal-700">
            Age
            <select className="h-11 min-w-36 rounded-control border border-border bg-paper-0 px-3 text-body font-normal text-charcoal-900" value={f.ageBand} onChange={(e) => set('ageBand', e.target.value)}>
              <option value="">Any age</option>
              {ageOptions.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          {species === 'dog' ? (
            <label className="flex flex-col gap-1 text-small font-semibold text-charcoal-700">
              Size
              <select className="h-11 min-w-36 rounded-control border border-border bg-paper-0 px-3 text-body font-normal text-charcoal-900" value={f.size} onChange={(e) => set('size', e.target.value)}>
                <option value="">Any size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra large</option>
              </select>
            </label>
          ) : null}
          <label className="flex flex-col gap-1 text-small font-semibold text-charcoal-700">
            Sort by
            <select className="h-11 min-w-36 rounded-control border border-border bg-paper-0 px-3 text-body font-normal text-charcoal-900" value={f.sort} onChange={(e) => set('sort', e.target.value as Filters['sort'])}>
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="age">Age</option>
            </select>
          </label>
          <label className="flex h-11 items-center gap-2 text-small font-semibold text-charcoal-700">
            <input type="checkbox" className="size-5 accent-red-600" checked={f.includeAdopted} onChange={(e) => set('includeAdopted', e.target.checked)} />
            Show adopted
          </label>
          {JSON.stringify(f) !== JSON.stringify(initial) ? (
            <button type="button" className="h-11 rounded-control px-3 text-small font-semibold text-red-600 underline-offset-4 hover:underline" onClick={() => setF(initial)}>
              Clear filters
            </button>
          ) : null}
        </div>
      </form>

      <p className="mb-4 text-small text-charcoal-550" aria-live="polite">
        {list.length === 0 ? 'No animals match those filters.' : `${list.length} ${species === 'dog' ? 'dog' : 'cat'}${list.length === 1 ? '' : 's'}`}
      </p>

      <LazyMotion features={loadMax}>
      <LayoutGroup>
        <m.ul layout={!reduce} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence initial={false}>
            {list.map((a, i) => (
              <m.li key={a.slug} layout={reduce ? false : 'position'} initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }} className="h-full">
                <AnimalCard animal={a} priority={i < 4} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      </LayoutGroup>
      </LazyMotion>
    </div>
  );
}
