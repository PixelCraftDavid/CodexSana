'use client';
import { catBodySVG, catHeadSVG } from '@/features/designs/lib/cat-art';
import { isCompanionTheme, type KidsTheme } from '@/features/designs/model/kids-themes';
import { CompanionCharacter } from './companion-art';

export function KidsCharacter({
  theme,
  headOnly = false,
}: {
  theme: KidsTheme;
  headOnly?: boolean;
}) {
  if (isCompanionTheme(theme)) return <CompanionCharacter theme={theme} headOnly={headOnly} />;
  return (
    <svg
      viewBox={headOnly ? '38 18 185 155' : '0 0 260 300'}
      className={`cat-illustration ${headOnly ? 'head-only' : ''}`}
      aria-hidden="true"
    >
      {/* Shared, trusted local vector art; no user content is injected. */}
      {!headOnly && <g dangerouslySetInnerHTML={{ __html: catBodySVG(theme) }} />}
      <g dangerouslySetInnerHTML={{ __html: catHeadSVG(theme) }} />
    </svg>
  );
}
export function PawPrint({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="8" cy="14" rx="5" ry="7" transform="rotate(-25 8 14)" />
        <ellipse cx="18" cy="8" rx="5" ry="7" />
        <ellipse cx="29" cy="11" rx="5" ry="7" transform="rotate(20 29 11)" />
        <ellipse cx="35" cy="21" rx="4" ry="6" transform="rotate(30 35 21)" />
        <path d="M12 24Q18 15 24 23L32 30Q34 38 26 37L19 34 12 36Q3 35 8 28Z" />
      </g>
    </svg>
  );
}
export function CatGlasses({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 32" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <circle cx="16" cy="16" r="11" />
        <circle cx="44" cy="16" r="11" />
        <path d="M27 15Q30 11 33 15M5 14L1 12M55 14L59 12" />
      </g>
    </svg>
  );
}
