"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useGameStore } from "@/lib/store";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

// ============================================================================
// SetupClient — Wraps the OnboardingWizard with routing logic.
// On completion (INITIATE OPERATION), commits the temp onboarding config
// into the active simulation session, then navigates to the game page.
// ============================================================================

interface SetupClientProps {
  scenarioId: string;
}

export function SetupClient({ scenarioId }: SetupClientProps) {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    // --- The "Commit" Moment ---
    // Move tempOnboarding → activeSimulationContext
    const config = useOnboardingStore.getState().config;
    useGameStore.getState().commitOnboarding(scenarioId, config);

    // Navigate to the game page where persona selection (BriefingScreen) is shown
    router.push(`/game/${scenarioId}`);
  }, [router, scenarioId]);

  return <OnboardingWizard onComplete={handleComplete} />;
}
