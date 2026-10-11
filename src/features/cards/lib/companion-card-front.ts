import {
  companionBodySVG,
  companionHeadSVG,
  companionSymbolSVG,
} from '../../designs/lib/companion-art';
import { kidsThemes, type CompanionTheme } from '../../designs/model/kids-themes';
import type { Patient } from '../../patients/model/patient';
import { cardSVGRoot, textLines, xml } from './card-svg';

type Palette = {
  bg: string;
  ink: string;
  accent: string;
  soft: string;
  muted: string;
  line: string;
};
export function createCompanionCardFront(
  patient: Patient,
  theme: CompanionTheme,
  palette: Palette,
  name: string[],
  includeQR: boolean,
  frame: boolean,
  symbol: boolean,
) {
  const p = palette;
  const otter = theme === 'nutria-perla';
  const mono = 'Consolas,monospace';
  const label = (value: string, x: number, y: number, color = p.muted) =>
    textLines([value], x, y, 14, color, 400, mono);
  const background = `<rect width="860" height="540" rx="30" fill="${p.bg}"/>${frame ? `<rect x="13" y="13" width="834" height="514" rx="22" fill="none" stroke="${p.line}"/>` : ''}`;
  const mark = `<text x="37" y="67" fill="${p.ink}" font-family="Arial,sans-serif" font-size="32" font-weight="700">CodexSanaQR<tspan fill="${p.accent}">.</tspan></text>`;
  const illustration = (x: number, y: number, width: number, height: number) =>
    symbol
      ? `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 64 60" color="${p.ink}">${companionSymbolSVG(theme)}</svg>`
      : `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 260 300">${companionBodySVG(theme)}${companionHeadSVG(theme)}</svg>`;
  const bloodSize = patient.blood.length > 4 ? 27 : 44;
  const footer = label(
    includeQR ? 'FICHA COMPLETA + QR EN EL REVERSO →' : 'CONTACTOS Y DATOS EN EL REVERSO →',
    37,
    513,
  );
  if (otter)
    return cardSVGRoot(`${background}
    <path d="M493 0H830Q860 0 860 30V480Q797 451 748 473Q680 502 626 477Q556 448 493 479Z" fill="${p.soft}"/>
    <path d="M493 470Q552 446 616 470T740 470T860 470" fill="none" stroke="${p.line}" stroke-width="2"/>
    ${mark}${label(patient.id, 705, 60)}${label('UN RÍO DE ABRAZOS', 38, 103)}
    ${label('HOLA, SOY', 39, 160)}${textLines(name, 36, 218, name.length > 2 ? 47 : 57, p.ink, 700, 'Arial,sans-serif', 430)}
    ${label(`${patient.age} AÑOS · DATOS REPORTADOS`, 39, 366)}
    <rect x="37" y="391" width="417" height="91" rx="17" fill="${p.soft}"/>
    ${label('TIPO DE SANGRE', 57, 425)}${textLines([patient.blood], 57, 466, bloodSize, p.ink, 700)}
    <g transform="translate(342 408)" color="${p.ink}" opacity=".45">${companionSymbolSVG(theme)}</g>
    ${illustration(493, 108, 334, 350)}${label('NORI ME ACOMPAÑA', 579, 449)}${footer}`);
  return cardSVGRoot(`${background}
    <rect x="31" y="115" width="310" height="366" rx="30" fill="${p.soft}"/>
    <path d="M359 116V482" stroke="${p.line}"/>
    ${mark}${label(patient.id, 705, 60)}${label('EL CLUB DEL CUIDADO', 38, 103)}
    ${illustration(26, 121, 319, 337)}${label(`${kidsThemes[theme].name.toUpperCase()} TE ACOMPAÑA`, 77, 461)}
    ${label('MI PEQUEÑO EXPEDIENTE', 392, 163)}
    ${textLines(name, 388, 226, name.length > 2 ? 47 : 56, p.ink, 400, 'Georgia,serif', 428)}
    ${label(`${patient.age} AÑOS · DATOS REPORTADOS`, 392, 366)}
    <path d="M392 394H814" stroke="${p.line}"/>
    ${label('TIPO DE SANGRE', 392, 427)}${textLines([patient.blood], 392, 474, bloodSize, p.ink, 700)}
    <g transform="translate(737 415)" color="${p.ink}" opacity=".65">${companionSymbolSVG(theme)}</g>
    ${footer}<text x="805" y="103" text-anchor="end" font-family="Georgia,serif" font-size="17" font-style="italic" fill="${p.muted}">${xml('Con mucho cariño.')}</text>`);
}
