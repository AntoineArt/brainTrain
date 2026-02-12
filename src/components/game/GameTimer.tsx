'use client';

import { formatTime } from '@/lib/utils';

interface GameTimerProps {
  timeRemaining: number;
  totalDuration: number;
}

export function GameTimer({ timeRemaining, totalDuration }: GameTimerProps) {
  const ratio = timeRemaining / totalDuration;

  let colorClass = 'text-secondary';
  if (ratio < 0.25) colorClass = 'text-error animate-pulse-soft';
  else if (ratio < 0.5) colorClass = 'text-warning';

  return (
    <div className={`font-mono text-sm font-bold tabular-nums px-3 py-1 rounded-lg bg-surface-light/60 ${colorClass}`}>
      {formatTime(timeRemaining)}
    </div>
  );
}
