import type { ComponentProps, ReactNode } from 'react';

/** A hairline and a square corner. No radius, no shadow — that was the boilerplate. */
export function Card({ className = '', children, ...rest }: { className?: string; children: ReactNode } & ComponentProps<'div'>) {
  return (
    <div className={`overflow-hidden border border-[color:var(--hairline)] bg-[color:var(--canvas)] ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardBody({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}
