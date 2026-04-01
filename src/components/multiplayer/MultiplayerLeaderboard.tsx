'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { formatScore } from '@/lib/utils';
import { calculateAccuracy } from '@/lib/scoring';

interface PlayerResult {
  _id: string;
  clientId: string;
  name: string;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  bestStreak: number;
  isHost: boolean;
}

interface MultiplayerLeaderboardProps {
  players: PlayerResult[];
  currentClientId: string;
  onPlayAgain?: () => void;
  onLeave: () => void;
  isHost: boolean;
}

const PODIUM_COLORS = ['#f59e0b', '#94a3b8', '#cd7f32'];
const PLAYER_COLORS = [
  '#3b82f6', '#8b5cf6', '#06b6d4', '#f97316', '#10b981', '#ec4899',
];

export function MultiplayerLeaderboard({
  players,
  currentClientId,
  onPlayAgain,
  onLeave,
  isHost,
}: MultiplayerLeaderboardProps) {
  const { t } = useTranslation();

  const ranked = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8 max-w-lg mx-auto w-full">
      <h2 className="text-2xl font-display font-bold">{t('multi.leaderboard')}</h2>

      {/* Podium for top 3 */}
      {ranked.length >= 2 && (
        <div className="flex items-end justify-center gap-3 w-full mb-2">
          {[1, 0, 2].map((podiumIdx) => {
            const player = ranked[podiumIdx];
            if (!player) return <div key={podiumIdx} className="flex-1" />;
            const rank = podiumIdx + 1;
            const height = rank === 1 ? 'h-28' : rank === 2 ? 'h-20' : 'h-16';
            const allIdx = players.findIndex((p) => p.clientId === player.clientId);

            return (
              <div key={player._id} className="flex flex-col items-center flex-1">
                {/* Medal */}
                <span className="text-2xl mb-1">
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                </span>
                {/* Name */}
                <span className="text-sm font-bold truncate max-w-full text-center">
                  {player.name}
                  {player.clientId === currentClientId && (
                    <span className="text-muted font-normal text-xs"> ({t('multi.you')})</span>
                  )}
                </span>
                {/* Score */}
                <span className="text-lg font-mono font-bold" style={{ color: PODIUM_COLORS[podiumIdx] }}>
                  {formatScore(player.score)}
                </span>
                {/* Podium bar */}
                <div
                  className={`w-full ${height} rounded-t-lg mt-1`}
                  style={{ backgroundColor: PLAYER_COLORS[allIdx % PLAYER_COLORS.length] + '40' }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Full ranked list */}
      <div className="w-full flex flex-col gap-2">
        {ranked.map((player, i) => {
          const allIdx = players.findIndex((p) => p.clientId === player.clientId);
          const accuracy = calculateAccuracy(player.correctAnswers, player.totalAnswers);
          const isYou = player.clientId === currentClientId;

          return (
            <div
              key={player._id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                isYou ? 'border-primary/40 bg-primary/5' : 'border-border/20 bg-surface/30'
              }`}
            >
              {/* Rank */}
              <span className="text-sm font-bold text-muted w-6 text-center">
                #{i + 1}
              </span>

              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: PLAYER_COLORS[allIdx % PLAYER_COLORS.length] }}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm truncate">{player.name}</span>
                  {isYou && (
                    <span className="text-[10px] text-primary font-bold">({t('multi.you')})</span>
                  )}
                </div>
                <div className="flex gap-3 text-[11px] text-muted">
                  <span>{player.correctAnswers}/{player.totalAnswers} {t('game.answers').toLowerCase()}</span>
                  <span>{Math.round(accuracy)}%</span>
                  <span>{t('game.bestStreak')}: {player.bestStreak}</span>
                </div>
              </div>

              {/* Score */}
              <span className="font-mono font-bold text-lg">
                {formatScore(player.score)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full mt-2">
        <button
          onClick={onLeave}
          className="flex-1 py-3 rounded-xl font-bold bg-surface border border-border/40 text-foreground transition-all touch-manipulation cursor-pointer"
        >
          {t('multi.leave')}
        </button>
        {isHost && onPlayAgain && (
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 rounded-xl font-bold bg-primary text-white transition-all touch-manipulation cursor-pointer"
          >
            {t('multi.playAgain')}
          </button>
        )}
      </div>
    </div>
  );
}
