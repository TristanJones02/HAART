/**
 * The HAART mark: a dog and a cat sitting facing each other with a heart
 * between them.
 *
 * RECONSTRUCTED BY EYE from a photograph of HAART's own market-stall banner
 * (dog and cat silhouettes in black either side of a red heart, above the
 * lowercase wordmark). It is close, not exact.
 *
 * TODO(tristan): replace with the original vector when the committee supplies
 * it (docs/blockers.md F12). Everything that draws the mark goes through this
 * one component, so swapping it is a single file.
 *
 * Silhouettes are `currentColor` so the mark works on every canvas; only the
 * heart is fixed red, and `muted` drops it to currentColor for single-colour
 * contexts such as a favicon or a stamp.
 */
export function Logomark({ className = '', muted = false, title }: { className?: string; muted?: boolean; title?: string }) {
  const heart = muted ? 'currentColor' : 'var(--color-red-600, #b50806)';
  return (
    <svg
      viewBox="0 0 132 78"
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {/* dog, sitting, facing right */}
      <g transform="translate(-12 12) scale(0.2)">
        <path d="M318 246C352 232 356 196 336 176" stroke="currentColor" strokeWidth="22" strokeLinecap="round" fill="none" />
        <ellipse cx="248" cy="252" rx="76" ry="62" />
        <path d="M168 230 L168 300" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
        <path d="M214 236 L214 300" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
        <ellipse cx="186" cy="240" rx="58" ry="70" />
        <path d="M132 96C96 88 84 142 108 172c14 18 34 6 36-22Z" />
        <path d="M260 96c36-8 48 46 24 76-14 18-34 6-36-22Z" />
        <circle cx="196" cy="126" r="72" />
      </g>

      {/* the heart, between them */}
      <g transform="translate(49 2) scale(1.35)">
        <path
          d="M12 21.6C12 21.6 2 15.2 2 8.4 2 4.8 4.8 2 8.4 2c2 0 3.6 1.2 3.6 1.2S13.6 2 15.6 2C19.2 2 22 4.8 22 8.4c0 6.8-10 13.2-10 13.2Z"
          fill={heart}
        />
      </g>

      {/* cat, sitting, facing left */}
      <g transform="translate(129 17.6) scale(-0.17 0.17)">
        <path d="M256 292C300 288 312 250 296 228" stroke="currentColor" strokeWidth="20" strokeLinecap="round" fill="none" />
        <path d="M200 300C150 300 140 232 152 188C164 146 182 128 200 128C218 128 236 146 248 188C260 232 250 300 200 300Z" />
        <path d="M180 240 L180 300" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
        <path d="M220 240 L220 300" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
        <path d="M161 88 154 20 208 52Z" />
        <path d="M239 88 246 20 192 52Z" />
        <circle cx="200" cy="118" r="52" />
      </g>
    </svg>
  );
}
