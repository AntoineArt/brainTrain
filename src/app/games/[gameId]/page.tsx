'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { GAME_MAP, GAME_I18N } from '@/games/registry';
import { useTranslation } from '@/hooks/useTranslation';
import { GameShell } from '@/components/game/GameShell';
import type { GameComponentProps } from '@/types';

const GAME_COMPONENTS: Record<string, React.ComponentType<GameComponentProps>> = {
  'speed-math': dynamic(() => import('@/games/speed-math/SpeedMath')),
  'memory-sequence': dynamic(() => import('@/games/memory-sequence/MemorySequence')),
  'find-intruder': dynamic(() => import('@/games/find-intruder/FindIntruder')),
  'reflex': dynamic(() => import('@/games/reflex/Reflex')),
  'logic-plus': dynamic(() => import('@/games/logic-plus/LogicPlus')),
  'right-word': dynamic(() => import('@/games/right-word/RightWord')),
  'rotation': dynamic(() => import('@/games/rotation/Rotation')),
  'search-count': dynamic(() => import('@/games/search-count/SearchCount')),
  'pairs': dynamic(() => import('@/games/pairs/Pairs')),
  'quick-sort': dynamic(() => import('@/games/quick-sort/QuickSort')),
  'trivia': dynamic(() => import('@/games/trivia/Trivia')),
  'word-definition': dynamic(() => import('@/games/word-definition/WordDefinition')),
};

export default function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = use(params);
  const { t } = useTranslation();
  const config = GAME_MAP.get(gameId);

  if (!config) {
    notFound();
  }

  const GameComponent = GAME_COMPONENTS[gameId];

  if (!GameComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
        <span className="text-5xl">{config.icon}</span>
        <h2 className="text-xl font-bold">{GAME_I18N[gameId]?.name ? t(GAME_I18N[gameId].name) : config.name}</h2>
        <p className="text-muted">{t('game.comingSoon')}</p>
      </div>
    );
  }

  return (
    <GameShell config={config}>
      {(props) => <GameComponent {...props} />}
    </GameShell>
  );
}
