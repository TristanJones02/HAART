import { Quad } from '@/components/art/Quad';

/**
 * The wordmark: lowercase "haart" in the display face, closed by the
 * printer's quad. A square, not a circle, so the mark and the typography are
 * one system. Stands in until the original vector logo is supplied
 * (docs/blockers.md F12).
 */
export function Wordmark({ className = '', size = 'md' }: { className?: string; size?: 'md' | 'lg' | 'xl' }) {
  const text = size === 'xl' ? 'text-[3rem]' : size === 'lg' ? 'text-[2.25rem]' : 'text-[1.75rem]';
  return (
    <span className={`inline-flex items-end gap-[3px] font-display font-black leading-none tracking-[-0.04em] ${text} ${className}`}>
      <span>haart</span>
      <Quad className="mb-[0.18em]" />
    </span>
  );
}
