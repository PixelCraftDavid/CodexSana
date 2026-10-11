import { ConceptLab } from '@/features/designs/components/concept-lab';
import { KidsDesignLab } from '@/features/designs/components/kids-design-lab';
import {
  isCompanionTheme,
  isKidsTheme,
  legacyKidsTheme,
} from '@/features/designs/model/kids-themes';
import { CompanionDesignLab } from '@/features/designs/components/companion-design-lab';
import { notFound, redirect } from 'next/navigation';

export default async function ConceptPage({
  params,
  searchParams,
}: {
  params: Promise<{ concept: string }>;
  searchParams: Promise<{ paciente?: string }>;
}) {
  const { concept } = await params;
  const { paciente } = await searchParams;
  const legacy = legacyKidsTheme(concept);
  if (legacy)
    redirect(`/conceptos/${legacy}${paciente ? `?paciente=${encodeURIComponent(paciente)}` : ''}`);
  if (isCompanionTheme(concept))
    return <CompanionDesignLab key={concept} theme={concept} initialPatient={paciente} />;
  if (isKidsTheme(concept))
    return <KidsDesignLab key={concept} theme={concept} initialPatient={paciente} />;
  if (concept !== 'anatomico' && concept !== 'clinico') notFound();
  return <ConceptLab key={concept} concept={concept} initialPatient={paciente} />;
}
