/**
 * import-photos.ts
 *
 * Bulk-ingest volunteer photographs: straight off a phone, any size, any
 * orientation, into Sanity as web-sized assets attached to the right animal.
 *
 *   pnpm import:photos ~/haart-photos                 # scan and process, upload nothing
 *   pnpm import:photos ~/haart-photos --csv           # also write a spreadsheet for alt text
 *   pnpm import:photos ~/haart-photos --execute       # upload and attach
 *   pnpm import:photos ~/haart-photos --max 3000 --quality 86
 *
 * The scan is the important half. It writes docs/photo-manifest.json with one
 * row per photo and NO alt text, because alt text is the one thing a script
 * cannot invent. A volunteer fills the `alt` column in (`--csv` writes the
 * same rows as a spreadsheet), then the same command with --execute uploads.
 * Rows still missing alt text are skipped and counted, so a half-filled
 * manifest imports the half that is ready, and a re-scan after new photos
 * arrive keeps the alt text already written.
 *
 * Which animal a photo belongs to comes from a HAART id anywhere in its path:
 * a folder named "HD26-044", a file named "HD26-044 Rosemary 3.jpg", or
 * "hd26 - 44" — all resolve to the same animal. Photos with no id land in the
 * manifest unassigned and are reported, never guessed at.
 *
 * The image work — orientation, metadata stripping, the size cap, the LQIP —
 * lives in src/lib/media/photo.ts with its tests. HEIC/HEIF from an iPhone is
 * read natively; nothing needs converting first.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DEFAULT_MAX_EDGE, DEFAULT_QUALITY, haartIdFromPath, processPhoto } from '../src/lib/media/photo';

const ARGS = process.argv.slice(2);
const EXECUTE = ARGS.includes('--execute');
const AS_CSV = ARGS.includes('--csv');
const SOURCE = ARGS.find((a) => !a.startsWith('--'));
const MAX_EDGE = Number(flag('--max') ?? DEFAULT_MAX_EDGE);
const QUALITY = Number(flag('--quality') ?? DEFAULT_QUALITY);

const MANIFEST = path.resolve('docs/photo-manifest.json');
const CSV = path.resolve('docs/photo-manifest.csv');
const CACHE = path.resolve('.photo-cache');
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp', '.tif', '.tiff', '.avif']);
/** Alt text shorter than this is not a description; the Studio enforces the same floor. */
const MIN_ALT = 8;

function flag(name: string): string | undefined {
  const i = ARGS.indexOf(name);
  if (i >= 0 && ARGS[i + 1] && !ARGS[i + 1].startsWith('--')) return ARGS[i + 1];
  return ARGS.find((a) => a.startsWith(`${name}=`))?.split('=')[1];
}

type Row = {
  /** Relative to the source folder, so the manifest survives the folder moving. */
  source: string;
  sha1: string;
  haartId: string | null;
  /** Filled in by a human. Nothing uploads without it. */
  alt: string;
  caption?: string;
  /** Tick for injury or neglect photos; the site blurs them behind a reveal. */
  sensitive?: boolean;
  width: number;
  height: number;
  bytesIn: number;
  bytesOut: number;
  hadExif: boolean;
  hadGps: boolean;
  lqip: string;
  cached: string;
  assetId?: string;
  error?: string;
};

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function scanOne(file: string, root: string): Promise<Row> {
  const source = path.relative(root, file);
  const buf = await readFile(file);
  const sha1 = createHash('sha1').update(buf).digest('hex');
  const row: Row = {
    source,
    sha1,
    haartId: haartIdFromPath(source),
    alt: '',
    width: 0,
    height: 0,
    bytesIn: buf.byteLength,
    bytesOut: 0,
    hadExif: false,
    hadGps: false,
    lqip: '',
    cached: '',
  };
  try {
    const out = await processPhoto(buf, { maxEdge: MAX_EDGE, quality: QUALITY });
    row.width = out.sourceWidth;
    row.height = out.sourceHeight;
    row.bytesOut = out.jpeg.byteLength;
    row.hadExif = out.hadExif;
    row.hadGps = out.hadGps;
    row.lqip = out.lqip;
    // Keyed on content, so a re-scan after adding photos is cheap and
    // --execute never re-encodes what it is about to upload.
    row.cached = path.join(CACHE, `${sha1}.jpg`);
    await writeFile(row.cached, out.jpeg);
  } catch (e) {
    row.error = e instanceof Error ? e.message : String(e);
  }
  return row;
}

function csv(rows: Row[]): string {
  const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const head = ['source', 'haartId', 'alt', 'caption', 'sensitive', 'width', 'height', 'hadGps', 'sha1'] as const;
  return [head.join(','), ...rows.map((r) => head.map((h) => cell(r[h])).join(','))].join('\n') + '\n';
}

function report(rows: Row[]) {
  const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;
  const ok = rows.filter((r) => !r.error);
  const gps = ok.filter((r) => r.hadGps);
  const unassigned = ok.filter((r) => !r.haartId);
  console.log(`\n${rows.length} photos, ${rows.length - ok.length} unreadable`);
  console.log(`  ${mb(ok.reduce((s, r) => s + r.bytesIn, 0))} in → ${mb(ok.reduce((s, r) => s + r.bytesOut, 0))} out`);
  console.log(`  ${new Set(ok.map((r) => r.haartId).filter(Boolean)).size} animals matched, ${unassigned.length} photos with no HAART id in their path`);
  if (gps.length) {
    console.log(`\n  ⚠ ${gps.length} photos carry GPS coordinates. They are stripped here, but the`);
    console.log("    originals still hold them — and for a foster-based rescue those are");
    console.log('    carers’ home addresses if the files have ever been shared directly.');
  }
  for (const r of rows.filter((r) => r.error).slice(0, 10)) console.log(`  ✗ ${r.source}: ${r.error}`);
}

async function main() {
  if (!SOURCE) {
    console.error('Usage: pnpm import:photos <folder> [--execute] [--csv] [--max 2400] [--quality 82]');
    process.exit(1);
  }
  const root = path.resolve(SOURCE);
  if (!(await stat(root).catch(() => null))?.isDirectory()) {
    console.error(`Not a folder: ${root}`);
    process.exit(1);
  }
  await mkdir(CACHE, { recursive: true });

  const files = await walk(root);
  console.log(`Scanning ${files.length} photos in ${root}`);

  // Carry alt text already written into a previous manifest, so re-running the
  // scan after new photos arrive never loses a volunteer's work. Looked up by
  // path first, then by content: the same photo often sits in two folders, and
  // Sanity dedupes those into one asset anyway, so a description written once
  // should find every copy. A described row always beats an undescribed one.
  const bySource = new Map<string, Row>();
  const bySha = new Map<string, Row>();
  const described = (r: Row | undefined) => (r?.alt ?? '').trim().length >= MIN_ALT;
  try {
    for (const r of JSON.parse(await readFile(MANIFEST, 'utf8')) as Row[]) {
      bySource.set(r.source, r);
      if (described(r) || !described(bySha.get(r.sha1))) bySha.set(r.sha1, r);
    }
  } catch {
    /* first run */
  }

  const rows: Row[] = [];
  for (let i = 0; i < files.length; i += 8) {
    const batch = await Promise.all(files.slice(i, i + 8).map((f) => scanOne(f, root)));
    for (const row of batch) {
      const exact = bySource.get(row.source);
      const prior = described(exact) ? exact : (described(bySha.get(row.sha1)) ? bySha.get(row.sha1) : exact) ?? bySha.get(row.sha1);
      if (prior) Object.assign(row, { alt: prior.alt, caption: prior.caption, sensitive: prior.sensitive, assetId: prior.assetId, haartId: row.haartId ?? prior.haartId });
      rows.push(row);
    }
    if (files.length > 50) process.stdout.write(`\r  ${Math.min(i + 8, files.length)}/${files.length}`);
  }
  if (files.length > 50) process.stdout.write('\n');

  await writeFile(MANIFEST, JSON.stringify(rows, null, 2) + '\n');
  if (AS_CSV) await writeFile(CSV, csv(rows));
  report(rows);
  console.log(`\nManifest → ${path.relative(process.cwd(), MANIFEST)}${AS_CSV ? ` and ${path.relative(process.cwd(), CSV)}` : ''}`);

  const ready = rows.filter((r) => !r.error && r.haartId && r.alt.trim().length >= MIN_ALT);
  const waiting = rows.filter((r) => !r.error && r.haartId && r.alt.trim().length < MIN_ALT);
  if (!EXECUTE) {
    console.log(`\nDry run. ${ready.length} rows have alt text and an animal and would upload.`);
    if (waiting.length) console.log(`${waiting.length} rows are waiting on alt text — fill the "alt" field in, then re-run with --execute.`);
    return;
  }
  await upload(rows, ready, waiting.length);
}

async function upload(all: Row[], ready: Row[], waiting: number) {
  try {
    process.loadEnvFile?.(path.resolve('.env.local'));
  } catch {
    /* no .env.local */
  }
  const { getWriteClient } = await import('../src/lib/sanity/client');
  const client = getWriteClient();
  if (!client) {
    console.error('No write client: set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local');
    process.exit(1);
  }
  if (!ready.length) {
    console.log('Nothing to upload: no row has both alt text and a HAART id.');
    return;
  }

  const byAnimal = new Map<string, Row[]>();
  for (const r of ready) byAnimal.set(r.haartId!, [...(byAnimal.get(r.haartId!) ?? []), r]);

  for (const [haartId, photos] of byAnimal) {
    const doc = await client.fetch<{ _id: string; photos?: { asset?: { _ref?: string } }[] } | null>('*[_type == "animal" && upper(haartId) == $id][0]{_id, photos}', { id: haartId });
    if (!doc) {
      console.log(`  ? ${haartId}: no animal document, skipped ${photos.length} photo(s)`);
      continue;
    }
    const existing = new Set((doc.photos ?? []).map((p) => p.asset?._ref).filter(Boolean) as string[]);
    const additions: Record<string, unknown>[] = [];
    for (const r of photos) {
      // Sanity keys assets on their content hash, so re-uploading the same
      // bytes returns the same asset id and a second run adds nothing.
      const asset = await client.assets.upload('image', await readFile(r.cached), { filename: path.basename(r.source), title: r.alt });
      r.assetId = asset._id;
      if (existing.has(asset._id)) continue;
      existing.add(asset._id);
      additions.push({
        _key: asset._id.replace(/[^a-z0-9]/gi, '').slice(0, 12),
        _type: 'imageWithAlt',
        asset: { _type: 'reference', _ref: asset._id },
        alt: r.alt,
        ...(r.caption ? { caption: r.caption } : {}),
        ...(r.sensitive ? { sensitive: true } : {}),
      });
    }
    if (additions.length) await client.patch(doc._id).setIfMissing({ photos: [] }).append('photos', additions).commit();
    console.log(`  ✓ ${haartId}: ${additions.length} added, ${photos.length - additions.length} already there`);
  }

  // Asset ids go back into the manifest so a re-run knows what is already up.
  await writeFile(MANIFEST, JSON.stringify(all, null, 2) + '\n');
  console.log(`\nDone. ${waiting} photo(s) still waiting on alt text.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
