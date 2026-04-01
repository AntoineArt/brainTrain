'use client';

import { useCallback, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { useGame } from './useGame';
import type { DifficultyLevel } from '@/types';

interface UseMultiplayerGameOptions {
  gameId: string;
  duration: number;
  difficulty: DifficultyLevel;
  lobbyId: Id<'lobbies'>;
  clientId: string;
}

const THROTTLE_MS = 250;

export function useMultiplayerGame({
  gameId,
  duration,
  difficulty,
  lobbyId,
  clientId,
}: UseMultiplayerGameOptions) {
  const game = useGame({ gameId, duration, difficulty });
  const updateActivity = useMutation(api.lobbies.updateActivity);
  const playerFinishedMut = useMutation(api.lobbies.playerFinished);
  const lastBroadcastRef = useRef(0);
  const pendingRef = useRef(false);
  const stateRef = useRef(game.state);
  stateRef.current = game.state;

  const broadcast = useCallback(() => {
    const s = stateRef.current;
    updateActivity({
      lobbyId,
      clientId,
      score: s.score,
      correctAnswers: s.correctAnswers,
      totalAnswers: s.totalAnswers,
      currentStreak: s.currentStreak,
      bestStreak: s.bestStreak,
    });
    lastBroadcastRef.current = Date.now();
    pendingRef.current = false;
  }, [lobbyId, clientId, updateActivity]);

  const throttledBroadcast = useCallback(() => {
    const now = Date.now();
    const elapsed = now - lastBroadcastRef.current;
    if (elapsed >= THROTTLE_MS) {
      // Use setTimeout(0) to ensure state has settled after setState
      setTimeout(broadcast, 0);
    } else if (!pendingRef.current) {
      pendingRef.current = true;
      setTimeout(broadcast, THROTTLE_MS - elapsed);
    }
  }, [broadcast]);

  const answerQuestion = useCallback(
    (correct: boolean, responseTimeMs: number) => {
      game.answerQuestion(correct, responseTimeMs);
      throttledBroadcast();
    },
    [game.answerQuestion, throttledBroadcast],
  );

  const finishGame = useCallback(() => {
    game.finishGame();
    const s = stateRef.current;
    playerFinishedMut({
      lobbyId,
      clientId,
      score: s.score,
      correctAnswers: s.correctAnswers,
      totalAnswers: s.totalAnswers,
      bestStreak: s.bestStreak,
    });
  }, [game.finishGame, lobbyId, clientId, playerFinishedMut]);

  return {
    ...game,
    answerQuestion,
    finishGame,
  };
}
