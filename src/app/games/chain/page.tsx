'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useChainMode } from '@/hooks/useChainMode';
import { GameShell } from '@/components/game/GameShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatScore } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { GAME_I18N } from '@/games/registry';
import type { GameComponentProps } from '@/types';

const GAME_COMPONENTS: Record<string, React.ComponentType<GameComponentProps>> = {
  'speed-math': dynamic(() => import('@/games/speed-math/SpeedMath')),
  'memory-sequence': dynamic(() => import('@/games/memory-sequence/MemorySequence')),
  'find-intruder': dynamic(() => import('@/games/find-intruder/FindIntruder')),
  'reflex': dynamic(() => import('@/games/reflex/Reflex')),
  'logic-plus': dynamic(() => import('@/games/logic-plus/LogicPlus')),
  'right-word': dynamic(() => import('@/games/right-word/RightWord')),
  'rotation': dynamic(() => import('@/games/rotation/Rotation')),
  'search-count': dynamic(() => import('@/games/search-count/SearchCount')),
  'pairs': dynamic(() => import('@/games/pairs/Pairs')),
  'quick-sort': dynamic(() => import('@/games/quick-sort/QuickSort')),
  'trivia': dynamic(() => import('@/games/trivia/Trivia')),
  'word-definition': dynamic(() => import('@/games/word-definition/WordDefinition')),
};

export default function ChainPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const chain = useChainMode();

  // Not started yet
  if (!chain.state.isActive) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-60px)] px-6 text-center gap-5">
        <span className="text-5xl animate-float">🔀</span>
        <div className="animate-fade-in-up stagger-1">
          <h2 className="text-2xl font-bold tracking-tight mb-1">{t('chain.title')}</h2>
          <p className="text-muted text-sm">
            {t('chain.description')}
          </p>
        </div>
        <Button size="lg" onClick={chain.startChain} className="w-full max-w-xs animate-fade-in-up stagger-2">
          {t('chain.start')}
        </Button>
        <Button variant="ghost" onClick={() => router.push('/games')} className="animate-fade-in-up stagger-3">
          {t('chain.backToGames')}
        </Button>
      </div>
    );
  }

  // Finished
  if (chain.state.finished) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-60px)] px-6 text-center gap-4">
        <h2 className="text-lg font-bold text-muted animate-fade-in tracking-tight">{t('chain.sessionFinished')}</h2>
        <div className="animate-bounce-in">
          <div className="font-mono text-4xl font-extrabold accent-text tabular-nums tracking-tighter">
            {formatScore(chain.totalScore, locale)}
          </div>
          <p className="text-xs text-muted mt-1 uppercase tracking-widest">
            {t(chain.gamesPlayed > 1 ? 'chain.gameCount_other' : 'chain.gameCount_one', { count: chain.gamesPlayed })}
          </p>
        </div>

        <div className="w-full max-w-sm space-y-1.5 animate-fade-in-up stagger-2">
          {chain.state.results.map((result, i) => (
            <Card key={i} className="flex items-center gap-3 py-2.5 px-3">
              <span className="text-lg">{result.config.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{GAME_I18N[result.config.id] ? t(GAME_I18N[result.config.id].name) : result.config.name}</div>
                <div className="text-xs text-muted">
                  {result.correct}/{result.total} correct
                </div>
              </div>
              <div className="font-mono text-sm font-bold accent-text tabular-nums">
                {formatScore(result.score, locale)}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 w-full max-w-sm animate-fade-in-up stagger-3">
          <Button variant="secondary" onClick={() => router.push('/games')} className="flex-1">
            {t('chain.quit')}
          </Button>
          <Button onClick={() => { chain.resetChain(); chain.startChain(); }} className="flex-1">
            {t('chain.replay')}
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
          +{formatScore(lastResult?.score ?? 0, locale)}
        </div>
        <p className="text-sm text-muted animate-fade-in">{t('chain.totalScore', { score: formatScore(chain.totalScore, locale) })}</p>

        <div className="flex gap-3 animate-fade-in-up stagger-1">
          <Button variant="secondary" onClick={chain.endChain}>
            {t('chain.endSession')}
          </Button>
          <Button onClick={chain.nextGame}>
            {t('chain.nextGame')}
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
          {t('chain.gameNumber', { number: chain.gamesPlayed + 1 })}
        </span>
        <span className="text-[11px] text-muted">{currentGame.icon} {GAME_I18N[currentGame.id] ? t(GAME_I18N[currentGame.id].name) : currentGame.name}</span>
        <div className="flex-1" />
        <button
          onClick={chain.endChain}
          className="text-[11px] text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          {t('chain.stop')}
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
