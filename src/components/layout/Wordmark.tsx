import { Logomark } from './Logomark';

/**
 * The wordmark: the dog-heart-cat mark above or beside lowercase "haart".
 *
 * The mark is a reconstruction of HAART's own banner artwork; see Logomark.
 * `mark={false}` gives the plain typographic lockup for tight spaces.
 */
export function Wordmark({
  className = '',
  size = 'md',
  mark = true,
  stacked = false,
}: {
  className?: string;
  size?: 'md' | 'lg' | 'xl';
  mark?: boolean;
  /** Mark above the word, for the footer and the 404. */
  stacked?: boolean;
}) {
  const text = size === 'xl' ? 'text-[3rem]' : size === 'lg' ? 'text-[2.25rem]' : 'text-[1.75rem]';
  const markSize = size === 'xl' ? 'h-14' : size === 'lg' ? 'h-10' : 'h-8';
  return (
    <span className={`inline-flex ${stacked ? 'flex-col items-start gap-2' : 'items-center gap-2.5'} ${className}`}>
      {mark ? <Logomark className={`${markSize} w-auto`} /> : null}
      <span className={`font-display font-black leading-none tracking-[-0.04em] ${text}`}>haart</span>
    </span>
  );
}
