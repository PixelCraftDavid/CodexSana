'use client';
import { type Patient } from '@/features/patients/model/patient';
import { initials } from '@/shared/lib/patient-url';
import { Plus } from 'lucide-react';

export function Brand({ light = false, card = false }: { light?: boolean; card?: boolean }) {
  return (
    <span className={`brand ${light ? 'brand-light' : ''} ${card ? 'brand-card' : ''}`}>
      <span className="brand-mark">
        <Plus size={23} strokeWidth={3} />
      </span>
      {card ? 'CodexSanaQR' : 'CodexSana'}
      <span className="brand-dot">.</span>
    </span>
  );
}
export function Avatar({ patient, large = false }: { patient: Patient; large?: boolean }) {
  return (
    <span className={`avatar ${patient.color} ${large ? 'avatar-large' : ''}`}>
      {patient.photo ? <img src={patient.photo} alt={patient.name} /> : initials(patient.name)}
    </span>
  );
}
export function SectionTitle({
  number,
  title,
  detail,
}: {
  number: string;
  title: string;
  detail?: string;
}) {
  return (
    <div className="section-title">
      <span>{number}</span>
      <div>
        <h3>{title}</h3>
        {detail && <p>{detail}</p>}
      </div>
    </div>
  );
}
