"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  validateScenarioJSON,
  sanitizeScenarioStrings,
} from "@/types/scenario";
import type { ScenarioData } from "@/types/scenario";
import {
  X,
  Upload,
  FileJson,
  ClipboardPaste,
  CheckCircle2,
  AlertTriangle,
  FileWarning,
} from "lucide-react";

// ============================================================================
// ScenarioUploadModal
// Two tabs: Drag & Drop JSON file, or Paste JSON text directly.
// Validates against the Zod schema + sanitizes strings.
// ============================================================================

interface ScenarioUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess?: (scenario: ScenarioData) => void;
}

type TabId = "file" | "paste";

interface ValidationResult {
  status: "idle" | "validating" | "success" | "error";
  scenario?: ScenarioData;
  errors?: string[];
}

export function ScenarioUploadModal({
  open,
  onClose,
  onUploadSuccess,
}: ScenarioUploadModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("file");
  const [pasteContent, setPasteContent] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [validation, setValidation] = useState<ValidationResult>({
    status: "idle",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Reset state ──
  const resetState = useCallback(() => {
    setValidation({ status: "idle" });
    setPasteContent("");
    setDragOver(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  // ── Process JSON string ──
  const processJSON = useCallback(
    (rawText: string) => {
      setValidation({ status: "validating" });

      // Parse JSON
      let parsed: unknown;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        setValidation({
          status: "error",
          errors: ["Invalid JSON syntax. Please check for missing commas, brackets, or quotes."],
        });
        return;
      }

      // Sanitize strings to prevent XSS
      const sanitized = sanitizeScenarioStrings(parsed);

      // Validate against Zod schema
      const result = validateScenarioJSON(sanitized);

      if (result.success) {
        setValidation({ status: "success", scenario: result.data });
        onUploadSuccess?.(result.data);
      } else {
        setValidation({ status: "error", errors: result.errors });
      }
    },
    [onUploadSuccess]
  );

  // ── File handling ──
  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        setValidation({
          status: "error",
          errors: ["Only .json files are accepted. Please upload a valid JSON file."],
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          processJSON(text);
        }
      };
      reader.onerror = () => {
        setValidation({
          status: "error",
          errors: ["Failed to read the file. Please try again."],
        });
      };
      reader.readAsText(file);
    },
    [processJSON]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handlePasteValidate = useCallback(() => {
    if (!pasteContent.trim()) {
      setValidation({
        status: "error",
        errors: ["Please paste JSON content before validating."],
      });
      return;
    }
    processJSON(pasteContent);
  }, [pasteContent, processJSON]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative z-10 w-full max-w-2xl rounded-xl overflow-hidden",
          "border border-slate-800/80",
          "bg-gradient-to-b from-[#0a1628] to-[#060e1f]",
          "shadow-[0_0_60px_rgba(19,91,236,0.1)]",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-900/30">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Upload className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">
                Upload New Scenario
              </h2>
              <p className="text-slate-500 text-xs">
                Import a JSON scenario file for simulation
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800/60">
          <button
            onClick={() => {
              setActiveTab("file");
              resetState();
            }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "file"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-slate-400 hover:text-white"
            )}
          >
            <FileJson className="h-4 w-4" />
            Drag & Drop File
          </button>
          <button
            onClick={() => {
              setActiveTab("paste");
              resetState();
            }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "paste"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-slate-400 hover:text-white"
            )}
          >
            <ClipboardPaste className="h-4 w-4" />
            Paste JSON
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "file" && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 cursor-pointer transition-all duration-200",
                dragOver
                  ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(19,91,236,0.1)]"
                  : "border-slate-700 hover:border-slate-500 bg-slate-900/20"
              )}
            >
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl mb-4 transition-colors",
                  dragOver ? "bg-primary/20" : "bg-slate-800"
                )}
              >
                <FileJson
                  className={cn(
                    "h-8 w-8 transition-colors",
                    dragOver ? "text-primary" : "text-slate-400"
                  )}
                />
              </div>
              <p className="text-white font-semibold mb-1">
                Drop your scenario JSON here
              </p>
              <p className="text-slate-500 text-sm">
                or click to browse files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          )}

          {activeTab === "paste" && (
            <div className="space-y-4">
              <textarea
                value={pasteContent}
                onChange={(e) => {
                  setPasteContent(e.target.value);
                  if (validation.status !== "idle") {
                    setValidation({ status: "idle" });
                  }
                }}
                placeholder='{\n  "meta": { ... },\n  "configuration": { ... },\n  "questions": [ ... ]\n}'
                className={cn(
                  "w-full h-56 rounded-xl border bg-slate-900/40 p-4",
                  "text-sm font-mono text-slate-300 placeholder:text-slate-600",
                  "outline-none resize-none transition-colors",
                  "focus:ring-2 focus:ring-primary focus:border-primary",
                  validation.status === "error"
                    ? "border-red-500/50"
                    : "border-slate-700"
                )}
              />
              <button
                onClick={handlePasteValidate}
                disabled={!pasteContent.trim()}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all",
                  pasteContent.trim()
                    ? "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
                Validate & Import
              </button>
            </div>
          )}

          {/* Validation Results */}
          {validation.status === "success" && validation.scenario && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-950/20 p-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-400 font-semibold text-sm">
                    Scenario validated successfully!
                  </p>
                  <p className="text-green-500/70 text-xs mt-1">
                    &ldquo;{validation.scenario.meta.title}&rdquo; —{" "}
                    {validation.scenario.questions.length} questions,{" "}
                    {validation.scenario.meta.difficulty} difficulty
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-3 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {validation.status === "error" && validation.errors && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-950/20 p-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start gap-3">
                <FileWarning className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-red-400 font-semibold text-sm">
                    Validation failed
                  </p>
                  <ul className="mt-2 space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                    {validation.errors.map((err, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-red-400/80"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span className="font-mono break-all">{err}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
