import { ChevronDown } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { FormField, controlClassName, describedBy } from './FormField';

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  id: string;
  label: ReactNode;
  options: SelectOption[];
  required?: boolean;
  help?: ReactNode;
  error?: string;
  /** Text of the empty first option. */
  placeholder?: string;
  className?: string;
} & Omit<ComponentProps<'select'>, 'id' | 'className' | 'required' | 'children' | 'aria-describedby' | 'aria-invalid'>;

/** Native select with a decorative chevron. Always starts with an empty "Choose one" option so nothing is chosen by accident. */
export function Select({ id, label, options, required, help, error, placeholder = 'Choose one', className, defaultValue = '', ...rest }: SelectProps) {
  return (
    <FormField id={id} label={label} required={required} help={help} error={error} className={className}>
      <div className="relative">
        <select
          id={id}
          required={required}
          defaultValue={defaultValue}
          aria-describedby={describedBy(id, { help, error })}
          aria-invalid={error ? true : undefined}
          className={`${controlClassName} appearance-none pr-10`}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-charcoal-700" />
      </div>
    </FormField>
  );
}
