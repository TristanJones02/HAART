'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { m, useReducedMotion } from 'motion/react';
import type { NavItem } from '@/lib/content/types';

/**
 * Dropdowns open as a full-width contents panel below the header rule, not a
 * floating rounded menu, so the navigation reads like a magazine's contents
 * page. The active item's 3px red underline sits flush on the header rule.
 */
export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  const ref = useRef<HTMLDivElement>(null);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(null);
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <div ref={ref} className="hidden lg:block">
      <nav aria-label="Main">
        <ul className="flex items-center">
          {items.map((item) => {
            const active = isActive(item.href) || item.children?.some((c) => isActive(c.href));
            const cls = `relative inline-flex h-18 items-center gap-1.5 px-3 text-small font-semibold text-charcoal-900 after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-red-600 after:transition-transform after:duration-150 after:content-[''] ${
              active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`;
            if (!item.children?.length) {
              return (
                <li key={item.href}>
                  <Link href={item.href} className={cls} aria-current={active ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            }
            const expanded = open === item.href;
            return (
              <li key={item.href}>
                <button type="button" className={cls} aria-expanded={expanded} aria-controls={`panel-${item.label}`} onClick={() => setOpen(expanded ? null : item.href)}>
                  {item.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true" className={`transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      {items.map((item) =>
        item.children?.length ? (
          <m.div
            key={`panel-${item.href}`}
            id={`panel-${item.label}`}
            hidden={open !== item.href}
            initial={false}
            animate={open === item.href ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.15, ease: [0.2, 0, 0, 1] }}
            className="canvas-paper absolute inset-x-0 top-full border-b-2 border-charcoal-900"
          >
            <div className="container-site flex gap-10 py-6">
              <p className="w-40 flex-none text-rubric uppercase text-[color:var(--text-caption)]">{item.label}</p>
              <ul className="flex flex-1 flex-wrap gap-x-10">
                {item.children.map((c) => (
                  <li key={c.href} className="border-l border-[color:var(--hairline)] pl-4">
                    <Link href={c.href} className="block py-2 font-display text-[1.125rem] font-bold text-charcoal-900 hover:text-red-600">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        ) : null,
      )}
    </div>
  );
}
