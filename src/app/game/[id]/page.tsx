import { notFound } from "next/navigation";
import { getScenarioById, getAllScenarios } from "@/lib/scenarios";
import { GameClient } from "@/components/game/game-client";

interface GamePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Pre-generate known scenario IDs at build time.
 */
export function generateStaticParams() {
  const scenarios = getAllScenarios();
  return scenarios.map((s) => ({ id: s.meta.id }));
}

export async function generateMetadata({ params }: GamePageProps) {
  const { id } = await params;
  const scenario = getScenarioById(id);

  if (!scenario) {
    return { title: "Scenario Not Found — CyberTabletop" };
  }

  return {
    title: `${scenario.meta.title} — CyberTabletop`,
    description: scenario.meta.description,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const scenario = getScenarioById(id);

  if (!scenario) {
    notFound();
  }

  return <GameClient scenario={scenario} />;
}
