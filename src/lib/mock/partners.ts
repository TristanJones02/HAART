import type { Partner } from '@/lib/content/types';

/** From the Friends of HAART page (docs/content-inventory.json → partner). Names not indexed are placeholders to replace. */
export const MOCK_PARTNERS: Partner[] = [
  { _type: 'partner', name: 'Pet Fresh', slug: 'pet-fresh', url: 'https://www.petfresh.com.au/', category: 'Food', tier: 'supplier', sortOrder: 10, description: "We've developed a balanced RAW diet that's made fresh to suit both dogs and cats, of any breeds, sizes and ages, all conveniently delivered to your door." },
  { _type: 'partner', name: 'Pawpals Daycare & Parlour', slug: 'pawpals-daycare-and-parlour', category: 'Boarding and grooming', tier: 'community', sortOrder: 20, description: 'Owned and operated by certified experts in canine behaviour, Pawpals features 4 separate play areas including tunnels, ramps and paddling pools, and offers multiple grooming options for pets.' },
  { _type: 'partner', name: 'PETstock VET Cannington', slug: 'petstock-vet-cannington', category: 'Veterinary', tier: 'community', sortOrder: 30, description: "At PETstock VET Cannington we're making caring for your pet as easy as possible, with flexible payment options." },
  { _type: 'partner', name: 'Pet boarding partner (name to confirm)', slug: 'pet-boarding-partner', category: 'Boarding', tier: 'community', sortOrder: 40, description: 'We cater for all sizes of dogs and can even board your cat in standard or luxury cattery.' },
  { _type: 'partner', name: 'Veterinary partner (name to confirm)', slug: 'veterinary-partner', category: 'Veterinary', tier: 'community', sortOrder: 50, description: 'Surgical suites, dentistry and medical facilities.' },
  { _type: 'partner', name: 'Animal photography partner (name to confirm)', slug: 'photography-partner', category: 'Photography', tier: 'community', sortOrder: 60, description: 'Professional animal photography services.' },
];
