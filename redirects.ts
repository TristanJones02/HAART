/**
 * Old URL -> new URL map for the haart.org.au rebuild.
 *
 * Imported by next.config.ts. Every entry is a permanent (308) redirect.
 * Both hosts (www and apex) served the old site; host canonicalisation is
 * handled by the `hostRedirects` export and by the DNS/CDN layer, and the
 * path map below applies to whichever host the request lands on.
 *
 * Sources for the old paths: docs/content-inventory.json (search-index
 * reconstruction, 17 Sep 2026). Run scripts/crawl-inventory.ts to append any
 * path it discovers that is not listed here; the script prints candidates.
 */

export type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

const permanent = (source: string, destination: string): Redirect => ({
  source,
  destination,
  permanent: true,
});

/** Pages that moved or merged. Trailing slashes are handled by Next (trailingSlash: false). */
export const pageRedirects: Redirect[] = [
  permanent('/about-our-rescue-mission', '/about'),
  permanent('/adopt/pre-adoption-questionnaire-dogs', '/adopt/apply/dogs'),
  permanent('/adopt/pre-adoption-questionnaire-cats', '/adopt/apply/cats'),
  permanent('/foster/dogs', '/foster/apply/dogs'),
  permanent('/foster/cats', '/foster/apply/cats'),
  permanent('/friends-of-haart', '/partners'),
  permanent('/sponsor-kennel', '/partners'),
  permanent('/sponsorship-application', '/partners/apply'),
  permanent('/goodwill-wines', '/support'),
  permanent('/adoption-gallery-cats', '/adopt/cats'),
  permanent('/adoption-gallery-dogs', '/adopt/dogs'),
  permanent('/adoption-gallery', '/adopt'),
];

/** Animal profiles whose slugs were regenerated (WordPress fallbacks and un-suffixed names). */
export const animalRedirects: Redirect[] = [
  permanent('/adopt/dogs/3380-2', '/adopt/dogs/poppy-hd26-042'),
  permanent('/adopt/dogs/artie', '/adopt/dogs/artie-hd21-041'),
  permanent('/adopt/dogs/rosemary-hd26-44', '/adopt/dogs/rosemary-hd26-044'),
  permanent('/adopt/cats/sabrina-hc25-028-2', '/adopt/cats/sabrina-hc25-028'),
  permanent('/adopt/cats/john-wayne', '/adopt/cats/john-wayne-hc26-002'),
];

/** WordPress and WooCommerce paths that have no equivalent. */
export const platformRedirects: Redirect[] = [
  permanent('/shop', '/shop'),
  permanent('/product/:slug', '/shop'),
  permanent('/product-category/:slug*', '/shop'),
  permanent('/cart', '/shop'),
  permanent('/checkout', '/shop'),
  permanent('/my-account', '/shop'),
  permanent('/feed', '/stories/feed.xml'),
  permanent('/category/:slug*', '/stories'),
  permanent('/tag/:slug*', '/stories'),
  permanent('/author/:slug*', '/stories'),
  permanent('/wp-login.php', '/'),
  permanent('/wp-admin/:path*', '/'),
  permanent('/xmlrpc.php', '/'),
  permanent('/page/:n(\\d+)', '/'),
];

/** www -> apex. Also configure at the DNS/CDN layer; this catches anything that slips through. */
export const hostRedirects = [
  {
    source: '/:path*',
    has: [{ type: 'host' as const, value: 'www.haart.org.au' }],
    destination: 'https://haart.org.au/:path*',
    permanent: true,
  },
];

const dedupe = (list: Redirect[]) => {
  const seen = new Set<string>();
  return list.filter((r) => {
    if (seen.has(r.source) || r.source === r.destination) return false;
    seen.add(r.source);
    return true;
  });
};

export const redirects = dedupe([...pageRedirects, ...animalRedirects, ...platformRedirects]);

export default redirects;
