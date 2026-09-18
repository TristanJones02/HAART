import { Container, Section } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { FolioBar, OutlineNumeral, Plate, PlateFrame, RuleLink, editorialPlate, sectionHeadClass } from '@/components/art';
import { getArticles } from '@/lib/content/articles';
import { resolveImageUrl } from '@/lib/sanity/image';
import { formatDate } from '@/lib/format';
import type { SectionProps } from './SectionRenderer';

/**
 * The story card at double width: plate in columns 1-6 with the folio numeral
 * breaking its corner, words in 8-12. Falls back to the latest story; renders
 * nothing if there are none.
 *
 * The title stays in the text column rather than over the picture. The card's
 * gradient exists so a 3/4 photo can carry a headline when there is nowhere
 * else for it to go; here there is a whole column waiting.
 */
export async function StoryFeature({ section, canvas, topRule }: SectionProps<'section.storyFeature'>) {
  const article = section.article ?? (await getArticles({ limit: 1 }))[0];
  if (!article) return null;
  const id = `s-${section._key}`;
  const photo = resolveImageUrl(article.featuredImage, 1200) ? article.featuredImage : undefined;
  const plate = editorialPlate(0);
  const category = article.categories?.[0]?.title;

  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="Rescue stories" />
        {section.heading ? (
          <h2 id={id} className={sectionHeadClass(section.heading)}>
            {section.heading}
          </h2>
        ) : null}
        {section.text ? <p className="mt-4 max-w-[34ch] text-deck italic text-[color:var(--text-muted)]">{section.text}</p> : null}

        <div className="mt-10 grid gap-x-8 gap-y-8 lg:grid-cols-12 lg:items-center">
          <div className="relative lg:col-span-6">
            <OutlineNumeral n={1} className="absolute -left-3 -top-3 z-10 sm:-left-4 sm:-top-6" />
            <PlateFrame ratio="3/4">
              {photo ? (
                <SmartImage image={photo} aspect="absolute inset-0" className="!absolute" sizes="(min-width: 1024px) 540px, 100vw" width={1200} />
              ) : (
                <Plate name={plate.name} colourway={plate.colourway} />
              )}
            </PlateFrame>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[color:var(--text-caption)]">
              {category ? <span className="text-rubric uppercase">{category}</span> : null}
              <time className="text-catalogue" dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
            </p>
            <h3 className="mt-3 text-feature">{article.title}</h3>
            <p className="mt-4 text-deck italic text-[color:var(--text-muted)]">{article.excerpt}</p>
            <p className="mt-6">
              <RuleLink href={`/stories/${article.slug}`}>
                Read the story<span className="sr-only">: {article.title}</span>
              </RuleLink>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
