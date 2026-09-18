import type { Section } from '@/lib/content/types';
import { type Canvas, canvasClass, isLight } from '@/components/ui/Container';
import { DashRule } from '@/components/art/DashRule';
import { applyAdjacencyGuard, baseCanvasFor } from './canvasFor';
import { Hero } from './Hero';
import { PageHeader } from './PageHeader';
import { ActionGrid } from './ActionGrid';
import { RichText } from './RichText';
import { StepList } from './StepList';
import { IconList } from './IconList';
import { Faq } from './Faq';
import { StatBand } from './StatBand';
import { TrustBand } from './TrustBand';
import { Cta } from './Cta';
import { SpeciesTiles } from './SpeciesTiles';
import { FeeTable } from './FeeTable';
import { AnimalGridSection } from './AnimalGridSection';
import { AnimalListingSection } from './AnimalListingSection';
import { FosterNeededStrip } from './FosterNeededStrip';
import { EventsStrip } from './EventsStrip';
import { EventListSection } from './EventListSection';
import { StoryFeature } from './StoryFeature';
import { ArticleListSection } from './ArticleListSection';
import { PartnerGrid, PartnerLogos } from './Partners';
import { PriceCards } from './PriceCards';
import { ProductGrid } from './ProductGrid';
import { DonateWidgetSection } from './DonateWidgetSection';
import { OtherWaysToGive } from './OtherWaysToGive';
import { ContactDetails } from './ContactDetails';
import { FormEmbed } from './FormEmbed';
import { LinkList } from './LinkList';
import { Newsletter } from './Newsletter';
import { ImageWithText } from './ImageWithText';
import { Quote } from './Quote';

export type SectionProps<T extends Section['_type']> = {
  section: Extract<Section, { _type: T }>;
  canvas: Canvas;
  index: number;
  /** True when the previous block shared this canvas family and a rule closes the seam. */
  topRule?: boolean;
};

/**
 * Renders a page's section array.
 *
 * The canvas comes from the block's type, never its position, and the
 * adjacency guard stops two identical canvases touching. Blocks that render
 * nothing (an events strip with no events in the window) do not consume a
 * slot, so the rhythm never develops a hole.
 */
export async function SectionRenderer({ sections, pageSlug }: { sections: Section[]; pageSlug?: string }) {
  const out: React.ReactNode[] = [];
  let previous: Canvas | null = null;

  for (const section of sections) {
    const canvas = applyAdjacencyGuard(baseCanvasFor(section, pageSlug), previous);
    const topRule = previous !== null && isLight(previous) && isLight(canvas);
    const node = await renderSection(section, canvas, out.length, topRule);
    if (!node) continue;

    // light -> ink: the printer's ornament sits on the light side of the seam.
    if (previous !== null && isLight(previous) && canvas === 'ink') {
      out.push(
        <div key={`${section._key}-seam`} className={`${canvasClass[previous]} pb-6`}>
          <DashRule bleed />
        </div>,
      );
    }
    out.push(<div key={section._key}>{node}</div>);
    previous = canvas;
  }
  return <>{out}</>;
}

async function renderSection(section: Section, canvas: Canvas, index: number, topRule: boolean) {
  const p = { canvas, index, topRule };
  switch (section._type) {
    case 'section.hero':
      return <Hero section={section} {...p} />;
    case 'section.pageHeader':
      return <PageHeader section={section} {...p} />;
    case 'section.actionGrid':
      return <ActionGrid section={section} {...p} />;
    case 'section.richText':
      return <RichText section={section} {...p} />;
    case 'section.stepList':
      return <StepList section={section} {...p} />;
    case 'section.iconList':
      return <IconList section={section} {...p} />;
    case 'section.faq':
      return <Faq section={section} {...p} />;
    case 'section.statBand':
      return <StatBand section={section} {...p} />;
    case 'section.trustBand':
      return <TrustBand section={section} {...p} />;
    case 'section.cta':
      return <Cta section={section} {...p} />;
    case 'section.speciesTiles':
      return <SpeciesTiles section={section} {...p} />;
    case 'section.feeTable':
      return <FeeTable section={section} {...p} />;
    case 'section.animalGrid':
      return <AnimalGridSection section={section} {...p} />;
    case 'section.animalListing':
      return <AnimalListingSection section={section} {...p} />;
    case 'section.fosterNeededStrip':
      return <FosterNeededStrip section={section} {...p} />;
    case 'section.eventsStrip':
      return <EventsStrip section={section} {...p} />;
    case 'section.eventList':
      return <EventListSection section={section} {...p} />;
    case 'section.storyFeature':
      return <StoryFeature section={section} {...p} />;
    case 'section.articleList':
      return <ArticleListSection section={section} {...p} />;
    case 'section.partnerGrid':
      return <PartnerGrid section={section} {...p} />;
    case 'section.partnerLogos':
      return <PartnerLogos section={section} {...p} />;
    case 'section.priceCards':
      return <PriceCards section={section} {...p} />;
    case 'section.productGrid':
      return <ProductGrid section={section} {...p} />;
    case 'section.donateWidget':
      return <DonateWidgetSection section={section} {...p} />;
    case 'section.otherWaysToGive':
      return <OtherWaysToGive section={section} {...p} />;
    case 'section.contactDetails':
      return <ContactDetails section={section} {...p} />;
    case 'section.formEmbed':
      return <FormEmbed section={section} {...p} />;
    case 'section.linkList':
      return <LinkList section={section} {...p} />;
    case 'section.newsletter':
      return <Newsletter section={section} {...p} />;
    case 'section.imageWithText':
      return <ImageWithText section={section} {...p} />;
    case 'section.quote':
      return <Quote section={section} {...p} />;
    default:
      return null;
  }
}
