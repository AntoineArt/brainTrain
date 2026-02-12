'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTimerOptions {
  duration: number; // secondes
  onComplete?: () => void;
}

interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export function useTimer({ duration, onComplete }: UseTimerOptions): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(duration);
  const rafRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const tick = useCallback(() => {
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const remaining = Math.max(0, pausedAtRef.current - elapsed);
    setTimeRemaining(remaining);

    if (remaining <= 0) {
      setIsRunning(false);
      onCompleteRef.current?.();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    pausedAtRef.current = duration;
    startTimeRef.current = performance.now();
    setTimeRemaining(duration);
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [duration, tick]);

  const pause = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    pausedAtRef.current = Math.max(0, pausedAtRef.current - elapsed);
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    startTimeRef.current = performance.now();
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    pausedAtRef.current = duration;
    setTimeRemaining(duration);
    setIsRunning(false);
  }, [duration]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return { timeRemaining, isRunning, start, pause, resume, reset };
}
