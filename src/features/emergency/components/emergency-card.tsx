'use client';
import { type Patient } from '@/features/patients/model/patient';
import {
  ArrowUpRight,
  Droplet,
  HeartPulse,
  Phone,
  Pill,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { Avatar, Brand } from '../../../shared/ui/ui';
import { PulseTrace } from '../../dashboard/components/medical-motion';
import { ShareEmergency } from './share-emergency';

export function EmergencyCard({
  patient,
  preview = false,
}: {
  patient: Patient;
  preview?: boolean;
}) {
  return (
    <article className={`emergency-card ${preview ? 'is-preview' : ''}`}>
      <header className="emergency-header">
        <Brand card />
        <span className="public-pill">
          <span />
          Ficha de emergencia
        </span>
      </header>
      <div className="emergency-pulse">
        <PulseTrace />
      </div>
      <div className="emergency-intro">
        <div className="eyebrow">INFORMACIÓN ESENCIAL</div>
        <h1>
          Cada segundo
          <br />
          cuenta<span>.</span>
        </h1>
        <p>Lo que necesitas saber para ayudar.</p>
      </div>
      <div className="critical-info">
        <section
          className={`blood-block ${patient.blood === 'Desconocido' ? 'blood-unknown' : ''}`}
          aria-label="Tipo de sangre"
        >
          <span>
            <Droplet size={16} /> Tipo de sangre
          </span>
          <strong>{patient.blood}</strong>
          <small>Reportado por el titular</small>
        </section>
        <section className="allergy-block">
          <span>
            <TriangleAlert size={17} /> Alergias
          </span>
          <strong>{patient.allergies}</strong>
          <small>Información prioritaria</small>
        </section>
      </div>
      <section className="patient-identity">
        <Avatar patient={patient} large />
        <div>
          <h2>{patient.name}</h2>
          <p>
            {patient.age} años <span>·</span> {patient.id}
          </p>
        </div>
        <ShieldCheck size={21} className="identity-icon" />
      </section>
      <section className="emergency-contacts">
        <div className="emergency-section-head">
          <h3>Contactos de emergencia</h3>
          <span>{String(patient.contacts.length).padStart(2, '0')}</span>
        </div>
        {patient.contacts.map((contact, index) => (
          <div className="contact-row" key={`${contact.name}-${index}`}>
            <div>
              <span className="contact-relation">
                {contact.relationship}
                {index === 0 && <i>Principal</i>}
              </span>
              <strong>{contact.name}</strong>
              <span className="contact-phone">{contact.phone}</span>
            </div>
            <a
              className="call-button"
              href={`tel:${contact.phone}`}
              aria-label={`Llamar a ${contact.name}`}
            >
              <Phone size={18} />
              <span>Llamar</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        ))}
      </section>
      <section className="health-details">
        <div className="health-detail">
          <HeartPulse size={19} />
          <div>
            <h3>Padecimientos</h3>
            <p>{patient.conditions}</p>
          </div>
        </div>
        <div className="health-detail">
          <Pill size={19} />
          <div>
            <h3>Medicamentos actuales</h3>
            <p>{patient.medications}</p>
          </div>
        </div>
      </section>
      <footer className="emergency-footer">
        <span>
          <ShieldCheck size={14} /> Actualizada el {patient.updated}
        </span>
        <p>Datos reportados por el titular. No sustituye la valoración médica.</p>
        {!preview && (
          <ShareEmergency
            url={`/ficha/${patient.id}`}
            title={`Ficha de emergencia · ${patient.name}`}
          />
        )}
        <div>
          Información que cuida. <span>CodexSanaQR.</span>
        </div>
      </footer>
    </article>
  );
}
