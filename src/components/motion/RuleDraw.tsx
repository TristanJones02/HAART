'use client';

import { m, useReducedMotion } from 'motion/react';

/**
 * The gesture that carries the whole site: every rule draws itself from the
 * left as it enters view. Because rules are the design's connective tissue,
 * this one shared component makes the site feel drawn rather than assembled.
 * Transform only; reduced motion gets a plain opacity fade.
 */
export function RuleDraw({ className = '', as = 'span' }: { className?: string; as?: 'span' | 'div' }) {
  const reduce = useReducedMotion();
  const Tag = as === 'div' ? m.div : m.span;
  return (
    <Tag
      aria-hidden="true"
      className={className}
      initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
      whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      style={{ transformOrigin: 'left' }}
      transition={reduce ? { duration: 0.15 } : { duration: 0.45, ease: [0.2, 0, 0, 1] }}
    />
  );
}
