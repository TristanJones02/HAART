import Link from 'next/link';
import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Icon, UiIcon } from '@/components/ui/Icon';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { HoverLift } from '@/components/motion/HoverLift';
import type { SectionProps } from './SectionRenderer';

export function ActionGrid({ section, surface }: SectionProps<'section.actionGrid'>) {
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} />
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {section.items.map((item, i) => (
            <StaggerItem key={item._key ?? i} as="li" className="h-full">
              <HoverLift>
                <Link href={item.link.href} className="group flex h-full flex-col rounded-card border border-border bg-paper-0 p-5 shadow-card transition-shadow duration-150 hover:shadow-card-hover">
                  <span className="inline-flex size-11 items-center justify-center rounded-control bg-red-50 text-red-600">
                    <Icon name={item.icon} size={24} />
                  </span>
                  <h3 className="mt-4 text-h3">{item.heading}</h3>
                  <p className="mt-2 flex-1 text-body text-charcoal-700">{item.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 font-semibold text-red-600 group-hover:underline">
                    {item.link.label}
                    <UiIcon name="ArrowRight" size={16} />
                  </span>
                </Link>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
