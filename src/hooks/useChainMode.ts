'use client';

import { useState, useCallback } from 'react';
import { shuffle } from '@/lib/utils';
import { GAME_REGISTRY } from '@/games/registry';
import type { GameConfig, GameResult } from '@/types';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { MAX_HISTORY_LENGTH } from '@/lib/constants';

interface ChainModeState {
  isActive: boolean;
  currentGameIndex: number;
  gameQueue: GameConfig[];
  results: { config: GameConfig; score: number; correct: number; total: number }[];
  showingTransition: boolean;
  finished: boolean;
}

export function useChainMode() {
  const [state, setState] = useState<ChainModeState>({
    isActive: false,
    currentGameIndex: 0,
    gameQueue: [],
    results: [],
    showingTransition: false,
    finished: false,
  });

  const startChain = useCallback(() => {
    const queue = shuffle([...GAME_REGISTRY]);
    setState({
      isActive: true,
      currentGameIndex: 0,
      gameQueue: queue,
      results: [],
      showingTransition: false,
      finished: false,
    });
  }, []);

  const recordResult = useCallback(
    (score: number, correct: number, total: number) => {
      setState((prev) => {
        const currentGame = prev.gameQueue[prev.currentGameIndex];
        if (!currentGame) return prev;

        return {
          ...prev,
          results: [
            ...prev.results,
            { config: currentGame, score, correct, total },
          ],
          showingTransition: true,
        };
      });
    },
    [],
  );

  const nextGame = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentGameIndex + 1;
      if (nextIndex >= prev.gameQueue.length) {
        return { ...prev, finished: true, showingTransition: false };
      }
      return {
        ...prev,
        currentGameIndex: nextIndex,
        showingTransition: false,
      };
    });
  }, []);

  const endChain = useCallback(() => {
    setState((prev) => ({ ...prev, finished: true, showingTransition: false }));
  }, []);

  const resetChain = useCallback(() => {
    setState({
      isActive: false,
      currentGameIndex: 0,
      gameQueue: [],
      results: [],
      showingTransition: false,
      finished: false,
    });
  }, []);

  const currentGame =
    state.isActive && !state.finished
      ? state.gameQueue[state.currentGameIndex]
      : null;

  const totalScore = state.results.reduce((sum, r) => sum + r.score, 0);
  const gamesPlayed = state.results.length;

  return {
    state,
    currentGame,
    totalScore,
    gamesPlayed,
    startChain,
    recordResult,
    nextGame,
    endChain,
    resetChain,
  };
}
