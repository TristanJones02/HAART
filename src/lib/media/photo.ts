import sharp from 'sharp';
import { extractHaartId } from '@/lib/animals/types';

/**
 * Turning a volunteer's phone photo into something a web page can carry.
 *
 * This is the pipeline half of the brief's "handle huge volunteer photos at
 * the pipeline level": a 12MP JPEG straight off a phone is five megabytes and
 * frequently sideways, and it must never reach a browser in that state.
 * scripts/import-photos.ts is the command-line wrapper around this.
 */

export type ProcessOptions = {
  /** Longest edge in pixels. Photos smaller than this are left alone. */
  maxEdge?: number;
  quality?: number;
};

export type ProcessedPhoto = {
  jpeg: Buffer;
  /** A 24px-wide data URI for the blur-up placeholder. */
  lqip: string;
  width: number;
  height: number;
  /** Dimensions of the original, before the cap. */
  sourceWidth: number;
  sourceHeight: number;
  hadExif: boolean;
  hadGps: boolean;
};

export const DEFAULT_MAX_EDGE = 2400;
export const DEFAULT_QUALITY = 82;

/**
 * Does this EXIF block carry a GPS IFD?
 *
 * The buffer is a TIFF header — byte order, 42, offset to IFD0 — followed by
 * IFD0's entries. Each entry is twelve bytes and the first two are its tag;
 * 0x8825 points at the GPS IFD. We never read the coordinates, only report
 * that they were there, because for a foster-based rescue a geotag on a photo
 * of a dog in a lounge room is a carer's home address.
 */
export function hasGps(exif: Buffer | Uint8Array | undefined): boolean {
  if (!exif || exif.length < 16) return false;
  const buf = Buffer.isBuffer(exif) ? exif : Buffer.from(exif);
  // Some encoders keep the "Exif\0\0" preamble in front of the TIFF header.
  const base = buf.subarray(buf.subarray(0, 6).toString('latin1') === 'Exif\0\0' ? 6 : 0);
  const order = base.subarray(0, 2).toString('latin1');
  if (order !== 'II' && order !== 'MM') return false;
  const le = order === 'II';
  const u16 = (o: number) => (le ? base.readUInt16LE(o) : base.readUInt16BE(o));
  const u32 = (o: number) => (le ? base.readUInt32LE(o) : base.readUInt32BE(o));
  if (base.length < 8) return false;
  const ifd0 = u32(4);
  if (ifd0 + 2 > base.length) return false;
  const count = u16(ifd0);
  for (let i = 0; i < count; i++) {
    const entry = ifd0 + 2 + i * 12;
    if (entry + 12 > base.length) break;
    if (u16(entry) === 0x8825) return true;
  }
  return false;
}

/**
 * The animal a photo belongs to, read from anywhere in its path: a folder
 * named "HD26-044", a file named "HD26-044 Rosemary 3.jpg", or the messier
 * "hd26 - 44" that the old site used. Never guessed from anything else.
 */
export function haartIdFromPath(relativePath: string): string | null {
  return extractHaartId(relativePath.replace(/[/\\_]+/g, ' '));
}

/**
 * Orientation applied, metadata dropped, longest edge capped, re-encoded.
 *
 * `.rotate()` with no argument bakes in the EXIF orientation and discards it,
 * which is the only way a sideways phone photo comes out upright. sharp writes
 * no metadata unless asked, so the output carries no EXIF, no GPS and no IPTC.
 */
export async function processPhoto(input: Buffer, options: ProcessOptions = {}): Promise<ProcessedPhoto> {
  const maxEdge = options.maxEdge ?? DEFAULT_MAX_EDGE;
  const quality = options.quality ?? DEFAULT_QUALITY;
  const pipeline = sharp(input, { failOn: 'none' }).rotate();
  const meta = await pipeline.metadata();

  const resized = pipeline.clone().resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true });
  const jpeg = await resized.jpeg({ quality, mozjpeg: true, progressive: true }).toBuffer({ resolveWithObject: true });
  const lqip = await pipeline.clone().resize({ width: 24 }).jpeg({ quality: 40 }).toBuffer();

  return {
    jpeg: jpeg.data,
    lqip: `data:image/jpeg;base64,${lqip.toString('base64')}`,
    width: jpeg.info.width,
    height: jpeg.info.height,
    sourceWidth: meta.width ?? 0,
    sourceHeight: meta.height ?? 0,
    hadExif: Boolean(meta.exif?.length),
    hadGps: hasGps(meta.exif),
  };
}
