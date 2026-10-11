import { ageGroupFor, sexFor, type AgeGroupId, type Sex } from './demographics';
import type { Patient } from './patient';

export type PatientFilters = {
  search: string;
  segment: 'all' | 'allergies' | 'conditions';
  age: AgeGroupId | 'all';
  sex: Sex | 'all';
  ascending: boolean;
};

export const emptyPatientFilters: PatientFilters = {
  search: '',
  segment: 'all',
  age: 'all',
  sex: 'all',
  ascending: false,
};

export function filterPatients(patients: Patient[], filters: PatientFilters) {
  const query = filters.search.trim().toLocaleLowerCase('es');
  const result = patients.filter((patient) => {
    const matchesSearch = `${patient.name} ${patient.id}`.toLocaleLowerCase('es').includes(query);
    const matchesSegment =
      filters.segment === 'all' ||
      (filters.segment === 'allergies'
        ? patient.allergies !== 'No reportadas'
        : patient.conditions !== 'No reportadas');
    const matchesAge = filters.age === 'all' || ageGroupFor(patient.age)?.id === filters.age;
    const matchesSex = filters.sex === 'all' || sexFor(patient) === filters.sex;
    return matchesSearch && matchesSegment && matchesAge && matchesSex;
  });
  return filters.ascending ? result.sort((a, b) => a.name.localeCompare(b.name, 'es')) : result;
}
