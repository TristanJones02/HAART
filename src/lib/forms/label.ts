/**
 * Field labels are plain strings that may contain Markdown-style links,
 * `[text](/path)`, so a consent label can point at /privacy or /foster
 * without the definition knowing anything about React. Both the client
 * (renders anchors) and the email formatter (flattens to text) use this.
 */
export type LabelPart = { text: string; href?: string };

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function labelParts(label: string): LabelPart[] {
  const parts: LabelPart[] = [];
  let last = 0;
  for (const match of label.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ text: label.slice(last, index) });
    parts.push({ text: match[1], href: match[2] });
    last = index + match[0].length;
  }
  if (last < label.length) parts.push({ text: label.slice(last) });
  return parts;
}

/** The label with link syntax removed: "I have read the privacy policy". */
export function plainLabel(label: string): string {
  return labelParts(label)
    .map((p) => p.text)
    .join('');
}

/** Hrefs the label links to, in order. */
export function labelLinks(label: string): string[] {
  return labelParts(label).flatMap((p) => (p.href ? [p.href] : []));
}
