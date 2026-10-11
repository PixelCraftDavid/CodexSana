import { SectionTitle } from '@/shared/ui/ui';
import { Plus, Upload, X } from 'lucide-react';
import { sexGroups } from '../model/demographics';
import type { Patient } from '../model/patient';

export function PhotoUpload({
  photo,
  error,
  onPhoto,
  onError,
}: {
  photo: string;
  error: string;
  onPhoto: (photo: string) => void;
  onError: (error: string) => void;
}) {
  return (
    <>
      <label className="photo-upload">
        <span className="photo-upload-preview">
          {photo ? <img src={photo} alt="Vista previa de la foto" /> : <Upload size={22} />}
        </span>
        <span>
          <strong>{photo ? 'Cambiar fotografía' : 'Agregar fotografía'}</strong>
          <small>JPG, PNG o WebP · Máx. 5 MB</small>
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (
              file.size > 5 * 1024 * 1024 ||
              !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
            ) {
              onError('Elige una imagen JPG, PNG o WebP de hasta 5 MB.');
              return;
            }
            onError('');
            const reader = new FileReader();
            reader.onload = () => onPhoto(String(reader.result));
            reader.readAsDataURL(file);
          }}
        />
      </label>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

export function IdentityFields({ patient }: { patient: Patient | null }) {
  return (
    <>
      <label className="field">
        Nombre completo <span>*</span>
        <input
          name="name"
          defaultValue={patient?.name ?? ''}
          placeholder="Ej. Sofía Martínez"
          required
          maxLength={100}
        />
      </label>
      <div className="form-grid">
        <label className="field">
          Edad <span>*</span>
          <input
            name="age"
            defaultValue={patient?.age ?? ''}
            type="number"
            min="0"
            max="120"
            placeholder="28"
            required
          />
        </label>
        <label className="field">
          Tipo de sangre <span>*</span>
          <select name="blood" defaultValue={patient?.blood ?? ''} required>
            <option value="" disabled>
              Seleccionar
            </option>
            {['O+', 'O−', 'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'Desconocido'].map((blood) => (
              <option key={blood}>{blood}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        Sexo registrado
        <select name="sex" defaultValue={patient?.sex ?? 'unknown'}>
          {sexGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.label}
            </option>
          ))}
        </select>
        <small className="field-hint">Captura el dato reportado por la persona. Es opcional.</small>
      </label>
    </>
  );
}

export function MedicalFields({ patient }: { patient: Patient | null }) {
  return (
    <>
      <SectionTitle
        number="03"
        title="Información esencial"
        detail="Datos que pueden hacer la diferencia."
      />
      <label className="field">
        Alergias
        <textarea
          defaultValue={patient?.allergies ?? ''}
          name="allergies"
          placeholder="Ej. Penicilina, frutos secos"
          rows={2}
        />
      </label>
      <div className="form-grid">
        <label className="field">
          Enfermedades crónicas
          <textarea
            name="conditions"
            defaultValue={patient?.conditions ?? ''}
            placeholder="Ej. Asma"
            rows={2}
          />
        </label>
        <label className="field">
          Medicamentos actuales
          <textarea
            name="medications"
            defaultValue={patient?.medications ?? ''}
            placeholder="Nombre e indicaciones reportadas"
            rows={2}
          />
        </label>
      </div>
    </>
  );
}

export function ContactFields({
  patient,
  count,
  onCount,
}: {
  patient: Patient | null;
  count: number;
  onCount: (count: number) => void;
}) {
  return (
    <>
      <SectionTitle
        number="04"
        title="A quién llamar"
        detail="Alguien de confianza, a una llamada."
      />
      {Array.from({ length: count }, (_, index) => (
        <fieldset className="contact-fields" key={index}>
          <legend>
            CONTACTO {String(index + 1).padStart(2, '0')}
            {index > 0 && (
              <button
                type="button"
                onClick={() => onCount(count - 1)}
                aria-label="Eliminar segundo contacto"
              >
                <X size={14} />
              </button>
            )}
          </legend>
          <label className="field">
            Nombre <span>*</span>
            <input
              name={`contact-name-${index}`}
              defaultValue={patient?.contacts[index]?.name ?? ''}
              placeholder="Ej. Elena Martínez"
              required
            />
          </label>
          <div className="form-grid">
            <label className="field">
              Relación <span>*</span>
              <input
                name={`contact-relation-${index}`}
                defaultValue={patient?.contacts[index]?.relationship ?? ''}
                placeholder="Ej. Madre"
                required
              />
            </label>
            <label className="field">
              Teléfono <span>*</span>
              <input
                name={`contact-phone-${index}`}
                defaultValue={patient?.contacts[index]?.phone ?? ''}
                type="tel"
                placeholder="+52 55 1234 5678"
                pattern="[+0-9 \(\)\-]{7,25}"
                title="Entre 7 y 25 caracteres: números, +, espacios, paréntesis o guiones"
                required
              />
            </label>
          </div>
        </fieldset>
      ))}
      {count < 2 && (
        <button type="button" className="add-contact" onClick={() => onCount(2)}>
          <Plus size={15} /> Agregar otro contacto
        </button>
      )}
    </>
  );
}
