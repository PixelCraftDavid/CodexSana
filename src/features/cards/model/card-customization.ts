import { isKidsTheme } from '../../designs/model/kids-themes';
import type { PatientDesign } from '../../designs/model/patient-designs';
import type { Patient } from '../../patients/model/patient';
import { createPersonalizedQR, type QRInk, type QRModules } from '../../qr/lib/custom-qr';
import { createKidsQR } from '../../qr/lib/kids-qr';
import type { QRPresentation } from '../../qr/lib/qr-frames';
import type { CardPrintPreferences } from './card-format';

export type CardCustomization = QRPresentation &
  CardPrintPreferences & {
    modules: QRModules;
    ink: QRInk | 'signature';
    badge: 'character' | 'symbol';
    includeName: boolean;
    frame: boolean;
  };
export const defaultCardCustomization: CardCustomization = {
  modules: 'dots',
  ink: 'signature',
  badge: 'character',
  includeName: true,
  frame: true,
  finder: 'rounded',
  eyeInk: 'same',
  frameStyle: 'label',
  includeQR: true,
};

export function cardOptions(patient: Patient): CardCustomization {
  const style = { ...defaultCardCustomization, ...patient.cardStyle };
  if (isKidsTheme(patient.design ?? 'vitalia'))
    return { ...style, ink: style.ink === 'graphite' ? 'graphite' : 'signature' };
  if (style.ink !== 'signature') return style;
  return {
    ...style,
    ink:
      patient.design === 'clinico'
        ? 'plasma'
        : patient.design === 'anatomico'
          ? 'graphite'
          : 'surgical',
  };
}

export function createPatientQR(patient: Patient, url: string) {
  const design: PatientDesign = patient.design ?? 'vitalia';
  const style = cardOptions(patient);
  if (isKidsTheme(design))
    return createKidsQR(url, design, patient.name, {
      ...style,
      ink: style.ink === 'graphite' ? 'graphite' : 'signature',
    });
  return createPersonalizedQR(url, {
    ...style,
    theme: design,
    ink: style.ink === 'signature' ? 'graphite' : style.ink,
  });
}
