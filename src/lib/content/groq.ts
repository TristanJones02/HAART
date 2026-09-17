/** Shared GROQ projections so every image and link resolves the same way. */
export const IMG = `{ alt, caption, sensitive, hotspot, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "lqip": asset->metadata.lqip }`;

export const LINK = `{ label, href }`;

export const ARTICLE_CARD = `{
  _id, _type, title, "slug": slug.current, excerpt, publishedAt,
  featuredImage ${IMG},
  "categories": categories[]->{ _id, _type, title, "slug": slug.current },
  "series": series->{ _id, _type, title, "slug": slug.current },
  seriesPart
}`;

export const SECTIONS = `sections[]{
  ...,
  image ${IMG},
  primaryCta ${LINK}, secondaryCta ${LINK}, cta ${LINK}, primary ${LINK}, secondary ${LINK},
  items[]{ ..., link ${LINK} },
  cards[]{ ..., cta ${LINK} },
  "article": article->${ARTICLE_CARD},
  "category": category->slug.current,
  "series": series->slug.current
}`;

export const PAGE = `{ _id, _type, title, "slug": slug.current, seo{ title, description, noIndex, image ${IMG} }, ${SECTIONS} }`;
