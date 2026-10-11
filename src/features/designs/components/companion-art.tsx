import { companionBodySVG, companionHeadSVG, companionSymbolSVG } from '../lib/companion-art';
import type { CompanionTheme } from '../model/kids-themes';

export function CompanionCharacter({
  theme,
  headOnly = false,
}: {
  theme: CompanionTheme;
  headOnly?: boolean;
}) {
  return (
    <svg
      viewBox={headOnly ? '30 20 200 165' : '0 0 260 300'}
      className="companion-illustration"
      aria-hidden="true"
    >
      {/* Only trusted local SVG constants are injected; patient data never enters the artwork. */}
      {!headOnly && <g dangerouslySetInnerHTML={{ __html: companionBodySVG(theme) }} />}
      <g dangerouslySetInnerHTML={{ __html: companionHeadSVG(theme) }} />
    </svg>
  );
}

export function CompanionSymbol({ theme }: { theme: CompanionTheme }) {
  return (
    <svg
      viewBox="0 0 64 60"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: companionSymbolSVG(theme) }}
    />
  );
}
