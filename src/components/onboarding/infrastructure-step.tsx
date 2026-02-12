"use client";

import { useOnboardingStore } from "@/lib/onboarding-store";
import type { InfrastructureType } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import {
  CloudCog,
  Server,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  BadgeCheck,
  Terminal,
  ShieldCheck,
  Info,
} from "lucide-react";
import { useState } from "react";

// ============================================================================
// Step 2: Infrastructure Type Selection
// Matches UX reference: business_context_selection_1
// ============================================================================

export function InfrastructureStep() {
  const {
    config,
    setInfrastructureType,
    setIncludeOTSystems,
    nextStep,
    prevStep,
    isStepValid,
  } = useOnboardingStore();

  const selectedType = config.infrastructureType;
  const includeOT = config.includeOTSystems;
  const canContinue = isStepValid(2);
  const [showTooltip, setShowTooltip] = useState(false);

  const infraOptions: {
    id: InfrastructureType;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: "hybrid",
      title: "Hybrid Cloud + On-Premise",
      description:
        "A modern enterprise setup combining Azure/AWS environments with local server stacks. Includes VPN tunnels and identity providers.",
      icon: <CloudCog className="h-10 w-10" />,
      badge: "Realistic",
    },
    {
      id: "on-premise",
      title: "On-Premise IT Only",
      description:
        "Traditional data center model. All critical assets, databases, and services are hosted within your physical corporate perimeter.",
      icon: <Server className="h-10 w-10" />,
    },
  ];

  return (
    <div className="flex flex-col items-center w-full animate-fade-in-up">
      {/* ── Breadcrumb navigation ── */}
      <nav className="mb-12 flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-4 text-xs font-bold uppercase tracking-[0.2em]">
          <span className="text-slate-500">Step 2 of 3:</span>
          <div className="flex items-center space-x-3">
            <span className="text-slate-500">Context</span>
            <ChevronRight className="h-3 w-3 text-slate-700" />
            <span className="text-primary underline underline-offset-8 decoration-2">
              Infrastructure
            </span>
            <ChevronRight className="h-3 w-3 text-slate-700" />
            <span className="text-slate-700">Assets</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white uppercase mt-4 text-center">
          Describe Your{" "}
          <span className="text-primary">IT Infrastructure</span>
        </h1>
      </nav>

      {/* ── Infrastructure Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 w-full max-w-4xl">
        {infraOptions.map((option) => {
          const isSelected = selectedType === option.id;
          return (
            <label key={option.id} className="group relative cursor-pointer">
              <input
                type="radio"
                name="infra_type"
                value={option.id}
                checked={isSelected}
                onChange={() => setInfrastructureType(option.id)}
                className="sr-only peer"
              />
              <div
                className={cn(
                  "h-full bg-[#0f172a] border-2 rounded-xl p-10 transition-all duration-300 relative overflow-hidden",
                  isSelected
                    ? "border-primary bg-gradient-to-br from-[#0f172a] to-primary/5"
                    : "border-slate-800 hover:border-slate-600"
                )}
              >
                {/* Hover glow */}
                {option.badge && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-emerald-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}

                <div className="flex flex-col h-full">
                  {/* Icon + Badge row */}
                  <div className="flex justify-between items-start mb-8">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-lg flex items-center justify-center border transition-transform group-hover:scale-110",
                        isSelected
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      )}
                    >
                      {option.icon}
                    </div>
                    {option.badge && (
                      <span className="bg-primary/20 text-primary text-[10px] font-black px-2.5 py-1 rounded tracking-widest border border-primary/30 uppercase">
                        {option.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    {option.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-8">
                    {option.description}
                  </p>

                  {/* Selected indicator */}
                  <div
                    className={cn(
                      "mt-auto flex items-center text-primary font-bold text-sm tracking-wide transition-opacity",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <Check className="mr-2 h-5 w-5" />
                    SELECTED INFRASTRUCTURE
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* ── OT/ICS Toggle ── */}
      <div className="flex flex-col items-center space-y-8">
        <div className="flex items-center bg-[#0f172a]/50 border border-slate-800 px-6 py-4 rounded-lg">
          <label className="flex items-center cursor-pointer group">
            <button
              type="button"
              role="switch"
              aria-checked={includeOT}
              onClick={() => setIncludeOTSystems(!includeOT)}
              className={cn(
                "relative inline-flex h-5 w-10 items-center rounded-full transition-colors",
                includeOT ? "bg-primary" : "bg-slate-800"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 rounded-full transition-transform",
                  includeOT
                    ? "translate-x-5 bg-white"
                    : "translate-x-0.5 bg-slate-400"
                )}
              />
            </button>
            <span className="ml-4 text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
              Include OT/ICS Systems
            </span>
          </label>

          {/* Tooltip */}
          <div
            className="ml-3 relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="h-4 w-4 text-slate-600 hover:text-primary transition-colors cursor-help" />
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-800 text-xs text-slate-300 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                Include Operational Technology (SCADA, PLC, Industrial Control
                Systems) in the threat landscape.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
              </div>
            )}
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="w-full max-w-4xl flex items-center justify-between pt-8 border-t border-slate-900">
          <button
            onClick={prevStep}
            className="flex items-center text-slate-500 hover:text-white transition-colors px-4 py-2 font-medium"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous Step
          </button>

          <button
            onClick={nextStep}
            disabled={!canContinue}
            className={cn(
              "flex items-center py-4 px-10 rounded-lg font-bold text-white shadow-lg transition-all active:scale-95 group",
              canContinue
                ? "bg-primary hover:bg-blue-600 shadow-primary/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
            )}
          >
            Continue to Assets
            <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* ── Footer Badges ── */}
      <div className="mt-16 flex justify-center space-x-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="flex items-center space-x-2">
          <BadgeCheck className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Model 4.2 Secured
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Environment Ready
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Compliance Engine Active
          </span>
        </div>
      </div>
    </div>
  );
}
