/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getGreenRecommendations } from './recommendationEngine';
import { QuizAnswers } from '../types';

export interface TestCase {
  name: string;
  answers: QuizAnswers;
  expectedCategory: string;
}

const TEST_CASES: TestCase[] = [
  {
    name: 'Environment focus for family age group',
    answers: {
      age: '35–44',
      gender: 'Female',
      categories: ['Environment'],
      currentHabitMilestone: 'Sometimes',
      timeCommitment: ['15 Minutes (Daily Routine)'],
      motivation: ['Reduce carbon footprint'],
      friction: ['Busy schedule'],
      livingArrangement: 'Living with family/children',
      primaryConstraint: ['Limited time']
    },
    expectedCategory: 'Environment'
  },
  {
    name: 'Well-Being focus for young professional',
    answers: {
      age: '25–34',
      gender: 'Non-binary',
      categories: ['Well-Being'],
      currentHabitMilestone: 'Sometimes',
      timeCommitment: ['15 Minutes (Daily Routine)'],
      motivation: ['Mental wellness'],
      friction: ['Screen time overload'],
      livingArrangement: 'Living alone',
      primaryConstraint: ['Screen fatigue']
    },
    expectedCategory: 'Well-Being'
  },
  {
    name: 'Compassion focus for student',
    answers: {
      age: '18–24',
      gender: 'Male',
      categories: ['Compassion'],
      currentHabitMilestone: 'Often',
      timeCommitment: ['15 Minutes (Daily Routine)'],
      motivation: ['Build community connection'],
      friction: ['None'],
      livingArrangement: 'Living with roommates',
      primaryConstraint: ['None']
    },
    expectedCategory: 'Compassion'
  },
  {
    name: 'Responsible AI for digital worker',
    answers: {
      age: '25–34',
      gender: 'Female',
      categories: ['Responsible AI'],
      currentHabitMilestone: 'Rarely',
      timeCommitment: ['15 Minutes (Daily Routine)'],
      motivation: ['Cognitive integrity and fact-checking'],
      friction: ['Information overload'],
      livingArrangement: 'Living alone',
      primaryConstraint: ['Busy workflow']
    },
    expectedCategory: 'Responsible AI'
  }
];

export function calculateMilestoneStage(completedTasks: number) {
  if (completedTasks >= 100) return 'Flourishing Grove';
  if (completedTasks >= 60) return 'Full Bloom';
  if (completedTasks >= 30) return 'Branching Canopy';
  if (completedTasks >= 15) return 'Sapling';
  if (completedTasks >= 7) return 'Seedling';
  if (completedTasks >= 3) return 'First Sprout';
  return 'Seed';
}

export function runRecommendationUnitTests() {
  console.log('=== STARTING HBW UNIT TEST SUITE ===');
  let passedCount = 0;
  let totalTests = 0;

  // 1. Recommendation Category Match Tests
  TEST_CASES.forEach((tc, idx) => {
    totalTests++;
    const { topGoal } = getGreenRecommendations(tc.answers);
    const passed = topGoal.category === tc.expectedCategory;
    
    if (passed) {
      console.log(`✅ [PASS] Rec Test #${idx + 1}: ${tc.name} -> Matched category: ${topGoal.category}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] Rec Test #${idx + 1}: ${tc.name} -> Expected ${tc.expectedCategory} but received ${topGoal.category}`);
    }
  });

  // 2. Unit Task & Milestone Progression Tests
  const milestoneTests = [
    { tasks: 0, expected: 'Seed' },
    { tasks: 2, expected: 'Seed' },
    { tasks: 3, expected: 'First Sprout' },
    { tasks: 6, expected: 'First Sprout' },
    { tasks: 7, expected: 'Seedling' },
    { tasks: 14, expected: 'Seedling' },
    { tasks: 15, expected: 'Sapling' },
    { tasks: 29, expected: 'Sapling' },
    { tasks: 30, expected: 'Branching Canopy' },
    { tasks: 59, expected: 'Branching Canopy' },
    { tasks: 60, expected: 'Full Bloom' },
    { tasks: 99, expected: 'Full Bloom' },
    { tasks: 100, expected: 'Flourishing Grove' },
    { tasks: 150, expected: 'Flourishing Grove' }
  ];

  milestoneTests.forEach((mt, idx) => {
    totalTests++;
    const stage = calculateMilestoneStage(mt.tasks);
    const passed = stage === mt.expected;
    if (passed) {
      console.log(`✅ [PASS] Milestone Test #${idx + 1}: ${mt.tasks} tasks -> Correct Stage: ${stage}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] Milestone Test #${idx + 1}: ${mt.tasks} tasks -> Expected ${mt.expected}, got ${stage}`);
    }
  });

  console.log(`=== TEST COMPLETE: Passed ${passedCount}/${totalTests} ===`);
  return {
    success: passedCount === totalTests,
    passedCount,
    totalCount: totalTests
  };
}
