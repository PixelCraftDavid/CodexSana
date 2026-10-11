'use client';

import { patientDesignName } from '@/features/designs/model/patient-designs';
import type { Patient } from '@/features/patients/model/patient';
import { PatientQR } from '@/features/qr/components/patient-qr';
import { ArrowUpRight, Download, Palette, Share2 } from 'lucide-react';
import { Avatar } from '../../../shared/ui/ui';

import type { PatientActions } from '../../patients/components/patient-actions';
export function CardsLibrary({
  patients,
  actions,
}: {
  patients: Patient[];
  actions: PatientActions;
}) {
  return (
    <div className="delivery-library">
      {patients.map((patient) => (
        <article
          className="delivery-card"
          data-design={patient.design ?? 'vitalia'}
          key={patient.id}
        >
          <div className="delivery-card-heading">
            <span>{patientDesignName(patient.design)}</span>
            <small>{patient.cardStyle?.includeQR === false ? 'SIN QR' : 'CON QR'}</small>
          </div>
          <div className="delivery-art">
            {patient.cardStyle?.includeQR === false ? (
              <div className="delivery-offline">
                <span>CodexSanaQR.</span>
                <strong>{patient.name}</strong>
                <small>
                  {patient.age} años · {patient.blood}
                </small>
                <p>Datos y contactos impresos</p>
              </div>
            ) : (
              <PatientQR patient={patient} size={140} />
            )}
          </div>
          <div className="delivery-person">
            <Avatar patient={patient} />
            <div>
              <strong>{patient.name}</strong>
              <small>{patient.id} · Frente y reverso</small>
            </div>
          </div>
          <div className="delivery-actions">
            <button
              className="button secondary"
              onClick={(event) => actions.personalize(patient, event.currentTarget)}
              aria-label={`Personalizar tarjeta de ${patient.name}`}
            >
              <Palette size={15} /> Personalizar
            </button>
            <button
              className="button delivery-download"
              onClick={(event) => actions.download(patient, event.currentTarget)}
              aria-label={`Descargar tarjeta de ${patient.name}`}
            >
              <Download size={15} /> Descargar
            </button>
          </div>
          <div className="delivery-links">
            <button
              onClick={() => actions.share(patient)}
              aria-label={`Compartir ficha de ${patient.name}`}
            >
              <Share2 size={14} /> Compartir
            </button>
            <button
              onClick={() => actions.preview(patient)}
              aria-label={`Ver ficha de emergencia de ${patient.name}`}
            >
              Ver ficha <ArrowUpRight size={14} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
