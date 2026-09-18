import { CatHead } from './plates/CatHead';
import { CatLoaf } from './plates/CatLoaf';
import { CatPair } from './plates/CatPair';
import { CatSit } from './plates/CatSit';
import { DogHeadBroad } from './plates/DogHeadBroad';
import { DogHeadFine } from './plates/DogHeadFine';
import { DogPair } from './plates/DogPair';
import { DogSit } from './plates/DogSit';

export type PlateName =
  | 'dog-head-broad'
  | 'dog-head-fine'
  | 'dog-sit'
  | 'dog-pair'
  | 'cat-loaf'
  | 'cat-head'
  | 'cat-sit'
  | 'cat-pair';

/**
 * Colourways. `--plate-on` is a verified >=4.5:1 colour for the rare case
 * where type must sit on a plate.
 */
export type Colourway = 'ember' | 'ink' | 'sand' | 'night' | 'signal';

const COLOURWAYS: Record<Colourway, { ground: string; ink: string; tint: string; on: string }> = {
  ember: { ground: '#fdf0ef', ink: '#b50806', tint: '#f9dcda', on: '#3d3d3d' },
  ink: { ground: '#f4f0ec', ink: '#3d3d3d', tint: '#b3b0ae', on: '#3d3d3d' },
  sand: { ground: '#f3e3cf', ink: '#8f3a22', tint: '#e7d3b6', on: '#3d3d3d' },
  night: { ground: '#241f1d', ink: '#f3e3cf', tint: '#8f3a22', on: '#f3e3cf' },
  signal: { ground: '#b50806', ink: '#fdf0ef', tint: '#8f0605', on: '#ffffff' },
};

const PLATES: Record<PlateName, (p: { className?: string }) => React.ReactElement> = {
  'dog-head-broad': DogHeadBroad,
  'dog-head-fine': DogHeadFine,
  'dog-sit': DogSit,
  'dog-pair': DogPair,
  'cat-loaf': CatLoaf,
  'cat-head': CatHead,
  'cat-sit': CatSit,
  'cat-pair': CatPair,
};

export function Plate({ name, colourway = 'ink', className = '' }: { name: PlateName; colourway?: Colourway; className?: string }) {
  const c = COLOURWAYS[colourway] ?? COLOURWAYS.ink;
  const Drawing = PLATES[name] ?? PLATES['dog-sit'];
  return (
    <span
      className={`block size-full ${className}`}
      style={
        {
          '--plate-ground': c.ground,
          '--plate-ink': c.ink,
          '--plate-tint': c.tint,
          '--plate-on': c.on,
        } as React.CSSProperties
      }
    >
      <Drawing className="size-full" />
    </span>
  );
}

/** Stable 32-bit hash so a given animal always gets the same colourway. */
export function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const AUTO_COLOURWAYS: Colourway[] = ['ember', 'ink', 'sand', 'night'];

type PlateSubject = {
  species: 'dog' | 'cat';
  sizeBand?: string | null;
  ageBand?: string | null;
  haartId: string;
  status?: string;
};

/**
 * The drawing comes from the record so a chihuahua and a mastiff never share
 * one; the colourway comes from the ID so the grid stays varied. Adopted
 * animals are forced to `ink`: they keep their page and stop being red.
 * `signal` is never auto-assigned — it is passed explicitly, twice on the
 * whole site.
 */
export function plateFor(a: PlateSubject): { name: PlateName; colourway: Colourway } {
  const size = (a.sizeBand ?? '').toLowerCase();
  const age = (a.ageBand ?? '').toLowerCase();
  let name: PlateName;
  if (a.species === 'dog') {
    if (age === 'puppy' || !size) name = 'dog-sit';
    else if (size === 'large' || size === 'extra-large') name = 'dog-head-broad';
    else name = 'dog-head-fine';
  } else {
    if (age === 'kitten') name = 'cat-sit';
    else if (size === 'large' || !size) name = 'cat-loaf';
    else name = 'cat-head';
  }
  const colourway: Colourway = a.status === 'adopted' ? 'ink' : AUTO_COLOURWAYS[(fnv1a(a.haartId) >>> 3) % AUTO_COLOURWAYS.length];
  return { name, colourway };
}

/** Editorial slots pick a pair plate by position, never from content. */
export function editorialPlate(index: number): { name: PlateName; colourway: Colourway } {
  return {
    name: index % 2 === 0 ? 'dog-pair' : 'cat-pair',
    colourway: AUTO_COLOURWAYS[index % AUTO_COLOURWAYS.length],
  };
}
