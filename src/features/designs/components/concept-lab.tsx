'use client';

import { patients } from '@/data/demo-patients';
import {
  createPersonalizedQR,
  defaultQRStyle,
  qrInks,
  qrPatterns,
  svgSource,
  type QRStyle,
} from '@/features/qr/lib/custom-qr';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CardExportDialog } from '../../cards/components/card-export-dialog';
import {
  EmergencyConcept,
  conceptURL,
  type Concept,
} from '../../emergency/components/emergency-concepts';
import { ShareEmergency } from '../../emergency/components/share-emergency';
import {
  QRDownloadActions,
  QRPresentationControls,
} from '../../qr/components/qr-presentation-controls';

export function ConceptLab({
  concept,
  initialPatient = 'VT-001',
}: {
  concept: Concept;
  initialPatient?: string;
}) {
  const dark = concept === 'anatomico';
  const [patientId, setPatientId] = useState(initialPatient);
  const patient = patients.find((person) => person.id === patientId) ?? patients[0];
  const [style, setStyle] = useState<QRStyle>({
    ...defaultQRStyle,
    ink: dark ? 'graphite' : 'plasma',
  });
  const [origin, setOrigin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadVersion, setLoadVersion] = useState(0);
  const [exportFormat, setExportFormat] = useState<'png' | 'svg' | 'pdf' | null>(null);

  useEffect(() => setOrigin(window.location.origin), []);
  useEffect(() => {
    const timer = setTimeout(
      () => setLoading(false),
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 200 : 900,
    );
    return () => clearTimeout(timer);
  }, [loadVersion, patientId]);
  const path = conceptURL(patient.id, concept);
  const url = origin ? `${origin}${path}` : '';
  const svg = useMemo(
    () => (url ? createPersonalizedQR(url, { ...style, theme: concept }) : ''),
    [url, style, concept],
  );
  const matrix = useMemo(
    () => (url ? createPersonalizedQR(url, { ...style, theme: concept, frame: false }) : ''),
    [url, style, concept],
  );
  function replay() {
    setLoading(true);
    setLoadVersion((version) => version + 1);
  }
  const exportTrigger = useRef<HTMLButtonElement | null>(null);
  function download(format: 'svg' | 'png' | 'pdf', trigger: HTMLButtonElement) {
    exportTrigger.current = trigger;
    setExportFormat(format);
  }
  return (
    <main className={`concept-lab ${concept}`}>
      <header className="lab-header">
        <Link href="/" className="lab-back">
          <ArrowLeft size={16} />
          <span>Volver al dashboard</span>
        </Link>
        <span className="lab-wordmark">
          CodexSana<span>.</span>
          <small>DESIGN STUDIES / 2026</small>
        </span>
        <nav aria-label="Conceptos de diseño">
          <Link
            href={`/conceptos/anatomico?paciente=${patient.id}`}
            aria-current={dark ? 'page' : undefined}
          >
            01 <span>Anatomical</span>
          </Link>
          <Link
            href={`/conceptos/clinico?paciente=${patient.id}`}
            aria-current={!dark ? 'page' : undefined}
          >
            02 <span>Clinical</span>
          </Link>
          <Link href="/conceptos/michi-sol">
            03 <span>Infantiles</span>
          </Link>
        </nav>
      </header>
      <div className="concept-lab-grid">
        <section className="lab-introduction">
          <div className="lab-kicker">
            <i /> CONCEPTO {dark ? '01' : '02'} / {dark ? 'ANATOMICAL DARK' : 'CLÍNICA DE LUJO'}
          </div>
          <h1>
            {dark ? (
              <>
                Información.
                <br />
                <em>Sin ruido.</em>
              </>
            ) : (
              <>
                TODO LO
                <br />
                <span>ESENCIAL.</span>
              </>
            )}
          </h1>
          <p className="lab-lede">
            {dark
              ? 'Contraste radical. Anatomía abstracta. Lo vital, antes que todo.'
              : 'Papel clínico, azul plasma y una nueva forma de hacer visible lo esencial.'}
          </p>
          <div className="lab-design-note">
            <span>{dark ? '01 / LA JERARQUÍA' : '02 / EL ESPACIO'}</span>
            <p>
              {dark
                ? 'La sangre ocupa el primer plano. Las alergias interrumpen en rojo. El nombre, en serif, devuelve la atención a la persona.'
                : 'La tipografía toma el espacio sin encerrar los datos. Las etiquetas y el corazón lineal evocan una hoja clínica contemporánea.'}
            </p>
          </div>
          <div className="lab-design-note">
            <span>MOVIMIENTO CON INTENCIÓN</span>
            <p>
              {dark
                ? 'Un esqueleto suave se transforma en la ficha. El pulso del pecho ilustra el asma reportada en esta muestra.'
                : 'Una línea de escaneo atraviesa el esqueleto. La información aparece con un desenfoque breve y el corazón late de fondo.'}
            </p>
          </div>
          <Link
            className="lab-next"
            href={`/conceptos/${dark ? 'clinico' : 'anatomico'}?paciente=${patient.id}`}
          >
            <span>{dark ? 'Ver el segundo concepto' : 'Volver al primer concepto'}</span>
            <ArrowRight size={20} />
          </Link>
          <span className="lab-edition">DOS ESTUDIOS. UNA MISMA MISIÓN.</span>
        </section>
        <section className="lab-preview">
          <div className="lab-preview-label">
            <span>FICHA PÚBLICA / MOBILE FIRST</span>
            <button onClick={replay} aria-label="Repetir carga simulada">
              <RotateCcw size={13} /> Ver carga
            </button>
          </div>
          <div className="concept-phone">
            <div className="concept-phone-status">
              <span>9:41</span>
              <span>▂▄▆ ▰</span>
            </div>
            <div className="concept-phone-scroll">
              <EmergencyConcept
                key={patient.id}
                patient={patient}
                concept={concept}
                loading={loading}
                preview
              />
            </div>
            <div className="concept-phone-home" />
          </div>
          <Link href={path} className="lab-open-public">
            Abrir ficha a pantalla completa <ArrowUpRight size={16} />
          </Link>
          <p className="lab-preview-caption">
            Muestra con datos ficticios · llamadas de demostración
          </p>
        </section>
        <aside className="qr-studio" aria-label="Personalizar código QR">
          <div className="qr-studio-title">
            <SlidersHorizontal size={16} />
            <span>TU QR, TU IDENTIDAD</span>
          </div>
          <h2>
            Una conexión
            <br />
            con carácter.
          </h2>
          <label className="qr-patient-label">
            Ficha de muestra
            <select
              aria-label="Paciente del QR"
              value={patient.id}
              onChange={(event) => {
                setLoading(true);
                setPatientId(event.target.value);
              }}
            >
              {patients.map((person) => (
                <option value={person.id} key={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
          <div className="personalized-qr-preview">
            {svg ? (
              <img
                src={svgSource(svg)}
                alt={`QR personalizado de ${patient.name}, diseño ${concept}`}
                width={240}
                height={style.frame ? 285 : 240}
              />
            ) : (
              <div className="qr-warmup" />
            )}
          </div>
          <div className="qr-style-controls">
            <fieldset>
              <legend>01 / TINTA</legend>
              <div className="qr-ink-options">
                {qrInks.map((ink) => (
                  <button
                    key={ink.id}
                    onClick={() => setStyle((current) => ({ ...current, ink: ink.id }))}
                    aria-pressed={style.ink === ink.id}
                    aria-label={`Tinta ${ink.label}`}
                    title={ink.label}
                  >
                    <i style={{ background: ink.color }}>
                      {style.ink === ink.id && <Check size={12} />}
                    </i>
                    <span>{ink.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>02 / MÓDULOS</legend>
              <div className="qr-module-options">
                {qrPatterns.map((pattern) => (
                  <button
                    type="button"
                    key={pattern.id}
                    onClick={() => setStyle((current) => ({ ...current, modules: pattern.id }))}
                    aria-pressed={style.modules === pattern.id}
                  >
                    {pattern.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="qr-frame-toggle">
              <span>Marco con identidad CodexSana</span>
              <input
                type="checkbox"
                checked={style.frame}
                onChange={(event) =>
                  setStyle((current) => ({ ...current, frame: event.target.checked }))
                }
              />
            </label>
          </div>
          <QRPresentationControls
            matrix={matrix}
            theme={concept}
            style={style}
            onChange={(patch) =>
              setStyle((current) => ({
                ...current,
                ...patch,
                ...(patch.frameStyle ? { frame: true } : {}),
              }))
            }
          />
          <QRDownloadActions svg={svg} name={patient.id} />
          <span className="qr-card-download-label">DESCARGAR TARJETA / DOS CARAS</span>
          <div className="qr-studio-downloads">
            <button disabled={!svg} onClick={(event) => download('pdf', event.currentTarget)}>
              <Download size={16} /> PDF
            </button>
            <button onClick={(event) => download('png', event.currentTarget)} disabled={!svg}>
              <Download size={16} /> PNG
            </button>
            <button onClick={(event) => download('svg', event.currentTarget)} disabled={!svg}>
              <Download size={16} /> SVG
            </button>
          </div>
          <ShareEmergency url={url || path} title={`Ficha de emergencia · ${patient.name}`} />
          <p className="qr-studio-note">
            Este QR abre el concepto {dark ? '01' : '02'} de la ficha seleccionada. El enlace usa el
            servidor local; requiere una URL pública para utilizarse en la calle.
          </p>
        </aside>
      </div>
      <footer className="lab-footer">
        <span>INFORMACIÓN QUE CUIDA.</span>
        <span>PROTOTIPO VISUAL / DATOS FICTICIOS</span>
      </footer>
      {exportFormat && (
        <CardExportDialog
          patient={patient}
          url={url || path}
          theme={concept}
          options={style}
          initialFormat={exportFormat}
          returnFocusTo={exportTrigger.current ?? undefined}
          onClose={() => setExportFormat(null)}
        />
      )}
    </main>
  );
}
