import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Link from 'next/link';
import type { ImageWithAlt, PortableTextBlock } from '@/lib/content/types';
import { textToPortable } from '@/lib/sanity/portable';
import { SmartImage } from './SmartImage';

/*
 * Body copy as the register sets it: a 62ch measure, full-strength text (the
 * rejected build set body in charcoal-700, which is why it read washed out),
 * square corners, a printer's quad for a list marker and no drop cap. Every
 * colour comes from the canvas variables, so the same prose reads correctly
 * on paper and on ink without branching.
 */

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2 className="mt-12 mb-4 text-feature">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 font-display text-[1.25rem] leading-snug font-extrabold">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-[color:var(--rule)] pl-5 text-lede italic text-[color:var(--text-muted)]">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-5 list-none space-y-2 pl-0">{children}</ul>,
    number: ({ children }) => (
      <ol className="my-5 list-decimal space-y-2 pl-7 marker:font-display marker:font-extrabold marker:text-[color:var(--rule)]">{children}</ol>
    ),
  },
  listItem: {
    // The printer's quad, doing the job a disc used to do.
    bullet: ({ children }) => (
      <li className="relative pl-7 before:absolute before:top-[0.62em] before:left-0 before:size-[9px] before:bg-[color:var(--rule)] before:content-['']">{children}</li>
    ),
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? '#';
      const external = /^https?:\/\//.test(href);
      const cls = 'text-[color:var(--rule)] underline decoration-2 underline-offset-4';
      return external ? (
        <a href={href} className={cls} rel="noopener noreferrer" target="_blank">
          {children}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {children}
        </Link>
      );
    },
  },
  types: {
    imageWithAlt: ({ value }) => {
      const img = value as ImageWithAlt & { asset?: unknown };
      const withImage: ImageWithAlt =
        img.url || img.image
          ? img
          : { ...img, image: { _type: 'image', asset: (img.asset as { _ref: string; _type: 'reference' }) ?? { _ref: '', _type: 'reference' } } };
      return (
        <figure className="my-10">
          <SmartImage image={withImage} aspect="aspect-[3/2]" sizes="(min-width: 768px) 62ch, 100vw" className="border border-charcoal-900" />
          {img.caption ? (
            <figcaption className="mt-2 flex items-start gap-2 text-[0.8125rem] leading-[1.4] font-semibold italic text-[color:var(--text-caption)]">
              <span aria-hidden="true" className="mt-[0.55em] h-0.5 w-3 flex-none bg-[color:var(--rule)]" />
              {img.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    // No tinted box: a note is a rule in the margin, like everything else here.
    callout: ({ value }) => (
      <aside className="my-8 border-l-4 border-[color:var(--rule)] pl-5">
        <p className="m-0 text-lede">{(value as { text?: string })?.text}</p>
      </aside>
    ),
  },
};

/**
 * Typographic wrapper for Portable Text or plain text.
 *
 * `lede` sets the first paragraph at --text-lede behind a 4px red rule. It is
 * the replacement for the drop cap, which is dropped: it is the one device
 * that tips the journal conceit into twee and the most fragile thing in the
 * direction against volunteer prose.
 */
export function Prose({ value, className = '', lede = false }: { value: PortableTextBlock[] | string | undefined; className?: string; lede?: boolean }) {
  if (!value) return null;
  const blocks = typeof value === 'string' ? textToPortable(value) : value;
  const ledeClass = lede
    ? '[&>p:first-of-type]:mb-6 [&>p:first-of-type]:border-l-4 [&>p:first-of-type]:border-[color:var(--rule)] [&>p:first-of-type]:pl-5 [&>p:first-of-type]:text-lede'
    : '';
  return (
    <div className={`prose-haart max-w-prose text-body text-[color:var(--text-strong)] [&>p]:mb-5 [&>p:last-child]:mb-0 ${ledeClass} ${className}`}>
      <PortableText value={blocks} components={components} />
    </div>
  );
}
