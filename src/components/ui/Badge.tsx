import type { AnimalStatus } from '@/lib/content/types';

type StatusKey = AnimalStatus | 'fosterNeeded';

const statusStyles: Record<StatusKey, { className: string; dot: string; label: string }> = {
  available: { className: 'bg-paper-100 text-charcoal-900 border-border', dot: 'bg-charcoal-700', label: 'Available' },
  pending: { className: 'bg-paper-0 text-amber-700 border-amber-600', dot: 'bg-amber-600', label: 'Application pending' },
  on_hold: { className: 'bg-paper-0 text-amber-700 border-amber-600', dot: 'bg-amber-600', label: 'On hold' },
  adopted: { className: 'bg-green-600 text-paper-0 border-green-600', dot: 'bg-paper-0', label: 'Adopted' },
  unknown: { className: 'bg-paper-100 text-charcoal-700 border-border', dot: 'bg-charcoal-500', label: 'Status to confirm' },
  fosterNeeded: { className: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-600', label: 'Needs a foster' },
};

/**
 * Status badge. Semantic colours are reserved for animal status and used
 * nowhere else. Text carries the meaning; the dot is decorative.
 */
export function StatusBadge({ status, className = '' }: { status: StatusKey; className?: string }) {
  const s = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-small font-semibold leading-none ${s.className} ${className}`}>
      <span aria-hidden="true" className={`size-2 rounded-pill ${s.dot}`} />
      {s.label}
    </span>
  );
}

/** Neutral label badge for categories and metadata. */
export function LabelBadge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-pill bg-paper-100 px-2.5 py-1 text-tiny uppercase tracking-caps text-charcoal-700 ${className}`}>{children}</span>;
}
