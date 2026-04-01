'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { getItem } from '@/lib/storage';
import { useTranslation } from '@/hooks/useTranslation';
import { LobbyScreen } from '@/components/multiplayer/LobbyScreen';

const STORAGE_MP_ID = 'bt_mp_id';

export default function LobbyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const clientId = getItem<string>(STORAGE_MP_ID) ?? '';

  const lobby = useQuery(api.lobbies.getLobby, { code: code.toUpperCase() });

  // Redirect to play page when countdown starts
  useEffect(() => {
    if (lobby && (lobby.status === 'countdown' || lobby.status === 'playing')) {
      router.push(`/multiplayer/play/${lobby.code}`);
    }
  }, [lobby?.status, lobby?.code, router]);

  // Redirect to results if already finished
  useEffect(() => {
    if (lobby && lobby.status === 'finished') {
      router.push(`/multiplayer/results/${lobby.code}`);
    }
  }, [lobby?.status, lobby?.code, router]);

  if (!clientId) {
    router.push('/multiplayer');
    return null;
  }

  if (lobby === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted animate-pulse">{t('multi.loading')}</div>
      </div>
    );
  }

  if (lobby === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <span className="text-4xl">😕</span>
        <p className="text-lg font-semibold">{t('multi.lobbyNotFound')}</p>
        <button
          onClick={() => router.push('/multiplayer')}
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold touch-manipulation cursor-pointer"
        >
          {t('multi.backToHub')}
        </button>
      </div>
    );
  }

  // Check if current player is in lobby
  const isInLobby = lobby.players.some((p: { clientId: string }) => p.clientId === clientId);
  if (!isInLobby) {
    router.push('/multiplayer');
    return null;
  }

  return (
    <LobbyScreen
      lobbyId={lobby._id}
      code={lobby.code}
      status={lobby.status}
      hostClientId={lobby.hostClientId}
      clientId={clientId}
      players={lobby.players}
      gameId={lobby.gameId ?? null}
      difficulty={lobby.difficulty}
      duration={lobby.duration}
    />
  );
}
