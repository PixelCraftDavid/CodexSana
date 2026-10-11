'use client';

import { cardPalettes, createCardFaces } from '@/features/cards/lib/printable-card';
import {
  cardOptions,
  createPatientQR,
  defaultCardCustomization,
  type CardCustomization,
} from '@/features/cards/model/card-customization';
import { isKidsTheme, kidsThemes } from '@/features/designs/model/kids-themes';
import { patientDesignName, type PatientDesign } from '@/features/designs/model/patient-designs';
import { type Patient } from '@/features/patients/model/patient';
import { qrInks, qrPatterns, svgSource } from '@/features/qr/lib/custom-qr';
import { cardUrl } from '@/shared/lib/patient-url';
import { Check, CreditCard, Palette, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PatientDesignPicker } from '../../designs/components/patient-design-picker';
import {
  QRDownloadActions,
  QRPresentationControls,
} from '../../qr/components/qr-presentation-controls';
import { CardFormatPicker } from './card-format-picker';
import { CardPreview } from './card-preview';
import { CardReviewSummary } from './card-review-summary';

export function CardWorkshopDialog({
  patient,
  onApply,
  onClose,
  returnFocusTo,
}: {
  patient: Patient;
  onApply: (patient: Patient) => void;
  onClose: () => void;
  returnFocusTo?: HTMLElement;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [design, setDesign] = useState<PatientDesign>(patient.design ?? 'vitalia');
  const [style, setStyle] = useState<CardCustomization>({
    ...defaultCardCustomization,
    ...patient.cardStyle,
  });
  const customized = useMemo(
    () => ({ ...patient, design, cardStyle: style }),
    [patient, design, style],
  );
  const url = cardUrl(patient.id, design);
  const faces = useMemo(
    () => createCardFaces(customized, url, design, cardOptions(customized)),
    [customized, url, design],
  );
  const qrSVG = useMemo(() => createPatientQR(customized, url), [customized, url]);
  const qr = svgSource(qrSVG);
  const matrix = useMemo(
    () => createPatientQR({ ...customized, cardStyle: { ...style, frame: false } }, url),
    [customized, style, url],
  );
  const child = isKidsTheme(design);
  const palette = cardPalettes[design];
  function change<K extends keyof CardCustomization>(key: K, value: CardCustomization[K]) {
    setStyle((current) => ({ ...current, [key]: value }));
  }
  function selectDesign(next: PatientDesign) {
    setDesign(next);
    if (isKidsTheme(next) && style.ink !== 'signature' && style.ink !== 'graphite')
      change('ink', 'signature');
  }
  useEffect(() => {
    const dialog = ref.current;
    const previous = returnFocusTo ?? (document.activeElement as HTMLElement | null);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog?.showModal();
    return () => {
      if (dialog?.open) dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <dialog
      ref={ref}
      className="card-export-dialog card-workshop-dialog"
      aria-labelledby={titleId}
      onKeyDown={(event) => event.stopPropagation()}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <header className="card-workshop-heading">
        <span className="card-export-icon">
          <Palette size={23} />
        </span>
        <div>
          <span className="card-export-eyebrow">HECHA A SU MANERA</span>
          <h2 id={titleId}>Una tarjeta. Su personalidad.</h2>
          <p>Personalizar tarjeta de {patient.name}</p>
        </div>
        <button
          type="button"
          className="card-export-close"
          aria-label="Cerrar personalización"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </header>
      <div className="card-workshop-grid">
        <section className="card-workshop-controls" aria-label="Opciones de personalización">
          <h3>
            <span>01</span> Elige su mundo
          </h3>
          <PatientDesignPicker value={design} onChange={selectDesign} />
          <CardFormatPicker
            includeQR={style.includeQR !== false}
            onChange={(value) => change('includeQR', value)}
          />
          {isKidsTheme(design) && (
            <fieldset className="workshop-control">
              <legend>02 / SU COMPAÑERO</legend>
              <div className="workshop-segment">
                <button
                  type="button"
                  aria-pressed={style.badge === 'character'}
                  onClick={() => change('badge', 'character')}
                >
                  {kidsThemes[design].character}
                </button>
                <button
                  type="button"
                  aria-pressed={style.badge === 'symbol'}
                  onClick={() => change('badge', 'symbol')}
                >
                  {kidsThemes[design].symbol}
                </button>
              </div>
            </fieldset>
          )}
          {style.includeQR !== false && (
            <>
              <fieldset className="workshop-control">
                <legend>{child ? '03' : '02'} / EL PATRÓN DEL QR</legend>
                <div className="workshop-segment">
                  {qrPatterns.map((pattern) => (
                    <button
                      type="button"
                      key={pattern.id}
                      aria-pressed={style.modules === pattern.id}
                      onClick={() => change('modules', pattern.id)}
                    >
                      {pattern.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="workshop-control">
                <legend>{child ? '04' : '03'} / LA TINTA DEL QR</legend>
                <div className="workshop-inks">
                  <button
                    type="button"
                    aria-pressed={style.ink === 'signature'}
                    onClick={() => change('ink', 'signature')}
                  >
                    <i style={{ background: design === 'anatomico' ? '#101519' : palette.ink }}>
                      {style.ink === 'signature' && <Check size={11} />}
                    </i>
                    Del diseño
                  </button>
                  {qrInks
                    .filter((ink) => !child || ink.id === 'graphite')
                    .map((ink) => (
                      <button
                        type="button"
                        key={ink.id}
                        aria-pressed={style.ink === ink.id}
                        onClick={() => change('ink', ink.id)}
                      >
                        <i style={{ background: ink.color }}>
                          {style.ink === ink.id && <Check size={11} />}
                        </i>
                        {ink.label}
                      </button>
                    ))}
                </div>
              </fieldset>
              <QRPresentationControls
                matrix={matrix}
                theme={design}
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
            </>
          )}
          <label className="workshop-toggle">
            <span>Mostrar nombre en la tarjeta</span>
            <input
              type="checkbox"
              checked={style.includeName}
              onChange={(event) => change('includeName', event.target.checked)}
            />
          </label>
          <label className="workshop-toggle">
            <span>
              {style.includeQR !== false
                ? 'Marco del QR y borde de la tarjeta'
                : 'Borde decorativo de la tarjeta'}
            </span>
            <input
              type="checkbox"
              checked={style.frame}
              onChange={(event) => change('frame', event.target.checked)}
            />
          </label>
        </section>
        <section className="card-workshop-preview" aria-label="Vista previa personalizada">
          <div className="workshop-preview-label">
            <span>ASÍ SERÁ SU TARJETA</span>
            <span className="workshop-live-dot">EN VIVO</span>
          </div>
          <CardPreview faces={faces} name={patient.name} />
          <CardReviewSummary faces={faces} theme={design} includeName={style.includeName} />
          {faces.includeQR ? (
            <>
              <div className="workshop-qr-proof">
                <img
                  src={qr}
                  width={180}
                  height={232}
                  alt={`QR personalizado de ${patient.name}`}
                />
                <div>
                  <span>UNA CONEXIÓN QUE CUIDA</span>
                  <h3>{patientDesignName(design)}. A su manera.</h3>
                  <p>
                    La tinta, el patrón y las esquinas también se aplican al reverso de la tarjeta.
                    El marco y su mensaje decoran el QR independiente.
                  </p>
                </div>
              </div>
              <QRDownloadActions svg={qrSVG} name={patient.id} />
            </>
          ) : (
            <>
              <div className="card-no-qr-note">
                <CreditCard size={19} />
                <p>
                  Lo esencial queda impreso. Revisa los teléfonos y los datos en el reverso antes de
                  entregar la tarjeta.
                </p>
              </div>
              <details className="card-qr-extra">
                <summary>Generar un QR aparte (opcional)</summary>
                <p>Se descarga como archivo independiente y no se añade a esta tarjeta.</p>
                <QRDownloadActions svg={qrSVG} name={patient.id} />
              </details>
            </>
          )}
          <p className="workshop-session-note">
            Las preferencias se guardan en esta sesión. Las fichas nuevas requieren almacenamiento
            para abrirse desde otro dispositivo.
          </p>
        </section>
      </div>
      <footer className="card-workshop-footer">
        <span>Ficha y tarjeta, con la misma identidad.</span>
        <div>
          <button type="button" className="button secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="button primary"
            onClick={() => {
              onApply(customized);
              onClose();
            }}
          >
            <Check size={16} /> Aplicar diseño
          </button>
        </div>
      </footer>
    </dialog>,
    document.body,
  );
}
