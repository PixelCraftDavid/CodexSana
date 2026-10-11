'use client';

import type { PatientDesign } from '@/features/designs/model/patient-designs';
import { downloadPersonalizedQR, svgSource } from '@/features/qr/lib/custom-qr';
import { frameQR, qrFinders, qrFrames, type QRPresentation } from '@/features/qr/lib/qr-frames';
import { Download } from 'lucide-react';
import { useState } from 'react';

export function QRPresentationControls({
  matrix,
  theme,
  style,
  onChange,
  name,
}: {
  matrix: string;
  theme: PatientDesign;
  style: QRPresentation & { badge?: 'character' | 'symbol'; includeName?: boolean };
  onChange: (patch: Partial<QRPresentation>) => void;
  name?: string;
}) {
  return (
    <div className="qr-presentation-controls">
      <fieldset>
        <legend>EL MARCO / PEQUEÑOS MUNDOS</legend>
        <div className="qr-frame-gallery">
          {qrFrames.map((frame) => (
            <button
              type="button"
              key={frame.id}
              aria-label={`Marco ${frame.label}`}
              aria-pressed={(style.frameStyle ?? 'label') === frame.id}
              onClick={() => onChange({ frameStyle: frame.id })}
            >
              <span className="qr-frame-thumbnail">
                {matrix && (
                  <img
                    src={svgSource(
                      frameQR(matrix, theme, { ...style, name, frameStyle: frame.id }),
                    )}
                    alt=""
                    width={114}
                    height={147}
                  />
                )}
              </span>
              <strong>{frame.label}</strong>
              <small>{frame.detail}</small>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>LAS ESQUINAS / SU FIRMA</legend>
        <div className="qr-finder-options">
          {qrFinders.map((finder) => (
            <button
              type="button"
              key={finder.id}
              aria-pressed={(style.finder ?? 'rounded') === finder.id}
              onClick={() => onChange({ finder: finder.id })}
            >
              <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
                <rect
                  width="28"
                  height="28"
                  rx={finder.id === 'square' ? 0 : 6.4}
                  fill="currentColor"
                />
                <rect
                  x="4"
                  y="4"
                  width="20"
                  height="20"
                  rx={finder.id === 'square' ? 0 : 4}
                  fill="var(--qr-control-paper, #fff)"
                />
                <rect
                  x="8"
                  y="8"
                  width="12"
                  height="12"
                  rx={finder.id === 'dot' ? 4 : finder.id === 'square' ? 0 : 2.6}
                  fill="currentColor"
                />
              </svg>
              <span>{finder.label}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>COLOR DE LAS ESQUINAS</legend>
        <div className="qr-accent-options">
          <button
            type="button"
            aria-pressed={style.eyeInk !== 'accent'}
            onClick={() => onChange({ eyeInk: 'same' })}
          >
            Una tinta
          </button>
          <button
            type="button"
            aria-pressed={style.eyeInk === 'accent'}
            onClick={() => onChange({ eyeInk: 'accent' })}
          >
            Acento del diseño
          </button>
        </div>
      </fieldset>
      <label className="qr-caption-field">
        <span>Un mensaje en el marco</span>
        <input
          value={style.caption ?? ''}
          maxLength={34}
          placeholder={theme.startsWith('michi') ? 'Mi familia está aquí' : 'Escanea mi ficha'}
          onChange={(event) => onChange({ caption: event.target.value })}
        />
        <small>Hasta 34 caracteres. El texto acompaña al QR.</small>
      </label>
    </div>
  );
}

export function QRDownloadActions({ svg, name }: { svg: string; name: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function download(format: 'png' | 'svg') {
    setBusy(true);
    setMessage('');
    try {
      await downloadPersonalizedQR(svg, `CodexSanaQR-${name}`, format);
      setMessage('Archivo preparado para descargar.');
    } catch {
      setMessage('No se pudo preparar el archivo. Intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="qr-only-downloads">
      <span>DESCARGAR SOLO EL QR</span>
      <div>
        {(['png', 'svg'] as const).map((format) => (
          <button
            type="button"
            key={format}
            disabled={!svg || busy}
            onClick={() => download(format)}
          >
            <Download size={15} /> QR {format.toUpperCase()}
          </button>
        ))}
      </div>
      <small role="status">{message}</small>
    </div>
  );
}
