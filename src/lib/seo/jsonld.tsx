import type { Article, Event, SiteSettings } from '@/lib/content/types';
import { siteUrl } from './metadata';
import { resolveImageUrl } from '@/lib/sanity/image';

/** Renders a JSON-LD script. Values are serialised with `<` escaped so content cannot break out of the tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function organisationJsonLd(s: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: s.organisationNameLong,
    alternateName: s.organisationName,
    legalName: s.legalName,
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    email: s.contact.email,
    telephone: s.contact.phone,
    areaServed: 'Perth, Western Australia',
    foundingDate: s.foundedYear.verified && s.foundedYear.value ? String(s.foundedYear.value) : undefined,
    identifier: s.abn.verified && s.abn.value ? { '@type': 'PropertyValue', propertyID: 'ABN', value: s.abn.value } : undefined,
    nonprofitStatus: 'NonprofitType',
    sameAs: [s.social.facebook, s.social.instagram, s.social.x, s.social.petrescue].filter(Boolean),
  };
}

export function articleJsonLd(a: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    image: resolveImageUrl(a.featuredImage, 1200) ? [absolute(resolveImageUrl(a.featuredImage, 1200)!)] : undefined,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt ?? a.publishedAt,
    author: { '@type': a.author?.name === 'HAART team' ? 'Organization' : 'Person', name: a.author?.name ?? 'HAART' },
    publisher: { '@type': 'Organization', name: 'HAART', logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.png` } },
    mainEntityOfPage: `${siteUrl}/stories/${a.slug}`,
    isPartOf: a.series ? { '@type': 'CreativeWorkSeries', name: a.series.title, url: `${siteUrl}/stories/series/${a.series.slug}` } : undefined,
  };
}

export function eventJsonLd(e: Event) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    description: e.description,
    startDate: e.start,
    endDate: e.end,
    eventStatus: e.cancelled ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: e.facebookUrl,
    location: e.location
      ? { '@type': 'Place', name: e.location.name, address: e.location.address, geo: e.location.lat && e.location.lng ? { '@type': 'GeoCoordinates', latitude: e.location.lat, longitude: e.location.lng } : undefined }
      : undefined,
    organizer: { '@type': 'Organization', name: 'HAART', url: siteUrl },
    offers: e.ticketLink ? { '@type': 'Offer', url: e.ticketLink, availability: 'https://schema.org/InStock' } : undefined,
    image: e.image ? absolute(resolveImageUrl(e.image, 1200) ?? '') : undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${siteUrl}${it.path}` })),
  };
}

const absolute = (u: string) => (u.startsWith('http') ? u : `${siteUrl}${u}`);
