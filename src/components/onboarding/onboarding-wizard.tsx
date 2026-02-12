"use client";

import { useCallback } from "react";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { SectorStep } from "@/components/onboarding/sector-step";
import { InfrastructureStep } from "@/components/onboarding/infrastructure-step";
import { AssetsStep } from "@/components/onboarding/assets-step";
import { ScenarioBriefing } from "@/components/onboarding/scenario-briefing";

// ============================================================================
// OnboardingWizard — Master controller for the 3-step onboarding flow
// Renders the correct step and manages transitions.
// ============================================================================

interface OnboardingWizardProps {
  /** Called when the user finalizes the onboarding setup */
  onComplete: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { currentStep, isStepValid } = useOnboardingStore();

  const handleFinalize = useCallback(() => {
    if (!isStepValid(4)) return;
    onComplete();
  }, [isStepValid, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* ── Background dot grid ── */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #135bec 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Scanline overlay ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(25,120,229,0) 0%, rgba(25,120,229,0.02) 50%, rgba(25,120,229,0) 100%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* ── Side accent bars ── */}
      <div className="fixed top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/30 via-transparent to-primary/30 hidden xl:block" />
      <div className="fixed top-0 right-0 w-1 h-full bg-gradient-to-b from-primary/30 via-transparent to-primary/30 hidden xl:block" />

      {/* ── Step Content ── */}
      <main className="relative z-10 w-full max-w-6xl px-6 py-12">
        {currentStep === 1 && <SectorStep />}
        {currentStep === 2 && <InfrastructureStep />}
        {currentStep === 3 && <AssetsStep />}
        {currentStep === 4 && <ScenarioBriefing onComplete={handleFinalize} />}
      </main>
    </div>
  );
}
