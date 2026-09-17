import { defineField, defineType } from 'sanity';

const verified = (name: string, title: string, type: 'string' | 'number', description: string) =>
  defineField({
    name,
    title,
    type: 'object',
    description,
    fields: [
      defineField({ name: 'value', title: 'Value', type }),
      defineField({
        name: 'verified',
        title: 'Verified',
        type: 'boolean',
        initialValue: false,
        description: 'Tick once a committee member has checked this against the official record. Unverified values are not shown on the site.',
      }),
      defineField({ name: 'note', title: 'Note', type: 'string' }),
    ],
  });

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'contact', title: 'Contact and social' },
    { name: 'donate', title: 'Donations' },
    { name: 'fees', title: 'Adoption fees' },
    { name: 'navigation', title: 'Navigation' },
  ],
  fields: [
    defineField({ name: 'organisationName', title: 'Short name', type: 'string', initialValue: 'HAART', group: 'identity', validation: (r) => r.required() }),
    defineField({ name: 'organisationNameLong', title: 'Full name', type: 'string', initialValue: 'Homeless and Abused Animal Rescue Team', group: 'identity' }),
    defineField({ name: 'legalName', title: 'Legal name', type: 'string', description: 'As registered with the ACNC. Shown in the footer.', group: 'identity' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', description: 'One sentence under the wordmark in the footer.', group: 'identity' }),
    verified('abn', 'ABN', 'string', 'Australian Business Number. Check on abr.business.gov.au before ticking verified.'),
    verified('acncRegisterId', 'ACNC register ID', 'string', 'The ID in the ACNC register web address.'),
    defineField({
      name: 'dgrEndorsed',
      title: 'Deductible Gift Recipient (DGR) endorsed',
      type: 'boolean',
      initialValue: false,
      group: 'identity',
      description: 'Only tick if the ATO has endorsed HAART as a DGR. When ticked, the donate page says gifts over $2 are tax deductible. When unticked it says nothing about tax.',
    }),
    verified('foundedYear', 'Founded (year)', 'number', 'Shown on the About page once verified.'),
    defineField({ name: 'acknowledgementOfCountry', title: 'Acknowledgement of Country', type: 'text', rows: 3, group: 'identity' }),

    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.required().email() }),
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'fundraisingEmail', title: 'Fundraising email', type: 'string' }),
        defineField({ name: 'postalAddress', title: 'Postal address', type: 'string', description: 'Leave blank to show nothing.' }),
        defineField({ name: 'location', title: 'Location', type: 'string', initialValue: 'Perth, Western Australia' }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook page', type: 'url' }),
        defineField({ name: 'facebookPageId', title: 'Facebook page ID', type: 'string', description: 'Numeric ID, used for structured data.' }),
        defineField({ name: 'facebookAuction', title: 'Facebook auction page', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'x', title: 'X (Twitter)', type: 'url' }),
        defineField({ name: 'petrescue', title: 'PetRescue group page', type: 'url' }),
      ],
    }),

    defineField({
      name: 'donate',
      title: 'Donation links',
      type: 'object',
      group: 'donate',
      description: 'Paste hosted payment links here. A blank link shows a "being set up" message instead of a dead button.',
      fields: [
        defineField({ name: 'oneOffLink', title: 'One-off donation link (Stripe)', type: 'url' }),
        defineField({ name: 'monthlyLink', title: 'Monthly donation link (Stripe)', type: 'url' }),
        defineField({ name: 'oneOffCoverFeesLink', title: 'One-off, donor covers fees', type: 'url', description: 'Optional second link where the amounts include the processing fee.' }),
        defineField({ name: 'monthlyCoverFeesLink', title: 'Monthly, donor covers fees', type: 'url' }),
        defineField({ name: 'paypalGivingFundLink', title: 'PayPal Giving Fund link', type: 'url' }),
        defineField({ name: 'processingFeePercent', title: 'Processing fee %', type: 'number', initialValue: 1.75, description: 'Used only to explain the cover-fees option.' }),
        defineField({ name: 'processingFeeFixed', title: 'Processing fee fixed (cents)', type: 'number', initialValue: 30 }),
        defineField({
          name: 'bankDetails',
          title: 'Bank transfer details',
          type: 'object',
          description: 'Shown on the donate page only when every field is filled in.',
          fields: [
            defineField({ name: 'accountName', title: 'Account name', type: 'string' }),
            defineField({ name: 'bsb', title: 'BSB', type: 'string' }),
            defineField({ name: 'accountNumber', title: 'Account number', type: 'string' }),
            defineField({ name: 'reference', title: 'Reference to use', type: 'string', description: 'For example "Donation" or the donor\'s surname.' }),
          ],
        }),
        defineField({ name: 'containersForChangeId', title: 'Containers for Change scheme ID', type: 'string', description: 'The C-number people quote at the depot.' }),
      ],
    }),
    defineField({
      name: 'newsletter',
      title: 'Newsletter',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'provider', title: 'Provider', type: 'string', description: 'For example Mailchimp.' }),
        defineField({ name: 'embedUrl', title: 'Signup form address', type: 'url', description: 'The hosted signup page. The site links to it; it does not embed third-party scripts.' }),
      ],
    }),

    defineField({
      name: 'fees',
      title: 'Adoption fees',
      type: 'object',
      group: 'fees',
      fields: [
        defineField({ name: 'catStandard', title: 'Standard cat fee ($)', type: 'number' }),
        defineField({ name: 'dogFrom', title: 'Dog fee from ($)', type: 'number' }),
        defineField({ name: 'dogTo', title: 'Dog fee to ($)', type: 'number' }),
        defineField({ name: 'inclusions', title: 'What the fee includes', type: 'text', rows: 2, validation: (r) => r.required() }),
        defineField({ name: 'multiAnimalNote', title: 'Multiple animals note', type: 'string' }),
      ],
    }),

    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'object',
      group: 'navigation',
      fields: [
        defineField({
          name: 'header',
          title: 'Main menu',
          type: 'array',
          description: 'Donate is always shown as the red button and does not need adding here.',
          of: [
            {
              type: 'object',
              name: 'navItem',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'href', title: 'Link to', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'children', title: 'Dropdown links', type: 'array', of: [{ type: 'link' }] }),
              ],
              preview: { select: { title: 'label', subtitle: 'href' } },
            },
          ],
          validation: (r) => r.max(6).warning('More than six items will not fit on a laptop screen.'),
        }),
        defineField({
          name: 'footer',
          title: 'Footer link groups',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'footerGroup',
              fields: [
                defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'links', title: 'Links', type: 'array', of: [{ type: 'link' }] }),
              ],
              preview: { select: { title: 'heading' } },
            },
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
