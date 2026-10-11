import type { Patient } from '../features/patients/model/patient';
export const pediatricPatients: Patient[] = [
  {
    id: 'VT-K01',
    name: 'Leo Mendoza',
    age: 7,
    sex: 'male',
    blood: 'A+',
    allergies: 'Penicilina',
    conditions: 'No reportadas',
    medications: 'No reportados',
    color: 'blue',
    updated: '09 oct 2026',
    contacts: [
      { name: 'Daniela Mendoza', relationship: 'Madre', phone: '+525555010101' },
      { name: 'Javier Mendoza', relationship: 'Padre', phone: '+525555010102' },
    ],
  },
  {
    id: 'VT-K02',
    name: 'Emma Rivera',
    age: 9,
    sex: 'female',
    blood: 'O+',
    allergies: 'Cacahuates',
    conditions: 'Asma',
    medications: 'Salbutamol · según indicación',
    color: 'rose',
    updated: '09 oct 2026',
    contacts: [
      { name: 'Lucía Rivera', relationship: 'Madre', phone: '+525555010103' },
      { name: 'Andrés Rivera', relationship: 'Padre', phone: '+525555010104' },
    ],
  },
];
