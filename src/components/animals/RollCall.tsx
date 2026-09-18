import Link from 'next/link';
import type { Animal } from '@/lib/content/types';
import { FolioBar, Quad, RuleLink } from '@/components/art';
import { sortAnimals } from '@/lib/animals/types';
import { animalPath, fosterCountLine, plural } from './helpers';

/** Eighteen names is a full band at 52px; past that it stops being a run and becomes a list. */
const CAP = 18;

/**
 * Foster-needed first, then newest listed. Both orders come from the record.
 * Everything but an adopted animal is on the register, which is exactly what
 * the grid below shows by default — the two counts can never disagree.
 */
function onTheRegister(animals: Animal[]): Animal[] {
  const listed = animals.filter((a) => a.status !== 'adopted');
  const newest = sortAnimals(listed, 'newest');
  return [...newest.filter((a) => a.fosterNeeded), ...newest.filter((a) => !a.fosterNeeded)];
}

/**
 * The roll call: every animal on the register right now, their real names at
 * poster scale, the ones who need a foster carer in red. Generated from the
 * animal list, so no volunteer ever touches it and it cannot go stale.
 *
 * It opens the home page's animal grid and the dog and cat listings, and
 * nowhere else.
 */
export function RollCall({ animals, moreHref = '/adopt', className = '' }: { animals: Animal[]; moreHref?: string; className?: string }) {
  const register = onTheRegister(animals);
  if (register.length === 0) return null;

  const total = register.length;
  const shown = register.slice(0, CAP);
  const remaining = total - shown.length;
  const fosterNeeded = register.filter((a) => a.fosterNeeded).length;
  // Two to four names are a run, not a tally: the count on the right would be
  // counting to four in front of the reader.
  const showCount = total >= 5;

  return (
    <div className={className}>
      <FolioBar
        rubric="On the register right now"
        right={showCount ? `${total} ${plural(total, 'animal', 'animals')}` : undefined}
      />
      {total === 1 ? <OneAnimal animal={register[0]} /> : <Run animals={shown} remaining={remaining} moreHref={moreHref} />}
      <p className={`mt-6 text-deck italic ${fosterNeeded > 0 ? 'text-[color:var(--rule)]' : 'text-[color:var(--text-muted)]'}`}>{fosterCountLine(fosterNeeded)}</p>
    </div>
  );
}

/** One animal on the register reads as a sentence, never as a lonely word. */
function OneAnimal({ animal }: { animal: Animal }) {
  return (
    <p className="max-w-[24ch] text-feature font-display">
      Right now there is one {animal.species === 'dog' ? 'dog' : 'cat'} on the register:{' '}
      <Name animal={animal} />.
    </p>
  );
}

function Run({ animals, remaining, moreHref }: { animals: Animal[]; remaining: number; moreHref: string }) {
  return (
    <ul className="flex flex-wrap items-center gap-y-2 font-display text-rollcall" aria-label="Animals on the register">
      {animals.map((a, i) => (
        <li key={`${a.slug}-${a.haartId}`} className="flex items-center">
          {i > 0 ? <Separator /> : null}
          <Name animal={a} />
        </li>
      ))}
      {remaining > 0 ? (
        <li className="flex items-center">
          <Separator />
          <RuleLink href={moreHref}>+ {remaining} more</RuleLink>
        </li>
      ) : null}
    </ul>
  );
}

function Separator() {
  return <span aria-hidden="true" className="mx-[0.4em] h-[0.7em] w-px flex-none bg-[color:var(--hairline)]" />;
}

/**
 * A name, at a 44px hit height. Foster-needed names carry the printer's quad
 * and the words as well as the colour, so the red is never the only carrier.
 */
function Name({ animal }: { animal: Animal }) {
  const foster = animal.fosterNeeded;
  return (
    <Link
      href={animalPath(animal)}
      className={`group/name inline-flex min-h-11 items-center gap-[0.25em] py-1 [overflow-wrap:anywhere] ${foster ? 'text-[color:var(--rule)]' : 'text-[color:var(--text-strong)]'}`}
    >
      {foster ? <Quad /> : null}
      <span className="relative inline-block pb-[3px] after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-[color:var(--rule)] after:transition-transform after:duration-[180ms] after:ease-standard group-hover/name:after:scale-x-100 group-focus-visible/name:after:scale-x-100">
        {animal.name}
      </span>
      {foster ? <span className="sr-only">, needs a foster carer</span> : null}
    </Link>
  );
}

/** Exported for the sections that need the same count without rendering the band. */
export function registerCount(animals: Animal[]): { total: number; fosterNeeded: number } {
  const register = onTheRegister(animals);
  return { total: register.length, fosterNeeded: register.filter((a) => a.fosterNeeded).length };
}
