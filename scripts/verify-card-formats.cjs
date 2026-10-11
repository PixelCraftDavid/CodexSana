const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
const sharp = require('sharp');
const jsQR = require('jsqr');
require.extensions['.ts'] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const { createCardFaces, createCardSheet } = require('../src/features/cards/lib/printable-card');
const {
  defaultCardCustomization,
  cardOptions,
  createPatientQR,
} = require('../src/features/cards/model/card-customization');
const { patients } = require('../src/data/demo-patients');
const { pediatricPatients } = require('../src/data/demo-pediatric');
const { patientDesigns } = require('../src/features/designs/model/patient-designs');
const { isKidsTheme } = require('../src/features/designs/model/kids-themes');
async function pixels(svg, width) {
  return sharp(Buffer.from(svg))
    .resize({ width })
    .flatten({ background: '#fff' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}
const decode = ({ data, info }) =>
  jsQR(new Uint8ClampedArray(data), info.width, info.height, { inversionAttempts: 'dontInvert' })
    ?.data;
(async () => {
  for (const { id: theme } of patientDesigns) {
    const original = isKidsTheme(theme) ? pediatricPatients[0] : patients[0];
    const url = `https://codexsana.example/ficha/${original.id}/${theme}`;
    const patient = {
      ...original,
      design: theme,
      cardStyle: { ...defaultCardCustomization, includeQR: false },
    };
    const faces = createCardFaces(patient, '', theme, cardOptions(patient));
    assert.equal(faces.includeQR, false);
    assert.equal(
      decode(await pixels(faces.back, 860)),
      undefined,
      `QR found in ${theme} without QR`,
    );
    const sheet = createCardSheet(faces);
    assert(
      !sheet.includes('ESCANEA') &&
        !sheet.includes('FICHA COMPLETA + QR') &&
        !sheet.includes('ficha QR') &&
        !sheet.includes('lectura del QR'),
    );
    for (const term of [
      'ALERGIAS REPORTADAS',
      'PADECIMIENTOS',
      'MEDICAMENTOS',
      'Datos reportados por el titular.',
      'No sustituye la valoración médica.',
      original.contacts[0].phone,
    ])
      assert(faces.back.includes(term), `${theme}: missing ${term}`);
    assert.equal(
      decode(await pixels(createPatientQR(patient, url), 570)),
      url,
      'Standalone QR must remain available separately',
    );
    const enabled = createCardFaces(patient, url, theme, {
      ...cardOptions(patient),
      includeQR: true,
    });
    const { data, info } = await sharp(Buffer.from(enabled.back))
      .extract({ left: 538 * 3, top: 128 * 3, width: 840, height: 840 })
      .resize(280)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    assert.equal(decode({ data, info }), url, 'QR can be enabled again');
    assert.equal(
      createCardFaces(original, url, theme).includeQR,
      true,
      'Legacy patients default to QR',
    );
    await sharp(Buffer.from(sheet)).png().toFile(`design/cards/tarjeta-sin-qr-${theme}.png`);
  }
  const long = {
    ...patients[0],
    name: 'Nombre '.repeat(18),
    allergies: 'Alergia extensa '.repeat(50),
    conditions: 'Padecimiento extenso '.repeat(40),
    medications: 'Medicamento extenso '.repeat(40),
    contacts: [...patients[0].contacts, patients[0].contacts[0]],
  };
  const faces = createCardFaces(long, '', 'vitalia', { includeQR: false });
  assert(faces.warnings.length >= 5, 'Extensive information needs explicit print warnings');
  assert(faces.back.includes('Consultar con el titular') && !faces.back.includes('ficha QR'));
  assert(
    createCardFaces({ ...patients[0], allergies: 'A & B < C' }, '', 'vitalia', {
      includeQR: false,
    }).back.includes('A &amp; B &lt; C'),
  );
  console.log(
    `All ${patientDesigns.length} designs: QR-free exports, separately downloadable QR, re-enabling QR, legacy defaults and extensive-data warnings verified.`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
