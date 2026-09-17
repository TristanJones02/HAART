import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { LabelBadge } from '@/components/ui/Badge';
import { Prose } from '@/components/ui/Prose';
import { SmartImage } from '@/components/ui/SmartImage';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { UiIcon } from '@/components/ui/Icon';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
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

  return (
    <article>
      <Section surface="paper-50" className="border-b border-border">
        <Container className="max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-small text-charcoal-550">
            <Link href="/stories" className="hover:text-red-600">
              Stories
            </Link>
            {category ? (
              <>
                <span aria-hidden="true"> / </span>
                <Link href={`/stories/category/${category.slug}`} className="hover:text-red-600">
                  {category.title}
                </Link>
              </>
            ) : null}
          </nav>
          <div className="flex flex-wrap gap-2">
            {article.categories?.map((c) => (
              <LabelBadge key={c.slug}>{c.title}</LabelBadge>
            ))}
            {article.series ? (
              <Link href={`/stories/series/${article.series.slug}`}>
                <LabelBadge>
                  {article.series.title}
                  {article.seriesPart ? `, part ${article.seriesPart}` : ''}
                </LabelBadge>
              </Link>
            ) : null}
          </div>
          <h1 className="mt-4 text-h1">{article.title}</h1>
          <p className="mt-4 text-lead text-charcoal-700">{article.excerpt}</p>
          <p className="mt-4 text-small text-charcoal-550">
            {article.author ? `${article.author.name} · ` : ''}
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </p>
          {warning ? (
            <aside className="mt-6 rounded-card border border-red-100 bg-red-50 p-4 text-body text-charcoal-900" role="note">
              <p className="font-semibold">Content warning</p>
              <p className="mt-1">{warning}</p>
            </aside>
          ) : null}
        </Container>
      </Section>
      <Section surface="paper-0">
        <Container className="max-w-3xl">
          <SmartImage image={article.featuredImage} aspect="aspect-[3/2]" sizes="(min-width: 768px) 768px, 100vw" priority width={1600} className="rounded-card" />
          <Prose value={article.body} className="mt-8 text-lead [&>p]:mb-5" />
          {prev || next ? (
            <nav aria-label="Series" className="mt-10 flex flex-col gap-3 rounded-card border border-border bg-paper-50 p-4 sm:flex-row sm:justify-between">
              {prev ? (
                <Link href={`/stories/${prev.slug}`} className="inline-flex items-center gap-2 font-semibold hover:text-red-600">
                  <UiIcon name="ArrowRight" size={18} className="rotate-180" />
                  Part {prev.seriesPart}: {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/stories/${next.slug}`} className="inline-flex items-center gap-2 font-semibold hover:text-red-600">
                  Part {next.seriesPart}: {next.title}
                  <UiIcon name="ArrowRight" size={18} />
                </Link>
              ) : null}
            </nav>
          ) : null}
          <div className="mt-10">
            <ShareButtons url={url} title={article.title} />
          </div>
        </Container>
      </Section>
      {animals.filter(Boolean).length ? (
        <Section surface="paper-50">
          <Container>
            <SectionHeading heading="Animals in this story" />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {animals.filter((a): a is NonNullable<typeof a> => !!a).map((a) => (
                <li key={a.slug} className="h-full">
                  <AnimalCard animal={a} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
      {related.length ? (
        <Section surface="paper-100">
          <Container>
            <SectionHeading heading="More stories" />
            <Stagger as="ul" className="grid gap-4 md:grid-cols-3">
              {related.slice(0, 3).map((r) => (
                <StaggerItem key={r.slug} as="li" className="h-full">
                  <ArticleCard article={{ ...r, categories: (r as Partial<Article>).categories ?? [] }} />
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Stories', path: '/stories' }, { name: article.title, path: `/stories/${slug}` }])} />
    </article>
  );
}
