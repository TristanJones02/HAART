import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { buildMetadata } from '@/lib/seo/metadata';

/**
 * The seven hard constraints, as tests.
 *
 * This project is an unofficial concept rebuild carrying a real charity's
 * name, animals and words. The constraints that keep that from becoming
 * impersonation, an interception of their adopters, or a way to take a
 * stranger's money are not a one-off cleanup — they are properties the
 * codebase has to keep. Each one below fails loudly the moment someone
 * reintroduces what was removed, including by accident, including me.
 *
 * See docs/constraints.md.
 */

const SRC = path.resolve(__dirname, '../..');

/** Every .ts/.tsx under src/, excluding this file. */
function sourceFiles(dir = SRC): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry) && full !== __filename) out.push(full);
  }
  return out;
}

const ALL = sourceFiles().map((f) => ({ file: path.relative(SRC, f), text: readFileSync(f, 'utf8') }));
const hits = (re: RegExp) => ALL.filter(({ text }) => re.test(text)).map(({ file }) => file);

describe('2.1 no impersonation', () => {
  it('renders the unaffiliated notice unconditionally', () => {
    const banner = ALL.find((f) => f.file.endsWith('layout/UnofficialBanner.tsx'));
    expect(banner, 'UnofficialBanner.tsx must exist').toBeDefined();
    expect(banner!.text).toContain('Not affiliated with or endorsed by HAART');
    // No environment check may gate it: it must render on every deployment.
    expect(banner!.text).not.toMatch(/isLiveSite|VERCEL_ENV|NODE_ENV|process\.env/);
  });

  it('mounts the banner in the root layout', () => {
    const layout = ALL.find((f) => f.file === 'app/layout.tsx')!;
    expect(layout.text).toContain('<UnofficialBanner />');
  });
});

describe('2.2 noindex, nofollow', () => {
  it('disallows every crawler on every path', () => {
    expect(robots()).toEqual({ rules: [{ userAgent: '*', disallow: '/' }] });
  });

  it('offers a crawler nothing through the sitemap', () => {
    expect(sitemap()).toEqual([]);
  });

  it('marks every page noindex even when the page asks to be indexed', () => {
    const forced = buildMetadata({ title: 'Anything', path: '/anything', seo: { noIndex: false } });
    expect(forced.robots).toMatchObject({ index: false, follow: false });
    const plain = buildMetadata({ title: 'Anything', path: '/anything' });
    expect(plain.robots).toMatchObject({ index: false, follow: false });
  });
});

describe('2.3 no money', () => {
  it('has no payment provider SDK or checkout hostname in the source', () => {
    expect(hits(/stripe\.com|js\.stripe|squareup\.com|paypal\.com|buy\.stripe/i)).toEqual([]);
  });

  it('never reads a payment link into an href', () => {
    // The settings fields may still exist; nothing may turn one into a link.
    expect(hits(/href=\{[^}]*(squareLink|oneOffLink|monthlyLink|CoverFeesLink)/)).toEqual([]);
  });

  it('has no card or payment input anywhere', () => {
    expect(hits(/autoComplete=["'](cc-number|cc-exp|cc-csc)/i)).toEqual([]);
  });
});

describe('2.4 and 2.5 no enquiry capture, no personal data', () => {
  it('has no form submission endpoint', () => {
    expect(ALL.filter((f) => f.file.startsWith('app/api/forms'))).toEqual([]);
  });

  it('has no form definitions or form renderer', () => {
    expect(ALL.filter((f) => f.file.startsWith('lib/forms/') || f.file.startsWith('components/forms/'))).toEqual([]);
  });

  it('posts nothing anywhere', () => {
    expect(hits(/method=["']post["']|method:\s*['"]POST['"]/i)).toEqual([]);
  });

  it('has no transactional mail sender', () => {
    expect(hits(/\bfrom ['"]resend['"]|new Resend\(/)).toEqual([]);
  });

  it('loads no analytics script', () => {
    expect(hits(/plausible\.io|googletagmanager|google-analytics|gtag\(/)).toEqual([]);
  });

  it('keeps track() inert so no call site can start collecting again', () => {
    const analytics = ALL.find((f) => f.file === 'lib/analytics.ts')!;
    const body = analytics.text.slice(analytics.text.indexOf('export function track'));
    expect(body).not.toMatch(/window\.plausible|fetch\(|navigator\.sendBeacon/);
  });
});

describe('2.7 no secrets', () => {
  it('ships an .env.example with placeholder values only', () => {
    const example = readFileSync(path.resolve(SRC, '../.env.example'), 'utf8');
    // Anything that looks like a real token rather than an empty placeholder.
    const suspicious = example
      .split('\n')
      .filter((l) => /^[A-Z_]+=/.test(l))
      .filter((l) => /=(sk_|pk_|re_|rk_|Bearer |[A-Za-z0-9_-]{28,})/.test(l));
    expect(suspicious).toEqual([]);
  });
});
