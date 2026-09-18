import Link from 'next/link';
import type { Category, Series } from '@/lib/content/types';

/**
 * Square hairline chips. Plain links, so category and series pages stay
 * crawlable and shareable, and `aria-current` carries the selected state so
 * the red-free fill is never the only signal.
 */
export function ArticleFilters({ categories, series, active }: { categories: Category[]; series: Series[]; active?: string }) {
  const chip = (isActive: boolean) =>
    `inline-flex h-10 items-center border px-4 text-small font-semibold transition-colors duration-150 ${
      isActive ? 'border-charcoal-900 bg-charcoal-900 text-paper-0' : 'border-[color:var(--hairline)] text-[color:var(--text-strong)] hover:border-charcoal-900'
    }`;
  return (
    <nav aria-label="Story categories" className="mb-10 flex flex-wrap gap-2">
      <Link href="/stories" className={chip(!active)} aria-current={!active ? 'page' : undefined}>
        All stories
      </Link>
      {categories.map((c) => (
        <Link key={c.slug} href={`/stories/category/${c.slug}`} className={chip(active === `category:${c.slug}`)} aria-current={active === `category:${c.slug}` ? 'page' : undefined}>
          {c.title}
        </Link>
      ))}
      {series.map((s) => (
        <Link key={s.slug} href={`/stories/series/${s.slug}`} className={chip(active === `series:${s.slug}`)} aria-current={active === `series:${s.slug}` ? 'page' : undefined}>
          Series: {s.title}
        </Link>
      ))}
    </nav>
  );
}
