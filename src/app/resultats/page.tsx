'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { getItem, STORAGE_KEYS } from '@/lib/storage';
import { GAME_REGISTRY } from '@/games/registry';
import { formatScore } from '@/lib/utils';
import type { GameResult } from '@/types';

export default function ResultatsPage() {
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    const data = getItem<GameResult[]>(STORAGE_KEYS.GAME_HISTORY) ?? [];
    setHistory(data);
  }, []);

  const totalScore = history.reduce((sum, r) => sum + r.score, 0);
  const totalGames = history.length;
  const avgAccuracy =
    totalGames > 0
      ? Math.round(history.reduce((sum, r) => sum + r.accuracy, 0) / totalGames)
      : 0;

  return (
    <>
      <Header title="Statistiques" />
      <div className="px-4 py-3 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 animate-fade-in-up">
          <Card className="text-center p-3">
            <div className="font-mono text-xl font-bold accent-text">{totalGames}</div>
            <div className="text-[10px] text-muted font-semibold uppercase tracking-wider">Parties</div>
          </Card>
          <Card className="text-center p-3">
            <div className="font-mono text-xl font-bold accent-text">{formatScore(totalScore)}</div>
            <div className="text-[10px] text-muted font-semibold uppercase tracking-wider">Score total</div>
          </Card>
          <Card className="text-center p-3">
            <div className="font-mono text-xl font-bold text-secondary">{avgAccuracy}%</div>
            <div className="text-[10px] text-muted font-semibold uppercase tracking-wider">Précision</div>
          </Card>
        </div>

        {/* History */}
        <div className="animate-fade-in-up stagger-2">
          <h3 className="font-bold text-sm mb-2 tracking-tight">Historique</h3>
          {history.length === 0 ? (
            <p className="text-muted text-center text-sm py-6">
              Aucune partie jouée. Lance-toi !
            </p>
          ) : (
            <div className="space-y-1.5">
              {history.map((result) => {
                const game = GAME_REGISTRY.find((g) => g.id === result.gameId);
                if (!game) return null;
                const date = new Date(result.playedAt);
                return (
                  <Card key={result.id} className="flex items-center gap-3 py-2.5 px-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                      style={{ background: `${game.color}15` }}
                    >
                      {game.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{game.name}</div>
                      <div className="text-xs text-muted">
                        {date.toLocaleDateString('fr-FR')} — {result.accuracy}%
                      </div>
                    </div>
                    <div className="font-mono text-sm font-bold accent-text tabular-nums">
                      {formatScore(result.score)}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
