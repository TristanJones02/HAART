import type { MetadataRoute } from 'next';

/**
 * Nothing here is indexable, ever.
 *
 * This is an unofficial concept rebuild carrying a real charity's name. A
 * review copy outranking, or merely sitting beside, the rescue's own site
 * would send adopters and donors to a page that cannot take either. There is
 * no environment branch: no deployment of this project is allowed to be
 * crawled. The root layout sets `noindex, nofollow` as well, because
 * robots.txt is a request and a meta directive is an instruction.
 */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', disallow: '/' }] };
}
