"use client";

import { Shield, TrendingUp, Globe } from "lucide-react";
import type { ScoreTriad } from "@/types/game";
import { cn } from "@/lib/utils";

interface ScoreBarsProps {
  scores: ScoreTriad;
}

interface SingleBarProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  barColor: string;
  valueColor: string;
}

function SingleBar({
  label,
  value,
  icon,
  barColor,
  valueColor,
}: SingleBarProps) {
  const isLow = value <= 25;
  const isCritical = value <= 10;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          {icon}
          {label}
        </span>
        <span
          className={cn(
            "text-sm font-mono font-bold",
            isCritical
              ? "text-red-400 animate-pulse"
              : isLow
                ? "text-amber-400"
                : valueColor
          )}
        >
          {value}%
        </span>
      </div>
      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            isCritical ? "bg-red-500 animate-pulse" : barColor
          )}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

export function ScoreBars({ scores }: ScoreBarsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SingleBar
        label="Security Health"
        value={scores.security}
        icon={<Shield className="h-4 w-4" />}
        barColor="bg-primary"
        valueColor="text-primary"
      />
      <SingleBar
        label="Business Cont."
        value={scores.business}
        icon={<TrendingUp className="h-4 w-4" />}
        barColor="bg-yellow-500"
        valueColor="text-yellow-500"
      />
      <SingleBar
        label="Reputation"
        value={scores.reputation}
        icon={<Globe className="h-4 w-4" />}
        barColor="bg-emerald-500"
        valueColor="text-emerald-500"
      />
    </div>
  );
}
