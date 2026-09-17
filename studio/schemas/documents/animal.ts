import { defineField, defineType } from 'sanity';

const tri = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'string',
    options: { list: [{ title: 'Yes', value: 'yes' }, { title: 'No', value: 'no' }, { title: 'Unknown', value: 'unknown' }], layout: 'radio', direction: 'horizontal' },
    initialValue: 'unknown',
  });

export const animal = defineType({
  name: 'animal',
  title: 'Animal',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'details', title: 'Details' },
    { name: 'story', title: 'Write-up and photos' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'basics', validation: (r) => r.required() }),
    defineField({
      name: 'haartId',
      title: 'HAART ID',
      type: 'string',
      group: 'basics',
      description: 'Format HD26-051 for dogs, HC26-005 for cats. Must be unique.',
      validation: (r) =>
        r
          .required()
          .regex(/^H[DC]\d{2}-\d{3}$/, { name: 'HAART ID', invert: false })
          .error('Use the format HD26-051 (dogs) or HC26-005 (cats), with three digits after the dash.'),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'basics',
      options: {
        source: (doc) => `${(doc as { name?: string }).name ?? ''} ${(doc as { haartId?: string }).haartId ?? ''}`,
        maxLength: 60,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'species',
      title: 'Species',
      type: 'string',
      group: 'basics',
      options: { list: [{ title: 'Dog', value: 'dog' }, { title: 'Cat', value: 'cat' }], layout: 'radio', direction: 'horizontal' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Application pending', value: 'pending' },
          { title: 'On hold', value: 'on_hold' },
          { title: 'Adopted', value: 'adopted' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (r) => r.required(),
      description: 'Adopted animals stay on the site with an "adopted" badge so shared links keep working.',
    }),
    defineField({ name: 'fosterNeeded', title: 'Foster carer needed', type: 'boolean', group: 'basics', initialValue: false, description: 'Shows the red "needs a foster" badge and puts the animal in the foster strip on the home and foster pages.' }),
    defineField({ name: 'summary', title: 'One-line summary', type: 'string', group: 'basics', description: 'Shown on cards. Under 120 characters.', validation: (r) => r.max(140) }),

    defineField({ name: 'sex', title: 'Sex', type: 'string', group: 'details', options: { list: ['male', 'female'], layout: 'radio', direction: 'horizontal' } }),
    defineField({ name: 'breed', title: 'Breed', type: 'string', group: 'details' }),
    defineField({ name: 'dateOfBirth', title: 'Date of birth', type: 'date', group: 'details' }),
    defineField({ name: 'ageText', title: 'Age (as written)', type: 'string', group: 'details', description: 'For example "10 weeks" or "7 years". Used when the date of birth is not known.' }),
    defineField({
      name: 'ageBand',
      title: 'Age group',
      type: 'string',
      group: 'details',
      options: { list: [{ title: 'Puppy', value: 'puppy' }, { title: 'Kitten', value: 'kitten' }, { title: 'Young', value: 'young' }, { title: 'Adult', value: 'adult' }, { title: 'Senior', value: 'senior' }] },
    }),
    defineField({ name: 'size', title: 'Size', type: 'string', group: 'details', options: { list: ['small', 'medium', 'large', 'extra-large'] } }),
    defineField({ name: 'weightKg', title: 'Weight (kg)', type: 'number', group: 'details' }),
    defineField({
      name: 'goodWith',
      title: 'Good with',
      type: 'object',
      group: 'details',
      fields: [tri('kids', 'Children'), tri('cats', 'Cats'), tri('dogs', 'Other dogs'), defineField({ name: 'kidsAgeNote', title: 'Children note', type: 'string', description: 'For example "13 and over".' })],
    }),
    defineField({ name: 'fee', title: 'Adoption fee ($)', type: 'number', group: 'details' }),
    defineField({ name: 'feeNote', title: 'Fee note', type: 'string', group: 'details' }),
    defineField({ name: 'desexed', title: 'Desexed', type: 'boolean', group: 'details' }),
    defineField({ name: 'vaccinated', title: 'Vaccinated', type: 'boolean', group: 'details' }),
    defineField({ name: 'microchipped', title: 'Microchipped', type: 'boolean', group: 'details' }),
    defineField({ name: 'medicalNote', title: 'Medical or behaviour note', type: 'text', rows: 2, group: 'details' }),
    defineField({ name: 'location', title: 'Foster location (suburb)', type: 'string', group: 'details' }),
    defineField({ name: 'petrescueId', title: 'PetRescue listing ID', type: 'string', group: 'details', description: 'If the animal is also on PetRescue. Lets the site link and de-duplicate.' }),
    defineField({ name: 'petrescueUrl', title: 'PetRescue listing address', type: 'url', group: 'details' }),
    defineField({ name: 'listedAt', title: 'Listed on', type: 'date', group: 'details' }),
    defineField({ name: 'adoptedAt', title: 'Adopted on', type: 'date', group: 'details' }),

    defineField({ name: 'description', title: 'Write-up', type: 'portableText', group: 'story', description: 'The full profile in HAART\'s words.' }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      group: 'story',
      of: [{ type: 'imageWithAlt' }],
      validation: (r) => r.min(1).error('Add at least one photo.'),
      description: 'First photo is the main one. Phone photos are fine; the site resizes them.',
    }),
    defineField({ name: 'story', title: 'Related story', type: 'reference', to: [{ type: 'article' }], group: 'story' }),
  ],
  orderings: [
    { title: 'Newest first', name: 'listedDesc', by: [{ field: 'listedAt', direction: 'desc' }] },
    { title: 'Name', name: 'name', by: [{ field: 'name', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', haartId: 'haartId', status: 'status', fosterNeeded: 'fosterNeeded', media: 'photos.0' },
    prepare: ({ title, haartId, status, fosterNeeded, media }) => ({
      title: `${title} ${haartId ?? ''}`.trim(),
      subtitle: [status?.replace('_', ' '), fosterNeeded ? 'foster needed' : null].filter(Boolean).join(' · '),
      media,
    }),
  },
});
