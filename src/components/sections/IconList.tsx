import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import type { SectionProps } from './SectionRenderer';

export function IconList({ section, surface }: SectionProps<'section.iconList'>) {
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} lead={section.intro} />
        <Stagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {section.items.map((item, i) => (
            <StaggerItem key={item._key ?? i} as="li" className="flex gap-4">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-control bg-paper-0 text-red-600 shadow-card">
                <Icon name={item.icon} size={24} />
              </span>
              <div>
                <h3 className="text-h3">{item.heading}</h3>
                <p className="mt-1 text-body text-charcoal-700">{item.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
