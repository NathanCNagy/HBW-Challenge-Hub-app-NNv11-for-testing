/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Goal, QuizAnswers } from '../types';
import { SAMPLE_ANSWERS, SAMPLE_GOAL } from '../utils/screenCatalog';
import AuthScreen from './AuthScreen';
import OnboardingQuiz from './OnboardingQuiz';
import GoalRecommendations from './GoalRecommendations';
import HomeTab from './dashboard/HomeTab';
import ProgressTab from './dashboard/ProgressTab';
import ProfileTab from './dashboard/ProfileTab';
import HabitsManager from './HabitsManager';
import SmartAlerts from './SmartAlerts';
import CommunityChat from './CommunityChat';
import SmartwatchSimulator from './SmartwatchSimulator';
import { useHabit } from '../context/HabitContext';

interface RealScreenRendererProps {
  screenId: string;
  theme: 'dark' | 'light';
}

export default function RealScreenRenderer({ screenId, theme }: RealScreenRendererProps) {
  const { isUS } = useHabit();
  // Local state for interactive / render fidelity
  const [answers, setAnswers] = useState<QuizAnswers>(SAMPLE_ANSWERS);
  const [activeGoal, setActiveGoal] = useState<Goal>(SAMPLE_GOAL);
  const [streak] = useState<number>(14);
  const [individualEnergy, setIndividualEnergy] = useState<number>(250);
  const [hasLoggedToday] = useState<boolean>(false);
  const [anchorHabit, setAnchorHabit] = useState<string>('pouring my morning coffee');
  const [, setHasConfiguredNotifications] = useState<boolean>(true);
  const [checklist, setChecklist] = useState({
    habitDone: false,
    anchorDone: true,
    reflectDone: false
  });
  const [bubbles, setBubbles] = useState([
    { id: 1, cx: 30, cy: 35, value: 50, type: 'Environment', label: '+50 Energy' },
    { id: 2, cx: 65, cy: 25, value: 50, type: 'Environment', label: '+50 Energy' },
    { id: 3, cx: 48, cy: 55, value: 50, type: 'Environment', label: '+50 Energy' }
  ]);
  const [dismissedBubbleAlert, setDismissedBubbleAlert] = useState(false);

  const sampleUser = {
    displayName: 'Nathan Edwards',
    email: 'nathan@habitsforabetterworld.org',
    uid: 'sample-user-id'
  };

  const sampleMetrics = {
    primaryBadge: 'Planet Win',
    primaryValue: isUS ? '71.4 mi' : '114.9 km',
    primaryLabel: 'Emissions Avoided',
    secondaryBadge: 'Personal Win',
    secondaryValue: '$32.60',
    secondaryLabel: 'Grocery Money Saved',
    targetTip: 'Plant proteins have 10x-50x lower emissions than industrial livestock.'
  };

  switch (screenId) {
    case 'screen-auth':
      return (
        <AuthScreen
          onLoginSuccess={() => {}}
          onContinueAsGuest={() => {}}
          theme={theme}
        />
      );

    case 'screen-onboarding-step1':
      return (
        <OnboardingQuiz
          answers={answers}
          setAnswers={setAnswers}
          onSubmit={() => {}}
          isLoading={false}
          skipDemographics={false}
          theme={theme}
        />
      );

    case 'screen-onboarding-step2':
      return (
        <OnboardingQuiz
          answers={answers}
          setAnswers={setAnswers}
          onSubmit={() => {}}
          isLoading={false}
          skipDemographics={true}
          theme={theme}
        />
      );

    case 'screen-recommendations':
      return (
        <GoalRecommendations
          answers={answers}
          topGoal={SAMPLE_GOAL}
          alternatives={[]}
          onCommit={() => {}}
          onReset={() => {}}
          hasAI={false}
          theme={theme}
        />
      );

    case 'screen-dashboard-home':
      return (
        <HomeTab
          activeGoal={activeGoal}
          checklist={checklist}
          onCheckItem={(item) => setChecklist(c => ({ ...c, [item]: !c[item] }))}
          hasLoggedToday={hasLoggedToday}
          onLogSuccess={() => {}}
          bubbles={bubbles}
          dismissedBubbleAlert={dismissedBubbleAlert}
          setDismissedBubbleAlert={setDismissedBubbleAlert}
          motivationalQuote="Small daily actions compound into monumental planetary transformation."
          hasConfiguredNotifications={true}
          anchorHabit={anchorHabit}
          setAnchorHabit={setAnchorHabit}
          onQuickEnableReminders={() => {}}
          onNavigateToTab={() => {}}
          theme={theme}
        />
      );

    case 'screen-ecosystem-tree':
      return (
        <ProgressTab
          activeGoal={activeGoal}
          streak={streak}
          individualEnergy={individualEnergy}
          setIndividualEnergy={setIndividualEnergy}
          hasLoggedToday={hasLoggedToday}
          onLogSuccess={() => {}}
          bubbles={bubbles}
          setBubbles={setBubbles}
          checklist={checklist}
          onCheckItem={(item) => setChecklist(c => ({ ...c, [item]: !c[item] }))}
          anchorHabit={anchorHabit}
          metrics={sampleMetrics}
          theme={theme}
        />
      );

    case 'screen-habit-wardrobe':
      return (
        <HabitsManager
          activeGoal={activeGoal}
          setActiveGoal={setActiveGoal}
          onResetQuiz={() => {}}
          theme={theme}
        />
      );

    case 'screen-smart-alerts':
      return (
        <SmartAlerts
          goalTitle={activeGoal.title}
          defaultAnchor="pouring my morning coffee"
          theme={theme}
          onSaveConfigured={() => {}}
        />
      );

    case 'screen-community-feed':
      return (
        <CommunityChat
          category="Environment"
          goalTitle={activeGoal.title}
          theme={theme}
        />
      );

    case 'screen-profile-pdf':
      return (
        <ProfileTab
          user={sampleUser}
          answers={answers}
          onUpdateAnswers={() => {}}
          onSignOut={() => {}}
          onOpenAuth={() => {}}
          theme={theme}
          onToggleTheme={() => {}}
          activeGoal={activeGoal}
          setActiveGoal={setActiveGoal}
          onReset={() => {}}
          anchorHabit={anchorHabit}
          setAnchorHabit={setAnchorHabit}
          setHasConfiguredNotifications={setHasConfiguredNotifications}
          onDownloadPDF={() => {}}
        />
      );

    case 'screen-smartwatch':
      return <SmartwatchSimulator />;

    default:
      return null;
  }
}
