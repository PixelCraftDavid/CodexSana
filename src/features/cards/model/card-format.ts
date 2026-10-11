import type { Patient } from '../../patients/model/patient';

export type CardPrintPreferences = { includeQR?: boolean };

/** Older profiles retain the original QR-enabled format. */
export function cardHasQR(patient: Patient, options?: CardPrintPreferences) {
  return options?.includeQR ?? patient.cardStyle?.includeQR ?? true;
}
