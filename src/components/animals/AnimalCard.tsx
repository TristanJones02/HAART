import Link from 'next/link';
import type { Animal } from '@/lib/content/types';
import { StatusBar, StatusLabel } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { HoverLift } from '@/components/motion/HoverLift';
import { IndexList, Plate, PlateFrame, cardNameClass, plateFor } from '@/components/art';
import { animalPath, cardFacts, plateCaption, plateSubject, statusKey } from './helpers';

/**
 * Not a rounded white box with a drop shadow: an entry in a register.
 *
 * A status bar across the top edge, the plate flush to the card's edges with
 * its catalogue number in the corner, then the honest caption, the status
 * word and the HAART ID, the name, two fact rows and the summary. No name
 * ever sits over the plate, which is why there is no scrim anywhere and no
 * contrast guessing.
 */
export function AnimalCard({ animal, priority = false, sizes = '(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw' }: { animal: Animal; priority?: boolean; sizes?: string }) {
  const status = statusKey(animal);
  const adopted = animal.status === 'adopted';
  const plate = plateFor(plateSubject(animal));
  const photo = animal.photos?.[0];

  return (
    <HoverLift>
      <article className="group relative flex h-full flex-col border border-charcoal-900 bg-paper-0 text-charcoal-900">
        <StatusBar status={status} />
        <div className="border-b border-charcoal-900">
          <PlateFrame ratio="4/3" catalogue={animal.haartId} edges="none">
            <SmartImage
              image={photo}
              aspect="size-full"
              sizes={sizes}
              priority={priority}
              width={600}
              vignette={Boolean(photo)}
              placeholder={<Plate name={plate.name} colourway={plate.colourway} />}
            />
            {adopted ? <AdoptedBand /> : null}
          </PlateFrame>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-note italic text-terracotta-600">{plateCaption(animal)}</p>
          <div className="mt-3 flex items-baseline justify-between gap-3">
            <StatusLabel status={status} />
            <span className="flex-none text-catalogue text-terracotta-600">{animal.haartId}</span>
          </div>
          {/* Only the name is the link, so its accessible name is the animal's; the overlay makes the whole card clickable. */}
          <h3 className={`mt-2 ${cardNameClass(animal.name)}`}>
            <Link href={animalPath(animal)} className="after:absolute after:inset-0 after:content-['']">
              <span className="relative inline-block pb-[3px] after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-red-600 after:transition-transform after:duration-[180ms] after:ease-standard group-hover:after:scale-x-100 group-focus-within:after:scale-x-100">
                {animal.name}
              </span>
            </Link>
          </h3>
          <IndexList rows={cardFacts(animal)} dense className="mt-3" />
          {/* The stretch lives on the wrapper: a flex-stretched -webkit-box shows the lines its clamp meant to hide. */}
          <div className="mt-3 flex-1">
            {animal.summary ? <p className="line-clamp-2 text-[0.875rem] italic leading-normal text-charcoal-700">{animal.summary}</p> : null}
          </div>
        </div>
      </article>
    </HoverLift>
  );
}

/**
 * An adopted animal keeps its page and its dignity: the plate drops to the
 * ink colourway and takes a sand band, which is the one place a word sits
 * over a plate — on its own opaque fill, at 8.64:1.
 */
function AdoptedBand() {
  return (
    <span className="absolute inset-x-0 bottom-0 flex h-1/3 flex-col items-center justify-center gap-2 bg-sand-300">
      <span className="font-display text-[1.125rem] font-extrabold leading-none text-charcoal-900">Adopted</span>
      <span aria-hidden="true" className="block h-[3px] w-12 bg-green-600" />
    </span>
  );
}
