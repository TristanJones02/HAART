'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { NavItem } from '@/lib/content/types';
import { UiIcon } from '@/components/ui/Icon';

/** Full-screen menu for phones and tablets, using a native dialog for focus trapping. */
export function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the menu when the route changes (state adjusted during render, not in an effect).
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
      <button type="button" className="inline-flex size-11 items-center justify-center rounded-control text-charcoal-900 hover:bg-paper-100" aria-label="Open menu" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <UiIcon name="Menu" size={24} />
      </button>
      <dialog ref={dialog} onClose={() => setOpen(false)} aria-label="Menu" className="m-0 h-dvh max-h-none w-full max-w-none bg-paper-0 p-0 text-charcoal-900 backdrop:bg-charcoal-900/40">
        <div className="container-site flex h-16 items-center justify-between border-b border-border">
          <span className="font-display text-h3 font-black">Menu</span>
          <button type="button" className="inline-flex size-11 items-center justify-center rounded-control hover:bg-paper-100" aria-label="Close menu" onClick={() => setOpen(false)}>
            <UiIcon name="X" size={24} />
          </button>
        </div>
        <nav aria-label="Main" className="container-site py-4">
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.href} className="py-2">
                <Link href={item.href} className="block py-2.5 font-display text-h3 font-bold">
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <ul className="mb-2 ml-3 border-l border-border pl-3">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block py-2.5 text-body text-charcoal-700">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
            <li className="py-4">
              <Link href="/donate" className="inline-flex h-12 w-full items-center justify-center rounded-control bg-red-600 font-semibold text-paper-0 hover:bg-red-700">
                Donate
              </Link>
            </li>
          </ul>
        </nav>
      </dialog>
    </div>
  );
}
