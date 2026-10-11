'use client';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
export function Dialog({
  children,
  onClose,
  label,
  className = '',
}: {
  children: React.ReactNode;
  onClose: () => void;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [closing, setClosing] = useState(false);
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.querySelector('[data-motion="paused"]')
    ) {
      onClose();
      return;
    }
    closingRef.current = true;
    setClosing(true);
    closeTimer.current = setTimeout(onClose, 160);
  }, [onClose]);
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
      if (e.key === 'Tab') {
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input, textarea, select, [tabindex="0"]',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first || document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', handler);
      previous?.focus();
    };
  }, [onClose, requestClose]);
  return (
    <div className={`dialog-backdrop ${closing ? 'is-closing' : ''}`} onClick={requestClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`dialog ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="dialog-close icon-button" onClick={requestClose} aria-label="Cerrar">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
