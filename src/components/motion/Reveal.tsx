'use client';

import { m, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

const entrance = { type: 'spring', stiffness: 220, damping: 28 } as const;

/**
 * Reveals children once as they enter the viewport: 12px rise plus fade,
 * capped at 450ms by the spring settings. Server-rendered markup is fully
 * visible; the hidden state is only applied after mount and only to elements
 * that are below the fold at that moment, so nothing flashes and nothing is
 * ever unreadable without JavaScript. Reduced motion: opacity fade only.
 */
export function Reveal({ children, className = '', delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'section' | 'article' }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const belowFold = rect.top > window.innerHeight * 0.9;
    if (belowFold) setAnimate(true);
  }, []);

  const Tag = m[as] as typeof m.div;
  if (!animate) {
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }
  return (
    <Tag
      ref={ref}
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={reduce ? { duration: 0.15 } : { ...entrance, delay }}
    >
      {children}
    </Tag>
  );
}

/** Staggered entrance for grids and lists. Children should be StaggerItem. */
export function Stagger({ children, className = '', as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight * 0.9) setAnimate(true);
  }, []);
  const Tag = m[as] as typeof m.div;
  return (
    <Tag
      ref={ref}
      className={className}
      initial={animate ? 'hidden' : false}
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className = '', as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const reduce = useReducedMotion();
  const Tag = m[as] as typeof m.div;
  return (
    <Tag className={className} variants={{ hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: reduce ? { duration: 0.15 } : entrance } }}>
      {children}
    </Tag>
  );
}
