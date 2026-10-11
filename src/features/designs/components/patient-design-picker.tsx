'use client';

import { createCardFaces } from '@/features/cards/lib/printable-card';
import { isKidsTheme } from '@/features/designs/model/kids-themes';
import {
  patientDesignName,
  patientDesigns,
  type PatientDesign,
} from '@/features/designs/model/patient-designs';
import type { Patient } from '@/features/patients/model/patient';
import { svgSource } from '@/features/qr/lib/custom-qr';
import { Check } from 'lucide-react';
import { useMemo } from 'react';
import { EmergencyCard } from '../../emergency/components/emergency-card';
import { EmergencyConcept } from '../../emergency/components/emergency-concepts';
import { KidsEmergencyCard } from '../../emergency/components/kids-emergency-card';

const example: Patient = {
  id: 'VT-000',
  name: 'Tu nombre',
  age: 9,
  blood: 'A+',
  allergies: 'No reportadas',
  conditions: 'No reportadas',
  medications: 'No reportados',
  color: 'peach',
  updated: '10 oct 2026',
  contacts: [],
};

export function PatientDesignPicker({
  value,
  onChange,
}: {
  value: PatientDesign;
  onChange: (design: PatientDesign) => void;
}) {
  const thumbnails = useMemo(
    () =>
      Object.fromEntries(
        patientDesigns.map((design) => [
          design.id,
          svgSource(createCardFaces(example, '/ficha/muestra', design.id).front),
        ]),
      ),
    [],
  );
  return (
    <fieldset className="patient-design-picker">
      <legend className="sr-only">Diseño de la ficha</legend>
      {(['essential', 'cats', 'companions'] as const).map((group) => (
        <div className={`patient-design-group ${group}`} key={group}>
          <p className="patient-design-group-label">
            {group === 'essential'
              ? 'ESENCIALES'
              : group === 'cats'
                ? 'CLUB DE LAS PATITAS'
                : 'PEQUEÑOS COMPAÑEROS'}
          </p>
          <div className="patient-design-options">
            {patientDesigns
              .filter((design) => design.group === group)
              .map((design) => (
                <label
                  className="patient-design-option"
                  key={design.id}
                  data-selected={value === design.id}
                >
                  <input
                    type="radio"
                    name="design"
                    value={design.id}
                    checked={value === design.id}
                    onChange={() => onChange(design.id)}
                  />
                  <img src={thumbnails[design.id]} alt="" width={860} height={540} />
                  <span className="patient-design-option-name">
                    {design.name}
                    <span className="patient-design-check" aria-hidden="true">
                      {value === design.id && <Check size={11} />}
                    </span>
                  </span>
                  <span className="patient-design-option-detail">{design.detail}</span>
                </label>
              ))}
          </div>
        </div>
      ))}
      <p className="patient-design-selected" role="status">
        <Check size={13} /> {patientDesignName(value)} · ficha y tarjeta personalizadas
      </p>
    </fieldset>
  );
}

export function PatientDesignPreview({
  patient,
  preview = false,
}: {
  patient: Patient;
  preview?: boolean;
}) {
  const design = patient.design ?? 'vitalia';
  if (isKidsTheme(design)) return <KidsEmergencyCard patient={patient} theme={design} preview />;
  if (design === 'anatomico' || design === 'clinico')
    return <EmergencyConcept patient={patient} concept={design} preview />;
  return <EmergencyCard patient={patient} preview={preview} />;
}
