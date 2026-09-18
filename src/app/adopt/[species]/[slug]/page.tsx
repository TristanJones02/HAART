import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/ui/Container';
import { StatusChip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Prose } from '@/components/ui/Prose';
import { FolioBar, IndexList, Plate, Quad, RuleLink, TearOff, plateFor } from '@/components/art';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { PhotoGallery } from '@/components/animals/PhotoGallery';
import { animalFacts, feeLabel, plateCaption, plateSubject, profileFacts, statusKey } from '@/components/animals/helpers';
import { getAnimal, getRelatedAnimals, listAnimals } from '@/lib/animals';
import { getSiteSettings } from '@/lib/content/settings';
import { buildMetadata, siteUrl } from '@/lib/seo/metadata';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { resolveImageUrl } from '@/lib/sanity/image';
import { portableToText, textToPortable } from '@/lib/sanity/portable';
import { EnquiryTracker } from '@/components/animals/EnquiryTracker';
import type { PortableTextBlock } from '@/lib/content/types';

export const revalidate = 300;

export async function generateStaticParams() {
  const animals = await listAnimals({});
  return animals.map((a) => ({ species: a.species === 'dog' ? 'dogs' : 'cats', slug: a.slug }));
}

export async function generateMetadata(props: PageProps<'/adopt/[species]/[slug]'>): Promise<Metadata> {
  const { species, slug } = await props.params;
  const animal = await getAnimal(slug);
  if (!animal) return {};
  const desc = animal.summary ?? portableToText(animal.description).slice(0, 155);
  return buildMetadata({
    title: `${animal.name} ${animal.haartId}: ${animal.species === 'dog' ? 'dog' : 'cat'} for adoption in Perth`,
    description: desc,
    path: `/adopt/${species}/${slug}`,
    imageUrl: resolveImageUrl(animal.photos[0], 1200, 1200 / 630),
  });
}

/** Names step down rather than overflow; nothing on this site truncates a heading. */
function nameClass(name: string): string {
  if (name.length > 20) return 'text-masthead-3';
  if (name.length > 12) return 'text-masthead-2';
  return 'text-masthead';
}

const normalise = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

export default async function AnimalPage(props: PageProps<'/adopt/[species]/[slug]'>) {
  const { species, slug } = await props.params;
  const animal = await getAnimal(slug);
  if (!animal || (animal.species === 'dog' ? 'dogs' : 'cats') !== species) notFound();
  const [related, settings] = await Promise.all([getRelatedAnimals(animal, 4), getSiteSettings()]);

  const deck = animalFacts(animal).join(' · ');
  const fee = feeLabel(animal, settings.fees.catStandard);
  const listingPath = `/adopt/${species}`;
  const applyPath = `/adopt/apply/${species}?animal=${encodeURIComponent(animal.slug)}`;
  const adopted = animal.status === 'adopted';
  const url = `${siteUrl}/adopt/${species}/${slug}`;
  const plate = plateFor(plateSubject(animal));

  const blocks: PortableTextBlock[] = typeof animal.description === 'string' ? textToPortable(animal.description) : (animal.description ?? []);
  const bodyText = portableToText(blocks);
  const summary = animal.summary?.trim();
  // The summary is the pull quote — unless a volunteer has used it as the
  // write-up's opening line, in which case quoting it would just stutter.
  const quote = summary && summary.length > 20 && !normalise(bodyText).startsWith(normalise(summary).slice(0, 40)) ? summary : null;
  const head = quote && blocks.length > 2 ? blocks.slice(0, 2) : blocks;
  const tail = quote && blocks.length > 2 ? blocks.slice(2) : [];

  return (
    <>
      <EnquiryTracker animal={animal.haartId} />

      <Section canvas="paper">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-6 text-[0.8125rem] text-charcoal-700">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/adopt">Adopt</Link>
                <span aria-hidden="true"> / </span>
              </li>
              <li>
                <Link href={listingPath}>{species === 'dogs' ? 'Dogs' : 'Cats'}</Link>
                <span aria-hidden="true"> / </span>
              </li>
              <li aria-current="page">{animal.name}</li>
            </ol>
          </nav>

          <PhotoGallery
            photos={animal.photos}
            name={animal.name}
            caption={plateCaption(animal)}
            catalogue={animal.haartId}
            placeholder={<Plate name={plate.name} colourway={plate.colourway} />}
            chip={<StatusChip status={statusKey(animal)} />}
          />

          {/* The name never sits on the band: no scrim, no text-shadow, no contrast guessing. */}
          <h1 className={`mt-10 ${nameClass(animal.name)}`}>{animal.name}</h1>
          {deck ? <p className="mt-4 max-w-[34ch] text-deck italic text-charcoal-700">{deck}</p> : null}

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
            <aside className="lg:sticky lg:top-24 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-start">
              <h2 className="sr-only">{animal.name}&apos;s record</h2>
              <IndexList rows={profileFacts(animal, fee)} dense />
              <p className="mt-3 text-small text-charcoal-700">{animal.feeNote ?? settings.fees.inclusions}</p>

              {adopted ? (
                <div className="mt-8">
                  <p className="font-display text-feature">{animal.name} has been adopted.</p>
                  <p className="mt-4">
                    <RuleLink href={listingPath}>See who is still waiting</RuleLink>
                  </p>
                </div>
              ) : (
                <div className="relative mt-8 mb-14">
                  <Button href={applyPath} size="lg" className="w-full">
                    Apply to adopt {animal.name}
                  </Button>
                  {animal.fosterNeeded ? (
                    <p className="mt-4">
                      <RuleLink href={`/foster/apply/${species}?animal=${encodeURIComponent(animal.slug)}`}>Foster {animal.name}</RuleLink>
                    </p>
                  ) : null}
                  <TearOff tabFill="paper" />
                </div>
              )}

              <div className="mt-8 border-t border-[color:var(--hairline)] pt-6">
                <p className="flex items-center gap-2 text-rubric uppercase text-[color:var(--rubric)]">
                  <Quad />
                  Share {animal.name}
                </p>
                <p className="mt-3 text-small text-charcoal-700">Most of our animals find their home through someone sharing them.</p>
                <div className="mt-4 flex flex-col items-start gap-3">
                  <RuleLink href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} external>
                    Share on Facebook
                  </RuleLink>
                  <a className="rule-link" href={`mailto:?subject=${encodeURIComponent(`${animal.name} is looking for a home`)}&body=${encodeURIComponent(url)}`}>
                    Share by email
                  </a>
                </div>
              </div>

              {animal.petrescueUrl ? (
                <p className="mt-6 text-small text-charcoal-700">
                  Also listed on{' '}
                  <a href={animal.petrescueUrl} className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">
                    PetRescue
                  </a>
                  .
                </p>
              ) : null}
            </aside>

            <div className="lg:col-span-7 lg:row-start-1">
              <h2 className="sr-only">About {animal.name}</h2>
              {blocks.length ? <Prose value={head} /> : <p className="text-body text-charcoal-700">We are still writing {animal.name}&apos;s full story. Ask us anything in the meantime.</p>}
              {quote ? (
                <figure className="my-10 max-w-[62ch]">
                  <span aria-hidden="true" className="mb-5 block h-[3px] w-24 bg-red-600" />
                  <blockquote className="font-display text-[clamp(1.5rem,3.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">{quote}</blockquote>
                  <figcaption className="mt-4 flex items-center gap-2 text-rubric uppercase text-[color:var(--rubric)]">
                    <Quad />
                    {animal.name} · {animal.haartId}
                  </figcaption>
                </figure>
              ) : null}
              {tail.length ? <Prose value={tail} className="[&>p:first-child]:border-l-0 [&>p:first-child]:pl-0 [&>p:first-child]:text-body" /> : null}

              {animal.medicalNote ? (
                <aside className="mt-10 max-w-[62ch] border-l-4 border-red-600 bg-paper-0 py-1 pl-5">
                  <p className="flex items-center gap-2 text-rubric uppercase text-[color:var(--rubric)]">
                    <Quad />
                    Medical and behaviour note
                  </p>
                  <p className="mt-2 text-body">{animal.medicalNote}</p>
                </aside>
              ) : null}

              {animal.story ? (
                <p className="mt-10">
                  <RuleLink href={`/stories/${animal.story.slug}`}>
                    Read {animal.name}&apos;s story: {animal.story.title}
                  </RuleLink>
                </p>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      {related.length ? (
        <Section canvas="sand" labelledBy="more-animals">
          <Container>
            <FolioBar rubric={`More ${species} looking for a home`} />
            <h2 id="more-animals" className="sr-only">
              More {species} looking for a home
            </h2>
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {related.map((a) => (
                <StaggerItem key={`${a.slug}-${a.haartId}`} as="li" className="h-full">
                  <AnimalCard animal={a} />
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-10">
              <RuleLink href={listingPath}>See every {species === 'dogs' ? 'dog' : 'cat'} on the register</RuleLink>
            </p>
          </Container>
        </Section>
      ) : null}

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Adopt', path: '/adopt' },
          { name: species === 'dogs' ? 'Dogs' : 'Cats', path: listingPath },
          { name: animal.name, path: `/adopt/${species}/${slug}` },
        ])}
      />
    </>
  );
}
