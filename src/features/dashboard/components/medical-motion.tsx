'use client';

import { Activity, ArrowUpRight, HeartPulse } from 'lucide-react';
import { useEffect, useState } from 'react';

/** Decorative SVG: never represents a live measurement or a clinical reading. */
export function PulseTrace({ className = '' }: { className?: string }) {
  return (
    <svg className={`pulse-trace ${className}`} viewBox="0 0 360 56" fill="none" aria-hidden="true">
      <path
        className="pulse-baseline"
        d="M0 29H85L95 23L106 34L119 29H144L156 8L169 49L183 18L195 29H239L251 24L263 33L277 29H360"
      />
      <path
        className="pulse-travel"
        d="M0 29H85L95 23L106 34L119 29H144L156 8L169 49L183 18L195 29H239L251 24L263 33L277 29H360"
        pathLength="100"
      />
    </svg>
  );
}

export function AnatomicalHeart() {
  return (
    <svg className="anatomical-heart" viewBox="0 0 240 230" fill="none" aria-hidden="true">
      <circle className="heart-orbit" cx="121" cy="128" r="87" />
      <circle className="heart-orbit orbit-inner" cx="121" cy="128" r="66" />
      <g className="arterial-branches" strokeLinecap="round" strokeLinejoin="round">
        <path d="M115 76V41C115 21 95 20 87 32M115 47L128 26V12M115 39L106 22V10M128 26L146 27V14" />
        <path d="M147 93V62C147 44 165 38 177 47L190 57M164 42V25M177 47L193 33" />
        <path className="vein-branch" d="M90 95L76 76V42M76 65L59 50M76 75L54 73" />
        <path
          className="artery-flow"
          d="M115 76V41C115 21 95 20 87 32M115 47L128 26V12M147 93V62C147 44 165 38 177 47L190 57"
        />
      </g>
      <g className="heart-muscle">
        <path
          className="heart-body"
          d="M117 76C137 66 163 79 171 105C178 130 165 159 148 180C137 193 126 205 117 209C107 205 90 188 79 172C65 151 59 132 66 108C72 89 91 78 105 88L117 76Z"
        />
        <path
          className="heart-lobe"
          d="M117 76C110 99 119 118 128 139C138 161 131 187 117 209C107 205 90 188 79 172C65 151 59 132 66 108C72 89 91 78 105 88L117 76Z"
        />
        <path
          className="coronary-vessel"
          d="M117 88C114 108 121 120 128 138L111 150L100 174M128 138L145 152L151 171M120 117L96 120L78 137M111 150L88 150M145 152L158 145"
        />
        <path
          className="coronary-flow"
          d="M117 88C114 108 121 120 128 138L111 150L100 174M128 138L145 152L151 171"
        />
        <path className="heart-highlight" d="M139 86C152 90 160 104 160 118" />
      </g>
      <circle className="anatomy-node node-one" cx="59" cy="50" r="3" />
      <circle className="anatomy-node node-two" cx="190" cy="57" r="3" />
      <circle className="anatomy-node node-three" cx="128" cy="12" r="3" />
    </svg>
  );
}

export function AnimatedNumber({
  value,
  currency = false,
  paused = false,
}: {
  value: number;
  currency?: boolean;
  paused?: boolean;
}) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (paused || media.matches) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / 750, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, paused]);
  return (
    <span
      className="animated-number"
      aria-label={currency ? `$${value.toLocaleString('es-MX')}` : String(value)}
    >
      <span aria-hidden="true">
        {currency ? `$${display.toLocaleString('es-MX')}` : String(display).padStart(2, '0')}
      </span>
    </span>
  );
}

export function RecordSignals({
  allergies,
  conditions,
  onAllergies,
  onConditions,
}: {
  allergies: number;
  conditions: number;
  onAllergies: () => void;
  onConditions: () => void;
}) {
  return (
    <article className="record-signals">
      <div className="signals-heading">
        <HeartPulse size={17} />
        <span>DATOS PARA TENER PRESENTES</span>
      </div>
      <button onClick={onAllergies}>
        <span>
          <i className="signal-coral" />
          Alergias reportadas
        </span>
        <strong>{String(allergies).padStart(2, '0')}</strong>
        <ArrowUpRight size={14} />
      </button>
      <button onClick={onConditions}>
        <span>
          <i className="signal-green" />
          Padecimientos reportados
        </span>
        <strong>{String(conditions).padStart(2, '0')}</strong>
        <ArrowUpRight size={14} />
      </button>
      <p>
        <Activity size={12} /> Clasificación por información registrada.
      </p>
    </article>
  );
}
