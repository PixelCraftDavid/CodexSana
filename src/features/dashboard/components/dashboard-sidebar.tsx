'use client';

import { Brand } from '@/shared/ui/ui';
import {
  ArrowUpRight,
  CircleHelp,
  Heart,
  LayoutDashboard,
  LockKeyhole,
  Pencil,
  QrCode,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import type { DashboardView } from '../model/use-dashboard';

type Props = {
  view: DashboardView;
  patientCount: number;
  open: boolean;
  onNavigate: (view: DashboardView) => void;
  onClose: () => void;
  onHelp: () => void;
};

const navigation = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
  { id: 'patients', label: 'Pacientes', icon: Users },
  { id: 'qr', label: 'Tarjetas y QR', icon: QrCode },
] as const;

export function DashboardSidebar({ view, patientCount, open, onNavigate, onClose, onHelp }: Props) {
  return (
    <>
      {open && <button className="nav-scrim" onClick={onClose} aria-label="Cerrar navegación" />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <Link href="/" className="sidebar-brand" aria-label="CodexSana, inicio">
          <Brand />
        </Link>
        <div className="workspace">
          <span className="workspace-icon">
            <Heart size={17} />
          </span>
          <div>
            <strong>Mi espacio</strong>
            <span>Administrador único</span>
          </div>
          <LockKeyhole size={13} />
        </div>
        <p className="nav-label">ADMINISTRACIÓN</p>
        <nav aria-label="Navegación principal">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`nav-item ${view === id ? 'active' : ''}`}
              aria-current={view === id ? 'page' : undefined}
            >
              <Icon size={18} /> {label}
              {id === 'patients' ? (
                <span className="nav-count">{patientCount}</span>
              ) : (
                <span className="active-dot" />
              )}
            </button>
          ))}
        </nav>
        <p className="nav-label studio-nav-label">ESTUDIO DE DISEÑO</p>
        <nav aria-label="Estudio de diseño">
          <Link href="/conceptos/anatomico" className="concepts-sidebar-link">
            <Pencil size={18} /> Diseños y QR <ArrowUpRight size={13} />
          </Link>
          <Link href="/conceptos/michi-sol" className="concepts-sidebar-link">
            <Heart size={18} /> Diseños infantiles <ArrowUpRight size={13} />
          </Link>
        </nav>
        <div className="sidebar-message">
          <h3>
            Un pequeño QR.
            <br />
            Una gran tranquilidad.
          </h3>
          <p>Información esencial, siempre al alcance.</p>
          <button onClick={onHelp}>
            Conoce cómo funciona <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="sidebar-bottom">
          <button className="support-link" onClick={onHelp}>
            <CircleHelp size={17} /> Centro de ayuda <ArrowUpRight size={14} />
          </button>
          <div className="admin-profile">
            <span className="admin-avatar">DP</span>
            <div>
              <strong>David Pacheco</strong>
              <span>Administrador</span>
            </div>
            <ShieldCheck size={17} />
          </div>
        </div>
      </aside>
    </>
  );
}
