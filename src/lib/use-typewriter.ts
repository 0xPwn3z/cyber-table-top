"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================================
// useTypewriter — Reusable hook for character-by-character typing animation
// Used in the ScenarioBriefing component for the "secure transmission" effect.
// ============================================================================

interface UseTypewriterOptions {
  /** The full text to type out */
  text: string;
  /** Milliseconds per character (default: 22) */
  speed?: number;
  /** Delay before typing starts in ms (default: 0) */
  startDelay?: number;
  /** Called when the full text has been revealed */
  onComplete?: () => void;
}

interface UseTypewriterReturn {
  /** The currently visible portion of the text */
  displayText: string;
  /** Whether the full text has been revealed */
  isComplete: boolean;
  /** Skip the animation and reveal all text immediately */
  skip: () => void;
}

export function useTypewriter({
  text,
  speed = 22,
  startDelay = 0,
  onComplete,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep callback ref in sync without triggering re-effects
  onCompleteRef.current = onComplete;

  const skip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDisplayText(text);
    setIsComplete(true);
    onCompleteRef.current?.();
  }, [text]);

  useEffect(() => {
    // Reset state when text changes
    setDisplayText("");
    setIsComplete(false);
    indexRef.current = 0;

    if (!text) {
      setIsComplete(true);
      return;
    }

    const tick = () => {
      if (indexRef.current < text.length) {
        indexRef.current++;
        setDisplayText(text.slice(0, indexRef.current));
        timeoutRef.current = setTimeout(tick, speed);
      } else {
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    };

    if (startDelay > 0) {
      timeoutRef.current = setTimeout(tick, startDelay);
    } else {
      tick();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, startDelay]);

  return { displayText, isComplete, skip };
}
