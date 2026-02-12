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
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6">
      <h2 className="text-2xl font-bold">Terminé !</h2>

      <div className="text-5xl font-bold text-primary tabular-nums">
        {formatScore(score)}
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{correctAnswers}/{totalAnswers}</span>
          <span className="text-sm text-muted">Réponses</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{accuracy}%</span>
          <span className="text-sm text-muted">Précision</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{bestStreak}</span>
          <span className="text-sm text-muted">Série max</span>
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-sm">
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
