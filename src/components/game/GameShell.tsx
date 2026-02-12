'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { GameConfig, DifficultyLevel } from '@/types';
import { useGame } from '@/hooks/useGame';
import { GameTimer } from './GameTimer';
import { GameScore } from './GameScore';
import { GameInstructions } from './GameInstructions';
import { GameOverScreen } from './GameOverScreen';

interface GameShellProps {
  config: GameConfig;
  difficulty?: DifficultyLevel;
  onChainFinish?: (score: number, correct: number, total: number) => void;
  children: (props: {
    onAnswer: (correct: boolean, responseTime: number) => void;
    onComplete: () => void;
    difficulty: DifficultyLevel;
    timeRemaining: number;
    isPaused: boolean;
  }) => React.ReactNode;
}

export function GameShell({ config, difficulty = 1, onChainFinish, children }: GameShellProps) {
  const router = useRouter();
  const game = useGame({
    gameId: config.id,
    duration: config.defaultDuration,
    difficulty,
  });

  const { state } = game;
  const chainFinishCalledRef = useRef(false);

  useEffect(() => {
    if (state.status === 'finished' && onChainFinish && !chainFinishCalledRef.current) {
      chainFinishCalledRef.current = true;
      onChainFinish(state.score, state.correctAnswers, state.totalAnswers);
    }
  }, [state.status, state.score, state.correctAnswers, state.totalAnswers, onChainFinish]);

  if (state.status === 'idle' || state.status === 'instructions') {
    return (
      <GameInstructions
        name={config.name}
        description={config.description}
        icon={config.icon}
        color={config.color}
        onStart={game.startGame}
      />
    );
  }

  if (state.status === 'finished' && !onChainFinish) {
    return (
      <GameOverScreen
        score={state.score}
        correctAnswers={state.correctAnswers}
        totalAnswers={state.totalAnswers}
        bestStreak={state.bestStreak}
        onReplay={game.startGame}
        onQuit={() => router.push('/jeux')}
      />
    );
  }

  if (state.status === 'finished' && onChainFinish) {
    return null;
  }

  const timeRatio = state.timeRemaining / config.defaultDuration;
  const barColor =
    timeRatio < 0.25 ? 'var(--error)' : timeRatio < 0.5 ? 'var(--warning)' : 'var(--success)';
  const barGlow =
    timeRatio < 0.25
      ? '0 0 8px var(--glow-error)'
      : timeRatio < 0.5
        ? '0 0 6px rgba(251, 191, 36, 0.4)'
        : '0 0 6px var(--glow-success)';

  return (
    <div className="flex flex-col h-dvh">
      {/* Game HUD */}
      <div className="flex items-center justify-between px-4 py-2 glass border-b border-border/50">
        <button
          onClick={() => router.push('/jeux')}
          className="text-muted hover:text-foreground transition-colors touch-manipulation cursor-pointer p-1"
          aria-label="Retour"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <GameTimer
          timeRemaining={state.timeRemaining}
          totalDuration={config.defaultDuration}
        />
        <GameScore score={state.score} streak={state.currentStreak} />
      </div>

      {/* Animated time progress bar */}
      <div className="h-1 bg-border/30">
        <div
          className={`h-full transition-all duration-200 rounded-r-full ${timeRatio < 0.25 ? 'animate-pulse-soft' : ''}`}
          style={{
            width: `${timeRatio * 100}%`,
            backgroundColor: barColor,
            boxShadow: barGlow,
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
