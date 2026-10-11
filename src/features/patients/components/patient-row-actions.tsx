'use client';

import type { Patient } from '@/features/patients/model/patient';
import { ArrowUpRight, Download, MoreHorizontal, Palette, Pencil, Share2 } from 'lucide-react';

import type { PatientActions } from './patient-actions';
export function PatientRowActions({
  patient,
  actions,
}: {
  patient: Patient;
  actions: PatientActions;
}) {
  return (
    <div className="directory-actions">
      <button
        className="directory-view"
        onClick={() => actions.preview(patient)}
        aria-label={`Ver ficha de emergencia de ${patient.name}`}
      >
        Ver ficha <ArrowUpRight size={15} />
      </button>
      <details
        className="patient-actions-disclosure"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.currentTarget.open = false;
            event.currentTarget.querySelector('summary')?.focus();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            event.currentTarget.open = false;
        }}
      >
        <summary aria-label={`Más acciones para ${patient.name}`}>
          <MoreHorizontal size={20} />
        </summary>
        <div
          className="patient-actions-popover"
          onClick={(event) => {
            const details = event.currentTarget.closest('details');
            if (details) details.open = false;
          }}
        >
          <button onClick={() => actions.edit(patient)}>
            <Pencil size={15} /> Editar datos
          </button>
          <button
            onClick={(event) =>
              actions.personalize(
                patient,
                event.currentTarget.closest('details')!.querySelector('summary')!,
              )
            }
          >
            <Palette size={15} /> Personalizar tarjeta
          </button>
          <button
            onClick={(event) =>
              actions.download(
                patient,
                event.currentTarget.closest('details')!.querySelector('summary')!,
              )
            }
          >
            <Download size={15} /> Descargar tarjeta
          </button>
          <button onClick={() => actions.share(patient)}>
            <Share2 size={15} /> Compartir ficha
          </button>
        </div>
      </details>
    </div>
  );
}
