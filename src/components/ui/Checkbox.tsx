import type { ComponentProps, ReactNode } from 'react';
import { FieldError, FieldGroup, FieldHelp, RequiredMark, describedBy, errorId, helpId } from './FormField';

const boxClassName = 'mt-0.5 size-5 shrink-0 cursor-pointer accent-red-600 disabled:cursor-not-allowed';
const rowClassName = 'flex min-h-11 cursor-pointer items-start gap-3 py-2 text-body text-charcoal-900';

export type CheckboxProps = {
  id: string;
  label: ReactNode;
  required?: boolean;
  help?: ReactNode;
  error?: string;
  className?: string;
} & Omit<ComponentProps<'input'>, 'id' | 'type' | 'className' | 'required' | 'aria-describedby' | 'aria-invalid'>;

/**
 * A single yes/no checkbox with the label on the right. The whole row is the
 * tap target (44px). Links inside the label stay clickable without toggling
 * the box.
 */
export function Checkbox({ id, label, required, help, error, className = '', ...rest }: CheckboxProps) {
  return (
    <div className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={rowClassName}>
        <input
          id={id}
          type="checkbox"
          required={required}
          aria-describedby={describedBy(id, { help, error })}
          aria-invalid={error ? true : undefined}
          className={boxClassName}
          {...rest}
        />
        <span>
          {label}
          {required ? <RequiredMark /> : null}
        </span>
      </label>
      {help ? <FieldHelp id={helpId(id)}>{help}</FieldHelp> : null}
      {error ? <FieldError id={errorId(id)}>{error}</FieldError> : null}
    </div>
  );
}

export type CheckboxGroupProps = {
  id: string;
  name: string;
  legend: ReactNode;
  options: { value: string; label: string }[];
  required?: boolean;
  help?: ReactNode;
  error?: string;
  defaultValue?: string[];
  disabled?: boolean;
  className?: string;
};

/** Several checkboxes under one legend ("Tick as many as you like"). Values post as repeated `name` entries. */
export function CheckboxGroup({ id, name, legend, options, required, help, error, defaultValue = [], disabled, className }: CheckboxGroupProps) {
  return (
    <FieldGroup id={id} legend={legend} required={required} help={help} error={error} role="group" className={className}>
      {options.map((o, i) => {
        const optionId = `${id}-${i}`;
        return (
          <label key={o.value} htmlFor={optionId} className={rowClassName}>
            <input
              id={optionId}
              type="checkbox"
              name={name}
              value={o.value}
              defaultChecked={defaultValue.includes(o.value)}
              disabled={disabled}
              aria-invalid={error ? true : undefined}
              className={boxClassName}
            />
            <span>{o.label}</span>
          </label>
        );
      })}
    </FieldGroup>
  );
}
