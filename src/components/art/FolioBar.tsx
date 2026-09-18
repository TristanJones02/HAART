import type { ReactNode } from 'react';
import { OutlineNumeral } from './OutlineNumeral';
import { Quad } from './Quad';
import { RuleDraw } from '@/components/motion/RuleDraw';

/**
 * The bar that opens every section: a red rule, a rubric, a hairline running
 * out to the margin, and an outline folio numeral hanging off the right end.
 * Fifteen lines of JSX that carry most of the editorial character.
 */
export function FolioBar({
  rubric,
  numeral,
  right,
  className = '',
}: {
  rubric: string;
  numeral?: number;
  /** Replaces the folio numeral, e.g. a computed count. */
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-8 flex min-h-11 items-center gap-3 ${className}`}>
      <RuleDraw className="folio-rule" />
      <p className="flex items-center gap-2 text-rubric uppercase text-[color:var(--text-caption)]">
        <Quad />
        {rubric}
      </p>
      <span aria-hidden="true" className="h-px flex-1 bg-[color:var(--hairline)]" />
      {right ? <div className="flex-none text-rubric uppercase text-[color:var(--text-caption)]">{right}</div> : null}
      {!right && numeral !== undefined ? <OutlineNumeral n={numeral} className="-mb-2 flex-none" /> : null}
    </div>
  );
}
