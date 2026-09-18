import type { SiteSettings } from '@/lib/content/types';

/**
 * Site settings seed. Verified flags mirror docs/blockers.md: nothing marked
 * unverified is rendered on the site until a committee member ticks it in the Studio.
 */
export const MOCK_SETTINGS: SiteSettings = {
  _type: 'siteSettings',
  organisationName: 'HAART',
  organisationNameLong: 'Homeless and Abused Animal Rescue Team',
  legalName: 'Homeless And Abused Animal Rescue Team Association Inc',
  tagline: 'Adopt smart, adopt with HAART.',
  abn: { value: '61 836 601 234', verified: false, note: 'From the SavourLife directory. Confirm on ABN Lookup (blocker F1).' },
  acncRegisterId: { value: 'e71ee1f8-38af-e811-a962-000d3ad24a0d', verified: false, note: 'ACNC register listing found; confirm current status (blocker F2).' },
  dgrEndorsed: false,
  foundedYear: { value: 2012, verified: false, note: 'January 2012 per MyGivingCircle (blocker F10).' },
  contact: {
    email: 'info@haart.org.au',
    phone: '08 6336 9410',
    fundraisingEmail: 'fundraising@haart.org.au',
    location: 'Perth, Western Australia',
  },
  social: {
    facebook: 'https://www.facebook.com/haartav',
    facebookPageId: '193581934021729',
    facebookAuction: 'https://www.facebook.com/haartauction',
    instagram: 'https://www.instagram.com/haart_perth/',
    x: 'https://x.com/haartav',
    petrescue: 'https://www.petrescue.com.au/groups/10046',
  },
  donate: {
    // TODO(tristan): paste Stripe Payment Links here or in the Studio (blocker C6).
    paypalGivingFundLink: undefined,
    bankDetails: undefined, // blocker F4
    containersForChangeId: undefined, // blocker F5
  },
  fees: {
    catStandard: 200,
    dogFrom: undefined, // blocker F6
    dogTo: undefined,
    inclusions: 'All adoption fees include microchipping and sterilisation as well as up to date vaccinations, flea treatment and worming.',
    multiAnimalNote: 'Adopting two animals together? Ask us about a reduced fee.',
  },
  navigation: {
    header: [
      {
        label: 'Adopt',
        href: '/adopt',
        children: [
          { label: 'Dogs', href: '/adopt/dogs' },
          { label: 'Cats', href: '/adopt/cats' },
          { label: 'How adoption works', href: '/adopt' },
        ],
      },
      { label: 'Foster', href: '/foster' },
      { label: 'Volunteer', href: '/volunteer' },
      {
        label: 'Support',
        href: '/support',
        children: [
          { label: 'Shop', href: '/shop' },
          { label: 'Events', href: '/events' },
          { label: 'Partners and sponsors', href: '/partners' },
          { label: 'Other ways to give', href: '/support' },
        ],
      },
      { label: 'Stories', href: '/stories' },
      {
        label: 'About',
        href: '/about',
        children: [
          { label: 'About HAART', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Surrendering an animal', href: '/surrender' },
        ],
      },
    ],
    footer: [
      {
        heading: 'Get involved',
        links: [
          { label: 'Adopt a dog', href: '/adopt/dogs' },
          { label: 'Adopt a cat', href: '/adopt/cats' },
          { label: 'Become a foster carer', href: '/foster' },
          { label: 'Volunteer', href: '/volunteer' },
          { label: 'Donate', href: '/donate' },
        ],
      },
      {
        heading: 'Support',
        links: [
          { label: 'Shop', href: '/shop' },
          { label: 'Events', href: '/events' },
          { label: 'Partners and sponsors', href: '/partners' },
          { label: 'Other ways to give', href: '/support' },
        ],
      },
      {
        heading: 'About',
        links: [
          { label: 'About HAART', href: '/about' },
          { label: 'Rescue stories', href: '/stories' },
          { label: 'Surrendering an animal', href: '/surrender' },
          { label: 'Contact', href: '/contact' },
          { label: 'Privacy', href: '/privacy' },
        ],
      },
    ],
  },
  acknowledgementOfCountry: 'HAART works on Whadjuk Noongar boodja. We acknowledge the Traditional Owners of the land and pay our respects to Elders past and present.',
};
