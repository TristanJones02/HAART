'use client';

import { useState, type ReactNode } from 'react';

/** Blurs a distressing image until the reader chooses to see it. */
export function SensitiveImage({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState(false);
  return (
    <>
      <div className={shown ? '' : 'blur-xl scale-110'} aria-hidden={!shown}>
        {children}
      </div>
      {!shown ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-charcoal-900/55 p-4 text-center text-paper-0">
          <p className="text-small font-semibold">This photo shows an injured or neglected animal.</p>
          <button type="button" onClick={() => setShown(true)} className="h-11 rounded-control border border-paper-0 px-4 text-small font-semibold hover:bg-paper-0 hover:text-charcoal-900">
            Show photo
          </button>
        </div>
      ) : null}
    </>
  );
}
