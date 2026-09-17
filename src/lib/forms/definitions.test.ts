import { describe, expect, it } from 'vitest';
import { FORM_IDS } from '@/lib/content/types';
import { FORM_DEFINITIONS, RESERVED_FIELD_NAMES, formFields, getFormDefinition, isFormId } from './definitions';
import { labelLinks, labelParts, plainLabel } from './label';

const all = FORM_IDS.map((id) => FORM_DEFINITIONS[id]);

describe('form definitions', () => {
  it('exist for every FormId with a matching id, title, success message and at least one section', () => {
    for (const id of FORM_IDS) {
      const def = FORM_DEFINITIONS[id];
      expect(def, id).toBeDefined();
      expect(def.id).toBe(id);
      expect(def.title.length).toBeGreaterThan(0);
      expect(def.successMessage.length).toBeGreaterThan(0);
      expect(def.sections.length).toBeGreaterThan(0);
      for (const section of def.sections) expect(section.fields.length, `${id}: ${section.heading}`).toBeGreaterThan(0);
    }
    expect(isFormId('contact')).toBe(true);
    expect(isFormId('nope')).toBe(false);
    expect(getFormDefinition('volunteer').id).toBe('volunteer');
  });

  it('have unique field names within each form', () => {
    for (const def of all) {
      const names = formFields(def).map((f) => f.name);
      expect(new Set(names).size, `${def.id}: ${names.join(', ')}`).toBe(names.length);
    }
  });

  it('never use a reserved name (honeypot, form id, redirect)', () => {
    for (const def of all) {
      for (const field of formFields(def)) {
        expect(RESERVED_FIELD_NAMES as readonly string[], `${def.id}.${field.name}`).not.toContain(field.name);
      }
    }
  });

  it('end with a required privacy consent checkbox that links to /privacy', () => {
    for (const def of all) {
      const fields = formFields(def);
      const last = fields[fields.length - 1];
      expect(last.name, def.id).toBe('privacyConsent');
      expect(last.type, def.id).toBe('checkbox');
      expect(last.required, def.id).toBe(true);
      expect(labelLinks(last.label), def.id).toContain('/privacy');
    }
  });

  it('include the home-check consent on adoption and foster forms only', () => {
    for (const def of all) {
      const consent = formFields(def).find((f) => f.name === 'homeCheckConsent');
      if (['preAdoptionDogs', 'preAdoptionCats', 'fosterDogs', 'fosterCats'].includes(def.id)) {
        expect(consent, def.id).toBeDefined();
        expect(consent?.type).toBe('checkbox');
        expect(consent?.required).toBe(true);
        expect(consent?.label).toBe('I understand a home or yard check is part of the process');
      } else {
        expect(consent, def.id).toBeUndefined();
      }
    }
  });

  it('ask foster applicants to confirm they have read the foster information at /foster', () => {
    for (const id of ['fosterDogs', 'fosterCats'] as const) {
      const field = formFields(FORM_DEFINITIONS[id]).find((f) => f.name === 'fosterInfoRead');
      expect(field?.required, id).toBe(true);
      expect(labelLinks(field?.label ?? ''), id).toContain('/foster');
    }
  });

  it('give the adoption and foster forms a pre-fillable animal field', () => {
    for (const id of ['preAdoptionDogs', 'preAdoptionCats'] as const) {
      const field = formFields(FORM_DEFINITIONS[id]).find((f) => f.name === 'animal');
      expect(field?.type, id).toBe('text');
    }
  });

  it('give choice fields at least two options and other fields none', () => {
    for (const def of all) {
      for (const field of formFields(def)) {
        const label = `${def.id}.${field.name}`;
        if (['select', 'radio', 'checkboxes'].includes(field.type)) {
          expect(field.options?.length ?? 0, label).toBeGreaterThanOrEqual(2);
          const values = field.options!.map((o) => o.value);
          expect(new Set(values).size, label).toBe(values.length);
          for (const o of field.options!) expect(o.value, label).not.toBe('');
        } else {
          expect(field.options, label).toBeUndefined();
        }
      }
    }
  });

  it('carry the right conversion event', () => {
    expect(FORM_DEFINITIONS.preAdoptionDogs.conversionEvent).toBe('adoption_enquiry');
    expect(FORM_DEFINITIONS.preAdoptionCats.conversionEvent).toBe('adoption_enquiry');
    expect(FORM_DEFINITIONS.fosterDogs.conversionEvent).toBe('foster_application');
    expect(FORM_DEFINITIONS.fosterCats.conversionEvent).toBe('foster_application');
    expect(FORM_DEFINITIONS.volunteer.conversionEvent).toBe('volunteer_signup');
    expect(FORM_DEFINITIONS.contact.conversionEvent).toBeUndefined();
    expect(FORM_DEFINITIONS.partnership.conversionEvent).toBeUndefined();
  });

  it('use sentence case labels (no Title Case, no shouting)', () => {
    for (const def of all) {
      for (const field of formFields(def)) {
        const text = plainLabel(field.label);
        expect(text, `${def.id}.${field.name}`).not.toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+( [A-Z][a-z]+)*$/);
        expect(text.replace(/HAART|ID/g, ''), `${def.id}.${field.name}`).not.toMatch(/[A-Z]{4,}/);
      }
    }
  });
});

describe('label links', () => {
  it('split a label into text and link parts', () => {
    expect(labelParts('I have read the [privacy policy](/privacy) and agree.')).toEqual([
      { text: 'I have read the ' },
      { text: 'privacy policy', href: '/privacy' },
      { text: ' and agree.' },
    ]);
    expect(labelParts('Plain label')).toEqual([{ text: 'Plain label' }]);
  });

  it('flatten to plain text', () => {
    expect(plainLabel('I have read the [foster carer information](/foster)')).toBe('I have read the foster carer information');
  });
});
