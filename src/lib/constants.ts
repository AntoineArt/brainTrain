import type { CognitiveSkill } from '@/types';

export const SKILL_LABELS: Record<CognitiveSkill, string> = {
  calcul: 'Calcul',
  memoire: 'Mémoire',
  logique: 'Logique',
  vitesse: 'Vitesse',
  langage: 'Langage',
  attention: 'Attention',
  culture: 'Culture G',
};

export const SKILL_COLORS: Record<CognitiveSkill, string> = {
  calcul: 'var(--skill-calcul)',
  memoire: 'var(--skill-memoire)',
  logique: 'var(--skill-logique)',
  vitesse: 'var(--skill-vitesse)',
  langage: 'var(--skill-langage)',
  attention: 'var(--skill-attention)',
  culture: 'var(--skill-culture)',
};

export const MAX_HISTORY_LENGTH = 100;
