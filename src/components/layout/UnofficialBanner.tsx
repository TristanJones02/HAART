/**
 * The unaffiliated notice, on every page, always.
 *
 * This is a concept rebuild. HAART has not been contacted and has not endorsed
 * it, and the pages carry their name, their animals and their words, so the
 * only thing standing between this and impersonation is a reader being told.
 * That has to be true on every route, at every viewport, whether or not
 * JavaScript ran — so it is a server-rendered element with no conditions on it,
 * and the layout sticks it to the top of the viewport alongside the header
 * rather than letting it scroll away.
 *
 * Deliberately not dismissible.
 */
export function UnofficialBanner() {
  return (
    <div className="canvas-ink border-b border-[color:var(--hairline)]">
      <p className="container-site flex flex-wrap items-baseline gap-x-2 gap-y-1 py-2 text-note">
        <span className="font-display font-extrabold uppercase tracking-[0.12em] text-[color:var(--rubric)]">Unofficial concept design</span>
        <span className="text-[color:var(--text-muted)]">Not affiliated with or endorsed by HAART. Animals, figures and registration details shown here are unverified and must not be relied on.</span>
      </p>
    </div>
  );
}
