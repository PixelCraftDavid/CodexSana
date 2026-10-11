'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Download, Sparkles } from 'lucide-react';
import { pediatricPatients } from '@/data/demo-pediatric';
import { kidsCardURL, kidsThemes, type KidsTheme } from '../model/kids-themes';
import type { Patient } from '../../patients/model/patient';
import { qrPatterns, svgSource } from '../../qr/lib/custom-qr';
import { createKidsQR, defaultKidsQRStyle, type KidsQRStyle } from '../../qr/lib/kids-qr';
import {
  QRDownloadActions,
  QRPresentationControls,
} from '../../qr/components/qr-presentation-controls';
import { CardExportDialog } from '../../cards/components/card-export-dialog';
import { ShareEmergency } from '../../emergency/components/share-emergency';

export function KidsQRStudio({
  theme,
  patient,
  onPatientChange,
}: {
  theme: KidsTheme;
  patient: Patient;
  onPatientChange: (id: string) => void;
}) {
  const sunny = theme === 'michi-sol' || theme === 'nutria-perla';
  const meta = kidsThemes[theme];
  const [style, setStyle] = useState<KidsQRStyle>(defaultKidsQRStyle);
  const [origin, setOrigin] = useState('');
  const [exportFormat, setExportFormat] = useState<'png' | 'svg' | 'pdf' | null>(null);
  const exportTrigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => setOrigin(window.location.origin), []);
  const path = kidsCardURL(patient.id, theme);
  const url = origin ? origin + path : '';
  const svg = useMemo(
    () => (url ? createKidsQR(url, theme, patient.name, style) : ''),
    [url, theme, patient.name, style],
  );
  const matrix = useMemo(
    () => (url ? createKidsQR(url, theme, patient.name, { ...style, frame: false }) : ''),
    [url, theme, patient.name, style],
  );
  function download(format: 'svg' | 'png' | 'pdf', trigger: HTMLButtonElement) {
    exportTrigger.current = trigger;
    setExportFormat(format);
  }
  return (
    <>
      <aside className="kids-qr-studio" aria-label="Personalizar QR infantil">
        <span className="kids-qr-eyebrow">
          <Sparkles size={14} /> UNA CONEXIÓN LLENA DE TERNURA
        </span>
        <h2>
          {sunny ? (
            <>
              {theme === 'nutria-perla' ? 'Un tesorito.' : 'Una patita.'}
              <br />
              Una conexión.
            </>
          ) : (
            <>
              Un abrazo
              <br />
              en un QR.
            </>
          )}
        </h2>
        <label className="kids-patient-field">
          Perfil infantil de muestra
          <select
            aria-label="Paciente infantil del QR"
            value={patient.id}
            onChange={(event) => {
              onPatientChange(event.target.value);
            }}
          >
            {pediatricPatients.map((person) => (
              <option value={person.id} key={person.id}>
                {person.name} · {person.age} años
              </option>
            ))}
          </select>
        </label>
        <div className="kids-qr-image">
          {svg ? (
            <img
              src={svgSource(svg)}
              alt={`QR infantil de ${patient.name}, con ${meta.name}`}
              width={280}
              height={361}
            />
          ) : (
            <div className="kids-qr-placeholder" />
          )}
        </div>
        <div className="kids-qr-controls">
          <fieldset>
            <legend>01 / EL DIBUJO</legend>
            <div className="kids-choice">
              <button
                aria-pressed={style.badge === 'character'}
                onClick={() => setStyle((current) => ({ ...current, badge: 'character' }))}
              >
                {meta.character}
              </button>
              <button
                aria-pressed={style.badge === 'symbol'}
                onClick={() => setStyle((current) => ({ ...current, badge: 'symbol' }))}
              >
                {meta.symbol}
              </button>
            </div>
          </fieldset>
          <fieldset>
            <legend>02 / EL PATRÓN</legend>
            <div className="kids-choice">
              {qrPatterns.map((pattern) => (
                <button
                  type="button"
                  key={pattern.id}
                  aria-pressed={style.modules === pattern.id}
                  onClick={() => setStyle((current) => ({ ...current, modules: pattern.id }))}
                >
                  {pattern.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>03 / LA TINTA</legend>
            <div className="kids-ink-choice">
              <button
                aria-pressed={style.ink === 'signature'}
                onClick={() => setStyle((current) => ({ ...current, ink: 'signature' }))}
              >
                <i className="signature-ink">{style.ink === 'signature' && <Check size={11} />}</i>
                {meta.inkLabel}
              </button>
              <button
                aria-pressed={style.ink === 'graphite'}
                onClick={() => setStyle((current) => ({ ...current, ink: 'graphite' }))}
              >
                <i className="graphite-ink">{style.ink === 'graphite' && <Check size={11} />}</i>
                Grafito
              </button>
            </div>
          </fieldset>
          <label className="kids-name-toggle">
            <span>Su nombre en la tarjeta</span>
            <input
              type="checkbox"
              checked={style.includeName}
              onChange={(event) =>
                setStyle((current) => ({ ...current, includeName: event.target.checked }))
              }
            />
          </label>
        </div>
        <QRPresentationControls
          matrix={matrix}
          theme={theme}
          style={style}
          name={patient.name}
          onChange={(patch) =>
            setStyle((current) => ({
              ...current,
              ...patch,
              ...(patch.frameStyle ? { frame: true } : {}),
            }))
          }
        />
        <label className="kids-name-toggle">
          <span>Mostrar marco del QR</span>
          <input
            type="checkbox"
            checked={style.frame !== false}
            onChange={(event) =>
              setStyle((current) => ({ ...current, frame: event.target.checked }))
            }
          />
        </label>
        <QRDownloadActions svg={svg} name={patient.id} />
        <span className="qr-card-download-label">DESCARGAR TARJETA / DOS CARAS</span>
        <div className="kids-qr-downloads">
          <button disabled={!svg} onClick={(event) => download('pdf', event.currentTarget)}>
            <Download size={16} /> PDF
          </button>
          <button disabled={!svg} onClick={(event) => download('png', event.currentTarget)}>
            <Download size={16} /> PNG
          </button>
          <button disabled={!svg} onClick={(event) => download('svg', event.currentTarget)}>
            <Download size={16} /> SVG
          </button>
        </div>
        <ShareEmergency url={url || path} title={`Ficha de emergencia · ${patient.name}`} />
        <p className="kids-qr-note">
          Los dibujos decoran el marco; el patrón queda libre. QR de demostración con enlace al
          servidor local.
        </p>
      </aside>
      {exportFormat && (
        <CardExportDialog
          patient={patient}
          url={url || path}
          theme={theme}
          options={style}
          initialFormat={exportFormat}
          returnFocusTo={exportTrigger.current ?? undefined}
          onClose={() => setExportFormat(null)}
        />
      )}
    </>
  );
}
