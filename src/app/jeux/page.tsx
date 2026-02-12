'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { GAME_REGISTRY } from '@/games/registry';
import { SKILL_LABELS } from '@/lib/constants';

export default function JeuxPage() {
  return (
    <>
      <Header title="Mini-jeux" />
      <div className="px-4 py-4 space-y-4">
        {/* Chain mode CTA */}
        <Link href="/jeux/enchainement">
          <Card hoverable className="bg-gradient-to-r from-secondary to-primary text-white border-0">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔀</span>
              <div>
                <h3 className="font-bold">Mode Enchaînement</h3>
                <p className="text-sm text-white/80">Enchaîne les mini-jeux aléatoirement !</p>
              </div>
            </div>
          </Card>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          {GAME_REGISTRY.map((game) => (
            <Link key={game.id} href={`/jeux/${game.id}`}>
              <Card hoverable className="h-full">
                <div className="flex flex-col items-center text-center gap-2">
                  <span className="text-3xl">{game.icon}</span>
                  <h3 className="font-bold text-sm leading-tight">{game.name}</h3>
                  <div className="flex flex-wrap justify-center gap-1">
                    {game.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: `var(--skill-${skill})` }}
                      >
                        {SKILL_LABELS[skill]}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted line-clamp-2">{game.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
