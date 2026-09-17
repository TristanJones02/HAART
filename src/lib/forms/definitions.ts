/**
 * Data-driven definitions for the seven website forms.
 *
 * Field list reconstructed from the audit; replace with the live form's
 * fields once scripts/crawl-inventory.ts has captured them
 * (docs/content-inventory.json → crawl.forms). TODO(tristan)
 *
 * TODO(tristan): the foster agreement text (who pays for vet care, food and
 * equipment, typical duration, what happens if it does not work out) must
 * come from HAART before launch. See docs/blockers.md F15. The foster forms
 * link to /foster for that information and ask the applicant to confirm they
 * have read it; the wording on that page is what needs confirming.
 *
 * Conventions: Australian English, sentence case, no colour-coded meaning.
 * Labels may contain one or more Markdown-style links, `[text](/path)`,
 * which DynamicForm renders as anchors and the email formatter flattens to
 * plain text. Field names are unique within a form and never use the
 * reserved names in RESERVED_FIELD_NAMES.
 */
import type { FormId } from '@/lib/content/types';
import { FORM_IDS } from '@/lib/content/types';

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkboxes';

export type FieldOption = { value: string; label: string };

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: FieldOption[];
  help?: string;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
};

export type FormSection = {
  heading: string;
  description?: string;
  fields: FieldDef[];
};

export type ConversionEvent = 'adoption_enquiry' | 'foster_application' | 'volunteer_signup';

export type FormDefinition = {
  id: FormId;
  title: string;
  intro?: string;
  successMessage: string;
  conversionEvent?: ConversionEvent;
  sections: FormSection[];
};

/** Names the submission pipeline uses for itself; no form field may use them. */
export const RESERVED_FIELD_NAMES = ['website', '_form', '_redirect'] as const;

// ---------------------------------------------------------------------------
// Shared options
// ---------------------------------------------------------------------------

const YES_NO: FieldOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const YES_NO_MAYBE: FieldOption[] = [...YES_NO, { value: 'maybe', label: 'Maybe, depending on the animal' }];

const HOURS_ALONE: FieldOption[] = [
  { value: 'under-2', label: 'Less than 2 hours' },
  { value: '2-4', label: '2 to 4 hours' },
  { value: '4-6', label: '4 to 6 hours' },
  { value: '6-8', label: '6 to 8 hours' },
  { value: 'over-8', label: 'More than 8 hours' },
];

const ENERGY: FieldOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'any', label: 'Any' },
];

// ---------------------------------------------------------------------------
// Shared fields and sections
// ---------------------------------------------------------------------------

const privacyConsent: FieldDef = {
  name: 'privacyConsent',
  type: 'checkbox',
  required: true,
  label: 'I have read the [privacy policy](/privacy) and agree to HAART keeping the details in this form so it can respond to me.',
};

const homeCheckConsent: FieldDef = {
  name: 'homeCheckConsent',
  type: 'checkbox',
  required: true,
  label: 'I understand a home or yard check is part of the process',
};

const fosterInfoRead: FieldDef = {
  name: 'fosterInfoRead',
  type: 'checkbox',
  required: true,
  label: 'I have read the [foster carer information](/foster)',
};

const fullName: FieldDef = { name: 'fullName', label: 'Full name', type: 'text', required: true, autoComplete: 'name', maxLength: 120 };
const email: FieldDef = { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', maxLength: 254 };
const phone = (required: boolean, help?: string): FieldDef => ({ name: 'phone', label: 'Phone', type: 'tel', required, autoComplete: 'tel', maxLength: 30, help });
const suburb: FieldDef = { name: 'suburb', label: 'Suburb', type: 'text', required: true, autoComplete: 'address-level2', maxLength: 80 };
const postcode: FieldDef = { name: 'postcode', label: 'Postcode', type: 'text', required: true, autoComplete: 'postal-code', maxLength: 4 };

const aboutYou = (extra: FieldDef[] = []): FormSection => ({
  heading: 'About you',
  fields: [fullName, email, phone(true, 'We will call or text you about your application.'), suburb, postcode, ...extra],
});

const anythingElse = (help: string): FieldDef => ({
  name: 'anythingElse',
  label: 'Anything else you would like to tell us?',
  type: 'textarea',
  help,
  maxLength: 4000,
});

const animalSection = (species: 'dog' | 'cat', example: string): FormSection => ({
  heading: `The ${species} you are interested in`,
  fields: [
    {
      name: 'animal',
      label: `Which ${species} are you interested in?`,
      type: 'text',
      help: `Their name and HAART ID if you know it, for example ${example}. Leave blank if you have not chosen yet.`,
      maxLength: 120,
    },
    {
      name: 'openToOthers',
      label: `Would you consider a different ${species} if this one is no longer available?`,
      type: 'radio',
      required: true,
      options: [...YES_NO, { value: 'unsure', label: 'Not sure yet' }],
    },
  ],
});

const householdSection: FormSection = {
  heading: 'Your household',
  fields: [
    { name: 'adults', label: 'How many adults live in your home?', type: 'number', required: true, maxLength: 2 },
    {
      name: 'children',
      label: 'Children in the home and their ages',
      type: 'text',
      help: 'For example: two children, aged 4 and 9. Leave blank if there are none.',
      maxLength: 200,
    },
    {
      name: 'otherPets',
      label: 'Other animals in the home',
      type: 'textarea',
      help: 'For each one: species, age, and whether they are desexed. Leave blank if there are none.',
      maxLength: 2000,
    },
  ],
};

const ownOrRent = (species: 'dog' | 'cat'): FieldDef[] => [
  {
    name: 'ownOrRent',
    label: 'Do you own or rent your home?',
    type: 'radio',
    required: true,
    options: [
      { value: 'own', label: 'Own' },
      { value: 'rent', label: 'Rent' },
      { value: 'other', label: 'Other, for example living with family' },
    ],
  },
  {
    name: 'landlordPermission',
    label: `If you rent, do you have permission from your landlord to keep a ${species}?`,
    type: 'radio',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'not-yet', label: 'Not yet' },
      { value: 'na', label: 'Not applicable, I do not rent' },
    ],
  },
  {
    name: 'homeType',
    label: 'Type of home',
    type: 'radio',
    required: true,
    options: [
      { value: 'house', label: 'House' },
      { value: 'unit', label: 'Unit, apartment or townhouse' },
      { value: 'other', label: 'Other' },
    ],
  },
];

const dogYardFields: FieldDef[] = [
  {
    name: 'yardSecure',
    label: 'Is your yard fully fenced and secure?',
    type: 'radio',
    required: true,
    options: [...YES_NO, { value: 'partly', label: 'Partly' }],
  },
  {
    name: 'fenceHeight',
    label: 'Fence height at the lowest point',
    type: 'text',
    help: 'Roughly, in metres. For example 1.8. Leave blank if you do not have a yard.',
    maxLength: 20,
  },
];

const catContainmentFields: FieldDef[] = [
  {
    name: 'catContainment',
    label: 'How would the cat be kept?',
    type: 'radio',
    required: true,
    options: [
      { value: 'indoors', label: 'Indoors only' },
      { value: 'enclosure', label: 'Indoors, with a secure outdoor enclosure or cat run' },
      { value: 'outdoors', label: 'Free to go outside' },
    ],
  },
  {
    name: 'windowScreens',
    label: 'Are your windows and doors fitted with flyscreens?',
    type: 'radio',
    required: true,
    options: [{ value: 'yes', label: 'Yes' }, { value: 'some', label: 'Some of them' }, { value: 'no', label: 'No' }],
  },
];

const holidays = (species: 'dog' | 'cat'): FieldDef => ({
  name: 'holidays',
  label: `What would happen to the ${species} when you go away?`,
  type: 'textarea',
  required: true,
  help: 'Holidays, work trips, weekends away.',
  maxLength: 1000,
});

const experienceSection = (): FormSection => ({
  heading: 'Experience',
  fields: [
    {
      name: 'previousPets',
      label: 'Pets you have had before, and what happened to them',
      type: 'textarea',
      required: true,
      help: 'Include pets you have now. It is fine to say you have not had a pet before.',
      maxLength: 2000,
    },
    { name: 'vet', label: 'The vet you use, or plan to use', type: 'text', maxLength: 160 },
  ],
});

// ---------------------------------------------------------------------------
// Pre-adoption questionnaires
// ---------------------------------------------------------------------------

const preAdoptionDogs: FormDefinition = {
  id: 'preAdoptionDogs',
  title: 'Pre-adoption questionnaire: dogs',
  intro:
    'Tell us about yourself, your home and the dog you are interested in. We read every questionnaire and will be in touch to talk through the next steps.',
  successMessage:
    'Thanks, we have your questionnaire. A volunteer will read it and be in touch about the next steps, which include a chat and a home or yard check. If you have not heard from us in a week or so, email info@haart.org.au.',
  conversionEvent: 'adoption_enquiry',
  sections: [
    aboutYou(),
    animalSection('dog', 'Beau HD26-030'),
    householdSection,
    { heading: 'Your home', fields: [...ownOrRent('dog'), ...dogYardFields] },
    {
      heading: 'Lifestyle',
      fields: [
        { name: 'hoursAlone', label: 'On a typical day, how many hours would the dog be alone?', type: 'select', required: true, options: HOURS_ALONE },
        {
          name: 'exercise',
          label: 'How would the dog be exercised?',
          type: 'textarea',
          required: true,
          help: 'Walks, runs, play, dog parks, and how often.',
          maxLength: 1000,
        },
        {
          name: 'sleeps',
          label: 'Where would the dog sleep?',
          type: 'radio',
          required: true,
          options: [
            { value: 'inside', label: 'Inside' },
            { value: 'outside', label: 'Outside' },
            { value: 'mix', label: 'Inside some nights, outside others' },
          ],
        },
        holidays('dog'),
      ],
    },
    experienceSection(),
    {
      heading: 'Anything else',
      fields: [
        anythingElse('Questions, or anything about your situation that would help us match you well.'),
        homeCheckConsent,
        privacyConsent,
      ],
    },
  ],
};

const preAdoptionCats: FormDefinition = {
  id: 'preAdoptionCats',
  title: 'Pre-adoption questionnaire: cats',
  intro:
    'Tell us about yourself, your home and the cat you are interested in. We read every questionnaire and will be in touch to talk through the next steps.',
  successMessage:
    'Thanks, we have your questionnaire. A volunteer will read it and be in touch about the next steps, which include a chat and a home check. If you have not heard from us in a week or so, email info@haart.org.au.',
  conversionEvent: 'adoption_enquiry',
  sections: [
    aboutYou(),
    animalSection('cat', 'Nia HC25-024'),
    householdSection,
    { heading: 'Your home', fields: [...ownOrRent('cat'), ...catContainmentFields] },
    {
      heading: 'Lifestyle',
      fields: [
        { name: 'hoursAlone', label: 'On a typical day, how many hours would the cat be alone?', type: 'select', required: true, options: HOURS_ALONE },
        {
          name: 'sleeps',
          label: 'Where would the cat sleep at night?',
          type: 'radio',
          required: true,
          options: [
            { value: 'inside', label: 'Inside' },
            { value: 'enclosure', label: 'In an outdoor enclosure' },
            { value: 'outside', label: 'Outside' },
          ],
        },
        holidays('cat'),
      ],
    },
    experienceSection(),
    {
      heading: 'Anything else',
      fields: [
        anythingElse('Questions, or anything about your situation that would help us match you well.'),
        homeCheckConsent,
        privacyConsent,
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Foster applications
// ---------------------------------------------------------------------------

const availabilitySection: FormSection = {
  heading: 'Availability',
  fields: [
    { name: 'startDate', label: 'When could you start fostering?', type: 'date', required: true },
    {
      name: 'duration',
      label: 'How long could you foster for?',
      type: 'select',
      required: true,
      options: [
        { value: 'up-to-2-weeks', label: 'Up to 2 weeks' },
        { value: '2-6-weeks', label: '2 to 6 weeks' },
        { value: '6-weeks-3-months', label: '6 weeks to 3 months' },
        { value: '3-months-plus', label: '3 months or more' },
        { value: 'until-adopted', label: 'As long as the animal needs' },
      ],
    },
    {
      name: 'term',
      label: 'Are you looking to foster short term, long term, or either?',
      type: 'radio',
      required: true,
      options: [
        { value: 'short', label: 'Short term, a few weeks' },
        { value: 'long', label: 'Long term, until adopted' },
        { value: 'either', label: 'Either' },
      ],
    },
  ],
};

const fosterChildren: FieldDef = {
  name: 'children',
  label: 'Children in the home and their ages',
  type: 'text',
  help: 'Leave blank if there are none.',
  maxLength: 200,
};

const ownPetsSection: FormSection = {
  heading: 'Your pets',
  fields: [
    {
      name: 'ownPets',
      label: 'Your own pets',
      type: 'textarea',
      help: 'Species, age, whether they are desexed, and how they are with other animals. Leave blank if you have none.',
      maxLength: 2000,
    },
  ],
};

const fosterExperienceSection = (species: 'dog' | 'cat'): FormSection => ({
  heading: 'Experience',
  fields: [
    {
      name: 'experience',
      label: `Your experience with ${species}s`,
      type: 'textarea',
      required: true,
      help: 'Pets you have had, fostering you have done, or work with animals.',
      maxLength: 2000,
    },
    {
      name: 'medicalBehaviour',
      label: 'Experience with medical care or behaviour',
      type: 'textarea',
      help:
        species === 'dog'
          ? 'For example giving medication, care after surgery, or working with anxious or reactive dogs. It is fine to have none.'
          : 'For example giving medication, care after surgery, bottle-feeding kittens, or settling a frightened cat. It is fine to have none.',
      maxLength: 2000,
    },
    {
      name: 'transport',
      label: `Could you take a foster ${species} to vet appointments and meet-and-greets?`,
      type: 'radio',
      required: true,
      options: [{ value: 'yes', label: 'Yes' }, { value: 'sometimes', label: 'Sometimes' }, { value: 'no', label: 'No' }],
    },
  ],
});

const fosterClosingSection = (species: 'dog' | 'cat'): FormSection => ({
  heading: 'Anything else',
  fields: [
    anythingElse(`Questions, or anything that would help us find the right ${species} for you.`),
    fosterInfoRead,
    homeCheckConsent,
    privacyConsent,
  ],
});

const fosterDogs: FormDefinition = {
  id: 'fosterDogs',
  title: 'Foster application: dogs',
  intro:
    'Foster carers are the heart of HAART. Tell us about your home and what you could take on, and a volunteer will be in touch.',
  successMessage: 'Thanks, we have your application. A volunteer will be in touch to arrange a chat and a home check.',
  conversionEvent: 'foster_application',
  sections: [
    aboutYou(),
    availabilitySection,
    { heading: 'Your home', fields: [...ownOrRent('dog'), ...dogYardFields, fosterChildren] },
    ownPetsSection,
    fosterExperienceSection('dog'),
    {
      heading: 'Preferences',
      description: 'None of these rule you out. They help us match you with a dog you can manage.',
      fields: [
        {
          name: 'sizes',
          label: 'Sizes you could foster',
          type: 'checkboxes',
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'extra-large', label: 'Extra large' },
          ],
        },
        {
          name: 'ages',
          label: 'Ages you could foster',
          type: 'checkboxes',
          options: [
            { value: 'puppy', label: 'Puppies' },
            { value: 'young', label: 'Young dogs' },
            { value: 'adult', label: 'Adults' },
            { value: 'senior', label: 'Seniors' },
          ],
        },
        { name: 'energy', label: 'Energy level you could manage', type: 'radio', options: ENERGY },
        { name: 'bondedPair', label: 'Could you take a bonded pair?', type: 'radio', required: true, options: YES_NO_MAYBE },
        {
          name: 'litter',
          label: 'Could you take a mum with a litter, or a litter of puppies on their own?',
          type: 'radio',
          required: true,
          options: YES_NO_MAYBE,
        },
        {
          name: 'medication',
          label: 'Could you take a dog who needs medication or a treatment plan?',
          type: 'radio',
          required: true,
          options: YES_NO_MAYBE,
        },
      ],
    },
    fosterClosingSection('dog'),
  ],
};

const fosterCats: FormDefinition = {
  id: 'fosterCats',
  title: 'Foster application: cats',
  intro:
    'Foster carers are the heart of HAART. Tell us about your home and what you could take on, and a volunteer will be in touch.',
  successMessage: 'Thanks, we have your application. A volunteer will be in touch to arrange a chat and a home check.',
  conversionEvent: 'foster_application',
  sections: [
    aboutYou(),
    availabilitySection,
    { heading: 'Your home', fields: [...ownOrRent('cat'), ...catContainmentFields, fosterChildren] },
    ownPetsSection,
    fosterExperienceSection('cat'),
    {
      heading: 'Preferences',
      description: 'None of these rule you out. They help us match you with a cat you can manage.',
      fields: [
        {
          name: 'ages',
          label: 'Ages you could foster',
          type: 'checkboxes',
          options: [
            { value: 'kitten', label: 'Kittens' },
            { value: 'young', label: 'Young cats' },
            { value: 'adult', label: 'Adults' },
            { value: 'senior', label: 'Seniors' },
          ],
        },
        { name: 'energy', label: 'Energy level you could manage', type: 'radio', options: ENERGY },
        { name: 'bondedPair', label: 'Could you take a bonded pair?', type: 'radio', required: true, options: YES_NO_MAYBE },
        {
          name: 'litter',
          label: 'Could you take a mum with kittens, or a litter of kittens on their own?',
          type: 'radio',
          required: true,
          help: 'Very young kittens may need bottle-feeding every few hours.',
          options: YES_NO_MAYBE,
        },
        {
          name: 'medication',
          label: 'Could you take a cat who needs medication or a treatment plan?',
          type: 'radio',
          required: true,
          options: YES_NO_MAYBE,
        },
      ],
    },
    fosterClosingSection('cat'),
  ],
};

// ---------------------------------------------------------------------------
// Volunteer, contact, partnership
// ---------------------------------------------------------------------------

const volunteer: FormDefinition = {
  id: 'volunteer',
  title: 'Volunteer with HAART',
  intro: 'HAART is run entirely by volunteers. Tell us what you would like to help with and when you are free.',
  successMessage: 'Thanks for offering to help. A volunteer will be in touch about how to get started.',
  conversionEvent: 'volunteer_signup',
  sections: [
    { heading: 'About you', fields: [fullName, email, phone(true), suburb] },
    {
      heading: 'What you would like to help with',
      fields: [
        {
          name: 'roles',
          label: 'Roles',
          type: 'checkboxes',
          required: true,
          help: 'Tick as many as you like.',
          options: [
            { value: 'transport', label: 'Transport: driving animals to vets, carers and events' },
            { value: 'events', label: 'Events and stalls' },
            { value: 'fundraising', label: 'Fundraising' },
            { value: 'home-checks', label: 'Home checks' },
            { value: 'photography', label: 'Photography' },
            { value: 'social-media', label: 'Social media and stories' },
            { value: 'admin', label: 'Admin' },
            { value: 'fostering', label: 'I am also interested in fostering' },
          ],
        },
      ],
    },
    {
      heading: 'Availability',
      fields: [
        {
          name: 'availability',
          label: 'When are you usually available?',
          type: 'checkboxes',
          required: true,
          options: [
            { value: 'weekdays', label: 'Weekdays' },
            { value: 'weekends', label: 'Weekends' },
            { value: 'evenings', label: 'Evenings' },
          ],
        },
      ],
    },
    {
      heading: 'Skills and experience',
      fields: [
        {
          name: 'skills',
          label: 'Skills and experience',
          type: 'textarea',
          help: 'Anything that might help: animal handling, driving, first aid, design, bookkeeping, trades, retail.',
          maxLength: 2000,
        },
      ],
    },
    {
      heading: 'Anything else',
      fields: [anythingElse('Questions, or anything else you would like us to know.'), privacyConsent],
    },
  ],
};

const contact: FormDefinition = {
  id: 'contact',
  title: 'Contact us',
  intro: 'HAART is run by volunteers, so please allow a few days for a reply.',
  successMessage:
    'Thanks, we have your message and will reply as soon as we can. HAART is run entirely by volunteers, so please allow a few days.',
  sections: [
    {
      heading: 'Your message',
      fields: [
        fullName,
        email,
        phone(false, 'Optional. Useful if your question is urgent.'),
        {
          name: 'topic',
          label: 'What is it about?',
          type: 'select',
          required: true,
          options: [
            { value: 'adopting', label: 'Adopting an animal' },
            { value: 'fostering', label: 'Fostering' },
            { value: 'surrender', label: 'Surrendering an animal' },
            { value: 'donations', label: 'Donations and sponsorship' },
            { value: 'lost-found', label: 'A lost or found animal' },
            { value: 'media', label: 'Media' },
            { value: 'other', label: 'Something else' },
          ],
        },
        { name: 'message', label: 'Message', type: 'textarea', required: true, maxLength: 4000 },
        privacyConsent,
      ],
    },
  ],
};

const partnership: FormDefinition = {
  id: 'partnership',
  title: 'Partnership enquiry',
  intro: 'Businesses keep HAART going through sponsorship, products and fundraising. Tell us what you have in mind.',
  successMessage: 'Thanks, we have your enquiry. Someone from the committee will be in touch.',
  sections: [
    {
      heading: 'About your business',
      fields: [
        { name: 'businessName', label: 'Business name', type: 'text', required: true, autoComplete: 'organization', maxLength: 160 },
        { name: 'contactName', label: 'Contact name', type: 'text', required: true, autoComplete: 'name', maxLength: 120 },
        email,
        phone(false, 'Optional.'),
        { name: 'businessWebsite', label: 'Website', type: 'text', autoComplete: 'url', help: 'Optional.', maxLength: 200 },
      ],
    },
    {
      heading: 'What you have in mind',
      fields: [
        {
          name: 'partnershipType',
          label: 'What kind of partnership?',
          type: 'select',
          required: true,
          options: [
            { value: 'sponsorship', label: 'Kennel or program sponsorship' },
            { value: 'in-kind', label: 'Product or in-kind support' },
            { value: 'fundraiser', label: 'Event or workplace fundraiser' },
            { value: 'other', label: 'Something else' },
          ],
        },
        {
          name: 'message',
          label: 'Tell us more',
          type: 'textarea',
          required: true,
          help: 'What you are thinking, timing, and anything you would like from HAART in return.',
          maxLength: 4000,
        },
        privacyConsent,
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const FORM_DEFINITIONS: Record<FormId, FormDefinition> = {
  preAdoptionDogs,
  preAdoptionCats,
  fosterDogs,
  fosterCats,
  volunteer,
  contact,
  partnership,
};

export function isFormId(value: unknown): value is FormId {
  return typeof value === 'string' && (FORM_IDS as string[]).includes(value);
}

export function getFormDefinition(id: FormId): FormDefinition {
  return FORM_DEFINITIONS[id];
}

/** Every field in a form, in display order. */
export function formFields(def: FormDefinition): FieldDef[] {
  return def.sections.flatMap((s) => s.fields);
}
