"use client";

import { useState } from "react";
import type { DecisionRecord } from "@/types/game";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventLogProps {
  history: DecisionRecord[];
}

function ImpactIndicator({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="flex items-center gap-0.5 text-emerald-400">
        <ArrowUpRight className="h-3 w-3" />+{value}
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="flex items-center gap-0.5 text-red-400">
        <ArrowDownRight className="h-3 w-3" />{value}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-slate-500">
      <Minus className="h-3 w-3" />0
    </span>
  );
}

function getSeverityTag(record: DecisionRecord) {
  if (record.timedOut) {
    return { label: "[SYSTEM CRITICAL]", color: "text-red-500" };
  }
  // Determine severity based on net impact
  const net =
    record.impact.security + record.impact.business + record.impact.reputation;
  if (net > 5) return { label: "[USER ACTION]", color: "text-primary" };
  if (net < -10) return { label: "[ALERT]", color: "text-yellow-500" };
  return { label: "[SYSTEM]", color: "text-emerald-500" };
}

export function EventLog({ history }: EventLogProps) {
  const [activeTab, setActiveTab] = useState<"log" | "intel">("log");

  return (
    <div className="flex flex-col h-full">
      {/* Tab Header */}
      <div className="flex border-b border-[#334155]">
        <button
          onClick={() => setActiveTab("log")}
          className={cn(
            "flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors",
            activeTab === "log"
              ? "text-primary border-b-2 border-primary bg-surface"
              : "text-slate-400 hover:bg-surface hover:text-slate-200"
          )}
        >
          System Log
        </button>
        <button
          onClick={() => setActiveTab("intel")}
          className={cn(
            "flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors",
            activeTab === "intel"
              ? "text-primary border-b-2 border-primary bg-surface"
              : "text-slate-400 hover:bg-surface hover:text-slate-200"
          )}
        >
          Intel Feed
        </button>
      </div>

      {/* Log Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3 font-mono text-xs">
        {activeTab === "log" ? (
          history.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-600">
              <Clock className="mb-2 h-8 w-8" />
              <p className="text-xs font-sans">
                System log will populate as you make decisions.
              </p>
            </div>
          ) : (
            [...history].reverse().map((record, idx) => {
              const severity = getSeverityTag(record);
              const time = new Date(record.timestamp).toLocaleTimeString(
                "en-US",
                { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }
              );
              return (
                <div
                  key={`${record.injectId}-${record.timestamp}`}
                  className={cn(
                    "flex gap-3 text-slate-400 border-b border-slate-800 pb-2",
                    idx === history.length - 1 && "opacity-50"
                  )}
                >
                  <span className="text-slate-500 w-[60px] flex-shrink-0">
                    {time}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className={cn("font-bold", severity.color)}>
                      {severity.label}
                    </span>
                    <span className="text-slate-300 font-sans">
                      {record.optionLabel}
                    </span>
                    {/* Impact row */}
                    <div className="flex gap-3 font-mono text-[11px] mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">SEC</span>
                        <ImpactIndicator value={record.impact.security} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">BIZ</span>
                        <ImpactIndicator value={record.impact.business} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">REP</span>
                        <ImpactIndicator value={record.impact.reputation} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-600">
            <p className="text-xs font-sans">
              Intel feed updates when new threat data is discovered.
            </p>
          </div>
        )}
      </div>

      {/* Terminal Input */}
      <div className="p-3 border-t border-[#334155] bg-surface">
        <div className="flex items-center gap-2 bg-black/40 rounded px-3 py-2 border border-transparent focus-within:border-primary transition-colors">
          <span className="text-slate-400 text-sm">$</span>
          <input
            className="bg-transparent border-none outline-none text-xs font-mono text-slate-100 w-full placeholder-slate-500 focus:ring-0 p-0"
            placeholder="Enter command..."
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
