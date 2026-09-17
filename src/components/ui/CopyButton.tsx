'use client';

import { useState } from 'react';
import { UiIcon } from './Icon';

/** Copies a value (bank details, scheme ID) with a confirmation that is announced. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-1.5 rounded-control border border-border bg-paper-0 px-2.5 text-small font-semibold text-charcoal-700 hover:border-charcoal-700"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* clipboard unavailable: the value is visible next to the button */
        }
      }}
    >
      <UiIcon name={done ? 'Check' : 'Copy'} size={16} />
      <span aria-live="polite">{done ? 'Copied' : label}</span>
    </button>
  );
}
