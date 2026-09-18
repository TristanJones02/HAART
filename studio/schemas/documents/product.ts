import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Merchandise (sold through Square)', value: 'merch' },
          { title: 'Fundraiser (sold elsewhere, HAART gets a cut)', value: 'fundraiser' },
          { title: 'Sponsorship package', value: 'sponsorship' },
          { title: 'Event ticket', value: 'ticket' },
        ],
      },
      initialValue: 'merch',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'price', title: 'Price ($)', type: 'number' }),
    defineField({ name: 'priceNote', title: 'Price note', type: 'string', description: 'For example "$20 from every case goes to HAART".' }),
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'squareLink', title: 'Square payment link', type: 'url', description: 'From Square Dashboard > Online > Payment links. Leave blank until it exists; the button shows "coming soon".' }),
    defineField({ name: 'externalUrl', title: 'External link', type: 'url', description: 'For fundraiser products sold on another site.' }),
    defineField({ name: 'available', title: 'Available', type: 'boolean', initialValue: true }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 100 }),
  ],
  orderings: [{ title: 'Sort order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'kind', media: 'image' } },
});

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'imageWithAlt' }),
    defineField({ name: 'url', title: 'Website', type: 'url' }),
    defineField({ name: 'category', title: 'Category', type: 'string', description: 'For example veterinary, boarding, food.' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'tier',
      title: 'Tier',
      type: 'string',
      options: { list: [{ title: 'Corporate sponsor', value: 'corporate' }, { title: 'Community partner', value: 'community' }, { title: 'Supplier', value: 'supplier' }] },
      initialValue: 'community',
    }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'name', subtitle: 'tier', media: 'logo' } },
});

