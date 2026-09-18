/**
 * Plates: flat two-and-a-half-colour woodcuts on a 400x300 viewBox.
 *
 * The rulebook, enforced by review rather than by code:
 *   no smiling mouths, no expressive eyes, no whiskers on dogs, no hearts,
 *   no paw prints, no collars, no props, at most one accent beyond ink and
 *   tint, animals oriented into the content, puppies drawn at true proportion.
 *
 * A 3/4 portrait frame slices roughly 44% off each side, so every plate's
 * primary mass sits inside x in [90, 310]. Anything outside that lives in
 * <g data-crop="wide">, with a portrait replacement in <g data-crop="tall">.
 * PlateFrame sets data-ratio on the wrapper and two lines of CSS switch them.
 */
export type PlateProps = {
  /** Where the drawing anchors when the frame crops it. */
  className?: string;
};

export const PLATE_VIEWBOX = '0 0 400 300';

/** ground = background, ink = the animal mass, tint = ears, highlights, nose. */
export const GROUND = 'var(--plate-ground)';
export const INK = 'var(--plate-ink)';
export const TINT = 'var(--plate-tint)';
