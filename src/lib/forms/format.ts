/**
 * Turns a parsed submission into the plain-text email volunteers read, and
 * picks the submitter's name and email for the subject and reply-to.
 */
import type { FieldDef, FormDefinition } from './definitions';
import { formFields } from './definitions';
import { plainLabel } from './label';
import type { SubmissionData, SubmissionValue } from './schema';

function optionLabel(field: FieldDef, value: string): string {
  return field.options?.find((o) => o.value === value)?.label ?? value;
}

/** A human-readable answer: option labels rather than values, "Yes"/"No" for ticks, "(not answered)" for blanks. */
export function formatAnswer(field: FieldDef, value: SubmissionValue | undefined): string {
  if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) return '(not answered)';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.map((v) => optionLabel(field, v)).join(', ');
  return optionLabel(field, value);
}

/** The whole submission as text, one section per heading, every field listed even if blank. */
export function formatSubmissionText(def: FormDefinition, data: SubmissionData, receivedAt = new Date()): string {
  const lines: string[] = [`${def.title}`, `Received ${receivedAt.toISOString()} via haart.org.au`, ''];
  for (const section of def.sections) {
    lines.push(section.heading.toUpperCase(), '');
    for (const field of section.fields) {
      const answer = formatAnswer(field, data[field.name]);
      const label = plainLabel(field.label);
      if (answer.includes('\n')) lines.push(`${label}:`, ...answer.split('\n').map((l) => `  ${l}`));
      else lines.push(`${label}: ${answer}`);
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}

/** The submitter's email: the first email-type field with a value. */
export function submitterEmail(def: FormDefinition, data: SubmissionData): string | undefined {
  const field = formFields(def).find((f) => f.type === 'email' && typeof data[f.name] === 'string' && data[f.name] !== '');
  return field ? (data[field.name] as string) : undefined;
}

/** The submitter's name for the subject line: the `name` autocomplete field, then the organisation, then a fallback. */
export function submitterName(def: FormDefinition, data: SubmissionData): string {
  const fields = formFields(def);
  for (const auto of ['name', 'organization']) {
    const field = fields.find((f) => f.autoComplete === auto && typeof data[f.name] === 'string' && data[f.name] !== '');
    if (field) return data[field.name] as string;
  }
  return 'website visitor';
}

/** `[haart.org.au] Contact us from Jane Citizen`, with line breaks stripped so a name cannot inject headers. */
export function emailSubject(def: FormDefinition, data: SubmissionData): string {
  const name = submitterName(def, data).replace(/[\r\n]+/g, ' ').slice(0, 80);
  return `[haart.org.au] ${def.title} from ${name}`;
}
