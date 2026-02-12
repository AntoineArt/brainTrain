'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import { AnswerOptions } from '@/components/game/AnswerOptions';
import { generatePuzzle, type LogicPuzzle } from './logic';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

export default function LogiquePlus({ difficulty, onAnswer, timeRemaining }: Props) {
  const [puzzle, setPuzzle] = useState<LogicPuzzle>(() => generatePuzzle(difficulty));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const roundStartRef = useRef(Date.now());

  const nextPuzzle = useCallback(() => {
    setPuzzle(generatePuzzle(difficulty));
    setSelectedIndex(null);
    roundStartRef.current = Date.now();
  }, [difficulty]);

  useEffect(() => {
    nextPuzzle();
  }, [difficulty, nextPuzzle]);

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedIndex !== null) return;

      const responseTime = Date.now() - roundStartRef.current;
      const correct = index === puzzle.correctIndex;
      setSelectedIndex(index);
      onAnswer(correct, responseTime);

      setTimeout(() => nextPuzzle(), correct ? 500 : 1000);
    },
    [selectedIndex, puzzle.correctIndex, onAnswer, nextPuzzle],
  );

  if (timeRemaining <= 0) return null;

  return (
    <div className="flex flex-col items-center justify-between h-full py-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-muted">Quel nombre suit ?</p>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {puzzle.sequence.map((num, i) => (
            <span key={i} className="text-2xl font-bold tabular-nums">
              {num}
              {i < puzzle.sequence.length - 1 && (
                <span className="text-muted mx-1">·</span>
              )}
            </span>
          ))}
          <span className="text-2xl font-bold text-primary">?</span>
        </div>
      </div>

      <AnswerOptions
        options={puzzle.options.map(String)}
        onSelect={handleSelect}
        disabled={selectedIndex !== null}
        selectedIndex={selectedIndex}
        correctIndex={selectedIndex !== null ? puzzle.correctIndex : null}
      />
    </div>
  );
}
