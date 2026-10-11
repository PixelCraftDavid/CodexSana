'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, Pause, Play, RotateCcw } from 'lucide-react';
import { pediatricPatients } from '@/data/demo-pediatric';
import { KidsEmergencyCard } from '../../emergency/components/kids-emergency-card';
import { kidsCardURL, kidsThemes, type CompanionTheme } from '../model/kids-themes';
import { CompanionCharacter, CompanionSymbol } from './companion-art';
import { KidsThemeNav } from './kids-theme-nav';
import { KidsQRStudio } from './kids-qr-studio';

export function CompanionDesignLab({
  theme,
  initialPatient,
}: {
  theme: CompanionTheme;
  initialPatient?: string;
}) {
  const otter = theme === 'nutria-perla';
  const meta = kidsThemes[theme];
  const [patientId, setPatientId] = useState(initialPatient ?? meta.sample);
  const patient =
    pediatricPatients.find((person) => person.id === patientId) ?? pediatricPatients[0];
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadVersion, setLoadVersion] = useState(0);
  useEffect(() => {
    const timer = setTimeout(
      () => setLoading(false),
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650,
    );
    return () => clearTimeout(timer);
  }, [patientId, loadVersion]);
  return (
    <main className={`kids-study companion-study ${theme}`} data-paused={paused}>
      <header className="kids-study-header">
        <Link href="/" className="kids-back" aria-label="Volver al dashboard">
          <ArrowLeft size={16} />
          <span>Mi espacio</span>
        </Link>
        <div className="kids-study-brand">
          <span className="kids-wordmark">
            CodexSana<span>.</span>
          </span>
          <small>PEQUEÑOS COMPAÑEROS. GRANDES CUIDADOS.</small>
        </div>
        <KidsThemeNav theme={theme} />
      </header>
      <div className="companion-workshop-grid">
        <section className="companion-story">
          <div className="companion-edition">
            <span>
              EDICIÓN 0{otter ? '5' : '6'} / {otter ? 'RÍO DE ABRAZOS' : 'EL CLUB DEL CUIDADO'}
            </span>
            <Heart size={14} />
          </div>
          <h1>
            {otter ? (
              <>
                Tan pequeñita.
                <br />
                <em>Tan querida.</em>
              </>
            ) : (
              <>
                Un gran abrazo.
                <br />
                <em>Un pequeño doctor.</em>
              </>
            )}
          </h1>
          <p>
            {otter
              ? 'Gorrito de ranita, bigotes curiosos y un impermeable de melocotón. Nori lleva una dosis de cariño a cada pequeña aventura.'
              : 'Bata blanca, corazón enorme. Dr. Capi es el compañero más tranquilo del club.'}
          </p>
          <div className="companion-portrait">
            <div className="companion-portrait-arch" />
            <span className="companion-portrait-orbit" aria-hidden="true" />
            <span className="companion-bubble bubble-one" />
            <span className="companion-bubble bubble-two" />
            <CompanionCharacter theme={theme} />
            <span className="companion-portrait-star" aria-hidden="true">
              ✦
            </span>
            <div className="companion-portrait-label">
              <CompanionSymbol theme={theme} />
              <span>
                {meta.name}
                <small>{otter ? 'ESPECIALISTA EN ABRACITOS' : 'UNA DOSIS DE TERNURA'}</small>
              </span>
            </div>
            <span className="companion-portrait-note">
              {otter ? 'un tesorito del río' : 'receta: muchos abrazos'}
            </span>
          </div>
          <div
            className="companion-palette"
            aria-label={`Paleta ${otter ? 'perla, laguna y melocotón' : 'azul tinta, crema y albaricoque'}`}
          >
            <span />
            <span />
            <span />
            <p>{otter ? 'PERLA / LAGUNA / MELOCOTÓN' : 'TINTA / CREMA / ALBARICOQUE'}</p>
          </div>
          <Link
            className="companion-next"
            href={`/conceptos/${otter ? 'capibara-salvia' : 'nutria-perla'}`}
          >
            <span>Conoce a {otter ? 'Dr. Capi' : 'Nori'}</span>
            <ArrowRight size={18} />
          </Link>
        </section>
        <section
          className="companion-device-section"
          aria-label={`Vista previa de la cartilla de ${meta.name}`}
        >
          <div className="companion-device-caption">
            <span>UNA CARTILLA HECHA CON CARIÑO</span>
            <button
              aria-label="Repetir carga infantil"
              onClick={() => {
                setLoading(true);
                setLoadVersion((version) => version + 1);
              }}
            >
              <RotateCcw size={12} /> Ver carga
            </button>
          </div>
          <div className="companion-phone">
            <div className="companion-phone-status">
              <span>9:41</span>
              <span>▂▄▆ ▰</span>
            </div>
            <div className="companion-phone-scroll">
              <KidsEmergencyCard
                patient={patient}
                theme={theme}
                preview
                loading={loading}
                motionPaused={paused}
                onMotionChange={setPaused}
              />
            </div>
            <span className="companion-phone-home" />
          </div>
          <Link className="companion-open" href={kidsCardURL(patient.id, theme)}>
            Abrir ficha de emergencia <ArrowUpRight size={14} />
          </Link>
          <button
            className="companion-pause"
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}{' '}
            {paused ? 'Activar personaje' : 'Pausar personaje'}
          </button>
        </section>
        <KidsQRStudio
          theme={theme}
          patient={patient}
          onPatientChange={(id) => {
            setLoading(true);
            setPatientId(id);
          }}
        />
      </div>
      <footer className="companion-study-footer">
        <span>PERSONAJES ORIGINALES DE CODEXSANA</span>
        <p>Ternura en el diseño. Claridad en lo esencial.</p>
        <span>DATOS DE DEMOSTRACIÓN · 2026</span>
      </footer>
    </main>
  );
}
