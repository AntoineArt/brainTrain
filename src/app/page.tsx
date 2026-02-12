'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
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
      <div className="px-4 py-3 space-y-4">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold tracking-tight">Bonjour !</h2>
          <p className="text-muted text-sm">Prêt à entraîner ton cerveau ?</p>
        </div>

        {/* Quick start cards */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in-up stagger-1">
          <Link href="/jeux" className="block">
            <Card hoverable className="bg-primary/10 border-primary/20 h-full">
              <div className="flex flex-col gap-1.5">
                <span className="text-2xl">🎮</span>
                <h3 className="font-bold text-sm tracking-tight">Choisir un jeu</h3>
                <p className="text-muted text-xs">11 mini-jeux</p>
              </div>
            </Card>
          </Link>
          <Link href="/jeux/enchainement" className="block">
            <Card hoverable className="bg-secondary/10 border-secondary/20 h-full">
              <div className="flex flex-col gap-1.5">
                <span className="text-2xl">🔀</span>
                <h3 className="font-bold text-sm tracking-tight">Enchaînement</h3>
                <p className="text-muted text-xs">Jeux aléatoires</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Skill radar */}
        <Card className="animate-fade-in-up stagger-2">
          <h3 className="font-semibold text-xs text-center text-muted uppercase tracking-widest mb-1">Tes compétences</h3>
          <SkillRadar scores={stats?.skillScores ?? defaultSkills} />
        </Card>

        {/* Featured games */}
        <div className="animate-fade-in-up stagger-3">
          <h3 className="font-bold text-sm mb-2 tracking-tight">Jeux populaires</h3>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4">
            {GAME_REGISTRY.slice(0, 5).map((game) => (
              <Link key={game.id} href={`/jeux/${game.id}`} className="shrink-0">
                <Card hoverable className="w-24 p-3">
                  <div className="flex flex-col items-center text-center gap-1">
                    <span className="text-2xl">{game.icon}</span>
                    <span className="text-[11px] font-bold leading-tight tracking-tight">{game.name}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        {recentResults.length > 0 && (
          <div className="animate-fade-in-up stagger-4">
            <h3 className="font-bold text-sm mb-2 tracking-tight">Activité récente</h3>
            <div className="space-y-1.5">
              {recentResults.map((result) => {
                const game = GAME_REGISTRY.find((g) => g.id === result.gameId);
                if (!game) return null;
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
                        {result.correctAnswers}/{result.totalAnswers} correct — {result.accuracy}%
                      </div>
                    </div>
                    <div className="font-mono text-sm font-bold accent-text tabular-nums">
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
