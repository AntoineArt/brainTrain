'use client';

import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useTranslation } from '@/hooks/useTranslation';
import { GAME_MAP, GAME_I18N } from '@/games/registry';
import { PlayerList } from './PlayerList';
import { GameSelector } from './GameSelector';

interface LobbyPlayer {
  _id: string;
  clientId: string;
  name: string;
  isHost: boolean;
  connected: boolean;
}

interface LobbyScreenProps {
  lobbyId: Id<'lobbies'>;
  code: string;
  status: string;
  hostClientId: string;
  clientId: string;
  players: LobbyPlayer[];
  gameId: string | null;
  difficulty: number;
  duration: number;
}

export function LobbyScreen({
  lobbyId,
  code,
  status,
  hostClientId,
  clientId,
  players,
  gameId,
  difficulty,
  duration,
}: LobbyScreenProps) {
  const { t } = useTranslation();
  const configureLobby = useMutation(api.lobbies.configureLobby);
  const startGame = useMutation(api.lobbies.startGame);
  const kickPlayer = useMutation(api.lobbies.kickPlayer);
  const leaveLobby = useMutation(api.lobbies.leaveLobby);

  const isHost = clientId === hostClientId;
  const canStart = isHost && gameId && players.length >= 2;
  const selectedGame = gameId ? GAME_MAP.get(gameId) : null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleSelectGame = (newGameId: string) => {
    const game = GAME_MAP.get(newGameId);
    configureLobby({
      lobbyId,
      clientId,
      gameId: newGameId,
      difficulty,
      duration: game?.defaultDuration ?? 45,
    });
  };

  const handleSelectDifficulty = (newDifficulty: number) => {
    configureLobby({
      lobbyId,
      clientId,
      gameId: gameId ?? '',
      difficulty: newDifficulty,
      duration,
    });
  };

  const handleStart = () => {
    startGame({ lobbyId, clientId });
  };

  const handleKick = (targetClientId: string) => {
    kickPlayer({ lobbyId, hostClientId: clientId, targetClientId });
  };

  const handleLeave = () => {
    leaveLobby({ lobbyId, clientId });
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      {/* Header with code */}
      <div className="text-center">
        <h1 className="text-xl font-display font-bold mb-3">{t('multi.lobby')}</h1>
        <button
          onClick={handleCopyCode}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface border border-border/40 touch-manipulation cursor-pointer group"
          title={t('multi.copyCode')}
        >
          <span className="text-2xl font-mono font-black tracking-[0.25em] text-primary">
            {code}
          </span>
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="text-muted group-hover:text-foreground transition-colors"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </button>
        <p className="text-xs text-muted mt-2">{t('multi.shareCode')}</p>
      </div>

      {/* Player list */}
      <PlayerList
        players={players}
        currentClientId={clientId}
        hostClientId={hostClientId}
        onKick={isHost ? handleKick : undefined}
      />

      {/* Game selection (host) or display (non-host) */}
      {isHost ? (
        <GameSelector
          selectedGameId={gameId ?? null}
          selectedDifficulty={difficulty}
          onSelectGame={handleSelectGame}
          onSelectDifficulty={handleSelectDifficulty}
        />
      ) : (
        selectedGame && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface/50 border border-border/20">
            <span className="text-2xl">{selectedGame.icon}</span>
            <div>
              <p className="font-semibold text-sm">
                {GAME_I18N[selectedGame.id] ? t(GAME_I18N[selectedGame.id].name) : selectedGame.name}
              </p>
              <p className="text-xs text-muted">
                {t('difficulty.label')}: {t(`difficulty.${difficulty}` as `difficulty.${number}`)}
              </p>
            </div>
          </div>
        )
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-2 mt-2">
        {isHost ? (
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="w-full py-3.5 rounded-xl font-bold text-lg bg-primary text-white disabled:opacity-40 transition-all touch-manipulation cursor-pointer"
          >
            {!gameId
              ? t('multi.selectGameFirst')
              : players.length < 2
                ? t('multi.waitingPlayers')
                : t('multi.startGame')}
          </button>
        ) : (
          <div className="text-center py-3 text-muted text-sm font-medium">
            {status === 'countdown' ? t('multi.gameStarting') : t('multi.waitingHost')}
          </div>
        )}

        <button
          onClick={handleLeave}
          className="w-full py-2.5 rounded-xl font-semibold text-sm text-muted hover:text-red-400 transition-colors touch-manipulation cursor-pointer"
        >
          {t('multi.leaveLobby')}
        </button>
      </div>
    </div>
  );
}
