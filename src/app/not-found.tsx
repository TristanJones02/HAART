import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FolioBar, RuleLink, PlateFrame, Plate } from '@/components/art';

/**
 * A 404 on a rescue site usually means an adopted animal or a link from an
 * old Facebook post, so it sends people somewhere useful rather than
 * apologising.
 */
export default function NotFound() {
  return (
    <Section canvas="paper">
      <Container className="grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <FolioBar rubric="Page not found" numeral={404} />
          <h1 className="text-masthead-2">That page has moved on</h1>
          <p className="mt-6 max-w-[34ch] text-deck italic text-[color:var(--text-muted)]">
            If you followed a link from Facebook or an old bookmark, the animal may have been adopted or the page renamed. Everything below still works.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button href="/adopt">See who is waiting</Button>
            <RuleLink href="/foster">Fostering</RuleLink>
            <RuleLink href="/donate">Donate</RuleLink>
          </div>
          <p className="mt-10 text-small text-[color:var(--text-muted)]">
            Still stuck? <RuleLink href="/contact" className="!text-[0.9375rem]">Tell us which page you were after</RuleLink>
          </p>
        </div>
        <div className="lg:col-span-5">
          <PlateFrame ratio="4/3" catalogue="Plate 404" caption="Illustration — the page you wanted is not here.">
            <Plate name="dog-sit" colourway="sand" />
          </PlateFrame>
        </div>
      </Container>
    </Section>
  );
}
