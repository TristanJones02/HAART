import type { ComponentProps, ElementType, ReactNode } from 'react';
import { RuleDraw } from '@/components/motion/RuleDraw';

/**
 * Canvas is a property of the block type, never of its position. Positional
 * alternation is gone: it is the single thing that made the previous build
 * read as a template. Each class in globals.css sets the variables components
 * consume, so a banned pairing (charcoal-550 on sand) is unreachable rather
 * than merely forbidden.
 */
export type Canvas = 'paper' | 'cream' | 'sand' | 'ink';

export const canvasClass: Record<Canvas, string> = {
  paper: 'canvas-paper',
  cream: 'canvas-cream',
  sand: 'canvas-sand',
  ink: 'canvas-ink',
};

export const isLight = (c: Canvas) => c !== 'ink';

/** Horizontal container: 1140px max, 16px gutter, 24px from 640px. */
export function Container({ className = '', children, as: Tag = 'div', ...rest }: { className?: string; children: ReactNode; as?: ElementType } & ComponentProps<'div'>) {
  return (
    <Tag className={`container-site ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * A section on its canvas, with the boundary rule it owns.
 *
 * light -> light: a full-bleed 2px charcoal rule, drawn from the left as it
 * enters view. light -> ink: nothing here, the DashRule is drawn by the light
 * side above it. ink -> light: nothing at all; the value change is the edge.
 */
export function Section({
  canvas = 'paper',
  tight = false,
  className = '',
  children,
  id,
  labelledBy,
  as: Tag = 'section',
  topRule = false,
}: {
  canvas?: Canvas;
  tight?: boolean;
  className?: string;
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  as?: ElementType;
  /** Set by the renderer on a light block that follows another light block. */
  topRule?: boolean;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={`relative ${canvasClass[canvas]} ${canvas === 'sand' || canvas === 'ink' ? 'grain' : ''} ${tight ? 'py-8 sm:py-10' : 'section-y'} ${className}`}
    >
      {topRule ? <RuleDraw as="div" className="bleed-rule absolute left-0 top-0 h-0.5 bg-charcoal-900" /> : null}
      {children}
    </Tag>
  );
}

/**
 * The section's opening: a folio bar carrying the rubric, then the heading.
 * Kept as a named export because most blocks want heading + deck without
 * rebuilding the bar each time.
 */
export function SectionHeading({
  id,
  eyebrow,
  heading,
  lead,
  align = 'start',
  level = 2,
  className = '',
}: {
  id?: string;
  eyebrow?: string;
  heading?: string;
  lead?: string;
  align?: 'start' | 'center';
  level?: 2 | 1;
  className?: string;
}) {
  if (!heading && !lead) return null;
  const H = level === 1 ? 'h1' : 'h2';
  return (
    <div className={`mb-10 max-w-[34ch] ${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow ? <p className="mb-3 text-rubric uppercase text-[color:var(--text-caption)]">{eyebrow}</p> : null}
      {heading ? (
        <H id={id} className={level === 1 ? 'text-masthead' : 'text-section'}>
          {heading}
        </H>
      ) : null}
      {lead ? <p className="mt-4 text-deck italic text-[color:var(--text-muted)]">{lead}</p> : null}
    </div>
  );
}
