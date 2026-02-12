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
      <div className="px-4 py-4 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary">{totalGames}</div>
            <div className="text-xs text-muted">Parties</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary">{formatScore(totalScore)}</div>
            <div className="text-xs text-muted">Score total</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary">{avgAccuracy}%</div>
            <div className="text-xs text-muted">Précision</div>
          </Card>
        </div>

        {/* History */}
        <div>
          <h3 className="font-bold text-lg mb-3">Historique</h3>
          {history.length === 0 ? (
            <p className="text-muted text-center py-8">
              Aucune partie jouée. Lance-toi !
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((result) => {
                const game = GAME_REGISTRY.find((g) => g.id === result.gameId);
                if (!game) return null;
                const date = new Date(result.playedAt);
                return (
                  <Card key={result.id} className="flex items-center gap-3 py-3">
                    <span className="text-xl">{game.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{game.name}</div>
                      <div className="text-xs text-muted">
                        {date.toLocaleDateString('fr-FR')} — {result.accuracy}%
                      </div>
                    </div>
                    <div className="text-sm font-bold text-primary tabular-nums">
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
