import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import { SmartImage } from '@/components/ui/SmartImage';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { FolioBar, Plate, PlateFrame, RuleLink, editorialPlate, mastheadClass, sectionHeadClass } from '@/components/art';
import { MastheadRise, RiseItem } from '@/components/motion/MastheadRise';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { getArticle, getArticles } from '@/lib/content/articles';
import type { Article } from '@/lib/content/types';
import { getAnimal } from '@/lib/animals';
import { buildMetadata, siteUrl } from '@/lib/seo/metadata';
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { resolveImageUrl } from '@/lib/sanity/image';
import { formatDate } from '@/lib/format';

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getArticles({ limit: 200 });
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<'/stories/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const a = await getArticle(slug);
  if (!a) return {};
  return buildMetadata({ title: a.title, description: a.excerpt, path: `/stories/${slug}`, seo: a.seo, imageUrl: resolveImageUrl(a.featuredImage, 1200, 1200 / 630), type: 'article', publishedTime: a.publishedAt, modifiedTime: a.updatedAt });
}

export default async function ArticlePage(props: PageProps<'/stories/[slug]'>) {
  const { slug } = await props.params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const category = article.categories?.[0];
  const [related, seriesParts, animals] = await Promise.all([
    article.related?.length ? Promise.resolve(article.related) : getArticles({ category: category?.slug, limit: 3, exclude: article.slug }),
    article.series ? getArticles({ series: article.series.slug, limit: 50 }) : Promise.resolve([]),
    Promise.all((article.relatedAnimals ?? []).map((a) => getAnimal(a.slug))),
  ]);
  const ordered = [...seriesParts].sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0));
  const idx = ordered.findIndex((p) => p.slug === article.slug);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;
  const url = `${siteUrl}/stories/${slug}`;
  const warning = article.contentWarning?.enabled ? article.contentWarning.text : null;
  const photo = resolveImageUrl(article.featuredImage, 1600) ? article.featuredImage : undefined;
  const plate = editorialPlate(0);

  return (
    <article>
      {/* The cover: rubric, masthead, and the excerpt set as the pull quote. */}
      <Section canvas="cream" labelledBy="story-title">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 text-small text-[color:var(--text-muted)]">
            <Link href="/stories" className="underline decoration-[color:var(--hairline)] underline-offset-4 hover:decoration-[color:var(--rule)]">
              Stories
            </Link>
            {category ? (
              <>
                <span aria-hidden="true"> / </span>
                <Link href={`/stories/category/${category.slug}`} className="underline decoration-[color:var(--hairline)] underline-offset-4 hover:decoration-[color:var(--rule)]">
                  {category.title}
                </Link>
              </>
            ) : null}
          </nav>

          <MastheadRise className="max-w-[24ch] lg:max-w-none">
            <RiseItem>
              <FolioBar rubric={category?.title ?? 'Rescue stories'} />
            </RiseItem>
            <RiseItem>
              <h1 id="story-title" className={mastheadClass(article.title)}>
                {article.title}
              </h1>
            </RiseItem>
          </MastheadRise>

          <div className="mt-10 max-w-[34ch] lg:max-w-[46ch]">
            <span aria-hidden="true" className="block h-[3px] w-24 bg-[color:var(--rule)]" />
            <p className="mt-5 font-display text-[clamp(1.5rem,3.2vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em]">{article.excerpt}</p>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-rubric uppercase text-[color:var(--text-caption)]">
              {article.author ? <span>{article.author.name}</span> : null}
              {article.series ? (
                <Link href={`/stories/series/${article.series.slug}`} className="underline decoration-[color:var(--hairline)] underline-offset-4 hover:decoration-[color:var(--rule)]">
                  {article.series.title}
                  {article.seriesPart ? `, part ${article.seriesPart}` : ''}
                </Link>
              ) : null}
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </p>
          </div>

          {warning ? (
            <aside className="mt-10 max-w-[62ch] border-l-4 border-red-600 bg-red-50 p-4 text-body text-charcoal-900" role="note">
              <p className="font-semibold">Content warning</p>
              <p className="mt-1">{warning}</p>
            </aside>
          ) : null}
        </Container>
      </Section>

      <Section canvas="paper">
        <Container>
          <PlateFrame ratio="16/7" caption={photo ? undefined : 'Illustration — a photograph for this story is coming.'}>
            {photo ? (
              <SmartImage image={photo} aspect="absolute inset-0" className="!absolute" sizes="(min-width: 1140px) 1092px, 100vw" priority width={1600} />
            ) : (
              <Plate name={plate.name} colourway={plate.colourway} />
            )}
          </PlateFrame>

          <Prose value={article.body} className="mt-12 max-w-[62ch]" />

          {prev || next ? (
            <nav aria-label="Series" className="mt-14 flex max-w-[62ch] flex-col gap-5 border-y border-[color:var(--hairline)] py-6 sm:flex-row sm:justify-between">
              {prev ? (
                <RuleLink href={`/stories/${prev.slug}`}>
                  <span className="block text-rubric uppercase text-[color:var(--text-caption)]">Previous</span>
                  Part {prev.seriesPart}: {prev.title}
                </RuleLink>
              ) : (
                <span />
              )}
              {next ? (
                <RuleLink href={`/stories/${next.slug}`}>
                  <span className="block text-rubric uppercase text-[color:var(--text-caption)]">Next</span>
                  Part {next.seriesPart}: {next.title}
                </RuleLink>
              ) : null}
            </nav>
          ) : null}

          <div className="mt-12">
            <ShareButtons url={url} title={article.title} />
          </div>
        </Container>
      </Section>

      {animals.filter(Boolean).length ? (
        <Section canvas="sand" labelledBy="story-animals">
          <Container>
            <FolioBar rubric="On the register" />
            <h2 id="story-animals" className={`mb-10 ${sectionHeadClass('Animals in this story')}`}>
              Animals in this story
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {animals
                .filter((a): a is NonNullable<typeof a> => !!a)
                .map((a) => (
                  <li key={a.slug} className="h-full">
                    <AnimalCard animal={a} />
                  </li>
                ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {related.length ? (
        <Section canvas="cream" labelledBy="story-related">
          <Container>
            <FolioBar rubric="Rescue stories" />
            <h2 id="story-related" className={`mb-10 ${sectionHeadClass('More stories')}`}>
              More stories
            </h2>
            <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((r, i) => (
                <li key={r.slug} className="h-full">
                  <ArticleCard article={{ ...r, categories: (r as Partial<Article>).categories ?? [] }} index={i} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Stories', path: '/stories' }, { name: article.title, path: `/stories/${slug}` }])} />
    </article>
  );
}
