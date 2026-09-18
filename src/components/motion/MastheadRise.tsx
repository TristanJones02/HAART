'use client';

import { m, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * The cover assembling itself on mount: each part rises 14px into place,
 * 60ms after the last.
 *
 * Transform only, and deliberately NOT opacity. The masthead is the largest
 * contentful paint on most pages; fading it in from zero means the browser
 * does not count it as painted until hydration finishes, which pushed LCP
 * from 0.9s to 4.1s. Rising from full opacity gives the same gesture and
 * lets the text paint with the HTML.
 *
 * The parts are whole elements, never split words, so arbitrary volunteer
 * copy cannot break the stagger.
 */
export function MastheadRise({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }}
    >
      {children}
    </m.div>
  );
}

export function RiseItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      variants={{
        hidden: reduce ? {} : { y: 14 },
        show: { y: 0, transition: reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 28 } },
      }}
    >
      {children}
    </m.div>
  );
}
