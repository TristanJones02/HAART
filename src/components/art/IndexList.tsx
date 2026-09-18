import type { ReactNode } from 'react';

export type IndexRow = { label: string; value?: ReactNode | null };

/**
 * Label, dotted leader, value. A missing value renders "Ask us" in the
 * caption colour rather than collapsing the row, so a half-filled record
 * still produces a full, deliberate-looking index.
 */
export function IndexList({ rows, dense = false, className = '' }: { rows: IndexRow[]; dense?: boolean; className?: string }) {
  return (
    <dl className={`m-0 ${className}`}>
      {rows.map((row) => {
        const missing = row.value === null || row.value === undefined || row.value === '';
        return (
          <div key={row.label} className={`flex items-baseline gap-2 border-b border-[color:var(--hairline)] ${dense ? 'py-2' : 'py-3'} last:border-b-0`}>
            <dt className="flex-none text-index-label uppercase text-[color:var(--text-muted)]">{row.label}</dt>
            <span aria-hidden="true" className="dotted-leader" />
            <dd className={`m-0 flex-none text-index-value ${missing ? 'italic text-[color:var(--text-caption)]' : 'text-[color:var(--text-strong)]'}`}>
              {missing ? 'Ask us' : row.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
