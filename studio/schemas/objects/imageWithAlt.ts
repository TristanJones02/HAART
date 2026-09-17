import { defineField, defineType } from 'sanity';

/**
 * Every image on the site goes through this object so alt text is required.
 * Editors set the hotspot (content, not styling) so crops keep the animal in frame.
 */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true, accept: 'image/*' },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe what is in the photo for someone who cannot see it. For an animal: "Tan kelpie cross lying on a rug, looking at the camera". Not the animal\'s name on its own.',
      validation: (rule) => rule.required().min(8).max(160).error('Alt text is required and should be a short description.'),
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string', description: 'Optional. Shown under the image on stories.' }),
    defineField({
      name: 'sensitive',
      title: 'Distressing content',
      type: 'boolean',
      description: 'Tick for injury or neglect photos. The image is shown blurred until the reader chooses to see it.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { media: 'asset', title: 'alt' },
  },
});
