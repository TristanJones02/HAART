/**
 * The notice pinned up at the vet, with the tabs you tear off. Sits at the
 * bottom edge of a block, overhanging the next canvas; the block reserves
 * 56px of bottom margin so nothing shifts. One tab is drawn already taken.
 */
export function TearOff({
  tabFill = 'sand',
  ground = 'paper',
  className = '',
}: {
  tabFill?: 'paper' | 'sand';
  /**
   * The canvas the strip hangs over, which is the NEXT block's, not this
   * one's. Reading var(--canvas) here would erase the torn tab in the colour
   * of the block the strip belongs to rather than the ground behind it.
   */
  ground?: 'paper' | 'cream' | 'sand' | 'ink';
  className?: string;
}) {
  const fill = tabFill === 'sand' ? '#f3e3cf' : '#ffffff';
  const groundFill = { paper: '#ffffff', cream: '#faf8f6', sand: '#f3e3cf', ink: '#241f1d' }[ground];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`absolute inset-x-0 top-full h-14 w-full ${className}`}
      height="56"
      preserveAspectRatio="none"
      viewBox="0 0 520 56"
    >
      <defs>
        <pattern id="haart-tear" width="52" height="56" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0.5" x2="52" y2="0.5" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
          <rect x="4.5" y="0.5" width="44" height="55" fill={fill} stroke="currentColor" strokeWidth="1" opacity="0.9" />
        </pattern>
      </defs>
      <rect width="520" height="56" fill="url(#haart-tear)" className="text-[color:var(--hairline)]" />
      {/* the fourth tab, already torn off */}
      <rect x="160" y="19" width="46" height="38" fill={groundFill} />
    </svg>
  );
}
