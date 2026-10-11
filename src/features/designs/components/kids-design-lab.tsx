'use client';

import { pediatricPatients } from '@/data/demo-pediatric';
import { kidsCardURL, type KidsTheme } from '@/features/designs/model/kids-themes';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { KidsEmergencyCard } from '../../emergency/components/kids-emergency-card';
import { KidsQRStudio } from './kids-qr-studio';
import { KidsThemeNav } from './kids-theme-nav';
import { CatGlasses, KidsCharacter, PawPrint } from './kids-art';

export function KidsDesignLab({
  theme,
  initialPatient,
}: {
  theme: KidsTheme;
  initialPatient?: string;
}) {
  const sunny = theme === 'michi-sol';
  const [patientId, setPatientId] = useState(initialPatient ?? (sunny ? 'VT-K01' : 'VT-K02'));
  const patient =
    pediatricPatients.find((person) => person.id === patientId) ?? pediatricPatients[sunny ? 0 : 1];
  const [loading, setLoading] = useState(true);
  const [loadVersion, setLoadVersion] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setLoading(false),
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 200 : 800,
    );
    return () => clearTimeout(timer);
  }, [patientId, loadVersion]);
  const path = kidsCardURL(patient.id, theme);
  return (
    <main className={`kids-study ${theme}`} data-paused={paused}>
      <header className="kids-study-header">
        <Link href="/" className="kids-back" aria-label="Volver al dashboard">
          <ArrowLeft size={16} />
          <span>Mi espacio</span>
        </Link>
        <div className="kids-study-brand">
          <span className="kids-wordmark">
            CodexSana<span>.</span>
          </span>
          <small>EL CLUB DE LAS PATITAS.</small>
        </div>
        <KidsThemeNav theme={theme} />
      </header>
      <div className="kids-workshop-grid">
        <section className="kids-story">
          <span className="kids-story-eyebrow">
            <i /> {sunny ? '03 / MISO · CLUB DEL SOL' : '04 / MOCHI · CLUB DE LAS IDEAS'}
          </span>
          <h1>
            {sunny ? (
              <>
                Más sol.
                <br />
                Más juegos.
                <br />
                <em>Más abrazos.</em>
              </>
            ) : (
              <>
                Pequeñas
                <br />
                ideas.
                <br />
                <em>Mucho amor.</em>
              </>
            )}
          </h1>
          <p className="kids-story-lede">
            {sunny
              ? 'Conoce a Miso: experto en siestas al sol, juegos y tener a su familia cerquita.'
              : 'Conoce a Mochi: colecciona historias, inventa mundos y nunca se queda sin un abrazo.'}
          </p>
          <div className="kids-story-scene">
            <span className="kids-scene-disc" />
            <span className="cat-sun" aria-hidden="true">
              ☀
            </span>
            <span className="cat-cloud" aria-hidden="true">
              ☁
            </span>
            <span className="cat-scene-caption">
              {sunny ? 'MISO / EXPERTO EN ABRAZOS' : 'MOCHI / COLECCIONISTA DE IDEAS'}
            </span>
            <KidsCharacter theme={theme} />
            <span className="kids-scene-spark one">✦</span>
            <span className="kids-scene-spark two">✧</span>
            <span className="kids-scene-sticker">
              {sunny ? <PawPrint /> : <CatGlasses />}
              <span>{sunny ? '¡Hoy toca sonreír!' : '¡Una idea, un abrazo!'}</span>
            </span>
          </div>
          <div className="kids-inspiration">
            <span>UN PERSONAJE ORIGINAL · {sunny ? 'MISO' : 'MOCHI'}</span>
            <p>
              {sunny
                ? 'Miel, melocotón, gafas de sol y un gorrito de león. Nuestro pequeño compañero de aventuras, con lo esencial siempre visible.'
                : 'Pelaje crema, lentes redondos y un gorrito de osito de algodón. Mochi vuelve con su librito y la familia siempre cerquita.'}
            </p>
          </div>
          <Link href={`/conceptos/${sunny ? 'michi-luna' : 'michi-sol'}`} className="kids-next">
            <span>{sunny ? 'Conocer a Mochi' : 'Conocer a Miso'}</span>
            <ArrowRight size={19} />
          </Link>
        </section>
        <section className="kids-device-section">
          <div className="kids-device-heading">
            <span>SU PEQUEÑO PASAPORTE DE CUIDADO</span>
            <button
              onClick={() => {
                setLoading(true);
                setLoadVersion((version) => version + 1);
              }}
              aria-label="Repetir carga infantil"
            >
              <RotateCcw size={13} /> Ver carga
            </button>
          </div>
          <div className="kids-device">
            <div className="kids-device-status">
              <span>9:41</span>
              <span>▂▄▆ ▰</span>
            </div>
            <div className="kids-device-scroll">
              <KidsEmergencyCard
                key={patient.id}
                patient={patient}
                theme={theme}
                preview
                loading={loading}
                motionPaused={paused}
                onMotionChange={setPaused}
              />
            </div>
            <div className="kids-device-home" />
          </div>
          <Link href={path} className="kids-open-card">
            Ver ficha a pantalla completa <ArrowUpRight size={15} />
          </Link>
          <button className="kids-pause" onClick={() => setPaused(!paused)} aria-pressed={paused}>
            {paused ? <Play size={12} /> : <Pause size={12} />}
            {paused ? 'Activar personajes' : 'Pausar personajes'}
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
      <footer className="kids-study-footer">
        <span>INFORMACIÓN QUE CUIDA, DESDE PEQUEÑOS.</span>
        <Link href="/conceptos/anatomico">
          Ver conceptos anteriores <ArrowUpRight size={13} />
        </Link>
        <span>DATOS FICTICIOS · CodexSana 2026</span>
      </footer>
    </main>
  );
}
