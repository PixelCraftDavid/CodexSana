'use client';

import {
  isCompanionTheme,
  kidsCardURL,
  type KidsTheme,
} from '@/features/designs/model/kids-themes';
import type { Patient } from '@/features/patients/model/patient';
import {
  ArrowUpRight,
  Droplet,
  Heart,
  Pause,
  Phone,
  Pill,
  Play,
  Plus,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { useState } from 'react';
import { CatGlasses, KidsCharacter, PawPrint } from '../../designs/components/kids-art';
import { ShareEmergency } from './share-emergency';
import { CompanionEmergencyCard } from './companion-emergency-card';
import { CompanionSymbol } from '../../designs/components/companion-art';

export function KidsSkeleton({ theme }: { theme: KidsTheme }) {
  return (
    <div className={`kids-skeleton ${theme}`} role="status" aria-label="Cargando ficha infantil">
      <span className="sr-only">Preparando la información de emergencia…</span>
      <div className="kids-sk-line" />
      <div className="kids-sk-priority">
        <i />
        <i />
      </div>
      <div className="kids-sk-hero" />
      <div className="kids-sk-line short" />
      <div className="kids-sk-call" />
      <div className="kids-sk-call" />
      <span className="kids-sk-companion">
        {isCompanionTheme(theme) ? (
          <CompanionSymbol theme={theme} />
        ) : theme === 'michi-sol' ? (
          <PawPrint />
        ) : (
          <CatGlasses />
        )}
      </span>
    </div>
  );
}

export function KidsEmergencyCard({
  patient,
  theme,
  preview = false,
  loading = false,
  motionPaused,
  onMotionChange,
}: {
  patient: Patient;
  theme: KidsTheme;
  preview?: boolean;
  loading?: boolean;
  motionPaused?: boolean;
  onMotionChange?: (paused: boolean) => void;
}) {
  const [localPaused, setLocalPaused] = useState(false);
  const paused = motionPaused ?? localPaused;
  const sunny = theme === 'michi-sol';
  const primary = patient.contacts[0];
  const url = kidsCardURL(patient.id, theme);
  const parentTitle = (relationship: string) =>
    relationship === 'Madre'
      ? 'mamá'
      : relationship === 'Padre'
        ? 'papá'
        : relationship.toLowerCase();
  function toggle() {
    if (onMotionChange) onMotionChange(!paused);
    else setLocalPaused(!paused);
  }
  if (isCompanionTheme(theme))
    return (
      <CompanionEmergencyCard
        patient={patient}
        theme={theme}
        preview={preview}
        loading={loading}
        paused={paused}
        onToggle={toggle}
      />
    );
  return (
    <article
      className={`kids-card ${theme} ${preview ? 'kids-card-preview' : ''}`}
      data-paused={paused}
      data-loading={loading}
      aria-busy={loading}
    >
      {loading && <KidsSkeleton theme={theme} />}
      <div
        className="kids-card-data"
        aria-hidden={loading || undefined}
        inert={loading || undefined}
      >
        <header className="kids-card-header">
          <span className="kids-wordmark">
            <Plus size={19} strokeWidth={3} /> CodexSanaQR<span>.</span>
          </span>
          <span className="kids-id">
            {patient.id}
            <small>FICHA INFANTIL</small>
          </span>
          <ShareEmergency url={url} title={`Ficha de emergencia · ${patient.name}`} compact />
        </header>
        <div className="kids-essential-label">
          <ShieldCheck size={13} />
          <span>LO IMPORTANTE PARA AYUDAR</span>
          <i />
        </div>
        <section className="kids-critical" aria-label="Información prioritaria">
          <div className="kids-blood">
            <span>
              <Droplet size={13} /> Sangre
            </span>
            <strong>{patient.blood}</strong>
            <small>Dato reportado</small>
          </div>
          <div
            className={`kids-allergy ${patient.allergies === 'No reportadas' ? 'no-allergy' : ''}`}
          >
            <span>
              <TriangleAlert size={14} /> Alergias
            </span>
            <strong>{patient.allergies}</strong>
            <small>Reportadas por la familia</small>
          </div>
        </section>
        <section className="kids-identity">
          <div className="kids-name">
            <span>HOLA, SOY</span>
            <h1>{patient.name}</h1>
            <p>
              <span>{patient.age} años</span>
              <i /> Datos ficticios
            </p>
          </div>
          <div className="kids-card-character">
            <KidsCharacter theme={theme} />
            <span className="kids-character-star star-one">✦</span>
            <span className="kids-character-star star-two">✧</span>
          </div>
          <button
            className="kids-character-toggle"
            onClick={toggle}
            aria-label={
              paused ? 'Activar animación del personaje' : 'Pausar animación del personaje'
            }
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
          <div className="kids-scene-ground" />
          <span className="cat-card-caption">
            {sunny ? 'Miso te acompaña' : 'Mochi te acompaña'}
          </span>
        </section>
        <section className="kids-family" aria-label="Contactos de emergencia">
          <div className="kids-section-heading">
            <span>{sunny ? <PawPrint /> : <CatGlasses />}</span>
            <div>
              <h2>Mi familia está aquí.</h2>
              <p>Una llamada para acompañarme.</p>
            </div>
          </div>
          {patient.contacts.map((contact, index) => (
            <a
              className={`kids-parent-call ${index === 0 ? 'kids-parent-primary' : ''}`}
              key={contact.phone}
              href={`tel:${contact.phone}`}
              aria-label={`Llamar a ${contact.name}`}
            >
              <span className="kids-phone-icon">
                <Phone size={20} />
              </span>
              <span className="kids-parent-details">
                <strong>Llamar a {parentTitle(contact.relationship)}</strong>
                <span>{contact.name}</span>
                <small>{contact.phone}</small>
              </span>
              <ArrowUpRight size={20} />
            </a>
          ))}
          <p className="kids-guardian-note">
            <ShieldCheck size={13} /> Contactos reportados por el titular o su representante.
          </p>
        </section>
        <section className="kids-medical-details" aria-label="Información médica registrada">
          <div>
            <Heart size={18} />
            <span>
              <h3>Padecimientos</h3>
              <p>{patient.conditions}</p>
            </span>
          </div>
          <div>
            <Pill size={18} />
            <span>
              <h3>Medicamentos</h3>
              <p>{patient.medications}</p>
            </span>
          </div>
        </section>
        <footer className="kids-card-footer">
          <span>Actualizada el {patient.updated}</span>
          <p>
            Datos reportados por el titular o su representante. No sustituye la valoración médica.
          </p>
          <ShareEmergency url={url} title={`Ficha de emergencia · ${patient.name}`} />
          <div>
            {sunny ? <PawPrint /> : <CatGlasses />}
            <strong>
              {sunny ? 'Patitas cerca. Familia más cerca.' : 'Pequeñas ideas, grandes cuidados.'}
            </strong>
          </div>
        </footer>
      </div>
      {!preview && primary && !loading && (
        <div className="kids-call-dock">
          <a
            href={`tel:${primary.phone}`}
            aria-label={`Llamar al contacto principal ${primary.name}`}
          >
            <Phone size={20} />
            <span>Llamar a {parentTitle(primary.relationship)}</span>
            <ArrowUpRight size={20} />
          </a>
          <small>{primary.name} · contacto principal</small>
        </div>
      )}
    </article>
  );
}
