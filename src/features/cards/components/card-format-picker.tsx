'use client';

import { Check, CreditCard, QrCode } from 'lucide-react';
import { useId } from 'react';

export function CardFormatPicker({
  includeQR,
  onChange,
  disabled = false,
}: {
  includeQR: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <fieldset className="card-format-picker" disabled={disabled}>
      <legend>¿Cómo llevará su información?</legend>
      <p>Elige el contenido de la tarjeta impresa.</p>
      <div className="card-format-choice-grid">
        {[true, false].map((withQR) => (
          <label
            key={String(withQR)}
            className="card-format-choice"
            data-selected={includeQR === withQR}
          >
            <input
              type="radio"
              name={`card-qr-${id}`}
              checked={includeQR === withQR}
              onChange={() => onChange(withQR)}
              aria-label={withQR ? 'Tarjeta con QR' : 'Tarjeta sin QR'}
            />
            <span className="card-format-choice-icon" aria-hidden="true">
              {withQR ? <QrCode size={24} /> : <CreditCard size={24} />}
            </span>
            <span className="card-format-choice-text">
              <strong>{withQR ? 'Con QR' : 'Sin QR'}</strong>
              {withQR && <small className="card-format-recommended">RECOMENDADO</small>}
              <span>
                {withQR
                  ? 'Datos esenciales y enlace a la ficha completa.'
                  : 'Datos y contactos impresos, sin escanear.'}
              </span>
            </span>
            <span className="card-format-choice-check" aria-hidden="true">
              {includeQR === withQR && <Check size={13} />}
            </span>
          </label>
        ))}
      </div>
      <span className="card-format-context">
        {includeQR
          ? 'El reverso incluirá un QR para abrir la ficha.'
          : 'El reverso dedicará más espacio a contactos y datos reportados.'}
      </span>
    </fieldset>
  );
}
