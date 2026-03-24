'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import { TextInput } from '@/components/game/TextInput';
import { getQuestion, checkAnswer, buildHint, getRandomUnrevealedIndex, type DefQuestion } from './logic';
import { LEVEL_CONFIG } from './config';

interface Props {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

const HINT_TIME_PENALTY_MS = 3000; // Each hint adds 3s to reported response time

export default function WordDefinition({ difficulty, onAnswer, timeRemaining, isPaused }: Props) {
  const config = LEVEL_CONFIG[difficulty];
  const usedIdsRef = useRef(new Set<string>());
  const [question, setQuestion] = useState<DefQuestion | null>(() =>
    getQuestion(difficulty, usedIdsRef.current),
  );
  const [input, setInput] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const roundStartRef = useRef(Date.now());

  const nextQuestion = useCallback(() => {
    const q = getQuestion(difficulty, usedIdsRef.current);
    if (q) usedIdsRef.current.add(q.id);
    setQuestion(q);
    setInput('');
    setHintsUsed(0);
    setRevealedIndices(new Set());
    setFeedback(null);
    roundStartRef.current = Date.now();
  }, [difficulty]);

  useEffect(() => {
    usedIdsRef.current.clear();
    nextQuestion();
  }, [difficulty, nextQuestion]);

  const handleSubmit = useCallback(() => {
    if (feedback !== null || !question || input.trim().length === 0) return;

    const responseTime = Date.now() - roundStartRef.current;
    const penalizedTime = responseTime + hintsUsed * HINT_TIME_PENALTY_MS;
    const correct = checkAnswer(question.word, input, config.maxLevenshtein);

    setFeedback(correct ? 'correct' : 'wrong');
    onAnswer(correct, penalizedTime);

    setTimeout(() => nextQuestion(), correct ? 800 : 2000);
  }, [feedback, question, input, hintsUsed, config.maxLevenshtein, onAnswer, nextQuestion]);

  const handleHint = useCallback(() => {
    if (feedback !== null || !question) return;

    const idx = getRandomUnrevealedIndex(question.word, revealedIndices);
    if (idx === null) return;

    setRevealedIndices((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    setHintsUsed((h) => h + 1);
  }, [feedback, question, revealedIndices]);

  if (timeRemaining <= 0 || !question) return null;

  const wordLetterCount = question.word.replace(/[\s\-']/g, '').length;

  return (
    <div className="flex flex-col items-center justify-between h-full py-4">
      {/* Definition + hints area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5">
        <p className="text-base font-semibold text-center leading-relaxed max-w-sm">
          {question.definition}
        </p>

        {/* Word length indicator */}
        <span className="text-xs text-muted">
          {wordLetterCount} lettres
        </span>

        {/* Hint display — only visible after first hint */}
        {hintsUsed > 0 && (
          <div className="font-mono text-xl tracking-[0.25em] font-bold text-primary animate-fade-in-up">
            {buildHint(question.word, revealedIndices)}
          </div>
        )}

        {/* Hint button */}
        {feedback === null && (
          <button
            onClick={handleHint}
            disabled={isPaused}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
              bg-warning/10 text-warning border border-warning/20
              transition-all duration-150 touch-manipulation cursor-pointer
              hover:bg-warning/20 active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>💡</span>
            <span>Indice{hintsUsed > 0 ? ` (${hintsUsed})` : ''}</span>
          </button>
        )}

        {/* Feedback */}
        {feedback === 'correct' && (
          <div className="text-success font-bold text-lg animate-fade-in-up">
            Correct !
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="flex flex-col items-center gap-1 animate-fade-in-up">
            <span className="text-error font-bold text-lg">Raté !</span>
            <span className="text-sm text-muted">
              Le mot était : <strong className="text-foreground">{question.word}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Input area */}
      <TextInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={feedback !== null || isPaused}
        placeholder={`${wordLetterCount} lettres…`}
      />
    </div>
  );
}
