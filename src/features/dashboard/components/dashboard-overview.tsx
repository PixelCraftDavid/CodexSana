'use client';

import { demoRevenue, type AgeGroupId, type Sex } from '@/features/patients/model/demographics';
import type { Patient } from '@/features/patients/model/patient';
import { ArrowRight, ArrowUpRight, CreditCard, Users } from 'lucide-react';
import { Avatar } from '../../../shared/ui/ui';
import { DashboardCharts } from './dashboard-charts';
import { AnatomicalHeart, AnimatedNumber, PulseTrace, RecordSignals } from './medical-motion';

type Props = {
  patients: Patient[];
  motionPaused: boolean;
  onPatients: () => void;
  onCards: () => void;
  onPreview: (patient: Patient) => void;
  onSegment: (segment: 'allergies' | 'conditions') => void;
  onAge: (age: AgeGroupId) => void;
  onSex: (sex: Sex) => void;
};

export function DashboardOverview(props: Props) {
  const { patients, motionPaused, onPatients, onCards, onPreview, onSegment, onAge, onSex } = props;
  return (
    <div className="overview-view view-enter">
      <section className="overview-metrics" aria-label="Indicadores principales">
        <article className="overview-stat">
          <div className="overview-stat-label">
            <CreditCard size={18} /> Ingresos acumulados
          </div>
          <div className="overview-stat-value">
            <AnimatedNumber value={demoRevenue} currency paused={motionPaused} />
            <small>MXN</small>
          </div>
          <p>6 ventas de demostración · sin cobros reales</p>
        </article>
        <article className="overview-stat">
          <div className="overview-stat-label">
            <Users size={18} /> Pacientes activos
          </div>
          <div className="overview-stat-value">
            <AnimatedNumber value={patients.length} paused={motionPaused} />
          </div>
          <button onClick={onPatients}>
            Administrar pacientes <ArrowUpRight size={15} />
          </button>
        </article>
        <div className="overview-anatomy" aria-hidden="true">
          <AnatomicalHeart />
          <div>
            <span>INFORMACIÓN QUE CUIDA</span>
            <strong>
              Cada persona.
              <br />
              Cada detalle.
            </strong>
            <PulseTrace />
          </div>
        </div>
      </section>

      <div className="workspace-section-heading">
        <div>
          <span className="section-overline">01 / TU COMUNIDAD</span>
          <h2>Una mirada a lo esencial</h2>
        </div>
        <span className="section-context">Datos de demostración</span>
      </div>
      <DashboardCharts patients={patients} onAge={onAge} onSex={onSex} />

      <div className="overview-bottom">
        <section className="recent-patients" aria-label="Últimas fichas registradas">
          <div className="workspace-section-heading">
            <div>
              <span className="section-overline">02 / REGISTRO</span>
              <h2>Últimas fichas</h2>
            </div>
            <button className="text-action" onClick={onPatients}>
              Ver pacientes <ArrowRight size={15} />
            </button>
          </div>
          <div className="recent-list">
            {patients
              .slice(-3)
              .reverse()
              .map((patient) => (
                <button
                  className="recent-patient"
                  key={patient.id}
                  onClick={() => onPreview(patient)}
                  aria-label={`Ver ficha de ${patient.name}`}
                >
                  <Avatar patient={patient} />
                  <span>
                    <strong>{patient.name}</strong>
                    <small>
                      {patient.id} · {patient.age} años
                    </small>
                  </span>
                  <span className="recent-blood">{patient.blood}</span>
                  <ArrowUpRight size={17} />
                </button>
              ))}
          </div>
        </section>
        <div className="overview-signals">
          <RecordSignals
            allergies={patients.filter((patient) => patient.allergies !== 'No reportadas').length}
            conditions={patients.filter((patient) => patient.conditions !== 'No reportadas').length}
            onAllergies={() => onSegment('allergies')}
            onConditions={() => onSegment('conditions')}
          />
          <button className="delivery-shortcut" onClick={onCards}>
            <span>
              ¿Lista para entregar?<strong>Prepara su tarjeta y QR</strong>
            </span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
