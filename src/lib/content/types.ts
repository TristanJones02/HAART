/**
 * Content types shared by the Next app, the mock data, the import script and
 * the animal adapters. They mirror the Sanity schemas in /sanity/schemas but
 * are written by hand so the Next bundle never imports the `sanity` package.
 *
 * Keep the two in step: a field added to a schema is added here.
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type PortableTextBlock = {
  _type: string;
  _key?: string;
  [key: string]: unknown;
};

export type SanityImageRef = {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' } | { _id: string; url: string; metadata?: ImageMetadata };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type ImageMetadata = {
  dimensions?: { width: number; height: number; aspectRatio: number };
  lqip?: string;
  palette?: unknown;
};

/** An image with required alt text. `url` is present when resolved (mock or GROQ projection). */
export type ImageWithAlt = {
  _type?: 'imageWithAlt';
  alt: string;
  caption?: string;
  /** Distressing content: rendered blurred behind a reveal control. */
  sensitive?: boolean;
  /** Resolved absolute URL (Sanity CDN, PetRescue or a local /public file). */
  url?: string;
  width?: number;
  height?: number;
  lqip?: string;
  image?: SanityImageRef;
  hotspot?: SanityImageRef['hotspot'];
};

export type Link = {
  _type?: 'link';
  label: string;
  /** Internal path (starts with /) or absolute URL. */
  href: string;
  external?: boolean;
};

export type Seo = {
  title?: string;
  description?: string;
  image?: ImageWithAlt;
  noIndex?: boolean;
};

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export type Verified<T> = { value: T | null; verified: boolean; note?: string };

export type SiteSettings = {
  _type: 'siteSettings';
  organisationName: string;
  organisationNameLong: string;
  legalName: string;
  tagline: string;
  abn: Verified<string>;
  acncRegisterId: Verified<string>;
  /** Deductible Gift Recipient. Tax-deductibility copy renders only when true. */
  dgrEndorsed: boolean;
  foundedYear: Verified<number>;
  contact: {
    email: string;
    phone?: string;
    fundraisingEmail?: string;
    postalAddress?: string;
    location: string;
  };
  social: {
    facebook?: string;
    facebookPageId?: string;
    instagram?: string;
    x?: string;
    petrescue?: string;
    facebookAuction?: string;
  };
  donate: {
    oneOffLink?: string;
    monthlyLink?: string;
    oneOffCoverFeesLink?: string;
    monthlyCoverFeesLink?: string;
    paypalGivingFundLink?: string;
    bankDetails?: { accountName?: string; bsb?: string; accountNumber?: string; reference?: string };
    containersForChangeId?: string;
    /** Cents on the dollar the processor keeps, used to label the cover-fees option. e.g. 1.75 */
    processingFeePercent?: number;
    processingFeeFixed?: number;
  };
  newsletter?: { embedUrl?: string; provider?: string };
  fees: {
    catStandard?: number;
    dogFrom?: number;
    dogTo?: number;
    inclusions: string;
    multiAnimalNote?: string;
  };
  navigation: {
    header: NavItem[];
    footer: { heading: string; links: Link[] }[];
  };
  acknowledgementOfCountry?: string;
};

export type NavItem = Link & { children?: Link[] };

export type Page = {
  _type: 'page';
  _id?: string;
  title: string;
  slug: string;
  seo?: Seo;
  sections: Section[];
};

export type Species = 'dog' | 'cat';
export type AnimalStatus = 'available' | 'pending' | 'on_hold' | 'adopted' | 'unknown';
export type Tri = 'yes' | 'no' | 'unknown';

export type Animal = {
  _type: 'animal';
  _id?: string;
  name: string;
  slug: string;
  haartId: string;
  species: Species;
  status: AnimalStatus;
  fosterNeeded: boolean;
  sex?: 'male' | 'female';
  breed?: string;
  dateOfBirth?: string;
  /** Free-text age as HAART writes it: "10 weeks", "7 years", "17 year old" */
  ageText?: string;
  ageBand?: 'puppy' | 'young' | 'adult' | 'senior' | 'kitten';
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  weightKg?: number;
  goodWith: { kids: Tri; cats: Tri; dogs: Tri; kidsAgeNote?: string };
  fee?: number;
  feeNote?: string;
  desexed?: boolean;
  vaccinated?: boolean;
  microchipped?: boolean;
  medicalNote?: string;
  /** One-line summary for cards. */
  summary?: string;
  /** Full write-up, verbatim from HAART. */
  description: PortableTextBlock[] | string;
  photos: ImageWithAlt[];
  petrescueId?: string;
  petrescueUrl?: string;
  listedAt?: string;
  adoptedAt?: string;
  location?: string;
  story?: { slug: string; title: string };
  /** Which adapter produced the record. */
  source: 'petrescue' | 'sanity' | 'mock';
};

export type Person = { _type: 'person'; _id?: string; name: string; slug: string; role?: string; photo?: ImageWithAlt; bio?: string };
export type Category = { _type: 'category'; _id?: string; title: string; slug: string; description?: string };
export type Series = { _type: 'series'; _id?: string; title: string; slug: string; description?: string; image?: ImageWithAlt };

export type Article = {
  _type: 'article';
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: ImageWithAlt;
  author?: Person;
  categories: Category[];
  series?: Series;
  seriesPart?: number;
  body: PortableTextBlock[];
  publishedAt: string;
  updatedAt?: string;
  related?: Pick<Article, 'title' | 'slug' | 'excerpt' | 'featuredImage' | 'publishedAt'>[];
  relatedAnimals?: Pick<Animal, 'name' | 'slug' | 'species' | 'status' | 'photos'>[];
  contentWarning?: { enabled: boolean; text?: string };
  seo?: Seo;
};

export type EventLocation = {
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
};

export type Event = {
  _type: 'event';
  _id?: string;
  /** iCal UID; the upsert key. */
  uid: string;
  title: string;
  slug: string;
  description?: string;
  start: string;
  end?: string;
  allDay?: boolean;
  timezone?: string;
  location?: EventLocation;
  /** From the iCal URL field, never constructed. */
  facebookUrl?: string;
  /** Square checkout link for tickets, set by a volunteer in the Studio. */
  ticketLink?: string;
  image?: ImageWithAlt;
  source: 'facebook' | 'manual';
  cancelled?: boolean;
  lastSeenAt?: string;
};

export type ProductKind = 'merch' | 'fundraiser' | 'sponsorship' | 'ticket';

export type Product = {
  _type: 'product';
  _id?: string;
  name: string;
  slug: string;
  kind: ProductKind;
  price?: number;
  priceNote?: string;
  image?: ImageWithAlt;
  description?: string;
  /** Square hosted checkout link. Missing link renders as "coming soon". */
  squareLink?: string;
  /** For fundraiser products that live elsewhere (Goodwill Wines etc). */
  externalUrl?: string;
  available: boolean;
  sortOrder?: number;
};

export type Partner = {
  _type: 'partner';
  _id?: string;
  name: string;
  slug: string;
  logo?: ImageWithAlt;
  url?: string;
  category?: string;
  description?: string;
  tier: 'corporate' | 'community' | 'supplier';
  sortOrder?: number;
};

export type FormId =
  | 'preAdoptionDogs'
  | 'preAdoptionCats'
  | 'fosterDogs'
  | 'fosterCats'
  | 'volunteer'
  | 'contact'
  | 'partnership';

export type Submission = {
  _type: 'submission';
  form: FormId;
  receivedAt: string;
  data: string;
  emailSent: boolean;
  status: 'new' | 'in_progress' | 'done';
};

export type SyncStatus = {
  _type: 'syncStatus';
  _id: string;
  source: 'facebook-events' | 'petrescue';
  lastRunAt: string;
  ok: boolean;
  message: string;
  count: number;
};

// ---------------------------------------------------------------------------
// Page-builder sections. Content fields only. Surface alternation, spacing
// and alignment are computed by the renderer from position, never stored.
// ---------------------------------------------------------------------------

type Base<T extends string> = { _type: T; _key: string };

export type Section =
  | (Base<'section.hero'> & { eyebrow?: string; heading: string; lead?: string; image?: ImageWithAlt; primaryCta?: Link; secondaryCta?: Link })
  | (Base<'section.pageHeader'> & { eyebrow?: string; heading: string; lead?: string; image?: ImageWithAlt })
  | (Base<'section.actionGrid'> & { heading?: string; items: { _key?: string; icon: IconName; heading: string; text: string; link: Link }[] })
  | (Base<'section.richText'> & { heading?: string; body: PortableTextBlock[] })
  | (Base<'section.stepList'> & { heading?: string; intro?: string; steps: { _key?: string; heading: string; text: string }[] })
  | (Base<'section.iconList'> & { heading?: string; intro?: string; items: { _key?: string; icon: IconName; heading: string; text: string }[] })
  | (Base<'section.faq'> & { heading?: string; items: { _key?: string; question: string; answer: PortableTextBlock[] | string }[] })
  | (Base<'section.statBand'> & { heading?: string; stats: { _key?: string; value: string; label: string }[]; note?: string })
  | (Base<'section.trustBand'> & { heading?: string; showAbn?: boolean; showAcnc?: boolean; showFounded?: boolean; note?: string })
  | (Base<'section.cta'> & { heading: string; text?: string; primary: Link; secondary?: Link })
  | (Base<'section.speciesTiles'> & { heading?: string; dogsText?: string; catsText?: string })
  | (Base<'section.feeTable'> & { heading?: string; rows: { _key?: string; label: string; amount: string; note?: string }[]; inclusions?: string })
  | (Base<'section.animalGrid'> & { heading?: string; species?: Species | 'all'; limit?: number; fosterNeededOnly?: boolean; cta?: Link })
  | (Base<'section.animalListing'> & { species: Species; intro?: string })
  | (Base<'section.fosterNeededStrip'> & { heading?: string; text?: string })
  | (Base<'section.eventsStrip'> & { headingToday?: string; headingUpcoming?: string })
  | (Base<'section.eventList'> & { heading?: string; showPast?: boolean })
  | (Base<'section.storyFeature'> & { heading?: string; article?: Article; text?: string })
  | (Base<'section.articleList'> & { heading?: string; category?: string; series?: string; limit?: number })
  | (Base<'section.partnerGrid'> & { heading?: string; intro?: string })
  | (Base<'section.partnerLogos'> & { heading?: string })
  | (Base<'section.priceCards'> & { heading?: string; intro?: string; cards: { _key?: string; title: string; price: string; period?: string; features: string[]; cta?: Link; note?: string }[] })
  | (Base<'section.productGrid'> & { heading?: string; kind?: ProductKind | 'all'; limit?: number })
  | (Base<'section.donateWidget'> & { heading?: string; text?: string; amounts: number[]; impactLines?: { _key?: string; amount: number; text: string }[] })
  | (Base<'section.otherWaysToGive'> & { heading?: string; showBankDetails?: boolean; showContainersForChange?: boolean; items: { _key?: string; icon: IconName; heading: string; text: string; link?: Link }[] })
  | (Base<'section.contactDetails'> & { heading?: string; note?: string })
  | (Base<'section.formEmbed'> & { form: FormId; heading?: string; intro?: string })
  | (Base<'section.linkList'> & { heading?: string; links: { _key?: string; label: string; href: string; description?: string }[] })
  | (Base<'section.newsletter'> & { heading?: string; text?: string })
  | (Base<'section.imageWithText'> & { heading: string; body: PortableTextBlock[] | string; image: ImageWithAlt; cta?: Link })
  | (Base<'section.quote'> & { quote: string; attribution?: string; image?: ImageWithAlt });

export type SectionType = Section['_type'];

/** Icons available to editors. Maps to Lucide icons in the Icon component. */
export type IconName =
  | 'heart'
  | 'paw'
  | 'dog'
  | 'cat'
  | 'house'
  | 'hand-heart'
  | 'users'
  | 'gift'
  | 'shield-check'
  | 'clock'
  | 'info'
  | 'stethoscope'
  | 'car'
  | 'camera'
  | 'megaphone'
  | 'handshake'
  | 'badge-check'
  | 'dollar'
  | 'repeat'
  | 'truck'
  | 'calendar'
  | 'map-pin'
  | 'mail'
  | 'phone'
  | 'sparkles'
  | 'check';

export const ICON_NAMES: IconName[] = [
  'heart', 'paw', 'dog', 'cat', 'house', 'hand-heart', 'users', 'gift', 'shield-check', 'clock', 'info',
  'stethoscope', 'car', 'camera', 'megaphone', 'handshake', 'badge-check', 'dollar', 'repeat', 'truck',
  'calendar', 'map-pin', 'mail', 'phone', 'sparkles', 'check',
];

export const FORM_IDS: FormId[] = ['preAdoptionDogs', 'preAdoptionCats', 'fosterDogs', 'fosterCats', 'volunteer', 'contact', 'partnership'];
