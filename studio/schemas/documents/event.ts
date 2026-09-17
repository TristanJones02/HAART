import { defineField, defineType } from 'sanity';

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  description: 'Events arrive automatically from the Facebook page every few hours. Edit only the ticket link and image; anything else is overwritten on the next sync.',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'uid', title: 'Calendar UID', type: 'string', readOnly: true, description: 'Set by the sync. Do not edit.' }),
    defineField({ name: 'source', title: 'Source', type: 'string', options: { list: ['facebook', 'manual'] }, initialValue: 'manual', readOnly: ({ document }) => document?.source === 'facebook' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 6 }),
    defineField({ name: 'start', title: 'Starts', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'end', title: 'Ends', type: 'datetime' }),
    defineField({ name: 'allDay', title: 'All day', type: 'boolean', initialValue: false }),
    defineField({ name: 'timezone', title: 'Time zone', type: 'string', initialValue: 'Australia/Perth' }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Venue name', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'string' }),
        defineField({ name: 'lat', title: 'Latitude', type: 'number', readOnly: true }),
        defineField({ name: 'lng', title: 'Longitude', type: 'number', readOnly: true }),
      ],
    }),
    defineField({ name: 'facebookUrl', title: 'Facebook event link', type: 'url' }),
    defineField({ name: 'ticketLink', title: 'Ticket link (Square)', type: 'url', description: 'Paste the Square checkout link for tickets. Shown as a "Buy tickets" button.' }),
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt', description: 'Optional. Replaces the map on the card.' }),
    defineField({ name: 'cancelled', title: 'Cancelled', type: 'boolean', initialValue: false }),
    defineField({ name: 'lastSeenAt', title: 'Last seen in feed', type: 'datetime', readOnly: true }),
  ],
  orderings: [{ title: 'Soonest first', name: 'startAsc', by: [{ field: 'start', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', start: 'start', source: 'source' },
    prepare: ({ title, start, source }) => ({ title, subtitle: `${start ? new Date(start).toLocaleDateString('en-AU', { timeZone: 'Australia/Perth', dateStyle: 'medium' }) : ''} · ${source}` }),
  },
});

export const syncStatus = defineType({
  name: 'syncStatus',
  title: 'Sync status',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'source', title: 'Source', type: 'string' }),
    defineField({ name: 'lastRunAt', title: 'Last run', type: 'datetime' }),
    defineField({ name: 'ok', title: 'Succeeded', type: 'boolean' }),
    defineField({ name: 'message', title: 'Message', type: 'text' }),
    defineField({ name: 'count', title: 'Items', type: 'number' }),
  ],
  preview: {
    select: { source: 'source', ok: 'ok', lastRunAt: 'lastRunAt', message: 'message' },
    prepare: ({ source, ok, lastRunAt, message }) => ({ title: `${ok ? 'OK' : 'FAILED'}: ${source}`, subtitle: `${lastRunAt ?? 'never'} — ${message ?? ''}` }),
  },
});
