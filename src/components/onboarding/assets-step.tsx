"use client";

import { useOnboardingStore } from "@/lib/onboarding-store";
import type { CriticalAssetId, CriticalAssetOption } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import {
  Database,
  Landmark,
  Network,
  Mail,
  ArchiveRestore,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  BadgeCheck,
  Terminal,
  ShieldCheck,
} from "lucide-react";

// ============================================================================
// Asset options — matching UX reference (business_context_selection_3)
// ============================================================================

const ASSETS: CriticalAssetOption[] = [
  {
    id: "pii",
    title: "PII / Customer Data",
    description:
      "Personal identifiers, contact info, and encrypted user passwords.",
    icon: "database",
    highImpact: true,
  },
  {
    id: "financial_records",
    title: "Financial Records",
    description:
      "Transaction logs, payroll data, and corporate banking access.",
    icon: "landmark",
    highImpact: true,
  },
  {
    id: "production_servers",
    title: "Production Servers",
    description:
      "Active application clusters, load balancers, and real-time APIs.",
    icon: "network",
    highImpact: true,
  },
  {
    id: "email_collaboration",
    title: "Email & Collaboration",
    description:
      "Corporate messaging, shared documents, and internal scheduling.",
    icon: "mail",
    highImpact: false,
  },
  {
    id: "backup_infrastructure",
    title: "Backup Infrastructure",
    description:
      "Offline vaults, cloud snapshots, and disaster recovery sites.",
    icon: "archive",
    highImpact: false,
  },
  {
    id: "trade_secrets_ip",
    title: "Trade Secrets / IP",
    description:
      "Proprietary source code, design patents, and R&D documentation.",
    icon: "lightbulb",
    highImpact: false,
  },
];

function AssetIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const iconClass = cn("h-8 w-8", className);
  switch (id) {
    case "database":
      return <Database className={iconClass} />;
    case "landmark":
      return <Landmark className={iconClass} />;
    case "network":
      return <Network className={iconClass} />;
    case "mail":
      return <Mail className={iconClass} />;
    case "archive":
      return <ArchiveRestore className={iconClass} />;
    case "lightbulb":
      return <Lightbulb className={iconClass} />;
    default:
      return <Database className={iconClass} />;
  }
}

// ============================================================================
// Step 3: Critical Assets Selection
// ============================================================================

export function AssetsStep() {
  const { config, toggleAsset, nextStep, prevStep, isStepValid } =
    useOnboardingStore();

  const selectedAssets = config.criticalAssets;
  const canFinalize = isStepValid(3);
  const selectedCount = selectedAssets.length;

  return (
    <div className="flex flex-col items-center w-full animate-fade-in-up">
      {/* ── Breadcrumb navigation ── */}
      <nav className="mb-10 flex flex-col items-center text-center">
        <div className="flex items-center space-x-4 mb-6 text-xs font-bold uppercase tracking-[0.2em]">
          <span className="text-slate-500">Step 3 of 3:</span>
          <div className="flex items-center space-x-3">
            <span className="text-slate-500">Context</span>
            <ChevronRight className="h-3 w-3 text-slate-700" />
            <span className="text-slate-500">Infrastructure</span>
            <ChevronRight className="h-3 w-3 text-slate-700" />
            <span className="text-primary underline underline-offset-8 decoration-2">
              Assets
            </span>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase mb-4">
          What are your{" "}
          <span className="text-primary">Critical Assets?</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          Select all that apply — these will be at risk during incidents
        </p>
      </nav>

      {/* ── Asset Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-5xl">
        {ASSETS.map((asset) => {
          const isSelected = selectedAssets.includes(asset.id);
          return (
            <label key={asset.id} className="group relative cursor-pointer">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleAsset(asset.id)}
                className="sr-only"
              />
              <div
                className={cn(
                  "h-full bg-[#0f172a]/50 border-2 rounded-xl p-8 transition-all duration-300 flex flex-col items-start",
                  isSelected
                    ? "border-primary shadow-[0_0_20px_rgba(25,120,229,0.2)]"
                    : "border-slate-800 hover:border-slate-600"
                )}
              >
                {/* Icon + Badge row */}
                <div className="flex justify-between w-full mb-6">
                  <AssetIcon
                    id={asset.icon}
                    className={cn(
                      "transition-colors",
                      isSelected ? "text-primary" : "text-slate-400"
                    )}
                  />
                  {asset.highImpact && (
                    <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-2 py-1 rounded tracking-widest border border-red-500/20 uppercase">
                      High Impact
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {asset.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {asset.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {/* ── Navigation Footer ── */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-900 w-full max-w-5xl">
        <button
          onClick={prevStep}
          className="flex items-center text-slate-500 hover:text-white transition-colors px-4 py-2 font-medium group"
        >
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Previous Step
        </button>

        <div className="flex items-center space-x-6">
          <span className="text-slate-600 text-xs font-bold uppercase tracking-widest hidden lg:block">
            {selectedCount} Selected Asset{selectedCount !== 1 ? "s" : ""}
          </span>
          <button
            onClick={nextStep}
            disabled={!canFinalize}
            className={cn(
              "flex items-center py-4 px-12 rounded-lg font-bold text-white shadow-lg transition-all active:scale-95 group",
              canFinalize
                ? "bg-primary hover:bg-blue-600 shadow-primary/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
            )}
          >
            Analyze Threats
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
