'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import { generatePuzzle, type IntrusPuzzle } from './logic';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

export default function TrouveIntrus({ difficulty, onAnswer, timeRemaining }: Props) {
  const [puzzle, setPuzzle] = useState<IntrusPuzzle>(() => generatePuzzle(difficulty));
  const [feedback, setFeedback] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const roundStartRef = useRef(Date.now());

  const nextPuzzle = useCallback(() => {
    setPuzzle(generatePuzzle(difficulty));
    setFeedback(null);
    setCorrect(null);
    roundStartRef.current = Date.now();
  }, [difficulty]);

  useEffect(() => {
    nextPuzzle();
  }, [difficulty, nextPuzzle]);

  const handleClick = useCallback(
    (index: number) => {
      if (feedback !== null) return;

      const responseTime = Date.now() - roundStartRef.current;
      const isCorrect = index === puzzle.intrusIndex;

      setFeedback(index);
      setCorrect(isCorrect);
      onAnswer(isCorrect, responseTime);

      setTimeout(() => {
        nextPuzzle();
      }, isCorrect ? 400 : 800);
    },
    [feedback, puzzle.intrusIndex, onAnswer, nextPuzzle],
  );

  if (timeRemaining <= 0) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
      <p className="text-sm text-muted">Trouve l&apos;intrus !</p>

      <div
        className="grid gap-2 w-full max-w-xs"
        style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, 1fr)` }}
      >
        {puzzle.items.map((item, i) => {
          let borderClass = 'border-border';
          if (feedback !== null) {
            if (i === puzzle.intrusIndex) borderClass = 'border-success';
            if (i === feedback && !correct) borderClass = 'border-error';
          }

          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={feedback !== null}
              className={`
                aspect-square rounded-xl bg-surface border-2 ${borderClass}
                flex items-center justify-center
                transition-all duration-200 touch-manipulation cursor-pointer
                active:scale-95 disabled:cursor-default
              `}
            >
              <span style={{ color: item.color, fontSize: `${item.size}px` }}>
                {item.shape}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
