/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Environment' | 'Well-Being' | 'Compassion' | 'Responsible AI';

export interface QuizAnswers {
  age: string;
  gender: string;
  categories: Category[];
  selectedImplementationOptionId?: string;
  livingArrangement?: string;
  primaryConstraint?: string[];
  currentHabitMilestone?: string;
  timeCommitment?: string[];
  motivation?: string[];
  friction?: string[];
}

export interface ImpactMetrics {
  primaryLabel: string;
  primaryValue: number;
  primaryUnit: string;
  primaryBadge?: string; // e.g., 'Planet Impact' or 'Community Impact'
  secondaryLabel: string;
  secondaryValue: number;
  secondaryUnit: string;
  secondaryBadge?: string; // e.g., 'Personal Win' or 'Personal Health'
  tertiaryLabel?: string;
  tertiaryValue?: number;
  tertiaryUnit?: string;
}

export interface ImplementationOption {
  id: string;
  title: string;
  description: string;
  impactMultiplier: number;
  foggAbilityRating: string;
  scheduleText: string;
  metrics: ImpactMetrics;
}

export interface Goal {
  id: string;
  title: string;
  action: string;
  impact: string;
  category: Category;
  badgeLabel?: string;
  defaultOptionId: string;
  implementationOptions: ImplementationOption[];
  selectedOption?: ImplementationOption;
  demographicInsight?: string;
  actionCue?: string;
  dualWinNarrative?: string;
}

export interface HabitTrigger {
  id: string;
  name: string;
  time: string;
  days: string[];
  enabled: boolean;
}

export interface RecommendationResponse {
  topGoal: Goal;
  alternatives: Goal[];
}

export interface AnchorSuggestion {
  id: string;
  name: string;
  shortLabel: string;
  defaultTime: string;
  defaultDays: string[];
  category: Category;
  isWeekly?: boolean;
}

export interface CloudBubble {
  id: number;
  cx: number;
  cy: number;
  value: number;
  type: string;
  label: string;
  isNew?: boolean;
  taskId?: string;
  isStreakBonus?: boolean;
  streakCount?: number;
}

export interface AccomplishedMilestone {
  targetTasks: number;
  stageName: string;
  streakAtUnlock: number;
  goalTitle: string;
  category: Category;
  unlockedAt: string;
}

export interface WeeklyNoveltyTwist {
  id: string;
  category: Category;
  defaultWeek: number;
  title: string;
  twistPrompt: string;
  benefitNote: string;
}

export interface WeeklyTimelineState {
  startDateIso: string;
  manualWeekOverride: number | null;
  orderedTwistIds: string[];
}
