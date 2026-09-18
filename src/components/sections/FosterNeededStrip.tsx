import Link from 'next/link';
import { Container, Section } from '@/components/ui/Container';
import { FolioBar, Plate, PlateFrame, RuleLink, cardNameClass, plateFor, sectionHeadClass } from '@/components/art';
import { SmartImage } from '@/components/ui/SmartImage';
import { HoverLift } from '@/components/motion/HoverLift';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { animalPath, fosterCountLine, plateSubject } from '@/components/animals/helpers';
import { getFosterNeeded } from '@/lib/animals';
import type { Animal } from '@/lib/content/types';
import type { SectionProps } from './SectionRenderer';

/**
 * Dark, quiet and unmistakably urgent. The count is live, the plates are in
 * the night colourway, and the red is the canvas's own red — red-200 on ink,
 * red-600 wherever the adjacency guard has moved the block to a light canvas.
 * Renders nothing when no animal is flagged.
 */
export async function FosterNeededStrip({ section, canvas }: SectionProps<'section.fosterNeededStrip'>) {
  const waiting = await getFosterNeeded();
  if (!waiting.length) return null;
  const cards = waiting.slice(0, 4);
  const heading = section.heading ?? 'These animals need a foster carer';
  const id = `s-${section._key}`;

  return (
    <Section canvas={canvas} labelledBy={id}>
      <Container>
        <FolioBar rubric="Foster carers needed" />
        <div className="flex flex-col gap-4">
          <h2 id={id} className={`max-w-[18ch] ${sectionHeadClass(heading)}`}>
            {heading}
          </h2>
          <p className="text-[1.375rem] leading-snug text-[color:var(--rule)]">{fosterCountLine(waiting.length)}</p>
          {section.text ? <p className="max-w-[34ch] text-deck italic text-[color:var(--text-muted)]">{section.text}</p> : null}
        </div>
        <Stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {cards.map((a) => (
            <StaggerItem key={`${a.slug}-${a.haartId}`} as="li" className="h-full">
              <FosterCard animal={a} />
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-10">
          <RuleLink href="/foster">Become a foster carer</RuleLink>
        </p>
      </Container>
    </Section>
  );
}

/**
 * The strip's own card: a night plate, a 4px bar in the canvas's red and the
 * words "Needs a foster" in the catalogue row, so the colour is never doing
 * the work on its own.
 */
function FosterCard({ animal }: { animal: Animal }) {
  const plate = plateFor(plateSubject(animal));
  const photo = animal.photos?.[0];
  return (
    <HoverLift>
      <article className="group relative flex h-full flex-col border border-[color:var(--hairline)]">
        <span aria-hidden="true" className="block h-1 w-full flex-none bg-[color:var(--rule)]" />
        <PlateFrame ratio="4/3" catalogue={animal.haartId} edges="none">
          <SmartImage
            image={photo}
            aspect="size-full"
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
            width={600}
            vignette={Boolean(photo)}
            placeholder={<Plate name={plate.name} colourway="night" />}
          />
        </PlateFrame>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-index-label uppercase text-[color:var(--rule)]">Needs a foster</span>
            <span className="flex-none text-catalogue text-[color:var(--text-caption)]">{animal.haartId}</span>
          </div>
          <h3 className={`mt-2 ${cardNameClass(animal.name)}`}>
            <Link href={animalPath(animal)} className="after:absolute after:inset-0 after:content-['']">
              <span className="relative inline-block pb-[3px] after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-[color:var(--rule)] after:transition-transform after:duration-[180ms] after:ease-standard group-hover:after:scale-x-100 group-focus-within:after:scale-x-100">
                {animal.name}
              </span>
            </Link>
          </h3>
        </div>
      </article>
    </HoverLift>
  );
}
