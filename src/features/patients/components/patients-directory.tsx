'use client';

import { patientDesignName } from '@/features/designs/model/patient-designs';
import { ageGroupFor, sexLabel } from '@/features/patients/model/demographics';
import type { Patient } from '@/features/patients/model/patient';
import { Avatar } from '../../../shared/ui/ui';

import type { PatientActions } from './patient-actions';
import { PatientRowActions } from './patient-row-actions';
export function PatientsDirectory({
  patients,
  actions,
}: {
  patients: Patient[];
  actions: PatientActions;
}) {
  return (
    <div className="directory-table-wrap">
      <table className="directory-table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Clasificación</th>
            <th>Tarjeta</th>
            <th>
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>
                <div className="directory-person">
                  <Avatar patient={patient} />
                  <div>
                    <strong>{patient.name}</strong>
                    <small>
                      {patient.id} · {patient.age} años
                    </small>
                  </div>
                </div>
              </td>
              <td className="directory-demographics">
                <span>{ageGroupFor(patient.age)?.label}</span>
                <small>{sexLabel(patient)}</small>
              </td>
              <td className="directory-design">
                <span>{patientDesignName(patient.design)}</span>
                <small>{patient.cardStyle?.includeQR === false ? 'Sin QR' : 'Con QR'}</small>
              </td>
              <td>
                <PatientRowActions patient={patient} actions={actions} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
