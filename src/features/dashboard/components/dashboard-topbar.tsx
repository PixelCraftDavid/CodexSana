'use client';

import { ChevronRight, Menu, Pause, Play } from 'lucide-react';
import type { DashboardView } from '../model/use-dashboard';

export const dashboardPages = {
  overview: {
    label: 'Resumen',
    title: 'Cuidar empieza aquí',
    description: 'Lo esencial de tu comunidad, en un solo lugar.',
  },
  patients: {
    label: 'Pacientes',
    title: 'Personas, primero',
    description: 'Cada ficha es una persona con una historia.',
  },
  qr: {
    label: 'Tarjetas y QR',
    title: 'Tarjetas y QR',
    description: 'Personaliza, revisa y entrega. Cada tarjeta, a su manera.',
  },
};

type Props = {
  view: DashboardView;
  motionPaused: boolean;
  menuOpen: boolean;
  onMenu: () => void;
  onToggleMotion: () => void;
};

export function DashboardTopbar({ view, motionPaused, menuOpen, onMenu, onToggleMotion }: Props) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <button
          className="mobile-menu icon-button"
          onClick={onMenu}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <Menu size={21} />
        </button>
        <span>Mi espacio</span>
        <ChevronRight size={13} />
        <strong>{dashboardPages[view].label}</strong>
      </div>
      <div className="topbar-right">
        <button
          className="motion-toggle"
          onClick={onToggleMotion}
          aria-pressed={motionPaused}
          aria-label={motionPaused ? 'Activar animaciones' : 'Pausar animaciones'}
        >
          {motionPaused ? <Play size={13} /> : <Pause size={13} />}
          <span>{motionPaused ? 'Activar movimiento' : 'Pausar movimiento'}</span>
        </button>
        <span className="demo-chip">
          <span />
          Modo diseño
        </span>
        <span className="topbar-avatar">DP</span>
      </div>
    </header>
  );
}
