'use client';

import { CardFormatPicker } from '@/features/cards/components/card-format-picker';
import { CardWorkshopDialog } from '@/features/cards/components/card-workshop-dialog';
import {
  defaultCardCustomization,
  type CardCustomization,
} from '@/features/cards/model/card-customization';
import { PatientDesignPicker } from '@/features/designs/components/patient-design-picker';
import type { PatientDesign } from '@/features/designs/model/patient-designs';
import { Dialog } from '@/shared/ui/dialog';
import { SectionTitle } from '@/shared/ui/ui';
import { ArrowRight, Palette, ShieldCheck } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { readPatientForm } from '../lib/read-patient-form';
import type { Patient } from '../model/patient';
import { ContactFields, IdentityFields, MedicalFields, PhotoUpload } from './patient-form-fields';

type Props = {
  onClose: () => void;
  onSave: (patient: Patient) => void;
  nextId: string;
  initialPatient: Patient | null;
};

export function PatientForm({ onClose, onSave, nextId, initialPatient }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const workshopTrigger = useRef<HTMLButtonElement | null>(null);
  const [cardStyle, setCardStyle] = useState<CardCustomization>({
    ...defaultCardCustomization,
    ...initialPatient?.cardStyle,
  });
  const [design, setDesign] = useState<PatientDesign>(initialPatient?.design ?? 'vitalia');
  const [photo, setPhoto] = useState(initialPatient?.photo ?? '');
  const [photoError, setPhotoError] = useState('');
  const [contactCount, setContactCount] = useState(initialPatient?.contacts.length ?? 1);
  const [workshopPatient, setWorkshopPatient] = useState<Patient | null>(null);

  function readPatient(form: HTMLFormElement) {
    return readPatientForm(form, {
      id: nextId,
      design,
      cardStyle,
      photo,
      color: initialPatient?.color ?? 'peach',
      contactCount,
    });
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(readPatient(event.currentTarget));
  }
  function personalize(trigger: HTMLButtonElement) {
    if (!formRef.current) return;
    workshopTrigger.current = trigger;
    const draft = readPatient(formRef.current);
    setWorkshopPatient({
      ...draft,
      name: draft.name || 'Tu nombre',
      blood: draft.blood || 'Desconocido',
    });
  }

  return (
    <Dialog
      onClose={onClose}
      label={initialPatient ? 'Editar paciente' : 'Nuevo paciente'}
      className="form-dialog"
    >
      <div className="form-heading">
        <div className="eyebrow">UNA NUEVA PERSONA, MÁS TRANQUILIDAD</div>
        <h2>
          {initialPatient ? 'Actualizar ficha' : 'Crear ficha'}
          <span>.</span>
        </h2>
        <p>Completa los datos junto al paciente.</p>
      </div>
      <form ref={formRef} onSubmit={submit}>
        <div className="form-body">
          <SectionTitle
            number="01"
            title="El diseño de su ficha"
            detail="Una identidad para su ficha y su tarjeta."
          />
          <PatientDesignPicker value={design} onChange={setDesign} />
          <CardFormatPicker
            includeQR={cardStyle.includeQR !== false}
            onChange={(includeQR) => setCardStyle((current) => ({ ...current, includeQR }))}
          />
          <button
            type="button"
            className="personalize-form-button"
            onClick={(event) => personalize(event.currentTarget)}
          >
            <Palette size={16} /> Personalizar tarjeta
          </button>
          <div className="form-divider" />
          <SectionTitle number="02" title="La persona" detail="Primero, lo que la hace única." />
          <PhotoUpload
            photo={photo}
            error={photoError}
            onPhoto={setPhoto}
            onError={setPhotoError}
          />
          <IdentityFields patient={initialPatient} />
          <div className="form-divider" />
          <MedicalFields patient={initialPatient} />
          <div className="form-divider" />
          <ContactFields patient={initialPatient} count={contactCount} onCount={setContactCount} />
          <div className="form-consent">
            <ShieldCheck size={17} />
            <p>
              Datos reportados por el titular. No sustituye la valoración médica. Confirma la
              información con el titular o su representante antes de crear su ficha pública. Las
              fichas de esta vista son temporales.
            </p>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button primary">
            {initialPatient ? 'Guardar cambios' : 'Crear ficha de muestra'} <ArrowRight size={17} />
          </button>
        </div>
      </form>
      {workshopPatient && (
        <CardWorkshopDialog
          patient={workshopPatient}
          returnFocusTo={workshopTrigger.current ?? undefined}
          onClose={() => setWorkshopPatient(null)}
          onApply={(patient) => {
            setDesign(patient.design ?? 'vitalia');
            setCardStyle(patient.cardStyle ?? defaultCardCustomization);
          }}
        />
      )}
    </Dialog>
  );
}
