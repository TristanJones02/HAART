'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

// domMax is needed for layout animations on the animal grid; loaded lazily so
// the initial bundle stays small.
const loadFeatures = () => import('motion/react').then((mod) => mod.domMax);

/**
 * App-wide motion settings: spring by default, and `reducedMotion="user"`
 * so the operating-system preference disables transform animations.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
