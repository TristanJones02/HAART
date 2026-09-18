import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/ui/Container';
import { FolioBar } from '@/components/art';
import { mastheadClass } from '@/components/art/headingStep';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArticleFilters } from '@/components/articles/ArticleFilters';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { getArticles, getCategories, getCategory, getAllSeries } from '@/lib/content/articles';
import { buildMetadata } from '@/lib/seo/metadata';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<'/stories/category/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const c = await getCategory(slug);
  return c ? buildMetadata({ title: `${c.title}: stories`, description: c.description, path: `/stories/category/${slug}` }) : {};
}

export default async function CategoryPage(props: PageProps<'/stories/category/[slug]'>) {
  const { slug } = await props.params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const [articles, categories, series] = await Promise.all([getArticles({ category: slug, limit: 50 }), getCategories(), getAllSeries()]);
  return (
    <>
      <Section canvas="ink">
        <Container>
          <FolioBar rubric="Stories" right={`${articles.length} ${articles.length === 1 ? 'story' : 'stories'}`} />
          <h1 className={mastheadClass(category.title)}>{category.title}</h1>
          {category.description ? <p className="mt-6 max-w-[34ch] text-deck italic text-[color:var(--text-muted)]">{category.description}</p> : null}
        </Container>
      </Section>
      <Section canvas="paper">
        <Container>
          <ArticleFilters categories={categories} series={series} active={`category:${slug}`} />
          {articles.length ? (
            <Stagger as="ul" className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a, i) => (
                <StaggerItem key={a.slug} as="li" className="h-full">
                  <ArticleCard article={a} index={i} priority={i < 3} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="text-deck italic text-[color:var(--text-muted)]">No stories in this category yet.</p>
          )}
        </Container>
      </Section>
    </>
  );
}
