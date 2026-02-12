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
          <Card hoverable className="bg-secondary/10 border-secondary/20 p-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔀</span>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Mode Enchaînement</h3>
                <p className="text-xs text-muted">Enchaîne les mini-jeux aléatoirement !</p>
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
                    className="text-2xl w-11 h-11 flex items-center justify-center rounded-xl border border-border/50"
                    style={{ background: `${game.color}12` }}
                  >
                    {game.icon}
                  </div>
                  <h3 className="font-bold text-xs leading-tight tracking-tight">{game.name}</h3>
                  <div className="flex flex-wrap justify-center gap-0.5">
                    {game.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `color-mix(in srgb, var(--skill-${skill}) 15%, transparent)`,
                          color: `var(--skill-${skill})`,
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
