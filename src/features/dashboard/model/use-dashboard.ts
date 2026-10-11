'use client';

import type { AgeGroupId, Sex } from '@/features/patients/model/demographics';
import type { Patient } from '@/features/patients/model/patient';
import type { PatientFilters } from '@/features/patients/model/patient-filters';
import { emptyPatientFilters, filterPatients } from '@/features/patients/model/patient-filters';
import { cardUrl } from '@/shared/lib/patient-url';
import { useCallback, useEffect, useState } from 'react';

export type DashboardView = 'overview' | 'patients' | 'qr';
type PatientDialog = { patient: Patient; trigger?: HTMLElement } | null;
type ExportDialog = {
  patient: Patient;
  action: 'download' | 'share';
  trigger?: HTMLElement;
} | null;

/** Session state only. Persistence and administrator authentication are not implemented. */
export function useDashboard(initialPatients: Patient[]) {
  const [view, setView] = useState<DashboardView>('overview');
  const [patients, setPatients] = useState(initialPatients);
  const [filters, setFilters] = useState<PatientFilters>(emptyPatientFilters);
  const [mobileNav, setMobileNav] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [workshop, setWorkshop] = useState<PatientDialog>(null);
  const [exportState, setExportState] = useState<ExportDialog>(null);
  const [publicPreview, setPublicPreview] = useState<Patient | null>(null);
  const [help, setHelp] = useState(false);
  const [toast, setToast] = useState('');
  const [motionPaused, setMotionPaused] = useState(false);
  const [focusSearch, setFocusSearch] = useState(false);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditing(null);
  }, []);
  const closeWorkshop = useCallback(() => setWorkshop(null), []);
  const closeExport = useCallback(() => setExportState(null), []);
  const closePreview = useCallback(() => setPublicPreview(null), []);
  const closeHelp = useCallback(() => setHelp(false), []);

  useEffect(() => {
    try {
      setMotionPaused(localStorage.getItem('vitalia-motion-paused') === 'true');
    } catch {
      /* The animation preference is optional. */
    }
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (mobileNav) {
      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setMobileNav(false);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [mobileNav]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
      // Leave keyboard shortcuts to the active modal when one is open.
      if (document.querySelector('[role="dialog"]')) return;
      event.preventDefault();
      if (view === 'overview') {
        setView('patients');
        setFocusSearch(true);
      } else document.querySelector<HTMLInputElement>('.search-box input')?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view]);
  useEffect(() => {
    if (!focusSearch || view === 'overview') return;
    document.querySelector<HTMLInputElement>('.search-box input')?.focus();
    setFocusSearch(false);
  }, [focusSearch, view]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  function navigate(next: DashboardView) {
    setView(next);
    setMobileNav(false);
    setFilters(emptyPatientFilters);
  }
  function openSegment(segment: 'allergies' | 'conditions') {
    navigate('patients');
    setFilters({ ...emptyPatientFilters, segment });
  }
  function openDemographic(age: AgeGroupId | 'all', sex: Sex | 'all') {
    navigate('patients');
    setFilters({ ...emptyPatientFilters, age, sex });
  }
  function savePatient(patient: Patient) {
    setPatients((current) =>
      editing
        ? current.map((existing) => (existing.id === patient.id ? patient : existing))
        : [...current, patient],
    );
    setToast(editing ? 'Ficha actualizada en esta sesión' : 'Ficha creada en esta sesión');
    closeForm();
  }
  function applyPersonalization(patient: Patient) {
    setPatients((current) =>
      current.map((existing) => (existing.id === patient.id ? patient : existing)),
    );
    setToast('Personalización aplicada a su ficha y tarjeta');
  }
  function toggleMotion() {
    const next = !motionPaused;
    setMotionPaused(next);
    try {
      localStorage.setItem('vitalia-motion-paused', String(next));
    } catch {
      /* Keep the preference for this session. */
    }
  }
  async function share(patient: Patient) {
    if (!navigator.share) {
      setExportState({ patient, action: 'share' });
      return;
    }
    try {
      await navigator.share({
        title: `Ficha de emergencia · ${patient.name}`,
        url: cardUrl(patient.id, patient.design),
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        setExportState({ patient, action: 'share' });
    }
  }
  async function copy(patient: Patient) {
    try {
      await navigator.clipboard.writeText(cardUrl(patient.id, patient.design));
      closeExport();
      setToast('Enlace de la ficha copiado');
    } catch {
      setToast('Selecciona el enlace y cópialo manualmente.');
    }
  }

  return {
    view,
    patients,
    filtered: filterPatients(patients, filters),
    filters,
    mobileNav,
    setMobileNav,
    navigate,
    formOpen,
    editing,
    closeForm,
    savePatient,
    newPatient: () => {
      setEditing(null);
      setFormOpen(true);
    },
    editPatient: (patient: Patient) => {
      setEditing(patient);
      setFormOpen(true);
    },
    nextId: editing?.id ?? `VT-${String(patients.length + 1).padStart(3, '0')}`,
    workshop,
    closeWorkshop,
    applyPersonalization,
    personalize: (patient: Patient, trigger: HTMLElement) => setWorkshop({ patient, trigger }),
    exportState,
    closeExport,
    download: (patient: Patient, trigger: HTMLElement) =>
      setExportState({ patient, action: 'download', trigger }),
    publicPreview,
    preview: setPublicPreview,
    closePreview,
    help,
    openHelp: () => setHelp(true),
    closeHelp,
    toast,
    dismissToast: () => setToast(''),
    motionPaused,
    toggleMotion,
    openSegment,
    openDemographic,
    share,
    copy,
    updateFilters: (changes: Partial<PatientFilters>) =>
      setFilters((current) => ({ ...current, ...changes })),
    resetFilters: () => setFilters(emptyPatientFilters),
  };
}

export type DashboardController = ReturnType<typeof useDashboard>;
