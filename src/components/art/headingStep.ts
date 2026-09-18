/**
 * Volunteer-proofing for display type. Deterministic and SSR-safe: a long
 * heading steps down a size rather than overflowing or being truncated.
 * Nothing on the site ever cuts a heading.
 */
export function headingStep(text: string | undefined | null): 0 | 1 | 2 {
  const n = (text ?? '').trim().length;
  if (n <= 36) return 0;
  if (n <= 72) return 1;
  return 2;
}

const MASTHEAD = ['text-masthead', 'text-masthead-2', 'text-masthead-3'] as const;

/** The masthead class for a given heading, stepped by length. */
export function mastheadClass(text: string | undefined | null): string {
  return MASTHEAD[headingStep(text)];
}

/** Section heads step down to feature size, then gain balanced wrapping. */
export function sectionHeadClass(text: string | undefined | null): string {
  const step = headingStep(text);
  if (step === 0) return 'text-section';
  if (step === 1) return 'text-feature';
  return 'text-feature text-balance';
}

/** Card names shrink and then break, so a long animal name cannot blow out a card. */
export function cardNameClass(name: string | undefined | null): string {
  const n = (name ?? '').trim().length;
  if (n > 20) return 'text-[1.25rem] leading-none font-display font-extrabold [overflow-wrap:anywhere]';
  if (n > 12) return 'text-[1.25rem] leading-none font-display font-extrabold';
  return 'text-cardname font-display';
}
