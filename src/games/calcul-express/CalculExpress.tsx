'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DifficultyLevel } from '@/types';
import { NumericKeypad } from '@/components/game/NumericKeypad';
import { generateProblem, checkAnswer, type MathProblem } from './logic';

interface CalculExpressProps {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}

type Feedback = 'correct' | 'incorrect' | null;

export default function CalculExpress({
  difficulty,
  onAnswer,
  timeRemaining,
}: CalculExpressProps) {
  const [problem, setProblem] = useState<MathProblem>(() => generateProblem(difficulty));
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const questionStartRef = useRef(Date.now());

  const nextProblem = useCallback(() => {
    setProblem(generateProblem(difficulty));
    setInput('');
    setFeedback(null);
    questionStartRef.current = Date.now();
  }, [difficulty]);

  const handleSubmit = useCallback(() => {
    const userAnswer = parseInt(input, 10);
    if (isNaN(userAnswer)) return;

    const responseTime = Date.now() - questionStartRef.current;
    const correct = checkAnswer(problem, userAnswer);

    setFeedback(correct ? 'correct' : 'incorrect');
    onAnswer(correct, responseTime);

    setTimeout(() => {
      nextProblem();
    }, correct ? 300 : 800);
  }, [input, problem, onAnswer, nextProblem]);

  // Reset on difficulty change
  useEffect(() => {
    nextProblem();
  }, [difficulty, nextProblem]);

  if (timeRemaining <= 0) return null;

  return (
    <div className="flex flex-col h-full justify-between py-6">
      {/* Problem display */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div
          className={`
            text-4xl font-bold tabular-nums transition-colors duration-200 mb-2
            ${feedback === 'correct' ? 'text-success' : ''}
            ${feedback === 'incorrect' ? 'text-error' : ''}
          `}
        >
          {problem.display}
        </div>

        {feedback === 'incorrect' && (
          <div className="text-error text-lg mt-1">
            = {problem.answer}
          </div>
        )}
      </div>

      {/* Input */}
      <NumericKeypad
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
