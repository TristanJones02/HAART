import type { ComponentProps, ReactNode } from 'react';
import { FormField, controlClassName, describedBy } from './FormField';

export type TextareaProps = {
  id: string;
  label: ReactNode;
  required?: boolean;
  help?: ReactNode;
  error?: string;
  className?: string;
} & Omit<ComponentProps<'textarea'>, 'id' | 'className' | 'required' | 'aria-describedby' | 'aria-invalid'>;

/** Multi-line text input. Five rows by default, resizable vertically only. */
export function Textarea({ id, label, required, help, error, className, rows = 5, ...rest }: TextareaProps) {
  return (
    <FormField id={id} label={label} required={required} help={help} error={error} className={className}>
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-describedby={describedBy(id, { help, error })}
        aria-invalid={error ? true : undefined}
        className={`${controlClassName} resize-y leading-relaxed`}
        {...rest}
      />
    </FormField>
  );
}
