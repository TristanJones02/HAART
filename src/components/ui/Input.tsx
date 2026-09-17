import type { ComponentProps, ReactNode } from 'react';
import { FormField, controlClassName, describedBy } from './FormField';

export type InputProps = {
  id: string;
  label: ReactNode;
  required?: boolean;
  help?: ReactNode;
  error?: string;
  className?: string;
} & Omit<ComponentProps<'input'>, 'id' | 'className' | 'required' | 'aria-describedby' | 'aria-invalid'>;

/** Single-line text input with its label always visible. Defaults to `type="text"`. */
export function Input({ id, label, required, help, error, className, type = 'text', ...rest }: InputProps) {
  return (
    <FormField id={id} label={label} required={required} help={help} error={error} className={className}>
      <input
        id={id}
        type={type}
        required={required}
        aria-describedby={describedBy(id, { help, error })}
        aria-invalid={error ? true : undefined}
        className={controlClassName}
        {...rest}
      />
    </FormField>
  );
}
