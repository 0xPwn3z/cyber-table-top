"use client";

import type { ScoreTriad, DecisionRecord } from "@/types/game";
import {
  Trophy,
  Skull,
  Shield,
  TrendingUp,
  Globe,
  RotateCcw,
  Home,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GameEndScreenProps {
  variant: "victory" | "gameover";
  scores: ScoreTriad;
  history: DecisionRecord[];
  scenarioTitle: string;
  onRestart: () => void;
}

function getBadge(scores: ScoreTriad): { label: string; color: string } {
  const total = scores.security + scores.business + scores.reputation;
  if (total >= 250) return { label: "Cyber Hero", color: "text-emerald-400" };
  if (total >= 200) return { label: "Incident Commander", color: "text-primary" };
  if (total >= 150) return { label: "First Responder", color: "text-yellow-400" };
  return { label: "Trainee", color: "text-red-400" };
}

export function GameEndScreen({
  variant,
  scores,
  history,
  scenarioTitle,
  onRestart,
}: GameEndScreenProps) {
  const isVictory = variant === "victory";
  const badge = getBadge(scores);
  const timeouts = history.filter((r) => r.timedOut).length;
  const totalScore = scores.security + scores.business + scores.reputation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#111722] border border-[#232f48] shadow-[0_0_50px_rgba(19,91,236,0.15)] rounded-xl overflow-hidden animate-slide-up">
        <div className="p-8 space-y-6 text-center">
          {/* Icon */}
          <div
            className={cn(
              "mx-auto flex h-20 w-20 items-center justify-center rounded-full border",
              isVictory
                ? "border-primary/40 bg-primary/10"
                : "border-red-700/40 bg-red-950/50"
            )}
          >
            {isVictory ? (
              <Trophy className="h-10 w-10 text-primary" />
            ) : (
              <Skull className="h-10 w-10 text-red-400" />
            )}
          </div>

          {/* Title */}
          <div>
            <h2
              className={cn(
                "text-3xl font-bold tracking-tight",
                isVictory ? "text-white" : "text-red-400"
              )}
            >
              {isVictory ? "Simulation Complete" : "Critical Failure"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{scenarioTitle}</p>
          </div>

          {/* Badge earned */}
          <div>
            <span
              className={cn(
                "inline-block rounded-full border border-[#324467] bg-[#161e2e] px-4 py-1.5 text-sm font-semibold",
                badge.color
              )}
            >
              {badge.label}
            </span>
          </div>

          {/* Final scores */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-[#232f48] bg-[#161e2e] p-3">
              <Shield className="mx-auto mb-1 h-5 w-5 text-primary" />
              <div className="font-mono text-lg font-bold text-primary">
                {scores.security}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Security
              </div>
            </div>
            <div className="rounded-lg border border-[#232f48] bg-[#161e2e] p-3">
              <TrendingUp className="mx-auto mb-1 h-5 w-5 text-yellow-400" />
              <div className="font-mono text-lg font-bold text-yellow-400">
                {scores.business}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Business
              </div>
            </div>
            <div className="rounded-lg border border-[#232f48] bg-[#161e2e] p-3">
              <Globe className="mx-auto mb-1 h-5 w-5 text-emerald-400" />
              <div className="font-mono text-lg font-bold text-emerald-400">
                {scores.reputation}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Reputation
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <span>Total Score: </span>
              <span className="font-mono font-bold text-white">{totalScore}/300</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Decisions: </span>
              <span className="font-mono font-bold text-white">{history.length}</span>
            </div>
            {timeouts > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-red-400" />
                <span className="text-red-400">{timeouts} timeout{timeouts > 1 ? "s" : ""}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onRestart}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-[#324467] bg-[#232f48] px-4 py-3 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-[#2a3a56]"
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </button>
            <Link href="/" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/40">
                <Home className="h-4 w-4" />
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
