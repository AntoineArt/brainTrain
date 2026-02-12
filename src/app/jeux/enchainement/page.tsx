'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useChainMode } from '@/hooks/useChainMode';
import { GameShell } from '@/components/game/GameShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatScore } from '@/lib/utils';
import type { GameComponentProps } from '@/types';

const GAME_COMPONENTS: Record<string, React.ComponentType<GameComponentProps>> = {
  'calcul-express': dynamic(() => import('@/games/calcul-express/CalculExpress')),
  'suite-memoire': dynamic(() => import('@/games/suite-memoire/SuiteMemoire')),
  'trouve-intrus': dynamic(() => import('@/games/trouve-intrus/TrouveIntrus')),
  'reflexe': dynamic(() => import('@/games/reflexe/Reflexe')),
  'logique-plus': dynamic(() => import('@/games/logique-plus/LogiquePlus')),
  'mot-juste': dynamic(() => import('@/games/mot-juste/MotJuste')),
  'rotation': dynamic(() => import('@/games/rotation/Rotation')),
  'cherche-compte': dynamic(() => import('@/games/cherche-compte/ChercheCompte')),
  'paires': dynamic(() => import('@/games/paires/Paires')),
  'tri-express': dynamic(() => import('@/games/tri-express/TriExpress')),
  'culture-g': dynamic(() => import('@/games/culture-g/CultureG')),
};

export default function EnchainementPage() {
  const router = useRouter();
  const chain = useChainMode();

  // Not started yet
  if (!chain.state.isActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-6">
        <span className="text-6xl">🔀</span>
        <div>
          <h2 className="text-2xl font-bold mb-2">Mode Enchaînement</h2>
          <p className="text-muted">
            Les mini-jeux s&apos;enchaînent aléatoirement. Arrête quand tu veux !
          </p>
        </div>
        <Button size="lg" onClick={chain.startChain} className="w-full max-w-xs">
          C&apos;est parti !
        </Button>
        <Button variant="ghost" onClick={() => router.push('/jeux')}>
          Retour aux jeux
        </Button>
      </div>
    );
  }

  // Finished
  if (chain.state.finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-6">
        <h2 className="text-2xl font-bold">Session terminée !</h2>
        <div className="text-4xl font-bold text-primary tabular-nums">
          {formatScore(chain.totalScore)}
        </div>
        <p className="text-muted">{chain.gamesPlayed} jeu{chain.gamesPlayed > 1 ? 'x' : ''} joué{chain.gamesPlayed > 1 ? 's' : ''}</p>

        <div className="w-full max-w-sm space-y-2">
          {chain.state.results.map((result, i) => (
            <Card key={i} className="flex items-center gap-3 py-3">
              <span className="text-xl">{result.config.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{result.config.name}</div>
                <div className="text-xs text-muted">
                  {result.correct}/{result.total} correct
                </div>
              </div>
              <div className="text-sm font-bold text-primary tabular-nums">
                {formatScore(result.score)}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 w-full max-w-sm">
          <Button variant="secondary" onClick={() => router.push('/jeux')} className="flex-1">
            Quitter
          </Button>
          <Button onClick={() => { chain.resetChain(); chain.startChain(); }} className="flex-1">
            Rejouer
          </Button>
        </div>
      </div>
    );
  }

  // Transition between games
  if (chain.state.showingTransition) {
    const lastResult = chain.state.results[chain.state.results.length - 1];
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-6">
        <div className="text-3xl font-bold text-primary tabular-nums">
          +{formatScore(lastResult?.score ?? 0)}
        </div>
        <p className="text-muted">Score total : {formatScore(chain.totalScore)}</p>
        <p className="text-sm text-muted">Jeu suivant dans un instant...</p>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={chain.endChain}>
            Terminer la session
          </Button>
          <Button onClick={chain.nextGame}>
            Jeu suivant
          </Button>
        </div>
      </div>
    );
  }

  // Playing a game
  const currentGame = chain.currentGame;
  if (!currentGame) return null;

  const GameComponent = GAME_COMPONENTS[currentGame.id];
  if (!GameComponent) {
    chain.nextGame();
    return null;
  }

  return (
    <div className="relative">
      {/* Chain progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-secondary/10 h-8 flex items-center px-3 gap-2">
        <span className="text-xs font-medium text-secondary">
          Jeu {chain.gamesPlayed + 1}
        </span>
        <span className="text-xs text-muted">{currentGame.icon} {currentGame.name}</span>
        <div className="flex-1" />
        <button
          onClick={chain.endChain}
          className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          Arrêter
        </button>
      </div>

      <div className="pt-8">
        <ChainGameWrapper
          key={currentGame.id + '-' + chain.gamesPlayed}
          config={currentGame}
          GameComponent={GameComponent}
          onFinish={(score, correct, total) => {
            chain.recordResult(score, correct, total);
          }}
        />
      </div>
    </div>
  );
}

function ChainGameWrapper({
  config,
  GameComponent,
  onFinish,
}: {
  config: { id: string; name: string; description: string; icon: string; defaultDuration: number; maxLevel: number; skills: string[]; color: string };
  GameComponent: React.ComponentType<GameComponentProps>;
  onFinish: (score: number, correct: number, total: number) => void;
}) {
  const finishedRef = { current: false };

  return (
    <GameShell
      config={config as any}
      onChainFinish={(score, correct, total) => {
        if (!finishedRef.current) {
          finishedRef.current = true;
          onFinish(score, correct, total);
        }
      }}
    >
      {(props) => <GameComponent {...props} />}
    </GameShell>
  );
}
