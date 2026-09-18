import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/ui/Container';
import { FolioBar } from '@/components/art';
import { mastheadClass } from '@/components/art/headingStep';
import { SmartImage } from '@/components/ui/SmartImage';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArticleFilters } from '@/components/articles/ArticleFilters';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { getArticles, getCategories, getSeries, getAllSeries } from '@/lib/content/articles';
import { buildMetadata } from '@/lib/seo/metadata';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getAllSeries()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<'/stories/series/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const s = await getSeries(slug);
  return s ? buildMetadata({ title: s.title, description: s.description, path: `/stories/series/${slug}` }) : {};
}

export default async function SeriesPage(props: PageProps<'/stories/series/[slug]'>) {
  const { slug } = await props.params;
  const series = await getSeries(slug);
  if (!series) notFound();
  const [articles, categories, allSeries] = await Promise.all([getArticles({ series: slug, limit: 50 }), getCategories(), getAllSeries()]);
  const ordered = [...articles].sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0));
  return (
    <>
      <Section canvas="ink">
        <Container className={series.image ? 'grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center' : ''}>
          <div>
            <FolioBar rubric="Series" right={`${ordered.length} ${ordered.length === 1 ? "part" : "parts"}`} />
            
            <h1 className={mastheadClass(series.title)}>{series.title}</h1>
            {series.description ? <p className="mt-6 max-w-[34ch] text-deck italic text-[color:var(--text-muted)]">{series.description}</p> : null}
            <p className="mt-4 text-small text-[color:var(--text-muted)]">
              {ordered.length} part{ordered.length === 1 ? '' : 's'}
            </p>
          </div>
          {series.image ? <SmartImage image={series.image} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 480px, 100vw" className="rounded-card" /> : null}
        </Container>
      </Section>
      <Section canvas="paper">
        <Container>
          <ArticleFilters categories={categories} series={allSeries} active={`series:${slug}`} />
          <Stagger as="ol" className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {ordered.map((a, i) => (
              <StaggerItem key={a.slug} as="li" className="h-full">
                <ArticleCard article={a} index={i} priority={i < 3} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
    </>
  );
}
