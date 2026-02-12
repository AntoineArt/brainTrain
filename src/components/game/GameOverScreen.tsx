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
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-60px)] px-6 text-center gap-5">
      <h2 className="text-lg font-bold text-muted animate-fade-in tracking-tight">Terminé !</h2>

      <div className="animate-bounce-in">
        <div className="font-mono text-5xl font-extrabold accent-text tabular-nums tracking-tighter">
          {formatScore(score)}
        </div>
        <p className="text-xs text-muted mt-1 uppercase tracking-widest">points</p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm animate-fade-in-up stagger-2">
        <div className="bg-surface-light rounded-xl p-3 flex flex-col items-center border border-border/50">
          <span className="font-mono text-lg font-bold">{correctAnswers}/{totalAnswers}</span>
          <span className="text-[10px] text-muted uppercase tracking-wider">Réponses</span>
        </div>
        <div className="bg-surface-light rounded-xl p-3 flex flex-col items-center border border-border/50">
          <span className="font-mono text-lg font-bold text-secondary">{accuracy}%</span>
          <span className="text-[10px] text-muted uppercase tracking-wider">Précision</span>
        </div>
        <div className="bg-surface-light rounded-xl p-3 flex flex-col items-center border border-border/50">
          <span className="font-mono text-lg font-bold text-warning">{bestStreak}</span>
          <span className="text-[10px] text-muted uppercase tracking-wider">Série max</span>
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
