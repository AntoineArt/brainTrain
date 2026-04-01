'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import type { DifficultyLevel } from '@/types';
import { useMultiplayerGame } from '@/hooks/useMultiplayerGame';
import { useTranslation } from '@/hooks/useTranslation';
import { GameTimer } from '@/components/game/GameTimer';
import { GameScore } from '@/components/game/GameScore';
import { OpponentStrip } from './OpponentStrip';
import { CountdownOverlay } from './CountdownOverlay';

interface MultiplayerGameShellProps {
  lobbyId: Id<'lobbies'>;
  lobbyCode: string;
  clientId: string;
  gameId: string;
  difficulty: DifficultyLevel;
  duration: number;
  gameStartsAt: number;
  children: (props: {
    onAnswer: (correct: boolean, responseTime: number) => void;
    onComplete: () => void;
    difficulty: DifficultyLevel;
    timeRemaining: number;
    isPaused: boolean;
  }) => React.ReactNode;
}

export function MultiplayerGameShell({
  lobbyId,
  lobbyCode,
  clientId,
  gameId,
  difficulty,
  duration,
  gameStartsAt,
  children,
}: MultiplayerGameShellProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [countdownDone, setCountdownDone] = useState(false);
  const gameStartedRef = useRef(false);
  const markPlaying = useMutation(api.lobbies.markPlaying);

  const players = useQuery(api.lobbies.getPlayers, { lobbyId });
  const lobby = useQuery(api.lobbies.getLobby, { code: lobbyCode });

  const game = useMultiplayerGame({
    gameId,
    duration,
    difficulty,
    lobbyId,
    clientId,
  });

  const { state } = game;

  // Start game when countdown finishes
  const handleCountdownComplete = useCallback(() => {
    setCountdownDone(true);
  }, []);

  useEffect(() => {
    if (countdownDone && !gameStartedRef.current) {
      gameStartedRef.current = true;
      game.startGame(difficulty);
      markPlaying({ lobbyId });
    }
  }, [countdownDone, difficulty, game.startGame, lobbyId, markPlaying]);

  // Navigate to results when lobby finishes
  useEffect(() => {
    if (lobby?.status === 'finished') {
      // Brief delay so final state settles
      const timeout = setTimeout(() => {
        router.push(`/multiplayer/results/${lobbyCode}`);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [lobby?.status, lobbyCode, router]);

  // Show countdown overlay before game starts
  if (!countdownDone) {
    return (
      <CountdownOverlay
        gameStartsAt={gameStartsAt}
        onComplete={handleCountdownComplete}
      />
    );
  }

  const timeRatio = state.timeRemaining / duration;
  const barColor =
    timeRatio < 0.25 ? 'var(--error)' : timeRatio < 0.5 ? 'var(--warning)' : 'var(--secondary)';

  return (
    <div className="flex flex-col h-dvh">
      {/* Game HUD */}
      <div className="flex items-center justify-between px-4 py-2 glass border-b border-border/40">
        <button
          onClick={() => router.push(`/multiplayer/lobby/${lobbyCode}`)}
          className="text-muted hover:text-foreground transition-colors touch-manipulation cursor-pointer p-1"
          aria-label={t('game.back')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <GameTimer
          timeRemaining={state.timeRemaining}
          totalDuration={duration}
        />
        <GameScore score={state.score} streak={state.currentStreak} />
      </div>

      {/* Opponent strip */}
      {players && (
        <OpponentStrip players={players} currentClientId={clientId} />
      )}

      {/* Time progress bar */}
      <div className="h-1 bg-border/20">
        <div
          className={`h-full transition-all duration-200 rounded-r-full ${timeRatio < 0.25 ? 'animate-pulse-soft' : ''}`}
          style={{
            width: `${timeRatio * 100}%`,
            backgroundColor: barColor,
          }}
        />
      </div>

      {/* Game content */}
      <div className="flex-1 overflow-hidden">
        {children({
          onAnswer: game.answerQuestion,
          onComplete: game.finishGame,
          difficulty,
          timeRemaining: state.timeRemaining,
          isPaused: state.status === 'paused',
        })}
      </div>
    </div>
  );
}
