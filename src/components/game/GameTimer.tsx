'use client';

import { formatTime } from '@/lib/utils';

interface GameTimerProps {
  timeRemaining: number;
  totalDuration: number;
}

export function GameTimer({ timeRemaining, totalDuration }: GameTimerProps) {
  const ratio = timeRemaining / totalDuration;

  let colorClass = 'text-success';
  if (ratio < 0.25) colorClass = 'text-error';
  else if (ratio < 0.5) colorClass = 'text-warning';

  return (
    <div className={`font-mono text-lg font-bold tabular-nums ${colorClass}`}>
      {formatTime(timeRemaining)}
    </div>
  );
}
