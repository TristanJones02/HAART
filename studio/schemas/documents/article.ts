import { defineField, defineType } from 'sanity';

export const article = defineType({
  name: 'article',
  title: 'Story',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required().max(90) }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'title', maxLength: 70 }, validation: (r) => r.required() }),
    defineField({ name: 'excerpt', title: 'Summary', type: 'text', rows: 2, description: 'One or two sentences for cards and Facebook previews.', validation: (r) => r.required().max(200) }),
    defineField({ name: 'featuredImage', title: 'Main photo', type: 'imageWithAlt', validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'person' }] }),
    defineField({ name: 'categories', title: 'Categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }], validation: (r) => r.min(1) }),
    defineField({ name: 'series', title: 'Series or campaign', type: 'reference', to: [{ type: 'series' }], description: 'Group multi-part stories or a campaign\'s posts.' }),
    defineField({ name: 'seriesPart', title: 'Part number', type: 'number', hidden: ({ document }) => !document?.series }),
    defineField({ name: 'publishedAt', title: 'Publish date', type: 'datetime', validation: (r) => r.required(), initialValue: () => new Date().toISOString() }),
    defineField({
      name: 'contentWarning',
      title: 'Content warning',
      type: 'object',
      description: 'For stories about abuse or neglect. Shows a notice above the story and blurs images marked distressing.',
      fields: [
        defineField({ name: 'enabled', title: 'Show a content warning', type: 'boolean', initialValue: false }),
        defineField({ name: 'text', title: 'Warning text', type: 'string', initialValue: 'This story describes animal neglect and includes photos some readers will find upsetting.' }),
      ],
    }),
    defineField({ name: 'body', title: 'Story', type: 'portableText', validation: (r) => r.required() }),
    defineField({ name: 'relatedAnimals', title: 'Animals in this story', type: 'array', of: [{ type: 'reference', to: [{ type: 'animal' }] }] }),
    defineField({ name: 'related', title: 'Related stories', type: 'array', of: [{ type: 'reference', to: [{ type: 'article' }] }], description: 'Leave empty to show the latest from the same category.' }),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo' }),
  ],
  orderings: [{ title: 'Newest first', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'publishedAt', media: 'featuredImage' } },
});

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
  ],
});

export const series = defineType({
  name: 'series',
  title: 'Series or campaign',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt' }),
  ],
});

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  description: 'Authors for stories. Use "HAART team" unless someone wants their name on a story.',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'photo', title: 'Photo', type: 'imageWithAlt' }),
    defineField({ name: 'bio', title: 'Short bio', type: 'text', rows: 3 }),
  ],
});
