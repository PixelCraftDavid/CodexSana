import type { CardCustomization } from '@/features/cards/model/card-customization';
import type { PatientDesign } from '@/features/designs/model/patient-designs';
import type { Sex } from '../model/demographics';
import type { Patient } from '../model/patient';

type FormContext = {
  id: string;
  design: PatientDesign;
  cardStyle: CardCustomization;
  photo: string;
  color: string;
  contactCount: number;
};

/** Native validation runs on submit; personalization may use an incomplete draft. */
export function readPatientForm(form: HTMLFormElement, context: FormContext): Patient {
  const data = new FormData(form);
  const text = (name: string) => String(data.get(name) || '').trim();
  return {
    id: context.id,
    design: context.design,
    cardStyle: context.cardStyle,
    photo: context.photo,
    color: context.color,
    name: text('name'),
    age: Number(text('age')),
    sex: (text('sex') || 'unknown') as Sex,
    blood: text('blood'),
    allergies: text('allergies') || 'No reportadas',
    conditions: text('conditions') || 'No reportadas',
    medications: text('medications') || 'No reportados',
    updated: new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date()),
    contacts: Array.from({ length: context.contactCount }, (_, index) => ({
      name: text(`contact-name-${index}`),
      relationship: text(`contact-relation-${index}`),
      phone: text(`contact-phone-${index}`),
    })).filter((contact) => contact.name || contact.phone),
  };
}
