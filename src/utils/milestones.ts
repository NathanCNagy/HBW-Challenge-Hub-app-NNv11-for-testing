/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccomplishedMilestone } from '../types';

export const APP_DOWNLOAD_URL = 'https://habitsforabetterworld.org/app';

export type CelebrationMotif =
  | 'sprouts'
  | 'butterflies'
  | 'fireflies'
  | 'breeze'
  | 'petals'
  | 'aurora';

export interface MilestoneStageConfig {
  targetTasks: number;
  prevTasks: number;
  label: string;
  stageName: string;
  badgeEmoji: string;
  celebrationHeadline: string;
  unlockedMessage: string;
  motif: CelebrationMotif;
  accentHex: string;
  bannerGradient: string;
  glowGradient: string;
  particleColors: string[];
}

export const MILESTONE_STAGES: MilestoneStageConfig[] = [
  {
    targetTasks: 3,
    prevTasks: 0,
    label: '3 Growth First Sprout',
    stageName: 'First Sprout',
    badgeEmoji: '🌱',
    celebrationHeadline: 'First Sprout Emerged',
    unlockedMessage: 'Sunbeams awaken your seedling—secondary leaves have unfurled!',
    motif: 'sprouts',
    accentHex: '#34C759',
    bannerGradient: 'from-[#22C55E] via-[#34C759] to-[#16A34A]',
    glowGradient: 'radial-gradient(circle at 50% 62%, rgba(52, 199, 89, 0.36) 0%, rgba(134, 239, 172, 0.16) 45%, transparent 75%)',
    particleColors: ['#34C759', '#4ADE80', '#86EFAC', '#BBF7D0']
  },
  {
    targetTasks: 7,
    prevTasks: 3,
    label: '7 Growth Seedling',
    stageName: 'Seedling',
    badgeEmoji: '🦋',
    celebrationHeadline: 'Seedling Awakening',
    unlockedMessage: 'Morning mist shimmers across lush new foliage & fluttering wings!',
    motif: 'butterflies',
    accentHex: '#0080FF',
    bannerGradient: 'from-[#0080FF] via-[#3892FF] to-[#0EA5E9]',
    glowGradient: 'radial-gradient(circle at 50% 55%, rgba(0, 128, 255, 0.36) 0%, rgba(56, 189, 248, 0.18) 50%, transparent 78%)',
    particleColors: ['#0080FF', '#38BDF8', '#7DD3FC', '#E0F2FE']
  },
  {
    targetTasks: 15,
    prevTasks: 7,
    label: '15 Growth Sapling',
    stageName: 'Sapling',
    badgeEmoji: '✨',
    celebrationHeadline: 'Golden Sapling Glow',
    unlockedMessage: 'Woody boughs rise as warm fireflies illuminate your growing sapling!',
    motif: 'fireflies',
    accentHex: '#FF9500',
    bannerGradient: 'from-[#F59E0B] via-[#FF9500] to-[#EA580C]',
    glowGradient: 'radial-gradient(circle at 50% 52%, rgba(255, 149, 0, 0.38) 0%, rgba(250, 204, 21, 0.2) 48%, transparent 78%)',
    particleColors: ['#FFD700', '#FF9500', '#FDE047', '#FDBA74']
  },
  {
    targetTasks: 30,
    prevTasks: 15,
    label: '30 Growth Canopy',
    stageName: 'Branching Canopy',
    badgeEmoji: '🍃',
    celebrationHeadline: 'Canopy Breeze Surge',
    unlockedMessage: 'An emerald breeze sweeps wide across your branching forest canopy!',
    motif: 'breeze',
    accentHex: '#10B981',
    bannerGradient: 'from-[#0D9488] via-[#10B981] to-[#059669]',
    glowGradient: 'radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.4) 0%, rgba(45, 212, 191, 0.22) 52%, transparent 82%)',
    particleColors: ['#10B981', '#2DD4BF', '#34D399', '#A7F3D0']
  },
  {
    targetTasks: 60,
    prevTasks: 30,
    label: '60 Growth Full Bloom',
    stageName: 'Full Bloom',
    badgeEmoji: '🌸',
    celebrationHeadline: 'Blossom Petal Cascade',
    unlockedMessage: 'Radiant blossoms burst open and petals cascade across your canopy!',
    motif: 'petals',
    accentHex: '#EC4899',
    bannerGradient: 'from-[#EC4899] via-[#F472B6] to-[#D946EF]',
    glowGradient: 'radial-gradient(circle at 50% 42%, rgba(236, 72, 153, 0.38) 0%, rgba(251, 191, 36, 0.2) 50%, transparent 82%)',
    particleColors: ['#F472B6', '#EC4899', '#FBCFE8', '#FFD700']
  },
  {
    targetTasks: 100,
    prevTasks: 60,
    label: '100 Growth Mastery',
    stageName: 'Flourishing Grove',
    badgeEmoji: '🌟',
    celebrationHeadline: 'Aurora Mastery Crown',
    unlockedMessage: 'A golden aurora crowns your Flourishing Grove—true habit mastery!',
    motif: 'aurora',
    accentHex: '#EAB308',
    bannerGradient: 'from-[#0080FF] via-[#34C759] to-[#F59E0B]',
    glowGradient: 'radial-gradient(circle at 50% 40%, rgba(255, 215, 0, 0.42) 0%, rgba(0, 128, 255, 0.24) 45%, rgba(52, 199, 89, 0.16) 70%, transparent 88%)',
    particleColors: ['#FFD700', '#0080FF', '#34C759', '#F472B6', '#38BDF8']
  }
];

export const MASTERY_OVERFLOW_STAGE: MilestoneStageConfig = {
  ...MILESTONE_STAGES[MILESTONE_STAGES.length - 1],
  prevTasks: 100,
  label: '100+ Growth Mastery',
  stageName: 'Flourishing Grove (Mastery)'
};

export function getMilestoneStageConfig(targetTasks: number): MilestoneStageConfig {
  return (
    MILESTONE_STAGES.find((m) => m.targetTasks === targetTasks) ||
    MILESTONE_STAGES[0]
  );
}

export function buildMilestoneShareText(
  milestone: AccomplishedMilestone,
  isWeekly: boolean
): string {
  const stage = getMilestoneStageConfig(milestone.targetTasks);
  const streakUnit = isWeekly
    ? milestone.streakAtUnlock === 1
      ? 'week'
      : 'weeks'
    : milestone.streakAtUnlock === 1
      ? 'day'
      : 'days';
  const streakPhrase =
    milestone.streakAtUnlock > 0
      ? ` on a ${milestone.streakAtUnlock}-${streakUnit} consistency streak`
      : '';

  return `${stage.badgeEmoji} I just unlocked "${milestone.stageName}" (${milestone.targetTasks} Growth)${streakPhrase} with my "${milestone.goalTitle}" habit in Habits for a Better World!\n\nBuild small habits that help you and the planet. Download the app: ${APP_DOWNLOAD_URL}`;
}
