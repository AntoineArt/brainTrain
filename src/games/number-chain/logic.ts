import type { DifficultyLevel } from '@/types';
import { randomInt, randomPick } from '@/lib/utils';
import { LEVEL_CONFIG, type ChainOperator } from './config';

export interface ChainOperation {
  operator: ChainOperator;
  operand: number;
  display: string;
}

export interface Chain {
  startValue: number;
  operations: ChainOperation[];
  answer: number;
}

const MIN_INTERMEDIATE = -999;
const MAX_INTERMEDIATE = 999;

/**
 * Generate a valid chain of mental-math operations.
 * Constraints:
 * - All intermediate results are integers in [−999, 999]
 * - Division only when result is integer
 * - Multiplication limited to small factors
 */
export function generateChain(difficulty: DifficultyLevel): Chain {
  const config = LEVEL_CONFIG[difficulty];
  const startValue = randomInt(config.startMin, config.startMax);
  const operations: ChainOperation[] = [];
  let current = startValue;

  for (let i = 0; i < config.opCount; i++) {
    // Try up to 20 times to find a valid operation
    let op: ChainOperation | null = null;

    for (let attempt = 0; attempt < 20; attempt++) {
      const operator = randomPick(config.operators);
      const candidate = buildOperation(operator, current, config.maxAddend, config.maxMultFactor, config.maxDivisor);

      if (candidate !== null) {
        const result = apply(current, candidate);
        if (result >= MIN_INTERMEDIATE && result <= MAX_INTERMEDIATE) {
          op = candidate;
          break;
        }
      }
    }

    // Fallback: simple +1 if we can't find anything
    if (op === null) {
      op = { operator: '+', operand: 1, display: '+ 1' };
    }

    operations.push(op);
    current = apply(current, op);
  }

  return { startValue, operations, answer: current };
}

function buildOperation(
  operator: ChainOperator,
  current: number,
  maxAddend: number,
  maxMultFactor: number,
  maxDivisor: number,
): ChainOperation | null {
  switch (operator) {
    case '+': {
      const operand = randomInt(1, maxAddend);
      return { operator: '+', operand, display: `+ ${operand}` };
    }
    case '−': {
      const operand = randomInt(1, maxAddend);
      return { operator: '−', operand, display: `− ${operand}` };
    }
    case '×': {
      const factor = randomInt(2, maxMultFactor);
      return { operator: '×', operand: factor, display: `× ${factor}` };
    }
    case '÷': {
      // Only valid if current is divisible and result is reasonable
      if (current === 0) return null;
      const absCurrent = Math.abs(current);
      // Find valid divisors
      const validDivisors: number[] = [];
      for (let d = 2; d <= Math.min(maxDivisor, absCurrent); d++) {
        if (current % d === 0) {
          validDivisors.push(d);
        }
      }
      if (validDivisors.length === 0) return null;
      const divisor = randomPick(validDivisors);
      return { operator: '÷', operand: divisor, display: `÷ ${divisor}` };
    }
    default:
      return null;
  }
}

function apply(current: number, op: ChainOperation): number {
  switch (op.operator) {
    case '+': return current + op.operand;
    case '−': return current - op.operand;
    case '×': return current * op.operand;
    case '÷': return current / op.operand;
    default: return current;
  }
}

export function checkAnswer(chain: Chain, userAnswer: number): boolean {
  return chain.answer === userAnswer;
}
