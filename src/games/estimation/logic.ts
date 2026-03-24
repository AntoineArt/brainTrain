import type { DifficultyLevel } from '@/types';
import { randomInt, randomPick } from '@/lib/utils';
import { LEVEL_CONFIG, type StimulusType } from './config';

export interface DotPosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // px
  color: string;
}

export interface DotStimulus {
  type: 'dots';
  dots: DotPosition[];
  answer: number;
}

export interface PercentageStimulus {
  type: 'percentage';
  fillPercent: number; // the actual percentage filled
  answer: number;
}

export interface ArithmeticStimulus {
  type: 'arithmetic';
  expression: string;
  answer: number;
}

export type Stimulus = DotStimulus | PercentageStimulus | ArithmeticStimulus;

const DOT_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

function generateDots(min: number, max: number): DotStimulus {
  const count = randomInt(min, max);
  const dots: DotPosition[] = [];

  for (let i = 0; i < count; i++) {
    dots.push({
      x: randomInt(5, 95),
      y: randomInt(5, 95),
      size: randomInt(8, 14),
      color: randomPick(DOT_COLORS),
    });
  }

  return { type: 'dots', dots, answer: count };
}

function generatePercentage(): PercentageStimulus {
  // Generate a percentage that's a multiple of 5 for cleaner visuals
  const fillPercent = randomInt(2, 18) * 5; // 10% to 90%
  return { type: 'percentage', fillPercent, answer: fillPercent };
}

type ArithOp = '+' | '−' | '×';

function generateArithmetic(min: number, max: number): ArithmeticStimulus {
  const op: ArithOp = randomPick(['+', '−', '×']);

  let a: number;
  let b: number;
  let answer: number;

  switch (op) {
    case '+': {
      // Target answer in [min, max]
      answer = randomInt(min, max);
      a = randomInt(Math.floor(answer * 0.3), Math.floor(answer * 0.7));
      b = answer - a;
      break;
    }
    case '−': {
      answer = randomInt(Math.floor(min * 0.3), Math.floor(max * 0.7));
      b = randomInt(Math.floor(min * 0.2), Math.floor(max * 0.4));
      a = answer + b;
      break;
    }
    case '×': {
      // Keep factors reasonable for mental estimation
      const sqrtMax = Math.floor(Math.sqrt(max));
      const sqrtMin = Math.max(2, Math.floor(Math.sqrt(min)));
      a = randomInt(sqrtMin, sqrtMax);
      b = randomInt(sqrtMin, sqrtMax);
      answer = a * b;
      break;
    }
    default: {
      a = randomInt(min, max);
      b = randomInt(1, 10);
      answer = a + b;
    }
  }

  const expression = `${a} ${op} ${b}`;
  return { type: 'arithmetic', expression, answer };
}

export function generateStimulus(difficulty: DifficultyLevel): Stimulus {
  const config = LEVEL_CONFIG[difficulty];
  const type = randomPick(config.stimulusTypes);

  switch (type) {
    case 'dots':
      return generateDots(config.dotsMin, config.dotsMax);
    case 'percentage':
      return generatePercentage();
    case 'arithmetic':
      return generateArithmetic(config.arithmeticMin, config.arithmeticMax);
    default:
      return generateDots(config.dotsMin, config.dotsMax);
  }
}

export type EstimateResult = 'correct' | 'close' | 'wrong';

const CLOSE_TIME_PENALTY_MS = 2000;

export function checkEstimate(
  actual: number,
  estimate: number,
  correctThreshold: number,
  closeThreshold: number,
): EstimateResult {
  if (actual === 0) {
    return estimate === 0 ? 'correct' : 'wrong';
  }

  const errorPercent = Math.abs(estimate - actual) / Math.abs(actual) * 100;

  if (errorPercent <= correctThreshold) return 'correct';
  if (errorPercent <= closeThreshold) return 'close';
  return 'wrong';
}

/** Extra ms to add to response time for "close" answers */
export function getTimePenalty(result: EstimateResult): number {
  return result === 'close' ? CLOSE_TIME_PENALTY_MS : 0;
}

export function getErrorPercent(actual: number, estimate: number): number {
  if (actual === 0) return estimate === 0 ? 0 : 100;
  return Math.round(Math.abs(estimate - actual) / Math.abs(actual) * 100);
}

export function getStimulusType(stimulus: Stimulus): StimulusType {
  return stimulus.type;
}
