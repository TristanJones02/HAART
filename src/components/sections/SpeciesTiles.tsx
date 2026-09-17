import Link from 'next/link';
import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Icon, UiIcon } from '@/components/ui/Icon';
import { HoverLift } from '@/components/motion/HoverLift';
import { listAnimals } from '@/lib/animals';
import type { SectionProps } from './SectionRenderer';

export async function SpeciesTiles({ section, surface }: SectionProps<'section.speciesTiles'>) {
  const [dogList, catList] = await Promise.all([listAnimals({ species: 'dog', status: 'adoptable' }), listAnimals({ species: 'cat', status: 'adoptable' })]);
  const dogs = dogList.length;
  const cats = catList.length;
  const id = `s-${section._key}`;
  const tiles = [
    { href: '/adopt/dogs', icon: 'dog' as const, title: 'Dogs', text: section.dogsText, count: dogs },
    { href: '/adopt/cats', icon: 'cat' as const, title: 'Cats', text: section.catsText, count: cats },
  ];
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} />
        <ul className="grid gap-4 sm:grid-cols-2">
          {tiles.map((t) => (
            <li key={t.href}>
              <HoverLift>
                <Link href={t.href} className="group flex h-full items-center gap-5 rounded-card border border-border bg-paper-0 p-6 shadow-card hover:shadow-card-hover">
                  <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-control bg-red-50 text-red-600">
                    <Icon name={t.icon} size={32} />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="text-h2">{t.title}</span>
                      {t.count > 0 ? <span className="text-small text-charcoal-550">{t.count} looking for a home</span> : null}
                    </span>
                    {t.text ? <span className="mt-1 block text-body text-charcoal-700">{t.text}</span> : null}
                  </span>
                  <UiIcon name="ArrowRight" size={24} className="text-red-600 transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </HoverLift>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
