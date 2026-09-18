'use client';

import { m, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * A print appearing: a cover in the canvas colour wipes down off the plate.
 * Used on exactly two things, the hero plate and the animal profile band.
 * Four of these in a grid would read as a loading state, which is why the
 * plate grids do not get it.
 */
export function PlateReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`relative block size-full ${className}`}>
      {children}
      {reduce ? null : (
        <m.span
          aria-hidden="true"
          className="absolute inset-0 bg-[color:var(--canvas)]"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          style={{ transformOrigin: 'top' }}
          transition={{ duration: 0.55, ease: [0.2, 0, 0, 1] }}
        />
      )}
    </span>
  );
}
