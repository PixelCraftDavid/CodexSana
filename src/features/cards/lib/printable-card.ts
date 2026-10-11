import { cardSVGRoot as root, textLines, wrap, xml } from './card-svg';
import { catBodySVG, catHeadSVG, catPawBorderSVG } from '../../designs/lib/cat-art';
import { isCompanionTheme, isKidsTheme, kidsThemes } from '../../designs/model/kids-themes';
import { createCompanionCardFront } from './companion-card-front';
import type { PatientDesign } from '../../designs/model/patient-designs';
import type { Patient } from '../../patients/model/patient';
import { createPersonalizedQR, type QRStyle } from '../../qr/lib/custom-qr';
import { kidsBadgeSVG } from '../../qr/lib/kids-qr';
import type { CardCustomization } from '../model/card-customization';
import { cardHasQR } from '../model/card-format';

export type CardTheme = PatientDesign;
export type CardFaces = { front: string; back: string; includeQR: boolean; warnings: string[] };
export const cardPalettes = {
  vitalia: {
    bg: '#f6f8ee',
    ink: '#244a3d',
    accent: '#c86d50',
    soft: '#e1e9d6',
    muted: '#57705d',
    line: '#c7d4c0',
  },
  anatomico: {
    bg: '#101316',
    ink: '#f4f5ed',
    accent: '#e06257',
    soft: '#1d2829',
    muted: '#b1c6bd',
    line: '#394447',
  },
  clinico: {
    bg: '#f5f7fa',
    ink: '#153a91',
    accent: '#225be2',
    soft: '#dfe8fa',
    muted: '#526582',
    line: '#c3d1eb',
  },
  'michi-sol': {
    bg: '#fff3d9',
    ink: '#69402f',
    accent: '#b95d39',
    soft: '#f7dfb6',
    muted: '#7d634a',
    line: '#dbbd96',
  },
  'michi-luna': {
    bg: '#eaf2e9',
    ink: '#315b52',
    accent: '#a06479',
    soft: '#cfe1d2',
    muted: '#587566',
    line: '#b0cbb7',
  },
  'nutria-perla': {
    bg: '#fffdf8',
    ink: '#28545d',
    accent: '#b27860',
    soft: '#d9ecea',
    muted: '#59767a',
    line: '#bfd7d6',
  },
  'capibara-salvia': {
    bg: '#fffaf2',
    ink: '#304867',
    accent: '#b77b59',
    soft: '#dde6f2',
    muted: '#62718a',
    line: '#c3cede',
  },
} as const;
const heart =
  '<path d="M30 64C-16 27 9-11 30 14C52-11 77 27 30 64Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M-8 34H17L25 21 35 46 42 34H69" fill="none" stroke="currentColor" stroke-width="2"/>';

export function createCardFaces(
  patient: Patient,
  url: string,
  theme: CardTheme,
  options?: Partial<CardCustomization>,
): CardFaces {
  const p = cardPalettes[theme];
  const child = isKidsTheme(theme);
  const technical = theme === 'anatomico';
  const includeQR = cardHasQR(patient, options);
  const warnings: string[] = [];
  const printed = (value: string, length: number, max: number, title: string) => {
    const overflow = includeQR ? 'Más datos en la ficha QR' : 'Consultar con el titular';
    const lines = wrap(value, length, max, overflow);
    if (!includeQR && lines.includes(overflow))
      warnings.push(`${title}: no cabe completo en la tarjeta.`);
    return lines;
  };
  const mono = 'Consolas,monospace';
  const label = (value: string, x: number, y: number, color: string = p.muted) =>
    `<text x="${x}" y="${y}" fill="${color}" font-family="${mono}" font-size="16" letter-spacing="1.7">${xml(value)}</text>`;
  const mark = `<g fill="${p.ink}" font-family="Arial,sans-serif"><path d="M40 62H64M52 50V74" stroke="${p.ink}" stroke-width="5" stroke-linecap="round"/><text x="78" y="73" font-size="37" font-weight="700">CodexSanaQR<tspan fill="${p.accent}">.</tspan></text></g>`;
  const border = options?.frame ?? true;
  const background = `<rect width="860" height="540" rx="30" fill="${p.bg}"/>${border ? (child && !isCompanionTheme(theme) ? catPawBorderSVG(860, 540, p.line) : `<rect x="16" y="16" width="828" height="508" rx="23" fill="none" stroke="${p.line}"/>`) : ''}`;
  const name = printed(
    options?.includeName === false ? 'Mi ficha de emergencia' : patient.name,
    19,
    3,
    'Nombre',
  );
  const nameSize = name.length > 2 ? 45 : 58;
  const art =
    child && !isCompanionTheme(theme)
      ? `<circle cx="678" cy="266" r="135" fill="${p.soft}"/>${options && 'badge' in options && options.badge === 'symbol' ? `<g transform="translate(580 180) scale(3)">${kidsBadgeSVG(theme, false)}</g>` : `<svg x="523" y="107" width="300" height="345" viewBox="0 0 260 300">${catBodySVG(theme)}${catHeadSVG(theme)}</svg>`}${label(`${kidsThemes[theme].name.toUpperCase()} TE ACOMPAÑA`, 567, 454)}`
      : `<g color="${technical ? '#779d8e' : p.accent}" transform="translate(595 195) scale(2.3)">${heart}</g>${label(technical ? 'EMERGENCY / ID' : 'INFORMACIÓN QUE CUIDA', 539, 423)}`;
  const bloodSize = patient.blood.length > 4 ? 28 : 47;
  const bloodX = patient.blood.length > 4 ? 610 : 695;
  const front = isCompanionTheme(theme)
    ? createCompanionCardFront(
        patient,
        theme,
        p,
        name,
        includeQR,
        border,
        options?.badge === 'symbol',
      )
    : root(
        `${background}${mark}${label(child ? 'MI PASAPORTE DE CUIDADO' : 'FICHA DE EMERGENCIA', 40, 116)}${label(patient.id, 690, 63)}${label(child ? 'HOLA, SOY' : 'LA PERSONA', 42, 183)}${textLines(name, 40, 250, nameSize, p.ink, 700, technical ? 'Georgia,serif' : 'Arial,sans-serif')}${label(`${patient.age} AÑOS · ${technical ? 'MEDICAL ID' : 'DATOS REPORTADOS'}`, 42, name.length > 2 ? 374 : 344)}${art}<rect x="40" y="405" width="325" height="80" rx="14" fill="${p.soft}"/>${label('TIPO DE SANGRE', 59, 434)}${textLines([patient.blood], 59, 474, bloodSize, p.ink, 700)}${label(includeQR ? 'FICHA COMPLETA + QR EN EL REVERSO →' : 'CONTACTOS Y DATOS EN EL REVERSO →', 40, 516)}`,
      );
  const footer = `<path d="M40 453H${includeQR ? 491 : 820}" stroke="${p.line}"/>${label(`ACTUALIZADA / ${patient.updated}`, 40, 475)}${textLines(['Datos reportados por el titular.'], 40, 495, 18, p.muted)}${textLines(['No sustituye la valoración médica.'], 40, 515, 18, p.muted)}`;
  if (!includeQR) {
    const contacts =
      patient.contacts
        .slice(0, 2)
        .map((contact, index) => {
          const x = 40 + index * 400;
          return `${textLines(printed(contact.relationship.toUpperCase(), 28, 1, `Relación del contacto ${index + 1}`), x, 268, 16, p.muted, 400, mono, 352)}${textLines(printed(contact.name, 26, 2, `Nombre del contacto ${index + 1}`), x, 300, 25, p.ink, 700, 'Arial,sans-serif', 352)}${textLines(printed(contact.phone, 26, 1, `Teléfono del contacto ${index + 1}`), x, 357, 26, p.ink, 600, mono, 352)}`;
        })
        .join('') ||
      `${label('CONTACTO DE EMERGENCIA', 40, 268)}${textLines(['No reportado'], 40, 300, 25, p.ink, 700)}`;
    if (patient.contacts.length > 2)
      warnings.push('Se imprimen únicamente los dos primeros contactos.');
    const allergies = printed(patient.allergies || 'No reportadas', 55, 2, 'Alergias');
    const conditions = printed(patient.conditions || 'No reportados', 28, 2, 'Padecimientos');
    const medications = printed(patient.medications || 'No reportados', 28, 2, 'Medicamentos');
    const back = root(
      `${background}${mark}${label('LO ESENCIAL, A SIMPLE VISTA', 40, 114)}${label('SANGRE', bloodX, 48)}${textLines([patient.blood], bloodX, 94, bloodSize, p.ink, 700)}<rect x="40" y="138" width="780" height="98" rx="12" fill="${technical ? '#412326' : '#fff0e2'}"/>${label('ALERGIAS REPORTADAS', 56, 164, technical ? '#f7ada5' : '#823e31')}${textLines(allergies, 56, 193, 25, technical ? '#fff2ef' : '#6c3829', 700, 'Arial,sans-serif', 748)}${contacts}<path d="M420 258V443" stroke="${p.line}"/>${label('PADECIMIENTOS', 40, 389)}${textLines(conditions, 40, 417, 22, p.ink, 500, 'Arial,sans-serif', 352)}${label('MEDICAMENTOS', 440, 389)}${textLines(medications, 440, 417, 22, p.ink, 500, 'Arial,sans-serif', 352)}${footer}`,
    );
    return { front, back, includeQR, warnings };
  }
  const ink =
    options?.ink && ['graphite', 'surgical', 'plasma'].includes(options.ink)
      ? (options.ink as QRStyle['ink'])
      : 'graphite';
  const qr = createPersonalizedQR(url, {
    ...options,
    ink,
    modules: options?.modules ?? 'squares',
    theme,
    frame: false,
  });
  const kidsInk =
    child && (!options || options.ink !== 'graphite') ? kidsThemes[theme].ink : undefined;
  const qrContent = (kidsInk ? qr.replaceAll('#101519', kidsInk) : qr).slice(
    qr.indexOf('>') + 1,
    qr.lastIndexOf('</svg>'),
  );
  // Keep the entire encoded SVG and quiet zone inside a white 28 mm square.
  const qrArt = `<rect x="536" y="126" width="284" height="284" rx="12" fill="#fff"/><svg x="538" y="128" width="280" height="280" viewBox="0 0 320 320">${qrContent}</svg>`;
  const contacts = patient.contacts
    .slice(0, 2)
    .map(
      (contact, index) =>
        `${label(contact.relationship.toUpperCase(), 40, 287 + index * 77)}${textLines(wrap(contact.name, 29, 1), 40, 312 + index * 77, 24, p.ink, 700)}${textLines([contact.phone], 40, 338 + index * 77, 26, p.ink, 600, mono)}`,
    )
    .join('');
  const allergies = wrap(patient.allergies || 'No reportadas', 31, 3);
  const back = root(
    `${background}${mark}${label('LO ESENCIAL PARA AYUDAR', 40, 114)}${label('SANGRE', bloodX, 48)}${textLines([patient.blood], bloodX, 94, bloodSize, p.ink, 700)}<rect x="40" y="138" width="458" height="120" rx="12" fill="${technical ? '#412326' : '#fff0e2'}"/>${label('ALERGIAS REPORTADAS', 56, 164, technical ? '#f7ada5' : '#823e31')}${textLines(allergies, 56, 193, 25, technical ? '#fff2ef' : '#6c3829', 700)}${contacts}${qrArt}${label('ESCANEA LA FICHA COMPLETA', 542, 437)}${label(patient.id, 620, 466)}${footer}`,
  );
  return { front, back, includeQR, warnings };
}

export function createCardSheet(faces: CardFaces, physical = false) {
  const inside = (svg: string) => svg.slice(svg.indexOf('>') + 1, svg.lastIndexOf('</svg>'));
  // 86 × 54 mm per face; aligned side by side with cut guides, never mirrored.
  const guides = [40, 960]
    .map(
      (x) =>
        `<g stroke="#94a098" stroke-width="1"><path d="M${x - 12} 110H${x - 3}M${x} 98V107M${x + 863} 110H${x + 872}M${x + 860} 98V107M${x - 12} 650H${x - 3}M${x} 653V662M${x + 863} 650H${x + 872}M${x + 860} 653V662"/></g>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${physical ? '190mm' : '2280'}" height="${physical ? '76mm' : '912'}" viewBox="0 0 1900 760"><rect width="1900" height="760" fill="#fff"/><g font-family="Arial,sans-serif" fill="#465b50"><text x="40" y="54" font-size="21" font-weight="700">CodexSanaQR / TARJETA DE EMERGENCIA</text><text x="1820" y="54" font-size="17" text-anchor="end">${faces.includeQR ? 'CON QR' : 'SIN QR'} · 86 × 54 mm</text><text x="40" y="697" font-size="17">01 / FRENTE</text><text x="960" y="697" font-size="17">02 / REVERSO</text><text x="40" y="737" font-size="15">${faces.includeQR ? 'Imprimir al 100 %. Recortar y unir ambos lados. Verifica la lectura del QR después de imprimir.' : 'Imprimir al 100 %. Recortar y unir ambos lados. Comprueba que los datos y teléfonos sean legibles.'}</text></g><svg x="40" y="110" width="860" height="540" viewBox="0 0 860 540">${inside(faces.front)}</svg><svg x="960" y="110" width="860" height="540" viewBox="0 0 860 540">${inside(faces.back)}</svg>${guides}</svg>`;
}
