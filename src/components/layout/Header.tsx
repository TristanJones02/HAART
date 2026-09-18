import Link from 'next/link';
import type { NavItem } from '@/lib/content/types';
import { Button } from '@/components/ui/Button';
import { Wordmark } from './Wordmark';
import { MobileNav } from './MobileNav';
import { DesktopNav } from './DesktopNav';

/**
 * 72px desktop, 60px phone, on paper, closed by a full-width 2px charcoal
 * rule. No shadow, and it does not shrink or fade on scroll: that is a
 * guaranteed jank source for no gain.
 *
 * Not sticky itself — the layout sticks the unaffiliated banner and this
 * header together as one block, so the notice cannot scroll out of view.
 */
export function Header({ nav }: { nav: NavItem[] }) {
  return (
    <header className="canvas-paper border-b-2 border-charcoal-900">
      <div className="container-site flex h-15 items-center justify-between gap-4 sm:h-18">
        <Link href="/" className="flex items-center" aria-label="haart, home">
          <Wordmark />
        </Link>
        <DesktopNav items={nav} />
        <div className="flex items-center gap-3">
          <Button href="/donate" variant="primary" className="h-11 px-5">
            Donate
          </Button>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
