import { imageWithAlt, link, seo, portableText, simpleText } from './objects';
import { siteSettings, page, animal, article, category, series, person, event, syncStatus, product, partner, submission } from './documents';
import { sections } from './sections';

export const schemaTypes = [
  // objects
  imageWithAlt,
  link,
  seo,
  portableText,
  simpleText,
  ...sections,
  // documents
  siteSettings,
  page,
  animal,
  article,
  category,
  series,
  person,
  event,
  syncStatus,
  product,
  partner,
  submission,
];

export const SINGLETON_TYPES = new Set(['siteSettings']);
export const HIDDEN_FROM_CREATE = new Set(['siteSettings', 'syncStatus', 'submission']);
