import { notFound } from "next/navigation";
import { getScenarioById, getAllScenarios } from "@/lib/scenarios";
import { SetupClient } from "@/components/onboarding/setup-client";

interface SetupPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Pre-generate known scenario IDs at build time.
 */
export function generateStaticParams() {
  const scenarios = getAllScenarios();
  return scenarios.map((s) => ({ id: s.meta.id }));
}

export async function generateMetadata({ params }: SetupPageProps) {
  const { id } = await params;
  const scenario = getScenarioById(id);

  if (!scenario) {
    return { title: "Scenario Not Found — CyberTabletop" };
  }

  return {
    title: `Setup: ${scenario.meta.title} — CyberTabletop`,
    description: `Configure your organization context for ${scenario.meta.title}`,
  };
}

export default async function SetupPage({ params }: SetupPageProps) {
  const { id } = await params;
  const scenario = getScenarioById(id);

  if (!scenario) {
    notFound();
  }

  return <SetupClient scenarioId={scenario.meta.id} />;
}
