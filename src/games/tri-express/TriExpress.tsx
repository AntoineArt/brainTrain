'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import { Button } from '@/components/ui/Button';
import { generatePuzzle, checkOrder, type SortPuzzle } from './logic';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

export default function TriExpress({ difficulty, onAnswer, timeRemaining }: Props) {
  const [puzzle, setPuzzle] = useState<SortPuzzle>(() => generatePuzzle(difficulty));
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const roundStartRef = useRef(Date.now());

  const nextPuzzle = useCallback(() => {
    setPuzzle(generatePuzzle(difficulty));
    setSelectedOrder([]);
    setFeedback(null);
    roundStartRef.current = Date.now();
  }, [difficulty]);

  useEffect(() => {
    nextPuzzle();
  }, [difficulty, nextPuzzle]);

  const handleSelectItem = useCallback(
    (index: number) => {
      if (feedback !== null) return;
      if (selectedOrder.includes(index)) return;

      const newOrder = [...selectedOrder, index];
      setSelectedOrder(newOrder);

      if (newOrder.length === puzzle.items.length) {
        const responseTime = Date.now() - roundStartRef.current;
        const correct = checkOrder(newOrder, puzzle.correctOrder);

        setFeedback(correct ? 'correct' : 'incorrect');
        onAnswer(correct, responseTime);

        setTimeout(() => nextPuzzle(), correct ? 500 : 1200);
      }
    },
    [feedback, selectedOrder, puzzle, onAnswer, nextPuzzle],
  );

  const handleUndo = useCallback(() => {
    if (feedback !== null) return;
    setSelectedOrder((prev) => prev.slice(0, -1));
  }, [feedback]);

  if (timeRemaining <= 0) return null;

  return (
    <div className="flex flex-col items-center justify-between h-full py-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-muted">{puzzle.instruction}</p>

        {/* Selected items (answer area) */}
        <div className="flex flex-wrap gap-2 justify-center min-h-14 items-center p-3 bg-surface rounded-xl border border-border w-full max-w-sm">
          {selectedOrder.length === 0 ? (
            <span className="text-sm text-muted">Touche les éléments dans l&apos;ordre</span>
          ) : (
            selectedOrder.map((idx, pos) => (
              <span
                key={pos}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-bold
                  ${feedback === 'correct' ? 'bg-success/20 text-success' : ''}
                  ${feedback === 'incorrect' ? 'bg-error/20 text-error' : ''}
                  ${feedback === null ? 'bg-primary/10 text-primary' : ''}
                `}
              >
                {puzzle.items[idx].value}
              </span>
            ))
          )}
        </div>

        {/* Available items */}
        <div className="flex flex-wrap gap-2 justify-center">
          {puzzle.items.map((item, i) => {
            const isSelected = selectedOrder.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleSelectItem(i)}
                disabled={isSelected || feedback !== null}
                className={`
                  px-4 py-3 rounded-xl text-lg font-bold border-2
                  transition-all duration-200 touch-manipulation cursor-pointer
                  active:scale-95
                  ${isSelected
                    ? 'opacity-30 border-border bg-background cursor-default'
                    : 'border-border bg-surface hover:border-primary'
                  }
                  disabled:cursor-default
                `}
              >
                {item.value}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 w-full max-w-sm">
        <Button
          variant="ghost"
          onClick={handleUndo}
          disabled={selectedOrder.length === 0 || feedback !== null}
          className="w-full"
        >
          Annuler le dernier
        </Button>
      </div>
    </div>
  );
}
