'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { NavItem } from '@/lib/content/types';
import { UiIcon } from '@/components/ui/Icon';

/** Desktop navigation with keyboard-accessible disclosure dropdowns. */
export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  const ref = useRef<HTMLElement>(null);

  // Close any open dropdown when the route changes (state adjusted during render, not in an effect).
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
    <nav ref={ref} aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const active = isActive(item.href) || item.children?.some((c) => isActive(c.href));
          const linkClass = `inline-flex h-11 items-center gap-1 rounded-control px-3 text-body font-semibold transition-colors duration-150 hover:bg-paper-100 ${active ? 'text-red-600' : 'text-charcoal-900'}`;
          if (!item.children?.length) {
            return (
              <li key={item.href}>
                <Link href={item.href} className={linkClass} aria-current={active ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            );
          }
          const expanded = open === item.href;
          return (
            <li key={item.href} className="relative">
              <button type="button" className={linkClass} aria-expanded={expanded} aria-controls={`menu-${item.label}`} onClick={() => setOpen(expanded ? null : item.href)}>
                {item.label}
                <UiIcon name="ChevronDown" size={16} className={`transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`} />
              </button>
              <ul id={`menu-${item.label}`} hidden={!expanded} className="absolute left-0 top-full z-50 mt-1 min-w-56 rounded-card border border-border bg-paper-0 p-2 shadow-card-hover">
                {item.children.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className={`block rounded-control px-3 py-2.5 text-body hover:bg-paper-100 ${isActive(c.href) ? 'font-semibold text-red-600' : 'text-charcoal-900'}`}>
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
