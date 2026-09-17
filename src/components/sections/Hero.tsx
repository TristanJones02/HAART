import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { UiIcon } from '@/components/ui/Icon';
import type { SectionProps } from './SectionRenderer';

/**
 * Hero: photograph with a charcoal scrim, one heading, one lead, two buttons.
 * Red appears only on the primary button. The image is `priority` (LCP).
 */
export function Hero({ section }: SectionProps<'section.hero'>) {
  const { eyebrow, heading, lead, image, primaryCta, secondaryCta } = section;
  return (
    <section className="relative isolate overflow-hidden bg-charcoal-900 text-paper-0" aria-labelledby="hero-heading">
      {image ? <SmartImage image={image} aspect="absolute inset-0 h-full w-full" sizes="100vw" priority width={1600} className="!absolute" imgClassName="opacity-100" /> : null}
      <div className="absolute inset-0 bg-[var(--scrim-hero)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-charcoal-900/70 to-transparent" aria-hidden="true" />
      <div className="container-site relative flex min-h-[70vh] flex-col justify-end py-16 sm:min-h-[560px] sm:py-20">
        <div className="max-w-2xl">
          {eyebrow ? <p className="mb-3 text-tiny uppercase tracking-caps text-paper-0/85">{eyebrow}</p> : null}
          <h1 id="hero-heading" className="text-[2.5rem] leading-[1.15] font-black text-paper-0 sm:text-hero [text-shadow:0_1px_2px_rgba(0,0,0,.25)]">
            {heading}
          </h1>
          {lead ? <p className="mt-4 max-w-prose text-lead text-paper-0/95 [text-shadow:0_1px_2px_rgba(0,0,0,.3)]">{lead}</p> : null}
          {primaryCta || secondaryCta ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryCta ? (
                <Button href={primaryCta.href} size="lg" icon={<UiIcon name="ArrowRight" size={20} />}>
                  {primaryCta.label}
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button href={secondaryCta.href} size="lg" variant="secondary">
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
