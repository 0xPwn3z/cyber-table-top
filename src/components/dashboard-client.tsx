"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Scenario } from "@/types/game";
import { ScenarioCard } from "@/components/scenario-card";
import { ThreatMapBackground } from "@/components/threat-map-background";
import { useGameStore } from "@/lib/store";
import { useOnboardingStore } from "@/lib/onboarding-store";
import {
  Shield,
  Search,
  PlayCircle,
  Download,
  CheckCircle2,
  BarChart2,
  Flame,
  Timer,
  TrendingUp,
  Terminal,
} from "lucide-react";

const FILTER_CATEGORIES = [
  "All Scenarios",
  "Ransomware",
  "Phishing",
  "Network Defense",
  "Social Engineering",
] as const;

const SORT_OPTIONS = [
  "Recommended",
  "Difficulty: High to Low",
  "Difficulty: Low to High",
  "Newest First",
] as const;

interface DashboardClientProps {
  scenarios: Scenario[];
}

export function DashboardClient({ scenarios }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All Scenarios");
  const [sortBy, setSortBy] = useState<string>("Recommended");
  const router = useRouter();
  const { isSimulationActive, activeScenarioId, phase, resetSimulation } =
    useGameStore();
  const { resetOnboarding } = useOnboardingStore();

  // Check if there's an active, in-progress simulation session
  const hasActiveSession =
    isSimulationActive &&
    activeScenarioId !== null &&
    phase !== "idle" &&
    phase !== "victory" &&
    phase !== "gameover";

  const handleQuickStart = useCallback(() => {
    if (hasActiveSession && activeScenarioId) {
      // Resume the active session
      router.push(`/game/${activeScenarioId}`);
    } else if (scenarios.length > 0) {
      // Fresh start with the first scenario
      resetSimulation();
      resetOnboarding();
      router.push(`/game/${scenarios[0].meta.id}/setup`);
    }
  }, [
    hasActiveSession,
    activeScenarioId,
    scenarios,
    router,
    resetSimulation,
    resetOnboarding,
  ]);

  const filteredScenarios = useMemo(() => {
    let filtered = [...scenarios];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.meta.title.toLowerCase().includes(query) ||
          s.meta.description.toLowerCase().includes(query) ||
          s.meta.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (activeFilter !== "All Scenarios") {
      filtered = filtered.filter((s) =>
        s.meta.tags.some(
          (t) => t.toLowerCase().includes(activeFilter.toLowerCase())
        )
      );
    }

    // Sort
    if (sortBy === "Difficulty: High to Low") {
      const order: Record<string, number> = { Hard: 0, Medium: 1, Easy: 2 };
      filtered.sort(
        (a, b) =>
          (order[a.meta.difficulty] ?? 1) - (order[b.meta.difficulty] ?? 1)
      );
    } else if (sortBy === "Difficulty: Low to High") {
      const order: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };
      filtered.sort(
        (a, b) =>
          (order[a.meta.difficulty] ?? 1) - (order[b.meta.difficulty] ?? 1)
      );
    }

    return filtered;
  }, [scenarios, searchQuery, activeFilter, sortBy]);

  return (
    <div className="min-h-screen bg-transparent relative">
      <ThreatMapBackground />
      {/* ---- Top Navigation ---- */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#334155] bg-background/95 backdrop-blur px-6 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight">CyberTabletop</h2>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              className="text-sm font-medium text-white hover:text-primary transition-colors"
              href="#"
            >
              Dashboard
            </a>
            <a
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              href="#"
            >
              Analytics
            </a>
            <a
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              href="#"
            >
              History
            </a>
            <a
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              href="#"
            >
              Team
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="hidden md:flex relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-64 rounded-lg border-0 bg-surface py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Search scenarios..."
            />
          </div>
          <div className="flex items-center gap-3 pl-6 border-l border-[#334155]">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none">Officer Chen</p>
              <p className="text-xs text-slate-400 mt-1">Level 4 Analyst</p>
            </div>
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#334155] bg-gradient-to-tr from-primary to-blue-400">
              <div className="h-full w-full flex items-center justify-center text-white font-bold text-sm">
                OC
              </div>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 md:px-10 lg:px-16 mx-auto w-full max-w-[1600px]">
        {/* ---- Hero Section ---- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              Operational Readiness
            </h1>
            <p className="text-slate-400 max-w-2xl">
              Select a tactical simulation to begin your training. Your current
              readiness score is{" "}
              <span className="text-primary font-bold">Top 5%</span>.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover rounded-lg text-sm font-medium transition-colors border border-[#334155]">
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <button
              onClick={handleQuickStart}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 transition-all"
            >
              <PlayCircle className="h-4 w-4" />
              {hasActiveSession ? "Resume Session" : "Quick Start"}
            </button>
          </div>
        </div>

        {/* ---- Stats Grid ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-surface border border-[#334155] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
              <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                +12%
                <TrendingUp className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Completed Simulations
            </p>
            <h3 className="text-2xl font-bold mt-1">24</h3>
          </div>
          <div className="bg-surface border border-[#334155] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BarChart2 className="h-5 w-5 text-purple-500" />
              </div>
              <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                +5.2%
                <TrendingUp className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Avg. Response Score
            </p>
            <h3 className="text-2xl font-bold mt-1">92%</h3>
          </div>
          <div className="bg-surface border border-[#334155] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <span className="flex items-center text-xs font-medium text-slate-400 bg-[#334155] px-2 py-1 rounded-full">
                Same
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Current Streak
            </p>
            <h3 className="text-2xl font-bold mt-1">7 Days</h3>
          </div>
          <div className="bg-surface border border-[#334155] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-teal-500/10 rounded-lg">
                <Timer className="h-5 w-5 text-teal-500" />
              </div>
              <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                +2h
                <TrendingUp className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Training Hours
            </p>
            <h3 className="text-2xl font-bold mt-1">48.5h</h3>
          </div>
        </div>

        {/* ---- Filters & Sorting ---- */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === cat
                    ? "bg-white text-slate-900 shadow-sm"
                    : "bg-surface border border-[#334155] hover:border-slate-500 text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-sm text-slate-400 mr-2">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-surface border border-[#334155] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-8 outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Scenario Grid ---- */}
        {filteredScenarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#334155] py-20 text-center">
            <Terminal className="mb-4 h-12 w-12 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-300">
              No Scenarios Found
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {searchQuery
                ? `No scenarios match "${searchQuery}". Try a different search.`
                : "No scenarios match the selected filter."}
            </p>
            {(searchQuery || activeFilter !== "All Scenarios") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("All Scenarios");
                }}
                className="mt-4 text-sm text-primary hover:text-primary-hover transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredScenarios.map((scenario) => (
              <ScenarioCard key={scenario.meta.id} scenario={scenario} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
