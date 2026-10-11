import { svgSource } from '../../qr/lib/custom-qr';

// 24 independent characters from a 64-character alphabet: 144 bits of entropy.
// No patient information is used; the password only lives in the open dialog.
export function createPDFPassword(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (byte) => alphabet[byte & 63])
    .join('')
    .match(/.{6}/g)!
    .join('.');
}

export async function createProtectedPDF(
  sheet: string,
  password: string,
  filename: string,
): Promise<File> {
  if (!password) throw new Error('Se requiere una contraseña');
  const [pdfkit, helvetica, helveticaBold] = await Promise.all([
    import('pdfkit'),
    import('pdfkit/standard-fonts/Helvetica'),
    import('pdfkit/standard-fonts/HelveticaBold'),
  ]);
  const { default: PDFDocument } = pdfkit;
  // @types/pdfkit predates the browser font-registration exports in PDFKit 0.20.
  (pdfkit as unknown as { registerStdFonts: (...fonts: unknown[]) => void }).registerStdFonts(
    helvetica.default,
    helveticaBold.default,
  );
  const image = new Image();
  image.src = svgSource(sheet);
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No se pudo preparar la tarjeta');
  context.drawImage(image, 0, 0);
  const png = canvas.toDataURL('image/png');
  const ownerPassword = createPDFPassword() + createPDFPassword();
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    pdfVersion: '1.7ext3',
    userPassword: password,
    ownerPassword,
    permissions: { printing: 'highResolution', contentAccessibility: true },
    info: {
      Title: 'CodexSanaQR · Tarjeta de emergencia',
      Author: 'CodexSana',
      Subject: 'Frente y reverso para imprimir',
    },
  });
  const completion = new Promise<File>((resolve, reject) => {
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    doc.on('data', (chunk: Uint8Array) => chunks.push(new Uint8Array(chunk)));
    doc.on('error', reject);
    doc.on('end', () => resolve(new File(chunks, filename, { type: 'application/pdf' })));
  });
  const mm = (value: number) => (value * 72) / 25.4;
  doc.fillColor('#244a3d').font('Helvetica-Bold').fontSize(21).text('CodexSanaQR', mm(10), mm(14));
  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#52665a')
    .text('Tarjeta de emergencia / Frente y reverso', mm(10), mm(24));
  // 190 × 76 mm sheet contains two cards at exactly 86 × 54 mm each.
  doc.image(png, mm(10), mm(34), { width: mm(190), height: mm(76) });
  doc.fontSize(10).fillColor('#244a3d').text('Datos reportados por el titular.', mm(14), mm(123));
  doc.text('No sustituye la valoración médica.', mm(14), mm(130));
  doc
    .fontSize(9)
    .fillColor('#52665a')
    .text('Imprime en A4, a tamaño real (100 %). Recorta y une los dos lados.', mm(14), mm(143), {
      width: mm(180),
    });
  doc.text('Comprueba la lectura del QR después de imprimir.', mm(14), mm(150));
  doc.text(
    'La contraseña protege este archivo. La ficha que abre el QR es pública.',
    mm(14),
    mm(163),
    { width: mm(180) },
  );
  doc.text('Comparte la contraseña por separado del PDF.', mm(14), mm(170));
  doc.end();
  return completion;
}

export function fileDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
