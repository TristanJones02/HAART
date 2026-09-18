import Link from 'next/link';
import type { Article } from '@/lib/content/types';
import { SmartImage } from '@/components/ui/SmartImage';
import { OutlineNumeral, Plate, PlateFrame, editorialPlate, fnv1a } from '@/components/art';
import { HoverLift } from '@/components/motion/HoverLift';
import { resolveImageUrl } from '@/lib/sanity/image';
import { formatDate } from '@/lib/format';

type CardArticle = Pick<Article, 'title' | 'slug' | 'excerpt' | 'featuredImage' | 'publishedAt' | 'categories' | 'series' | 'seriesPart'>;

/** The gradient that lets a real photograph carry type. Verified at no worse than 9:1 for sand-100. */
export const STORY_SCRIM = 'linear-gradient(to top, #241f1d 0%, rgba(36,31,29,.85) 32%, transparent 72%)';

/**
 * The story card (§6.7): a numbered feature. A plate at 3/4 with the outline
 * folio numeral breaking the frame's top-left corner, then the category
 * rubric, the title and the excerpt.
 *
 * This is the one place on the site where type may sit over a photograph,
 * and only behind the scrim above.
 *
 * `index` is the position in the list; it sets the numeral and the plate's
 * colourway. Without it the card is unnumbered — a numeral has to come from
 * list order, never from content.
 */
export function ArticleCard({ article, index, priority = false }: { article: CardArticle; index?: number; priority?: boolean }) {
  const photo = resolveImageUrl(article.featuredImage, 800) ? article.featuredImage : undefined;
  const plate = editorialPlate(index ?? fnv1a(article.slug) % 4);
  const category = article.categories?.[0]?.title;
  const series = article.series ? `${article.series.title}${article.seriesPart ? `, part ${article.seriesPart}` : ''}` : null;

  return (
    <HoverLift>
      <article className="relative h-full">
        <Link href={`/stories/${article.slug}`} className="group flex h-full flex-col">
          <div className="relative">
            {index !== undefined ? <OutlineNumeral n={index + 1} className="absolute -left-3 -top-3 z-10 sm:-left-4 sm:-top-6" /> : null}
            <PlateFrame ratio="3/4">
              {photo ? (
                <>
                  <SmartImage image={photo} aspect="absolute inset-0" className="!absolute" sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw" priority={priority} width={800} vignette={false} />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: STORY_SCRIM }} />
                  <h3 className="absolute inset-x-0 bottom-0 p-5 text-feature text-sand-100">{article.title}</h3>
                </>
              ) : (
                <Plate name={plate.name} colourway={plate.colourway} />
              )}
            </PlateFrame>
          </div>

          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[color:var(--text-caption)]">
            {category ? <span className="text-rubric uppercase">{category}</span> : null}
            {series ? <span className="text-rubric uppercase">{series}</span> : null}
            <time className="text-catalogue" dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
          </p>

          {photo ? null : <h3 className="mt-2 text-feature">{article.title}</h3>}

          <p className="mt-3 line-clamp-3 flex-1 text-[0.9375rem] italic leading-relaxed text-[color:var(--text-muted)]">{article.excerpt}</p>

          <span aria-hidden="true" className="relative mt-4 inline-block self-start pb-1 font-display text-[1.125rem] font-extrabold leading-tight">
            Read the story
            <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-[0.35] bg-[color:var(--rule)] transition-transform duration-[180ms] ease-[var(--ease-standard)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
          </span>
        </Link>
      </article>
    </HoverLift>
  );
}
