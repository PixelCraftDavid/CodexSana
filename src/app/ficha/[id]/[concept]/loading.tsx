'use client';
import { isKidsTheme, legacyKidsTheme } from '@/features/designs/model/kids-themes';
import { MedicalSkeleton } from '@/features/emergency/components/emergency-concepts';
import { KidsSkeleton } from '@/features/emergency/components/kids-emergency-card';
import { useParams } from 'next/navigation';

export default function Loading() {
  const { concept } = useParams<{ concept: string }>();
  const legacy = legacyKidsTheme(concept);
  if (legacy)
    return (
      <main className={`kids-public kids-loading-route ${legacy}`}>
        <KidsSkeleton theme={legacy} />
      </main>
    );
  if (isKidsTheme(concept))
    return (
      <main className={`kids-public kids-loading-route ${concept}`}>
        <KidsSkeleton theme={concept} />
      </main>
    );
  const theme = concept === 'clinico' ? 'clinico' : 'anatomico';
  return (
    <main className={`public-concept loading-route ${theme}`}>
      <MedicalSkeleton concept={theme} />
    </main>
  );
}
