import Link from 'next/link';
import type { NavItem } from '@/lib/content/types';
import { Button } from '@/components/ui/Button';
import { Wordmark } from './Wordmark';
import { MobileNav } from './MobileNav';
import { DesktopNav } from './DesktopNav';

/**
 * Sticky header. Donate is a real button on every breakpoint and never inside
 * the menu. On phones the header shows wordmark, Donate, menu button only.
 */
export function Header({ nav }: { nav: NavItem[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper-0/95 backdrop-blur supports-[backdrop-filter]:bg-paper-0/85">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 rounded-control" aria-label="haart home">
          <Wordmark />
        </Link>
        <DesktopNav items={nav} />
        <div className="flex items-center gap-2">
          <Button href="/donate" variant="primary" size="md" className="px-5">
            Donate
          </Button>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
