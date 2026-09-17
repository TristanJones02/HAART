import { defineField, defineType } from 'sanity';

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required().max(40) }),
    defineField({
      name: 'href',
      title: 'Link to',
      type: 'string',
      description: 'A page on this site (for example /adopt/dogs) or a full web address (https://...).',
      validation: (r) =>
        r.required().custom((v) => (!v || v.startsWith('/') || /^https?:\/\//.test(v) || v.startsWith('mailto:') || v.startsWith('tel:') ? true : 'Start with / for a page on this site, or https:// for another website.')),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
});
