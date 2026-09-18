import Link from 'next/link';
import type { ReactNode } from 'react';

/** The secondary call to action site-wide, replacing the bordered button. */
export function RuleLink({
  href,
  children,
  external,
  className = '',
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const cls = `rule-link ${className}`;
  if (isExternal) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
        <span aria-hidden="true"> ↗</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
