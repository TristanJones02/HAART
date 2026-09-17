import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Guards the contrast pairings documented in docs/design-system.md. If a
 * token is changed, this fails before the change reaches a page.
 */
const css = readFileSync(path.resolve(__dirname, 'tokens.css'), 'utf8');
const token = (name: string) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'i'));
  if (!m) throw new Error(`token ${name} not found`);
  return m[1];
};
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('design tokens meet WCAG AA', () => {
  it.each([
    ['charcoal-900', 'paper-100', 4.5],
    ['charcoal-700', 'paper-100', 4.5],
    ['charcoal-550', 'paper-100', 4.5],
    ['charcoal-500', 'paper-0', 4.5],
    ['charcoal-500', 'paper-100', 3], // large text only
    ['white', 'red-600', 4.5],
    ['white', 'red-700', 4.5],
    ['red-600', 'paper-100', 4.5],
    ['red-700', 'red-50', 4.5],
    ['white', 'green-600', 4.5],
    ['amber-700', 'paper-100', 4.5],
    ['red-600', 'paper-0', 3], // focus ring, non-text
  ])('%s on %s is at least %s:1', (fg, bg, min) => {
    expect(ratio(token(fg), token(bg))).toBeGreaterThanOrEqual(min);
  });

  it('amber 600 is never used as text (documented failure)', () => {
    expect(ratio(token('amber-600'), token('paper-0'))).toBeLessThan(4.5);
  });
});
