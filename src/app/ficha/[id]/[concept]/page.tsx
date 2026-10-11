import { patients } from '@/data/demo-patients';
import { pediatricPatients } from '@/data/demo-pediatric';
import { isKidsTheme, kidsCardURL, legacyKidsTheme } from '@/features/designs/model/kids-themes';
import { EmergencyConcept } from '@/features/emergency/components/emergency-concepts';
import { KidsEmergencyCard } from '@/features/emergency/components/kids-emergency-card';
import { notFound, redirect } from 'next/navigation';

export default async function PublicConceptPage({
  params,
}: {
  params: Promise<{ id: string; concept: string }>;
}) {
  const { id, concept } = await params;
  const legacy = legacyKidsTheme(concept);
  if (legacy) redirect(kidsCardURL(id, legacy));
  if (isKidsTheme(concept)) {
    const child = [...patients, ...pediatricPatients].find((person) => person.id === id);
    if (!child) notFound();
    return (
      <main className={`kids-public ${concept}`}>
        <KidsEmergencyCard patient={child} theme={concept} />
      </main>
    );
  }
  const patient = [...patients, ...pediatricPatients].find((person) => person.id === id);
  if (!patient || (concept !== 'anatomico' && concept !== 'clinico')) notFound();
  return (
    <main className={`public-concept ${concept}`}>
      <EmergencyConcept patient={patient} concept={concept} />
    </main>
  );
}
