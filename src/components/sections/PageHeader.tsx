import { FolioBar, Kennel, mastheadClass } from '@/components/art';
import { MastheadRise, RiseItem } from '@/components/motion/MastheadRise';
import { RuleDraw } from '@/components/motion/RuleDraw';
import { Container, Section } from '@/components/ui/Container';
import { getFosterNeeded } from '@/lib/animals';
import type { SectionProps } from './SectionRenderer';

/**
 * A page header is a cover, not a tinted strip: folio bar, masthead at cover
 * scale, a red rule and a deck. On the ink canvas the foster page also gets a
 * computed live count and the empty kennel with its door open, which is the
 * best message on that page. The editor's image field is not rendered — the
 * cover is typographic.
 */

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

/** Small numbers read as words in a sentence; larger ones stay as figures. */
function inWords(n: number): string {
  return n < WORDS.length ? WORDS[n] : String(n);
}

/** The foster page, and not one of the foster application forms. */
function isFosterCover(heading: string, eyebrow?: string): boolean {
  const text = `${eyebrow ?? ''} ${heading}`.toLowerCase();
  return text.includes('foster') && !/applicat|questionnaire|apply/.test(text);
}

export async function PageHeader({ section, canvas, index, topRule }: SectionProps<'section.pageHeader'>) {
  const { eyebrow, heading, lead } = section;
  const onInk = canvas === 'ink';
  const foster = onInk && isFosterCover(heading, eyebrow);
  const waiting = foster ? (await getFosterNeeded()).length : 0;
  const liveLine =
    waiting === 1
      ? 'One animal is waiting on a foster home right now.'
      : waiting > 1
        ? `${inWords(waiting)[0].toUpperCase()}${inWords(waiting).slice(1)} animals are waiting on a foster home right now.`
        : null;

  return (
    <Section canvas={canvas} topRule={topRule} labelledBy="page-heading" className="overflow-x-clip">
      <Container>
        <FolioBar rubric={eyebrow?.trim() || 'Haart · Perth'} numeral={index + 1} />
        <div className={foster ? 'grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14' : ''}>
          <MastheadRise>
            <RiseItem>
              <h1 id="page-heading" className={`${mastheadClass(heading)} text-[color:var(--text-strong)]`}>
                {heading}
              </h1>
            </RiseItem>
            <RiseItem className="mt-8">
              <RuleDraw className="block h-1 w-10 bg-[color:var(--rule)]" />
            </RiseItem>
            {lead ? (
              <RiseItem className="mt-6">
                <p className="max-w-[46ch] text-deck italic text-[color:var(--text-muted)]">{lead}</p>
              </RiseItem>
            ) : null}
            {liveLine ? (
              <RiseItem className="mt-6">
                <p className="font-display text-[1.375rem] leading-tight font-extrabold text-[color:var(--rule)]">{liveLine}</p>
              </RiseItem>
            ) : null}
          </MastheadRise>

          {foster ? (
            <div className="mt-4 w-[280px] max-w-full lg:mt-0 lg:-mr-16 lg:ml-auto lg:w-[480px] lg:max-w-none">
              <Kennel />
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
