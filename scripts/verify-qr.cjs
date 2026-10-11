/* Decode actual exported artwork, rather than just inspecting QR module counts. */
const fs = require('node:fs');
const ts = require('typescript');
const sharp = require(process.env.QR_SHARP_MODULE || 'sharp');
const jsQR = require('jsqr');
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  module._compile(code, filename);
};
const { createPatientQR } = require('../src/features/cards/model/card-customization');
const { createCardFaces } = require('../src/features/cards/lib/printable-card');
const { patients } = require('../src/data/demo-patients');
const { pediatricPatients } = require('../src/data/demo-pediatric');
const { patientDesigns } = require('../src/features/designs/model/patient-designs');
const { isKidsTheme } = require('../src/features/designs/model/kids-themes');
const { qrFrames, qrFinders } = require('../src/features/qr/lib/qr-frames');
const { qrPatterns } = require('../src/features/qr/lib/custom-qr');
let count = 0;
async function decode(svg, width, value, description, crop) {
  let image = sharp(Buffer.from(svg));
  if (crop) image = image.extract(crop);
  const { data, info } = await image
    .resize({ width })
    .flatten({ background: '#fff' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const result = jsQR(new Uint8ClampedArray(data), info.width, info.height, {
    inversionAttempts: 'dontInvert',
  });
  if (result?.data !== value) throw new Error(`QR failed: ${description} @ ${width}px`);
  count++;
}
(async () => {
  for (const { id: theme } of patientDesigns) {
    const original = isKidsTheme(theme) ? pediatricPatients[0] : patients[0];
    const url = `https://codexsana.example/ficha/${original.id}/${theme}`;
    for (const frame of qrFrames)
      for (const finder of qrFinders)
        for (const pattern of qrPatterns) {
          const style = {
            modules: pattern.id,
            finder: finder.id,
            frameStyle: frame.id,
            eyeInk: 'accent',
            ink: 'signature',
            frame: true,
            badge: 'character',
            includeName: true,
            caption: 'Mi familia & yo <3',
          };
          const patient = { ...original, design: theme, cardStyle: style };
          await decode(
            createPatientQR(patient, url),
            570,
            url,
            `${theme}/${frame.id}/${finder.id}/${pattern.id}`,
          );
        }
    for (const finder of qrFinders)
      for (const pattern of qrPatterns) {
        const style = {
          modules: pattern.id,
          finder: finder.id,
          eyeInk: 'accent',
          ink: 'signature',
          frame: true,
          badge: 'character',
          includeName: true,
        };
        const patient = { ...original, design: theme, cardStyle: style };
        // The exported reverse is 2580x1620; the QR occupies x538,y128,w280,h280 in its 860x540 viewBox.
        const back = createCardFaces(patient, url, theme, style).back;
        await decode(back, 280, url, `card/${theme}/${finder.id}/${pattern.id}`, {
          left: 538 * 3,
          top: 128 * 3,
          width: 280 * 3,
          height: 280 * 3,
        });
      }
  }
  console.log(
    `${count} QR exports decoded: all themes, frames, patterns, finder styles and card reverses.`,
  );
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
