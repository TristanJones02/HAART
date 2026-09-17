import type { Article, Category, Person, Series } from '@/lib/content/types';
import { textToPortable } from '@/lib/sanity/portable';

/**
 * Seed editorial content. These are SAMPLE stories written to show the
 * article system working; they are not HAART's words and must be replaced
 * or deleted before launch. Real rescue stories live in Facebook posts today
 * (see docs/audit.md section 4.8).
 */
export const MOCK_PEOPLE: Person[] = [{ _type: 'person', name: 'HAART team', slug: 'haart-team', role: 'Volunteers' }];

export const MOCK_CATEGORIES: Category[] = [
  { _type: 'category', title: 'Rescue stories', slug: 'rescue-stories', description: 'Where an animal came from and where it ended up.' },
  { _type: 'category', title: 'Fostering', slug: 'fostering', description: 'What fostering is really like, from the people doing it.' },
  { _type: 'category', title: 'News', slug: 'news', description: 'Events, fundraisers and updates from the team.' },
];

export const MOCK_SERIES: Series[] = [
  { _type: 'series', title: 'Foster diaries', slug: 'foster-diaries', description: 'A sample series: one foster carer, one dog, one week at a time.' },
];

const img = (n: number, alt: string) => ({ alt, url: `/placeholders/dog-${n}.svg`, width: 1200, height: 900 });

export const MOCK_ARTICLES: Article[] = [
  {
    _type: 'article',
    title: 'Sample story: from the pound to the couch in six weeks',
    slug: 'sample-pound-to-couch',
    excerpt: 'A sample rescue story showing how an article looks with a featured image, categories, related animals and share links.',
    featuredImage: img(2, 'Placeholder image standing in for a photo of a rescued dog'),
    author: MOCK_PEOPLE[0],
    categories: [MOCK_CATEGORIES[0]],
    publishedAt: '2026-09-01T02:00:00.000Z',
    body: textToPortable(
      'This is sample content. It exists so the story layout, the author line, the related animals and the sharing buttons can be seen working before real stories are written.\n\nA real story on this page would follow one animal from the day HAART took it on: where it came from, what the vet found, what the foster carer noticed in the first week, and where it is now. Short paragraphs, one or two photos, and the adopter or foster carer in their own words where they are happy to be quoted.\n\nStories about neglect or injury should use the content warning setting and mark distressing photos, which blurs them until the reader chooses to look.',
    ),
    relatedAnimals: [],
  },
  {
    _type: 'article',
    title: 'Sample: foster diaries, week one',
    slug: 'sample-foster-diaries-week-one',
    excerpt: 'Part one of a sample series, showing how multi-part campaigns are grouped and navigated.',
    featuredImage: img(4, 'Placeholder image standing in for a photo of a foster dog'),
    author: MOCK_PEOPLE[0],
    categories: [MOCK_CATEGORIES[1]],
    series: MOCK_SERIES[0],
    seriesPart: 1,
    publishedAt: '2026-08-20T02:00:00.000Z',
    body: textToPortable(
      'Sample content. A series groups related stories so a campaign can be published over weeks and read in order.\n\nEach part shows its place in the series and links to the previous and next parts. The series page lists every part with the series description at the top.',
    ),
  },
  {
    _type: 'article',
    title: 'Sample: foster diaries, week two',
    slug: 'sample-foster-diaries-week-two',
    excerpt: 'Part two of the sample series.',
    featuredImage: img(5, 'Placeholder image standing in for a photo of a foster dog'),
    author: MOCK_PEOPLE[0],
    categories: [MOCK_CATEGORIES[1]],
    series: MOCK_SERIES[0],
    seriesPart: 2,
    publishedAt: '2026-08-27T02:00:00.000Z',
    body: textToPortable('Sample content for the second part of the series.'),
  },
  {
    _type: 'article',
    title: 'Sample news: quiz night is back',
    slug: 'sample-quiz-night',
    excerpt: 'A sample news post. Events themselves come from the Facebook feed; a story like this adds the background.',
    featuredImage: img(1, 'Placeholder image standing in for an event photo'),
    author: MOCK_PEOPLE[0],
    categories: [MOCK_CATEGORIES[2]],
    publishedAt: '2026-08-10T02:00:00.000Z',
    body: textToPortable('Sample content. Use news posts for the story behind an event: what last year raised, what the money paid for, who to thank.'),
  },
];
