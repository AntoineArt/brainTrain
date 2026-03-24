'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { NumericKeypad } from '@/components/game/NumericKeypad';
import { generateChain, checkAnswer, type Chain } from './logic';
import { LEVEL_CONFIG } from './config';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

type Phase = 'showing' | 'answering' | 'feedback';
type Feedback = 'correct' | 'wrong' | null;

export default function NumberChain({ difficulty, onAnswer, timeRemaining }: Props) {
  const { t } = useTranslation();
  const config = LEVEL_CONFIG[difficulty];

  const [chain, setChain] = useState<Chain>(() => generateChain(difficulty));
  const [phase, setPhase] = useState<Phase>('showing');
  const [showingStep, setShowingStep] = useState(-1); // -1 = start value, 0..n = operations
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const roundStartRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Run the showing sequence
  useEffect(() => {
    if (phase !== 'showing') return;

    const totalSteps = chain.operations.length;
    // showingStep starts at -1 (start value)
    // After showing all steps (0..totalSteps-1), move to answering

    if (showingStep < totalSteps) {
      timerRef.current = setTimeout(() => {
        setShowingStep((s) => s + 1);
      }, config.displayTimeMs);
    }

    if (showingStep >= totalSteps) {
      // All operations shown, transition to answer phase
      setPhase('answering');
      roundStartRef.current = Date.now();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, showingStep, chain.operations.length, config.displayTimeMs]);

  const nextRound = useCallback(() => {
    const newChain = generateChain(difficulty);
    setChain(newChain);
    setPhase('showing');
    setShowingStep(-1);
    setInput('');
    setFeedback(null);
  }, [difficulty]);

  const handleSubmit = useCallback(() => {
    if (phase !== 'answering') return;
    const userAnswer = parseInt(input, 10);
    if (isNaN(userAnswer)) return;

    const responseTime = Date.now() - roundStartRef.current;
    const correct = checkAnswer(chain, userAnswer);

    setFeedback(correct ? 'correct' : 'wrong');
    setPhase('feedback');
    onAnswer(correct, responseTime);

    setTimeout(() => nextRound(), correct ? 500 : 1500);
  }, [phase, input, chain, onAnswer, nextRound]);

  // Reset on difficulty change
  useEffect(() => {
    nextRound();
  }, [difficulty, nextRound]);

  if (timeRemaining <= 0) return null;

  return (
    <div className="flex flex-col h-full justify-between py-6">
      {/* Chain display area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-3">

        {/* Phase: Showing */}
        {phase === 'showing' && (
          <div className="flex flex-col items-center gap-4">
            {/* Start value — always visible during showing */}
            {showingStep === -1 && (
              <div className="animate-fade-in-up">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  {t('numberChain.start')}
                </span>
                <div className="text-5xl font-bold tabular-nums text-center mt-1">
                  {chain.startValue}
                </div>
              </div>
            )}

            {/* Current operation */}
            {showingStep >= 0 && showingStep < chain.operations.length && (
              <div key={showingStep} className="animate-fade-in-up">
                <div className="text-5xl font-bold tabular-nums text-primary text-center">
                  {chain.operations[showingStep].display}
                </div>
                <div className="text-xs text-muted text-center mt-2">
                  {t('numberChain.step', { current: String(showingStep + 1), total: String(chain.operations.length) })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Phase: Answering */}
        {phase === 'answering' && (
          <div className="flex flex-col items-center gap-2 animate-fade-in-up">
            <span className="text-sm font-semibold text-muted">
              {t('numberChain.whatIsResult')}
            </span>
            <div className="text-xs text-muted/60">
              {chain.startValue} → {chain.operations.map((op) => op.display).join(' → ')} = ?
            </div>
          </div>
        )}

        {/* Phase: Feedback */}
        {phase === 'feedback' && (
          <div className="flex flex-col items-center gap-2 animate-fade-in-up">
            {feedback === 'correct' && (
              <div className="text-success font-bold text-2xl">{t('game.correct')}</div>
            )}
            {feedback === 'wrong' && (
              <>
                <div className="text-error font-bold text-2xl">{t('game.wrong')}</div>
                <div className="text-muted text-sm">
                  {chain.startValue} → {chain.operations.map((op) => op.display).join(' → ')} = <strong className="text-foreground">{chain.answer}</strong>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Numeric input — only visible during answer phase */}
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
