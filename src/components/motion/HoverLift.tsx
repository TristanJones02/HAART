'use client';

import { m, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/** Transform-only hover and press feedback for cards. Disabled under reduced motion. */
export function HoverLift({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <m.div className={`h-full ${className}`} whileHover={reduce ? undefined : { y: -3 }} whileTap={reduce ? undefined : { scale: 0.99 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
      {children}
    </m.div>
  );
}
