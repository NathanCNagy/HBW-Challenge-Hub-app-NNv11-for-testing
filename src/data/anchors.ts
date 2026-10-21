/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnchorSuggestion, Category } from '../types';

export type { AnchorSuggestion };

export const ANCHOR_SUGGESTIONS: AnchorSuggestion[] = [
  // Environment (Plant-Protein Meal Swap)
  {
    id: 'env-sun-grocery',
    name: 'Sunday grocery run',
    shortLabel: 'Sunday groceries',
    defaultTime: '10:00',
    defaultDays: ['Sun'],
    category: 'Environment',
    isWeekly: true
  },
  {
    id: 'env-sun-prep',
    name: 'Sunday meal planning',
    shortLabel: 'Sunday meal prep',
    defaultTime: '18:00',
    defaultDays: ['Sun'],
    category: 'Environment',
    isWeekly: true
  },
  {
    id: 'env-wed-dinner',
    name: 'Wednesday dinner prep',
    shortLabel: 'Wed dinner',
    defaultTime: '17:30',
    defaultDays: ['Wed'],
    category: 'Environment',
    isWeekly: true
  },
  {
    id: 'env-fri-market',
    name: 'Friday farmers market',
    shortLabel: 'Friday market',
    defaultTime: '16:00',
    defaultDays: ['Fri'],
    category: 'Environment',
    isWeekly: true
  },
  {
    id: 'env-daily-coffee',
    name: 'morning coffee',
    shortLabel: 'Morning coffee',
    defaultTime: '08:00',
    defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    category: 'Environment',
    isWeekly: false
  },
  {
    id: 'env-daily-lunch',
    name: 'preparing lunch',
    shortLabel: 'Lunch prep',
    defaultTime: '12:00',
    defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    category: 'Environment',
    isWeekly: false
  },

  // Compassion (Weekly Kindness Circle)
  {
    id: 'comp-sun-call',
    name: 'Sunday family call',
    shortLabel: 'Sunday call',
    defaultTime: '14:00',
    defaultDays: ['Sun'],
    category: 'Compassion',
    isWeekly: true
  },
  {
    id: 'comp-mon-checkin',
    name: 'Monday team check-in',
    shortLabel: 'Monday check-in',
    defaultTime: '09:00',
    defaultDays: ['Mon'],
    category: 'Compassion',
    isWeekly: true
  },
  {
    id: 'comp-fri-wrapup',
    name: 'Friday appreciation wrap-up',
    shortLabel: 'Friday wrap-up',
    defaultTime: '15:00',
    defaultDays: ['Fri'],
    category: 'Compassion',
    isWeekly: true
  },
  {
    id: 'comp-wed-walk',
    name: 'Wednesday community walk',
    shortLabel: 'Wed walk',
    defaultTime: '17:30',
    defaultDays: ['Wed'],
    category: 'Compassion',
    isWeekly: true
  },
  {
    id: 'comp-daily-commute',
    name: 'morning commute',
    shortLabel: 'Morning commute',
    defaultTime: '08:30',
    defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    category: 'Compassion',
    isWeekly: false
  },

  // Well-Being (Digital Sunset / Sleep Routine)
  {
    id: 'well-sun-reset',
    name: 'Sunday evening reset',
    shortLabel: 'Sunday reset',
    defaultTime: '20:30',
    defaultDays: ['Sun'],
    category: 'Well-Being',
    isWeekly: true
  },
  {
    id: 'well-wed-winddown',
    name: 'mid-week wind-down',
    shortLabel: 'Wed wind-down',
    defaultTime: '21:00',
    defaultDays: ['Wed'],
    category: 'Well-Being',
    isWeekly: true
  },
  {
    id: 'well-fri-quiet',
    name: 'Friday night offline',
    shortLabel: 'Friday quiet',
    defaultTime: '21:30',
    defaultDays: ['Fri'],
    category: 'Well-Being',
    isWeekly: true
  },
  {
    id: 'well-daily-dim',
    name: 'dimming the lights',
    shortLabel: 'Dimming lights',
    defaultTime: '21:00',
    defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    category: 'Well-Being',
    isWeekly: false
  },

  // Responsible AI (Prompt Verification & Mindful Work)
  {
    id: 'ai-mon-kickoff',
    name: 'Monday sprint kickoff',
    shortLabel: 'Monday kickoff',
    defaultTime: '09:30',
    defaultDays: ['Mon'],
    category: 'Responsible AI',
    isWeekly: true
  },
  {
    id: 'ai-wed-review',
    name: 'Wednesday workflow review',
    shortLabel: 'Wed review',
    defaultTime: '14:00',
    defaultDays: ['Wed'],
    category: 'Responsible AI',
    isWeekly: true
  },
  {
    id: 'ai-fri-wrapup',
    name: 'Friday task retrospective',
    shortLabel: 'Friday retro',
    defaultTime: '16:30',
    defaultDays: ['Fri'],
    category: 'Responsible AI',
    isWeekly: true
  },
  {
    id: 'ai-daily-start',
    name: 'opening my work tools',
    shortLabel: 'Opening work tools',
    defaultTime: '09:00',
    defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    category: 'Responsible AI',
    isWeekly: false
  }
];

export function getAnchorSuggestions(category: Category, isWeekly: boolean): AnchorSuggestion[] {
  const filtered = ANCHOR_SUGGESTIONS.filter(
    (item) => item.category === category && (isWeekly ? item.isWeekly : !item.isWeekly)
  );
  if (filtered.length > 0) return filtered;
  return ANCHOR_SUGGESTIONS.filter((item) => item.category === category);
}
