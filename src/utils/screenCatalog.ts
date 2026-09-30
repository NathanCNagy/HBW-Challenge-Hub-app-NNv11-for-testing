/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Goal, QuizAnswers } from '../types';
import { TOP_IMPACT_GOALS } from '../data';

export interface AppScreenDefinition {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  fileName: string;
  description: string;
}

export const SAMPLE_ANSWERS: QuizAnswers = {
  age: '25–34',
  gender: 'Female',
  categories: ['Environment'],
  livingArrangement: 'Apartment',
  currentHabitLevel: 'Intermediate'
};

export const SAMPLE_GOAL: Goal = TOP_IMPACT_GOALS['Environment'];

export const REAL_APP_SCREENS: AppScreenDefinition[] = [
  {
    id: 'screen-auth',
    title: 'Authentication & Sign In',
    subtitle: 'Guest Mode & Secure Member Login',
    category: 'Auth',
    fileName: '01_auth_screen.png',
    description: 'Welcome screen featuring Guest instant access, Google One-Tap styling, and secure sign-in.'
  },
  {
    id: 'screen-onboarding-step1',
    title: 'Onboarding - Demographics',
    subtitle: 'Clinical Diagnostic Step 1 of 2',
    category: 'Assessment',
    fileName: '02_onboarding_demographics.png',
    description: 'Demographic baseline questionnaire for tailored behavioral calibration.'
  },
  {
    id: 'screen-onboarding-step2',
    title: 'Onboarding - Impact Pillar Selection',
    subtitle: 'Clinical Diagnostic Step 2 of 2',
    category: 'Assessment',
    fileName: '03_onboarding_pillars.png',
    description: 'Selection of core motivation across Compassion, Environment, AI Ethics, and Well-Being.'
  },
  {
    id: 'screen-recommendations',
    title: 'Recommended Habit Plan',
    subtitle: 'Top Pillar Action & Win-Win Impact',
    category: 'Recommendations',
    fileName: '04_recommended_habit_plan.png',
    description: 'Top-leverage 3-month pathway showing avoided driving miles, grocery savings, and flexible starter options.'
  },
  {
    id: 'screen-dashboard-home',
    title: 'Daily Action Dashboard',
    subtitle: 'Active Streak & Daily Habit Checklist',
    category: 'Daily Routine',
    fileName: '05_daily_action_dashboard.png',
    description: 'Primary daily check-in hub with 3-part micro checklist, 14-day streak, and smart anchor cues.'
  },
  {
    id: 'screen-ecosystem-tree',
    title: 'Living Ecosystem Visualizer',
    subtitle: 'Gamified Energy Bubbles & Forest',
    category: 'Gamification',
    fileName: '06_ecosystem_tree_visualizer.png',
    description: 'Gamified tree visualizer where earned habit bubbles nourish your forest and unlock certified real trees.'
  },
  {
    id: 'screen-habit-wardrobe',
    title: 'Habit Wardrobe & Catalog',
    subtitle: 'Multi-Pillar Evidence-Based Habits',
    category: 'Habit Catalog',
    fileName: '07_habit_wardrobe_catalog.png',
    description: 'Full scientific catalog across all 4 pillars with customizable schedules and impact ratings.'
  },
  {
    id: 'screen-smart-alerts',
    title: 'Smart Anchors & Behavioral Cues',
    subtitle: 'Contextual In-App Reminders & Tiny Habits',
    category: 'Behavioral Science',
    fileName: '08_smart_anchors_and_alerts.png',
    description: 'B.J. Fogg Tiny Habits cue builder attaching new habits to sensory triggers like morning coffee.'
  },
  {
    id: 'screen-community-feed',
    title: 'Peer Support Community',
    subtitle: 'Global Habit Channels & Discussions',
    category: 'Social Support',
    fileName: '09_peer_community_chat.png',
    description: 'Live peer discussion feed with category channels for sharing daily wins and mutual accountability.'
  },
  {
    id: 'screen-profile-pdf',
    title: 'Clinical Profile & 90-Day Plan',
    subtitle: 'Compliance Stats & PDF Action Plan',
    category: 'Profile & Export',
    fileName: '10_clinical_profile_and_pdf.png',
    description: 'Complete user demographic profile, compliance metrics, and printable 90-day behavioral action plan.'
  },
  {
    id: 'screen-smartwatch',
    title: 'Smartwatch Companion Simulator',
    subtitle: 'Wrist Check-in & Haptic Prompts',
    category: 'Wearables',
    fileName: '11_smartwatch_companion.png',
    description: 'Wearable Apple Watch & Wear OS companion interface for friction-free wrist habit logging.'
  }
];
