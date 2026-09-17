import { defineArrayMember, defineType } from 'sanity';

/**
 * Rich text with a deliberately small toolbar: headings 2 and 3, bold,
 * italic, links, lists, images and a callout. No colours, no alignment.
 */
export const portableText = defineType({
  name: 'portableText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading', value: 'h2' },
        { title: 'Subheading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullets', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [{ name: 'href', title: 'Link to', type: 'string', validation: (r) => r.required() }],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'imageWithAlt' }),
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        { name: 'text', title: 'Text', type: 'text', rows: 3, validation: (r) => r.required() },
      ],
      preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title: `Callout: ${title}` }) },
    }),
  ],
});

/** Plain text variant for short answers and descriptions: no images, no callouts. */
export const simpleText = defineType({
  name: 'simpleText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Paragraph', value: 'normal' }],
      lists: [{ title: 'Bullets', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          { name: 'link', title: 'Link', type: 'object', fields: [{ name: 'href', title: 'Link to', type: 'string' }] },
        ],
      },
    }),
  ],
});
