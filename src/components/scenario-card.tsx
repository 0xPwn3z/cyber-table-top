"use client";

import Link from "next/link";
import type { Scenario } from "@/types/game";
import {
  Shield,
  Clock,
  BarChart2,
  Users,
  ArrowRight,
  Skull,
  Bug,
  Fingerprint,
  AlertTriangle,
  Globe,
  Cloud,
  UserX,
} from "lucide-react";

/** Map scenario tags to relevant icons */
function getScenarioIcon(tags: string[]) {
  const tagSet = tags.map((t) => t.toLowerCase());
  if (tagSet.includes("ransomware"))
    return <Skull className="h-7 w-7 text-red-500" />;
  if (tagSet.includes("phishing"))
    return <Bug className="h-7 w-7 text-yellow-500" />;
  if (tagSet.includes("data breach") || tagSet.includes("data exfiltration"))
    return <Cloud className="h-7 w-7 text-orange-500" />;
  if (tagSet.includes("ddos"))
    return <Globe className="h-7 w-7 text-blue-500" />;
  if (tagSet.includes("insider threat"))
    return <UserX className="h-7 w-7 text-red-500" />;
  if (tagSet.includes("social engineering"))
    return <Fingerprint className="h-7 w-7 text-purple-500" />;
  return <AlertTriangle className="h-7 w-7 text-primary" />;
}

/** Map difficulty to severity badge classes */
function getDifficultyBadge(difficulty: string) {
  switch (difficulty) {
    case "Hard":
      return {
        classes:
          "bg-red-900/30 text-red-400 border border-red-900/50",
        label: "CRITICAL",
      };
    case "Medium":
      return {
        classes:
          "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50",
        label: "MEDIUM",
      };
    case "Easy":
      return {
        classes:
          "bg-blue-900/30 text-blue-400 border border-blue-900/50",
        label: "LOW",
      };
    default:
      return {
        classes:
          "bg-[#334155] text-slate-300 border border-[#334155]",
        label: difficulty.toUpperCase(),
      };
  }
}

/** Map difficulty to display text */
function getDifficultyLabel(difficulty: string) {
  switch (difficulty) {
    case "Hard":
      return "ADVANCED";
    case "Medium":
      return "INTERMEDIATE";
    case "Easy":
      return "BEGINNER";
    default:
      return difficulty.toUpperCase();
  }
}

interface ScenarioCardProps {
  scenario: Scenario;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const { meta, configuration, injects } = scenario;
  const diffBadge = getDifficultyBadge(meta.difficulty);
  const iconBgMap: Record<string, string> = {
    Hard: "bg-red-500/10",
    Medium: "bg-yellow-500/10",
    Easy: "bg-blue-500/10",
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-[#334155] bg-surface p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
      {/* Icon + Badge row */}
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-lg ${iconBgMap[meta.difficulty] ?? "bg-primary/10"}`}
        >
          {getScenarioIcon(meta.tags)}
        </div>
        <div className="flex gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${diffBadge.classes}`}
          >
            {diffBadge.label}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
        {meta.title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3">
        {meta.description}
      </p>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-6 uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {meta.duration_minutes} MIN
        </div>
        <div className="flex items-center gap-1.5">
          <BarChart2 className="h-4 w-4" />
          {getDifficultyLabel(meta.difficulty)}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          {configuration.playable_roles.length > 1 ? "TEAM" : "SOLO"}
        </div>
      </div>

      {/* Start button */}
      <Link
        href={`/game/${meta.id}/setup`}
        className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg shadow-sm shadow-primary/20 transition-all flex items-center justify-center gap-2 group-hover:-translate-y-0.5"
      >
        Start Simulation
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
