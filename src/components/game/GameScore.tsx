'use client';

import { formatScore } from '@/lib/utils';

interface GameScoreProps {
  score: number;
  streak?: number;
}

export function GameScore({ score, streak }: GameScoreProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg font-bold tabular-nums">{formatScore(score)}</span>
      {streak !== undefined && streak > 1 && (
        <span className="text-sm text-warning font-medium">
          x{streak}
        </span>
      )}
    </div>
  );
}
