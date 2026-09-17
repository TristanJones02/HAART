import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { DynamicForm, prefillFromSearchParams, formStatusFromSearchParams } from '@/components/forms';
import { getFormDefinition } from '@/lib/forms/definitions';
import type { SectionProps } from './SectionRenderer';

export function FormEmbed({ section, surface, searchParams }: SectionProps<'section.formEmbed'>) {
  const def = getFormDefinition(section.form);
  const id = `s-${section._key}`;
  const params = searchParams ?? {};
  return (
    <Section surface={surface} labelledBy={id}>
      <Container>
        <SectionHeading id={id} heading={section.heading ?? def.title} lead={section.intro ?? def.intro} />
        <DynamicForm definition={def} prefill={prefillFromSearchParams(params)} initialStatus={formStatusFromSearchParams(params)} className="max-w-prose" />
      </Container>
    </Section>
  );
}
