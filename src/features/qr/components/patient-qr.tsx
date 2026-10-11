'use client';
import { createPatientQR } from '@/features/cards/model/card-customization';
import { type Patient } from '@/features/patients/model/patient';
import { svgSource } from '@/features/qr/lib/custom-qr';
import { cardUrl } from '@/shared/lib/patient-url';
import { useEffect, useState } from 'react';
export function PatientQR({ patient, size = 35 }: { patient: Patient; size?: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready)
    return (
      <span className="qr-placeholder" style={{ width: size, height: size }} aria-hidden="true" />
    );
  // Keep table previews compact; the full version and quiet zone are exported intact.
  return (
    <img
      className="patient-custom-qr"
      src={svgSource(createPatientQR(patient, cardUrl(patient.id, patient.design)))}
      width={size}
      alt={`Código QR personalizado de ${patient.name}`}
    />
  );
}
