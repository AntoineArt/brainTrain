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
      <div className="px-4 py-3 space-y-3">
        {/* Chain mode CTA */}
        <Link href="/jeux/enchainement" className="block animate-fade-in">
          <Card hoverable className="bg-gradient-to-r from-secondary to-primary text-white border-0 shadow-lg shadow-primary/20 p-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔀</span>
              <div>
                <h3 className="font-bold text-sm">Mode Enchaînement</h3>
                <p className="text-xs text-white/70">Enchaîne les mini-jeux aléatoirement !</p>
              </div>
            </div>
          </Card>
        </Link>

        <div className="grid grid-cols-2 gap-2.5">
          {GAME_REGISTRY.map((game, i) => (
            <Link key={game.id} href={`/jeux/${game.id}`} className="animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
              <Card hoverable className="h-full p-3">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <div
                    className="text-2xl w-11 h-11 flex items-center justify-center rounded-xl"
                    style={{ background: `${game.color}20` }}
                  >
                    {game.icon}
                  </div>
                  <h3 className="font-bold text-xs leading-tight">{game.name}</h3>
                  <div className="flex flex-wrap justify-center gap-0.5">
                    {game.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `var(--skill-${skill})`,
                          color: 'white',
                          opacity: 0.9,
                        }}
                      >
                        {SKILL_LABELS[skill]}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
