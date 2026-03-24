'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import type { PlayerStats, CognitiveSkill } from '@/types';

const defaultStats: PlayerStats = {
  totalGamesPlayed: 0,
  totalScore: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: '',
  skillScores: {
    math: 0,
    memory: 0,
    logic: 0,
    speed: 0,
    language: 0,
    attention: 0,
    culture: 0,
  },
  gameProgress: {},
};

interface PlayerContextValue {
  stats: PlayerStats;
  updateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
}

const PlayerContext = createContext<PlayerContextValue>({
  stats: defaultStats,
  updateStats: () => {},
});

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useLocalStorage<PlayerStats>(
    STORAGE_KEYS.PLAYER_STATS,
    defaultStats,
  );

  return (
    <PlayerContext.Provider value={{ stats, updateStats: setStats }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
