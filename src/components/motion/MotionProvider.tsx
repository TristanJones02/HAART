'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

// domAnimation covers entrances, hover and press. The animal grid loads domMax
// (layout animations) on top through its own nested LazyMotion.
const loadFeatures = () => import('motion/react').then((mod) => mod.domAnimation);

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
