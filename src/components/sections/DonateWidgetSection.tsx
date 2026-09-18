import { Container, Section } from '@/components/ui/Container';
import { DonateWidget } from '@/components/donate/DonateWidget';
import { FolioBar, IndexList, Plate, PlateFrame, mastheadClass } from '@/components/art';
import { MastheadRise, RiseItem } from '@/components/motion/MastheadRise';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

/**
 * The appeal (§6.8). A masthead cover with the second and last `signal`
 * plate on the site bleeding off the right, then the gift widget in columns
 * 1-7 and "What your gift does" as an editorial price index in 9-12.
 */
export async function DonateWidgetSection({ section, canvas, topRule }: SectionProps<'section.donateWidget'>) {
  const settings = await getSiteSettings();
  const id = `s-${section._key}`;
  const heading = section.heading ?? 'Give to the animals';
  const impact = section.impactLines ?? [];

  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={id}>
      <Container>
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-12 lg:items-center">
          <MastheadRise className="lg:col-span-7">
            <RiseItem>
              <FolioBar rubric="Donate" />
            </RiseItem>
            <RiseItem>
              <h1 id={id} className={mastheadClass(heading)}>
                {heading}
              </h1>
            </RiseItem>
            <RiseItem>
              <span aria-hidden="true" className="mt-6 block h-1 w-10 bg-[color:var(--rule)]" />
            </RiseItem>
            {section.text ? (
              <RiseItem>
                <p className="mt-6 max-w-[34ch] text-deck italic text-[color:var(--text-muted)]">{section.text}</p>
              </RiseItem>
            ) : null}
            {settings.dgrEndorsed ? (
              <RiseItem>
                <p className="mt-5 max-w-[62ch] text-body">HAART is a Deductible Gift Recipient. Gifts of $2 or more are tax deductible and you will receive a receipt by email.</p>
              </RiseItem>
            ) : null}
          </MastheadRise>

          {/* The page's one piece of red mass, running off the right margin. */}
          <div className="-mr-4 sm:mr-[min(-1.5rem,calc(var(--container-site)_/_2_-_1.5rem_-_50vw))] lg:col-span-5">
            <PlateFrame ratio="4/5" border={2} edges="left">
              <Plate name="cat-loaf" colourway="signal" />
            </PlateFrame>
          </div>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <DonateWidget amounts={section.amounts} links={settings.donate} />
          </div>

          {impact.length ? (
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="text-feature">What your gift does</h2>
              <IndexList
                className="mt-5 [&_dd]:max-w-[22ch] [&_dd]:text-[0.9375rem] [&_dd]:font-normal [&_dd]:leading-snug [&_dt]:font-display [&_dt]:text-[2rem] [&_dt]:font-black [&_dt]:leading-none [&_dt]:tracking-[-0.02em] [&_dt]:normal-case [&_dt]:tabular-nums [&_dt]:text-[color:var(--rule)]"
                rows={impact.map((l) => ({ label: `$${l.amount}`, value: l.text }))}
              />
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
