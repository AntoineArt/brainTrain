'use client';

import { formatScore } from '@/lib/utils';

interface GameScoreProps {
  score: number;
  streak?: number;
}

export function GameScore({ score, streak }: GameScoreProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base font-bold tabular-nums">{formatScore(score)}</span>
      {streak !== undefined && streak > 1 && (
        <span className="text-xs font-bold text-warning bg-warning/15 px-1.5 py-0.5 rounded-md animate-pop">
          x{streak}
        </span>
      )}
    </div>
  );
}
