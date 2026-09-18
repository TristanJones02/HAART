import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Guards every contrast pairing in docs/design-direction.md §2.2.
 *
 * The banned pairings are asserted as failures on purpose: if someone later
 * lightens a token so charcoal-550 starts passing on sand, this test breaks
 * and the canvas system gets revisited deliberately rather than by accident.
 */
const css = readFileSync(path.resolve(__dirname, 'tokens.css'), 'utf8');

const token = (name: string) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'i'));
  if (!m) throw new Error(`token --color-${name} not found in tokens.css`);
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

describe('text pairings meet WCAG 2.2 AA (4.5:1)', () => {
  it.each([
    ['charcoal-900', 'paper-0'], ['charcoal-900', 'paper-50'], ['charcoal-900', 'paper-100'],
    ['charcoal-900', 'sand-100'], ['charcoal-900', 'sand-200'], ['charcoal-900', 'red-50'], ['charcoal-900', 'red-100'],
    ['charcoal-700', 'paper-0'], ['charcoal-700', 'paper-50'], ['charcoal-700', 'sand-100'], ['charcoal-700', 'sand-200'],
    ['charcoal-550', 'paper-0'], ['charcoal-550', 'paper-50'], ['charcoal-550', 'paper-100'],
    ['red-600', 'paper-0'], ['red-600', 'paper-50'], ['red-600', 'sand-100'], ['red-600', 'sand-200'],
    ['terracotta-600', 'paper-0'], ['terracotta-600', 'paper-50'], ['terracotta-600', 'sand-100'], ['terracotta-600', 'sand-200'],
    ['sand-100', 'ink-950'], ['sand-300', 'ink-950'], ['stone-400', 'ink-950'], ['red-200', 'ink-950'],
    ['green-300', 'ink-950'], ['amber-300', 'ink-950'],
    ['white', 'red-600'], ['white', 'red-700'], ['white', 'green-600'], ['white', 'ink-950'],
    ['green-700', 'sand-100'], ['amber-700', 'sand-100'],
  ])('%s on %s', (fg, bg) => {
    expect(ratio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
});

describe('non-text pairings meet 3:1', () => {
  it.each([
    ['amber-600', 'paper-0'],
    ['amber-700', 'sand-100'],
    ['stone-400', 'ink-950'],
    ['red-600', 'paper-0'],
  ])('%s on %s', (fg, bg) => {
    expect(ratio(token(fg), token(bg))).toBeGreaterThanOrEqual(3);
  });
});

describe('banned pairings stay banned', () => {
  // Each of these is why a canvas variable exists. If one starts passing,
  // the design system has drifted and the canvas map should be revisited.
  it.each([
    ['charcoal-550', 'sand-100', 'muted text on sand steps up to charcoal-700'],
    ['charcoal-550', 'sand-200', 'muted text on sand steps up to charcoal-700'],
    ['charcoal-500', 'sand-100', 'charcoal-500 is effectively retired'],
    ['red-200', 'paper-0', 'red-200 is an ink-only colour'],
    ['red-200', 'sand-100', 'red-200 is an ink-only colour'],
    ['terracotta-600', 'ink-950', 'the caption voice on ink is stone-400'],
    ['green-600', 'sand-100', 'adopted text on sand is green-700'],
    ['stone-400', 'paper-0', 'stone-400 is an ink-only colour'],
  ])('%s on %s fails as text (%s)', (fg, bg) => {
    expect(ratio(token(fg), token(bg))).toBeLessThan(4.5);
  });

  it('red-600 on ink fails even as non-text, which is why --rule steps to red-200', () => {
    expect(ratio(token('red-600'), token('ink-950'))).toBeLessThan(3);
  });

  it('amber-600 on sand fails as non-text, which is why the status bar steps to amber-700', () => {
    expect(ratio(token('amber-600'), token('sand-100'))).toBeLessThan(3);
  });
});
