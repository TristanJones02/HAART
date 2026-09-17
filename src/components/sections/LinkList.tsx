import Link from 'next/link';
import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { UiIcon } from '@/components/ui/Icon';
import { Reveal } from '@/components/motion/Reveal';
import type { SectionProps } from './SectionRenderer';

export function LinkList({ section, surface }: SectionProps<'section.linkList'>) {
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} />
        <Reveal>
          <ul className="max-w-prose divide-y divide-border rounded-card border border-border bg-paper-0">
            {section.links.map((l, i) => {
              const external = /^https?:\/\//.test(l.href);
              const inner = (
                <>
                  <span>
                    <span className="block font-display text-lead font-bold text-charcoal-900">{l.label}</span>
                    {l.description ? <span className="mt-0.5 block text-body text-charcoal-700">{l.description}</span> : null}
                  </span>
                  <UiIcon name={external ? 'ExternalLink' : 'ArrowRight'} size={20} className="shrink-0 text-red-600" />
                </>
              );
              const cls = 'flex items-center justify-between gap-4 px-5 py-4 hover:bg-paper-50';
              return (
                <li key={l._key ?? i}>
                  {external ? (
                    <a href={l.href} className={cls} rel="noopener noreferrer" target="_blank">
                      {inner}
                    </a>
                  ) : (
                    <Link href={l.href} className={cls}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
