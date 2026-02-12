'use client';

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
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-60px)] px-6 text-center gap-5">
        <span className="text-5xl animate-float">🔀</span>
        <div className="animate-fade-in-up stagger-1">
          <h2 className="text-2xl font-bold tracking-tight mb-1">Mode Enchaînement</h2>
          <p className="text-muted text-sm">
            Les mini-jeux s&apos;enchaînent aléatoirement. Arrête quand tu veux !
          </p>
        </div>
        <Button size="lg" onClick={chain.startChain} className="w-full max-w-xs animate-fade-in-up stagger-2">
          C&apos;est parti !
        </Button>
        <Button variant="ghost" onClick={() => router.push('/jeux')} className="animate-fade-in-up stagger-3">
          Retour aux jeux
        </Button>
      </div>
    );
  }

  // Finished
  if (chain.state.finished) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-60px)] px-6 text-center gap-4">
        <h2 className="text-lg font-bold text-muted animate-fade-in tracking-tight">Session terminée !</h2>
        <div className="animate-bounce-in">
          <div className="font-mono text-4xl font-extrabold accent-text tabular-nums tracking-tighter">
            {formatScore(chain.totalScore)}
          </div>
          <p className="text-xs text-muted mt-1 uppercase tracking-widest">
            {chain.gamesPlayed} jeu{chain.gamesPlayed > 1 ? 'x' : ''} joué{chain.gamesPlayed > 1 ? 's' : ''}
          </p>
        </div>

        <div className="w-full max-w-sm space-y-1.5 animate-fade-in-up stagger-2">
          {chain.state.results.map((result, i) => (
            <Card key={i} className="flex items-center gap-3 py-2.5 px-3">
              <span className="text-lg">{result.config.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{result.config.name}</div>
                <div className="text-xs text-muted">
                  {result.correct}/{result.total} correct
                </div>
              </div>
              <div className="font-mono text-sm font-bold accent-text tabular-nums">
                {formatScore(result.score)}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 w-full max-w-sm animate-fade-in-up stagger-3">
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
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-60px)] px-6 text-center gap-4">
        <div className="font-mono text-3xl font-extrabold accent-text tabular-nums animate-bounce-in">
          +{formatScore(lastResult?.score ?? 0)}
        </div>
        <p className="text-sm text-muted animate-fade-in">Score total : {formatScore(chain.totalScore)}</p>

        <div className="flex gap-3 animate-fade-in-up stagger-1">
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
      <div className="fixed top-0 left-0 right-0 z-50 glass h-7 flex items-center px-3 gap-2 border-b border-border/30">
        <span className="text-[11px] font-bold text-secondary">
          Jeu {chain.gamesPlayed + 1}
        </span>
        <span className="text-[11px] text-muted">{currentGame.icon} {currentGame.name}</span>
        <div className="flex-1" />
        <button
          onClick={chain.endChain}
          className="text-[11px] text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          Arrêter
        </button>
      </div>

      <div className="pt-7">
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
