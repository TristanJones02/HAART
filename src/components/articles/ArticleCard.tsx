import Link from 'next/link';
import type { Article } from '@/lib/content/types';
import { SmartImage } from '@/components/ui/SmartImage';
import { LabelBadge } from '@/components/ui/Badge';
import { HoverLift } from '@/components/motion/HoverLift';
import { formatDate } from '@/lib/format';

export function ArticleCard({ article, priority = false }: { article: Pick<Article, 'title' | 'slug' | 'excerpt' | 'featuredImage' | 'publishedAt' | 'categories' | 'series' | 'seriesPart'>; priority?: boolean }) {
  return (
    <HoverLift>
      <Link href={`/stories/${article.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-paper-0 shadow-card transition-shadow duration-150 hover:shadow-card-hover">
        <SmartImage image={article.featuredImage} aspect="aspect-[3/2]" sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw" priority={priority} width={800} />
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-wrap gap-2">
            {article.categories?.slice(0, 1).map((c) => (
              <LabelBadge key={c.slug}>{c.title}</LabelBadge>
            ))}
            {article.series ? <LabelBadge>{article.series.title}{article.seriesPart ? `, part ${article.seriesPart}` : ''}</LabelBadge> : null}
          </div>
          <h3 className="mt-3 text-h3 group-hover:text-red-600">{article.title}</h3>
          <p className="mt-2 line-clamp-3 flex-1 text-body text-charcoal-700">{article.excerpt}</p>
          <p className="mt-3 text-small text-charcoal-550">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </p>
        </div>
      </Link>
    </HoverLift>
  );
}
