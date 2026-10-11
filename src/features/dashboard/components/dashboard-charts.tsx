'use client';

import {
  demographicCounts,
  demoRevenue,
  demoSales,
  type AgeGroupId,
  type Sex,
} from '@/features/patients/model/demographics';
import type { Patient } from '@/features/patients/model/patient';
import { ArrowUpRight, BarChart3, CalendarDays, Users } from 'lucide-react';
import { useId, useState, type CSSProperties } from 'react';

type Props = { patients: Patient[]; onAge: (group: AgeGroupId) => void; onSex: (sex: Sex) => void };
const percentage = (count: number, total: number) =>
  total ? Math.round((count / total) * 100) : 0;
export function DashboardCharts({ patients, onAge, onSex }: Props) {
  const { ages, sexes } = demographicCounts(patients);
  const [activeSex, setActiveSex] = useState<Sex | null>(null);
  const selected = sexes.find((group) => group.id === activeSex);
  const total = patients.length;
  const known = total - sexes.find((group) => group.id === 'unknown')!.count;
  let offset = 0;
  return (
    <section className="analytics-grid" aria-label="Gráficas del dashboard">
      <RevenueChart />
      <article className="analytics-card age-chart">
        <div className="analytics-heading">
          <div>
            <span className="analytics-eyebrow">CONOCE TU COMUNIDAD</span>
            <h3>Etapas de vida</h3>
          </div>
          <Users size={18} />
        </div>
        <div className="analytics-subhead">
          <span>{total} pacientes registrados</span>
          <small>Selecciona un grupo</small>
        </div>
        <div className="age-bars">
          {ages.map((group) => (
            <button
              key={group.id}
              onClick={() => onAge(group.id)}
              className="age-bar-row"
              aria-label={`Filtrar ${group.label}: ${group.count} pacientes, ${group.range}`}
            >
              <span className="age-bar-label">
                <strong>{group.label}</strong>
                <small>{group.range}</small>
              </span>
              <span className="age-track">
                <span
                  style={{ width: `${percentage(group.count, total)}%`, background: group.color }}
                />
              </span>
              <span className="age-bar-count">
                {group.count}
                <small>{percentage(group.count, total)}%</small>
              </span>
            </button>
          ))}
        </div>
        <p className="chart-footnote">Rangos administrativos, sin superposición.</p>
      </article>
      <article className="analytics-card sex-chart">
        <div className="analytics-heading">
          <div>
            <span className="analytics-eyebrow">INFORMACIÓN REGISTRADA</span>
            <h3>Distribución por sexo</h3>
          </div>
          <BarChart3 size={18} />
        </div>
        <div className="sex-chart-body">
          <div className="donut-wrap">
            <svg
              className="sex-donut"
              viewBox="0 0 160 160"
              role="img"
              aria-label={`Distribución por sexo de ${total} pacientes: ${sexes.map((group) => `${group.label} ${group.count}`).join(', ')}`}
            >
              <circle cx="80" cy="80" r="59" fill="none" stroke="#f0f3eb" strokeWidth="15" />
              {sexes
                .filter((group) => group.count > 0)
                .map((group) => {
                  const length = (group.count / total) * 100;
                  const start = offset;
                  offset += length;
                  return (
                    <circle
                      key={group.id}
                      cx="80"
                      cy="80"
                      r="59"
                      pathLength="100"
                      fill="none"
                      stroke={group.color}
                      strokeWidth={activeSex === group.id ? 19 : 15}
                      strokeDasharray={`${length} ${100 - length}`}
                      strokeDashoffset={-start}
                      transform="rotate(-90 80 80)"
                      className="donut-segment"
                    />
                  );
                })}
            </svg>
            <div className="donut-center">
              <strong>{selected ? selected.count : total}</strong>
              <span>{selected ? selected.label : 'pacientes'}</span>
            </div>
          </div>
          <div className="sex-legend">
            {sexes.map((group) => (
              <button
                key={group.id}
                onClick={() => onSex(group.id)}
                onMouseEnter={() => setActiveSex(group.id)}
                onMouseLeave={() => setActiveSex(null)}
                onFocus={() => setActiveSex(group.id)}
                onBlur={() => setActiveSex(null)}
                aria-label={`Filtrar sexo ${group.label}: ${group.count} pacientes`}
              >
                <i style={{ background: group.color }} />
                <span>{group.label}</span>
                <strong>{group.count}</strong>
                <small>{percentage(group.count, total)}%</small>
              </button>
            ))}
          </div>
        </div>
        <p className="chart-footnote">
          {known} de {total} fichas tienen el sexo registrado. <span>Sin inferencias.</span>
        </p>
      </article>
    </section>
  );
}

function RevenueChart() {
  const gradientId = useId().replace(/:/g, '');
  const [activeDay, setActiveDay] = useState(5);
  const sale = demoSales[activeDay];
  const max = 600;
  const points = demoSales.map((entry, index) => ({
    x: 30 + index * 48,
    y: 139 - (entry.amount / max) * 106,
  }));
  const line = points.map((point, index) => `${index ? 'L' : 'M'}${point.x},${point.y}`).join(' ');
  const area = `${line}L270,139L30,139Z`;
  return (
    <article className="analytics-card revenue-chart">
      <div className="analytics-heading">
        <div>
          <span className="analytics-eyebrow">VENTAS DE DEMOSTRACIÓN</span>
          <h3>Ingresos por día</h3>
        </div>
        <span className="chart-period">
          <CalendarDays size={11} /> 04–09 oct
        </span>
      </div>
      <div className="revenue-topline">
        <strong>
          ${demoRevenue.toLocaleString('es-MX')}
          <small> MXN</small>
        </strong>
        <span>
          6 ventas <ArrowUpRight size={12} />
        </span>
      </div>
      <div className="revenue-chart-plot">
        <svg
          viewBox="0 0 300 174"
          role="img"
          aria-label={`Ingresos diarios ficticios: ${demoSales.map((entry) => `${entry.day} ${entry.amount} pesos`).join(', ')}`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a2bd87" stopOpacity=".22" />
              <stop offset="100%" stopColor="#a2bd87" stopOpacity=".01" />
            </linearGradient>
          </defs>
          {[0, 300, 600].map((value) => (
            <g key={value}>
              <line
                x1="30"
                x2="280"
                y1={139 - (value / max) * 106}
                y2={139 - (value / max) * 106}
                stroke="#e9eee1"
                strokeDasharray="3 5"
              />
              <text x="1" y={142 - (value / max) * 106} className="chart-axis">
                {value}
              </text>
            </g>
          ))}
          <path d={area} fill={`url(#${gradientId})`} className="chart-area" />
          <path
            d={line}
            fill="none"
            stroke="#719258"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="revenue-line"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={activeDay === index ? 4.5 : 3}
              fill={activeDay === index ? '#df987d' : '#fdfefb'}
              stroke={activeDay === index ? '#df987d' : '#719258'}
              strokeWidth="1.6"
            />
          ))}
          {demoSales.map((entry, index) => (
            <text
              key={entry.day}
              x={points[index].x}
              y="162"
              textAnchor="middle"
              className="chart-axis"
            >
              {entry.day.split(' ')[0]}
            </text>
          ))}
        </svg>
        <div className="revenue-day-controls">
          {demoSales.map((entry, index) => (
            <button
              key={entry.day}
              aria-label={`Ver ingresos del ${entry.day}: ${entry.amount} pesos`}
              aria-pressed={activeDay === index}
              onClick={() => setActiveDay(index)}
              onMouseEnter={() => setActiveDay(index)}
              onFocus={() => setActiveDay(index)}
              style={{ '--point-x': `${points[index].x / 3}%` } as CSSProperties}
            />
          ))}
        </div>
      </div>
      <div className="chart-tooltip" role="status">
        <span>{sale.day} 2026</span>
        <strong>${sale.amount.toLocaleString('es-MX')} MXN</strong>
      </div>
      <p className="chart-footnote">Cifras ilustrativas · sin cobros reales.</p>
    </article>
  );
}
