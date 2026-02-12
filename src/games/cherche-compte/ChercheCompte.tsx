'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import { AnswerOptions } from '@/components/game/AnswerOptions';
import { generatePuzzle, type CountPuzzle } from './logic';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

export default function ChercheCompte({ difficulty, onAnswer, timeRemaining }: Props) {
  const [puzzle, setPuzzle] = useState<CountPuzzle>(() => generatePuzzle(difficulty));
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
    <div className="flex flex-col items-center justify-between h-full py-4">
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
        <p className="text-sm text-muted">
          Combien de <span className="text-xl">{puzzle.target}</span> ?
        </p>

        <div
          className="grid gap-1 p-3 bg-surface rounded-xl border border-border"
          style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, 1fr)` }}
        >
          {puzzle.grid.map((symbol, i) => (
            <div
              key={i}
              className="w-10 h-10 flex items-center justify-center text-lg"
            >
              {symbol}
            </div>
          ))}
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
