'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkillRadar } from '@/components/dashboard/SkillRadar';
import { GAME_REGISTRY } from '@/games/registry';
import { getItem, STORAGE_KEYS } from '@/lib/storage';
import type { GameResult, PlayerStats } from '@/types';
import { formatScore } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [recentResults, setRecentResults] = useState<GameResult[]>([]);
  const [stats, setStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    const history = getItem<GameResult[]>(STORAGE_KEYS.GAME_HISTORY) ?? [];
    setRecentResults(history.slice(0, 5));

    const playerStats = getItem<PlayerStats>(STORAGE_KEYS.PLAYER_STATS);
    setStats(playerStats);
  }, []);

  const defaultSkills = {
    calcul: 0, memoire: 0, logique: 0,
    vitesse: 0, langage: 0, attention: 0,
    culture: 0,
  };

  return (
    <>
      <Header />
      <div className="px-4 py-4 space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold">Bonjour !</h2>
          <p className="text-muted mt-1">Prêt à entraîner ton cerveau ?</p>
        </div>

        {/* Quick start cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/jeux" className="block">
            <Card hoverable className="bg-gradient-to-br from-primary to-primary-dark text-white border-0 h-full">
              <div className="flex flex-col gap-2">
                <span className="text-2xl">🎮</span>
                <h3 className="font-bold text-sm">Choisir un jeu</h3>
                <p className="text-white/70 text-xs">11 mini-jeux</p>
              </div>
            </Card>
          </Link>
          <Link href="/jeux/enchainement" className="block">
            <Card hoverable className="bg-gradient-to-br from-secondary to-primary text-white border-0 h-full">
              <div className="flex flex-col gap-2">
                <span className="text-2xl">🔀</span>
                <h3 className="font-bold text-sm">Enchaînement</h3>
                <p className="text-white/70 text-xs">Jeux aléatoires</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Skill radar */}
        <Card>
          <h3 className="font-bold text-sm mb-2 text-center">Tes compétences</h3>
          <SkillRadar scores={stats?.skillScores ?? defaultSkills} />
        </Card>

        {/* Featured games */}
        <div>
          <h3 className="font-bold text-lg mb-3">Jeux populaires</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {GAME_REGISTRY.slice(0, 5).map((game) => (
              <Link key={game.id} href={`/jeux/${game.id}`} className="shrink-0">
                <Card hoverable className="w-28">
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <span className="text-2xl">{game.icon}</span>
                    <span className="text-xs font-bold leading-tight">{game.name}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        {recentResults.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-3">Activité récente</h3>
            <div className="space-y-2">
              {recentResults.map((result) => {
                const game = GAME_REGISTRY.find((g) => g.id === result.gameId);
                if (!game) return null;
                return (
                  <Card key={result.id} className="flex items-center gap-3 py-3">
                    <span className="text-xl">{game.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{game.name}</div>
                      <div className="text-xs text-muted">
                        {result.correctAnswers}/{result.totalAnswers} correct — {result.accuracy}%
                      </div>
                    </div>
                    <div className="text-sm font-bold text-primary tabular-nums">
                      {formatScore(result.score)}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
