import type { ReactNode } from 'react';
import { FieldGroup } from './FormField';

export type RadioGroupProps = {
  id: string;
  name: string;
  legend: ReactNode;
  options: { value: string; label: string }[];
  required?: boolean;
  help?: ReactNode;
  error?: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * A fieldset of radio buttons with a legend. Each option is a full-width
 * 44px row so it is easy to hit on a phone. `required` on the inputs gives
 * the no-JavaScript case native validation.
 */
export function RadioGroup({ id, name, legend, options, required, help, error, defaultValue, disabled, className }: RadioGroupProps) {
  return (
    <FieldGroup id={id} legend={legend} required={required} help={help} error={error} role="radiogroup" className={className}>
      {options.map((o, i) => {
        const optionId = `${id}-${i}`;
        return (
          <label key={o.value} htmlFor={optionId} className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-body text-charcoal-900">
            <input
              id={optionId}
              type="radio"
              name={name}
              value={o.value}
              required={required}
              defaultChecked={defaultValue === o.value}
              disabled={disabled}
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-red-600 disabled:cursor-not-allowed"
            />
            <span>{o.label}</span>
          </label>
        );
      })}
    </FieldGroup>
  );
}
