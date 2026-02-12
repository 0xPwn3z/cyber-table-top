"use client";

import { useState, useMemo, useCallback } from "react";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useTypewriter } from "@/lib/use-typewriter";
import { cn } from "@/lib/utils";
import {
  Crosshair,
  Shield,
  AlertTriangle,
  ArrowRight,
  Rocket,
  Radio,
  ChevronLeft,
} from "lucide-react";
import type {
  OrganizationSector,
  InfrastructureType,
  CriticalAssetId,
} from "@/types/onboarding";

// ============================================================================
// Label maps — human-readable names for onboarding selections
// ============================================================================

const SECTOR_LABELS: Record<OrganizationSector, string> = {
  financial: "Financial Services",
  public: "Public Administration",
  logistics: "Transportation & Logistics",
};

const INFRA_LABELS: Record<InfrastructureType, string> = {
  hybrid: "Hybrid Cloud",
  "on-premise": "On-Premise",
};

const ASSET_LABELS: Record<CriticalAssetId, string> = {
  pii: "PII / Customer Data",
  financial_records: "Financial Records",
  production_servers: "Production Servers",
  email_collaboration: "Email & Collaboration",
  backup_infrastructure: "Backup Infrastructure",
  trade_secrets_ip: "Trade Secrets / IP",
};

// ============================================================================
// Slide configuration type
// ============================================================================

interface BriefingSlide {
  id: number;
  category: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  narrative: string;
}

// ============================================================================
// ScenarioBriefing — Intelligence briefing bridge between onboarding & game
// ============================================================================

interface ScenarioBriefingProps {
  /** Called when the user clicks "INITIATE OPERATION" on the final slide */
  onComplete: () => void;
}

export function ScenarioBriefing({ onComplete }: ScenarioBriefingProps) {
  const { config, prevStep } = useOnboardingStore();
  const [activeSlide, setActiveSlide] = useState(0);

  // ── Build the 3 narrative slides from onboarding data ──
  const slides: BriefingSlide[] = useMemo(() => {
    const sector = config.organizationSector
      ? SECTOR_LABELS[config.organizationSector]
      : "Unknown";

    const infra = config.infrastructureType
      ? INFRA_LABELS[config.infrastructureType]
      : "Unknown";

    const assets = config.criticalAssets.map((id) => ASSET_LABELS[id]);

    // Grammar-aware asset string
    let assetString: string;
    if (assets.length === 0) {
      assetString = "critical infrastructure";
    } else if (assets.length === 1) {
      assetString = assets[0];
    } else if (assets.length === 2) {
      assetString = `${assets[0]} and ${assets[1]}`;
    } else {
      assetString = `${assets.slice(0, -1).join(", ")}, and ${assets[assets.length - 1]}`;
    }

    return [
      {
        id: 0,
        category: "TARGET ANALYSIS",
        badge: "SIGINT INTERCEPT",
        badgeColor: "text-blue-400 border-blue-400/30 bg-blue-400/5",
        icon: Crosshair,
        narrative: `Intercepted comms suggest a coordinated campaign against the ${sector} sector. Threat actors are mobilizing. Intelligence indicates multiple APT groups with known TTPs targeting organizations matching your profile. DEFCON status elevated.`,
      },
      {
        id: 1,
        category: "ATTACK VECTOR",
        badge: "VULNERABILITY SCAN",
        badgeColor: "text-amber-400 border-amber-400/30 bg-amber-400/5",
        icon: Shield,
        narrative: `Vulnerability scan complete. Your ${infra} architecture shows critical exposure points in the perimeter defense. ${config.includeOTSystems ? "OT/SCADA systems detected on the network — attack surface expanded significantly. " : "Network segmentation analysis in progress. "}Immediate hardening recommended.`,
      },
      {
        id: 2,
        category: "IMPACT ASSESSMENT",
        badge: "THREAT LEVEL: CRITICAL",
        badgeColor: "text-red-400 border-red-400/30 bg-red-400/5",
        icon: AlertTriangle,
        narrative: `Primary objective identified: Compromise of ${assetString}. Impact assessment: CATASTROPHIC. All response teams on standby. Immediate operator assignment required to coordinate defensive operations.`,
      },
    ];
  }, [config]);

  const currentSlide = slides[activeSlide];
  const isLastSlide = activeSlide === slides.length - 1;

  // ── Typewriter effect for the active slide ──
  const { displayText, isComplete, skip } = useTypewriter({
    text: currentSlide.narrative,
    speed: 22,
    startDelay: 400,
  });

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      onComplete();
    } else {
      setActiveSlide((prev) => prev + 1);
    }
  }, [isLastSlide, onComplete]);

  const handleBack = useCallback(() => {
    if (activeSlide === 0) {
      prevStep();
    } else {
      setActiveSlide((prev) => prev - 1);
    }
  }, [activeSlide, prevStep]);

  const SlideIcon = currentSlide.icon;

  return (
    <div className="flex flex-col items-center w-full animate-fade-in-up">
      {/* ── Top classification bar ── */}
      <div className="flex items-center space-x-3 mb-8">
        <Radio className="h-4 w-4 text-primary animate-pulse-glow" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          Intelligence Briefing
        </span>
        <span className="text-slate-700 text-[10px]">|</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
          Classification: Eyes Only
        </span>
      </div>

      {/* ── Slide progress bar ── */}
      <div className="flex items-center space-x-3 mb-10">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              idx <= activeSlide ? "w-12 bg-primary" : "w-8 bg-slate-800"
            )}
          />
        ))}
        <span className="ml-4 text-[10px] font-bold tracking-[0.25em] text-slate-600 uppercase">
          {activeSlide + 1} / {slides.length}
        </span>
      </div>

      {/* ── Main briefing card ── */}
      <div
        className={cn(
          "w-full max-w-3xl rounded-xl overflow-hidden",
          "border border-slate-800/80",
          "bg-gradient-to-b from-[#0a1628] to-[#060e1f]",
          "shadow-[0_0_40px_rgba(19,91,236,0.06)]"
        )}
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-900/30">
          <div className="flex items-center space-x-3">
            <SlideIcon className="h-5 w-5 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
              {currentSlide.category}
            </span>
          </div>
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border",
              currentSlide.badgeColor
            )}
          >
            {currentSlide.badge}
          </span>
        </div>

        {/* Terminal body — typewriter text area */}
        <div
          className="px-8 py-8 min-h-[200px] cursor-pointer"
          onClick={() => {
            if (!isComplete) skip();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              if (!isComplete) skip();
            }
          }}
          aria-label="Click to skip typing animation"
        >
          {/* Terminal prompt prefix */}
          <div className="flex items-start space-x-3">
            <span className="text-primary font-mono text-sm select-none shrink-0 mt-0.5">
              {">"}
            </span>
            <p className="font-mono text-sm leading-relaxed text-slate-300 tracking-wide">
              {displayText}
              {/* Blinking cursor */}
              {!isComplete && (
                <span className="inline-block w-2 h-4 bg-primary/80 ml-0.5 align-middle animate-pulse-fast" />
              )}
            </p>
          </div>

          {/* Skip hint */}
          {!isComplete && (
            <p className="text-[10px] text-slate-700 mt-6 tracking-widest uppercase text-center select-none">
              Click to skip animation
            </p>
          )}
        </div>

        {/* Card footer — decorative scanline */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between w-full max-w-3xl mt-8">
        <button
          onClick={handleBack}
          className="flex items-center text-slate-500 hover:text-white transition-colors px-4 py-2 font-medium group"
        >
          <ChevronLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          {activeSlide === 0 ? "Back to Setup" : "Previous"}
        </button>

        <button
          onClick={() => {
            if (!isComplete) {
              skip();
            } else {
              handleNext();
            }
          }}
          className={cn(
            "flex items-center py-4 px-10 rounded-lg font-bold text-white transition-all active:scale-95 group",
            isComplete
              ? isLastSlide
                ? "bg-primary hover:bg-blue-600 shadow-lg shadow-primary/25"
                : "bg-primary hover:bg-blue-600 shadow-lg shadow-primary/20"
              : "bg-slate-800/80 text-slate-400 hover:bg-slate-700"
          )}
        >
          {!isComplete ? (
            <>
              Skip
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : isLastSlide ? (
            <>
              Initiate Operation
              <Rocket className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

      {/* ── Footer status badges ── */}
      <div className="mt-16 flex justify-center space-x-10 opacity-25">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-glow" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Secure Channel Active
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Encryption: AES-256
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-glow" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Threat Feed: Live
          </span>
        </div>
      </div>
    </div>
  );
}
