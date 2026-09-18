import { LOGOTYPE_LETTERS, LOGOTYPE_VIEWBOX, MARK_HEART, MARK_SILHOUETTE, MARK_VIEWBOX } from './logoPaths';

/**
 * The HAART mark: a cat sitting in front of a dog, an open heart across them.
 *
 * Traced from the organisation's own logo artwork rather than redrawn, so the
 * shapes are theirs. The silhouettes are `currentColor` so the mark works on
 * every canvas, and the heart reads `--logo-heart`, which every canvas class
 * sets: red-600 on the papers, red-200 on ink where red-600 is 2.33:1. That is
 * the brand red rather than the artwork's own #ea1824, so the site reads as
 * one system and the header does not carry two different reds. See
 * docs/blockers.md F29.
 */
export function Logomark({ className = '', title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {MARK_SILHOUETTE.map((d) => (
        <path key={d.slice(0, 24)} fill="currentColor" fillRule="evenodd" d={d} />
      ))}
      {MARK_HEART.map((d) => (
        <path key={d.slice(0, 24)} fill="var(--logo-heart, #b50806)" fillRule="evenodd" d={d} />
      ))}
    </svg>
  );
}

/** The lowercase "haart" logotype, traced from the same artwork. */
export function Logotype({ className = '', title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={LOGOTYPE_VIEWBOX}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {LOGOTYPE_LETTERS.map((d) => (
        <path key={d.slice(0, 24)} fill="currentColor" fillRule="evenodd" d={d} />
      ))}
    </svg>
  );
}
