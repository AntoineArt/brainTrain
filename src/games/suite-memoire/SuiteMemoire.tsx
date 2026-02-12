'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { DifficultyLevel } from '@/types';
import { generateSequence, checkSequence } from './logic';
import { LEVEL_CONFIG } from './config';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

type Phase = 'showing' | 'input' | 'feedback';

export default function SuiteMemoire({ difficulty, onAnswer, timeRemaining }: Props) {
  const config = LEVEL_CONFIG[difficulty];
  const [sequence, setSequence] = useState<number[]>([]);
  const [sequenceLength, setSequenceLength] = useState(config.initialLength);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('showing');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lastTapped, setLastTapped] = useState<number | null>(null);
  const roundStartRef = useRef(Date.now());

  const startRound = useCallback(() => {
    const seq = generateSequence(config.gridSize, sequenceLength);
    setSequence(seq);
    setUserInput([]);
    setShowingIndex(0);
    setPhase('showing');
    setFeedback(null);
  }, [config.gridSize, sequenceLength]);

  // Start first round
  useEffect(() => {
    startRound();
  }, [startRound]);

  // Animate sequence display
  useEffect(() => {
    if (phase !== 'showing' || showingIndex < 0) return;

    if (showingIndex >= sequence.length) {
      // Done showing sequence
      const timer = setTimeout(() => {
        setPhase('input');
        setShowingIndex(-1);
        roundStartRef.current = Date.now();
      }, 300);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setShowingIndex((prev) => prev + 1);
    }, config.showDurationMs);

    return () => clearTimeout(timer);
  }, [phase, showingIndex, sequence.length, config.showDurationMs]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (phase !== 'input') return;

      // Flash feedback on every tap
      setLastTapped(index);
      setTimeout(() => setLastTapped(null), 200);

      const newInput = [...userInput, index];
      setUserInput(newInput);

      if (newInput.length === sequence.length) {
        const correct = checkSequence(sequence, newInput);
        const responseTime = Date.now() - roundStartRef.current;

        setFeedback(correct ? 'correct' : 'incorrect');
        setPhase('feedback');
        onAnswer(correct, responseTime);

        setTimeout(() => {
          if (correct) {
            setSequenceLength((prev) => prev + 1);
          }
          startRound();
        }, correct ? 500 : 1000);
      }
    },
    [phase, userInput, sequence, onAnswer, startRound],
  );

  if (timeRemaining <= 0) return null;

  const totalCells = config.gridSize * config.gridSize;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
      {/* Status */}
      <div className="text-center">
        <div className="text-sm text-muted">
          {phase === 'showing' && 'Mémorise la séquence...'}
          {phase === 'input' && `Reproduis (${userInput.length}/${sequence.length})`}
          {phase === 'feedback' && feedback === 'correct' && 'Bravo !'}
          {phase === 'feedback' && feedback === 'incorrect' && 'Raté !'}
        </div>
        <div className="text-xs text-muted mt-1">Longueur : {sequenceLength}</div>
      </div>

      {/* Grid */}
      <div
        className="grid gap-2 w-full max-w-xs aspect-square"
        style={{ gridTemplateColumns: `repeat(${config.gridSize}, 1fr)` }}
      >
        {Array.from({ length: totalCells }).map((_, i) => {
          const isHighlighted =
            phase === 'showing' && showingIndex >= 0 && showingIndex < sequence.length && sequence[showingIndex] === i;
          const isUserSelected = phase === 'input' && userInput.includes(i);
          const isTapping = lastTapped === i;
          const isCorrectFeedback = phase === 'feedback' && feedback === 'correct' && sequence.includes(i);
          const isIncorrectFeedback = phase === 'feedback' && feedback === 'incorrect' && sequence.includes(i);
          // Count how many times this cell appears in user input
          const tapCount = phase === 'input' ? userInput.filter((v) => v === i).length : 0;

          return (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={phase !== 'input'}
              className={`
                relative rounded-xl aspect-square transition-all duration-200 touch-manipulation cursor-pointer border-2
                ${isHighlighted ? 'bg-primary border-primary scale-95' : ''}
                ${isTapping ? 'bg-primary border-primary scale-90' : ''}
                ${isUserSelected && !isTapping ? 'bg-primary/30 border-primary' : ''}
                ${isCorrectFeedback ? 'bg-success/30 border-success' : ''}
                ${isIncorrectFeedback ? 'bg-error/30 border-error' : ''}
                ${!isHighlighted && !isUserSelected && !isTapping && !isCorrectFeedback && !isIncorrectFeedback
                  ? 'bg-surface border-border hover:bg-background'
                  : ''
                }
                disabled:cursor-default
              `}
            >
              {tapCount > 0 && phase === 'input' && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary opacity-60">
                  {tapCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
