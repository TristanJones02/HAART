import type { CSSProperties } from 'react';
import { DashRule, Plate, PlateFrame, Quad, RuleLink, mastheadClass } from '@/components/art';
import { MastheadRise, RiseItem } from '@/components/motion/MastheadRise';
import { PlateReveal } from '@/components/motion/PlateReveal';
import { RuleDraw } from '@/components/motion/RuleDraw';
import { Button } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import type { SectionProps } from './SectionRenderer';

/**
 * The cover. A typographic masthead on the left and a red-ground plate running
 * off the right edge of the viewport — no photograph, no scrim, no viewport
 * units, and zero image requests at any breakpoint, so the LCP is the heading
 * itself and the CLS is zero.
 *
 * The editor's eyebrow and image fields are deliberately not rendered: the
 * rubric is fixed site copy and the hero slot's art is the plate until a real
 * photograph exists to drop into the same frame.
 */

/** Computed-free site facts, set as a ruled line under the ornament. */
const FACTS: { value: string; label: string; valueFirst: boolean }[] = [
  { value: '100%', label: 'volunteer run', valueFirst: true },
  { value: '$0', label: 'government funding', valueFirst: true },
  { value: '2012', label: 'rescuing since', valueFirst: false },
];

/** From the container's right content edge out past the viewport edge. */
const BLEED = { '--hero-bleed': 'calc(max(0px, (100vw - var(--container-site)) / 2) + 1.5rem + 5rem)' } as CSSProperties;

export function Hero({ section, canvas, topRule }: SectionProps<'section.hero'>) {
  const { heading, lead, primaryCta, secondaryCta } = section;
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy="hero-heading" className="overflow-x-clip">
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14" style={BLEED}>
          <MastheadRise>
            <RiseItem className="flex items-center gap-3">
              <Quad />
              <p className="text-rubric uppercase text-[color:var(--text-caption)]">Perth · foster-based · no-kill</p>
              <span aria-hidden="true" className="h-px flex-1 bg-[color:var(--hairline)]" />
            </RiseItem>

            <RiseItem className="mt-10">
              <RuleDraw className="block h-1 w-8 bg-[color:var(--rule)] sm:w-10" />
            </RiseItem>

            <RiseItem className="mt-5">
              <h1 id="hero-heading" className={`${mastheadClass(heading)} text-[color:var(--text-strong)]`}>
                {heading}
              </h1>
            </RiseItem>

            {lead ? (
              <RiseItem className="mt-7">
                <p className="max-w-[34ch] text-deck italic text-[color:var(--text-muted)]">{lead}</p>
              </RiseItem>
            ) : null}

            {primaryCta || secondaryCta ? (
              <RiseItem className="mt-10 flex flex-wrap items-center gap-6 sm:gap-8">
                {primaryCta ? (
                  <Button href={primaryCta.href} size="lg" className="w-full sm:w-auto">
                    {primaryCta.label}
                    <span aria-hidden="true"> →</span>
                  </Button>
                ) : null}
                {secondaryCta ? <RuleLink href={secondaryCta.href}>{secondaryCta.label}</RuleLink> : null}
              </RiseItem>
            ) : null}

            <RiseItem className="mt-12">
              {/* Full bleed on a phone, column width once there is a margin to sit in. */}
              <div className="bleed-rule sm:ml-0 sm:w-full sm:max-w-none">
                <DashRule />
              </div>
            </RiseItem>

            <RiseItem className="mt-6">
              <ul className="flex flex-col border-t border-[color:var(--hairline)] sm:flex-row sm:border-t-0">
                {FACTS.map((f, i) => (
                  <li
                    key={f.label}
                    className={`flex items-baseline justify-between gap-3 border-b border-[color:var(--hairline)] py-3 sm:border-b-0 sm:py-0 ${
                      i > 0 ? 'sm:border-l sm:pl-6' : ''
                    } ${i < FACTS.length - 1 ? 'sm:pr-6' : ''}`}
                  >
                    <span className={`text-[0.8125rem] leading-[1.5] font-semibold text-[color:var(--text-muted)] ${f.valueFirst ? 'sm:order-2' : ''}`}>
                      {f.label}
                    </span>
                    <span className={`font-display text-[1.125rem] leading-none font-extrabold text-[color:var(--rule)] ${f.valueFirst ? 'sm:order-1' : ''}`}>
                      {f.value}
                    </span>
                  </li>
                ))}
              </ul>
            </RiseItem>
          </MastheadRise>

          {/* The plate: full bleed and landscape on a phone, portrait and running
              off the right edge of the viewport from 1024px. */}
          <div className="bleed-rule lg:ml-0 lg:w-auto lg:max-w-none lg:mr-[calc(var(--hero-bleed)*-1)]">
            <PlateFrame
              ratio="4/3"
              border={2}
              edges="y"
              catalogue="Plate 01"
              caption="One of the dogs on the register this month. Illustration, not a photograph."
              className="lg:ml-auto lg:w-[min(544px,100%)] [&>figcaption]:px-4 lg:[&>figcaption]:px-0"
              frameClassName="h-[260px] lg:h-auto lg:aspect-[4/5] lg:border-y-0 lg:border-l-2"
            >
              <PlateReveal>
                <Plate name="dog-head-broad" colourway="signal" />
              </PlateReveal>
            </PlateFrame>
          </div>
        </div>
      </Container>
    </Section>
  );
}
