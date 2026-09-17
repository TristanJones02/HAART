import Link from 'next/link';
import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Icon, UiIcon } from '@/components/ui/Icon';
import { CopyButton } from '@/components/ui/CopyButton';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

export async function OtherWaysToGive({ section, surface }: SectionProps<'section.otherWaysToGive'>) {
  const s = await getSiteSettings();
  const bank = s.donate.bankDetails;
  const bankComplete = !!(bank?.accountName && bank?.bsb && bank?.accountNumber);
  const c4c = s.donate.containersForChangeId;
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={id}>
      <Container>
        <SectionHeading id={id} heading={section.heading ?? 'Other ways to give'} />
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.showBankDetails !== false ? (
            <StaggerItem as="li" className="h-full">
              <article className="flex h-full flex-col rounded-card border border-border bg-paper-0 p-5 shadow-card">
                <span className="inline-flex size-11 items-center justify-center rounded-control bg-red-50 text-red-600">
                  <Icon name="dollar" size={24} />
                </span>
                <h3 className="mt-4 text-h3">Bank transfer</h3>
                {bankComplete ? (
                  <dl className="mt-2 space-y-1 text-body">
                    <div className="flex justify-between gap-2">
                      <dt className="text-charcoal-550">Account name</dt>
                      <dd className="font-semibold">{bank!.accountName}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-charcoal-550">BSB</dt>
                      <dd className="flex items-center gap-2 font-semibold">
                        {bank!.bsb}
                        <CopyButton value={bank!.bsb!} label="Copy" />
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-charcoal-550">Account</dt>
                      <dd className="flex items-center gap-2 font-semibold">
                        {bank!.accountNumber}
                        <CopyButton value={bank!.accountNumber!} label="Copy" />
                      </dd>
                    </div>
                    {bank!.reference ? (
                      <div className="flex justify-between gap-2">
                        <dt className="text-charcoal-550">Reference</dt>
                        <dd className="font-semibold">{bank!.reference}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : (
                  <p className="mt-2 flex-1 text-body text-charcoal-700">
                    Email <a href={`mailto:${s.contact.email}?subject=Bank%20transfer%20donation`} className="text-red-600 underline underline-offset-4">{s.contact.email}</a> for our account details and we will send a receipt.
                  </p>
                )}
              </article>
            </StaggerItem>
          ) : null}
          {section.showContainersForChange !== false ? (
            <StaggerItem as="li" className="h-full">
              <article className="flex h-full flex-col rounded-card border border-border bg-paper-0 p-5 shadow-card">
                <span className="inline-flex size-11 items-center justify-center rounded-control bg-red-50 text-red-600">
                  <Icon name="repeat" size={24} />
                </span>
                <h3 className="mt-4 text-h3">Containers for Change</h3>
                <p className="mt-2 flex-1 text-body text-charcoal-700">Take your containers to your local drop off point and donate the proceeds to HAART with our scheme ID.</p>
                {c4c ? (
                  <p className="mt-3 flex items-center gap-2">
                    <span className="rounded-control bg-paper-100 px-3 py-2 font-display text-lead font-bold">{c4c}</span>
                    <CopyButton value={c4c} label="Copy ID" />
                  </p>
                ) : (
                  <p className="mt-3 text-small text-charcoal-550">Scheme ID coming soon. Ask at the depot for HAART.</p>
                )}
              </article>
            </StaggerItem>
          ) : null}
          {section.items?.map((item, i) => (
            <StaggerItem key={item._key ?? i} as="li" className="h-full">
              <article className="flex h-full flex-col rounded-card border border-border bg-paper-0 p-5 shadow-card">
                <span className="inline-flex size-11 items-center justify-center rounded-control bg-red-50 text-red-600">
                  <Icon name={item.icon} size={24} />
                </span>
                <h3 className="mt-4 text-h3">{item.heading}</h3>
                <p className="mt-2 flex-1 text-body text-charcoal-700">{item.text}</p>
                {item.link ? (
                  <Link href={item.link.href} className="mt-4 inline-flex items-center gap-1 text-small font-semibold text-red-600 hover:underline">
                    {item.link.label}
                    <UiIcon name="ArrowRight" size={16} />
                  </Link>
                ) : null}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
