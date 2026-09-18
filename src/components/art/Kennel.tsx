/**
 * A kennel drawn in outline with the door open and nobody inside. The empty
 * kennel is the message. Used once, on the foster page header. Ink only.
 */
export function Kennel({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 480 360"
      className={`w-full text-red-200 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M60 190 L240 60 L420 190 V330 H60 Z" />
      <path d="M40 196 L240 52 L440 196" />
      {/* the opening, drawn empty */}
      <path d="M170 330 V240 A70 70 0 0 1 310 240 V330" />
      {/* the door itself, swung back on its hinge */}
      <g transform="rotate(-68 170 330)">
        <rect x="170" y="238" width="86" height="92" rx="6" />
        <path d="M188 262h50M188 284h50M188 306h50" opacity="0.6" />
      </g>
      {/* a bowl at the step */}
      <ellipse cx="390" cy="326" rx="26" ry="10" />
      <path d="M368 322c4 12 40 12 44 0" />
    </svg>
  );
}
