import type { Section } from '@/lib/content/types';
import { surfaceForIndex } from '@/components/ui/Container';
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
  surface: 'paper-0' | 'paper-50' | 'paper-100';
  index: number;
  /** Search params passed down for form prefill and donate frequency. */
  searchParams?: Record<string, string | string[] | undefined>;
};

/**
 * Renders a page's section array. The surface alternates Paper 0, 50, 100 by
 * position; sections that render nothing (empty strips) do not consume a slot,
 * which is why the alternation is tracked with a counter rather than the array index.
 */
export async function SectionRenderer({ sections, searchParams }: { sections: Section[]; searchParams?: SectionProps<'section.hero'>['searchParams'] }) {
  const out: React.ReactNode[] = [];
  let slot = 0;
  for (const section of sections) {
    // Full-bleed blocks (hero, page header) sit outside the alternation.
    const isChrome = section._type === 'section.hero' || section._type === 'section.pageHeader';
    const surface = isChrome ? 'paper-0' : surfaceForIndex(slot);
    const node = await renderSection(section, surface, slot, searchParams);
    if (node) {
      out.push(<div key={section._key}>{node}</div>);
      if (!isChrome) slot += 1;
    }
  }
  return <>{out}</>;
}

async function renderSection(section: Section, surface: SectionProps<'section.hero'>['surface'], index: number, searchParams?: SectionProps<'section.hero'>['searchParams']) {
  const p = { surface, index, searchParams };
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
