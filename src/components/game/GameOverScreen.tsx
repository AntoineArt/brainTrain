'use client';

import { Button } from '@/components/ui/Button';
import { formatScore } from '@/lib/utils';
import { calculateAccuracy } from '@/lib/scoring';

interface GameOverScreenProps {
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  bestStreak: number;
  onReplay: () => void;
  onQuit: () => void;
}

export function GameOverScreen({
  score,
  correctAnswers,
  totalAnswers,
  bestStreak,
  onReplay,
  onQuit,
}: GameOverScreenProps) {
  const accuracy = calculateAccuracy(correctAnswers, totalAnswers);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-60px)] px-6 text-center gap-4">
      <h2 className="text-xl font-bold text-muted animate-fade-in">Terminé !</h2>

      <div className="animate-bounce-in">
        <div className="text-5xl font-extrabold gradient-text tabular-nums">
          {formatScore(score)}
        </div>
        <p className="text-sm text-muted mt-1">points</p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm animate-fade-in-up stagger-2">
        <div className="bg-surface-light rounded-xl p-3 flex flex-col items-center">
          <span className="text-xl font-bold">{correctAnswers}/{totalAnswers}</span>
          <span className="text-[11px] text-muted">Réponses</span>
        </div>
        <div className="bg-surface-light rounded-xl p-3 flex flex-col items-center">
          <span className="text-xl font-bold text-success">{accuracy}%</span>
          <span className="text-[11px] text-muted">Précision</span>
        </div>
        <div className="bg-surface-light rounded-xl p-3 flex flex-col items-center">
          <span className="text-xl font-bold text-warning">{bestStreak}</span>
          <span className="text-[11px] text-muted">Série max</span>
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-sm animate-fade-in-up stagger-3">
        <Button variant="secondary" onClick={onQuit} className="flex-1">
          Quitter
        </Button>
        <Button onClick={onReplay} className="flex-1">
          Rejouer
        </Button>
      </div>
    </div>
  );
}
