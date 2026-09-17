import type { ReactNode } from 'react';

export type FieldsetProps = {
  heading: ReactNode;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** A titled group of fields: a section of a long form ("About you", "Your home"). */
export function Fieldset({ heading, description, className = '', children }: FieldsetProps) {
  return (
    <fieldset className={['m-0 min-w-0 border-0 p-0', className].filter(Boolean).join(' ')}>
      <legend className="block p-0 font-display text-h3 text-charcoal-900">{heading}</legend>
      {description ? <p className="mt-2 max-w-prose text-body text-charcoal-700">{description}</p> : null}
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </fieldset>
  );
}
