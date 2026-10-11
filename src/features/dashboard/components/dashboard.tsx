'use client';

import { patients as demoPatients } from '@/data/demo-patients';
import { DashboardDialogs } from '@/features/dashboard/components/dashboard-dialogs';
import { DashboardSidebar } from '@/features/dashboard/components/dashboard-sidebar';
import { DashboardTopbar, dashboardPages } from '@/features/dashboard/components/dashboard-topbar';
import { useDashboard } from '@/features/dashboard/model/use-dashboard';
import { Plus, ShieldCheck } from 'lucide-react';
import { DashboardOverview } from './dashboard-overview';
import { DashboardRecords } from './dashboard-records';

export function Dashboard() {
  const state = useDashboard(demoPatients);
  const page = dashboardPages[state.view];
  return (
    <div
      className="app-shell organized-dashboard"
      data-motion={state.motionPaused ? 'paused' : 'active'}
    >
      <DashboardSidebar
        view={state.view}
        patientCount={state.patients.length}
        open={state.mobileNav}
        onNavigate={state.navigate}
        onClose={() => state.setMobileNav(false)}
        onHelp={state.openHelp}
      />
      <div className="main-shell">
        <DashboardTopbar
          view={state.view}
          motionPaused={state.motionPaused}
          menuOpen={state.mobileNav}
          onMenu={() => state.setMobileNav(true)}
          onToggleMotion={state.toggleMotion}
        />
        <main className="dashboard-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="tiny-line" /> TU CENTRO DE CONTROL
              </div>
              <h1>
                {page.title}
                <span>.</span>
              </h1>
              <p>{page.description}</p>
            </div>
            <button className="button primary new-patient" onClick={state.newPatient}>
              <Plus size={18} /> Nuevo paciente
            </button>
          </div>
          {state.view === 'overview' ? (
            <DashboardOverview
              patients={state.patients}
              motionPaused={state.motionPaused}
              onPatients={() => state.navigate('patients')}
              onCards={() => state.navigate('qr')}
              onPreview={state.preview}
              onSegment={state.openSegment}
              onAge={(group) => state.openDemographic(group, 'all')}
              onSex={(sex) => state.openDemographic('all', sex)}
            />
          ) : (
            <DashboardRecords
              key={state.view}
              cards={state.view === 'qr'}
              patients={state.filtered}
              total={state.patients.length}
              filters={state.filters}
              onFilters={state.updateFilters}
              onReset={state.resetFilters}
              actions={{
                preview: state.preview,
                edit: state.editPatient,
                personalize: state.personalize,
                download: state.download,
                share: state.share,
              }}
            />
          )}
          <footer className="dashboard-footer">
            <span>
              <ShieldCheck size={14} /> Información que cuida.
            </span>
            <span>
              CodexSana © 2026 <span>·</span> Prototipo visual con datos ficticios
            </span>
          </footer>
        </main>
      </div>
      <DashboardDialogs state={state} />
    </div>
  );
}
