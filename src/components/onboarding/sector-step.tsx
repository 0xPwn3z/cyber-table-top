"use client";

import { useOnboardingStore } from "@/lib/onboarding-store";
import type { OrganizationSector, SectorOption } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import {
  Landmark,
  Building2,
  Truck,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Lock,
  Check,
} from "lucide-react";

// ============================================================================
// Sector options — matching UX reference (business_context_selection_2)
// ============================================================================

const SECTORS: SectorOption[] = [
  {
    id: "financial",
    title: "Financial Services",
    description:
      "Focus on data breaches, regulatory compliance (DORA, PCI-DSS), and maintaining high levels of consumer trust.",
    icon: "landmark",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    hoverBorder: "hover:border-blue-500/50",
  },
  {
    id: "public",
    title: "Public Administration",
    description:
      "Manage risks related to state-sponsored actors, disruption of critical public services, and handling classified citizen data.",
    icon: "building",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    hoverBorder: "hover:border-amber-500/50",
  },
  {
    id: "logistics",
    title: "Transportation & Logistics",
    description:
      "Mitigate supply chain attacks, IoT vulnerabilities in fleet management, and operational downtime in global networks.",
    icon: "truck",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    hoverBorder: "hover:border-cyan-500/50",
  },
];

function SectorIcon({
  id,
  className,
}: {
  id: OrganizationSector;
  className?: string;
}) {
  switch (id) {
    case "financial":
      return <Landmark className={cn("h-8 w-8", className)} />;
    case "public":
      return <Building2 className={cn("h-8 w-8", className)} />;
    case "logistics":
      return <Truck className={cn("h-8 w-8", className)} />;
  }
}

// ============================================================================
// Step 1: Organization Sector Selection
// ============================================================================

export function SectorStep() {
  const { config, setSector, nextStep, isStepValid } = useOnboardingStore();
  const selectedSector = config.organizationSector;
  const canContinue = isStepValid(1);

  return (
    <div className="flex flex-col items-center w-full animate-fade-in-up">
      {/* ── Progress indicators ── */}
      <div className="flex items-center space-x-2 mb-8">
        <div className="w-8 h-1 bg-primary rounded-full" />
        <div className="w-8 h-1 bg-slate-800 rounded-full" />
        <div className="w-8 h-1 bg-slate-800 rounded-full" />
        <span className="ml-4 text-xs font-semibold tracking-widest text-slate-500 uppercase">
          Step 01 / 03
        </span>
      </div>

      {/* ── Title ── */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase mb-4 text-center">
        Select Your{" "}
        <span className="text-primary">Organization Sector</span>
      </h1>
      <p className="text-slate-400 max-w-lg text-lg text-center mb-10">
        This will shape the threats, regulatory hurdles, and stakeholders
        you&apos;ll encounter during the tabletop simulation.
      </p>

      {/* ── Selection Card Container ── */}
      <div className="w-full max-w-3xl bg-[#0f172a] border border-emerald-500/20 rounded-xl shadow-2xl p-8 md:p-12 relative">
        {/* Subtle glow */}
        <div className="absolute -top-px -right-px w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none" />

        <div className="space-y-4">
          {SECTORS.map((sector) => {
            const isSelected = selectedSector === sector.id;
            return (
              <label
                key={sector.id}
                className={cn(
                  "group relative flex items-center p-6 bg-[#020617]/50 border rounded-lg cursor-pointer transition-all duration-300",
                  "hover:-translate-y-1 hover:bg-[#0f172a]/80",
                  sector.hoverBorder,
                  isSelected
                    ? "border-primary ring-1 ring-primary"
                    : "border-slate-800"
                )}
              >
                <input
                  type="radio"
                  name="sector"
                  value={sector.id}
                  checked={isSelected}
                  onChange={() => setSector(sector.id)}
                  className="sr-only"
                />

                {/* Icon */}
                <div
                  className={cn(
                    "flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                    sector.iconBg
                  )}
                >
                  <SectorIcon id={sector.id} className={sector.iconColor} />
                </div>

                {/* Text */}
                <div className="ml-6 flex-grow">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {sector.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {sector.description}
                  </p>
                </div>

                {/* Check indicator */}
                <div
                  className={cn(
                    "ml-4 flex-shrink-0 transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                >
                  <div className="bg-primary rounded-full p-1 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* ── Navigation Footer ── */}
        <div className="mt-12 flex items-center justify-end">
          <div className="flex items-center space-x-6">
            <p className="hidden md:block text-xs text-slate-500 uppercase tracking-widest font-semibold">
              Ready to proceed?
            </p>
            <button
              onClick={nextStep}
              disabled={!canContinue}
              className={cn(
                "flex items-center py-3 px-8 rounded font-bold text-white shadow-lg transition-all active:scale-95",
                canContinue
                  ? "bg-primary hover:bg-blue-600 shadow-primary/20"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
              )}
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Security Badges ── */}
      <div className="mt-8 flex justify-center space-x-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            ISO 27001 Certified
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <BadgeCheck className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            GDPR Compliant
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Lock className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            AES-256 Encryption
          </span>
        </div>
      </div>
    </div>
  );
}
