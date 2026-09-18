'use client';

import { m, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Transform-only card feedback, inside @media (hover: hover) so touch devices
 * get nothing and nothing sticks.
 */
export function HoverLift({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={`h-full ${className}`}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    >
      {children}
    </m.div>
  );
}
