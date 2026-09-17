import { describe, expect, it } from 'vitest';
import { FORM_DEFINITIONS, formFields } from './definitions';
import { emailSubject, formatSubmissionText, submitterEmail, submitterName } from './format';
import { animalFromSlug, formStatusFromSearchParams, prefillFromSearchParams } from './prefill';
import { HONEYPOT_FIELD, buildSchema, isHoneypotFilled, parseSubmission } from './schema';

const validContact = {
  _form: 'contact',
  fullName: 'Jane Citizen',
  email: 'jane@example.com',
  phone: '',
  topic: 'adopting',
  message: 'Is Beau still available?',
  privacyConsent: true,
  website: '',
};

const validAdoption = {
  _form: 'preAdoptionDogs',
  fullName: 'Jane Citizen',
  email: 'jane@example.com',
  phone: '0412 345 678',
  suburb: 'Fremantle',
  postcode: '6160',
  animal: 'Beau HD26-030',
  openToOthers: 'yes',
  adults: '2',
  children: '',
  otherPets: 'One cat, 4, desexed',
  ownOrRent: 'own',
  landlordPermission: 'na',
  homeType: 'house',
  yardSecure: 'yes',
  fenceHeight: '1.8',
  hoursAlone: '2-4',
  exercise: 'Two walks a day and the beach on weekends',
  sleeps: 'inside',
  holidays: 'Family dog-sits',
  previousPets: 'A kelpie who lived to 15',
  vet: 'Fremantle Vet',
  anythingElse: '',
  homeCheckConsent: 'on',
  privacyConsent: 'on',
  website: '',
};

describe('buildSchema', () => {
  it('builds an object schema with every field plus the honeypot and form id', () => {
    const def = FORM_DEFINITIONS.volunteer;
    const keys = Object.keys(buildSchema(def).shape);
    for (const field of formFields(def)) expect(keys).toContain(field.name);
    expect(keys).toContain(HONEYPOT_FIELD);
    expect(keys).toContain('_form');
  });
});

describe('parseSubmission', () => {
  it('accepts a valid contact payload and returns the answers only', () => {
    const result = parseSubmission('contact', validContact);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toEqual({
      fullName: 'Jane Citizen',
      email: 'jane@example.com',
      phone: '',
      topic: 'adopting',
      message: 'Is Beau still available?',
      privacyConsent: true,
    });
    expect(result.data).not.toHaveProperty('website');
    expect(result.data).not.toHaveProperty('_form');
  });

  it('accepts a full pre-adoption questionnaire, coercing form-encoded values', () => {
    const result = parseSubmission('preAdoptionDogs', validAdoption);
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.data.homeCheckConsent).toBe(true);
    expect(result.data.privacyConsent).toBe(true);
    expect(result.data.adults).toBe('2');
  });

  it('rejects a bad email address with a friendly message', () => {
    const result = parseSubmission('contact', { ...validContact, email: 'not-an-email' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.email).toBe('Enter an email address like name@example.com');
    expect(Object.keys(result.errors)).toEqual(['email']);
  });

  it('rejects an empty required field with a friendly message', () => {
    const result = parseSubmission('contact', { ...validContact, fullName: '   ', message: '' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.fullName).toBe('Enter your full name');
    expect(result.errors.message).toBe('Enter message');
    expect(result.errors).not.toHaveProperty('email');
  });

  it('requires the consent checkbox to be ticked', () => {
    const result = parseSubmission('contact', { ...validContact, privacyConsent: false });
    expect(result).toEqual({ ok: false, errors: { privacyConsent: 'Tick this box to continue' } });
    const unticked = parseSubmission('contact', { ...validContact, privacyConsent: undefined });
    expect(unticked.ok).toBe(false);
  });

  it('requires a choice from the listed options for selects and radios', () => {
    const missing = parseSubmission('contact', { ...validContact, topic: '' });
    expect(missing).toEqual({ ok: false, errors: { topic: 'Choose an option' } });
    const bogus = parseSubmission('contact', { ...validContact, topic: 'hacking' });
    expect(bogus).toEqual({ ok: false, errors: { topic: 'Choose one of the listed options' } });
  });

  it('normalises checkbox groups from a single string or an array and requires at least one', () => {
    const base = {
      _form: 'volunteer',
      fullName: 'Sam',
      email: 'sam@example.com',
      phone: '08 6336 9410',
      suburb: 'Perth',
      availability: 'weekends',
      skills: '',
      anythingElse: '',
      privacyConsent: 'on',
      website: '',
    };
    const single = parseSubmission('volunteer', { ...base, roles: 'transport' });
    expect(single.ok && single.data.roles).toEqual(['transport']);
    const many = parseSubmission('volunteer', { ...base, roles: ['transport', 'admin'] });
    expect(many.ok && many.data.roles).toEqual(['transport', 'admin']);
    const none = parseSubmission('volunteer', { ...base, roles: undefined });
    expect(none).toEqual({ ok: false, errors: { roles: 'Choose at least one option' } });
    const bogus = parseSubmission('volunteer', { ...base, roles: ['hacking'] });
    expect(bogus.ok).toBe(false);
  });

  it('is loose about phone numbers but wants some digits', () => {
    const ok = parseSubmission('contact', { ...validContact, phone: '(08) 6336 9410' });
    expect(ok.ok).toBe(true);
    const bad = parseSubmission('contact', { ...validContact, phone: 'call me' });
    expect(bad).toEqual({ ok: false, errors: { phone: 'Enter a phone number, including the area code' } });
  });

  it('validates numbers and dates', () => {
    const badNumber = parseSubmission('preAdoptionDogs', { ...validAdoption, adults: '2x' });
    expect(badNumber).toEqual({ ok: false, errors: { adults: 'Enter a whole number' } });
    const foster = {
      ...validAdoption,
      _form: 'fosterDogs',
      startDate: '2026-13-45',
      duration: 'until-adopted',
      term: 'either',
      ownPets: '',
      experience: 'Lots',
      medicalBehaviour: '',
      transport: 'yes',
      bondedPair: 'yes',
      litter: 'maybe',
      medication: 'no',
      fosterInfoRead: 'on',
    };
    const badDate = parseSubmission('fosterDogs', foster);
    expect(badDate).toEqual({ ok: false, errors: { startDate: 'Enter a date' } });
    expect(parseSubmission('fosterDogs', { ...foster, startDate: '2026-10-01' }).ok).toBe(true);
  });

  it('enforces maxLength', () => {
    const result = parseSubmission('contact', { ...validContact, message: 'x'.repeat(4001) });
    expect(result).toEqual({ ok: false, errors: { message: 'Keep this under 4000 characters' } });
  });

  it('detects the honeypot', () => {
    expect(isHoneypotFilled({ website: 'https://spam.example' })).toBe(true);
    expect(isHoneypotFilled({ website: ['', 'x'] })).toBe(true);
    expect(isHoneypotFilled({ website: '' })).toBe(false);
    expect(isHoneypotFilled({})).toBe(false);
    const result = parseSubmission('contact', { ...validContact, website: 'https://spam.example' });
    expect(result).toEqual({ ok: false, errors: { website: 'Leave this field empty' } });
  });

  it('rejects an unknown form id and a mismatched _form field without echoing data', () => {
    expect(parseSubmission('nope', validContact)).toEqual({ ok: false, errors: { _form: 'Unknown form' } });
    const mismatch = parseSubmission('contact', { ...validContact, _form: 'volunteer' });
    expect(mismatch.ok).toBe(false);
    if (mismatch.ok) return;
    expect(mismatch.errors._form).toBe('This form does not match the page it was sent from');
    expect(JSON.stringify(mismatch.errors)).not.toContain('Jane');
  });

  it('strips unknown keys', () => {
    const result = parseSubmission('contact', { ...validContact, __proto__: 'x', admin: true });
    expect(result.ok && Object.keys(result.data)).not.toContain('admin');
  });
});

describe('email formatting', () => {
  it('lists every answer under its section heading using option labels', () => {
    const parsed = parseSubmission('contact', validContact);
    if (!parsed.ok) throw new Error('expected ok');
    const text = formatSubmissionText(FORM_DEFINITIONS.contact, parsed.data, new Date('2026-09-17T00:00:00Z'));
    expect(text).toContain('Contact us');
    expect(text).toContain('YOUR MESSAGE');
    expect(text).toContain('Full name: Jane Citizen');
    expect(text).toContain('Phone: (not answered)');
    expect(text).toContain('What is it about?: Adopting an animal');
    expect(text).toContain('I have read the privacy policy and agree to HAART keeping the details in this form so it can respond to me.: Yes');
    expect(text).not.toContain('](/privacy)');
  });

  it('picks the submitter name and email for the subject and reply-to', () => {
    const parsed = parseSubmission('contact', validContact);
    if (!parsed.ok) throw new Error('expected ok');
    expect(submitterName(FORM_DEFINITIONS.contact, parsed.data)).toBe('Jane Citizen');
    expect(submitterEmail(FORM_DEFINITIONS.contact, parsed.data)).toBe('jane@example.com');
    expect(emailSubject(FORM_DEFINITIONS.contact, parsed.data)).toBe('[haart.org.au] Contact us from Jane Citizen');
    expect(emailSubject(FORM_DEFINITIONS.contact, { ...parsed.data, fullName: 'Evil\r\nBcc: x' })).not.toMatch(/[\r\n]/);
  });
});

describe('prefill', () => {
  it('maps ?animal= to { animal } and nothing else', () => {
    expect(prefillFromSearchParams(new URLSearchParams('animal=beau-hd26-030&foo=bar'))).toEqual({ animal: 'Beau HD26-030' });
    expect(prefillFromSearchParams({ animal: ['nia-hc25-024'] })).toEqual({ animal: 'Nia HC25-024' });
    expect(prefillFromSearchParams({ animal: 'Beau' })).toEqual({ animal: 'Beau' });
    expect(prefillFromSearchParams({})).toEqual({});
    expect(prefillFromSearchParams(undefined)).toEqual({});
  });

  it('cleans control characters and caps length', () => {
    const long = 'a'.repeat(500);
    expect(prefillFromSearchParams({ animal: long }).animal?.length).toBe(120);
    expect(prefillFromSearchParams({ animal: 'x y\n z' })).toEqual({ animal: 'xy z' });
  });

  it('formats slugs the way HAART writes animal names', () => {
    expect(animalFromSlug('beau-hd26-030')).toBe('Beau HD26-030');
    expect(animalFromSlug('artie')).toBe('Artie');
    expect(animalFromSlug('Not A Slug')).toBe('Not A Slug');
  });

  it('reads the no-JavaScript status flags', () => {
    expect(formStatusFromSearchParams({ sent: '1' })).toBe('sent');
    expect(formStatusFromSearchParams(new URLSearchParams('error=1'))).toBe('error');
    expect(formStatusFromSearchParams({})).toBeUndefined();
  });
});
