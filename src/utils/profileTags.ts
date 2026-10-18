/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizAnswers } from '../types';

/**
 * Returns the demographic age bracket for a given age.
 * Calibrated to the HBW demographic cohorts (< 30 yrs, 30–49 yrs, 50+ yrs).
 */
export function getAgeRange(ageInput?: string | number): string {
  const parsedAge = ageInput ? parseInt(String(ageInput), 10) : 28;
  const age = isNaN(parsedAge) ? 28 : parsedAge;
  if (age < 30) return '< 30 yrs';
  if (age < 50) return '30–49 yrs';
  return '50+ yrs';
}

/**
 * Dynamically replaces template tags like [Age], [Age Range], [Gender], [Living Arrangement]
 * with user profile metadata, ensuring personalized behavioral copy without hardcoding.
 */
export function resolveProfileTags(
  template: string,
  answers?: Partial<QuizAnswers> | Record<string, any>
): string {
  if (!template) return '';

  const parsedAge = answers?.age ? parseInt(String(answers.age), 10) : 28;
  const age = isNaN(parsedAge) ? 28 : parsedAge;
  const ageRange = getAgeRange(age);
  const gender = answers?.gender && answers.gender !== 'Prefer not to say' 
    ? answers.gender 
    : 'You';
  const livingArrangement = answers?.livingArrangement || 'Living with family/children';

  return template
    .replace(/\[Age\]/g, String(age))
    .replace(/\[age\]/g, String(age))
    .replace(/\[Age Range\]/g, ageRange)
    .replace(/\[age_range\]/g, ageRange)
    .replace(/\[AgeRange\]/g, ageRange)
    .replace(/\[Gender\]/g, gender)
    .replace(/\[gender\]/g, gender)
    .replace(/\[Living Arrangement\]/g, livingArrangement)
    .replace(/\[living_arrangement\]/g, livingArrangement)
    .replace(/\[LivingArrangement\]/g, livingArrangement);
}
