import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/ui/Container';
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
      <Section surface="paper-50" className="border-b border-border">
        <Container>
          <p className="mb-2 text-tiny uppercase tracking-caps text-red-600">Stories</p>
          <h1 className="text-h1">{category.title}</h1>
          {category.description ? <p className="mt-3 max-w-prose text-lead text-charcoal-700">{category.description}</p> : null}
        </Container>
      </Section>
      <Section surface="paper-0">
        <Container>
          <ArticleFilters categories={categories} series={series} active={`category:${slug}`} />
          {articles.length ? (
            <Stagger as="ul" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a, i) => (
                <StaggerItem key={a.slug} as="li" className="h-full">
                  <ArticleCard article={a} priority={i < 3} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="text-lead">No stories in this category yet.</p>
          )}
        </Container>
      </Section>
    </>
  );
}
