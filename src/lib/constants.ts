import type { CognitiveSkill } from '@/types';

export const SKILL_LABELS: Record<CognitiveSkill, string> = {
  math: 'Calcul',
  memory: 'Mémoire',
  logic: 'Logique',
  speed: 'Vitesse',
  language: 'Langage',
  attention: 'Attention',
  culture: 'Culture G',
};

export const SKILL_COLORS: Record<CognitiveSkill, string> = {
  math: 'var(--skill-math)',
  memory: 'var(--skill-memory)',
  logic: 'var(--skill-logic)',
  speed: 'var(--skill-speed)',
  language: 'var(--skill-language)',
  attention: 'var(--skill-attention)',
  culture: 'var(--skill-culture)',
};

export const MAX_HISTORY_LENGTH = 100;
