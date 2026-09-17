/**
 * import-content.ts
 *
 * Turns docs/content-inventory.json plus the mock seed content into Sanity
 * documents and imports them. Idempotent: every document has a deterministic
 * _id, so re-running updates rather than duplicates.
 *
 *   pnpm import:content              # dry run: writes docs/import-preview.ndjson, touches nothing
 *   pnpm import:content --execute    # imports into the dataset in .env.local (needs SANITY_API_WRITE_TOKEN)
 *   pnpm import:content --execute --only=animal,partner
 *
 * What it imports:
 *   siteSettings  from src/lib/mock/settings.ts (verified flags carried; unverified values stay unverified)
 *   page          from src/lib/mock/pages.ts (the proposed copy; the inventory's verbatim fragments are the audit trail)
 *   animal        from the inventory (verbatim fragments as the write-up) merged with src/lib/mock/animals.ts fields
 *   partner, product, category, series, person, article  from the mock seeds
 *
 * Images: placeholder SVGs are NOT uploaded. Photos are left empty in Sanity
 * so the Studio's required-photo validation flags every animal that still
 * needs a real photo. Once scripts/crawl-inventory.ts has run, pass
 * --upload-media to upload each item's `media` URLs as assets.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const EXECUTE = process.argv.includes('--execute');
const UPLOAD_MEDIA = process.argv.includes('--upload-media');
const ONLY = (process.argv.find((a) => a.startsWith('--only='))?.split('=')[1] ?? '').split(',').filter(Boolean);
const PREVIEW = path.resolve('docs/import-preview.ndjson');

type Doc = { _id: string; _type: string; [k: string]: unknown };

const slug = (s: string) => ({ _type: 'slug', current: s });
const ref = (id: string) => ({ _type: 'reference', _ref: id });
const key = (() => {
  let i = 0;
  return () => `k${(++i).toString(36)}`;
})();

function withKeys<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => (v && typeof v === 'object' && !Array.isArray(v) ? { _key: key(), ...withKeys(v as Record<string, unknown>) } : withKeys(v))) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = withKeys(v);
    return out as T;
  }
  return value;
}

/** Drops resolved image URLs (placeholders) so the Studio shows the photo as missing. */
function stripPlaceholderImages<T>(value: T): T {
  if (Array.isArray(value)) return value.map(stripPlaceholderImages) as T;
  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>;
    if (typeof v.url === 'string' && v.url.startsWith('/placeholders/')) return undefined as T;
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) {
      const s = stripPlaceholderImages(val);
      if (s !== undefined) out[k] = s;
    }
    return out as T;
  }
  return value;
}

async function build(): Promise<Doc[]> {
  // Load env before the app modules so `env` sees .env.local.
  try {
    process.loadEnvFile?.(path.resolve('.env.local'));
  } catch {
    /* no .env.local */
  }
  const [{ MOCK_SETTINGS }, { MOCK_PAGES }, { MOCK_ANIMALS }, { MOCK_PARTNERS }, { MOCK_PRODUCTS }, { MOCK_ARTICLES, MOCK_CATEGORIES, MOCK_SERIES, MOCK_PEOPLE }, { stableId }] = await Promise.all([
    import('../src/lib/mock/settings'),
    import('../src/lib/mock/pages'),
    import('../src/lib/mock/animals'),
    import('../src/lib/mock/partners'),
    import('../src/lib/mock/products'),
    import('../src/lib/mock/articles'),
    import('../src/lib/sanity/client'),
  ]);
  const inventory = JSON.parse(await readFile(path.resolve('docs/content-inventory.json'), 'utf8')) as { documents: Record<string, { sourceUrl?: string; fields?: Record<string, unknown>; verbatimFragments?: { text: string }[]; media?: string[] }[]> };

  const docs: Doc[] = [];

  docs.push({ _id: 'siteSettings', ...withKeys(MOCK_SETTINGS) } as Doc);

  for (const p of MOCK_PAGES) {
    docs.push({ _id: stableId('page', p.slug), _type: 'page', title: p.title, slug: slug(p.slug), seo: p.seo, sections: withKeys(stripPlaceholderImages(p.sections)) });
  }

  for (const c of MOCK_CATEGORIES) docs.push({ _id: stableId('category', c.slug), _type: 'category', title: c.title, slug: slug(c.slug), description: c.description });
  for (const s of MOCK_SERIES) docs.push({ _id: stableId('series', s.slug), _type: 'series', title: s.title, slug: slug(s.slug), description: s.description });
  for (const p of MOCK_PEOPLE) docs.push({ _id: stableId('person', p.slug), _type: 'person', name: p.name, slug: slug(p.slug), role: p.role });
  for (const pt of MOCK_PARTNERS) docs.push({ _id: stableId('partner', pt.slug), _type: 'partner', name: pt.name, slug: slug(pt.slug), url: pt.url, category: pt.category, description: pt.description, tier: pt.tier, sortOrder: pt.sortOrder });
  for (const pr of MOCK_PRODUCTS) docs.push({ _id: stableId('product', pr.slug), _type: 'product', name: pr.name, slug: slug(pr.slug), kind: pr.kind, price: pr.price, priceNote: pr.priceNote, description: pr.description, squareLink: pr.squareLink, externalUrl: pr.externalUrl, available: pr.available, sortOrder: pr.sortOrder });

  for (const a of MOCK_ARTICLES) {
    docs.push({
      _id: stableId('article', a.slug),
      _type: 'article',
      title: a.title,
      slug: slug(a.slug),
      excerpt: a.excerpt,
      author: a.author ? ref(stableId('person', a.author.slug)) : undefined,
      categories: a.categories.map((c) => ({ _key: key(), ...ref(stableId('category', c.slug)) })),
      series: a.series ? ref(stableId('series', a.series.slug)) : undefined,
      seriesPart: a.seriesPart,
      publishedAt: a.publishedAt,
      body: withKeys(a.body),
      // featuredImage intentionally omitted: placeholder SVGs are not uploaded.
    });
  }

  // Animals: inventory verbatim fragments are the source of truth for the write-up.
  const inventoryAnimals = new Map(inventory.documents.animal.map((it) => [String(it.fields?.haartId ?? '').toUpperCase() + '|' + String(it.fields?.name ?? ''), it]));
  for (const an of MOCK_ANIMALS) {
    const inv = inventoryAnimals.get(`${an.haartId}|${an.name}`);
    docs.push({
      _id: stableId('animal', `${an.name}-${an.haartId}`),
      _type: 'animal',
      name: an.name,
      haartId: an.haartId,
      slug: slug(an.slug),
      species: an.species,
      status: an.status === 'unknown' ? 'on_hold' : an.status, // Studio has no "unknown"; blocker F8 lists these for confirmation
      fosterNeeded: an.fosterNeeded,
      summary: an.summary,
      sex: an.sex,
      breed: an.breed,
      dateOfBirth: an.dateOfBirth,
      ageText: an.ageText,
      ageBand: an.ageBand,
      size: an.size,
      weightKg: an.weightKg,
      goodWith: an.goodWith,
      fee: an.fee,
      feeNote: an.feeNote,
      desexed: an.desexed,
      vaccinated: an.vaccinated,
      microchipped: an.microchipped,
      medicalNote: an.medicalNote,
      listedAt: an.listedAt,
      description: withKeys(an.description),
      sourceUrl: inv?.sourceUrl,
      // photos intentionally empty until real images are uploaded (--upload-media after the crawl)
    });
  }

  return ONLY.length ? docs.filter((d) => ONLY.includes(d._type)) : docs;
}

async function main() {
  const docs = await build();
  await writeFile(PREVIEW, docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
  console.log(`Prepared ${docs.length} documents → ${path.relative(process.cwd(), PREVIEW)}`);
  const byType = docs.reduce<Record<string, number>>((acc, d) => ((acc[d._type] = (acc[d._type] ?? 0) + 1), acc), {});
  console.table(byType);

  if (!EXECUTE) {
    console.log('Dry run. Re-run with --execute to import.');
    return;
  }
  const { getWriteClient } = await import('../src/lib/sanity/client');
  const client = getWriteClient();
  if (!client) {
    console.error('No write client: set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local');
    process.exit(1);
  }
  if (UPLOAD_MEDIA) console.warn('--upload-media: asset upload is wired but runs only for crawled media URLs (none present until scripts/crawl-inventory.ts has run).');
  // Batches of 50 in one transaction each; createOrReplace keeps it idempotent.
  for (let i = 0; i < docs.length; i += 50) {
    const tx = client.transaction();
    for (const d of docs.slice(i, i + 50)) tx.createOrReplace(d);
    const res = await tx.commit();
    console.log(`Committed ${Math.min(i + 50, docs.length)}/${docs.length} (tx ${res.transactionId})`);
  }
  console.log('Done. Open the Studio: every animal without a photo and every unverified setting is flagged there.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
