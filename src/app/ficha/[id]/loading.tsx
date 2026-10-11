import { MedicalSkeleton } from '@/features/emergency/components/emergency-concepts';
export default function Loading() {
  return (
    <main className="public-concept loading-route clinico">
      <MedicalSkeleton concept="clinico" />
    </main>
  );
}
