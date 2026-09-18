import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { DEFAULT_MAX_EDGE, haartIdFromPath, hasGps, processPhoto } from './photo';

/** A minimal little-endian TIFF EXIF block with `count` IFD0 entries. */
function exif(tags: number[], { bigEndian = false, preamble = false } = {}): Buffer {
  const body = Buffer.alloc(8 + 2 + tags.length * 12 + 4);
  const w16 = (o: number, v: number) => (bigEndian ? body.writeUInt16BE(v, o) : body.writeUInt16LE(v, o));
  const w32 = (o: number, v: number) => (bigEndian ? body.writeUInt32BE(v, o) : body.writeUInt32LE(v, o));
  body.write(bigEndian ? 'MM' : 'II', 0, 'latin1');
  w16(2, 42);
  w32(4, 8); // IFD0 starts right after the header
  w16(8, tags.length);
  tags.forEach((tag, i) => {
    const at = 10 + i * 12;
    w16(at, tag);
    w16(at + 2, 3); // SHORT
    w32(at + 4, 1);
    w32(at + 8, 0);
  });
  return preamble ? Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), body]) : body;
}

const GPS_IFD_POINTER = 0x8825;
const ORIENTATION = 0x0112;

describe('hasGps', () => {
  it('finds the GPS IFD pointer in either byte order, with or without the Exif preamble', () => {
    expect(hasGps(exif([ORIENTATION, GPS_IFD_POINTER]))).toBe(true);
    expect(hasGps(exif([GPS_IFD_POINTER], { bigEndian: true }))).toBe(true);
    expect(hasGps(exif([ORIENTATION, GPS_IFD_POINTER], { preamble: true }))).toBe(true);
  });

  it('is false for EXIF without a GPS IFD', () => {
    expect(hasGps(exif([ORIENTATION, 0x010f, 0x0110]))).toBe(false);
    expect(hasGps(exif([]))).toBe(false);
  });

  it('never throws on rubbish, because one bad photo must not stop an import', () => {
    expect(hasGps(undefined)).toBe(false);
    expect(hasGps(Buffer.alloc(0))).toBe(false);
    expect(hasGps(Buffer.from('not exif at all'))).toBe(false);
    // A truncated block: the entry count claims more entries than exist.
    const truncated = exif([GPS_IFD_POINTER]).subarray(0, 14);
    expect(hasGps(truncated)).toBe(false);
    expect(hasGps(new Uint8Array([0x49, 0x49, 42, 0, 255, 255, 255, 255]))).toBe(false);
  });
});

describe('haartIdFromPath', () => {
  it('reads the id from a folder, a filename or the messy old format', () => {
    expect(haartIdFromPath('HD26-044/IMG_4821.jpg')).toBe('HD26-044');
    expect(haartIdFromPath('Rosemary HD26-044/IMG_4822.jpeg')).toBe('HD26-044');
    expect(haartIdFromPath('unsorted/hd26 - 44 again.jpg')).toBe('HD26-044');
    expect(haartIdFromPath('cats/HC25-028_sabrina_01.jpg')).toBe('HC25-028');
  });

  it('returns null rather than guessing', () => {
    expect(haartIdFromPath('unsorted/kelpie.png')).toBeNull();
    expect(haartIdFromPath('2026-01-04 market day/IMG_0012.jpg')).toBeNull();
  });
});

const solid = (width: number, height: number) =>
  sharp({ create: { width, height, channels: 3, background: { r: 140, g: 120, b: 90 } } })
    .jpeg({ quality: 95 })
    .toBuffer();

describe('processPhoto', () => {
  it('caps the longest edge whichever way the photo is turned', async () => {
    const landscape = await processPhoto(await solid(4032, 3024));
    expect([landscape.width, landscape.height]).toEqual([DEFAULT_MAX_EDGE, 1800]);
    const portrait = await processPhoto(await solid(3024, 4032));
    expect([portrait.width, portrait.height]).toEqual([1800, DEFAULT_MAX_EDGE]);
  });

  it('never upscales a small photo', async () => {
    const small = await processPhoto(await solid(800, 600));
    expect([small.width, small.height]).toEqual([800, 600]);
  });

  it('strips every scrap of metadata, GPS included', async () => {
    const withGps = await sharp({ create: { width: 1200, height: 900, channels: 3, background: { r: 10, g: 10, b: 10 } } })
      .withExif({ IFD0: { Copyright: 'HAART' }, IFD3: { GPSLatitudeRef: 'S' } })
      .jpeg()
      .toBuffer();
    const before = await sharp(withGps).metadata();
    expect(hasGps(before.exif)).toBe(true);

    const out = await processPhoto(withGps);
    expect(out.hadGps).toBe(true); // reported...
    const after = await sharp(out.jpeg).metadata();
    expect(after.exif).toBeUndefined(); // ...and gone from what we would upload
    expect(after.icc).toBeUndefined();
  });

  it('shrinks a phone-sized photo by an order of magnitude and carries an LQIP', async () => {
    const source = await solid(4032, 3024);
    const out = await processPhoto(source);
    expect(out.jpeg.byteLength).toBeLessThan(source.byteLength);
    expect(out.sourceWidth).toBe(4032);
    expect(out.lqip.startsWith('data:image/jpeg;base64,')).toBe(true);
    // Small enough to sit inline in the HTML without costing anything.
    expect(out.lqip.length).toBeLessThan(2000);
  });
});
