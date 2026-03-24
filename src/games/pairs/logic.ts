import { shuffle } from '@/lib/utils';
import { CARD_EMOJIS } from './config';

export interface PairCard {
  id: number;
  emoji: string;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export function generateCards(pairsCount: number): PairCard[] {
  const selectedEmojis = shuffle(CARD_EMOJIS).slice(0, pairsCount);

  const cards: PairCard[] = [];
  selectedEmojis.forEach((emoji, pairId) => {
    cards.push({ id: pairId * 2, emoji, pairId, isFlipped: false, isMatched: false });
    cards.push({ id: pairId * 2 + 1, emoji, pairId, isFlipped: false, isMatched: false });
  });

  return shuffle(cards);
}
