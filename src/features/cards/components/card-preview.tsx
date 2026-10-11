'use client';

import type { CardFaces } from '@/features/cards/lib/printable-card';
import { svgSource } from '@/features/qr/lib/custom-qr';
import { RotateCw } from 'lucide-react';
import { useState } from 'react';

export function CardPreview({ faces, name }: { faces: CardFaces; name: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="card-preview-stage">
      <div className="card-side-controls" aria-label="Lado de la tarjeta">
        <button type="button" aria-pressed={!flipped} onClick={() => setFlipped(false)}>
          01 / Frente
        </button>
        <button type="button" aria-pressed={flipped} onClick={() => setFlipped(true)}>
          02 / Reverso
        </button>
      </div>
      <button
        type="button"
        className="card-flip-button"
        aria-label={flipped ? 'Ver frente de la tarjeta' : 'Ver reverso de la tarjeta'}
        onClick={() => setFlipped(!flipped)}
      >
        <span className="card-flip-inner" data-flipped={flipped}>
          <span className="card-face card-front" aria-hidden={flipped}>
            <img
              src={svgSource(faces.front)}
              alt={`Frente de la tarjeta de ${name}`}
              width={860}
              height={540}
            />
          </span>
          <span className="card-face card-back" aria-hidden={!flipped}>
            <img
              src={svgSource(faces.back)}
              alt={`Reverso de la tarjeta de ${name}, ${faces.includeQR ? 'con QR y contactos' : 'sin QR, con contactos y datos reportados'}`}
              width={860}
              height={540}
            />
          </span>
        </span>
      </button>
      <div className="card-flip-caption">
        <span>
          <RotateCw size={13} /> Toca la tarjeta para voltearla
        </span>
        <small>86 × 54 mm</small>
      </div>
    </div>
  );
}
