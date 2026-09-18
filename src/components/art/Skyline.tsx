/**
 * Perth in one line: a boab, the Narrows Bridge, the Bell Tower with its
 * swept sails, two towers, and at the far right a dog and a cat sitting on
 * the baseline looking back at the city. The one element on the site that
 * says Perth rather than Australia. Ink canvases only.
 */
export function Skyline({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 120"
      preserveAspectRatio="xMidYMax meet"
      className={`w-full text-red-200 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* boab */}
      <path d="M44 96V62c0-14 8-22 20-22s20 8 20 22v34" />
      <path d="M50 46 38 30M64 40V22M78 46 90 30M56 42 44 36M72 42 86 36" />
      {/* the Narrows Bridge */}
      <path d="M180 96 Q250 62 320 96 Q390 62 460 96 Q530 62 600 96" />
      <path d="M250 79v17M390 79v17M530 79v17" />
      {/* Bell Tower */}
      <path d="M690 96 L710 20 L730 96" />
      <path d="M668 74 Q690 44 706 34" />
      <path d="M752 74 Q730 44 714 34" />
      {/* two towers */}
      <path d="M840 96V44h44v52M840 62h44M840 78h44" />
      <path d="M940 96V32h30v10h22v54" />
      <path d="M940 52h30M940 72h52" />
      {/* the river */}
      <path d="M120 104h1180" opacity="0.45" />
      {/* dog and cat, sitting on the baseline, looking left toward the city */}
      <g transform="translate(1296 42) scale(0.18)">
        <path d="M318 246C352 232 356 196 336 176" strokeWidth="20" />
        <ellipse cx="248" cy="252" rx="76" ry="62" />
        <ellipse cx="186" cy="240" rx="58" ry="70" />
        <circle cx="196" cy="126" r="72" />
        <path d="M132 96C96 88 84 142 108 172c14 18 34 6 36-22Z" />
        <path d="M260 96c36-8 48 46 24 76-14 18-34 6-36-22Z" />
      </g>
      <g transform="translate(1372 66) scale(0.16)">
        <path d="M256 292C300 288 312 250 296 228" strokeWidth="18" />
        <path d="M200 300C150 300 140 232 152 188C164 146 182 128 200 128C218 128 236 146 248 188C260 232 250 300 200 300Z" />
        <circle cx="200" cy="118" r="52" />
        <path d="M161 88 154 20 208 52Z" />
        <path d="M239 88 246 20 192 52Z" />
      </g>
    </svg>
  );
}
