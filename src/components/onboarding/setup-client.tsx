"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

// ============================================================================
// SetupClient — Wraps the OnboardingWizard with routing logic.
// On completion, navigates to the game page (briefing/persona selection).
// ============================================================================

interface SetupClientProps {
  scenarioId: string;
}

export function SetupClient({ scenarioId }: SetupClientProps) {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    // Navigate to the game page where persona selection (BriefingScreen) is shown
    router.push(`/game/${scenarioId}`);
  }, [router, scenarioId]);

  return <OnboardingWizard onComplete={handleComplete} />;
}
