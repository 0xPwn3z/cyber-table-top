"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/lib/store";
import type { Scenario, Role, Inject } from "@/types/game";

import { ScoreBars } from "@/components/game/score-bars";
import { CountdownTimer } from "@/components/game/countdown-timer";
import { InjectCard } from "@/components/game/inject-card";
import { EventLog } from "@/components/game/event-log";
import { FeedbackOverlay } from "@/components/game/feedback-overlay";
import { GameEndScreen } from "@/components/game/game-end-screen";
import { BriefingScreen } from "@/components/game/briefing-screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ArrowLeft,
  RotateCcw,
  X,
} from "lucide-react";

interface GameClientProps {
  scenario: Scenario;
}

export function GameClient({ scenario }: GameClientProps) {
  const router = useRouter();
  const [confirmingReset, setConfirmingReset] = useState(false);

  const {
    phase,
    scores,
    currentInjectIndex,
    history,
    timerSeconds,
    timerRunning,
    selectedRole,
    startGame,
    makeDecision,
    tickTimer,
    advanceToNextInject,
    resetGame,
    resetSimulation,
  } = useGameStore();

  // -- Derived state --
  const currentInject: Inject | null = useMemo(
    () => scenario.injects[currentInjectIndex] ?? null,
    [scenario.injects, currentInjectIndex]
  );

  const maxTimerSeconds: number = useMemo(
    () => currentInject?.timer_seconds ?? 30,
    [currentInject]
  );

  const lastDecision = useMemo(
    () => (history.length > 0 ? history[history.length - 1] : null),
    [history]
  );

  // -- Callbacks --
  const handleStart = useCallback(
    (role: Role) => {
      startGame(scenario, role);
      // Immediately transition from briefing to playing after a small delay
      // to let the user see the briefing → playing transition
      setTimeout(() => {
        useGameStore.setState({ phase: "playing", timerRunning: true });
      }, 100);
    },
    [scenario, startGame]
  );

  const handleDecision = useCallback(
    (optionId: string) => {
      makeDecision(optionId);
    },
    [makeDecision]
  );

  const handleContinue = useCallback(() => {
    advanceToNextInject();
  }, [advanceToNextInject]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleReset = useCallback(() => {
    resetSimulation();
    setConfirmingReset(false);
    router.push("/");
  }, [resetSimulation, router]);

  const handleTick = useCallback(() => {
    tickTimer();
  }, [tickTimer]);

  // ============================================================================
  // Render based on phase
  // ============================================================================

  // Idle → show briefing to start
  if (phase === "idle" || phase === "briefing") {
    return <BriefingScreen scenario={scenario} onStart={handleStart} />;
  }

  // Game Over / Victory overlay
  if (phase === "gameover" || phase === "victory") {
    return (
      <>
        <GameLayout
          scenario={scenario}
          scores={scores}
          currentInject={currentInject}
          currentInjectIndex={currentInjectIndex}
          timerSeconds={timerSeconds}
          maxTimerSeconds={maxTimerSeconds}
          timerRunning={false}
          history={history}
          selectedRole={selectedRole}
          onDecision={handleDecision}
          onTick={handleTick}
          disabled
          confirmingReset={confirmingReset}
          onConfirmReset={handleReset}
          onCancelReset={() => setConfirmingReset(false)}
          onRequestReset={() => setConfirmingReset(true)}
        />
        <GameEndScreen
          variant={phase}
          scores={scores}
          history={history}
          scenarioTitle={scenario.meta.title}
          onRestart={handleRestart}
        />
      </>
    );
  }

  // Feedback overlay
  if (phase === "feedback" && lastDecision) {
    return (
      <>
        <GameLayout
          scenario={scenario}
          scores={scores}
          currentInject={currentInject}
          currentInjectIndex={currentInjectIndex}
          timerSeconds={timerSeconds}
          maxTimerSeconds={maxTimerSeconds}
          timerRunning={false}
          history={history}
          selectedRole={selectedRole}
          onDecision={handleDecision}
          onTick={handleTick}
          disabled
          confirmingReset={confirmingReset}
          onConfirmReset={handleReset}
          onCancelReset={() => setConfirmingReset(false)}
          onRequestReset={() => setConfirmingReset(true)}
        />
        <FeedbackOverlay record={lastDecision} onContinue={handleContinue} />
      </>
    );
  }

  // Playing
  return (
    <GameLayout
      scenario={scenario}
      scores={scores}
      currentInject={currentInject}
      currentInjectIndex={currentInjectIndex}
      timerSeconds={timerSeconds}
      maxTimerSeconds={maxTimerSeconds}
      timerRunning={timerRunning}
      history={history}
      selectedRole={selectedRole}
      onDecision={handleDecision}
      onTick={handleTick}
      disabled={false}
      confirmingReset={confirmingReset}
      onConfirmReset={handleReset}
      onCancelReset={() => setConfirmingReset(false)}
      onRequestReset={() => setConfirmingReset(true)}
    />
  );
}

// ============================================================================
// Game Layout Component
// ============================================================================

interface GameLayoutProps {
  scenario: Scenario;
  scores: {
    security: number;
    business: number;
    reputation: number;
  };
  currentInject: Inject | null;
  currentInjectIndex: number;
  timerSeconds: number;
  maxTimerSeconds: number;
  timerRunning: boolean;
  history: Array<{
    injectId: string;
    optionId: string;
    optionLabel: string;
    feedbackText: string;
    impact: { security: number; business: number; reputation: number };
    timestamp: number;
    timedOut: boolean;
  }>;
  selectedRole: string | null;
  onDecision: (optionId: string) => void;
  onTick: () => void;
  disabled: boolean;
  confirmingReset: boolean;
  onConfirmReset: () => void;
  onCancelReset: () => void;
  onRequestReset: () => void;
}

function GameLayout({
  scenario,
  scores,
  currentInject,
  currentInjectIndex,
  timerSeconds,
  maxTimerSeconds,
  timerRunning,
  history,
  selectedRole,
  onDecision,
  onTick,
  disabled,
  confirmingReset,
  onConfirmReset,
  onCancelReset,
  onRequestReset,
}: GameLayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* ---- Top Navigation ---- */}
      <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-slate-800 bg-[#111722] px-6 py-3 z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight">
              CyberTabletop: Active Simulation
            </h2>
          </Link>
          <Badge variant="live" className="hidden md:flex">
            Live Scenario
          </Badge>
        </div>
        <div className="flex gap-3 items-center">
          {selectedRole && (
            <Badge variant="secondary" className="text-xs font-mono">
              {selectedRole}
            </Badge>
          )}

          {/* Reset Button with Confirmation */}
          {confirmingReset ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-950/40 px-3 py-1.5 animate-in fade-in slide-in-from-right-2 duration-200">
              <span className="text-xs text-red-400 font-medium whitespace-nowrap">
                Reset simulation?
              </span>
              <Button
                variant="destructive"
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={onConfirmReset}
              >
                Confirm
              </Button>
              <button
                onClick={onCancelReset}
                className="flex items-center justify-center size-7 rounded hover:bg-red-900/40 text-red-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onRequestReset}
              className="flex items-center justify-center size-10 rounded-lg hover:bg-red-950/50 text-slate-400 hover:text-red-400 transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          )}

          <Link
            href="/"
            className="flex items-center justify-center size-10 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* ---- Main Content Area ---- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

        {/* Dashboard Header: Metrics & Timer */}
        <div className="flex-none px-6 py-5 border-b border-slate-800 bg-[#111722]/50 backdrop-blur-sm z-10">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
            {/* Metrics Group */}
            <div className="lg:col-span-3">
              <ScoreBars scores={scores} />
            </div>

            {/* Timer */}
            <div className="lg:col-span-1 flex justify-end">
              <CountdownTimer
                seconds={timerSeconds}
                maxSeconds={maxTimerSeconds}
                running={timerRunning}
                onTick={onTick}
              />
            </div>
          </div>
        </div>

        {/* 2 Column Layout */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-[1600px] mx-auto h-full flex flex-col lg:flex-row">
            {/* Left Column (70%) - Decision Area */}
            <div className="flex-1 lg:basis-[70%] overflow-y-auto custom-scrollbar p-6">
              {currentInject ? (
                <InjectCard
                  inject={currentInject}
                  injectNumber={currentInjectIndex + 1}
                  totalInjects={scenario.injects.length}
                  onSelectOption={onDecision}
                  disabled={disabled}
                />
              ) : (
                <div className="flex items-center justify-center py-20 text-slate-500">
                  No inject loaded.
                </div>
              )}
            </div>

            {/* Right Column (30%) - Intelligence Area */}
            <div className="flex-none lg:basis-[30%] border-t lg:border-t-0 lg:border-l border-slate-700 bg-[#0c121e] flex flex-col h-[500px] lg:h-auto">
              <EventLog history={history} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
