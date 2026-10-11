import type { Patient } from '../model/patient';
export type PatientActions = {
  preview: (patient: Patient) => void;
  edit: (patient: Patient) => void;
  personalize: (patient: Patient, trigger: HTMLElement) => void;
  download: (patient: Patient, trigger: HTMLElement) => void;
  share: (patient: Patient) => void;
};
