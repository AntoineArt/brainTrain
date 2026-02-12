'use client';

import { useSettings } from '@/components/providers/SettingsProvider';
import type { ThemeMode } from '@/types';

const MODES: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: '☀️' },
  { value: 'dark', label: '🌙' },
  { value: 'system', label: '💻' },
];

export function ThemeToggle() {
  const { settings, setTheme } = useSettings();
  const current = settings.theme ?? 'dark';

  return (
    <div className="flex items-center bg-surface-light rounded-lg p-0.5 gap-0.5">
      {MODES.map((mode) => (
        <button
          key={mode.value}
          onClick={() => setTheme(mode.value)}
          className={`
            text-xs px-2 py-1 rounded-md transition-all duration-200
            touch-manipulation cursor-pointer
            ${current === mode.value
              ? 'bg-primary/15 text-primary shadow-sm'
              : 'text-muted hover:text-foreground'
            }
          `}
          aria-label={mode.value}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
