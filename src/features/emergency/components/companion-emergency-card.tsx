'use client';

import { CompanionCharacter, CompanionSymbol } from '../../designs/components/companion-art';
import { kidsCardURL, kidsThemes, type CompanionTheme } from '../../designs/model/kids-themes';
import type { Patient } from '../../patients/model/patient';
import {
  ArrowUpRight,
  Droplet,
  Heart,
  Pause,
  Phone,
  Pill,
  Play,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { ShareEmergency } from './share-emergency';

export function CompanionEmergencyCard({
  patient,
  theme,
  preview,
  loading,
  paused,
  onToggle,
}: {
  patient: Patient;
  theme: CompanionTheme;
  preview: boolean;
  loading: boolean;
  paused: boolean;
  onToggle: () => void;
}) {
  const otter = theme === 'nutria-perla';
  const url = kidsCardURL(patient.id, theme);
  const primary = patient.contacts[0];
  const contactLabel = (relationship: string) =>
    relationship === 'Madre'
      ? 'mamá'
      : relationship === 'Padre'
        ? 'papá'
        : relationship.toLowerCase();
  return (
    <article
      className={`companion-record ${theme} ${preview ? 'companion-preview' : ''}`}
      data-paused={paused}
      data-loading={loading}
      aria-busy={loading}
    >
      {loading && (
        <div className="companion-skeleton" role="status" aria-label="Cargando ficha infantil">
          <span className="sr-only">Preparando la información de emergencia…</span>
          <i className="cs-header" />
          <i className="cs-critical" />
          <i className="cs-identity" />
          <i className="cs-contact" />
          <i className="cs-contact" />
          <span>
            <CompanionSymbol theme={theme} />
          </span>
        </div>
      )}
      <div
        className="companion-record-data"
        aria-hidden={loading || undefined}
        inert={loading || undefined}
      >
        <header className="companion-record-header">
          <div>
            <strong>
              CodexSanaQR<span>.</span>
            </strong>
            <small>FICHA DE EMERGENCIA · {patient.id}</small>
          </div>
          <ShareEmergency url={url} title={`Ficha de emergencia · ${patient.name}`} compact />
        </header>
        <div className="companion-priority-label">
          <ShieldCheck size={13} />
          <span>LO PRIMERO PARA AYUDAR</span>
        </div>
        <section className="companion-priority" aria-label="Información prioritaria">
          <div className="companion-blood">
            <span>
              <Droplet size={13} /> Sangre
            </span>
            <strong data-long={patient.blood.length > 4} data-wide={patient.blood.length === 3}>
              {patient.blood}
            </strong>
            <small>Dato reportado</small>
          </div>
          <div className="companion-allergy" data-alert={patient.allergies !== 'No reportadas'}>
            <span>
              <TriangleAlert size={14} /> Alergias reportadas
            </span>
            <strong>{patient.allergies || 'No reportadas'}</strong>
            <small>Por el titular o su representante</small>
          </div>
        </section>
        <section className="companion-identity" aria-label="Identidad del paciente">
          <div className="companion-identity-art">
            <CompanionCharacter theme={theme} />
            <span className="companion-tiny-star">✧</span>
          </div>
          <div className="companion-identity-name">
            <span>{otter ? 'UN PEQUEÑO TESORO' : 'MI PEQUEÑO EXPEDIENTE'}</span>
            <h1>{patient.name}</h1>
            <p>
              {patient.age} años <span>·</span> {patient.id}
            </p>
            <small>{kidsThemes[theme].name} me acompaña.</small>
          </div>
          <button
            className="companion-motion"
            onClick={onToggle}
            aria-label={
              paused ? 'Activar animación del personaje' : 'Pausar animación del personaje'
            }
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
          {otter && (
            <svg
              className="companion-wave-border"
              viewBox="0 0 400 30"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M0 16Q50-5 100 16T200 16T300 16T400 16V30H0Z" fill="currentColor" />
            </svg>
          )}
        </section>
        <section className="companion-family" aria-label="Contactos de emergencia">
          <div className="companion-section-title">
            <CompanionSymbol theme={theme} />
            <div>
              <h2>{otter ? 'Mis personas favoritas.' : 'Mi equipo de cuidado.'}</h2>
              <p>Mi familia, a una llamada.</p>
            </div>
          </div>
          {patient.contacts.length === 0 && (
            <p className="companion-no-contact">No hay contactos reportados.</p>
          )}
          {patient.contacts.map((contact, index) => (
            <a
              className="companion-call"
              data-primary={index === 0}
              key={`${contact.phone}-${index}`}
              href={`tel:${contact.phone}`}
              aria-label={`Llamar a ${contact.name}`}
            >
              <span className="companion-call-icon">
                <Phone size={21} />
              </span>
              <span className="companion-call-copy">
                <strong>Llamar a {contactLabel(contact.relationship)}</strong>
                <span>{contact.name}</span>
                <small>{contact.phone}</small>
              </span>
              <ArrowUpRight size={20} />
            </a>
          ))}
        </section>
        <section className="companion-details" aria-label="Información médica registrada">
          <div>
            <Heart size={17} />
            <span>
              <h3>Padecimientos</h3>
              <p>{patient.conditions || 'No reportados'}</p>
            </span>
          </div>
          <div>
            <Pill size={17} />
            <span>
              <h3>Medicamentos</h3>
              <p>{patient.medications || 'No reportados'}</p>
            </span>
          </div>
        </section>
        <footer className="companion-record-footer">
          <span>Actualizada el {patient.updated}</span>
          <p>
            Datos reportados por el titular o su representante. No sustituye la valoración médica.
          </p>
          <ShareEmergency url={url} title={`Ficha de emergencia · ${patient.name}`} />
          <small>
            {otter
              ? 'Un río de abrazos. Un mundo de cuidados.'
              : 'Pequeños compañeros. Grandes cuidados.'}
          </small>
        </footer>
      </div>
      {!preview && !loading && primary && (
        <div className="companion-call-dock">
          <a
            href={`tel:${primary.phone}`}
            aria-label={`Llamar al contacto principal ${primary.name}`}
          >
            <Phone size={19} />
            <span>Llamar a {contactLabel(primary.relationship)}</span>
            <ArrowUpRight size={19} />
          </a>
          <small>{primary.name} · contacto principal</small>
        </div>
      )}
    </article>
  );
}
