'use client';

import { Button } from '@/components/ui/Button';

interface GameInstructionsProps {
  name: string;
  description: string;
  icon: string;
  onStart: () => void;
}

export function GameInstructions({ name, description, icon, onStart }: GameInstructionsProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6">
      <span className="text-6xl">{icon}</span>
      <div>
        <h2 className="text-2xl font-bold mb-2">{name}</h2>
        <p className="text-muted text-lg">{description}</p>
      </div>
      <Button size="lg" onClick={onStart} className="w-full max-w-xs">
        Jouer
      </Button>
    </div>
  );
}
