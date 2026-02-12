'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { DifficultyLevel } from '@/types';
import { generateStimulus, type StimulusType } from './logic';
import { LEVEL_CONFIG } from './config';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

type Phase = 'waiting' | 'stimulus' | 'feedback' | 'tooEarly';

export default function Reflexe({ difficulty, onAnswer, onComplete, timeRemaining }: Props) {
  const config = LEVEL_CONFIG[difficulty];
  const [phase, setPhase] = useState<Phase>('waiting');
  const [stimulusType, setStimulusType] = useState<StimulusType>('go');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
  const [roundNumber, setRoundNumber] = useState(0);
  const stimulusTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const startNewRound = useCallback(() => {
    if (roundNumber >= config.rounds) {
      onComplete();
      return;
    }

    const stimulus = generateStimulus(config.minDelay, config.maxDelay, config.noGoRatio);
    setStimulusType(stimulus.type);
    setPhase('waiting');
    setReactionTime(null);
    setFeedbackCorrect(null);

    timerRef.current = setTimeout(() => {
      setPhase('stimulus');
      stimulusTimeRef.current = performance.now();

      // Auto-advance if no-go: player should NOT tap. If they don't tap in 2s, that's correct.
      if (stimulus.type === 'nogo') {
        timerRef.current = setTimeout(() => {
          setFeedbackCorrect(true);
          setPhase('feedback');
          onAnswer(true, 0);
          setRoundNumber((r) => r + 1);
        }, 2000);
      }
    }, stimulus.delay);
  }, [roundNumber, config, onAnswer, onComplete]);

  useEffect(() => {
    startNewRound();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [roundNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTap = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (phase === 'waiting') {
      // Tapped too early
      setPhase('tooEarly');
      onAnswer(false, 0);
      setTimeout(() => setRoundNumber((r) => r + 1), 1000);
      return;
    }

    if (phase === 'stimulus') {
      const rt = Math.round(performance.now() - stimulusTimeRef.current);
      setReactionTime(rt);

      if (stimulusType === 'go') {
        setFeedbackCorrect(true);
        setPhase('feedback');
        onAnswer(true, rt);
      } else {
        // Tapped on no-go
        setFeedbackCorrect(false);
        setPhase('feedback');
        onAnswer(false, rt);
      }

      setTimeout(() => setRoundNumber((r) => r + 1), 1000);
    }
  }, [phase, stimulusType, onAnswer]);

  // Auto-advance from feedback
  useEffect(() => {
    if (phase === 'feedback' || phase === 'tooEarly') {
      // handled in handleTap / startNewRound timeouts
    }
  }, [phase]);

  if (timeRemaining <= 0) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="text-sm text-muted mb-2">
        Tour {Math.min(roundNumber + 1, config.rounds)}/{config.rounds}
        {config.hasNoGo && (
          <span className="block text-xs mt-1">
            Touche le vert, ignore le rouge
          </span>
        )}
      </div>

      <button
        onClick={handleTap}
        disabled={phase === 'feedback'}
        className="w-64 h-64 rounded-full flex items-center justify-center transition-all duration-100 touch-manipulation cursor-pointer active:scale-95"
        style={{
          backgroundColor:
            phase === 'waiting'
              ? 'var(--border)'
              : phase === 'stimulus'
              ? stimulusType === 'go'
                ? 'var(--success)'
                : 'var(--error)'
              : phase === 'tooEarly'
              ? 'var(--warning)'
              : feedbackCorrect
              ? 'var(--success)'
              : 'var(--error)',
          opacity: phase === 'feedback' ? 0.6 : 1,
        }}
      >
        <span className="text-white text-xl font-bold">
          {phase === 'waiting' && 'Attends...'}
          {phase === 'stimulus' && (stimulusType === 'go' ? 'TOUCHE !' : 'NE TOUCHE PAS')}
          {phase === 'tooEarly' && 'Trop tôt !'}
          {phase === 'feedback' && feedbackCorrect && reactionTime !== null && `${reactionTime}ms`}
          {phase === 'feedback' && feedbackCorrect && reactionTime === null && 'Bien !'}
          {phase === 'feedback' && !feedbackCorrect && 'Raté !'}
        </span>
      </button>
    </div>
  );
}
