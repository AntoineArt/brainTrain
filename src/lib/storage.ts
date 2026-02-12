const STORAGE_KEYS = {
  PLAYER_PROFILE: 'bt_player_profile',
  PLAYER_STATS: 'bt_player_stats',
  GAME_HISTORY: 'bt_game_history',
  SETTINGS: 'bt_settings',
  SCHEMA_VERSION: 'bt_schema_version',
} as const;

export { STORAGE_KEYS };

export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded — ignore silently
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}
