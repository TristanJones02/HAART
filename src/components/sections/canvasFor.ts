import type { Canvas } from '@/components/ui/Container';
import type { Section } from '@/lib/content/types';

/**
 * Canvas by block type (docs/design-direction.md §5.1 and §5.2). Where the
 * two tables disagreed on `feeTable`, the block-by-block table wins: a fee
 * ledger belongs on sand with the other index layouts.
 */
const BY_TYPE: Record<string, Canvas> = {
  'section.hero': 'paper',
  'section.pageHeader': 'paper',
  'section.richText': 'paper',
  'section.stepList': 'paper',
  'section.faq': 'paper',
  'section.eventList': 'paper',
  'section.articleList': 'paper',
  'section.donateWidget': 'paper',
  'section.formEmbed': 'paper',
  'section.linkList': 'paper',
  'section.imageWithText': 'paper',

  'section.trustBand': 'cream',
  'section.eventsStrip': 'cream',
  'section.partnerGrid': 'cream',
  'section.partnerLogos': 'cream',
  'section.contactDetails': 'cream',

  'section.actionGrid': 'sand',
  'section.iconList': 'sand',
  'section.speciesTiles': 'sand',
  'section.animalGrid': 'sand',
  'section.animalListing': 'sand',
  'section.priceCards': 'sand',
  'section.productGrid': 'sand',
  'section.otherWaysToGive': 'sand',
  'section.quote': 'sand',
  'section.feeTable': 'sand',

  'section.statBand': 'ink',
  'section.cta': 'ink',
  'section.fosterNeededStrip': 'ink',
  'section.storyFeature': 'ink',
  'section.newsletter': 'ink',
};

/** Page headers go to ink on the three pages that carry the serious ask. */
const INK_PAGE_HEADERS = new Set(['foster', 'donate', 'stories']);

export function baseCanvasFor(section: Section, pageSlug?: string): Canvas {
  if (section._type === 'section.pageHeader' && pageSlug && INK_PAGE_HEADERS.has(pageSlug)) return 'ink';
  return BY_TYPE[section._type] ?? 'paper';
}

/**
 * Two identical canvases must never touch. The guard substitutes a partner
 * rather than papering the seam with a divider: paper and cream swap, and
 * both sand and ink fall back to cream. Refusing to place two ink blocks
 * together is deliberate — it is why the foster page's header stands alone.
 */
export function applyAdjacencyGuard(canvas: Canvas, previous: Canvas | null): Canvas {
  if (previous !== canvas) return canvas;
  if (canvas === 'paper') return 'cream';
  if (canvas === 'cream') return 'paper';
  return 'cream';
}
