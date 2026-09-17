/**
 * Typographic wordmark used until the original vector logo is supplied
 * (docs/blockers.md F12). Lowercase "haart" in the display face with a red
 * heart-shaped counter in the first "a" is out of scope; this keeps it plain.
 */
export function Wordmark({ className = '', size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  return (
    <span className={`inline-flex items-baseline font-display font-black leading-none tracking-tight text-charcoal-900 ${size === 'lg' ? 'text-h1' : 'text-h2'} ${className}`}>
      <span>haart</span>
      <span aria-hidden="true" className="ml-0.5 inline-block size-2 translate-y-[-2px] rounded-pill bg-red-600" />
    </span>
  );
}
