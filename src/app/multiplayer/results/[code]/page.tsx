'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { getItem } from '@/lib/storage';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiplayerLeaderboard } from '@/components/multiplayer/MultiplayerLeaderboard';

const STORAGE_MP_ID = 'bt_mp_id';

export default function MultiplayerResultsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const clientId = getItem<string>(STORAGE_MP_ID) ?? '';
  const playAgain = useMutation(api.lobbies.playAgain);

  const lobby = useQuery(api.lobbies.getLobby, { code: code.toUpperCase() });

  // Redirect back to lobby if host restarted
  if (lobby && lobby.status === 'waiting') {
    router.push(`/multiplayer/lobby/${lobby.code}`);
    return null;
  }

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

  if (!lobby) {
    router.push('/multiplayer');
    return null;
  }

  const isHost = lobby.hostClientId === clientId;

  const handlePlayAgain = async () => {
    await playAgain({ lobbyId: lobby._id, clientId });
  };

  const handleLeave = () => {
    router.push('/multiplayer');
  };

  return (
    <MultiplayerLeaderboard
      players={lobby.players}
      currentClientId={clientId}
      isHost={isHost}
      onPlayAgain={isHost ? handlePlayAgain : undefined}
      onLeave={handleLeave}
    />
  );
}
