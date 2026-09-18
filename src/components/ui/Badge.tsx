import type { AnimalStatus } from '@/lib/content/types';

export type StatusKey = AnimalStatus | 'fosterNeeded';

/**
 * Status is a rule and a word, not a pill. Amber-600 measures 2.98:1 on sand,
 * below the 3:1 non-text threshold, so the bar steps to amber-700 there; on
 * ink every status steps to its 300-level token. Colour is never the sole
 * carrier — the word is always present.
 */
const BAR: Record<StatusKey, string> = {
  available: 'bg-charcoal-900',
  pending: 'bg-amber-700',
  on_hold: 'bg-amber-700',
  adopted: 'bg-green-600',
  unknown: 'bg-charcoal-500',
  fosterNeeded: 'bg-red-600',
};

const BAR_INK: Record<StatusKey, string> = {
  available: 'bg-sand-300',
  pending: 'bg-amber-300',
  on_hold: 'bg-amber-300',
  adopted: 'bg-green-300',
  unknown: 'bg-stone-400',
  fosterNeeded: 'bg-red-200',
};

const LABEL: Record<StatusKey, string> = {
  available: 'Available',
  pending: 'Application pending',
  on_hold: 'On hold',
  adopted: 'Adopted',
  unknown: 'Status to confirm',
  fosterNeeded: 'Needs a foster',
};

const TEXT: Record<StatusKey, string> = {
  available: 'text-[color:var(--text-muted)]',
  pending: 'text-amber-700',
  on_hold: 'text-amber-700',
  adopted: 'text-green-700',
  unknown: 'text-[color:var(--text-muted)]',
  fosterNeeded: 'text-red-600',
};

const TEXT_INK: Record<StatusKey, string> = {
  available: 'text-sand-300',
  pending: 'text-amber-300',
  on_hold: 'text-amber-300',
  adopted: 'text-green-300',
  unknown: 'text-stone-400',
  fosterNeeded: 'text-red-200',
};

export const statusLabel = (status: StatusKey) => LABEL[status] ?? LABEL.unknown;

/** The 4px bar across the top of a card. */
export function StatusBar({ status, onInk = false, className = '' }: { status: StatusKey; onInk?: boolean; className?: string }) {
  return <span aria-hidden="true" className={`block h-1 w-full ${(onInk ? BAR_INK : BAR)[status] ?? BAR.unknown} ${className}`} />;
}

/** The word. Always rendered, so colour never carries the meaning alone. */
export function StatusLabel({ status, onInk = false, className = '' }: { status: StatusKey; onInk?: boolean; className?: string }) {
  return <span className={`text-catalogue uppercase ${(onInk ? TEXT_INK : TEXT)[status] ?? TEXT.unknown} ${className}`}>{statusLabel(status)}</span>;
}

/** The one floating case, over a plate: a square chip ringed in the canvas colour. */
export function StatusChip({ status, className = '' }: { status: StatusKey; className?: string }) {
  const filled = status === 'adopted' || status === 'fosterNeeded';
  return (
    <span
      className={`sticker-ring inline-flex items-center gap-1.5 px-2 py-1 text-catalogue uppercase ${
        filled ? (status === 'adopted' ? 'bg-green-600 text-paper-0' : 'bg-red-600 text-paper-0') : 'bg-paper-0 text-charcoal-900'
      } ${className}`}
    >
      {statusLabel(status)}
    </span>
  );
}

/** Neutral label for categories and metadata. */
export function LabelBadge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-block text-rubric uppercase text-[color:var(--text-caption)] ${className}`}>{children}</span>;
}
