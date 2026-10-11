import type { CardPrintPreferences } from '../../cards/model/card-format';
import { kidsThemes, type KidsTheme } from '../../designs/model/kids-themes';
import { createPersonalizedQR, type QRModules } from './custom-qr';
import { frameQR, qrEmblem, type QRPresentation } from './qr-frames';

export type KidsQRStyle = QRPresentation &
  CardPrintPreferences & {
    modules: QRModules;
    badge: 'character' | 'symbol';
    includeName: boolean;
    ink: 'signature' | 'graphite';
    frame?: boolean;
  };
export const defaultKidsQRStyle: KidsQRStyle = {
  modules: 'dots',
  badge: 'character',
  includeName: true,
  ink: 'signature',
  finder: 'rounded',
  eyeInk: 'same',
  frameStyle: 'label',
};
export function kidsBadgeSVG(theme: KidsTheme, character: boolean) {
  return qrEmblem(theme, character);
}
/** Decorations stay outside the encoded matrix and its four-module quiet zone. */
export function createKidsQR(value: string, theme: KidsTheme, name: string, style: KidsQRStyle) {
  const ink = style.ink === 'graphite' ? '#101519' : kidsThemes[theme].ink;
  const qr = createPersonalizedQR(value, {
    ...style,
    theme,
    ink: 'graphite',
    frame: false,
  }).replaceAll('#101519', ink);
  return style.frame === false ? qr : frameQR(qr, theme, { ...style, name });
}
