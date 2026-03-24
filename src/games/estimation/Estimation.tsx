'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { NumericKeypad } from '@/components/game/NumericKeypad';
import {
  generateStimulus,
  checkEstimate,
  getTimePenalty,
  getErrorPercent,
  type Stimulus,
  type EstimateResult,
} from './logic';
import { LEVEL_CONFIG } from './config';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

type Phase = 'display' | 'answering' | 'feedback';

export default function Estimation({ difficulty, onAnswer, timeRemaining }: Props) {
  const { t } = useTranslation();
  const config = LEVEL_CONFIG[difficulty];

  const [stimulus, setStimulus] = useState<Stimulus>(() => generateStimulus(difficulty));
  const [phase, setPhase] = useState<Phase>('display');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [errorPct, setErrorPct] = useState(0);
  const roundStartRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Display timer — auto-transition to answering phase
  useEffect(() => {
    if (phase !== 'display') return;

    timerRef.current = setTimeout(() => {
      setPhase('answering');
      roundStartRef.current = Date.now();
    }, config.displayTimeMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, config.displayTimeMs]);

  const nextRound = useCallback(() => {
    const newStimulus = generateStimulus(difficulty);
    setStimulus(newStimulus);
    setPhase('display');
    setInput('');
    setResult(null);
    setErrorPct(0);
  }, [difficulty]);

  const handleSubmit = useCallback(() => {
    if (phase !== 'answering') return;
    const estimate = parseInt(input, 10);
    if (isNaN(estimate)) return;

    const responseTime = Date.now() - roundStartRef.current;
    const estimateResult = checkEstimate(
      stimulus.answer,
      estimate,
      config.correctThreshold,
      config.closeThreshold,
    );

    const timePenalty = getTimePenalty(estimateResult);
    const correct = estimateResult !== 'wrong';

    setResult(estimateResult);
    setErrorPct(getErrorPercent(stimulus.answer, estimate));
    setPhase('feedback');
    onAnswer(correct, responseTime + timePenalty);

    setTimeout(() => nextRound(), correct ? 800 : 1500);
  }, [phase, input, stimulus, config.correctThreshold, config.closeThreshold, onAnswer, nextRound]);

  // Reset on difficulty change
  useEffect(() => {
    nextRound();
  }, [difficulty, nextRound]);

  if (timeRemaining <= 0) return null;

  return (
    <div className="flex flex-col h-full justify-between py-6">
      {/* Stimulus area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-3">

        {/* Phase: Display */}
        {phase === 'display' && (
          <div className="w-full max-w-sm animate-fade-in-up">
            {stimulus.type === 'dots' && <DotDisplay stimulus={stimulus} />}
            {stimulus.type === 'percentage' && <PercentageDisplay stimulus={stimulus} />}
            {stimulus.type === 'arithmetic' && <ArithmeticDisplay stimulus={stimulus} />}

            {/* Countdown bar */}
            <div className="mt-4 h-1 bg-border/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  animation: `shrink ${config.displayTimeMs}ms linear forwards`,
                }}
              />
            </div>
            <style>{`
              @keyframes shrink {
                from { width: 100%; }
                to { width: 0%; }
              }
            `}</style>
          </div>
        )}

        {/* Phase: Answering */}
        {phase === 'answering' && (
          <div className="flex flex-col items-center gap-2 animate-fade-in-up">
            <span className="text-sm font-semibold text-muted">
              {stimulus.type === 'dots' && t('estimation.howMany')}
              {stimulus.type === 'percentage' && t('estimation.whatPercentage')}
              {stimulus.type === 'arithmetic' && t('estimation.whatResult')}
            </span>
            <span className="text-xs text-muted/60">{t('estimation.estimate')}</span>
          </div>
        )}

        {/* Phase: Feedback */}
        {phase === 'feedback' && (
          <div className="flex flex-col items-center gap-2 animate-fade-in-up">
            {result === 'correct' && (
              <div className="text-success font-bold text-2xl">{t('game.correct')}</div>
            )}
            {result === 'close' && (
              <div className="text-warning font-bold text-2xl">{t('estimation.close')}</div>
            )}
            {result === 'wrong' && (
              <div className="text-error font-bold text-2xl">{t('game.wrong')}</div>
            )}
            <div className="text-sm text-muted">
              {t('estimation.actual')}: <strong className="text-foreground">{stimulus.answer}</strong>
              {stimulus.type === 'percentage' && '%'}
            </div>
            <div className="text-xs text-muted/60">
              {t('estimation.error')}: {errorPct}%
            </div>
          </div>
        )}
      </div>

      {/* Numeric input — only during answer phase */}
      {phase === 'answering' && (
        <NumericKeypad
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

// ─── Stimulus renderers ────────────────────────────────────

import type { DotStimulus, PercentageStimulus, ArithmeticStimulus } from './logic';

function DotDisplay({ stimulus }: { stimulus: DotStimulus }) {
  return (
    <div className="relative w-full aspect-square bg-surface-light border border-border/50 rounded-2xl overflow-hidden">
      {stimulus.dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}

function PercentageDisplay({ stimulus }: { stimulus: PercentageStimulus }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full h-10 bg-surface-light border border-border/50 rounded-xl overflow-hidden">
        <div
          className="h-full bg-primary/70 rounded-xl transition-none"
          style={{ width: `${stimulus.fillPercent}%` }}
        />
      </div>
      <span className="text-xs text-muted font-medium">?%</span>
    </div>
  );
}

function ArithmeticDisplay({ stimulus }: { stimulus: ArithmeticStimulus }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-4xl font-bold tabular-nums text-center">
        {stimulus.expression}
      </div>
      <span className="text-lg text-muted">≈ ?</span>
    </div>
  );
}
