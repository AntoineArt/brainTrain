'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { GAME_MAP } from '@/games/registry';
import { GameShell } from '@/components/game/GameShell';
import type { GameComponentProps } from '@/types';

const GAME_COMPONENTS: Record<string, React.ComponentType<GameComponentProps>> = {
  'calcul-express': dynamic(() => import('@/games/calcul-express/CalculExpress')),
  'suite-memoire': dynamic(() => import('@/games/suite-memoire/SuiteMemoire')),
  'trouve-intrus': dynamic(() => import('@/games/trouve-intrus/TrouveIntrus')),
  'reflexe': dynamic(() => import('@/games/reflexe/Reflexe')),
  'logique-plus': dynamic(() => import('@/games/logique-plus/LogiquePlus')),
  'mot-juste': dynamic(() => import('@/games/mot-juste/MotJuste')),
  'rotation': dynamic(() => import('@/games/rotation/Rotation')),
  'cherche-compte': dynamic(() => import('@/games/cherche-compte/ChercheCompte')),
  'paires': dynamic(() => import('@/games/paires/Paires')),
  'tri-express': dynamic(() => import('@/games/tri-express/TriExpress')),
  'culture-g': dynamic(() => import('@/games/culture-g/CultureG')),
};

export default function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = use(params);
  const config = GAME_MAP.get(gameId);

  if (!config) {
    notFound();
  }

  const GameComponent = GAME_COMPONENTS[gameId];

  if (!GameComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
        <span className="text-5xl">{config.icon}</span>
        <h2 className="text-xl font-bold">{config.name}</h2>
        <p className="text-muted">Ce jeu arrive bientôt !</p>
      </div>
    );
  }

  return (
    <GameShell config={config}>
      {(props) => <GameComponent {...props} />}
    </GameShell>
  );
}
