import type { KidsTheme } from './kids-themes';
export type PatientDesign = 'vitalia' | 'anatomico' | 'clinico' | KidsTheme;

export const patientDesigns = [
  { id: 'vitalia', name: 'CodexSana', detail: 'Natural y sereno', group: 'essential' },
  { id: 'anatomico', name: 'Anatomical', detail: 'Oscuro y editorial', group: 'essential' },
  { id: 'clinico', name: 'Clínico', detail: 'Limpio y azul', group: 'essential' },
  { id: 'michi-sol', name: 'Miso', detail: 'Sol, abrazos y gafas', group: 'cats' },
  { id: 'michi-luna', name: 'Mochi', detail: 'Ideas, libros y ternura', group: 'cats' },
  { id: 'nutria-perla', name: 'Nori', detail: 'Nutria bebé · perla y laguna', group: 'companions' },
  {
    id: 'capibara-salvia',
    name: 'Dr. Capi',
    detail: 'Capibara · azul y albaricoque',
    group: 'companions',
  },
] as const;

export function patientDesignName(design: PatientDesign = 'vitalia') {
  return patientDesigns.find((item) => item.id === design)?.name ?? 'CodexSana';
}
