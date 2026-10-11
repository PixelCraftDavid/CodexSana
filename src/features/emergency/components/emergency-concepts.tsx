'use client';

import type { Patient } from '@/features/patients/model/patient';
import {
  ArrowDown,
  ArrowUpRight,
  Droplet,
  Pause,
  Phone,
  Play,
  Plus,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { useState } from 'react';
import { BodyMap, CirculationArt } from '../../designs/components/anatomical-art';
import { ShareEmergency } from './share-emergency';

export type Concept = 'anatomico' | 'clinico';
export function conceptURL(patientId: string, concept: Concept) {
  return `/ficha/${encodeURIComponent(patientId)}/${concept}`;
}

export function MedicalSkeleton({ concept = 'anatomico' }: { concept?: Concept }) {
  return (
    <div
      className={`medical-skeleton ${concept}`}
      role="status"
      aria-label="Cargando ficha de emergencia"
    >
      <span className="skeleton-description">Preparando información esencial…</span>
      <div className="sk-header sk-block" />
      <div className="sk-top">
        <div className="sk-blood sk-block" />
        <div className="sk-anatomy sk-block" />
      </div>
      <div className="sk-allergy sk-block" />
      <div className="sk-name sk-block" />
      <div className="sk-meta sk-block" />
      <div className="sk-call sk-block" />
      <div className="sk-detail sk-block" />
      {concept === 'clinico' && <span className="medical-scanline" />}
    </div>
  );
}

export function EmergencyConcept({
  patient,
  concept,
  loading = false,
  preview = false,
}: {
  patient: Patient;
  concept: Concept;
  loading?: boolean;
  preview?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const primary = patient.contacts[0];
  const chest = patient.conditions === 'Asma'; // Explicit demo annotation, never a diagnostic map.
  const url = conceptURL(patient.id, concept);
  return (
    <article
      className={`design-card ${concept} ${preview ? 'concept-preview' : ''}`}
      data-loading={loading}
      data-paused={paused}
      aria-busy={loading}
    >
      {loading && <MedicalSkeleton concept={concept} />}
      <div className="concept-data" aria-hidden={loading || undefined} inert={loading || undefined}>
        <header className="design-header">
          <span className="design-brand">
            <Plus size={20} strokeWidth={3} /> CodexSanaQR<span>.</span>
          </span>
          <span className="design-document">EMERGENCIA / {patient.id}</span>
          <ShareEmergency url={url} title={`Ficha de emergencia · ${patient.name}`} compact />
        </header>
        <div className="design-topline">
          <span>
            <i /> INFORMACIÓN ESENCIAL
          </span>
          <span>DATOS FICTICIOS</span>
        </div>
        <section className="design-critical" aria-label="Información prioritaria">
          <div className="design-blood">
            <span>
              <Droplet size={14} /> TIPO DE SANGRE
            </span>
            <strong
              className={
                patient.blood === 'Desconocido'
                  ? 'unknown-blood'
                  : patient.blood.length > 2
                    ? 'wide-blood'
                    : ''
              }
            >
              {patient.blood}
            </strong>
            <small>Reportado por el titular</small>
          </div>
          <div className="design-anatomy">
            {concept === 'anatomico' ? (
              <BodyMap chest={chest} paused={paused} />
            ) : (
              <CirculationArt paused={paused} />
            )}
            <button
              className="art-toggle"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? 'Activar ilustración anatómica' : 'Pausar ilustración anatómica'}
            >
              {paused ? <Play size={12} /> : <Pause size={12} />}
            </button>
            <span>
              {concept === 'anatomico' && chest
                ? 'ASMA REPORTADA / ESQUEMA ILUSTRATIVO'
                : 'ANATOMÍA / ILUSTRACIÓN DECORATIVA'}
            </span>
          </div>
          <div
            className={`design-allergies ${patient.allergies === 'No reportadas' ? 'no-allergies' : ''}`}
          >
            <span>
              <TriangleAlert size={16} /> ALERGIAS REPORTADAS
            </span>
            <strong>{patient.allergies}</strong>
            <small>
              {patient.allergies === 'No reportadas'
                ? 'Sin alergias registradas en esta ficha.'
                : 'Información prioritaria para quien ayuda.'}
            </small>
          </div>
        </section>
        <section className="design-identity">
          <div className="design-identity-meta">
            <span>01 / LA PERSONA</span>
            <span>{patient.age} AÑOS</span>
          </div>
          <h1>{patient.name}</h1>
          <p>
            <ShieldCheck size={14} /> Datos reportados por el titular
          </p>
        </section>
        <section className="design-contacts" aria-label="Contactos de emergencia">
          <div className="design-section-label">
            <span>02 / A QUIÉN LLAMAR</span>
            <ArrowDown size={14} />
          </div>
          {patient.contacts.map((contact, index) => (
            <a
              key={`${contact.phone}-${index}`}
              className={`command-call ${index === 0 ? 'primary-command' : ''}`}
              href={`tel:${contact.phone}`}
              aria-label={`Llamar a ${contact.name}`}
            >
              <span className="call-command-icon">
                <Phone size={22} />
              </span>
              <span className="call-command-content">
                <small>
                  {contact.relationship} ·{' '}
                  {index === 0 ? 'contacto principal' : 'contacto adicional'}
                </small>
                <strong>{contact.name}</strong>
                <span>{contact.phone}</span>
              </span>
              <span className="call-command-action">
                Llamar
                <ArrowUpRight size={19} />
              </span>
            </a>
          ))}
        </section>
        <section className="design-records" aria-label="Información médica registrada">
          <div>
            <span>03 / PADECIMIENTOS</span>
            <p className="lab-tag">{patient.conditions}</p>
          </div>
          <div>
            <span>04 / MEDICAMENTOS</span>
            <p>{patient.medications}</p>
          </div>
        </section>
        <footer className="design-footer">
          <span>ACTUALIZADA / {patient.updated}</span>
          <p>Datos reportados por el titular. No sustituye la valoración médica.</p>
          <ShareEmergency url={url} title={`Ficha de emergencia · ${patient.name}`} />
          <span className="design-footer-mark">Información que cuida.</span>
        </footer>
      </div>
      {!preview && !loading && primary && (
        <div className="quick-call-dock">
          <a
            href={`tel:${primary.phone}`}
            aria-label={`Llamar al contacto principal ${primary.name}`}
          >
            <Phone size={20} />
            <span>Llamar a {primary.name}</span>
            <ArrowUpRight size={20} />
          </a>
        </div>
      )}
    </article>
  );
}
