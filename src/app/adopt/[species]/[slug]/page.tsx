import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Prose } from '@/components/ui/Prose';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { UiIcon } from '@/components/ui/Icon';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { PhotoGallery } from '@/components/animals/PhotoGallery';
import { animalFacts, feeLabel, triLabel } from '@/components/animals/helpers';
import { getAnimal, getRelatedAnimals, listAnimals } from '@/lib/animals';
import { getSiteSettings } from '@/lib/content/settings';
import { buildMetadata, siteUrl } from '@/lib/seo/metadata';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { resolveImageUrl } from '@/lib/sanity/image';
import { portableToText } from '@/lib/sanity/portable';
import { EnquiryTracker } from '@/components/animals/EnquiryTracker';

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

export default async function AnimalPage(props: PageProps<'/adopt/[species]/[slug]'>) {
  const { species, slug } = await props.params;
  const animal = await getAnimal(slug);
  if (!animal || (animal.species === 'dog' ? 'dogs' : 'cats') !== species) notFound();
  const [related, settings] = await Promise.all([getRelatedAnimals(animal, 4), getSiteSettings()]);
  const facts = animalFacts(animal);
  const fee = feeLabel(animal, settings.fees.catStandard);
  const listingPath = `/adopt/${species}`;
  const applyPath = `/adopt/apply/${species}?animal=${encodeURIComponent(animal.slug)}`;
  const adopted = animal.status === 'adopted';
  const url = `${siteUrl}/adopt/${species}/${slug}`;

  const goodWith: { label: string; value: string; note?: string }[] = [
    { label: 'Children', value: triLabel(animal.goodWith.kids), note: animal.goodWith.kidsAgeNote },
    { label: 'Cats', value: triLabel(animal.goodWith.cats) },
    { label: 'Other dogs', value: triLabel(animal.goodWith.dogs) },
  ];

  return (
    <>
      <EnquiryTracker animal={animal.haartId} />
      <Section surface="paper-50" className="border-b border-border">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-6 text-small text-charcoal-550">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/adopt" className="hover:text-red-600">
                  Adopt
                </Link>
                <span aria-hidden="true"> / </span>
              </li>
              <li>
                <Link href={listingPath} className="hover:text-red-600">
                  {species === 'dogs' ? 'Dogs' : 'Cats'}
                </Link>
                <span aria-hidden="true"> / </span>
              </li>
              <li aria-current="page">{animal.name}</li>
            </ol>
          </nav>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <PhotoGallery photos={animal.photos} name={animal.name} />
            <div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={animal.status} />
                {animal.fosterNeeded && !adopted ? <StatusBadge status="fosterNeeded" /> : null}
              </div>
              <h1 className="mt-4 text-h1">
                {animal.name} <span className="block text-lead font-normal text-charcoal-550 sm:inline">{animal.haartId}</span>
              </h1>
              {facts.length ? <p className="mt-2 text-lead text-charcoal-700">{facts.join(' · ')}</p> : null}
              {animal.summary ? <p className="mt-4 text-body text-charcoal-700">{animal.summary}</p> : null}

              <dl className="mt-6 grid grid-cols-3 gap-3">
                {goodWith.map((g) => (
                  <div key={g.label} className="rounded-card border border-border bg-paper-0 p-3">
                    <dt className="text-tiny uppercase tracking-caps text-charcoal-550">{g.label}</dt>
                    <dd className="mt-1 font-display text-lead font-bold">
                      {g.value}
                      {g.note ? <span className="block text-small font-normal text-charcoal-550">{g.note}</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 rounded-card border border-border bg-paper-0 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-small font-semibold text-charcoal-700">Adoption fee</span>
                  <span className="font-display text-h2 text-red-600">{fee ?? 'Ask us'}</span>
                </div>
                <p className="mt-1 text-small text-charcoal-550">{animal.feeNote ?? settings.fees.inclusions}</p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-small text-charcoal-700">
                  {animal.desexed ? <li className="inline-flex items-center gap-1"><UiIcon name="Check" size={16} className="text-green-600" /> Desexed</li> : null}
                  {animal.vaccinated ? <li className="inline-flex items-center gap-1"><UiIcon name="Check" size={16} className="text-green-600" /> Vaccinated</li> : null}
                  {animal.microchipped ? <li className="inline-flex items-center gap-1"><UiIcon name="Check" size={16} className="text-green-600" /> Microchipped</li> : null}
                </ul>
                <div className="mt-5 flex flex-col gap-3">
                  {adopted ? (
                    <>
                      <p className="text-body font-semibold">{animal.name} has been adopted.</p>
                      <Button href={listingPath} variant="secondary">
                        See who is still waiting
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button href={applyPath} size="lg" icon={<UiIcon name="ArrowRight" size={20} />}>
                        Apply to adopt {animal.name}
                      </Button>
                      {animal.fosterNeeded ? (
                        <Button href={`/foster/apply/${species}?animal=${encodeURIComponent(animal.slug)}`} variant="secondary" size="lg">
                          Foster {animal.name}
                        </Button>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
              {animal.petrescueUrl ? (
                <p className="mt-3 text-small text-charcoal-550">
                  Also listed on{' '}
                  <a href={animal.petrescueUrl} className="underline underline-offset-4 hover:text-red-600" rel="noopener noreferrer" target="_blank">
                    PetRescue
                  </a>
                  .
                </p>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      <Section surface="paper-0">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-h2">About {animal.name}</h2>
            <Prose value={animal.description} className="mt-4 text-lead [&>p]:mb-5" />
            {animal.medicalNote ? (
              <aside className="mt-6 rounded-card border border-border bg-paper-100 p-4">
                <h3 className="text-h3">Medical and behaviour note</h3>
                <p className="mt-1 text-body text-charcoal-700">{animal.medicalNote}</p>
              </aside>
            ) : null}
            {animal.story ? (
              <p className="mt-6">
                <Link href={`/stories/${animal.story.slug}`} className="font-semibold text-red-600 underline-offset-4 hover:underline">
                  Read {animal.name}&apos;s story: {animal.story.title}
                </Link>
              </p>
            ) : null}
          </div>
          <aside className="space-y-6">
            <div className="rounded-card border border-border bg-paper-50 p-5">
              <h2 className="text-h3">Share {animal.name}</h2>
              <p className="mt-1 text-body text-charcoal-700">Most of our animals find their home through someone sharing them.</p>
              <div className="mt-4">
                <ShareButtons url={url} title={`${animal.name} is looking for a home through HAART`} />
              </div>
            </div>
            <div className="rounded-card border border-border bg-paper-50 p-5">
              <h2 className="text-h3">How adoption works</h2>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-body text-charcoal-700">
                <li>Fill in the questionnaire.</li>
                <li>We call you within seven days.</li>
                <li>Meet and greet with the foster carer, and a home check.</li>
                <li>Adoption day.</li>
              </ol>
              <Link href="/adopt" className="mt-3 inline-block text-small font-semibold text-red-600 underline-offset-4 hover:underline">
                Fees and questions
              </Link>
            </div>
          </aside>
        </Container>
      </Section>

      {related.length ? (
        <Section surface="paper-50">
          <Container>
            <SectionHeading heading={`More ${species} looking for a home`} />
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((a) => (
                <StaggerItem key={a.slug} as="li" className="h-full">
                  <AnimalCard animal={a} />
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}
      <JsonLd data={breadcrumbJsonLd([{ name: 'Adopt', path: '/adopt' }, { name: species === 'dogs' ? 'Dogs' : 'Cats', path: listingPath }, { name: animal.name, path: `/adopt/${species}/${slug}` }])} />
    </>
  );
}
