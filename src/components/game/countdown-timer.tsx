"use client";

import { useEffect, useRef, useCallback } from "react";
import { Timer, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimer } from "@/lib/utils";

interface CountdownTimerProps {
  seconds: number;
  maxSeconds: number;
  running: boolean;
  onTick: () => void;
}

export function CountdownTimer({
  seconds,
  maxSeconds,
  running,
  onTick,
}: CountdownTimerProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();

    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        onTick();
      }, 1000);
    }

    return clearTimer;
  }, [running, seconds > 0, onTick, clearTimer]);

  const isUrgent = seconds <= 10;
  const isCritical = seconds <= 5;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-300",
        isCritical
          ? "animate-timer-urgency border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          : isUrgent
            ? "border-red-500/30 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse-fast"
            : "border-red-500/30 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse-fast"
      )}
    >
      {isCritical ? (
        <AlertTriangle className="h-5 w-5 animate-pulse text-red-500" />
      ) : (
        <Timer className={cn("h-5 w-5 text-red-500", running && "animate-pulse")} />
      )}

      <div className="flex flex-col items-end">
        <span className="text-[10px] uppercase font-bold text-red-500 tracking-widest leading-none mb-1">
          Crisis Timer
        </span>
        <span
          className={cn(
            "text-2xl font-mono font-bold leading-none tracking-widest",
            isCritical
              ? "text-red-400"
              : isUrgent
                ? "text-red-400"
                : "text-red-500"
          )}
        >
          {formatTimer(seconds)}
        </span>
      </div>
    </div>
  );
}
