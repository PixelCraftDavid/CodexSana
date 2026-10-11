'use client';
import { CardsLibrary } from '@/features/cards/components/cards-library';
import type { PatientActions } from '@/features/patients/components/patient-actions';
import { PatientFiltersBar } from '@/features/patients/components/patient-filters-bar';
import { PatientsDirectory } from '@/features/patients/components/patients-directory';
import type { Patient } from '@/features/patients/model/patient';
import type { PatientFilters } from '@/features/patients/model/patient-filters';
import { Search } from 'lucide-react';
type Props = {
  patients: Patient[];
  total: number;
  cards?: boolean;
  filters: PatientFilters;
  onFilters: (changes: Partial<PatientFilters>) => void;
  onReset: () => void;
  actions: PatientActions;
};

export function DashboardRecords({ cards = false, ...props }: Props) {
  return (
    <section
      className="directory-workspace view-enter"
      aria-label={cards ? 'Entrega de tarjetas y códigos QR' : 'Directorio de pacientes'}
    >
      <PatientFiltersBar
        filters={props.filters}
        onFilters={props.onFilters}
        onReset={props.onReset}
      />
      <div className="directory-results" role="status">
        <strong>
          {props.patients.length} {props.patients.length === 1 ? 'registro' : 'registros'}
        </strong>
        <span>
          de {props.total} pacientes{cards ? ' · CodexSanaQR' : ''}
        </span>
      </div>
      {props.patients.length > 0 ? (
        cards ? (
          <CardsLibrary patients={props.patients} actions={props.actions} />
        ) : (
          <PatientsDirectory patients={props.patients} actions={props.actions} />
        )
      ) : (
        <div className="directory-empty">
          <Search size={28} />
          <h2>No encontramos pacientes</h2>
          <p>Prueba otro nombre o cambia los filtros.</p>
          <button className="button secondary" onClick={props.onReset}>
            Limpiar filtros
          </button>
        </div>
      )}
      <div className="directory-note">
        {cards
          ? 'Revisa ambos lados antes de imprimir. Puedes elegir una tarjeta con QR o sin QR.'
          : 'Datos reportados por el titular · No sustituye la valoración médica.'}
      </div>
    </section>
  );
}
