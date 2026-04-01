'use client';

import { formatScore } from '@/lib/utils';

interface OpponentPlayer {
  _id: string;
  clientId: string;
  name: string;
  score: number;
  totalAnswers: number;
  currentStreak: number;
  lastActivityAt: number;
  finished: boolean;
  connected: boolean;
}

interface OpponentStripProps {
  players: OpponentPlayer[];
  currentClientId: string;
}

const PLAYER_COLORS = [
  '#3b82f6', '#8b5cf6', '#06b6d4', '#f97316', '#10b981', '#ec4899',
];

export function OpponentStrip({ players, currentClientId }: OpponentStripProps) {
  const opponents = players.filter((p) => p.clientId !== currentClientId);
  const now = Date.now();

  if (opponents.length === 0) return null;

  return (
    <div className="flex gap-2 px-3 py-1.5 overflow-x-auto scrollbar-none bg-surface/30 border-b border-border/20">
      {opponents.map((player, i) => {
        const recentActivity = now - player.lastActivityAt < 2000;
        const allPlayersIndex = players.findIndex((p) => p.clientId === player.clientId);
        const color = PLAYER_COLORS[allPlayersIndex % PLAYER_COLORS.length];

        return (
          <div
            key={player._id}
            className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-surface/50"
          >
            {/* Activity dot */}
            <span
              className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-300 ${
                !player.connected
                  ? 'bg-red-400'
                  : player.finished
                    ? 'bg-blue-400'
                    : recentActivity
                      ? 'bg-green-400 animate-pulse'
                      : 'bg-gray-400'
              }`}
            />

            {/* Name */}
            <span
              className="text-xs font-semibold truncate max-w-[60px]"
              style={{ color }}
            >
              {player.name}
            </span>

            {/* Score */}
            <span className="text-xs font-mono text-muted">
              {formatScore(player.score)}
            </span>

            {/* Streak badge */}
            {player.currentStreak >= 3 && (
              <span className="text-[9px] font-bold text-orange-400">
                x{player.currentStreak}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
