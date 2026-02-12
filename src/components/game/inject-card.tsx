"use client";

import type { Inject, Role } from "@/types/game";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ChevronRight,
  Radio,
  Shield,
  Eye,
  Zap,
  Scale,
  Crosshair,
  Terminal,
  Briefcase,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Role visual configuration — maps each role to icon, colors, and label
// ============================================================================

interface RoleVisual {
  label: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
  text: string;
  glow: string;
}

const ROLE_VISUALS: Record<Role, RoleVisual> = {
  CISO: {
    label: "CISO",
    icon: <Shield className="h-3.5 w-3.5" />,
    bg: "bg-indigo-500/15",
    border: "border-indigo-400/50",
    text: "text-indigo-400",
    glow: "shadow-[0_0_12px_rgba(99,102,241,0.25)]",
  },
  SOC_LEAD: {
    label: "SOC ANALYST",
    icon: <Crosshair className="h-3.5 w-3.5" />,
    bg: "bg-blue-500/15",
    border: "border-blue-400/50",
    text: "text-blue-400",
    glow: "shadow-[0_0_12px_rgba(59,130,246,0.25)]",
  },
  DFIR: {
    label: "DFIR LEAD",
    icon: <Terminal className="h-3.5 w-3.5" />,
    bg: "bg-emerald-500/15",
    border: "border-emerald-400/50",
    text: "text-emerald-400",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
  },
  IT_MANAGER: {
    label: "IT MANAGER",
    icon: <Briefcase className="h-3.5 w-3.5" />,
    bg: "bg-amber-500/15",
    border: "border-amber-400/50",
    text: "text-amber-400",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.25)]",
  },
};

/** Joint Command badge for questions targeting all selected roles */
const JOINT_COMMAND_VISUAL: RoleVisual = {
  label: "JOINT COMMAND",
  icon: <Users className="h-3.5 w-3.5" />,
  bg: "bg-yellow-500/15",
  border: "border-yellow-400/50",
  text: "text-yellow-400",
  glow: "shadow-[0_0_12px_rgba(234,179,8,0.3)]",
};

interface InjectCardProps {
  inject: Inject;
  injectNumber: number;
  totalInjects: number;
  onSelectOption: (optionId: string) => void;
  disabled: boolean;
  /** The roles the user selected for this session — used to detect "Joint Command" */
  selectedRoles?: Role[];
}

/** Assign unique accent colors to options */
const OPTION_ACCENTS = [
  {
    border: "hover:border-red-500",
    icon: <Shield className="h-5 w-5" />,
    iconBg: "bg-red-500/10 text-red-500",
    titleHover: "group-hover:text-red-500",
  },
  {
    border: "hover:border-primary",
    icon: <Eye className="h-5 w-5" />,
    iconBg: "bg-primary/10 text-primary",
    titleHover: "group-hover:text-primary",
  },
  {
    border: "hover:border-purple-500",
    icon: <Zap className="h-5 w-5" />,
    iconBg: "bg-purple-500/10 text-purple-500",
    titleHover: "group-hover:text-purple-500",
  },
  {
    border: "hover:border-emerald-500",
    icon: <Scale className="h-5 w-5" />,
    iconBg: "bg-emerald-500/10 text-emerald-500",
    titleHover: "group-hover:text-emerald-500",
  },
];

export function InjectCard({
  inject,
  injectNumber,
  totalInjects,
  onSelectOption,
  disabled,
  selectedRoles = [],
}: InjectCardProps) {
  // ── Determine which role badges to show ──
  const targetRoles = inject.targetRoles ?? [];
  const isJointCommand =
    selectedRoles.length > 1 &&
    targetRoles.length > 1 &&
    selectedRoles.every((r) => targetRoles.includes(r));

  return (
    <div className="flex flex-col gap-6">
      {/* ---- Situation Card ---- */}
      <div className="bg-surface border border-[#334155] rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row relative group">
        {/* Left colored strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 z-10" />

        {/* Visual/Map Area */}
        <div className="w-full md:w-1/3 min-h-[200px] relative bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-20 rounded-full border border-red-500/30 flex items-center justify-center animate-ping absolute" />
            <div className="size-10 rounded-full bg-red-500/20 flex items-center justify-center relative backdrop-blur-sm border border-red-500/50">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur text-[10px] font-mono text-white rounded border border-white/10">
            INJECT {injectNumber}/{totalInjects}
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3 p-6 flex flex-col justify-center">
          {/* ── Role Target Badges ── */}
          {targetRoles.length > 0 && (
            <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-left-3 duration-300" key={inject.id}>
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-600 uppercase mr-1">
                &gt;&gt; TARGET:
              </span>
              {isJointCommand ? (
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[11px] font-bold uppercase tracking-wider transition-all",
                    JOINT_COMMAND_VISUAL.bg,
                    JOINT_COMMAND_VISUAL.border,
                    JOINT_COMMAND_VISUAL.text,
                    JOINT_COMMAND_VISUAL.glow
                  )}
                >
                  {JOINT_COMMAND_VISUAL.icon}
                  {JOINT_COMMAND_VISUAL.label}
                </div>
              ) : (
                targetRoles.map((role) => {
                  const visual = ROLE_VISUALS[role];
                  if (!visual) return null;
                  return (
                    <div
                      key={role}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[11px] font-bold uppercase tracking-wider transition-all",
                        visual.bg,
                        visual.border,
                        visual.text,
                        visual.glow
                      )}
                    >
                      {visual.icon}
                      {visual.label}
                    </div>
                  );
                })
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <Badge variant="critical" className="text-[10px] uppercase">
              Active
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              {inject.timestamp_display}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            {inject.question}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            {inject.context}
          </p>
        </div>
      </div>

      {/* ---- Available Countermeasures Label ---- */}
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mt-2 mb-1">
        Available Countermeasures
      </h3>

      {/* ---- Decision Options Grid ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inject.options.map((option, idx) => {
          const accent = OPTION_ACCENTS[idx % OPTION_ACCENTS.length];
          return (
            <button
              key={option.id}
              disabled={disabled}
              onClick={() => onSelectOption(option.id)}
              className={cn(
                "group text-left relative bg-surface hover:bg-surface-hover border border-[#334155] p-5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:pointer-events-none",
                accent.border
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform",
                    accent.iconBg
                  )}
                >
                  {accent.icon}
                </div>
                <span className="text-xs font-mono text-slate-400 border border-[#334155] rounded px-1.5 py-0.5">
                  OPT: {String.fromCharCode(65 + idx)}
                </span>
              </div>
              <h4
                className={cn(
                  "text-base font-bold text-white mb-1 transition-colors",
                  accent.titleHover
                )}
              >
                {option.label}
              </h4>
              <div className="flex items-center justify-end mt-3">
                <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
