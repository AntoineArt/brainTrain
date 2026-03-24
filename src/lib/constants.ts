import type { CognitiveSkill } from '@/types';
import type { TranslationKey } from '@/locales';

export const SKILL_LABEL_KEYS: Record<CognitiveSkill, TranslationKey> = {
  math: 'skill.math',
  memory: 'skill.memory',
  logic: 'skill.logic',
  speed: 'skill.speed',
  language: 'skill.language',
  attention: 'skill.attention',
  culture: 'skill.culture',
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
