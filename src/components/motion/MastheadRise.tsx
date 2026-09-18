'use client';

import { m, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * The cover assembling itself on mount: rubric row, rule, masthead, deck,
 * calls to action, each 60ms after the last. The parts are whole elements,
 * never split words, so arbitrary volunteer copy cannot break it.
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
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: reduce ? { duration: 0.15 } : { type: 'spring', stiffness: 220, damping: 28 } },
      }}
    >
      {children}
    </m.div>
  );
}
