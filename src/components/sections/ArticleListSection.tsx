import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArticleFilters } from '@/components/articles/ArticleFilters';
import { getArticles, getCategories, getAllSeries } from '@/lib/content/articles';
import type { SectionProps } from './SectionRenderer';

export async function ArticleListSection({ section, surface }: SectionProps<'section.articleList'>) {
  const [articles, categories, series] = await Promise.all([getArticles({ category: section.category, series: section.series, limit: section.limit ?? 12 }), getCategories(), getAllSeries()]);
  const id = `s-${section._key}`;
  const showFilters = !section.category && !section.series && (categories.length > 1 || series.length > 0);
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} />
        {showFilters ? <ArticleFilters categories={categories} series={series} /> : null}
        {articles.length ? (
          <Stagger as="ul" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <StaggerItem key={a.slug} as="li" className="h-full">
                <ArticleCard article={a} priority={i < 3} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="rounded-card border border-border bg-paper-0 p-8 text-center text-lead">No stories yet. They will appear here as they are published.</p>
        )}
      </Container>
    </Section>
  );
}
