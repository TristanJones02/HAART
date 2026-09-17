import type { ReactNode } from 'react';

/**
 * Shared wrapper for a single form control: visible label, optional help
 * text, the control, then the error. Help and error ids are stable so the
 * control can reference them with `aria-describedby`. Required fields say
 * "(required)" in the label; colour never carries meaning on its own.
 */

export const helpId = (id: string) => `${id}-help`;
export const errorId = (id: string) => `${id}-error`;

/** The `aria-describedby` value for a control with the given help and error. */
export function describedBy(id: string, opts: { help?: unknown; error?: unknown }): string | undefined {
  const ids = [opts.help ? helpId(id) : null, opts.error ? errorId(id) : null].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

/**
 * Text-like controls (input, select, textarea). 44px tall, Paper 0 surface,
 * 2px border that turns Charcoal 700 on focus (in addition to the global
 * focus ring from globals.css) and Red 600 while invalid.
 */
export const controlClassName =
  'block w-full min-h-11 rounded-control border-2 border-border bg-paper-0 px-3 py-2 font-body text-body text-charcoal-900 placeholder:text-charcoal-500 transition-[border-color] duration-150 ease-standard focus:border-charcoal-700 aria-invalid:border-red-600 disabled:cursor-not-allowed disabled:bg-paper-100 disabled:text-charcoal-500';

export function RequiredMark() {
  return <span className="font-normal text-charcoal-700"> (required)</span>;
}

export function FieldLabel({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-body font-semibold text-charcoal-900">
      {children}
      {required ? <RequiredMark /> : null}
    </label>
  );
}

export function FieldHelp({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-small text-charcoal-700">
      {children}
    </p>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-small font-semibold text-red-700">
      {children}
    </p>
  );
}

export type FormFieldProps = {
  /** Id of the control inside; help and error ids derive from it. */
  id: string;
  label: ReactNode;
  required?: boolean;
  help?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function FormField({ id, label, required, help, error, className = '', children }: FormFieldProps) {
  return (
    <div className={['flex flex-col gap-1.5', className].filter(Boolean).join(' ')}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      {help ? <FieldHelp id={helpId(id)}>{help}</FieldHelp> : null}
      {children}
      {error ? <FieldError id={errorId(id)}>{error}</FieldError> : null}
    </div>
  );
}

export type FieldGroupProps = {
  /** Id of the fieldset; the error summary links here. */
  id: string;
  legend: ReactNode;
  required?: boolean;
  help?: ReactNode;
  error?: string;
  /** `radiogroup` lets assistive tech announce the invalid state; checkbox groups stay a plain group. */
  role?: 'radiogroup' | 'group';
  className?: string;
  children: ReactNode;
};

/** A fieldset with a legend, used by RadioGroup and CheckboxGroup so a set of choices is labelled once. */
export function FieldGroup({ id, legend, required, help, error, role = 'group', className = '', children }: FieldGroupProps) {
  return (
    <fieldset
      id={id}
      role={role}
      tabIndex={-1}
      aria-describedby={describedBy(id, { help, error })}
      aria-invalid={role === 'radiogroup' && error ? true : undefined}
      aria-required={role === 'radiogroup' && required ? true : undefined}
      className={['m-0 min-w-0 border-0 p-0', className].filter(Boolean).join(' ')}
    >
      <legend className="mb-1.5 block p-0 text-body font-semibold text-charcoal-900">
        {legend}
        {required ? <RequiredMark /> : null}
      </legend>
      {help ? <FieldHelp id={helpId(id)}>{help}</FieldHelp> : null}
      <div className="mt-1 flex flex-col">{children}</div>
      {error ? (
        <div className="mt-1.5">
          <FieldError id={errorId(id)}>{error}</FieldError>
        </div>
      ) : null}
    </fieldset>
  );
}
