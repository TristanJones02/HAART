import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

/** Links to the newsletter provider's hosted page; no third-party script on the site. Renders nothing until a URL is set. */
export async function Newsletter({ section, surface }: SectionProps<'section.newsletter'>) {
  const s = await getSiteSettings();
  const url = s.newsletter?.embedUrl;
  if (!url) return null;
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} tight labelledBy={id}>
      <Container className="flex flex-col items-start justify-between gap-4 rounded-card border border-border bg-paper-0 p-6 shadow-card sm:flex-row sm:items-center">
        <div>
          <h2 id={id} className="text-h3">
            {section.heading ?? 'Sign up to be the first to hear about news and events'}
          </h2>
          {section.text ? <p className="mt-1 text-body text-charcoal-700">{section.text}</p> : null}
        </div>
        <Button href={url} variant="secondary">
          Sign up
        </Button>
      </Container>
    </Section>
  );
}
