import type { PatientDesign } from '../../features/designs/model/patient-designs';
export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase();
}
export function cardUrl(id: string, design: PatientDesign = 'vitalia') {
  return `${typeof window !== 'undefined' ? window.location.origin : ''}/ficha/${encodeURIComponent(id)}${design === 'vitalia' ? '' : `/${design}`}`;
}
