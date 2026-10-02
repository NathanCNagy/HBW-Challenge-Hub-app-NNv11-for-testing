/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Goal } from './types';
import OnboardingQuiz from './components/OnboardingQuiz';
import GoalRecommendations from './components/GoalRecommendations';
import DashboardSimulation from './components/DashboardSimulation';
import DeviceSimulator from './components/DeviceSimulator';
import { getRecommendedGoals } from './data';
import AuthScreen from './components/AuthScreen';
import { HabitProvider, useHabit } from './context/HabitContext';

function AppContent() {
  const {
    user,
    isGuest,
    isAuthLoading,
    loginUser,
    continueAsGuest,
    signOutUser,
    goToAuth,
    committedGoal,
    commitGoal,
    resetGoal,
    answers,
    updateAnswers,
    theme,
    toggleTheme
  } = useHabit();

  const [currentPage, setCurrentPage] = useState<'quiz' | 'recommendations' | 'dashboard'>(() => {
    return committedGoal ? 'dashboard' : 'quiz';
  });

  // Recommendation outputs
  const [topGoal, setTopGoal] = useState<Goal | null>(null);
  const [alternatives, setAlternatives] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasAI, setHasAI] = useState<boolean>(false);

  // Submit onboarding quiz to acquire dynamic recommendations offline with zero token cost
  const handleSubmitQuiz = async () => {
    setIsLoading(true);

    // Simulate a brief scientific evaluation step for premium UX feedback
    setTimeout(() => {
      try {
        const matched = getRecommendedGoals(answers);
        setTopGoal(matched.topGoal);
        setAlternatives(matched.alternatives);
        setHasAI(false); // Runs completely local & offline!
      } catch (err) {
        console.error('Error generating offline goals:', err);
      } finally {
        setIsLoading(false);
        setCurrentPage('recommendations');
      }
    }, 900);
  };

  const handleCommitGoal = (goal: Goal) => {
    commitGoal(goal);
    setCurrentPage('dashboard');
  };

  const handleResetQuiz = () => {
    setTopGoal(null);
    setAlternatives([]);
    resetGoal();
    setCurrentPage('quiz');
  };

  const handleSignOut = async () => {
    setCurrentPage('quiz');
    setTopGoal(null);
    setAlternatives([]);
    await signOutUser();
  };

  // Safe fallback to guarantee no blank screen renders
  const effectivePage = (currentPage === 'dashboard' && !committedGoal)
    ? 'quiz'
    : (currentPage === 'recommendations' && !topGoal)
    ? 'quiz'
    : currentPage;

  const isDarkCanvas = theme === 'dark';

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-[#F5F5F7] font-sans flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#98989D] uppercase tracking-widest">
            Synchronizing Ecosystem...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#1C1C1E] font-sans py-2 sm:py-6 px-2 sm:px-4 flex flex-col justify-start items-center">
      {/* Simulation Wrapper Frame */}
      <DeviceSimulator theme={theme}>
        <div className={`w-full h-full flex flex-col justify-between transition-colors duration-300 ${
          isDarkCanvas ? 'bg-[#0A0A0C] text-[#F5F5F7]' : 'bg-[#F5F5F7] text-[#1C1C1E]'
        }`}>
          <main className="flex-1 w-full h-full flex flex-col justify-start">
            {/* Show login/signup screen if no user and not choosing Guest mode */}
            {!user && !isGuest ? (
              <AuthScreen 
                onLoginSuccess={loginUser}
                onContinueAsGuest={continueAsGuest}
                onBack={committedGoal ? continueAsGuest : undefined}
                theme={theme}
              />
            ) : (
              <>
                {effectivePage === 'quiz' && (
                  <OnboardingQuiz
                    answers={answers}
                    setAnswers={updateAnswers}
                    onSubmit={handleSubmitQuiz}
                    isLoading={isLoading}
                    skipDemographics={false}
                    theme={theme}
                    onBack={!user ? goToAuth : handleSignOut}
                  />
                )}

                {effectivePage === 'recommendations' && topGoal && (
                  <GoalRecommendations
                    answers={answers}
                    topGoal={topGoal}
                    alternatives={alternatives}
                    onCommit={handleCommitGoal}
                    onReset={handleResetQuiz}
                    hasAI={hasAI}
                    theme={theme}
                  />
                )}

                {effectivePage === 'dashboard' && committedGoal && (
                  <DashboardSimulation
                    goal={committedGoal}
                    onReset={handleResetQuiz}
                    answers={answers}
                    onUpdateAnswers={updateAnswers}
                    user={user}
                    onSignOut={handleSignOut}
                    onOpenAuth={goToAuth}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </DeviceSimulator>
    </div>
  );
}

export default function App() {
  return (
    <HabitProvider>
      <AppContent />
    </HabitProvider>
  );
}
