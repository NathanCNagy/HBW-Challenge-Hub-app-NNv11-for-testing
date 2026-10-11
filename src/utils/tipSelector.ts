import { Category, QuizAnswers } from '../types';
import { HABIT_TIPS, HabitTip } from '../data/tips';

/**
 * Returns a stable tip for the current day for the specified category and demographics.
 * Supports manual cycling via tipIndexOffset (e.g. Shuffle / Next Tip button).
 */
export function getDailyHabitTip(
  category: Category,
  answers?: QuizAnswers,
  offsetIndex: number = 0
): HabitTip {
  // 1. Filter by category
  let matchedTips = HABIT_TIPS.filter((t) => t.category === category);

  // If none found for category, fallback to all tips
  if (matchedTips.length === 0) {
    matchedTips = HABIT_TIPS;
  }

  // 2. Score tips based on demographic proximity
  const parsedAge = answers?.age ? parseInt(answers.age, 10) : 28;
  const validAge = isNaN(parsedAge) ? 28 : parsedAge;

  // Rank tips matching the user's age bracket first
  const scoredTips = [...matchedTips].sort((a, b) => {
    const aMatchesAge = a.targetAges && validAge >= a.targetAges.min && validAge <= a.targetAges.max;
    const bMatchesAge = b.targetAges && validAge >= b.targetAges.min && validAge <= b.targetAges.max;

    if (aMatchesAge && !bMatchesAge) return -1;
    if (!aMatchesAge && bMatchesAge) return 1;
    return 0;
  });

  // 3. Create a stable daily seed based on the calendar day string
  const today = new Date();
  const dayOfYear = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(today.getFullYear(), 0, 0)) /
      (24 * 60 * 60 * 1000)
  );

  // 4. Calculate deterministic tip index + offset
  const tipIndex = (dayOfYear + offsetIndex) % scoredTips.length;
  const normalizedIndex = tipIndex < 0 ? tipIndex + scoredTips.length : tipIndex;

  return scoredTips[normalizedIndex];
}
