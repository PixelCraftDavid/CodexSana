import QRCode from 'qrcode';
import type { CardPrintPreferences } from '../../cards/model/card-format';
import type { PatientDesign } from '../../designs/model/patient-designs';
import { frameQR, qrThemeAccents, type QRPresentation } from './qr-frames';

export type QRInk = 'graphite' | 'surgical' | 'plasma';
export type QRModules = 'squares' | 'dots' | 'rounded';
export type QRStyle = QRPresentation &
  CardPrintPreferences & { ink: QRInk; modules: QRModules; frame: boolean; theme?: PatientDesign };
export const qrPatterns: { id: QRModules; label: string }[] = [
  { id: 'dots', label: 'Puntos' },
  { id: 'squares', label: 'Cuadrados' },
  { id: 'rounded', label: 'Redondeados' },
];
export const qrInks: { id: QRInk; label: string; color: string }[] = [
  { id: 'graphite', label: 'Grafito', color: '#101519' },
  { id: 'surgical', label: 'Quirúrgico', color: '#164737' },
  { id: 'plasma', label: 'Plasma', color: '#163d9b' },
];
export const defaultQRStyle: QRStyle = {
  ink: 'graphite',
  modules: 'dots',
  frame: true,
  finder: 'rounded',
  eyeInk: 'same',
  frameStyle: 'label',
};

/** Preserve all modules, finder patterns and the four-module quiet zone. No logo covers data. */
export function createPersonalizedQR(value: string, style: QRStyle): string {
  const code = QRCode.create(value, { errorCorrectionLevel: 'H' });
  const size = code.modules.size;
  const quiet = 4;
  const grid = size + quiet * 2;
  const color = qrInks.find((ink) => ink.id === style.ink)?.color ?? qrInks[0].color;
  const isFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
  const modules: string[] = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      if (!code.modules.get(r, c) || isFinder(r, c)) continue;
      const x = c + quiet,
        y = r + quiet;
      // Alignment and timing patterns retain their exact square geometry.
      modules.push(
        style.modules === 'dots' && !code.modules.isReserved(r, c)
          ? `<circle cx="${x + 0.5}" cy="${y + 0.5}" r=".47"/>`
          : `<rect x="${x}" y="${y}" width="1" height="1"${style.modules === 'rounded' && !code.modules.isReserved(r, c) ? ' rx=".22"' : ''}/>`,
      );
    }
  const eyeColor = style.eyeInk === 'accent' ? qrThemeAccents[style.theme ?? 'vitalia'] : color;
  const radius = style.finder && style.finder !== 'square' ? 1.6 : 0;
  // A softened square center retains the three-module width across scan lines.
  const finders = [
    [quiet, quiet],
    [size - 7 + quiet, quiet],
    [quiet, size - 7 + quiet],
  ]
    .map(
      ([x, y]) =>
        `<g transform="translate(${x} ${y})" fill="${eyeColor}"><rect width="7" height="7" rx="${radius}"/><rect x="1" y="1" width="5" height="5" rx="${radius ? 1 : 0}" fill="#fff"/><rect x="2" y="2" width="3" height="3" rx="${style.finder === 'dot' ? 1 : radius ? 0.65 : 0}"/></g>`,
    )
    .join('');
  const mark = `<svg width="320" height="320" viewBox="0 0 ${grid} ${grid}" shape-rendering="geometricPrecision"><rect width="${grid}" height="${grid}" fill="#fff"/><g fill="${color}">${modules.join('')}</g>${finders}</svg>`;
  const matrix = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="960" viewBox="0 0 320 320">${mark}</svg>`;
  return style.frame ? frameQR(matrix, style.theme ?? 'vitalia', style) : matrix;
}

export function svgSource(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function downloadPersonalizedQR(svg: string, name: string, format: 'svg' | 'png') {
  const source = svgSource(svg);
  let href = source;
  if (format === 'png') {
    const image = new Image();
    image.src = source;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas unavailable');
    context.drawImage(image, 0, 0);
    href = canvas.toDataURL('image/png');
  }
  const link = document.createElement('a');
  link.href = href;
  link.download = `${name}.${format}`;
  link.click();
}
