'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import { generateCards, type PairCard } from './logic';
import { LEVEL_CONFIG } from './config';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

export default function Paires({ difficulty, onAnswer, onComplete, timeRemaining }: Props) {
  const config = LEVEL_CONFIG[difficulty];
  const [cards, setCards] = useState<PairCard[]>(() => generateCards(config.pairs));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const lockRef = useRef(false);
  const flipStartRef = useRef(Date.now());

  const resetBoard = useCallback(() => {
    setCards(generateCards(config.pairs));
    setFlippedIds([]);
    setMatchedPairs(0);
    lockRef.current = false;
  }, [config.pairs]);

  useEffect(() => {
    if (matchedPairs === config.pairs) {
      // All pairs found — reset for new round
      setTimeout(() => resetBoard(), 500);
    }
  }, [matchedPairs, config.pairs, resetBoard]);

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (lockRef.current) return;

      const card = cards.find((c) => c.id === cardId);
      if (!card || card.isMatched || flippedIds.includes(cardId)) return;

      const newFlipped = [...flippedIds, cardId];
      setFlippedIds(newFlipped);

      if (newFlipped.length === 1) {
        flipStartRef.current = Date.now();
        return;
      }

      if (newFlipped.length === 2) {
        lockRef.current = true;
        const [firstId, secondId] = newFlipped;
        const first = cards.find((c) => c.id === firstId)!;
        const second = cards.find((c) => c.id === secondId)!;
        const responseTime = Date.now() - flipStartRef.current;

        if (first.pairId === second.pairId) {
          // Match
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.pairId === first.pairId ? { ...c, isMatched: true } : c,
              ),
            );
            setFlippedIds([]);
            setMatchedPairs((prev) => prev + 1);
            lockRef.current = false;
            onAnswer(true, responseTime);
          }, 300);
        } else {
          // No match
          setTimeout(() => {
            setFlippedIds([]);
            lockRef.current = false;
            onAnswer(false, responseTime);
          }, config.peekTimeMs);
        }
      }
    },
    [cards, flippedIds, config.peekTimeMs, onAnswer],
  );

  if (timeRemaining <= 0) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
      <p className="text-sm text-muted">
        Paires trouvées : {matchedPairs}/{config.pairs}
      </p>

      <div
        className="grid gap-2 w-full max-w-sm"
        style={{ gridTemplateColumns: `repeat(${config.cols}, 1fr)` }}
      >
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id) || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched}
              className={`
                aspect-square rounded-xl text-2xl flex items-center justify-center
                transition-all duration-200 touch-manipulation cursor-pointer
                border-2
                ${card.isMatched
                  ? 'bg-success/10 border-success/30 opacity-60'
                  : isFlipped
                  ? 'bg-primary/10 border-primary'
                  : 'bg-surface border-border hover:border-primary/50 active:scale-95'
                }
              `}
            >
              {isFlipped ? card.emoji : '?'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
