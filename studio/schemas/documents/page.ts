import { defineField, defineType } from 'sanity';
import { SECTION_TYPE_NAMES } from '../sections';

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      options: { source: 'title', maxLength: 60 },
      description: 'The part after haart.org.au/. Changing this on a live page breaks links people have shared; ask before changing.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      description: 'Drag to reorder. Each section has its own fields. Colours and spacing are set by the design and cannot be changed here.',
      of: SECTION_TYPE_NAMES.map((type) => ({ type })),
    }),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' }, prepare: ({ title, subtitle }) => ({ title, subtitle: `/${subtitle === 'home' ? '' : subtitle ?? ''}` }) },
});
