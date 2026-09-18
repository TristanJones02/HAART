import { FolioBar, TearOff, sectionHeadClass } from '@/components/art';
import { Button } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

/**
 * An ink band with one bright thing on it. The lit-object rule says an
 * interactive surface on ink is paper-0, always, so the input is the brightest
 * element on the page and the eye has nowhere else to go.
 *
 * The field hands the address to the newsletter provider's own hosted page —
 * no third-party script runs on this site — and renders nothing at all until a
 * volunteer has set that URL in the Studio.
 */
export async function Newsletter({ section, canvas, topRule }: SectionProps<'section.newsletter'>) {
  const s = await getSiteSettings();
  const url = s.newsletter?.embedUrl;
  if (!url) return null;

  // Carry any query the provider already put on the URL, so adding the address
  // field does not quietly drop their list or campaign parameters.
  let action = url;
  const carried: { name: string; value: string }[] = [];
  try {
    const parsed = new URL(url);
    parsed.searchParams.forEach((value, name) => carried.push({ name, value }));
    parsed.search = '';
    action = parsed.toString();
  } catch {
    action = url;
  }

  const id = `s-${section._key}`;
  const heading = section.heading ?? 'Hear about news and events first';
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={id} className="relative mb-14">
      <Container>
        <FolioBar rubric="Keep in touch" />
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2 id={id} className={sectionHeadClass(heading)}>
              {heading}
            </h2>
            {section.text ? <p className="mt-5 max-w-[42ch] text-deck italic text-[color:var(--text-muted)]">{section.text}</p> : null}
          </div>
          <form action={action} method="get" className="lg:col-span-5 lg:col-start-8 lg:self-end">
            {carried.map((p) => (
              <input key={p.name} type="hidden" name={p.name} value={p.value} />
            ))}
            <label htmlFor={`${id}-email`} className="block text-rubric uppercase text-[color:var(--text-caption)]">
              Email address
            </label>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row">
              <input
                id={`${id}-email`}
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-13 min-w-0 flex-1 rounded-control border-2 border-charcoal-900 bg-paper-0 px-4 text-body text-charcoal-900 placeholder:text-charcoal-550"
              />
              <Button type="submit" size="lg" className="sm:flex-none">
                Sign up
              </Button>
            </div>
            <p className="mt-3 text-[0.8125rem] leading-[1.4] font-semibold italic text-[color:var(--text-caption)]">
              Sign-up finishes on our newsletter provider&rsquo;s page. Unsubscribe any time.
            </p>
          </form>
        </div>
      </Container>
      {/* The notice's torn tab erases itself against whatever is behind the strip.
          The strip hangs in the reserved margin below the band, so that is the
          page ground, not this section's canvas. */}
      <span className="[--canvas:var(--color-paper-0)]">
        <TearOff tabFill={canvas === 'ink' ? 'sand' : 'paper'} />
      </span>
    </Section>
  );
}
