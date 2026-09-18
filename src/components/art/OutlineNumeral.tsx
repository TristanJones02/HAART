/**
 * Decorative outline numeral. Always aria-hidden, always generated from block
 * index or list order, never from content. Browsers without text-stroke get a
 * faint solid fill rather than invisible text (see globals.css).
 */
export function OutlineNumeral({ n, size = 'folio', className = '' }: { n: number; size?: 'folio' | 'index'; className?: string }) {
  const text = String(n).padStart(2, '0');
  return (
    <span
      aria-hidden="true"
      className={`numeral-outline select-none ${size === 'folio' ? 'text-folio' : 'text-[2rem] leading-none'} ${className}`}
    >
      {text}
    </span>
  );
}
