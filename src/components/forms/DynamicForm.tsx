'use client';

import { Check } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react';
import { track } from '@/lib/analytics';
import type { FieldDef, FormDefinition } from '@/lib/forms/definitions';
import { formFields } from '@/lib/forms/definitions';
import { labelParts, plainLabel } from '@/lib/forms/label';
import { FORM_ID_FIELD, HONEYPOT_FIELD, REDIRECT_FIELD, parseSubmission } from '@/lib/forms/schema';
import { Button } from '@/components/ui/Button';
import { Checkbox, CheckboxGroup } from '@/components/ui/Checkbox';
import { Fieldset } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

export type DynamicFormProps = {
  definition: FormDefinition;
  /** Default values by field name, e.g. `{ animal: 'Beau HD26-030' }` from `prefillFromSearchParams`. */
  prefill?: Record<string, string>;
  /**
   * Result of a no-JavaScript round trip (`?sent=1` or `?error=1` after the
   * API redirected back). Pass `formStatusFromSearchParams(searchParams)`.
   * When omitted the component reads the query string itself after mount.
   */
  initialStatus?: 'sent' | 'error';
  className?: string;
};

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'invalid'; errors: Record<string, string> }
  | { kind: 'failed'; message: string };

const NETWORK_FAILURE = 'We could not send your form. Check your connection and try again, or email info@haart.org.au.';
const GENERIC_FAILURE = 'Something went wrong sending your form. Please try again, or email info@haart.org.au.';
const NOJS_FAILURE = 'Something went wrong sending your form. Please check your answers and try again, or email info@haart.org.au.';

// Client-only facts read through useSyncExternalStore so the server render and
// the hydration render agree, then the client re-renders with the real value.
const noopSubscribe = () => () => {};
const isClient = () => true;
const isServer = () => false;
function statusFromLocation(): 'sent' | 'error' | undefined {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sent') === '1') return 'sent';
    if (params.get('error') === '1') return 'error';
  } catch {
    // ignore
  }
  return undefined;
}
const noStatus = () => undefined;

function statusFor(flag: 'sent' | 'error' | undefined): Status {
  return flag === 'sent' ? { kind: 'sent' } : flag === 'error' ? { kind: 'failed', message: NOJS_FAILURE } : { kind: 'idle' };
}

/** Renders a label string, turning `[text](/path)` into links. */
function renderLabel(label: string): ReactNode {
  const parts = labelParts(label);
  if (parts.length === 1 && !parts[0].href) return label;
  return parts.map((part, i) =>
    part.href ? (
      <a key={i} href={part.href} className="font-semibold underline underline-offset-4" target="_blank" rel="noopener">
        {part.text}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ) : (
      <span key={i}>{part.text}</span>
    ),
  );
}

function summaryLabel(field: FieldDef): string {
  const text = plainLabel(field.label).replace(/\?$/, '');
  return text.length > 70 ? `${text.slice(0, 67).trimEnd()}…` : text;
}

/** Reads the form into the shape the API expects: booleans for checkboxes, arrays for checkbox groups, strings otherwise. */
function collect(form: HTMLFormElement, definition: FormDefinition): Record<string, unknown> {
  const fd = new FormData(form);
  const body: Record<string, unknown> = {
    [FORM_ID_FIELD]: definition.id,
    [HONEYPOT_FIELD]: String(fd.get(HONEYPOT_FIELD) ?? ''),
  };
  for (const field of formFields(definition)) {
    if (field.type === 'checkbox') body[field.name] = fd.get(field.name) === 'on';
    else if (field.type === 'checkboxes') body[field.name] = fd.getAll(field.name).filter((v): v is string => typeof v === 'string');
    else body[field.name] = String(fd.get(field.name) ?? '');
  }
  return body;
}

function inputType(field: FieldDef): string {
  // Numbers use a text input with a numeric keyboard: no spinner, no scroll-wheel accidents.
  return field.type === 'number' ? 'text' : field.type;
}

function inputMode(field: FieldDef): 'numeric' | 'tel' | 'email' | undefined {
  if (field.type === 'number' || field.autoComplete === 'postal-code') return 'numeric';
  if (field.type === 'tel') return 'tel';
  if (field.type === 'email') return 'email';
  return undefined;
}

export function DynamicForm({ definition, prefill, initialStatus, className = '' }: DynamicFormProps) {
  const pathname = usePathname() ?? '/';
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, '');
  const fieldId = useCallback((name: string) => `form-${uid}-${name}`, [uid]);
  const honeypotId = `form-${uid}-hp`;

  const [ownStatus, setStatus] = useState<Status>(() => statusFor(initialStatus));
  // Native validation runs when there is no JavaScript; once hydrated the component takes over.
  const hydrated = useSyncExternalStore(noopSubscribe, isClient, isServer);
  // Fallback for the no-JavaScript round trip when the page did not pass `initialStatus`.
  const urlStatus = useSyncExternalStore(noopSubscribe, statusFromLocation, noStatus);
  const status = useMemo<Status>(
    () => (ownStatus.kind === 'idle' && initialStatus === undefined && urlStatus ? statusFor(urlStatus) : ownStatus),
    [ownStatus, initialStatus, urlStatus],
  );
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status.kind === 'invalid' || status.kind === 'failed') summaryRef.current?.focus();
    if (status.kind === 'sent') successRef.current?.focus();
  }, [status]);

  const fields = formFields(definition);
  const fieldByName = new Map(fields.map((f) => [f.name, f]));
  const errors = status.kind === 'invalid' ? status.errors : {};

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = collect(event.currentTarget, definition);

    const local = parseSubmission(definition.id, body);
    if (!local.ok) {
      setStatus({ kind: 'invalid', errors: local.errors });
      return;
    }

    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(body),
      });
      const json: { ok?: boolean; errors?: Record<string, string>; message?: string } | null = await res.json().catch(() => null);

      if (res.ok && json?.ok) {
        setStatus({ kind: 'sent' });
        track('form_submitted', { form: definition.id });
        if (definition.conversionEvent) track(definition.conversionEvent, { form: definition.id });
        return;
      }
      if (res.status === 400 && json?.errors && Object.keys(json.errors).length) {
        setStatus({ kind: 'invalid', errors: json.errors });
        return;
      }
      setStatus({ kind: 'failed', message: json?.message ?? GENERIC_FAILURE });
    } catch {
      setStatus({ kind: 'failed', message: NETWORK_FAILURE });
    }
  }

  function focusField(name: string) {
    const el = document.getElementById(fieldId(name));
    if (!el) return;
    const target = el instanceof HTMLFieldSetElement ? (el.querySelector<HTMLElement>('input, select, textarea') ?? el) : el;
    target.focus();
  }

  function renderField(field: FieldDef) {
    const id = fieldId(field.name);
    const error = errors[field.name];
    const label = renderLabel(field.label);
    const value = prefill?.[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
      case 'date':
        return (
          <Input
            key={field.name}
            id={id}
            name={field.name}
            label={label}
            required={field.required}
            help={field.help}
            error={error}
            type={inputType(field)}
            inputMode={inputMode(field)}
            autoComplete={field.autoComplete}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            defaultValue={value}
          />
        );
      case 'textarea':
        return (
          <Textarea
            key={field.name}
            id={id}
            name={field.name}
            label={label}
            required={field.required}
            help={field.help}
            error={error}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            defaultValue={value}
          />
        );
      case 'select':
        return (
          <Select
            key={field.name}
            id={id}
            name={field.name}
            label={label}
            required={field.required}
            help={field.help}
            error={error}
            options={field.options ?? []}
            defaultValue={value ?? ''}
            placeholder={field.placeholder}
          />
        );
      case 'radio':
        return (
          <RadioGroup
            key={field.name}
            id={id}
            name={field.name}
            legend={label}
            required={field.required}
            help={field.help}
            error={error}
            options={field.options ?? []}
            defaultValue={value}
          />
        );
      case 'checkbox':
        return <Checkbox key={field.name} id={id} name={field.name} label={label} required={field.required} help={field.help} error={error} />;
      case 'checkboxes':
        return (
          <CheckboxGroup
            key={field.name}
            id={id}
            name={field.name}
            legend={label}
            required={field.required}
            help={field.help}
            error={error}
            options={field.options ?? []}
            defaultValue={value ? value.split(',') : undefined}
          />
        );
    }
  }

  const errorEntries = Object.entries(errors);

  return (
    <div className={className}>
      {/* Always present so screen readers announce the success message when it arrives. */}
      <div aria-live="polite">
        {status.kind === 'sent' ? (
          <div ref={successRef} tabIndex={-1} className="rounded-card bg-paper-100 p-6 text-charcoal-900 sm:p-8">
            <div className="flex items-start gap-3">
              <Check aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-charcoal-900" />
              <div>
                <h2 className="font-display text-h3 text-charcoal-900">Thanks, that has been sent</h2>
                <p className="mt-2 max-w-prose text-body text-charcoal-700">{definition.successMessage}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {status.kind !== 'sent' ? (
        <form method="post" action="/api/forms" noValidate={hydrated} onSubmit={onSubmit} className="flex flex-col gap-10">
          {status.kind === 'invalid' && errorEntries.length ? (
            <div ref={summaryRef} role="alert" tabIndex={-1} className="rounded-card border-2 border-red-600 bg-red-50 p-4 text-charcoal-900 sm:p-6">
              <h2 className="font-display text-h3 text-red-700">There is a problem</h2>
              <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-body">
                {errorEntries.map(([name, message]) => {
                  const field = fieldByName.get(name);
                  return (
                    <li key={name}>
                      <a
                        href={`#${fieldId(name)}`}
                        className="font-semibold text-red-700 underline underline-offset-4"
                        onClick={(e) => {
                          e.preventDefault();
                          focusField(name);
                        }}
                      >
                        {field ? `${summaryLabel(field)}: ${message}` : message}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {status.kind === 'failed' ? (
            <div ref={summaryRef} role="alert" tabIndex={-1} className="rounded-card border-2 border-red-600 bg-red-50 p-4 text-charcoal-900 sm:p-6">
              <h2 className="font-display text-h3 text-red-700">Your form was not sent</h2>
              <p className="mt-2 text-body">{status.message}</p>
            </div>
          ) : null}

          <input type="hidden" name={FORM_ID_FIELD} value={definition.id} />
          <input type="hidden" name={REDIRECT_FIELD} value={pathname} />

          {definition.sections.map((section) => (
            <Fieldset key={section.heading} heading={section.heading} description={section.description}>
              {section.fields.map(renderField)}
            </Fieldset>
          ))}

          {/* Honeypot: off-screen, hidden from assistive tech and the tab order, but not display:none so bots still fill it. */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor={honeypotId}>Leave this field empty</label>
            <input id={honeypotId} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" size="lg" loading={status.kind === 'sending'}>
              {status.kind === 'sending' ? 'Sending' : 'Send'}
            </Button>
            <p className="text-small text-charcoal-700">Fields marked (required) must be filled in.</p>
          </div>
        </form>
      ) : null}
    </div>
  );
}
