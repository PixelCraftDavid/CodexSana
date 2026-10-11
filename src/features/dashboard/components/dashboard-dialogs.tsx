'use client';
import { patients as demoPatients } from '@/data/demo-patients';
import { CardExportDialog } from '@/features/cards/components/card-export-dialog';
import { CardWorkshopDialog } from '@/features/cards/components/card-workshop-dialog';
import { cardOptions } from '@/features/cards/model/card-customization';
import { PatientDesignPreview } from '@/features/designs/components/patient-design-picker';
import { PatientForm } from '@/features/patients/components/patient-form';
import { PatientQR } from '@/features/qr/components/patient-qr';
import { cardUrl } from '@/shared/lib/patient-url';
import { Dialog } from '@/shared/ui/dialog';
import { SectionTitle } from '@/shared/ui/ui';
import { ArrowRight, ArrowUpRight, Check, Heart, QrCode, Share2, X } from 'lucide-react';
import Link from 'next/link';
import type { DashboardController } from '../model/use-dashboard';

export function DashboardDialogs({ state }: { state: DashboardController }) {
  const { workshop, formOpen, editing, exportState, publicPreview, help, toast } = state;
  return (
    <>
      {workshop && (
        <CardWorkshopDialog
          patient={workshop.patient}
          returnFocusTo={workshop.trigger}
          onClose={state.closeWorkshop}
          onApply={state.applyPersonalization}
        />
      )}
      {formOpen && (
        <PatientForm
          onClose={state.closeForm}
          initialPatient={editing}
          onSave={state.savePatient}
          nextId={state.nextId}
        />
      )}
      {exportState?.action === 'download' && (
        <CardExportDialog
          options={cardOptions(exportState.patient)}
          theme={exportState.patient.design}
          patient={exportState.patient}
          url={cardUrl(exportState.patient.id, exportState.patient.design)}
          returnFocusTo={exportState.trigger}
          onClose={state.closeExport}
          note={
            demoPatients.some((p) => p.id === exportState.patient.id)
              ? 'El enlace funciona mientras esté activo el servidor local.'
              : 'Ficha temporal: su QR requiere persistencia para funcionar fuera de esta sesión.'
          }
        />
      )}
      {exportState?.action === 'share' && (
        <Dialog onClose={state.closeExport} label="Compartir ficha">
          <div className="export-icon">
            <QrCode size={25} />
          </div>
          <div className="eyebrow">UNA CONEXIÓN QUE CUIDA</div>
          <h2>Comparte tranquilidad.</h2>
          <p className="dialog-description">Ficha de emergencia de {exportState.patient.name}</p>
          <div className="export-qr">
            <PatientQR patient={exportState.patient} size={180} />
          </div>
          <input
            className="share-url"
            readOnly
            value={cardUrl(exportState.patient.id, exportState.patient.design)}
            aria-label="Enlace para compartir"
            onFocus={(event) => event.target.select()}
          />
          <button
            className="button primary full-width"
            onClick={() => state.copy(exportState.patient)}
          >
            <Share2 size={17} /> Copiar enlace
          </button>
        </Dialog>
      )}
      {publicPreview && (
        <Dialog
          onClose={state.closePreview}
          label="Ficha pública de emergencia"
          className="public-preview-dialog"
        >
          <div className="preview-dialog-bar">
            <span>Vista pública · Datos ficticios</span>
            {demoPatients.some((p) => p.id === publicPreview.id) && (
              <Link href={cardUrl(publicPreview.id, publicPreview.design)} target="_blank">
                Abrir página <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
          <PatientDesignPreview patient={publicPreview} />
        </Dialog>
      )}
      {help && (
        <Dialog onClose={state.closeHelp} label="Cómo funciona CodexSana">
          <div className="export-icon">
            <Heart size={26} />
          </div>
          <div className="eyebrow">SIMPLE, POR DISEÑO</div>
          <h2>
            Ayudar empieza
            <br />
            con información.
          </h2>
          <div className="help-steps">
            <SectionTitle
              number="01"
              title="Registra a la persona"
              detail="Completa su información junto a ella."
            />
            <SectionTitle
              number="02"
              title="Prepara su tarjeta"
              detail="Elige el diseño y si llevará QR o datos impresos."
            />
            <SectionTitle
              number="03"
              title="Haz visible lo esencial"
              detail="Revisa ambos lados y sus contactos antes de entregar."
            />
          </div>
          <p className="prototype-note">
            Esta entrega presenta el diseño y las interacciones. El acceso privado, la base de datos
            y las fichas permanentes se implementarán en la etapa de lógica.
          </p>
          <button
            className="button primary full-width"
            onClick={() => {
              state.closeHelp();
              state.newPatient();
            }}
          >
            Crear una ficha de muestra <ArrowRight size={17} />
          </button>
        </Dialog>
      )}
      {toast && (
        <div className="toast" role="status">
          <span>
            <Check size={16} />
          </span>
          {toast}
          <button onClick={state.dismissToast} aria-label="Cerrar mensaje">
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}
