import { Container, Section } from '@/components/ui/Container';
import { FolioBar, sectionHeadClass } from '@/components/art';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArticleFilters } from '@/components/articles/ArticleFilters';
import { getArticles, getCategories, getAllSeries } from '@/lib/content/articles';
import type { SectionProps } from './SectionRenderer';

/**
 * Folio bar, square filter chips, then the numbered story cards three up.
 * The bar carries no numeral: the cards are the numbered index here, and the
 * ornament quota allows one or the other, never both in a column.
 */
export async function ArticleListSection({ section, canvas, topRule }: SectionProps<'section.articleList'>) {
  const [articles, categories, series] = await Promise.all([getArticles({ category: section.category, series: section.series, limit: section.limit ?? 12 }), getCategories(), getAllSeries()]);
  const id = `s-${section._key}`;
  const showFilters = !section.category && !section.series && (categories.length > 1 || series.length > 0);
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={id}>
      <Container>
        <FolioBar rubric="Rescue stories" />
        {section.heading ? (
          <h2 id={id} className={`mb-10 ${sectionHeadClass(section.heading)}`}>
            {section.heading}
          </h2>
        ) : (
          // Without an editor heading the cards' h3s would follow the page h1
          // directly, so the section still names itself for screen readers.
          <h2 id={id} className="sr-only">
            Rescue stories
          </h2>
        )}
        {showFilters ? <ArticleFilters categories={categories} series={series} /> : null}
        {articles.length ? (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <li key={a.slug} className="h-full">
                <ArticleCard article={a} index={i} priority={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-t border-[color:var(--hairline)] py-8 text-feature font-display">No stories yet. They will appear here as they are published.</p>
        )}
      </Container>
    </Section>
  );
}
