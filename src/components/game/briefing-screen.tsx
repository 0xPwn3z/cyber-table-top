"use client";

import { useState, useCallback } from "react";
import type { Scenario, Role } from "@/types/game";
import {
  Shield,
  Crosshair,
  Terminal,
  Briefcase,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── Role definitions matching UX reference ── */
interface RoleConfig {
  key: Role;
  title: string;
  badgeLabel: string;
  description: string;
  capabilities: string[];
  icon: React.ReactNode;
  accentBg: string;
  accentText: string;
  badgeBg: string;
  badgeBorder: string;
  glowColor: string;
  popular?: boolean;
}

const ROLES: RoleConfig[] = [
  {
    key: "CISO",
    title: "CISO",
    badgeLabel: "Strategic",
    description:
      "Prioritize business continuity, manage executive stakeholders, and make high-level decisions on ransom payments and PR strategy.",
    capabilities: ["Board communication", "Legal & compliance", "Budget authorization"],
    icon: <Shield className="h-6 w-6" />,
    accentBg: "bg-indigo-500/10",
    accentText: "text-indigo-400",
    badgeBg: "bg-indigo-500/10",
    badgeBorder: "border-indigo-500/20",
    glowColor: "shadow-[0_0_25px_rgba(99,102,241,0.35)]",
  },
  {
    key: "SOC_LEAD",
    title: "SOC Analyst",
    badgeLabel: "Operational",
    description:
      "Monitor alerts, triage incoming threats, and defend the perimeter. Focus on speed, accuracy, and containment of the incident.",
    capabilities: ["Live threat monitoring", "Firewall & SIEM management", "Incident triage"],
    icon: <Crosshair className="h-6 w-6" />,
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-400",
    badgeBg: "bg-blue-500/10",
    badgeBorder: "border-blue-500/20",
    glowColor: "shadow-[0_0_25px_rgba(59,130,246,0.35)]",
    popular: true,
  },
  {
    key: "DFIR",
    title: "DFIR Lead",
    badgeLabel: "Technical",
    description:
      "Deep-dive forensics, malware analysis, and evidence preservation. Focus on root cause analysis and adversary attribution.",
    capabilities: ["Malware reverse engineering", "Disk & memory forensics", "Chain of custody"],
    icon: <Terminal className="h-6 w-6" />,
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-400",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/20",
    glowColor: "shadow-[0_0_25px_rgba(16,185,129,0.35)]",
  },
  {
    key: "IT_MANAGER",
    title: "IT Manager",
    badgeLabel: "Infrastructure",
    description:
      "Manage infrastructure decisions, disaster recovery, and business continuity planning during active incidents.",
    capabilities: ["Infrastructure recovery", "Backup management", "Vendor coordination"],
    icon: <Briefcase className="h-6 w-6" />,
    accentBg: "bg-amber-500/10",
    accentText: "text-amber-400",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/20",
    glowColor: "shadow-[0_0_25px_rgba(245,158,11,0.35)]",
  },
];

interface BriefingScreenProps {
  scenario: Scenario;
  onStart: (roles: Role[]) => void;
}

export function BriefingScreen({ scenario, onStart }: BriefingScreenProps) {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  // Only show roles that are playable for this scenario
  const availableRoles = ROLES.filter((r) =>
    scenario.configuration.playable_roles.includes(r.key)
  );

  const toggleRole = useCallback((roleKey: Role) => {
    setSelectedRoles((prev) =>
      prev.includes(roleKey)
        ? prev.filter((r) => r !== roleKey)
        : [...prev, roleKey]
    );
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedRoles.length === 0) return;
    onStart(selectedRoles);
  }, [selectedRoles, onStart]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4 overflow-y-auto">
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

      <div className="relative z-10 flex flex-col max-w-[1080px] w-full animate-fade-in-up py-8">
        {/* ── Header Section ── */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 border border-primary/20 mb-2">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-white tracking-tight text-3xl font-bold leading-tight md:text-5xl">
            Select Your Training Persona(s)
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-normal leading-normal max-w-[640px]">
            Choose one or more roles to assume during this crisis simulation.
            Selecting multiple roles creates a mixed question pool, testing your
            cross-functional decision-making.
          </p>
          {selectedRoles.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Selected:</span>
              {selectedRoles.map((r) => (
                <span
                  key={r}
                  className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/15 text-primary border border-primary/30"
                >
                  {ROLES.find((rc) => rc.key === r)?.title ?? r}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Role Cards Grid ── */}
        <div
          className={cn(
            "grid gap-6 w-full",
            availableRoles.length <= 3
              ? "grid-cols-1 md:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {availableRoles.map((role) => {
            const isSelected = selectedRoles.includes(role.key);
            return (
            <div
              key={role.key}
              onClick={() => toggleRole(role.key)}
              className={cn(
                "group relative flex flex-col rounded-xl border p-6 transition-all duration-300 cursor-pointer",
                isSelected
                  ? `border-primary bg-[#161e2e] ${role.glowColor}`
                  : "border-[#324467] bg-[#161e2e] hover:border-primary hover:shadow-[0_0_30px_rgba(19,91,236,0.15)] hover:-translate-y-1"
              )}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white animate-in zoom-in duration-200">
                  <Check className="h-4 w-4" />
                </div>
              )}
              {/* Popular badge */}
              {role.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  Most Popular
                </div>
              )}

              {/* Top row: icon + badge */}
              <div className="mb-6 flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-300",
                    role.accentBg,
                    role.accentText,
                    "group-hover:bg-primary group-hover:text-white"
                  )}
                >
                  {role.icon}
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border",
                    role.badgeBg,
                    role.accentText,
                    role.badgeBorder
                  )}
                >
                  {role.badgeLabel}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-2 flex-grow">
                <h2 className="text-xl font-bold text-white">{role.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {role.description}
                </p>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
                  {role.capabilities.map((cap) => (
                    <li key={cap} className="flex items-center gap-2">
                      <CheckCircle2 className="h-[18px] w-[18px] text-green-500 shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Select button */}
              <div className="mt-8 pt-6 border-t border-[#324467] group-hover:border-primary/30 transition-colors">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRole(role.key);
                  }}
                  className={cn(
                    "w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                    isSelected
                      ? "bg-primary text-white shadow-lg"
                      : "bg-[#232f48] text-white hover:bg-primary hover:shadow-lg"
                  )}
                >
                  {isSelected ? (
                    <><Check className="h-4 w-4" /><span>Selected</span></>
                  ) : (
                    <><span>Select {role.title}</span><ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            onClick={handleConfirm}
            disabled={selectedRoles.length === 0}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-lg text-base font-bold transition-all duration-300",
              selectedRoles.length > 0
                ? "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 hover:shadow-primary/40"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            )}
          >
            <span>Begin Simulation</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <Link
            href="/"
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Scenario Selection
          </Link>
        </div>
      </div>
    </div>
  );
}
