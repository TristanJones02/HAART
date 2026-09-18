import type { ReactNode } from 'react';

/**
 * A print appearing: a cover in the canvas colour wipes down off the plate.
 * Used on exactly two things, the hero plate and the animal profile band —
 * four of these wiping in sequence across a grid would read as a loading
 * state rather than as a print appearing.
 *
 * The wipe itself lives in globals.css as `.plate-reveal`. It is CSS, not
 * Motion, because Motion writes its initial state into the server-rendered
 * markup: an opaque curtain meant the plate was a blank white frame for
 * anyone whose JavaScript had not run. A CSS animation settles at scaleY(0)
 * whether or not it ever plays, and reduced motion collapses it.
 */
export function PlateReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`plate-reveal relative block size-full ${className}`}>{children}</span>;
}
