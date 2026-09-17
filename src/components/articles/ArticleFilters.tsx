import Link from 'next/link';
import type { Category, Series } from '@/lib/content/types';

/** Plain links, so category and series pages are crawlable and shareable. */
export function ArticleFilters({ categories, series, active }: { categories: Category[]; series: Series[]; active?: string }) {
  const chip = (isActive: boolean) => `inline-flex h-10 items-center rounded-pill border px-3.5 text-small font-semibold ${isActive ? 'border-red-600 bg-red-50 text-red-700' : 'border-border bg-paper-0 text-charcoal-700 hover:border-charcoal-700'}`;
  return (
    <nav aria-label="Story categories" className="mb-8 flex flex-wrap gap-2">
      <Link href="/stories" className={chip(!active)}>
        All stories
      </Link>
      {categories.map((c) => (
        <Link key={c.slug} href={`/stories/category/${c.slug}`} className={chip(active === `category:${c.slug}`)}>
          {c.title}
        </Link>
      ))}
      {series.map((s) => (
        <Link key={s.slug} href={`/stories/series/${s.slug}`} className={chip(active === `series:${s.slug}`)}>
          Series: {s.title}
        </Link>
      ))}
    </nav>
  );
}
