'use client';
import { patients } from '@/data/demo-patients';
import { EmergencyCard } from '@/features/emergency/components/emergency-card';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PublicCardPage() {
  const { id } = useParams<{ id: string }>();
  const patient = patients.find((p) => p.id === id);
  if (!patient)
    return (
      <main className="not-found">
        <h1>Ficha no encontrada</h1>
        <p>Revisa el enlace o el código QR.</p>
        <Link href="/">Volver al panel de demostración</Link>
      </main>
    );
  return (
    <main className="public-page">
      <div className="demo-public-label">VISTA DE DISEÑO · DATOS FICTICIOS</div>
      <EmergencyCard patient={patient} />
    </main>
  );
}
