import type { Page, Section } from '@/lib/content/types';
import { textToPortable } from '@/lib/sanity/portable';

/**
 * Proposed site copy, one entry per page in docs/information-architecture.md.
 * Sentences carried verbatim from haart.org.au are marked "verbatim" in
 * docs/content-inventory.json; everything else is proposed copy for review.
 * Statements that depend on facts HAART must confirm are listed in
 * docs/blockers.md (F3, F6, F15, F16) and written so they are true either way.
 */

let k = 0;
const key = () => `k${++k}`;
const s = <T extends Section['_type']>(type: T, fields: Omit<Extract<Section, { _type: T }>, '_type' | '_key'>): Section => ({ _type: type, _key: key(), ...fields }) as Section;
const pt = textToPortable;

const home: Page = {
  _type: 'page',
  title: 'Home',
  slug: 'home',
  seo: { title: 'HAART: Perth foster-based animal rescue', description: 'HAART is a not-for-profit, no-kill animal rescue in Perth. No shelter, no government funding. Adopt, foster, volunteer or donate.' },
  sections: [
    s('section.hero', {
      eyebrow: 'Homeless and Abused Animal Rescue Team',
      heading: "Perth's foster-based, no-kill rescue",
      lead: 'No shelter, no government funding, and no animal put to sleep for want of space. Just volunteers, foster homes across Perth, and the people who support them.',
      image: { alt: 'Placeholder image standing in for a photo of a rescue dog with its foster carer', url: '/placeholders/dog-3.svg', width: 1200, height: 900 },
      primaryCta: { label: 'Meet the animals', href: '/adopt' },
      secondaryCta: { label: 'Donate', href: '/donate' },
    }),
    s('section.actionGrid', {
      heading: 'Four ways to help',
      items: [
        { icon: 'heart', heading: 'Donate', text: 'Every dollar goes to vet bills, food and transport. A monthly gift keeps a foster place open.', link: { label: 'Give now', href: '/donate' } },
        { icon: 'paw', heading: 'Adopt', text: 'Dogs and cats assessed in real homes, so you know who you are bringing home.', link: { label: 'See who is waiting', href: '/adopt' } },
        { icon: 'house', heading: 'Foster', text: 'You provide the home and the patience. We cover the vet bills and back you the whole way.', link: { label: 'How fostering works', href: '/foster' } },
        { icon: 'users', heading: 'Volunteer', text: 'Transport, events, photos, home checks. A few hours a month makes a difference.', link: { label: 'Join the team', href: '/volunteer' } },
      ],
    }),
    s('section.fosterNeededStrip', { heading: 'Needing a foster home now', text: 'These animals are waiting for a foster carer before they can leave the pound or a boarding kennel.' }),
    s('section.animalGrid', { heading: 'Recently listed', species: 'all', limit: 4, cta: { label: 'See all animals', href: '/adopt' } }),
    s('section.eventsStrip', { headingToday: 'On today', headingUpcoming: 'Coming up' }),
    s('section.storyFeature', { heading: 'From the rescue' }),
    s('section.statBand', {
      heading: 'How HAART works',
      stats: [
        { value: '100%', label: 'volunteer run' },
        { value: '$0', label: 'government funding' },
        { value: '0', label: 'animals put to sleep for space' },
        { value: '2012', label: 'rescuing since' },
      ],
      note: 'HAART is a Not-For-Profit Charitable organisation that saves the lives of hundreds of animals each year, supported only by the generosity of the general public for our funding.',
    }),
    s('section.partnerLogos', { heading: 'Supported by' }),
    s('section.newsletter', { heading: 'Hear about news and events first', text: 'A short email now and then. No spam, unsubscribe any time.' }),
  ],
};

const about: Page = {
  _type: 'page',
  title: 'About HAART',
  slug: 'about',
  seo: { description: 'HAART is a volunteer-run, foster-based, no-kill animal rescue in Perth, Western Australia, founded in 2012.' },
  sections: [
    s('section.pageHeader', { eyebrow: 'About', heading: 'A rescue with no shelter, on purpose', lead: 'A group of like-minded individuals came together from other rescues with the idea of doing things different. From this we have grown to the rescue we are today.' }),
    s('section.richText', {
      body: pt(
        "HAART is a Not-For-Profit Charitable organisation that saves the lives of hundreds of animals each year, supported only by the generosity of the general public for our funding.\n\nWe don't have a premises with hundreds of animals awaiting adoption. Instead, we have a team of dedicated foster carers – people just like yourselves – who take scared, abused, and unwanted animals into their homes, give them the gift of life, and love them like their own, until we find them the perfect forever home.\n\nHAART is exclusively no-kill and do not put animals to sleep just because they don't have room.\n\nOur goal is to see the day when we are no longer needed. We would like nothing more than to put ourselves out of a job, because that would mean there are no more homeless animals.",
      ),
    }),
    s('section.stepList', {
      heading: 'How the foster model works',
      steps: [
        { heading: 'An animal comes to us', text: 'From a council pound where its time has run out, or from an owner who can no longer keep it. We take on what we have foster places for, and we never put an animal to sleep for want of space.' },
        { heading: 'A vet sees it first', text: 'Every animal is checked, vaccinated, microchipped and desexed before adoption. Injuries and illness are treated before anything else happens.' },
        { heading: 'It goes to a foster home', text: 'Living in a real home tells us what a kennel never could: how the animal is with children, cats, other dogs, being left alone, car trips, the vacuum cleaner.' },
        { heading: 'We match it to a family', text: 'Adopters complete a questionnaire, we talk, and we visit. Then the foster carer and the adopter meet. The foster carer knows the animal best, so their word counts.' },
      ],
    }),
    s('section.iconList', {
      heading: 'What else we do',
      items: [
        { icon: 'stethoscope', heading: 'Free desexing for accidental litters', text: 'If you surrender an accidental litter to us for rehoming, we desex the parents at no cost so it does not happen again.' },
        { icon: 'megaphone', heading: 'Community education', text: 'We advance public knowledge of sterilisation, microchipping, vaccination, socialisation and training, because fewer animals in pounds is the whole point.' },
        { icon: 'handshake', heading: 'Working with pounds and other rescues', text: 'Rescue is a network. We take animals from council pounds across Perth and work alongside other groups rather than in competition with them.' },
      ],
    }),
    s('section.trustBand', { heading: 'Registered and accountable', showAbn: true, showAcnc: true, showFounded: true, note: 'Registration details are shown here once a committee member has verified them in the site settings.' }),
    s('section.cta', { heading: 'Be part of it', text: 'Adopt, foster, volunteer or give. Every one of them changes what we can take on next week.', primary: { label: 'Become a foster carer', href: '/foster' }, secondary: { label: 'Donate', href: '/donate' } }),
  ],
};

const adopt: Page = {
  _type: 'page',
  title: 'Adopt',
  slug: 'adopt',
  seo: { description: 'Adopt a rescue dog or cat in Perth through HAART. Every animal is vet checked, desexed, vaccinated and microchipped, and assessed in a foster home.' },
  sections: [
    s('section.pageHeader', { eyebrow: 'Adopt', heading: 'Adopt a dog or cat', lead: 'HAART dreams of a world where every companion animal is in a loving, caring and secure home, and by adopting, you could be part of this vision.' }),
    s('section.speciesTiles', { heading: 'Who are you looking for?', dogsText: 'Puppies to seniors, assessed in foster homes across Perth.', catsText: 'Kittens and adult cats, all desexed and ready for an indoor life.' }),
    s('section.stepList', {
      heading: 'How adoption works',
      intro: 'Four steps, usually a week or two from start to finish.',
      steps: [
        { heading: 'Tell us about your home', text: 'Complete the pre-adoption questionnaire for dogs or cats. It asks about your household, your yard or unit, and your routine. It is not a test; it helps us match you well.' },
        { heading: 'We call you', text: 'Within seven days a volunteer will call to talk through your answers and the animals that might suit.' },
        { heading: 'Meet and greet, and a home check', text: 'You meet the animal with its foster carer, who knows it best. A volunteer visits your home to check that the yard and fencing are suitable, because the safety of our animals comes first.' },
        { heading: 'Adoption day', text: 'Sign the adoption agreement, pay the fee, and take your new family member home. The foster carer stays a phone call away for the first few weeks.' },
      ],
    }),
    s('section.feeTable', {
      heading: 'Adoption fees',
      rows: [
        { label: 'Cats and kittens', amount: '$200', note: 'Standard fee' },
        { label: 'Dogs and puppies', amount: 'Set per dog', note: 'Shown on each profile' },
      ],
      inclusions: 'All adoption fees include microchipping and sterilisation as well as up to date vaccinations, flea treatment and worming. Adopting two animals together? Ask us about a reduced fee.',
    }),
    s('section.faq', {
      heading: 'Common questions',
      items: [
        { question: 'I rent. Can I adopt?', answer: 'Yes, with your landlord\'s written permission for the type of animal. The questionnaire asks for it.' },
        { question: 'Can I meet an animal before applying?', answer: 'We ask for the questionnaire first. It takes ten minutes and means the foster carer\'s time goes to people who are ready to adopt. Meet and greets are arranged after the call.' },
        { question: 'What if it does not work out?', answer: 'Tell us straight away. Every HAART animal comes back to HAART, for life. We would far rather rehome carefully a second time than have an animal end up in a pound.' },
        { question: 'Do you adopt outside Perth?', answer: 'Occasionally, for the right match, if a home check can be arranged. Ask when we call.' },
      ],
    }),
    s('section.cta', { heading: 'Ready to apply?', text: 'The questionnaire is the first step for every adoption.', primary: { label: 'Dog questionnaire', href: '/adopt/apply/dogs' }, secondary: { label: 'Cat questionnaire', href: '/adopt/apply/cats' } }),
  ],
};

const adoptDogs: Page = { _type: 'page', title: 'Dogs for adoption', slug: 'adopt-dogs', seo: { description: 'Dogs and puppies available for adoption through HAART in Perth.' }, sections: [s('section.pageHeader', { eyebrow: 'Adopt', heading: 'Dogs', lead: 'All of the dogs listed are available for adoption. All adoption fees include microchipping and sterilisation as well as up to date vaccinations, flea treatment and worming.' }), s('section.animalListing', { species: 'dog' })] };
const adoptCats: Page = { _type: 'page', title: 'Cats for adoption', slug: 'adopt-cats', seo: { description: 'Cats and kittens available for adoption through HAART in Perth.' }, sections: [s('section.pageHeader', { eyebrow: 'Adopt', heading: 'Cats', lead: 'All of the cats listed are available for adoption. The standard fee for adopting a cat with HAART is $200 and this includes vet check, vaccinations, flea and worming, microchipping and sterilisation.' }), s('section.animalListing', { species: 'cat' })] };

const applyDogs: Page = { _type: 'page', title: 'Pre-adoption questionnaire: dogs', slug: 'adopt-apply-dogs', sections: [s('section.pageHeader', { eyebrow: 'Adopt', heading: 'Pre-adoption questionnaire for dogs', lead: 'Ten minutes, no commitment. We use it to match you with a dog that will suit your home, and a volunteer will call you within seven days.' }), s('section.formEmbed', { form: 'preAdoptionDogs' })] };
const applyCats: Page = { _type: 'page', title: 'Pre-adoption questionnaire: cats', slug: 'adopt-apply-cats', sections: [s('section.pageHeader', { eyebrow: 'Adopt', heading: 'Pre-adoption questionnaire for cats', lead: 'Ten minutes, no commitment. A volunteer will call you within seven days.' }), s('section.formEmbed', { form: 'preAdoptionCats' })] };

const foster: Page = {
  _type: 'page',
  title: 'Foster',
  slug: 'foster',
  seo: { description: 'Become a foster carer with HAART in Perth. We cover vet costs and support you; you provide the home. Short and long-term fostering for dogs and cats.' },
  sections: [
    s('section.pageHeader', { eyebrow: 'Foster', heading: 'Foster carers are the rescue', lead: 'By welcoming an animal into your home you are saving them from the streets, the pound or potentially being put to sleep. Fostering an animal before they are adopted allows us to learn their temperament and needs so that we can find them the perfect forever home.' }),
    s('section.richText', {
      body: pt(
        'HAART has a team of dedicated foster carers – people just like yourselves – who take scared, abused, and unwanted animals into their homes, give them the gift of life, and love them like their own, until we find them the perfect forever home.\n\nThe main requirements for a potential foster carer are that they can provide a warm bed, a full belly, patience and lots of love.\n\nWithout foster homes we cannot take an animal out of the pound. Every new carer is, quite literally, another life we can say yes to.',
      ),
    }),
    s('section.iconList', {
      heading: 'What fostering actually involves',
      intro: 'The honest version. Details to confirm with the foster coordinator are marked on the application.',
      items: [
        { icon: 'stethoscope', heading: 'Vet costs are covered', text: 'HAART pays for veterinary treatment arranged through our vets. You never pay a vet bill for a foster animal.' },
        { icon: 'gift', heading: 'Help with supplies', text: 'Food, a bed, a crate or a lead can be provided if you need them. Many carers use their own; either is fine.' },
        { icon: 'clock', heading: 'Usually two to eight weeks', text: 'Puppies and kittens move fast. Adult dogs with a bit of history take longer. You tell us what you can manage and we match to that.' },
        { icon: 'car', heading: 'Some driving', text: 'Vet visits and meet and greets are on you, with our transport volunteers as backup when you are stuck.' },
        { icon: 'users', heading: 'A coordinator on the end of the phone', text: 'A foster coordinator checks in, answers the 9 pm questions, and steps in if something is not working.' },
        { icon: 'heart', heading: 'Letting go', text: 'Yes, you will get attached. Handing an animal to a family you have helped choose is the best part, and there is always another one waiting.' },
      ],
    }),
    s('section.faq', {
      heading: 'The worries everyone has',
      items: [
        { question: 'I work full time.', answer: 'Plenty of our carers do. We match you with an animal that copes with a working household, and puppies and animals on medication go to carers who are home more.' },
        { question: 'I have my own dog or cat.', answer: 'Good. A settled resident animal often helps a foster settle. We introduce carefully and only place animals we know are social with others.' },
        { question: 'I rent.', answer: 'Fostering is temporary, but you still need your landlord\'s permission for animals. The application asks for it.' },
        { question: 'What if it does not work out?', answer: 'Ring the coordinator. We move the animal to another carer, no judgement. It happens, and it is always better to say so early.' },
        { question: 'What if I want to adopt my foster?', answer: 'It happens so often it has a name. Tell the coordinator before the animal is listed and you go through the normal adoption steps.' },
        { question: 'Do I need a fenced yard?', answer: 'For most dogs, yes, and secure. For cats, an indoor home with screens on windows. Small dogs and puppies can suit units with a plan for toileting.' },
      ],
    }),
    s('section.fosterNeededStrip', { heading: 'Animals waiting for a foster home now', text: 'Each of these is in a pound or a boarding kennel until a carer says yes.' }),
    s('section.cta', { heading: 'Apply to foster', text: 'One form, then a call from the coordinator.', primary: { label: 'Foster dogs', href: '/foster/apply/dogs' }, secondary: { label: 'Foster cats', href: '/foster/apply/cats' } }),
  ],
};

const fosterDogs: Page = { _type: 'page', title: 'Foster carer application: dogs', slug: 'foster-apply-dogs', sections: [s('section.pageHeader', { eyebrow: 'Foster', heading: 'Foster carer application for dogs', lead: 'Tell us about your home and what you can manage. The foster coordinator will call to talk it through.' }), s('section.formEmbed', { form: 'fosterDogs' })] };
const fosterCats: Page = { _type: 'page', title: 'Foster carer application: cats', slug: 'foster-apply-cats', sections: [s('section.pageHeader', { eyebrow: 'Foster', heading: 'Foster carer application for cats', lead: 'Kittens, mums with litters, and adult cats needing a quiet room for a few weeks.' }), s('section.formEmbed', { form: 'fosterCats' })] };

const volunteer: Page = {
  _type: 'page',
  title: 'Volunteer',
  slug: 'volunteer',
  seo: { description: 'Volunteer with HAART in Perth: transport, events, photography, home checks, fundraising and admin.' },
  sections: [
    s('section.pageHeader', { eyebrow: 'Volunteer', heading: 'Help without fostering', lead: 'HAART receives no government funding and is run entirely by a small group of volunteers. Most jobs take a few hours a month and none of them need experience.' }),
    s('section.iconList', {
      heading: 'Where we need people',
      items: [
        { icon: 'car', heading: 'Transport', text: 'Pound pick-ups, vet runs and moving animals between foster homes. A car, a crate and a free morning.' },
        { icon: 'megaphone', heading: 'Events and stalls', text: 'Adoption days, quiz nights, sausage sizzles and Christmas photos. Set up, talk to people, pack down.' },
        { icon: 'house', heading: 'Home checks', text: 'Visit prospective adopters and foster carers to check the yard and the fence. We show you what to look for.' },
        { icon: 'camera', heading: 'Photography and stories', text: 'Good photos get animals adopted. If you can take one, or write two hundred words about a foster, we need you.' },
        { icon: 'dollar', heading: 'Fundraising', text: 'Run the auction, ask a business for a raffle prize, organise a workplace fundraiser.' },
        { icon: 'badge-check', heading: 'Admin', text: 'Answering the inbox, following up applications, keeping the animal listings current.' },
      ],
    }),
    s('section.faq', {
      heading: 'Questions',
      items: [
        { question: 'How much time?', answer: 'Whatever you say on the form. Some people do one event a year. Some do a vet run every week.' },
        { question: 'Is there training?', answer: 'For home checks and transport, yes, and you go out with an experienced volunteer first.' },
        { question: 'Can I volunteer with my kids?', answer: 'Events and stalls, yes. Transport and home checks are adults only.' },
      ],
    }),
    s('section.formEmbed', { form: 'volunteer', heading: 'Register your interest' }),
  ],
};

const donate: Page = {
  _type: 'page',
  title: 'Donate',
  slug: 'donate',
  seo: { description: 'Donate to HAART, a volunteer-run, no-kill animal rescue in Perth. One-off or monthly. Every dollar goes to the animals.' },
  sections: [
    s('section.donateWidget', {
      heading: 'Give to the animals',
      text: 'HAART receives no government funding and is run entirely by volunteers, so your gift goes to vet bills, food and transport, not wages.',
      amounts: [25, 50, 100, 250],
      impactLines: [
        { amount: 25, text: 'a month of flea and worm treatment for a foster dog' },
        { amount: 50, text: 'vaccinations for a litter of kittens' },
        { amount: 100, text: 'a desexing surgery' },
        { amount: 250, text: 'the pound release fee and first vet check for one dog' },
      ],
    }),
    s('section.statBand', {
      stats: [
        { value: '100%', label: 'volunteer run' },
        { value: '$0', label: 'government funding' },
        { value: 'Hundreds', label: 'of animals rehomed each year' },
      ],
    }),
    s('section.otherWaysToGive', {
      heading: 'Other ways to give',
      showBankDetails: true,
      showContainersForChange: true,
      items: [
        { icon: 'gift', heading: 'Supplies', text: 'Food, litter and bedding are always needed. Email us before dropping anything off so it goes to the right foster home.', link: { label: 'Email about supplies', href: 'mailto:info@haart.org.au?subject=Supplies' } },
        { icon: 'handshake', heading: 'Sponsor as a business', text: 'Kennel sponsorship, product support or a workplace fundraiser.', link: { label: 'Partners and sponsors', href: '/partners' } },
        { icon: 'sparkles', heading: 'Shop, wine and memberships', text: 'Merchandise, Goodwill Wines and Entertainment memberships all send money back to the rescue.', link: { label: 'Shop and fundraisers', href: '/support' } },
        { icon: 'heart', heading: 'Leave a gift in your will', text: 'A bequest keeps the rescue going for years. Talk to us and we will help with the wording.', link: { label: 'Contact us', href: '/contact' } },
      ],
    }),
    s('section.faq', {
      heading: 'Questions about giving',
      items: [
        { question: 'Is my donation tax deductible?', answer: 'We will say so clearly on this page once our endorsement is confirmed. If you need a receipt for any reason, email us with the date and amount.' },
        { question: 'Can I stop a monthly gift?', answer: 'Yes, any time, from the link in your receipt email or by emailing us. No questions asked.' },
        { question: 'Where does the money go?', answer: 'Vet bills first, then pound release fees, food, transport and the boring things like insurance. Nobody at HAART is paid.' },
      ],
    }),
  ],
};

const donateThanks: Page = { _type: 'page', title: 'Thank you', slug: 'donate-thank-you', seo: { noIndex: true }, sections: [s('section.pageHeader', { heading: 'Thank you', lead: 'Your gift is already at work. A receipt is on its way to your inbox.' }), s('section.storyFeature', { heading: 'What your money does' }), s('section.cta', { heading: 'Tell someone', text: 'Sharing HAART with one friend is worth as much as a second donation.', primary: { label: 'Meet the animals', href: '/adopt' }, secondary: { label: 'Follow on Facebook', href: 'https://www.facebook.com/haartav' } })] };

const contact: Page = {
  _type: 'page',
  title: 'Contact',
  slug: 'contact',
  seo: { description: 'Contact HAART, Perth animal rescue. Email info@haart.org.au or use the form.' },
  sections: [
    s('section.pageHeader', { eyebrow: 'Contact', heading: 'Get in touch', lead: 'HAART is run entirely by volunteers, so please bear with us. We answer everything, in order, as fast as we can.' }),
    s('section.linkList', {
      heading: 'Save yourself a wait',
      links: [
        { label: 'Adopting a dog or cat', href: '/adopt', description: 'Start with the questionnaire. It is the first step for every adoption.' },
        { label: 'Fostering', href: '/foster', description: 'Read how it works, then apply. The coordinator calls every applicant.' },
        { label: 'Surrendering an animal', href: '/surrender', description: 'What we can and cannot take on, and what to do first.' },
        { label: 'Lost or found a pet', href: 'https://www.facebook.com/haartav', description: 'Post on our Facebook page and contact your local council ranger.' },
      ],
    }),
    s('section.contactDetails', { heading: 'Contact details' }),
    s('section.formEmbed', { form: 'contact', heading: 'Send a message' }),
  ],
};

const partners: Page = {
  _type: 'page',
  title: 'Partners and sponsors',
  slug: 'partners',
  seo: { description: 'Businesses that support HAART, and how yours can. Kennel sponsorship, product support and workplace fundraising.' },
  sections: [
    s('section.pageHeader', { eyebrow: 'Support', heading: 'Partners and sponsors', lead: 'HAART is supported by a myriad of businesses. Vets, boarding kennels, food suppliers, photographers and shops who give their time, their product or their money.' }),
    s('section.partnerGrid', { heading: 'Friends of HAART' }),
    s('section.priceCards', {
      heading: 'Sponsor a kennel',
      intro: 'As a Kennel Sponsor, your support will make an incredible difference, providing bedding, blankets, toys and treats to keep dogs happy and healthy. Pricing and terms to be confirmed by the committee.',
      cards: [
        { title: 'One year', price: '$2,500', period: 'year', features: ['Your logo on the kennel and on this page', 'Quarterly update on the dogs you have housed', 'Social media thank-you'], cta: { label: 'Enquire', href: '/partners/apply' } },
        { title: 'Two years', price: 'Discounted', period: 'two-year term', features: ['Everything in one year', 'A discounted rate for committing longer'], cta: { label: 'Enquire', href: '/partners/apply' } },
        { title: 'Three years', price: 'Discounted', period: 'three-year term', features: ['Everything in one year', 'Our best rate', 'Named kennel for the term'], cta: { label: 'Enquire', href: '/partners/apply' } },
      ],
    }),
    s('section.cta', { heading: 'Have something else in mind?', text: 'Product, a raffle prize, a workplace fundraiser, or a skill we could use.', primary: { label: 'Partnership enquiry', href: '/partners/apply' } }),
  ],
};

const partnersApply: Page = { _type: 'page', title: 'Partnership enquiry', slug: 'partners-apply', sections: [s('section.pageHeader', { eyebrow: 'Support', heading: 'Partnership enquiry', lead: 'Tell us about your business and what you are thinking. A committee member will reply.' }), s('section.formEmbed', { form: 'partnership' })] };

const support: Page = {
  _type: 'page',
  title: 'Other ways to support',
  slug: 'support',
  seo: { description: 'Support HAART without donating cash: shop, fundraiser products, Containers for Change, events and partnerships.' },
  sections: [
    s('section.pageHeader', { eyebrow: 'Support', heading: 'Other ways to support HAART', lead: 'Shopping, recycling, a quiz night or a wine order. All of it ends up as vet bills paid.' }),
    s('section.productGrid', { heading: 'Fundraisers', kind: 'fundraiser', limit: 6 }),
    s('section.linkList', {
      heading: 'More',
      links: [
        { label: 'Shop', href: '/shop', description: 'Merchandise, paid through Square.' },
        { label: 'Events', href: '/events', description: 'Quiz nights, adoption days, sausage sizzles and photo days.' },
        { label: 'Partners and sponsors', href: '/partners', description: 'For businesses.' },
        { label: 'Donate', href: '/donate', description: 'One-off or monthly, plus bank transfer and Containers for Change.' },
      ],
    }),
  ],
};

const shop: Page = { _type: 'page', title: 'Shop', slug: 'shop', seo: { description: 'HAART merchandise. Every sale supports rescue animals in Perth.' }, sections: [s('section.pageHeader', { eyebrow: 'Support', heading: 'Shop', lead: 'Paid securely through Square. Pick-up at events or posted within Australia.' }), s('section.productGrid', { heading: 'Merchandise', kind: 'merch' }), s('section.productGrid', { heading: 'Fundraisers', kind: 'fundraiser' })] };

const events: Page = { _type: 'page', title: 'Events', slug: 'events', seo: { description: 'HAART events in Perth: adoption days, quiz nights, fundraisers and photo days.' }, sections: [s('section.pageHeader', { eyebrow: 'Support', heading: 'Events', lead: 'Adoption days, quiz nights, sausage sizzles and photo days. Events are posted on our Facebook page and appear here automatically.' }), s('section.eventList', { showPast: true })] };

const stories: Page = { _type: 'page', title: 'Rescue stories', slug: 'stories', seo: { description: 'Stories from HAART: where the animals came from and where they ended up.' }, sections: [s('section.pageHeader', { eyebrow: 'Stories', heading: 'Rescue stories', lead: 'Where they came from, what it took, and where they are now.' }), s('section.articleList', { limit: 12 })] };

const forms: Page = {
  _type: 'page',
  title: 'Forms',
  slug: 'forms',
  sections: [
    s('section.pageHeader', { heading: 'Forms', lead: 'Every form on the site, in one place.' }),
    s('section.linkList', {
      links: [
        { label: 'Dog pre-adoption questionnaire', href: '/adopt/apply/dogs', description: 'The first step to adopting a dog.' },
        { label: 'Cat pre-adoption questionnaire', href: '/adopt/apply/cats', description: 'The first step to adopting a cat.' },
        { label: 'Dog foster application', href: '/foster/apply/dogs' },
        { label: 'Cat foster application', href: '/foster/apply/cats' },
        { label: 'Volunteer registration', href: '/volunteer' },
        { label: 'Partnership enquiry', href: '/partners/apply' },
        { label: 'Contact form', href: '/contact' },
      ],
    }),
  ],
};

const surrender: Page = {
  _type: 'page',
  title: 'Surrendering an animal',
  slug: 'surrender',
  seo: { description: 'Thinking about surrendering a dog or cat in Perth? What HAART can take on, and what to do first.' },
  sections: [
    s('section.pageHeader', { eyebrow: 'About', heading: 'Surrendering an animal', lead: 'Sometimes keeping an animal is not possible. Here is how we can help, and what we need from you.' }),
    s('section.richText', {
      body: pt(
        'HAART rehomes private surrenders as well as pound animals, but we can only take on what we have a foster place for. Please contact us before you make any decision, and please do not leave an animal at a pound if there is any other option.\n\nIf you have an accidental litter, we can take the puppies or kittens for responsible rehoming, desexed, and we will desex the parents at no cost to you.\n\nWhat we will ask: the animal\'s age, vet history, temperament with people and other animals, and the reason for surrender. Being honest about behaviour is what keeps the animal safe in its next home.\n\nDetails of the surrender process are being confirmed with the committee. Until then, email or call and a volunteer will talk it through.',
      ),
    }),
    s('section.faq', {
      heading: 'Questions',
      items: [
        { question: 'Is there a surrender fee?', answer: 'To be confirmed. Where there is one, it goes toward the vet work the animal needs before adoption.' },
        { question: 'Will I hear how the animal goes?', answer: 'If you would like to, yes, once it is adopted.' },
        { question: 'Can you take my animal today?', answer: 'Rarely. We need a foster place first. In an emergency, call us and your local council ranger.' },
      ],
    }),
    s('section.cta', { heading: 'Talk to us first', primary: { label: 'Contact HAART', href: '/contact?subject=surrender' } }),
  ],
};

const privacy: Page = {
  _type: 'page',
  title: 'Privacy policy',
  slug: 'privacy',
  seo: { description: 'How HAART collects, uses and protects personal information.' },
  sections: [
    s('section.pageHeader', { heading: 'Privacy policy', lead: 'Draft for adoption by the committee. Written for the Australian Privacy Principles.' }),
    s('section.richText', {
      body: pt(
        'Who we are\n\nHomeless And Abused Animal Rescue Team Association Inc (HAART, we, us) is a volunteer-run animal rescue based in Perth, Western Australia. This policy explains what personal information we collect through haart.org.au and what we do with it.\n\nWhat we collect\n\nWhen you complete a form on this site (adoption questionnaire, foster application, volunteer registration, contact or partnership enquiry) we collect the details you enter: your name, contact details, and information about your home and household that helps us place animals safely. When you donate through our payment provider, the provider collects your payment details; we receive your name, email address, the amount and the date. When you buy merchandise, Square processes the order.\n\nHow we use it\n\nTo respond to you, to assess adoption and foster applications, to arrange home checks and meet and greets, to issue receipts, and to contact you about the animal you enquired about. If you tick the newsletter box or sign up on our newsletter page, we send you occasional news and event emails until you unsubscribe.\n\nWho sees it\n\nHAART volunteers who handle adoptions, fostering and fundraising. Our form submissions are stored in our content system and emailed to our inbox. We do not sell or trade personal information. We share it only with service providers who process it for us (email delivery, payment processing, content hosting) and where the law requires.\n\nAnalytics\n\nThis site uses Plausible Analytics, which does not use cookies and does not collect personal information. We can see how many people visit each page and which links they follow, not who they are.\n\nPhotographs\n\nWe publish photographs of animals in our care. We do not publish identifying information about people who surrender animals, and we do not publish details of cruelty cases that are under investigation.\n\nAccess and correction\n\nEmail info@haart.org.au to ask what we hold about you, to correct it, or to have it deleted where we no longer need it.\n\nComplaints\n\nEmail us first. If you are not satisfied, you can complain to the Office of the Australian Information Commissioner at oaic.gov.au.\n\nThis policy was last updated on 17 September 2026.',
      ),
    }),
  ],
};

export const MOCK_PAGES: Page[] = [home, about, adopt, adoptDogs, adoptCats, applyDogs, applyCats, foster, fosterDogs, fosterCats, volunteer, donate, donateThanks, contact, partners, partnersApply, support, shop, events, stories, forms, surrender, privacy];
