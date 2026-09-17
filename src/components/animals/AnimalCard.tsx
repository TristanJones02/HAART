import Link from 'next/link';
import type { Animal } from '@/lib/content/types';
import { StatusBadge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { HoverLift } from '@/components/motion/HoverLift';
import { animalPath, animalFacts } from './helpers';

/**
 * Animal card: fixed 4:3 image so grids never shift, status unmistakable
 * at a glance, name and HAART ID, two or three facts, one-line summary.
 */
export function AnimalCard({ animal, priority = false }: { animal: Animal; priority?: boolean }) {
  const facts = animalFacts(animal).slice(0, 3);
  return (
    <HoverLift>
      <Link href={animalPath(animal)} className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-paper-0 shadow-card transition-shadow duration-150 hover:shadow-card-hover">
        <div className="relative">
          <SmartImage image={animal.photos[0]} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 100vw" priority={priority} width={600} fallbackLabel={`No photo of ${animal.name} yet`} />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {animal.status !== 'available' ? <StatusBadge status={animal.status} /> : null}
            {animal.fosterNeeded && animal.status !== 'adopted' ? <StatusBadge status="fosterNeeded" /> : null}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-h3 group-hover:text-red-600">
            {animal.name} <span className="ml-1 text-small font-normal text-charcoal-550">{animal.haartId}</span>
          </h3>
          {facts.length ? <p className="mt-1 text-small text-charcoal-550">{facts.join(' · ')}</p> : null}
          {animal.summary ? <p className="mt-2 line-clamp-2 flex-1 text-body text-charcoal-700">{animal.summary}</p> : null}
        </div>
      </Link>
    </HoverLift>
  );
}
