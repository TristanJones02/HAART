/**
 * Builds a zod schema from a form definition and parses submissions with
 * friendly, field-keyed error messages. Works on the server (API route) and
 * in the browser (instant validation before the round trip).
 *
 * Every value arrives as a string, an array of strings or a boolean, whether
 * the body was JSON or form-encoded, so the schema normalises first:
 * checkboxes accept `true`, "on", "true", "1" and "yes"; checkbox groups
 * accept a single string or an array. Unknown keys are stripped.
 */
import { z } from 'zod';
import type { FormId } from '@/lib/content/types';
import { FORM_DEFINITIONS, formFields, isFormId, type FieldDef, type FormDefinition } from './definitions';
import { plainLabel } from './label';

export const HONEYPOT_FIELD = 'website';
export const FORM_ID_FIELD = '_form';
export const REDIRECT_FIELD = '_redirect';

export type SubmissionValue = string | boolean | string[];
export type SubmissionData = Record<string, SubmissionValue>;

export type ParseResult = { ok: true; data: SubmissionData } | { ok: false; errors: Record<string, string> };

const TRUE_STRINGS = new Set(['on', 'true', '1', 'yes']);

const toText = (v: unknown): string => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim());
const toBool = (v: unknown): boolean => v === true || (typeof v === 'string' && TRUE_STRINGS.has(v.trim().toLowerCase()));
const toList = (v: unknown): string[] =>
  v == null || v === '' ? [] : Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : typeof v === 'string' ? [v] : [];

const lower = (label: string) => {
  const text = plainLabel(label).replace(/\?$/, '');
  return text.charAt(0).toLowerCase() + text.slice(1);
};

/** Required-message per type, in HAART's voice ("Enter your suburb", "Choose an option"). */
function requiredMessage(field: FieldDef): string {
  switch (field.type) {
    case 'select':
    case 'radio':
      return 'Choose an option';
    case 'checkboxes':
      return 'Choose at least one option';
    case 'checkbox':
      return 'Tick this box to continue';
    case 'date':
      return 'Enter a date';
    case 'email':
      return 'Enter your email address';
    case 'tel':
      return 'Enter a phone number we can reach you on';
    default:
      return `Enter ${lower(field.label)}`.replace(/^Enter (full name)$/, 'Enter your $1');
  }
}

function textSchema(field: FieldDef) {
  let s = z.string();
  if (field.required) s = s.min(1, requiredMessage(field));
  if (field.maxLength) s = s.max(field.maxLength, `Keep this under ${field.maxLength} characters`);
  return s;
}

function fieldSchema(field: FieldDef): z.ZodType {
  const values = (field.options ?? []).map((o) => o.value);

  switch (field.type) {
    case 'text':
    case 'textarea':
      return z.preprocess(toText, textSchema(field));

    case 'email': {
      const format = z.email({ error: 'Enter an email address like name@example.com' });
      const base = field.required
        ? z.string().min(1, requiredMessage(field)).pipe(format)
        : z.string().refine((v) => v === '' || format.safeParse(v).success, 'Enter an email address like name@example.com');
      return z.preprocess(toText, field.maxLength ? base.pipe(z.string().max(field.maxLength, 'That email address is too long')) : base);
    }

    case 'tel':
      // Loose on purpose: people write "0412 345 678", "(08) 6336 9410" or "+61 4...".
      return z.preprocess(
        toText,
        textSchema(field).refine(
          (v) => v === '' || ((v.match(/\d/g)?.length ?? 0) >= 6 && /^[+\d\s()./-]+$/.test(v)),
          'Enter a phone number, including the area code',
        ),
      );

    case 'number':
      return z.preprocess(toText, textSchema(field).refine((v) => v === '' || /^\d+$/.test(v), 'Enter a whole number'));

    case 'date':
      return z.preprocess(
        toText,
        textSchema(field).refine((v) => v === '' || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))), 'Enter a date'),
      );

    case 'select':
    case 'radio': {
      const inList = (v: string) => v === '' || values.includes(v);
      const s = field.required
        ? z.string().min(1, requiredMessage(field)).pipe(z.enum(values as [string, ...string[]], { error: 'Choose one of the listed options' }))
        : z.string().refine(inList, 'Choose one of the listed options');
      return z.preprocess(toText, s);
    }

    case 'checkbox':
      return z.preprocess(toBool, field.required ? z.literal(true, { error: requiredMessage(field) }) : z.boolean());

    case 'checkboxes': {
      let s = z.array(z.enum(values as [string, ...string[]], { error: 'Choose from the listed options' }));
      if (field.required) s = s.min(1, requiredMessage(field));
      return z.preprocess(toList, s);
    }
  }
}

const schemaCache = new Map<FormId, z.ZodObject>();

/** A zod object for one form: every field, plus the honeypot and the form id. */
export function buildSchema(def: FormDefinition): z.ZodObject {
  const cached = schemaCache.get(def.id);
  if (cached) return cached;

  const shape: Record<string, z.ZodType> = {};
  for (const field of formFields(def)) shape[field.name] = fieldSchema(field);

  // Honeypot: real people never see it, so anything in it means a bot.
  shape[HONEYPOT_FIELD] = z.preprocess(toText, z.string().max(0, 'Leave this field empty'));
  shape[FORM_ID_FIELD] = z.preprocess(toText, z.literal(def.id, { error: 'This form does not match the page it was sent from' }));

  const schema = z.object(shape);
  schemaCache.set(def.id, schema);
  return schema;
}

/** True when the honeypot field has anything in it. Checked before parsing so bots get a bland 200. */
export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return Array.isArray(value) ? value.some((v) => toText(v) !== '') : toText(value) !== '';
}

/**
 * Validates a raw body against the form's schema. On success `data` holds
 * the answers only (honeypot and form id removed); on failure `errors` maps
 * field name to one friendly message. Error responses never echo values.
 */
export function parseSubmission(id: string, data: Record<string, unknown>): ParseResult {
  if (!isFormId(id)) return { ok: false, errors: { [FORM_ID_FIELD]: 'Unknown form' } };

  const def = FORM_DEFINITIONS[id];
  const result = buildSchema(def).safeParse({ ...data, [FORM_ID_FIELD]: data[FORM_ID_FIELD] ?? id });
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? FORM_ID_FIELD);
      if (!(key in errors)) errors[key] = issue.message;
    }
    return { ok: false, errors };
  }

  const parsed = result.data as Record<string, unknown>;
  const answers: SubmissionData = {};
  for (const field of formFields(def)) {
    const value = parsed[field.name];
    if (typeof value === 'string' || typeof value === 'boolean' || Array.isArray(value)) answers[field.name] = value as SubmissionValue;
  }
  return { ok: true, data: answers };
}
