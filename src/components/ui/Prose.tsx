import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Link from 'next/link';
import type { ImageWithAlt, PortableTextBlock } from '@/lib/content/types';
import { textToPortable } from '@/lib/sanity/portable';
import { SmartImage } from './SmartImage';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2 className="text-h2 mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-h3 mt-8 mb-3">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="my-6 border-l-4 border-red-600 pl-4 text-lead text-charcoal-700">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 list-disc space-y-1 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="my-4 list-decimal space-y-1 pl-6">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? '#';
      const external = /^https?:\/\//.test(href);
      return external ? (
        <a href={href} className="text-red-600 underline underline-offset-4 hover:text-red-700" rel="noopener noreferrer" target="_blank">
          {children}
        </a>
      ) : (
        <Link href={href} className="text-red-600 underline underline-offset-4 hover:text-red-700">
          {children}
        </Link>
      );
    },
  },
  types: {
    imageWithAlt: ({ value }) => {
      const img = value as ImageWithAlt & { asset?: unknown };
      const withImage: ImageWithAlt = img.url || img.image ? img : { ...img, image: { _type: 'image', asset: (img.asset as { _ref: string; _type: 'reference' }) ?? { _ref: '', _type: 'reference' } } };
      return (
        <figure className="my-8">
          <SmartImage image={withImage} aspect="aspect-[3/2]" sizes="(min-width: 768px) 65ch, 100vw" className="rounded-card" />
          {img.caption ? <figcaption className="mt-2 text-small text-charcoal-550">{img.caption}</figcaption> : null}
        </figure>
      );
    },
    callout: ({ value }) => (
      <aside className="my-6 rounded-card border border-red-100 bg-red-50 p-4 text-charcoal-900">
        <p className="m-0">{(value as { text?: string })?.text}</p>
      </aside>
    ),
  },
};

/** Typographic wrapper for Portable Text or plain text. */
export function Prose({ value, className = '' }: { value: PortableTextBlock[] | string | undefined; className?: string }) {
  if (!value) return null;
  const blocks = typeof value === 'string' ? textToPortable(value) : value;
  return (
    <div className={`prose-haart max-w-prose text-body text-charcoal-900 [&>p]:mb-4 [&>p:last-child]:mb-0 ${className}`}>
      <PortableText value={blocks} components={components} />
    </div>
  );
}
