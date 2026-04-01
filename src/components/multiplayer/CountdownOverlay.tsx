'use client';

import { useState, useEffect } from 'react';

interface CountdownOverlayProps {
  gameStartsAt: number;
  onComplete: () => void;
}

export function CountdownOverlay({ gameStartsAt, onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const remaining = Math.ceil((gameStartsAt - Date.now()) / 1000);
      if (remaining <= 0) {
        onComplete();
        return;
      }
      setCount(remaining);
    };

    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [gameStartsAt, onComplete]);

  if (count === null || count <= 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <span
          key={count}
          className="text-8xl font-display font-black text-primary animate-bounce-in"
        >
          {count}
        </span>
        <span className="text-lg text-muted font-semibold">
          {count === 1 ? 'GO!' : '...'}
        </span>
      </div>
    </div>
  );
}
