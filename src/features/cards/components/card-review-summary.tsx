import type { CardFaces } from '@/features/cards/lib/printable-card';
import { patientDesignName, type PatientDesign } from '@/features/designs/model/patient-designs';
import { Check, Info } from 'lucide-react';

export function CardReviewSummary({
  faces,
  theme,
  includeName,
}: {
  faces: CardFaces;
  theme: PatientDesign;
  includeName: boolean;
}) {
  return (
    <section className="card-review-summary" aria-label="Resumen de la tarjeta">
      <div>
        <Check size={16} />
        <strong>Así se imprimirá</strong>
      </div>
      <dl>
        <div>
          <dt>Diseño</dt>
          <dd>{patientDesignName(theme)}</dd>
        </div>
        <div>
          <dt>Formato</dt>
          <dd>{faces.includeQR ? 'Con QR' : 'Sin QR'} · frente y reverso</dd>
        </div>
        <div>
          <dt>Frente</dt>
          <dd>{includeName ? 'Nombre, ' : ''}edad, sangre e ilustración.</dd>
        </div>
        <div>
          <dt>Reverso</dt>
          <dd>
            {faces.includeQR
              ? 'Sangre, alergias, hasta dos contactos y QR.'
              : 'Sangre, alergias, hasta dos contactos, padecimientos y medicamentos.'}
          </dd>
        </div>
      </dl>
      <p>Incluye «Datos reportados por el titular» y «No sustituye la valoración médica».</p>
      {faces.warnings.length > 0 && (
        <div className="card-print-warnings" role="status">
          <Info size={17} />
          <div>
            <strong>Hay información extensa</strong>
            <ul>
              {faces.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
            <p>
              Revisa el reverso antes de imprimir. Puedes abreviar los datos junto al titular o
              elegir la versión con QR.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
