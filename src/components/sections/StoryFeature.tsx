import Link from 'next/link';
import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { Button } from '@/components/ui/Button';
import { LabelBadge } from '@/components/ui/Badge';
import { Reveal } from '@/components/motion/Reveal';
import { getArticles } from '@/lib/content/articles';
import { formatDate } from '@/lib/format';
import type { SectionProps } from './SectionRenderer';

/** One story, full width. Falls back to the latest story; renders nothing if there are none. */
export async function StoryFeature({ section, surface }: SectionProps<'section.storyFeature'>) {
  const article = section.article ?? (await getArticles({ limit: 1 }))[0];
  if (!article) return null;
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={id}>
      <Container>
        <SectionHeading id={id} heading={section.heading} lead={section.text} />
        <Reveal className="grid gap-6 overflow-hidden rounded-card border border-border bg-paper-0 shadow-card lg:grid-cols-2">
          <SmartImage image={article.featuredImage} aspect="aspect-[3/2] lg:aspect-auto lg:min-h-[360px]" sizes="(min-width: 1024px) 570px, 100vw" width={1200} />
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              {article.categories?.slice(0, 1).map((c) => (
                <LabelBadge key={c.slug}>{c.title}</LabelBadge>
              ))}
            </div>
            <h3 className="mt-3 text-h2">
              <Link href={`/stories/${article.slug}`} className="hover:text-red-600">
                {article.title}
              </Link>
            </h3>
            <p className="mt-3 text-lead text-charcoal-700">{article.excerpt}</p>
            <p className="mt-3 text-small text-charcoal-550">{formatDate(article.publishedAt)}</p>
            <div className="mt-6">
              <Button href={`/stories/${article.slug}`} variant="secondary">
                Read the story
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
