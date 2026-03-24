'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import type { DifficultyLevel } from '@/types';

interface GameInstructionsProps {
  name: string;
  description: string;
  icon: string;
  color?: string;
  maxLevel: DifficultyLevel;
  initialDifficulty: DifficultyLevel;
  onStart: (difficulty: DifficultyLevel) => void;
}

export function GameInstructions({ name, description, icon, color, maxLevel, initialDifficulty, onStart }: GameInstructionsProps) {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const levels = ([1, 2, 3, 4, 5] as DifficultyLevel[]).filter((l) => l <= maxLevel);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-60px)] px-6 text-center gap-5">
      <div
        className="text-5xl animate-float w-20 h-20 flex items-center justify-center rounded-2xl border border-border/50"
        style={{ background: color ? `${color}15` : undefined }}
      >
        {icon}
      </div>
      <div className="animate-fade-in-up stagger-1">
        <h2 className="text-2xl font-bold tracking-tight mb-1">{name}</h2>
        <p className="text-muted text-sm">{description}</p>
      </div>

      {/* Difficulty selector */}
      <div className="w-full max-w-xs animate-fade-in-up stagger-2">
        <p className="text-xs text-muted font-semibold uppercase tracking-widest mb-2">{t('difficulty.label')}</p>
        <div className="flex gap-1.5">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`
                flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150
                touch-manipulation cursor-pointer border-2
                ${difficulty === level
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                  : 'bg-surface border-border text-muted hover:border-primary/30'
                }
              `}
            >
              {t(`difficulty.${level}` as any)}
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" onClick={() => onStart(difficulty)} className="w-full max-w-xs animate-fade-in-up stagger-3">
        {t('game.play')}
      </Button>
    </div>
  );
}
