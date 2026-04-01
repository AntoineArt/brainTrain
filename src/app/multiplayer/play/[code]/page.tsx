'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import dynamic from 'next/dynamic';
import { api } from '../../../../../convex/_generated/api';
import { getItem } from '@/lib/storage';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiplayerGameShell } from '@/components/multiplayer/MultiplayerGameShell';
import type { GameComponentProps, DifficultyLevel } from '@/types';

const STORAGE_MP_ID = 'bt_mp_id';

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
  'number-chain': dynamic(() => import('@/games/number-chain/NumberChain')),
  'estimation': dynamic(() => import('@/games/estimation/Estimation')),
};

export default function MultiplayerPlayPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const clientId = getItem<string>(STORAGE_MP_ID) ?? '';

  const lobby = useQuery(api.lobbies.getLobby, { code: code.toUpperCase() });

  if (!clientId) {
    router.push('/multiplayer');
    return null;
  }

  if (lobby === undefined) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="text-muted animate-pulse">{t('multi.loading')}</div>
      </div>
    );
  }

  if (!lobby || !lobby.gameId || !lobby.gameStartsAt) {
    router.push('/multiplayer');
    return null;
  }

  const GameComponent = GAME_COMPONENTS[lobby.gameId];
  if (!GameComponent) {
    router.push('/multiplayer');
    return null;
  }

  return (
    <MultiplayerGameShell
      lobbyId={lobby._id}
      lobbyCode={lobby.code}
      clientId={clientId}
      gameId={lobby.gameId}
      difficulty={lobby.difficulty as DifficultyLevel}
      duration={lobby.duration}
      gameStartsAt={lobby.gameStartsAt}
    >
      {(props) => <GameComponent {...props} />}
    </MultiplayerGameShell>
  );
}
