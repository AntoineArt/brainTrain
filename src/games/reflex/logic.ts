import { randomInt } from '@/lib/utils';

export type StimulusType = 'go' | 'nogo';

export interface Stimulus {
  type: StimulusType;
  delay: number;
}

export function generateStimulus(
  minDelay: number,
  maxDelay: number,
  noGoRatio: number,
): Stimulus {
  const isNoGo = Math.random() < noGoRatio;
  return {
    type: isNoGo ? 'nogo' : 'go',
    delay: randomInt(minDelay, maxDelay),
  };
}
