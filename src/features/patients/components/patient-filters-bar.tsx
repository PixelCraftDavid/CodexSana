'use client';

import { ageGroups, sexGroups } from '@/features/patients/model/demographics';
import { ArrowUpDown, Search, X } from 'lucide-react';

import type { PatientFilters } from '@/features/patients/model/patient-filters';

export function PatientFiltersBar({
  filters,
  onFilters,
  onReset,
}: {
  filters: PatientFilters;
  onFilters: (changes: Partial<PatientFilters>) => void;
  onReset: () => void;
}) {
  const hasFilters =
    filters.search || filters.segment !== 'all' || filters.age !== 'all' || filters.sex !== 'all';
  return (
    <div className="directory-filters">
      <label className="search-box">
        <Search size={17} />
        <input
          value={filters.search}
          onChange={(event) => onFilters({ search: event.target.value })}
          placeholder="Buscar nombre o ID…"
          aria-label="Buscar pacientes"
        />
        <kbd>Ctrl K</kbd>
      </label>
      <label>
        <span>Etapa de vida</span>
        <select
          value={filters.age}
          onChange={(event) => onFilters({ age: event.target.value as PatientFilters['age'] })}
          aria-label="Filtrar por etapa de vida"
        >
          <option value="all">Todas las edades</option>
          {ageGroups.map((group) => (
            <option value={group.id} key={group.id}>
              {group.label} · {group.range}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Sexo registrado</span>
        <select
          value={filters.sex}
          onChange={(event) => onFilters({ sex: event.target.value as PatientFilters['sex'] })}
          aria-label="Filtrar por sexo"
        >
          <option value="all">Todos los sexos</option>
          {sexGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Información</span>
        <select
          value={filters.segment}
          onChange={(event) =>
            onFilters({ segment: event.target.value as PatientFilters['segment'] })
          }
          aria-label="Filtrar por información reportada"
        >
          <option value="all">Todos los registros</option>
          <option value="allergies">Con alergias</option>
          <option value="conditions">Con padecimientos</option>
        </select>
      </label>
      <button
        className="directory-sort"
        onClick={() => onFilters({ ascending: !filters.ascending })}
        aria-pressed={filters.ascending}
        aria-label={
          filters.ascending ? 'Restaurar orden de registro' : 'Ordenar pacientes de A a Z'
        }
      >
        <ArrowUpDown size={16} />
        <span>{filters.ascending ? 'A–Z' : 'Ordenar'}</span>
      </button>
      {hasFilters && (
        <button className="text-action directory-reset" onClick={onReset}>
          <X size={14} /> Limpiar filtros
        </button>
      )}
    </div>
  );
}
