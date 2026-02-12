const BASE_POINTS = 100;
const MAX_SPEED_MULTIPLIER = 2.0;
const SPEED_WINDOW_MS = 5000; // réponse en moins de 5s = bonus max

export function calculatePoints(
  correct: boolean,
  responseTimeMs: number,
  streak: number,
): number {
  if (!correct) return 0;

  const speedFactor = Math.max(0, 1 - responseTimeMs / SPEED_WINDOW_MS);
  const speedMultiplier = 1 + speedFactor * (MAX_SPEED_MULTIPLIER - 1);

  const streakBonus = Math.min(streak, 10) * 10;

  return Math.round(BASE_POINTS * speedMultiplier + streakBonus);
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}
