"use client";

import { useEffect, useState } from "react";
import type { DecisionRecord } from "@/types/game";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackOverlayProps {
  record: DecisionRecord;
  onContinue: () => void;
}

/** Get a verdict title based on net impact */
function getVerdict(record: DecisionRecord) {
  if (record.timedOut) {
    return { label: "Inaction Penalty", icon: <Clock className="h-10 w-10 text-red-500" /> };
  }
  const net =
    record.impact.security + record.impact.business + record.impact.reputation;
  if (net > 10) {
    return { label: "Successful Response", icon: <CheckCircle2 className="h-10 w-10 text-emerald-500" /> };
  }
  if (net > 0) {
    return { label: "Partial Success", icon: <AlertTriangle className="h-10 w-10 text-yellow-500" /> };
  }
  if (net > -15) {
    return { label: "Partial Success", icon: <AlertTriangle className="h-10 w-10 text-yellow-500" /> };
  }
  return { label: "Critical Failure", icon: <AlertTriangle className="h-10 w-10 text-red-500" /> };
}

function MetricCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: number;
  sublabel: string;
}) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <div
      className={cn(
        "bg-[#161e2e] rounded-lg p-4 border border-[#232f48] flex flex-col items-center justify-center gap-1 group transition-colors",
        isPositive && "hover:border-green-500/30",
        isNegative && "hover:border-red-500/30"
      )}
    >
      <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">
        {label}
      </div>
      <div
        className={cn(
          "flex items-center gap-1",
          isPositive ? "text-green-400" : isNegative ? "text-red-400" : "text-slate-400"
        )}
      >
        {isPositive ? (
          <TrendingUp className="h-6 w-6 group-hover:-translate-y-0.5 transition-transform" />
        ) : isNegative ? (
          <TrendingDown className="h-6 w-6 group-hover:translate-y-0.5 transition-transform" />
        ) : null}
        <span className="text-3xl font-bold">
          {isPositive ? `+${value}%` : `${value}%`}
        </span>
      </div>
      <div
        className={cn(
          "text-xs font-mono",
          isPositive ? "text-green-500/60" : isNegative ? "text-red-500/60" : "text-slate-500"
        )}
      >
        {sublabel}
      </div>
    </div>
  );
}

export function FeedbackOverlay({ record, onContinue }: FeedbackOverlayProps) {
  const [canContinue, setCanContinue] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanContinue(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const verdict = getVerdict(record);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-fade-in">
      {/* Feedback Card */}
      <div className="w-full max-w-2xl bg-[#111722] border border-[#232f48] shadow-[0_0_50px_rgba(19,91,236,0.15)] rounded-xl overflow-hidden flex flex-col animate-slide-up">
        {/* Header Status */}
        <div className="relative px-8 py-6 border-b border-[#232f48] bg-gradient-to-r from-[#111722] via-[#161e2e] to-[#111722]">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
              Decision Analysis
            </div>
            <div className="flex items-center gap-3">
              {verdict.icon}
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {verdict.label}
              </h2>
            </div>
            {/* Decorative glowing line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          </div>
        </div>

        {/* Body Content */}
        <div className="p-8 space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="Security Health"
              value={record.impact.security}
              sublabel="System Integrity"
            />
            <MetricCard
              label="Business Cont."
              value={record.impact.business}
              sublabel="Uptime Impact"
            />
            <MetricCard
              label="Reputation"
              value={record.impact.reputation}
              sublabel="Client Trust"
            />
          </div>

          {/* Analysis Text */}
          <div className="bg-[#192233]/50 rounded-lg p-5 border-l-4 border-yellow-500/50">
            <h4 className="text-white text-sm font-bold mb-2 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Analysis
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {record.feedbackText}
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col items-center gap-4 pt-2">
            <button
              onClick={onContinue}
              disabled={!canContinue}
              className={cn(
                "w-full md:w-auto min-w-[200px] h-12 font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 group",
                canContinue
                  ? "bg-primary hover:bg-primary-hover text-white shadow-primary/20 hover:shadow-primary/40"
                  : "bg-[#232f48] text-slate-400 cursor-not-allowed"
              )}
            >
              {canContinue ? (
                <>
                  Proceed to Next Inject
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>Reading... ({countdown}s)</>
              )}
            </button>
            <p className="text-xs text-slate-500">
              Next inject will begin immediately upon continuation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
