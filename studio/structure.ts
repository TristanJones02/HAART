import type { StructureResolver } from 'sanity/structure';

/**
 * Studio navigation, organised by what volunteers do rather than by type.
 * Site settings is a singleton; sync status and submissions are read-only lists.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('HAART')
    .items([
      S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('Animals')
        .child(
          S.list()
            .title('Animals')
            .items([
              S.listItem().title('Available').child(S.documentList().title('Available').filter('_type == "animal" && status == "available"').defaultOrdering([{ field: 'listedAt', direction: 'desc' }])),
              S.listItem().title('Needs a foster').child(S.documentList().title('Needs a foster').filter('_type == "animal" && fosterNeeded == true')),
              S.listItem().title('Pending or on hold').child(S.documentList().title('Pending or on hold').filter('_type == "animal" && status in ["pending", "on_hold"]')),
              S.listItem().title('Adopted').child(S.documentList().title('Adopted').filter('_type == "animal" && status == "adopted"').defaultOrdering([{ field: 'adoptedAt', direction: 'desc' }])),
              S.listItem().title('All dogs').child(S.documentList().title('Dogs').filter('_type == "animal" && species == "dog"')),
              S.listItem().title('All cats').child(S.documentList().title('Cats').filter('_type == "animal" && species == "cat"')),
            ]),
        ),
      S.documentTypeListItem('page').title('Pages'),
      S.listItem()
        .title('Stories')
        .child(S.list().title('Stories').items([S.documentTypeListItem('article').title('Stories'), S.documentTypeListItem('category').title('Categories'), S.documentTypeListItem('series').title('Series and campaigns'), S.documentTypeListItem('person').title('Authors')])),
      S.listItem()
        .title('Events')
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem().title('Upcoming').child(S.documentList().title('Upcoming').filter('_type == "event" && dateTime(start) >= dateTime(now()) - 60*60*24').defaultOrdering([{ field: 'start', direction: 'asc' }])),
              S.listItem().title('Past').child(S.documentList().title('Past').filter('_type == "event" && dateTime(start) < dateTime(now()) - 60*60*24').defaultOrdering([{ field: 'start', direction: 'desc' }])),
              S.listItem().title('Sync status').child(S.documentList().title('Sync status').filter('_type == "syncStatus"')),
            ]),
        ),
      S.documentTypeListItem('product').title('Shop and fundraisers'),
      S.documentTypeListItem('partner').title('Partners'),
      S.divider(),
      S.listItem().title('Form submissions').child(S.documentList().title('Form submissions').filter('_type == "submission"').defaultOrdering([{ field: 'receivedAt', direction: 'desc' }])),
    ]);
