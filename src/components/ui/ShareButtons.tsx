'use client';

import { track } from '@/lib/analytics';
import { FacebookMark, UiIcon } from './Icon';

/**
 * Share affordances with no third-party scripts: plain share URLs, the Web
 * Share API where it exists, and a copy-link fallback.
 */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const cls = 'inline-flex h-11 items-center gap-2 rounded-control border border-border bg-paper-0 px-3.5 text-small font-semibold text-charcoal-900 hover:border-charcoal-700';
  return (
    <div className="flex flex-wrap gap-2" aria-label="Share">
      <a href={fb} className={cls} target="_blank" rel="noopener noreferrer" onClick={() => track('share', { channel: 'facebook' })}>
        <FacebookMark size={18} />
        Share on Facebook
      </a>
      {canShare ? (
        <button type="button" className={cls} onClick={() => navigator.share({ url, title }).then(() => track('share', { channel: 'native' })).catch(() => undefined)}>
          <UiIcon name="Share2" size={18} />
          Share
        </button>
      ) : null}
      <button
        type="button"
        className={cls}
        onClick={(e) => {
          navigator.clipboard?.writeText(url).then(() => {
            const el = e.currentTarget.querySelector('span');
            if (el) el.textContent = 'Link copied';
            track('share', { channel: 'copy' });
          });
        }}
      >
        <UiIcon name="Copy" size={18} />
        <span>Copy link</span>
      </button>
    </div>
  );
}
