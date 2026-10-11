'use client';

import { Check, Copy, Share2 } from 'lucide-react';
import { useState } from 'react';

export function ShareEmergency({
  url,
  title,
  className = '',
  compact = false,
}: {
  url: string;
  title: string;
  className?: string;
  compact?: boolean;
}) {
  const [fallback, setFallback] = useState(false);
  const [message, setMessage] = useState('');
  async function share() {
    setMessage('');
    const destination = new URL(url, window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url: destination });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
    setFallback(true);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(new URL(url, window.location.origin).href);
      setMessage('Enlace copiado');
    } catch {
      setMessage('Selecciona el enlace para copiarlo.');
    }
  }
  return (
    <div className={`native-share ${className}`}>
      <button
        type="button"
        onClick={share}
        className="share-trigger"
        aria-label="Compartir ficha de emergencia"
        title="Compartir ficha"
      >
        <Share2 size={19} />
        {!compact && <span>Compartir ficha</span>}
      </button>
      {fallback && (
        <div className="share-fallback">
          <label>
            Enlace de emergencia
            <input
              aria-label="Enlace de emergencia"
              value={
                url.startsWith('http')
                  ? url
                  : typeof window !== 'undefined'
                    ? new URL(url, window.location.origin).href
                    : url
              }
              readOnly
              onFocus={(event) => event.target.select()}
            />
          </label>
          <button type="button" onClick={copy}>
            {message === 'Enlace copiado' ? <Check size={16} /> : <Copy size={16} />} Copiar enlace
          </button>
          <button type="button" onClick={() => setFallback(false)}>
            Cerrar
          </button>
          <p>En dispositivos compatibles se abre la hoja de compartir de iOS o Android.</p>
        </div>
      )}
      {message && (
        <span className="share-feedback" role="status">
          {message}
        </span>
      )}
    </div>
  );
}
