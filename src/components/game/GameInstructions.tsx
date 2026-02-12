'use client';

import { Button } from '@/components/ui/Button';

interface GameInstructionsProps {
  name: string;
  description: string;
  icon: string;
  color?: string;
  onStart: () => void;
}

export function GameInstructions({ name, description, icon, color, onStart }: GameInstructionsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-60px)] px-6 text-center gap-5">
      <div
        className="text-5xl animate-float w-20 h-20 flex items-center justify-center rounded-2xl"
        style={{ background: color ? `${color}20` : undefined }}
      >
        {icon}
      </div>
      <div className="animate-fade-in-up stagger-1">
        <h2 className="text-2xl font-bold mb-1">{name}</h2>
        <p className="text-muted">{description}</p>
      </div>
      <Button size="lg" onClick={onStart} className="w-full max-w-xs animate-fade-in-up stagger-2">
        Jouer
      </Button>
    </div>
  );
}
