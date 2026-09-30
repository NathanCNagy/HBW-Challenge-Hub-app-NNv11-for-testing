/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Goal, QuizAnswers } from '../types';
import { 
  getCommittedGoal, 
  setCommittedGoal as saveCommittedGoal, 
  getQuizAnswers, 
  setQuizAnswers as saveQuizAnswers,
  storage 
} from '../services/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { UnitSystem, getInitialUnitSystem } from '../utils/units';

export interface UserProfile {
  displayName: string;
  email: string;
}

export interface HabitContextValue {
  // User & Auth
  user: UserProfile | null;
  isGuest: boolean;
  isAuthLoading: boolean;
  loginUser: (displayName: string, email: string) => void;
  continueAsGuest: () => void;
  signOutUser: () => Promise<void>;
  goToAuth: () => void;

  // Active Goal & Onboarding
  committedGoal: Goal | null;
  commitGoal: (goal: Goal) => void;
  resetGoal: () => void;
  answers: QuizAnswers;
  updateAnswers: React.Dispatch<React.SetStateAction<QuizAnswers>>;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: (newTheme?: 'dark' | 'light') => void;

  // Unit System (Imperial / US vs Metric / International)
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  isUS: boolean;

  // Routine & Metrics
  streak: number;
  incrementStreak: () => void;
  individualEnergy: number;
  addIndividualEnergy: (points: number) => void;
}

const DEFAULT_QUIZ_ANSWERS: QuizAnswers = {
  age: '28',
  gender: 'Male',
  categories: ['Environment'],
  currentHabitLevel: 'Rarely / Never',
  timeCommitment: ['5 Minutes (Microchange)'],
  motivation: ['Personal growth & optimization'],
  friction: ['Forgetting & failing to keep track'],
  livingArrangement: 'Living with family/children',
  primaryConstraint: ['Extremely busy schedule & limited energy']
};

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  // User auth state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = storage.getString('hbw_mock_logged_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading user profile:', e);
      }
    }
    return null;
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return storage.getBoolean('hbw_is_guest');
  });

  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Goal & Answers state
  const [committedGoal, setCommittedGoalState] = useState<Goal | null>(() => getCommittedGoal());
  const [answers, setAnswersState] = useState<QuizAnswers>(() => getQuizAnswers(DEFAULT_QUIZ_ANSWERS));

  // Streak & Gamified Energy
  const [streak, setStreak] = useState<number>(3);
  const [individualEnergy, setIndividualEnergy] = useState<number>(45);

  // Global Theme
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = storage.getString('hbw_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Unit System (auto-detected for US vs Rest of World with local persistence)
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => getInitialUnitSystem());

  const setUnitSystem = (newSystem: UnitSystem) => {
    setUnitSystemState(newSystem);
    storage.set('hbw_unit_system', newSystem);
  };

  const isUS = unitSystem === 'imperial';

  useEffect(() => {
    // Safety timeout in case Firebase Auth listener is delayed in preview iframes
    const safetyTimer = setTimeout(() => {
      setIsAuthLoading(false);
    }, 1200);

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        clearTimeout(safetyTimer);
        if (firebaseUser) {
          const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
          const email = firebaseUser.email || '';
          const userProfile = { displayName, email };
          setUser(userProfile);
          storage.set('hbw_mock_logged_user', JSON.stringify(userProfile));
          storage.set('hbw_has_logged_in', 'true');
        }
        setIsAuthLoading(false);
      },
      (error) => {
        console.warn('Auth state observation notice:', error);
        clearTimeout(safetyTimer);
        setIsAuthLoading(false);
      }
    );

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const loginUser = (displayName: string, email: string) => {
    const profile = { displayName, email };
    setUser(profile);
    storage.set('hbw_mock_logged_user', JSON.stringify(profile));
    storage.set('hbw_has_logged_in', 'true');
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    storage.set('hbw_is_guest', 'true');
  };

  const goToAuth = () => {
    setIsGuest(false);
    storage.delete('hbw_is_guest');
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Error signing out:', e);
    }
    setUser(null);
    setIsGuest(false);
    storage.delete('hbw_mock_logged_user');
    storage.delete('hbw_is_guest');
    setCommittedGoalState(null);
    saveCommittedGoal(null);
  };

  const commitGoal = (goal: Goal) => {
    setCommittedGoalState(goal);
    saveCommittedGoal(goal);
    storage.set('hbw_has_logged_in', 'true');
  };

  const resetGoal = () => {
    setCommittedGoalState(null);
    saveCommittedGoal(null);
  };

  const updateAnswers: React.Dispatch<React.SetStateAction<QuizAnswers>> = (newAnswers) => {
    setAnswersState(prev => {
      const resolved = typeof newAnswers === 'function' ? (newAnswers as (prev: QuizAnswers) => QuizAnswers)(prev) : newAnswers;
      saveQuizAnswers(resolved);
      return resolved;
    });
  };

  const toggleTheme = (newTheme?: 'dark' | 'light') => {
    const selected = newTheme || (theme === 'dark' ? 'light' : 'dark');
    setTheme(selected);
    storage.set('hbw_theme', selected);
  };

  const incrementStreak = () => setStreak(s => s + 1);
  const addIndividualEnergy = (points: number) => setIndividualEnergy(e => e + points);

  return (
    <HabitContext.Provider
      value={{
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
        toggleTheme,
        unitSystem,
        setUnitSystem,
        isUS,
        streak,
        incrementStreak,
        individualEnergy,
        addIndividualEnergy
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit(): HabitContextValue {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
}
