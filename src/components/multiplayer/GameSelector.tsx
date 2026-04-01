'use client';

import { GAME_REGISTRY, GAME_I18N } from '@/games/registry';
import { useTranslation } from '@/hooks/useTranslation';
import type { DifficultyLevel } from '@/types';
import type { TranslationKey } from '@/locales';

interface GameSelectorProps {
  selectedGameId: string | null;
  selectedDifficulty: number;
  onSelectGame: (gameId: string) => void;
  onSelectDifficulty: (difficulty: number) => void;
  disabled?: boolean;
}

export function GameSelector({
  selectedGameId,
  selectedDifficulty,
  onSelectGame,
  onSelectDifficulty,
  disabled,
}: GameSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      {/* Game grid */}
      <div>
        <h3 className="text-sm font-semibold text-muted mb-2">
          {t('multi.chooseGame')}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {GAME_REGISTRY.map((game) => {
            const isSelected = selectedGameId === game.id;
            return (
              <button
                key={game.id}
                onClick={() => !disabled && onSelectGame(game.id)}
                disabled={disabled}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-xl border transition-all
                  touch-manipulation cursor-pointer disabled:cursor-default
                  ${isSelected
                    ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                    : 'border-border/20 bg-surface/30 hover:bg-surface/60'}
                `}
              >
                <span className="text-xl">{game.icon}</span>
                <span className="text-[9px] font-medium text-muted leading-tight text-center truncate w-full">
                  {GAME_I18N[game.id] ? t(GAME_I18N[game.id].name) : game.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="text-sm font-semibold text-muted mb-2">
          {t('difficulty.label')}
        </h3>
        <div className="flex gap-2">
          {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => !disabled && onSelectDifficulty(level)}
              disabled={disabled}
              className={`
                flex-1 py-2 rounded-lg text-sm font-semibold transition-all
                touch-manipulation cursor-pointer disabled:cursor-default
                ${selectedDifficulty === level
                  ? 'bg-primary text-white'
                  : 'bg-surface/50 text-muted hover:text-foreground border border-border/20'}
              `}
            >
              {t(`difficulty.${level}` as TranslationKey)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
