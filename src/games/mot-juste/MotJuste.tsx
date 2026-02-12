'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import { AnswerOptions } from '@/components/game/AnswerOptions';
import { getQuestion } from './logic';
import type { WordQuestion } from './words';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

export default function MotJuste({ difficulty, onAnswer, timeRemaining }: Props) {
  const usedWordsRef = useRef(new Set<string>());
  const [question, setQuestion] = useState<WordQuestion | null>(() =>
    getQuestion(difficulty, usedWordsRef.current),
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const roundStartRef = useRef(Date.now());

  const nextQuestion = useCallback(() => {
    const q = getQuestion(difficulty, usedWordsRef.current);
    if (q) usedWordsRef.current.add(q.word);
    setQuestion(q);
    setSelectedIndex(null);
    roundStartRef.current = Date.now();
  }, [difficulty]);

  useEffect(() => {
    usedWordsRef.current.clear();
    nextQuestion();
  }, [difficulty, nextQuestion]);

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedIndex !== null || !question) return;

      const responseTime = Date.now() - roundStartRef.current;
      const correct = index === question.correctIndex;
      setSelectedIndex(index);
      onAnswer(correct, responseTime);

      setTimeout(() => nextQuestion(), correct ? 500 : 1200);
    },
    [selectedIndex, question, onAnswer, nextQuestion],
  );

  if (timeRemaining <= 0 || !question) return null;

  return (
    <div className="flex flex-col items-center justify-between h-full py-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-3xl font-bold text-center">{question.word}</div>
        <p className="text-sm text-muted text-center">{question.question}</p>
      </div>

      <AnswerOptions
        options={question.options as unknown as string[]}
        onSelect={handleSelect}
        disabled={selectedIndex !== null}
        selectedIndex={selectedIndex}
        correctIndex={selectedIndex !== null ? question.correctIndex : null}
      />
    </div>
  );
}
