'use client';

import { useTranslation } from '@/hooks/useTranslation';

interface Player {
  _id: string;
  clientId: string;
  name: string;
  isHost: boolean;
  connected: boolean;
}

interface PlayerListProps {
  players: Player[];
  currentClientId: string;
  hostClientId: string;
  onKick?: (clientId: string) => void;
}

const PLAYER_COLORS = [
  '#3b82f6', '#8b5cf6', '#06b6d4', '#f97316', '#10b981', '#ec4899',
];

export function PlayerList({ players, currentClientId, hostClientId, onKick }: PlayerListProps) {
  const { t } = useTranslation();
  const isHost = currentClientId === hostClientId;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-muted">
        {t('multi.players')} ({players.length}/6)
      </h3>
      <div className="flex flex-col gap-1.5">
        {players.map((player, i) => (
          <div
            key={player._id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface/50 border border-border/20"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: PLAYER_COLORS[i % PLAYER_COLORS.length] }}
            >
              {player.name.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <span className="flex-1 font-semibold text-sm truncate">
              {player.name}
              {player.clientId === currentClientId && (
                <span className="text-muted font-normal"> ({t('multi.you')})</span>
              )}
            </span>

            {/* Badges */}
            {player.isHost && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                {t('multi.host')}
              </span>
            )}

            {!player.connected && (
              <span className="w-2 h-2 rounded-full bg-red-400" title="Disconnected" />
            )}

            {/* Kick button */}
            {isHost && player.clientId !== currentClientId && onKick && (
              <button
                onClick={() => onKick(player.clientId)}
                className="text-muted hover:text-red-400 transition-colors text-xs cursor-pointer touch-manipulation p-1"
                title={t('multi.kick')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
