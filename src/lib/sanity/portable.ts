import type { PortableTextBlock } from '@/lib/content/types';

/** Turns plain text (one paragraph per blank line) into Portable Text blocks. Used by mock data and the import script. */
export function textToPortable(text: string): PortableTextBlock[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => ({
      _type: 'block',
      _key: `p${i}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `s${i}`, text: p, marks: [] }],
    }));
}

/** Plain-text of a Portable Text array (for excerpts and meta descriptions). */
export function portableToText(blocks: PortableTextBlock[] | string | undefined): string {
  if (!blocks) return '';
  if (typeof blocks === 'string') return blocks;
  return blocks
    .map((b) => (Array.isArray(b.children) ? (b.children as { text?: string }[]).map((c) => c.text ?? '').join('') : ''))
    .filter(Boolean)
    .join('\n\n');
}
