import type { ComponentProps, ElementType, ReactNode } from 'react';

type Surface = 'paper-0' | 'paper-50' | 'paper-100';

const surfaceClass: Record<Surface, string> = {
  'paper-0': 'bg-paper-0',
  'paper-50': 'bg-paper-50',
  'paper-100': 'bg-paper-100',
};

/** Horizontal container: 1140px max, 16px gutter on phones, 24px from 640px. */
export function Container({ className = '', children, as: Tag = 'div', ...rest }: { className?: string; children: ReactNode; as?: ElementType } & ComponentProps<'div'>) {
  return (
    <Tag className={`container-site ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Vertical section with the surface chosen by the renderer from the block's
 * position. Padding is 64px, 48px on phones. `tight` halves it for strips.
 */
export function Section({
  surface = 'paper-0',
  tight = false,
  className = '',
  children,
  id,
  labelledBy,
  as: Tag = 'section',
}: {
  surface?: Surface;
  tight?: boolean;
  className?: string;
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  as?: ElementType;
}) {
  return (
    <Tag id={id} aria-labelledby={labelledBy} className={`${surfaceClass[surface]} ${tight ? 'py-6 sm:py-8' : 'py-12 sm:py-16'} ${className}`}>
      {children}
    </Tag>
  );
}

export function surfaceForIndex(i: number): Surface {
  const order: Surface[] = ['paper-0', 'paper-50', 'paper-100'];
  return order[i % 3];
}

/** Heading + optional lead used at the top of most sections. */
export function SectionHeading({ id, eyebrow, heading, lead, align = 'start', level = 2 }: { id?: string; eyebrow?: string; heading?: string; lead?: string; align?: 'start' | 'center'; level?: 2 | 1 }) {
  if (!heading && !lead) return null;
  const H = level === 1 ? 'h1' : 'h2';
  return (
    <div className={`mb-8 max-w-prose ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow ? <p className="mb-2 text-tiny uppercase tracking-caps text-red-600">{eyebrow}</p> : null}
      {heading ? (
        <H id={id} className={level === 1 ? 'text-h1' : 'text-h2'}>
          {heading}
        </H>
      ) : null}
      {lead ? <p className="mt-3 text-lead text-charcoal-700">{lead}</p> : null}
    </div>
  );
}
