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
      currentHabitLevel: 'Sometimes',
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
      currentHabitLevel: 'Sometimes',
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
      currentHabitLevel: 'Often',
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
      currentHabitLevel: 'Rarely',
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
  if (completedTasks >= 100) return 'Full Bloom';
  if (completedTasks >= 50) return 'Canopy';
  if (completedTasks >= 25) return 'Sapling';
  return 'Sprout';
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
    { tasks: 0, expected: 'Sprout' },
    { tasks: 10, expected: 'Sprout' },
    { tasks: 24, expected: 'Sprout' },
    { tasks: 25, expected: 'Sapling' },
    { tasks: 49, expected: 'Sapling' },
    { tasks: 50, expected: 'Canopy' },
    { tasks: 99, expected: 'Canopy' },
    { tasks: 100, expected: 'Full Bloom' },
    { tasks: 150, expected: 'Full Bloom' }
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
