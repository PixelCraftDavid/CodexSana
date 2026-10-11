import { catHeadSVG, catPawBorderSVG } from '../../designs/lib/cat-art';
import { companionHeadSVG, companionSymbolSVG } from '../../designs/lib/companion-art';
import { isCompanionTheme, isKidsTheme, kidsThemes } from '../../designs/model/kids-themes';
import type { PatientDesign } from '../../designs/model/patient-designs';

export type QRFrame = 'label' | 'outline' | 'seal' | 'ticket';
export type QRFinder = 'square' | 'rounded' | 'dot';
export type QRPresentation = {
  frameStyle?: QRFrame;
  finder?: QRFinder;
  eyeInk?: 'same' | 'accent';
  caption?: string;
};
export const qrFrames: { id: QRFrame; label: string; detail: string }[] = [
  { id: 'label', label: 'Etiqueta', detail: 'Una invitación a escanear' },
  { id: 'outline', label: 'Contorno', detail: 'Ligero y esencial' },
  { id: 'seal', label: 'Sello', detail: 'Un círculo que acompaña' },
  { id: 'ticket', label: 'Pasaporte', detail: 'Un pequeño recuerdo' },
];
export const qrFinders: { id: QRFinder; label: string }[] = [
  { id: 'square', label: 'Clásicas' },
  { id: 'rounded', label: 'Suaves' },
  { id: 'dot', label: 'Con punto' },
];
export const qrThemeAccents: Record<PatientDesign, string> = {
  vitalia: '#84472f',
  anatomico: '#8d353b',
  clinico: '#163d9b',
  'michi-sol': '#984526',
  'michi-luna': '#80465e',
  'nutria-perla': '#28545d',
  'capibara-salvia': '#304867',
};
const palettes: Record<PatientDesign, { paper: string; ink: string; soft: string; line: string }> =
  {
    vitalia: { paper: '#f6f8ee', ink: '#244a3d', soft: '#e1e9d6', line: '#c7d4c0' },
    anatomico: { paper: '#101316', ink: '#edf5ee', soft: '#263935', line: '#4c655b' },
    clinico: { paper: '#f5f7fa', ink: '#153a91', soft: '#dfe8fa', line: '#b9c9e7' },
    'michi-sol': { paper: '#fff3d9', ink: '#69402f', soft: '#f7dfb6', line: '#dbbd96' },
    'michi-luna': { paper: '#eaf2e9', ink: '#315b52', soft: '#cfe1d2', line: '#b0cbb7' },
    'nutria-perla': { paper: '#eef7f5', ink: '#28545d', soft: '#d9ecea', line: '#bfd7d6' },
    'capibara-salvia': { paper: '#fffaf2', ink: '#304867', soft: '#dde6f2', line: '#c3cede' },
  };
const xml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]!,
  );
export function qrEmblem(theme: PatientDesign, character = true): string {
  if (isCompanionTheme(theme))
    return character
      ? `<svg width="64" height="60" viewBox="30 20 200 165">${companionHeadSVG(theme)}</svg>`
      : `<g color="${palettes[theme].ink}">${companionSymbolSVG(theme)}</g>`;
  if (theme === 'michi-sol' || theme === 'michi-luna') {
    if (character)
      return `<svg width="64" height="60" viewBox="38 18 185 155">${catHeadSVG(theme)}</svg>`;
    return theme === 'michi-sol'
      ? '<g fill="#69402f"><ellipse cx="17" cy="16" rx="5" ry="7"/><ellipse cx="30" cy="10" rx="5" ry="7"/><ellipse cx="43" cy="16" rx="5" ry="7"/><path d="M15 39Q15 24 30 24Q45 24 45 39Q44 49 30 45Q16 49 15 39Z"/></g>'
      : '<g fill="none" stroke="#315b52" stroke-width="3"><circle cx="16" cy="28" r="12"/><circle cx="48" cy="28" r="12"/><path d="M28 27Q32 21 36 27M4 26L0 23M60 26L64 23"/></g>';
  }
  return `<g fill="none" stroke="${palettes[theme].ink}" stroke-width="2.5" stroke-linecap="round"><path d="M31 50C-1 25 12 5 31 19C49 5 62 25 31 50Z"/><path d="M5 32H23L28 23 35 41 40 32H58"/></g>`;
}

/** The whole matrix, including its quiet zone, fits inside every frame. Artwork never covers modules. */
export function frameQR(
  matrix: string,
  theme: PatientDesign,
  options: QRPresentation & {
    badge?: 'character' | 'symbol';
    name?: string;
    includeName?: boolean;
  },
): string {
  const p = palettes[theme];
  const frame = options.frameStyle ?? 'label';
  const child = isKidsTheme(theme);
  const name = options.includeName && options.name ? options.name.split(/\s+/)[0].slice(0, 18) : '';
  const captionText = (
    options.caption?.trim() || (child ? 'Mi familia está aquí' : 'Escanea mi ficha')
  ).slice(0, 34);
  const caption = xml(captionText);
  const captionWidth = [...captionText].reduce(
    (width, character) =>
      width +
      (/\s/.test(character)
        ? 0.3
        : /[MW@#]/.test(character)
          ? 1
          : /[A-ZÁÉÍÓÚÑ]/.test(character)
            ? 0.75
            : 0.6) *
        16,
    0,
  );
  const inside = matrix.slice(matrix.indexOf('>') + 1, matrix.lastIndexOf('</svg>'));
  const image = (x: number, y: number, size: number) =>
    `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff"/><svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 320 320">${inside}</svg>`;
  const emblem = qrEmblem(theme, options.badge !== 'symbol');
  const mark = (x: number, y: number, size = 23) =>
    `<text x="${x}" y="${y}" fill="${p.ink}" font-family="Arial,sans-serif" font-size="${size}" font-weight="700">CodexSanaQR<tspan fill="${child ? qrThemeAccents[theme] : p.ink}">.</tspan></text>`;
  const pill = (y: number) =>
    `<rect x="34" y="${y}" width="312" height="43" rx="${frame === 'ticket' ? 5 : 16}" fill="${p.ink}"/><text x="190" y="${y + 27}" text-anchor="middle" fill="${p.paper}" font-family="Arial,sans-serif" font-size="16" font-weight="700"${captionWidth > 280 ? ' textLength="280" lengthAdjust="spacingAndGlyphs"' : ''}>${caption}</text>`;
  const footer = `<text x="190" y="478" text-anchor="middle" fill="${p.ink}" font-family="Arial,sans-serif" font-size="10">${xml(name ? `${name} · ` : '')}${child ? `${kidsThemes[theme].name} me acompaña` : 'Información que cuida'}</text>`;
  let artwork: string;
  if (frame === 'seal') {
    artwork = `<circle cx="190" cy="225" r="177" fill="${p.paper}" stroke="${p.ink}" stroke-width="3"/><circle cx="190" cy="225" r="168" fill="none" stroke="${p.line}" stroke-dasharray="2 8"/>${mark(190, 109, 19).replace('font-family=', 'text-anchor="middle" font-family=')}<g transform="translate(170 57) scale(.64)">${emblem}</g>${image(76, 117, 228)}${pill(418)}${footer}`;
  } else if (frame === 'ticket') {
    artwork = `<path d="M77 14H303L369 89V391L303 466H77L11 391V89Z" fill="${p.paper}" stroke="${p.ink}" stroke-width="2"/><path d="M72 394H308" stroke="${p.line}" stroke-dasharray="3 6"/><g transform="translate(41 23) scale(.76)">${emblem}</g>${mark(104, 57, 22)}${image(38, 91, 304)}${pill(406)}${footer}`;
  } else {
    artwork = `<rect x="10" y="10" width="360" height="450" rx="${frame === 'outline' ? 20 : 26}" fill="${p.paper}" stroke="${frame === 'outline' ? p.ink : p.line}" stroke-width="${frame === 'outline' ? 2 : 1}"/>${child && !isCompanionTheme(theme) && frame === 'label' ? catPawBorderSVG(380, 460, p.line, 9, 30, 17) : ''}<g transform="translate(29 18) scale(.82)">${emblem}</g>${mark(95, 48, 22)}<text x="96" y="68" fill="${p.ink}" font-family="Arial,sans-serif" font-size="8" letter-spacing="1.2">${isCompanionTheme(theme) ? 'PEQUEÑOS COMPAÑEROS' : child ? 'CLUB DE LAS PATITAS' : 'FICHA DE EMERGENCIA'}</text>${image(27, 89, 326)}${pill(415)}${footer}`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1140" height="1470" viewBox="0 0 380 490"><rect width="380" height="490" fill="${frame === 'seal' || frame === 'ticket' ? '#fff' : p.paper}"/>${artwork}</svg>`;
}
