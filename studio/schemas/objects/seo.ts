import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'Search and sharing',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'title', title: 'Title for search results', type: 'string', description: 'Leave blank to use the page title.', validation: (r) => r.max(60) }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2, description: 'One or two sentences. Shows under the title on Google and Facebook.', validation: (r) => r.max(160) }),
    defineField({ name: 'image', title: 'Sharing image', type: 'imageWithAlt', description: 'Shown when the page is shared on Facebook. Landscape works best.' }),
    defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
  ],
});
