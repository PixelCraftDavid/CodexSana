'use client';

import {
  cardPalettes,
  createCardFaces,
  createCardSheet,
  type CardTheme,
} from '@/features/cards/lib/printable-card';
import {
  createPDFPassword,
  createProtectedPDF,
  fileDataURL,
} from '@/features/cards/lib/protected-pdf';
import type { CardCustomization } from '@/features/cards/model/card-customization';
import { cardHasQR } from '@/features/cards/model/card-format';
import type { Patient } from '@/features/patients/model/patient';
import { downloadPersonalizedQR, svgSource, type QRStyle } from '@/features/qr/lib/custom-qr';
import type { KidsQRStyle } from '@/features/qr/lib/kids-qr';
import {
  ArrowRightLeft,
  Check,
  Copy,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  LockKeyhole,
  Printer,
  RefreshCw,
  Share2,
  X,
} from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { CardFormatPicker } from './card-format-picker';
import { CardPreview } from './card-preview';
import { CardReviewSummary } from './card-review-summary';

export function CardExportDialog({
  patient,
  url,
  theme = 'vitalia',
  options,
  initialFormat = 'pdf',
  note,
  returnFocusTo,
  onClose,
}: {
  patient: Patient;
  url: string;
  theme?: CardTheme;
  options?: QRStyle | KidsQRStyle | CardCustomization;
  initialFormat?: 'png' | 'svg' | 'pdf';
  note?: string;
  returnFocusTo?: HTMLElement;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [printPreview, setPrintPreview] = useState(false);
  const [format, setFormat] = useState(initialFormat);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdf, setPDF] = useState<{ file: File; href: string } | null>(null);
  const passwordId = useId();
  const [includeQR, setIncludeQR] = useState(() => cardHasQR(patient, options));
  const printOptions = useMemo(() => ({ ...options, includeQR }), [options, includeQR]);
  const faces = useMemo(
    () => createCardFaces(patient, url, theme, printOptions),
    [patient, url, theme, printOptions],
  );
  const p = cardPalettes[theme];
  useEffect(() => {
    setPDF(null);
  }, [faces]);
  const variables = {
    '--card-ink': p.ink,
    '--card-bg': p.bg,
    '--card-line': p.line,
    '--card-soft': p.soft,
    '--card-accent': theme === 'anatomico' ? '#193c32' : p.ink,
  } as CSSProperties;
  useEffect(() => {
    const previous = returnFocusTo ?? (document.activeElement as HTMLElement | null);
    const dialog = dialogRef.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setPassword(createPDFPassword());
    dialog?.showModal();
    return () => {
      if (dialog?.open) dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  async function download() {
    setBusy(true);
    setMessage('');
    try {
      if (format === 'pdf') {
        const filename = `CodexSanaQR-${patient.id}-${theme}-${includeQR ? 'con-qr' : 'sin-qr'}-frente-reverso.pdf`;
        const prepared =
          pdf ??
          (await (async () => {
            const file = await createProtectedPDF(createCardSheet(faces), password, filename);
            return { file, href: await fileDataURL(file) };
          })());
        setPDF(prepared);
        const link = document.createElement('a');
        link.href = prepared.href;
        link.download = prepared.file.name;
        link.click();
        setMessage('PDF protegido listo. Guarda la contraseña y envíala por separado.');
      } else {
        await downloadPersonalizedQR(
          createCardSheet(faces, format === 'svg'),
          `CodexSanaQR-${patient.id}-${theme}-${includeQR ? 'con-qr' : 'sin-qr'}-frente-reverso`,
          format,
        );
        setMessage(
          `Tarjeta ${format.toUpperCase()} descargada con ambos lados. Este formato no tiene contraseña.`,
        );
      }
    } catch {
      setMessage('No se pudo preparar el archivo. Intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  }
  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setMessage('Contraseña copiada. Envíala por separado del PDF.');
    } catch {
      setShowPassword(true);
      setMessage('Selecciona la contraseña y cópiala manualmente.');
    }
  }
  async function sharePDF() {
    if (!pdf) return;
    // The file is prepared before this tap to preserve native share user activation.
    if (!navigator.canShare?.({ files: [pdf.file] })) {
      setMessage(
        'Este navegador no permite compartir archivos. Descarga el PDF y adjúntalo en WhatsApp o tu aplicación preferida.',
      );
      return;
    }
    try {
      await navigator.share({ files: [pdf.file], title: 'CodexSanaQR · Tarjeta de emergencia' });
      setMessage('Archivo compartido. Recuerda enviar la contraseña por separado.');
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        setMessage('No se pudo compartir. Descarga el PDF y adjúntalo manualmente.');
    }
  }
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <dialog
        ref={dialogRef}
        className="card-export-dialog"
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          onClose();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="card-export-content" style={variables}>
          <button className="card-export-close" onClick={onClose} aria-label="Cerrar tarjeta">
            <X size={20} />
          </button>
          <div className="card-export-heading">
            <span className="card-export-icon">
              <CreditCard size={23} />
            </span>
            <div>
              <span className="card-export-eyebrow">CodexSanaQR / UNA CONEXIÓN QUE CUIDA</span>
              <h2 id={titleId}>Tu ficha, en el bolsillo.</h2>
              <p>Tarjeta de emergencia de {patient.name}</p>
            </div>
          </div>
          <CardFormatPicker includeQR={includeQR} onChange={setIncludeQR} disabled={busy} />
          <p className="card-export-format-note">Esta elección aplica a la descarga actual.</p>
          <CardPreview faces={faces} name={patient.name} />
          <CardReviewSummary
            faces={faces}
            theme={theme}
            includeName={!options || !('includeName' in options) || options.includeName !== false}
          />
          <div className="card-print-summary">
            <ArrowRightLeft size={18} />
            <div>
              <strong>Un archivo. Los dos lados.</strong>
              <p>Frente y reverso juntos, a color y con guías de corte.</p>
            </div>
            <button aria-expanded={printPreview} onClick={() => setPrintPreview(!printPreview)}>
              {printPreview ? 'Ocultar hoja' : 'Ver hoja'}
            </button>
          </div>
          {printPreview && (
            <div className="card-sheet-preview">
              <img
                src={svgSource(createCardSheet(faces))}
                alt="Hoja de impresión con frente y reverso de la tarjeta y guías de corte"
                width={1900}
                height={760}
              />
              <span>Ambos lados sin espejo. Recorta y únelos espalda con espalda.</span>
            </div>
          )}
          <div className="card-export-actions">
            <div className="card-format-options" aria-label="Formato de descarga">
              {(['pdf', 'png', 'svg'] as const).map((value) => (
                <button
                  key={value}
                  disabled={busy}
                  aria-pressed={format === value}
                  onClick={() => {
                    setFormat(value);
                    setMessage('');
                  }}
                >
                  {value.toUpperCase()}
                  {value === 'pdf' && <LockKeyhole size={11} />}
                </button>
              ))}
            </div>
            <button
              className="card-download-action"
              disabled={busy || (format === 'pdf' && !password)}
              onClick={download}
            >
              <Download size={16} />
              {busy ? 'Preparando…' : `Descargar ${format.toUpperCase()}`}
            </button>
            <button className="card-print-action" onClick={() => window.print()}>
              <Printer size={16} /> Imprimir
            </button>
          </div>
          {format === 'pdf' ? (
            <section className="pdf-security" aria-label="Protección del PDF">
              <div className="pdf-security-heading">
                <LockKeyhole size={18} />
                <div>
                  <strong>Un archivo privado. Una clave única.</strong>
                  <p>Contraseña aleatoria · Cifrado AES-256</p>
                </div>
              </div>
              <label htmlFor={passwordId}>Contraseña para abrir este PDF</label>
              <div className="pdf-password-row">
                <input
                  id={passwordId}
                  aria-label="Contraseña del PDF"
                  type={showPassword ? 'text' : 'password'}
                  readOnly
                  value={password}
                  autoComplete="off"
                  spellCheck={false}
                  onFocus={(event) => event.currentTarget.select()}
                />
                <button
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                <button onClick={copyPassword} aria-label="Copiar contraseña">
                  {copied ? <Check size={17} /> : <Copy size={17} />}
                </button>
              </div>
              <div className="pdf-password-meta">
                <span>Guárdala y envíala por separado.</span>
                <button
                  disabled={busy}
                  onClick={() => {
                    setPassword(createPDFPassword());
                    setPDF(null);
                    setCopied(false);
                    setMessage('Nueva contraseña. Descarga de nuevo el PDF para usarla.');
                  }}
                >
                  <RefreshCw size={12} /> Nueva clave
                </button>
              </div>
              <p className="pdf-security-scope">
                La contraseña protege el PDF.{' '}
                {includeQR
                  ? 'El QR abre una ficha pública, accesible en una emergencia.'
                  : 'Esta versión contiene únicamente información impresa, sin códigos QR.'}{' '}
                La clave se conserva solo mientras esta ventana está abierta.
              </p>
              <button className="pdf-share-action" disabled={!pdf || busy} onClick={sharePDF}>
                <Share2 size={17} /> Compartir PDF protegido
              </button>
              {!pdf && (
                <small className="pdf-share-hint">
                  Descarga primero el PDF para activar el botón de compartir.
                </small>
              )}
              {pdf && (
                <a className="pdf-download-copy" href={pdf.href} download={pdf.file.name}>
                  Volver a descargar PDF protegido <Download size={13} />
                </a>
              )}
            </section>
          ) : (
            <p className="pdf-format-warning">
              <LockKeyhole size={14} /> PNG y SVG no incluyen contraseña. Elige PDF para proteger el
              archivo.
            </p>
          )}
          {message && (
            <p className="card-export-status" role="status">
              {message}
            </p>
          )}
          <p className="card-export-note">
            {includeQR
              ? (note ?? 'El QR utiliza el servidor local del prototipo.')
              : 'Tarjeta sin QR: revisa los datos y teléfonos antes de imprimir.'}{' '}
            Para imprimir: tamaño real (100 %), papel A4 y fondos activados.
          </p>
        </div>
      </dialog>
      <section className="card-print-sheet" aria-label="Tarjeta lista para imprimir">
        <header>
          <strong>CodexSanaQR / Tarjeta de emergencia</strong>
          <span>86 × 54 mm · Escala 100 %</span>
        </header>
        <div className="card-print-pair">
          <figure>
            <figcaption>01 / FRENTE</figcaption>
            <div>
              <img src={svgSource(faces.front)} alt="Frente para imprimir" />
            </div>
          </figure>
          <figure>
            <figcaption>02 / REVERSO</figcaption>
            <div>
              <img
                src={svgSource(faces.back)}
                alt={includeQR ? 'Reverso para imprimir con QR' : 'Reverso para imprimir sin QR'}
              />
            </div>
          </figure>
        </div>
        <p>Datos reportados por el titular. No sustituye la valoración médica.</p>
        <p>
          Recorta por las guías y une ambos lados espalda con espalda.{' '}
          {includeQR
            ? 'Comprueba la lectura del QR una vez impreso.'
            : 'Comprueba que los datos y teléfonos sean legibles.'}
        </p>
      </section>
    </>,
    document.body,
  );
}
