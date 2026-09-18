/**
 * The printer's ornament: the partner poster's blobs, dots and dashes
 * disciplined into one repeating tile. Used in exactly three places — under
 * the hero masthead, at every light-to-ink boundary, and across the top of
 * the footer.
 */
export function DashRule({ bleed = false, className = '' }: { bleed?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="8"
      className={`${bleed ? 'bleed-rule' : 'w-full'} h-2 text-[color:var(--rule)] ${className}`}
      preserveAspectRatio="none"
      viewBox="0 0 240 8"
    >
      <defs>
        <pattern id="haart-dash" width="240" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4h34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <circle cx="52" cy="4" r="3.2" fill="currentColor" />
          <path d="M72 4.4C96 2.6 120 5.4 146 3.8v.8C120 6.2 96 3.4 72 5.2Z" fill="currentColor" />
          <circle cx="164" cy="4" r="2.4" fill="currentColor" />
          <path d="M180 4h40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect width="240" height="8" fill="url(#haart-dash)" />
    </svg>
  );
}
