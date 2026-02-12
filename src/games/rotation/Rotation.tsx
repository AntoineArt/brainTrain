'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import { generatePuzzle, type RotationPuzzle } from './logic';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

function ShapeGrid({ grid, size }: { grid: number[][]; size: number }) {
  const cellSize = Math.min(size / grid.length, 20);
  return (
    <div
      className="grid gap-px"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, ${cellSize}px)`,
      }}
    >
      {grid.flat().map((cell, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            width: cellSize,
            height: cellSize,
            backgroundColor: cell ? 'var(--primary)' : 'transparent',
          }}
        />
      ))}
    </div>
  );
}

export default function RotationGame({ difficulty, onAnswer, timeRemaining }: Props) {
  const [puzzle, setPuzzle] = useState<RotationPuzzle>(() => generatePuzzle(difficulty));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const roundStartRef = useRef(Date.now());

  const nextPuzzle = useCallback(() => {
    setPuzzle(generatePuzzle(difficulty));
    setSelectedIndex(null);
    setCorrect(null);
    roundStartRef.current = Date.now();
  }, [difficulty]);

  useEffect(() => {
    nextPuzzle();
  }, [difficulty, nextPuzzle]);

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedIndex !== null) return;

      const responseTime = Date.now() - roundStartRef.current;
      const isCorrect = index === puzzle.correctIndex;
      setSelectedIndex(index);
      setCorrect(isCorrect);
      onAnswer(isCorrect, responseTime);

      setTimeout(() => nextPuzzle(), isCorrect ? 500 : 1000);
    },
    [selectedIndex, puzzle.correctIndex, onAnswer, nextPuzzle],
  );

  if (timeRemaining <= 0) return null;

  return (
    <div className="flex flex-col items-center justify-between h-full py-6">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted">
          Quelle est la rotation de cette forme ?
        </p>

        {/* Original shape */}
        <div className="p-4 bg-surface rounded-xl border-2 border-primary">
          <ShapeGrid grid={puzzle.shape} size={80} />
        </div>

        <p className="text-xs text-muted">Rotation : {puzzle.rotation}°</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm px-4">
        {puzzle.rotatedShapes.map((shape, i) => {
          let borderClass = 'border-border';
          if (selectedIndex !== null) {
            if (i === puzzle.correctIndex) borderClass = 'border-success';
            if (i === selectedIndex && !correct) borderClass = 'border-error';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selectedIndex !== null}
              className={`
                p-4 rounded-xl border-2 ${borderClass} bg-surface
                flex items-center justify-center
                transition-all duration-200 touch-manipulation cursor-pointer
                active:scale-95 disabled:cursor-default
              `}
            >
              <ShapeGrid grid={shape} size={60} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
