import { SmartImage } from '@/components/ui/SmartImage';
import type { SectionProps } from './SectionRenderer';

export function PageHeader({ section }: SectionProps<'section.pageHeader'>) {
  const { eyebrow, heading, lead, image } = section;
  return (
    <section className="border-b border-border bg-paper-50" aria-labelledby="page-heading">
      <div className={`container-site grid gap-8 py-12 sm:py-16 ${image ? 'lg:grid-cols-[1.2fr_1fr] lg:items-center' : ''}`}>
        <div className="max-w-prose">
          {eyebrow ? <p className="mb-2 text-tiny uppercase tracking-caps text-red-600">{eyebrow}</p> : null}
          <h1 id="page-heading" className="text-h1">
            {heading}
          </h1>
          {lead ? <p className="mt-4 text-lead text-charcoal-700">{lead}</p> : null}
        </div>
        {image ? <SmartImage image={image} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 480px, 100vw" className="rounded-card" priority /> : null}
      </div>
    </section>
  );
}
