import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodexSana · Lo esencial, a tiempo',
  description: 'Prototipo visual de fichas médicas de emergencia mediante QR.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
