/** The printer's quad: one 9x9px red square, used everywhere a mark is needed. */
export function Quad({ size = 9, className = '' }: { size?: number; className?: string }) {
  return <span aria-hidden="true" className={`inline-block flex-none bg-[color:var(--rule)] ${className}`} style={{ width: size, height: size }} />;
}
