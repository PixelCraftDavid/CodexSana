import type { Patient } from './patient';

export const ageGroups = [
  { id: 'children', label: 'Niños', range: '0–11 años', min: 0, max: 11, color: '#bacfa5' },
  { id: 'teens', label: 'Adolescentes', range: '12–17 años', min: 12, max: 17, color: '#88ac8c' },
  { id: 'young', label: 'Jóvenes', range: '18–29 años', min: 18, max: 29, color: '#dba68b' },
  { id: 'adults', label: 'Adultos', range: '30–59 años', min: 30, max: 59, color: '#4c7861' },
  {
    id: 'older',
    label: 'Adultos mayores',
    range: '60+ años',
    min: 60,
    max: Infinity,
    color: '#b1a080',
  },
] as const;
export type AgeGroupId = (typeof ageGroups)[number]['id'];
export const sexGroups = [
  { id: 'female', label: 'Femenino', color: '#dca58d' },
  { id: 'male', label: 'Masculino', color: '#648c77' },
  { id: 'intersex', label: 'Intersexual', color: '#b1ae8b' },
  { id: 'unknown', label: 'No registrado', color: '#dbe2d4' },
] as const;
export type Sex = (typeof sexGroups)[number]['id'];
export function ageGroupFor(age: number) {
  return ageGroups.find((group) => age >= group.min && age <= group.max);
}
export function sexFor(patient: Patient): Sex {
  return patient.sex ?? 'unknown';
}
export function sexLabel(patient: Patient) {
  return sexGroups.find((group) => group.id === sexFor(patient))!.label;
}
export function demographicCounts(patients: Patient[]) {
  return {
    ages: ageGroups.map((group) => ({
      ...group,
      count: patients.filter((patient) => ageGroupFor(patient.age)?.id === group.id).length,
    })),
    sexes: sexGroups.map((group) => ({
      ...group,
      count: patients.filter((patient) => sexFor(patient) === group.id).length,
    })),
  };
}

// Fictional transactions for the local design demo, distinct from patient registration.
export const demoSales = [
  { day: '04 oct', amount: 299 },
  { day: '05 oct', amount: 598 },
  { day: '06 oct', amount: 0 },
  { day: '07 oct', amount: 299 },
  { day: '08 oct', amount: 299 },
  { day: '09 oct', amount: 299 },
];
export const demoRevenue = demoSales.reduce((sum, sale) => sum + sale.amount, 0);
