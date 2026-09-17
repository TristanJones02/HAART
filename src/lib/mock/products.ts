import type { Product } from '@/lib/content/types';

/**
 * Fundraiser products from the audit plus sample merchandise so the shop
 * layout can be seen. Square links are intentionally empty (blocker C5);
 * the card renders "coming soon" rather than a dead button.
 */
export const MOCK_PRODUCTS: Product[] = [
  { _type: 'product', name: 'Goodwill Wines', slug: 'goodwill-wines', kind: 'fundraiser', priceNote: '$20 from every case goes to HAART', description: 'Order a mixed case from Goodwill Wines and choose HAART as your charity at checkout. Each case of Goodwill Wines varieties donates $20 to HAART.', externalUrl: undefined, available: true, sortOrder: 10 },
  { _type: 'product', name: 'Entertainment membership', slug: 'entertainment-book', kind: 'fundraiser', priceNote: '20% of the price goes to HAART', description: '12 months of discounts at restaurants, attractions and shops, with 20% of the purchase price going to the animals of HAART.', externalUrl: undefined, available: true, sortOrder: 20 },
  { _type: 'product', name: 'HAART online auction', slug: 'online-auction', kind: 'fundraiser', priceNote: 'Runs a few times a year', description: 'Donated goods and experiences auctioned on our Facebook auction page. Follow the page to hear when the next one opens.', externalUrl: 'https://www.facebook.com/haartauction', available: true, sortOrder: 30 },
  { _type: 'product', name: 'Kennel sponsorship', slug: 'kennel-sponsorship', kind: 'sponsorship', price: 2500, priceNote: 'per year, with discounts for two and three year terms', description: 'As a kennel sponsor, your support will make an incredible difference, providing bedding, blankets, toys and treats to keep dogs happy and healthy.', available: true, sortOrder: 40 },
  { _type: 'product', name: 'HAART t-shirt', slug: 'haart-t-shirt', kind: 'merch', price: 35, description: 'Sample product. Unisex cotton tee with the haart wordmark. Sizes S to 3XL.', squareLink: undefined, available: true, sortOrder: 100 },
  { _type: 'product', name: 'HAART cap', slug: 'haart-cap', kind: 'merch', price: 25, description: 'Sample product. Adjustable cotton cap, charcoal with a red wordmark.', squareLink: undefined, available: true, sortOrder: 110 },
  { _type: 'product', name: 'Foster carer tote', slug: 'foster-tote', kind: 'merch', price: 20, description: 'Sample product. Heavy canvas tote for the lead, the treats and the vet paperwork.', squareLink: undefined, available: true, sortOrder: 120 },
];
