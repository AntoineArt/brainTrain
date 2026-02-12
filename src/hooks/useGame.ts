'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameState, GameResult, DifficultyLevel, GameStatus } from '@/types';
import { useTimer } from './useTimer';
import { calculatePoints, calculateAccuracy } from '@/lib/scoring';
import { generateId } from '@/lib/utils';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { MAX_HISTORY_LENGTH } from '@/lib/constants';

interface UseGameOptions {
  gameId: string;
  duration: number;
  difficulty: DifficultyLevel;
}

export function useGame({ gameId, duration, difficulty }: UseGameOptions) {
  const [state, setState] = useState<GameState>({
    status: 'idle',
    score: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    difficulty,
    timeRemaining: duration,
    startedAt: null,
  });

  const responseTimesRef = useRef<number[]>([]);

  const finishGame = useCallback(() => {
    setState((prev) => {
      if (prev.status === 'finished') return prev;

      const avgTime =
        responseTimesRef.current.length > 0
          ? responseTimesRef.current.reduce((a, b) => a + b, 0) /
            responseTimesRef.current.length
          : 0;

      const result: GameResult = {
        id: generateId(),
        gameId,
        score: prev.score,
        correctAnswers: prev.correctAnswers,
        totalAnswers: prev.totalAnswers,
        accuracy: calculateAccuracy(prev.correctAnswers, prev.totalAnswers),
        averageResponseTime: Math.round(avgTime),
        bestStreak: prev.bestStreak,
        difficulty: prev.difficulty,
        duration,
        playedAt: new Date().toISOString(),
      };

      // Save to history
      const history = getItem<GameResult[]>(STORAGE_KEYS.GAME_HISTORY) ?? [];
      history.unshift(result);
      if (history.length > MAX_HISTORY_LENGTH) history.length = MAX_HISTORY_LENGTH;
      setItem(STORAGE_KEYS.GAME_HISTORY, history);

      return { ...prev, status: 'finished' as GameStatus };
    });
  }, [gameId, duration]);

  const timer = useTimer({
    duration,
    onComplete: finishGame,
  });

  const showInstructions = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'instructions' }));
  }, []);

  const startGame = useCallback(() => {
    responseTimesRef.current = [];
    setState({
      status: 'playing',
      score: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      difficulty,
      timeRemaining: duration,
      startedAt: Date.now(),
    });
    timer.start();
  }, [difficulty, duration, timer]);

  const answerQuestion = useCallback(
    (correct: boolean, responseTimeMs: number) => {
      responseTimesRef.current.push(responseTimeMs);

      setState((prev) => {
        const newStreak = correct ? prev.currentStreak + 1 : 0;
        const points = calculatePoints(correct, responseTimeMs, prev.currentStreak);

        return {
          ...prev,
          score: prev.score + points,
          correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
          totalAnswers: prev.totalAnswers + 1,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
        };
      });
    },
    [],
  );

  const pauseGame = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'paused' }));
    timer.pause();
  }, [timer]);

  const resumeGame = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'playing' }));
    timer.resume();
  }, [timer]);

  const getLastResult = useCallback((): GameResult | null => {
    const history = getItem<GameResult[]>(STORAGE_KEYS.GAME_HISTORY);
    if (!history || history.length === 0) return null;
    return history[0];
  }, []);

  return {
    state: { ...state, timeRemaining: timer.timeRemaining },
    showInstructions,
    startGame,
    answerQuestion,
    pauseGame,
    resumeGame,
    finishGame,
    getLastResult,
    isTimerRunning: timer.isRunning,
  };
}
