import type { ComponentProps, ReactNode } from 'react';

/** Surface card: white, 1px border, 8px radius, soft shadow. Hover lift is added by MotionCard. */
export function Card({ className = '', children, ...rest }: { className?: string; children: ReactNode } & ComponentProps<'div'>) {
  return (
    <div className={`overflow-hidden rounded-card border border-border bg-paper-0 shadow-card ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardBody({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}
