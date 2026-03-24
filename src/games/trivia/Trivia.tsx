'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import type { TranslationKey } from '@/locales';
import { useTranslation } from '@/hooks/useTranslation';
import { AnswerOptions } from '@/components/game/AnswerOptions';
import { getQuestion, type ShuffledQuizQuestion } from './logic';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

export default function Trivia({ difficulty, onAnswer, timeRemaining }: Props) {
  const { t, locale } = useTranslation();
  const usedIdsRef = useRef(new Set<string>());
  const [question, setQuestion] = useState<ShuffledQuizQuestion | null>(() =>
    getQuestion(difficulty, usedIdsRef.current, undefined, locale),
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const roundStartRef = useRef(Date.now());

  const nextQuestion = useCallback(() => {
    const q = getQuestion(difficulty, usedIdsRef.current, undefined, locale);
    if (q) usedIdsRef.current.add(q.id);
    setQuestion(q);
    setSelectedIndex(null);
    setShowExplanation(false);
    roundStartRef.current = Date.now();
  }, [difficulty, locale]);

  useEffect(() => {
    usedIdsRef.current.clear();
    nextQuestion();
  }, [difficulty, nextQuestion]);

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedIndex !== null || !question) return;

      const responseTime = Date.now() - roundStartRef.current;
      const correct = index === question.correctIndex;
      setSelectedIndex(index);
      setShowExplanation(true);
      onAnswer(correct, responseTime);

      setTimeout(() => nextQuestion(), 1500);
    },
    [selectedIndex, question, onAnswer, nextQuestion],
  );

  if (timeRemaining <= 0 || !question) return null;

  return (
    <div className="flex flex-col items-center justify-between h-full py-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-skill-culture/10 text-skill-culture">
          {t(`category.${question.category}` as TranslationKey)}
        </span>

        <h3 className="text-lg font-bold text-center leading-snug">
          {question.question}
        </h3>

        {showExplanation && question.explanation && (
          <p className="text-xs text-muted text-center px-2 max-w-sm">
            {question.explanation}
          </p>
        )}
      </div>

      <AnswerOptions
        options={question.choices as unknown as string[]}
        onSelect={handleSelect}
        disabled={selectedIndex !== null}
        selectedIndex={selectedIndex}
        correctIndex={selectedIndex !== null ? question.correctIndex : null}
      />
    </div>
  );
}
