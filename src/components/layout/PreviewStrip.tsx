import { env } from '@/lib/env';
import { CONTENT_SOURCE } from '@/lib/content/mode';

/**
 * One line at the very top of a preview deployment, and nowhere else.
 *
 * A preview carries HAART's name, its ABN and its donation copy while half of
 * that is still marked unverified in docs/blockers.md, and anyone with the
 * link can open it. Saying so on the page is the cheapest honest fix: nobody
 * reads a charity's registration details off a review link and takes them as
 * fact when the page says not to.
 *
 * It renders on the server from VERCEL_ENV, so the live site ships no markup
 * for it at all.
 */
export function PreviewStrip() {
  if (env.isLiveSite) return null;
  const mock = CONTENT_SOURCE === 'mock';
  return (
    <div className="canvas-ink border-b border-[color:var(--hairline)]">
      <div className="container-site flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2 text-note">
        <span className="inline-flex items-center gap-2 font-display font-extrabold uppercase tracking-[0.12em] text-[color:var(--rubric)]">
          <span aria-hidden="true" className="inline-block size-[7px] bg-[color:var(--rubric)]" />
          Preview
        </span>
        <span className="text-[color:var(--text-muted)]">
          Design review build{mock ? ', with placeholder content' : ''}. Registration details, fees and figures are unconfirmed, forms are not connected, and the animals shown are not live listings.
        </span>
      </div>
    </div>
  );
}
