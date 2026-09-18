'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { NavItem } from '@/lib/content/types';
import { Wordmark } from './Wordmark';

/**
 * The control is the word "Menu" with a 2px underline, not a hamburger glyph.
 * The panel is a full-height contents page: links at 1.25rem on hairlines,
 * grouped by rubrics.
 */
export function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex h-11 items-center border-b-2 border-charcoal-900 font-display text-[1.0625rem] font-extrabold text-charcoal-900"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        Menu
      </button>
      <dialog ref={dialog} onClose={() => setOpen(false)} aria-label="Menu" className="canvas-paper m-0 h-dvh max-h-none w-full max-w-none p-0 text-charcoal-900 backdrop:bg-ink-950/50">
        <div className="container-site flex h-15 items-center justify-between border-b-2 border-charcoal-900">
          <Wordmark />
          <button
            type="button"
            className="inline-flex h-11 items-center border-b-2 border-charcoal-900 font-display text-[1.0625rem] font-extrabold"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
        <nav aria-label="Main" className="container-site py-6">
          <ul>
            {items.map((item) => (
              <li key={item.href} className="border-b border-[color:var(--hairline)] py-3 last:border-b-0">
                <Link href={item.href} className="block py-2 font-display text-[1.25rem] font-bold">
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <ul className="mt-1 ml-4 border-l border-[color:var(--hairline)] pl-4">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block py-2.5 text-body text-[color:var(--text-muted)]">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <Link href="/donate" className="mt-8 inline-flex h-13 w-full items-center justify-center gap-2.5 bg-red-600 font-display text-[1.125rem] font-extrabold text-paper-0">
            <span aria-hidden="true" className="inline-block size-[9px] bg-paper-0" />
            Donate
          </Link>
        </nav>
      </dialog>
    </div>
  );
}
