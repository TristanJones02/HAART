import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { DynamicForm } from '@/components/forms';
import { getFormDefinition } from '@/lib/forms/definitions';
import type { SectionProps } from './SectionRenderer';

export function FormEmbed({ section, surface }: SectionProps<'section.formEmbed'>) {
  const def = getFormDefinition(section.form);
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={id}>
      <Container>
        <SectionHeading id={id} heading={section.heading ?? def.title} lead={section.intro ?? def.intro} />
        {/* ?animal= prefill and ?sent=1 status are read client-side so this page stays static. */}
        <DynamicForm definition={def} prefillFromUrl className="max-w-prose" />
      </Container>
    </Section>
  );
}
