import type { ReactNode } from 'react';
import { Container, Section } from '@/components/ui/Container';
import { CopyButton } from '@/components/ui/CopyButton';
import { FolioBar, IndexList, OutlineNumeral, RuleLink, sectionHeadClass } from '@/components/art';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

/** One column of the index: a numeral, a heading and the detail. No icon box. */
function GiveItem({ n, heading, children }: { n: number; heading: string; children: ReactNode }) {
  return (
    <li className="border-t border-[color:var(--hairline)] pt-6">
      <OutlineNumeral n={n} size="index" />
      <h3 className="mt-3 text-feature">{heading}</h3>
      <div className="mt-3">{children}</div>
    </li>
  );
}

export async function OtherWaysToGive({ section, canvas, topRule }: SectionProps<'section.otherWaysToGive'>) {
  const s = await getSiteSettings();
  const bank = s.donate.bankDetails;
  const bankComplete = !!(bank?.accountName && bank?.bsb && bank?.accountNumber);
  const c4c = s.donate.containersForChangeId;
  const id = `s-${section._key}`;
  const heading = section.heading ?? 'Other ways to give';

  const items: ReactNode[] = [];
  const push = (heading: string, body: ReactNode) => {
    items.push(
      <GiveItem key={heading} n={items.length + 1} heading={heading}>
        {body}
      </GiveItem>,
    );
  };

  if (section.showBankDetails !== false) {
    push(
      'Bank transfer',
      bankComplete ? (
        <IndexList
          dense
          rows={[
            { label: 'Account name', value: bank?.accountName },
            {
              label: 'BSB',
              value: (
                <span className="inline-flex items-center gap-2">
                  {bank?.bsb}
                  <CopyButton value={bank!.bsb!} label="Copy" />
                </span>
              ),
            },
            {
              label: 'Account',
              value: (
                <span className="inline-flex items-center gap-2">
                  {bank?.accountNumber}
                  <CopyButton value={bank!.accountNumber!} label="Copy" />
                </span>
              ),
            },
            { label: 'Reference', value: bank?.reference },
          ]}
        />
      ) : (
        <p className="text-body text-[color:var(--text-muted)]">
          Email{' '}
          <a href={`mailto:${s.contact.email}?subject=Bank%20transfer%20donation`} className="underline underline-offset-4 decoration-[color:var(--rule)]">
            {s.contact.email}
          </a>{' '}
          for our account details and we will send a receipt.
        </p>
      ),
    );
  }

  if (section.showContainersForChange !== false) {
    push(
      'Containers for Change',
      <>
        <p className="text-body text-[color:var(--text-muted)]">Take your containers to your local drop off point and donate the proceeds to HAART with our scheme ID.</p>
        {c4c ? (
          <p className="mt-4 flex flex-wrap items-center gap-3">
            <span className="border border-[color:var(--hairline)] px-3 py-2 font-display text-[1.125rem] font-bold tabular-nums">{c4c}</span>
            <CopyButton value={c4c} label="Copy ID" />
          </p>
        ) : (
          <p className="mt-3 text-small italic text-[color:var(--text-caption)]">Scheme ID coming soon. Ask at the depot for HAART.</p>
        )}
      </>,
    );
  }

  for (const item of section.items ?? []) {
    push(
      item.heading,
      <>
        <p className="text-body text-[color:var(--text-muted)]">{item.text}</p>
        {item.link ? (
          <p className="mt-4">
            <RuleLink href={item.link.href}>
              {item.link.label}
              <span className="sr-only">: {item.heading}</span>
            </RuleLink>
          </p>
        ) : null}
      </>,
    );
  }

  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={id}>
      <Container>
        <FolioBar rubric="More ways to give" />
        <h2 id={id} className={`mb-10 ${sectionHeadClass(heading)}`}>
          {heading}
        </h2>
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{items}</ul>
      </Container>
    </Section>
  );
}
