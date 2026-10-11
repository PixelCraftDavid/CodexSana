const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};
export const xml = (text: string) => text.replace(/[&<>"']/g, (char) => entities[char]);

/** Wrap without silently dropping printed clinical information. Very long fields direct to the full QR record. */
export function wrap(
  value: string,
  length: number,
  max: number,
  overflow = 'Más datos en la ficha QR',
): string[] {
  const words = value
    .trim()
    .split(/\s+/)
    .flatMap((word) =>
      word.length > length ? (word.match(new RegExp(`.{1,${length}}`, 'gu')) ?? []) : [word],
    );
  const lines: string[] = [];
  for (const word of words) {
    const last = lines.length - 1;
    if (last >= 0 && `${lines[last]} ${word}`.length <= length) lines[last] += ` ${word}`;
    else lines.push(word);
  }
  if (lines.length > max) return [...lines.slice(0, max - 1), overflow];
  return lines;
}
export function textLines(
  lines: string[],
  x: number,
  y: number,
  size: number,
  color: string,
  weight = 400,
  family = 'Arial,sans-serif',
  maxWidth?: number,
) {
  return `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? size * 1.18 : 0}"${maxWidth && line.length * size * 0.75 > maxWidth ? ` textLength="${maxWidth}" lengthAdjust="spacingAndGlyphs"` : ''}>${xml(line)}</tspan>`).join('')}</text>`;
}
export const cardSVGRoot = (content: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="2580" height="1620" viewBox="0 0 860 540">${content}</svg>`;
