export type CatTheme = 'michi-sol' | 'michi-luna';
export type CompanionTheme = 'nutria-perla' | 'capibara-salvia';
export type KidsTheme = CatTheme | CompanionTheme;
export const kidsThemes = {
  'michi-sol': {
    name: 'Miso',
    label: 'Club del sol',
    ink: '#69402f',
    character: 'Gatito',
    symbol: 'Patita',
    inkLabel: 'Cacao',
    sample: 'VT-K01',
  },
  'michi-luna': {
    name: 'Mochi',
    label: 'Club de las ideas',
    ink: '#315b52',
    character: 'Gatito',
    symbol: 'Lentes',
    inkLabel: 'Bosque',
    sample: 'VT-K02',
  },
  'nutria-perla': {
    name: 'Nori',
    label: 'Un río de abrazos',
    ink: '#28545d',
    character: 'Nutria bebé',
    symbol: 'Jeringa',
    inkLabel: 'Azul laguna',
    sample: 'VT-K01',
  },
  'capibara-salvia': {
    name: 'Dr. Capi',
    label: 'El club del cuidado',
    ink: '#304867',
    character: 'Capibara',
    symbol: 'Corazón',
    inkLabel: 'Azul tinta',
    sample: 'VT-K02',
  },
} as const;
export const kidsThemeList = Object.keys(kidsThemes) as KidsTheme[];
export function legacyKidsTheme(value: string): KidsTheme | undefined {
  return value === 'bluey' ? 'michi-sol' : value === 'miraculous' ? 'michi-luna' : undefined;
}
export function kidsCardURL(id: string, theme: KidsTheme) {
  return `/ficha/${encodeURIComponent(id)}/${theme}`;
}
export function isKidsTheme(value: string): value is KidsTheme {
  return Object.hasOwn(kidsThemes, value);
}
export function isCompanionTheme(value: string): value is CompanionTheme {
  return value === 'nutria-perla' || value === 'capibara-salvia';
}
