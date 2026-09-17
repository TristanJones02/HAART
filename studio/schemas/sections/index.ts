import { defineArrayMember, defineField, defineType, type FieldDefinition } from 'sanity';

/**
 * Page-builder blocks. Every block is content only: headings, text, images,
 * links and references. There is deliberately no field for colour, alignment,
 * spacing, width or CSS. The renderer decides the surface from the block's
 * position on the page.
 */

const ICONS = [
  'heart', 'paw', 'dog', 'cat', 'house', 'hand-heart', 'users', 'gift', 'shield-check', 'clock', 'info',
  'stethoscope', 'car', 'camera', 'megaphone', 'handshake', 'badge-check', 'dollar', 'repeat', 'truck',
  'calendar', 'map-pin', 'mail', 'phone', 'sparkles', 'check',
];

const FORMS = [
  { title: 'Pre-adoption questionnaire: dogs', value: 'preAdoptionDogs' },
  { title: 'Pre-adoption questionnaire: cats', value: 'preAdoptionCats' },
  { title: 'Foster application: dogs', value: 'fosterDogs' },
  { title: 'Foster application: cats', value: 'fosterCats' },
  { title: 'Volunteer expression of interest', value: 'volunteer' },
  { title: 'Contact', value: 'contact' },
  { title: 'Partnership enquiry', value: 'partnership' },
];

const heading = (required = false, title = 'Heading') =>
  defineField({ name: 'heading', title, type: 'string', validation: required ? (r) => r.required().max(90) : (r) => r.max(90) });
const text = (name = 'text', title = 'Text', rows = 3) => defineField({ name, title, type: 'text', rows });
const icon = () => defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: ICONS }, initialValue: 'paw' });
const linkField = (name: string, title: string, required = false) =>
  defineField({ name, title, type: 'link', validation: required ? (r) => r.required() : undefined });

const section = (name: string, title: string, description: string, fields: FieldDefinition[], previewTitle?: string) =>
  defineType({
    name: `section.${name}`,
    title,
    type: 'object',
    description,
    fields,
    preview: {
      select: { heading: 'heading', quote: 'quote', form: 'form', species: 'species' },
      prepare: ({ heading, quote, form, species }) => ({
        title: heading || quote || form || species || previewTitle || title,
        subtitle: title,
      }),
    },
  });

const items = (name: string, title: string, fields: FieldDefinition[], min = 1) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [defineArrayMember({ type: 'object', fields, preview: { select: { title: 'heading', subtitle: 'text', q: 'question', label: 'label', value: 'value' }, prepare: (s) => ({ title: s.title || s.q || s.label || s.value || 'Item', subtitle: s.subtitle }) } })],
    validation: (r) => r.min(min),
  });

export const sections = [
  section('hero', 'Hero', 'The big opening block. One per page, at the top.', [
    defineField({ name: 'eyebrow', title: 'Small line above the heading', type: 'string' }),
    heading(true),
    text('lead', 'Lead sentence', 2),
    defineField({ name: 'image', title: 'Background photo', type: 'imageWithAlt' }),
    linkField('primaryCta', 'Main button'),
    linkField('secondaryCta', 'Second button'),
  ]),
  section('pageHeader', 'Page header', 'Title and introduction for an inside page.', [
    defineField({ name: 'eyebrow', title: 'Small line above the heading', type: 'string' }),
    heading(true),
    text('lead', 'Introduction', 3),
    defineField({ name: 'image', title: 'Photo', type: 'imageWithAlt' }),
  ]),
  section('actionGrid', 'Action grid', 'Three or four big tiles, each with an icon, a line of text and a link.', [
    heading(),
    items('items', 'Tiles', [icon(), heading(true), text(), linkField('link', 'Link', true)]),
  ]),
  section('richText', 'Text', 'Paragraphs, subheadings, lists and images.', [heading(), defineField({ name: 'body', title: 'Text', type: 'portableText', validation: (r) => r.required() })]),
  section('stepList', 'Steps', 'A numbered sequence, for example how adoption works.', [
    heading(),
    text('intro', 'Introduction', 2),
    items('steps', 'Steps', [heading(true, 'Step'), text()]),
  ]),
  section('iconList', 'Icon list', 'Short points with icons, for example what fostering involves.', [
    heading(),
    text('intro', 'Introduction', 2),
    items('items', 'Points', [icon(), heading(true), text()]),
  ]),
  section('faq', 'Questions and answers', 'Expandable questions.', [
    heading(),
    items('items', 'Questions', [
      defineField({ name: 'question', title: 'Question', type: 'string', validation: (r) => r.required() }),
      defineField({ name: 'answer', title: 'Answer', type: 'simpleText', validation: (r) => r.required() }),
    ]),
  ]),
  section('statBand', 'Numbers', 'Two to four big numbers with labels.', [
    heading(),
    items('stats', 'Numbers', [
      defineField({ name: 'value', title: 'Number', type: 'string', description: 'For example "300+" or "14 years".', validation: (r) => r.required() }),
      defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    ]),
    defineField({ name: 'note', title: 'Small print', type: 'string' }),
  ]),
  section('trustBand', 'Registration details', 'Shows the ABN, ACNC registration and founding year from Site settings, only where they are marked verified.', [
    heading(),
    defineField({ name: 'showAbn', title: 'Show ABN', type: 'boolean', initialValue: true }),
    defineField({ name: 'showAcnc', title: 'Show ACNC registration', type: 'boolean', initialValue: true }),
    defineField({ name: 'showFounded', title: 'Show founding year', type: 'boolean', initialValue: true }),
    defineField({ name: 'note', title: 'Note', type: 'string' }),
  ]),
  section('cta', 'Call to action', 'A heading, a sentence and one or two buttons.', [heading(true), text(), linkField('primary', 'Main button', true), linkField('secondary', 'Second button')]),
  section('speciesTiles', 'Dogs and cats tiles', 'Two tiles linking to the dog and cat listings.', [
    heading(),
    defineField({ name: 'dogsText', title: 'Dogs line', type: 'string' }),
    defineField({ name: 'catsText', title: 'Cats line', type: 'string' }),
  ]),
  section('feeTable', 'Fee table', 'Adoption fees as a small table.', [
    heading(),
    items('rows', 'Rows', [
      defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
      defineField({ name: 'amount', title: 'Amount', type: 'string', validation: (r) => r.required() }),
      defineField({ name: 'note', title: 'Note', type: 'string' }),
    ]),
    text('inclusions', 'What the fee includes', 2),
  ]),
  section('animalGrid', 'Animal cards', 'A row of animals from the live listings.', [
    heading(),
    defineField({ name: 'species', title: 'Species', type: 'string', options: { list: [{ title: 'Dogs and cats', value: 'all' }, { title: 'Dogs', value: 'dog' }, { title: 'Cats', value: 'cat' }] }, initialValue: 'all' }),
    defineField({ name: 'limit', title: 'How many', type: 'number', initialValue: 4, validation: (r) => r.min(1).max(12) }),
    defineField({ name: 'fosterNeededOnly', title: 'Only animals needing a foster', type: 'boolean', initialValue: false }),
    linkField('cta', 'Link under the cards'),
  ]),
  section('animalListing', 'Animal listing', 'The full searchable listing for one species. Use on the Dogs and Cats pages only.', [
    defineField({ name: 'species', title: 'Species', type: 'string', options: { list: ['dog', 'cat'], layout: 'radio', direction: 'horizontal' }, validation: (r) => r.required() }),
    text('intro', 'Introduction', 2),
  ]),
  section('fosterNeededStrip', 'Needs a foster strip', 'Animals flagged "foster carer needed". Shows nothing when there are none.', [heading(), text()]),
  section('eventsStrip', 'Upcoming events strip', 'Events in the next 14 days. Shows nothing when there are none.', [
    defineField({ name: 'headingToday', title: 'Heading when an event is on today', type: 'string', initialValue: 'On today' }),
    defineField({ name: 'headingUpcoming', title: 'Heading for the next fortnight', type: 'string', initialValue: 'Coming up' }),
  ]),
  section('eventList', 'Events list', 'All upcoming events, then recent past ones.', [heading(), defineField({ name: 'showPast', title: 'Show recent past events', type: 'boolean', initialValue: true })]),
  section('storyFeature', 'Featured story', 'One story with its photo. Leave the story empty to show the latest.', [
    heading(),
    defineField({ name: 'article', title: 'Story', type: 'reference', to: [{ type: 'article' }] }),
    text(),
  ]),
  section('articleList', 'Stories list', 'A grid of stories.', [
    heading(),
    defineField({ name: 'category', title: 'Only this category', type: 'reference', to: [{ type: 'category' }] }),
    defineField({ name: 'series', title: 'Only this series', type: 'reference', to: [{ type: 'series' }] }),
    defineField({ name: 'limit', title: 'How many', type: 'number', initialValue: 6 }),
  ]),
  section('partnerGrid', 'Partner directory', 'Every partner with logo, description and link.', [heading(), text('intro', 'Introduction', 2)]),
  section('partnerLogos', 'Partner logos', 'A quiet row of partner logos.', [heading()]),
  section('priceCards', 'Price cards', 'Sponsorship or package tiers.', [
    heading(),
    text('intro', 'Introduction', 2),
    items('cards', 'Cards', [
      defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
      defineField({ name: 'price', title: 'Price', type: 'string', validation: (r) => r.required() }),
      defineField({ name: 'period', title: 'Per', type: 'string', description: 'For example "year".' }),
      defineField({ name: 'features', title: 'What is included', type: 'array', of: [{ type: 'string' }] }),
      linkField('cta', 'Button'),
      defineField({ name: 'note', title: 'Note', type: 'string' }),
    ]),
  ]),
  section('productGrid', 'Products', 'Shop items or fundraiser products.', [
    heading(),
    defineField({ name: 'kind', title: 'Which products', type: 'string', options: { list: [{ title: 'All', value: 'all' }, { title: 'Merchandise', value: 'merch' }, { title: 'Fundraisers', value: 'fundraiser' }, { title: 'Sponsorship', value: 'sponsorship' }, { title: 'Tickets', value: 'ticket' }] }, initialValue: 'all' }),
    defineField({ name: 'limit', title: 'How many', type: 'number', initialValue: 12 }),
  ]),
  section('donateWidget', 'Donation chooser', 'Amount buttons, one-off or monthly, and the payment links from Site settings.', [
    heading(),
    text(),
    defineField({ name: 'amounts', title: 'Suggested amounts ($)', type: 'array', of: [{ type: 'number' }], initialValue: [25, 50, 100, 250], validation: (r) => r.min(2).max(6) }),
    items('impactLines', 'What an amount does', [
      defineField({ name: 'amount', title: 'Amount ($)', type: 'number', validation: (r) => r.required() }),
      defineField({ name: 'text', title: 'What it pays for', type: 'string', validation: (r) => r.required() }),
    ], 0),
  ]),
  section('otherWaysToGive', 'Other ways to give', 'Bank transfer, Containers for Change and any other options.', [
    heading(),
    defineField({ name: 'showBankDetails', title: 'Show bank transfer details', type: 'boolean', initialValue: true, description: 'Only appears when the details are filled in under Site settings.' }),
    defineField({ name: 'showContainersForChange', title: 'Show Containers for Change', type: 'boolean', initialValue: true }),
    items('items', 'Other options', [icon(), heading(true), text(), linkField('link', 'Link')], 0),
  ]),
  section('contactDetails', 'Contact details', 'Email, phone and social links from Site settings.', [heading(), text('note', 'Note', 2)]),
  section('formEmbed', 'Form', 'One of the site\'s forms.', [
    defineField({ name: 'form', title: 'Which form', type: 'string', options: { list: FORMS }, validation: (r) => r.required() }),
    heading(),
    text('intro', 'Text above the form', 3),
  ]),
  section('linkList', 'Link list', 'A plain list of links with a line of description each.', [
    heading(),
    items('links', 'Links', [
      defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
      defineField({ name: 'href', title: 'Link to', type: 'string', validation: (r) => r.required() }),
      defineField({ name: 'description', title: 'Description', type: 'string' }),
    ]),
  ]),
  section('newsletter', 'Newsletter signup', 'Links to the signup page set under Site settings.', [heading(), text()]),
  section('imageWithText', 'Photo and text', 'A photo beside a block of text. Photos alternate sides down the page automatically.', [
    heading(true),
    defineField({ name: 'body', title: 'Text', type: 'simpleText', validation: (r) => r.required() }),
    defineField({ name: 'image', title: 'Photo', type: 'imageWithAlt', validation: (r) => r.required() }),
    linkField('cta', 'Button'),
  ]),
  section('quote', 'Quote', 'A pull quote from a foster carer, adopter or partner.', [
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: (r) => r.required().max(300) }),
    defineField({ name: 'attribution', title: 'Who said it', type: 'string' }),
    defineField({ name: 'image', title: 'Photo', type: 'imageWithAlt' }),
  ]),
];

export const SECTION_TYPE_NAMES = sections.map((s) => s.name);
