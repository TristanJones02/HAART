/**
 * Server-safe helpers for pre-filling a form from the page's search params.
 * Only `animal` is honoured (`?animal=beau-hd26-030` on the application
 * forms, per docs/information-architecture.md). Values are trimmed, capped
 * and stripped of control characters; they are only ever used as the
 * default value of a text input, never rendered as markup.
 */
export type FormPrefill = Record<string, string>;

export type SearchParamsLike = URLSearchParams | Record<string, string | string[] | undefined> | undefined | null;

const MAX_PREFILL_LENGTH = 120;
const CONTROL_CHARS = /[\x00-\x1f\x7f]/g;

function firstValue(params: SearchParamsLike, key: string): string | undefined {
  if (!params) return undefined;
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export function cleanPrefillValue(value: string | undefined): string | undefined {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.replace(CONTROL_CHARS, '').replace(/\s+/g, ' ').trim().slice(0, MAX_PREFILL_LENGTH);
  return cleaned || undefined;
}

/**
 * Turns an animal slug such as `beau-hd26-030` into "Beau HD26-030" so the
 * pre-filled field reads the way HAART writes it. Anything that is not a
 * slug is passed through cleaned but otherwise untouched.
 */
export function animalFromSlug(slug: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return slug;
  return slug
    .split('-')
    .map((part) => (/^h[cd]\d{2}$/.test(part) ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(' ')
    .replace(/(H[CD]\d{2}) (\d+)/, '$1-$2');
}

export function prefillFromSearchParams(searchParams: SearchParamsLike): FormPrefill {
  const prefill: FormPrefill = {};
  const animal = cleanPrefillValue(firstValue(searchParams, 'animal'));
  if (animal) prefill.animal = animalFromSlug(animal);
  return prefill;
}

/** Reads the no-JavaScript round trip: `?sent=1` or `?error=1` after a redirect from /api/forms. */
export function formStatusFromSearchParams(searchParams: SearchParamsLike): 'sent' | 'error' | undefined {
  if (firstValue(searchParams, 'sent') === '1') return 'sent';
  if (firstValue(searchParams, 'error') === '1') return 'error';
  return undefined;
}
