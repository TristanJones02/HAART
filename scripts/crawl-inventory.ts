/**
 * crawl-inventory.ts
 *
 * Crawls both haart.org.au hosts, extracts verbatim copy, headings, forms,
 * images, documents and stylesheet colours, and merges the results into
 * docs/content-inventory.json and docs/media-manifest.json.
 *
 * Run from a machine with normal internet access:
 *   pnpm crawl              # crawl and merge
 *   pnpm crawl --dry        # crawl and print, do not write
 *   pnpm crawl --wayback    # also list recently removed URLs from the Wayback CDX API
 *
 * It is deliberately polite: one request at a time, 400 ms apart, with a
 * descriptive user agent. It never posts anything.
 */
import * as cheerio from 'cheerio';
import { imageSize } from 'image-size';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const HOSTS = ['https://haart.org.au', 'https://www.haart.org.au'];
const UA = 'haart-rebuild-inventory/1.0 (volunteer site migration; contact info@haart.org.au)';
const DELAY_MS = 400;
const OUT_INVENTORY = path.resolve('docs/content-inventory.json');
const OUT_MEDIA = path.resolve('docs/media-manifest.json');
const OUT_CSS = path.resolve('docs/crawl-css-summary.json');
const OUT_RAW = path.resolve('docs/crawl-raw');
const DRY = process.argv.includes('--dry');
const WAYBACK = process.argv.includes('--wayback');

type InventoryItem = {
  sourceUrl?: string | null;
  sourceUrls?: string[];
  verbatimBody?: string | null;
  verbatimStatus?: string;
  crawl?: unknown;
  lastModified?: string | null;
  media?: string[];
};

type Inventory = { meta: Record<string, unknown>; documents: Record<string, InventoryItem[]> };

type MediaAsset = { id: string; url: string | null; foundOn: string[]; kind: string; width: number | null; height: number | null; bytes: number | null; format: string | null; alt: string | null; flags: string[]; action: string | null };

type Page = {
  url: string;
  finalUrl: string;
  status: number;
  redirectChain: string[];
  title: string | null;
  metaDescription: string | null;
  canonical: string | null;
  lastModified: string | null;
  headings: { level: number; text: string }[];
  bodyText: string;
  links: string[];
  forms: { action: string | null; fields: { name: string; type: string; label: string | null; required: boolean }[] }[];
  images: { src: string; alt: string | null }[];
  documents: string[];
  stylesheets: string[];
  redBackgrounds: string[];
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithChain(url: string): Promise<{ res: Response; chain: string[] }> {
  const chain: string[] = [];
  let current = url;
  for (let i = 0; i < 6; i++) {
    const res = await fetch(current, { redirect: 'manual', headers: { 'user-agent': UA } });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      chain.push(current);
      current = new URL(res.headers.get('location')!, current).toString();
      continue;
    }
    return { res, chain };
  }
  throw new Error(`Too many redirects from ${url}`);
}

async function crawlPage(url: string): Promise<Page | null> {
  const { res, chain } = await fetchWithChain(url);
  const finalUrl = chain.length ? res.url || url : url;
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('text/html')) return null;
  const html = await res.text();
  const $ = cheerio.load(html);
  $('script, style, noscript, nav, footer, header .cart').remove();
  const main = $('main, #main, .entry-content, article, body').first();
  const headings = $('h1,h2,h3,h4,h5,h6')
    .map((_, el) => ({ level: Number(el.tagName.slice(1)), text: $(el).text().replace(/\s+/g, ' ').trim() }))
    .get();
  const forms = $('form')
    .map((_, f) => ({
      action: $(f).attr('action') ?? null,
      fields: $(f)
        .find('input,select,textarea')
        .map((_, i) => {
          const id = $(i).attr('id');
          const label = id ? $(`label[for="${id}"]`).text().trim() || null : $(i).closest('label').text().trim() || null;
          return { name: $(i).attr('name') ?? '', type: $(i).attr('type') ?? i.tagName, label, required: $(i).is('[required]') };
        })
        .get()
        .filter((f) => f.type !== 'hidden' && f.name),
    }))
    .get();
  const abs = (h: string) => {
    try {
      return new URL(h, finalUrl).toString();
    } catch {
      return null;
    }
  };
  const links = $('a[href]')
    .map((_, a) => abs($(a).attr('href')!))
    .get()
    .filter((l): l is string => !!l);
  const images = $('img')
    .map((_, img) => ({ src: abs($(img).attr('src') ?? $(img).attr('data-src') ?? '') ?? '', alt: $(img).attr('alt') ?? null }))
    .get()
    .filter((i) => i.src);
  const documents = links.filter((l) => /\.(pdf|docx?|xlsx?)$/i.test(l));
  const stylesheets = $('link[rel="stylesheet"][href]')
    .map((_, l) => abs($(l).attr('href')!))
    .get()
    .filter((l): l is string => !!l);
  const redBackgrounds = $('[style*="background"]')
    .filter((_, el) => /#(b[0-9a-f]0[0-9a-f]0[0-9a-f]|8f0605|b50806|c00|d00|e00|ff0000)|rgb\(\s*(1[6-9]\d|2\d\d)\s*,\s*\d{1,2}\s*,\s*\d{1,2}/i.test($(el).attr('style') || ''))
    .map((_, el) => `${el.tagName}.${($(el).attr('class') || '').split(' ').filter(Boolean).join('.')}`)
    .get();
  return {
    url,
    finalUrl,
    status: res.status,
    redirectChain: chain,
    title: $('title').first().text().trim() || null,
    metaDescription: $('meta[name="description"]').attr('content') ?? null,
    canonical: $('link[rel="canonical"]').attr('href') ?? null,
    lastModified: $('meta[property="article:modified_time"]').attr('content') ?? res.headers.get('last-modified') ?? null,
    headings,
    bodyText: main.text().replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim(),
    links,
    forms,
    images,
    documents,
    stylesheets,
    redBackgrounds,
  };
}

async function discoverUrls(): Promise<Set<string>> {
  const urls = new Set<string>();
  for (const host of HOSTS) {
    for (const sm of ['/sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml', '/page-sitemap.xml', '/post-sitemap.xml', '/product-sitemap.xml']) {
      try {
        const res = await fetch(host + sm, { headers: { 'user-agent': UA } });
        if (!res.ok) continue;
        const xml = await res.text();
        for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) urls.add(m[1]);
        await sleep(DELAY_MS);
      } catch {}
    }
    urls.add(host + '/');
  }
  // Seed with everything the inventory already knows.
  const inv = JSON.parse(await readFile(OUT_INVENTORY, 'utf8')) as Inventory;
  for (const items of Object.values(inv.documents)) {
    for (const it of items) {
      if (it.sourceUrl?.startsWith('http')) urls.add(it.sourceUrl.split(' ')[0]);
      for (const u of it.sourceUrls ?? []) if (u.startsWith('http')) urls.add(u);
    }
  }
  return urls;
}

async function waybackRemoved(): Promise<string[]> {
  const out: string[] = [];
  for (const host of ['haart.org.au', 'www.haart.org.au']) {
    const cdx = `https://web.archive.org/cdx/search/cdx?url=${host}/*&output=json&fl=original,timestamp,statuscode&filter=statuscode:200&collapse=urlkey&from=2023`;
    const res = await fetch(cdx, { headers: { 'user-agent': UA } });
    if (!res.ok) continue;
    const rows = (await res.json()) as string[][];
    for (const [original] of rows.slice(1)) out.push(original);
  }
  return out;
}

async function probeImage(url: string) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const dims = imageSize(buf);
    return { width: dims.width ?? null, height: dims.height ?? null, bytes: buf.byteLength, format: dims.type ?? null };
  } catch {
    return null;
  }
}

async function main() {
  const inventory = JSON.parse(await readFile(OUT_INVENTORY, 'utf8')) as Inventory;
  const media = JSON.parse(await readFile(OUT_MEDIA, 'utf8')) as { meta: Record<string, unknown>; assets: MediaAsset[] };
  const queue = [...(await discoverUrls())];
  const seen = new Set<string>();
  const pages: Page[] = [];
  const sameSite = (u: string) => HOSTS.some((h) => u.startsWith(h));

  while (queue.length) {
    const url = queue.shift()!;
    const key = url.replace(/\/$/, '').replace(/^http:/, 'https:');
    if (seen.has(key)) continue;
    seen.add(key);
    try {
      const page = await crawlPage(url);
      if (page) {
        pages.push(page);
        for (const l of page.links) {
          if (sameSite(l) && !/\.(jpe?g|png|gif|webp|svg|pdf|docx?|xlsx?|ics)$/i.test(l) && !/[?#]/.test(l)) queue.push(l);
        }
        process.stdout.write(`${page.status} ${url}\n`);
      }
    } catch (e) {
      process.stdout.write(`ERR ${url} ${(e as Error).message}\n`);
    }
    await sleep(DELAY_MS);
  }

  // Merge verbatim copy into the inventory by source URL.
  const byUrl = new Map(pages.map((p) => [p.url.replace(/\/$/, ''), p]));
  const unknown: string[] = [];
  const known = new Set<string>();
  for (const items of Object.values(inventory.documents)) {
    for (const it of items) {
      const src = (it.sourceUrl ?? '').split(' ')[0].replace(/\/$/, '');
      known.add(src);
      const p = byUrl.get(src) ?? byUrl.get(src.replace('https://haart', 'https://www.haart')) ?? byUrl.get(src.replace('https://www.haart', 'https://haart'));
      if (!p) continue;
      it.verbatimBody = p.bodyText;
      it.verbatimStatus = 'complete';
      it.crawl = { title: p.title, metaDescription: p.metaDescription, canonical: p.canonical, headings: p.headings, forms: p.forms, status: p.status, redirectChain: p.redirectChain, finalUrl: p.finalUrl };
      it.lastModified = p.lastModified;
      it.media = p.images.map((i) => i.src);
    }
  }
  for (const p of pages) if (!known.has(p.url.replace(/\/$/, ''))) unknown.push(p.url);
  inventory.meta.crawledAt = new Date().toISOString();
  inventory.meta.pagesCrawled = pages.length;
  inventory.meta.pagesNotInInventory = unknown; // add these to the inventory and to redirects.ts

  // Media manifest.
  const imageUrls = new Set<string>();
  const found = new Map<string, { pages: Set<string>; alts: Set<string | null> }>();
  for (const p of pages) {
    for (const i of p.images) {
      imageUrls.add(i.src);
      const f = found.get(i.src) ?? { pages: new Set(), alts: new Set() };
      f.pages.add(p.url);
      f.alts.add(i.alt);
      found.set(i.src, f);
    }
    for (const d of p.documents) imageUrls.add(d);
  }
  const assets: MediaAsset[] = media.assets.filter((a) => a.url && !a.url.startsWith('http'));
  for (const url of imageUrls) {
    const f = found.get(url);
    const isDoc = /\.(pdf|docx?|xlsx?)$/i.test(url);
    const probe = isDoc ? null : await probeImage(url);
    await sleep(DELAY_MS / 2);
    const alt = f ? [...f.alts].find((a) => a && a.trim()) ?? null : null;
    const filename = url.split('/').pop() ?? '';
    const flags: string[] = [];
    if (!isDoc && probe && Math.max(probe.width ?? 0, probe.height ?? 0) < 1200) flags.push('lowResolution');
    if (!isDoc && (!alt || alt.replace(/\.[a-z]+$/i, '') === filename.replace(/\.[a-z]+$/i, ''))) flags.push('missingAlt');
    if (probe && probe.bytes > 600_000) flags.push('oversize');
    assets.push({ id: filename, url, foundOn: f ? [...f.pages] : [], kind: isDoc ? 'document' : 'image', ...(probe ?? { width: null, height: null, bytes: null, format: null }), alt, flags, action: null });
  }
  media.assets = assets;
  media.meta.status = 'crawled';
  media.meta.crawledAt = inventory.meta.crawledAt;

  // CSS colours and fonts.
  const cssUrls = new Set(pages.flatMap((p) => p.stylesheets));
  const colours = new Map<string, number>();
  const fonts = new Map<string, number>();
  for (const css of cssUrls) {
    try {
      const txt = await (await fetch(css, { headers: { 'user-agent': UA } })).text();
      for (const m of txt.matchAll(/#(?:[0-9a-f]{3}){1,2}\b/gi)) colours.set(m[0].toLowerCase(), (colours.get(m[0].toLowerCase()) ?? 0) + 1);
      for (const m of txt.matchAll(/font-family\s*:\s*([^;}]+)/gi)) fonts.set(m[1].trim(), (fonts.get(m[1].trim()) ?? 0) + 1);
      await sleep(DELAY_MS);
    } catch {}
  }
  const cssSummary = {
    stylesheets: [...cssUrls],
    colours: [...colours.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60),
    fonts: [...fonts.entries()].sort((a, b) => b[1] - a[1]),
    redBackgroundElements: pages.flatMap((p) => p.redBackgrounds.map((r) => ({ page: p.url, element: r }))),
  };

  let removed: string[] = [];
  if (WAYBACK) {
    const live = new Set(pages.map((p) => p.finalUrl.replace(/\/$/, '')));
    removed = (await waybackRemoved()).filter((u) => !live.has(u.replace(/^http:/, 'https:').replace(/\/$/, '')));
    inventory.meta.waybackOnlyUrls = removed;
  }

  if (DRY) {
    console.log(JSON.stringify({ pages: pages.length, unknown, assets: assets.length, cssSummary, removed }, null, 2));
    return;
  }
  await mkdir(OUT_RAW, { recursive: true });
  for (const p of pages) {
    const name = p.url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_') + '.json';
    await writeFile(path.join(OUT_RAW, name), JSON.stringify(p, null, 2));
  }
  await writeFile(OUT_INVENTORY, JSON.stringify(inventory, null, 2));
  await writeFile(OUT_MEDIA, JSON.stringify(media, null, 2));
  await writeFile(OUT_CSS, JSON.stringify(cssSummary, null, 2));
  console.log(`\nCrawled ${pages.length} pages, ${assets.length} assets. Pages not yet in the inventory: ${unknown.length}.`);
  if (unknown.length) console.log(unknown.map((u) => `  ${u}`).join('\n'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
