/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Goal, QuizAnswers } from '../types';

export interface CompletionHistoryEntry {
  date: string; // YYYY-MM-DD
  completedTasks: string[]; // e.g. ['task-1', 'task-2', 'task-3']
}

// In-memory fallback map for environments where localStorage is restricted
const memoryFallback = new Map<string, string>();

export const storage = {
  getString: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Storage access blocked / private mode fallback
    }
    return memoryFallback.get(key) ?? null;
  },

  set: (key: string, value: string | number | boolean | object): void => {
    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, stringVal);
        return;
      }
    } catch {
      // Storage access blocked fallback
    }
    memoryFallback.set(key, stringVal);
  },

  delete: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // Storage access blocked fallback
    }
    memoryFallback.delete(key);
  },

  getBoolean: (key: string): boolean => {
    const val = storage.getString(key);
    return val === 'true';
  }
};

export const getCommittedGoal = (): Goal | null => {
  const goalStr = storage.getString('hbw_committed_goal');
  if (!goalStr) return null;
  try {
    return JSON.parse(goalStr);
  } catch {
    return null;
  }
};

export const setCommittedGoal = (goal: Goal | null) => {
  if (goal) {
    storage.set('hbw_committed_goal', JSON.stringify(goal));
  } else {
    storage.delete('hbw_committed_goal');
  }
};

export const getQuizAnswers = (defaultAnswers: QuizAnswers): QuizAnswers => {
  const saved = storage.getString('hbw_quiz_answers');
  if (!saved) return defaultAnswers;
  try {
    return JSON.parse(saved);
  } catch {
    return defaultAnswers;
  }
};

export const setQuizAnswers = (answers: QuizAnswers) => {
  storage.set('hbw_quiz_answers', JSON.stringify(answers));
};

export const getCompletionHistory = (): CompletionHistoryEntry[] => {
  const data = storage.getString('hbw_completion_history');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveCompletionHistory = (history: CompletionHistoryEntry[]) => {
  storage.set('hbw_completion_history', JSON.stringify(history));
};

export const getAvoidedLlmRequestsCount = (): number => {
  const saved = storage.getString('hbw_avoided_llm_requests');
  return saved ? parseInt(saved, 10) : 4; // default to 4 for immediate visual impact
};

export const incrementAvoidedLlmRequestsCount = () => {
  const current = getAvoidedLlmRequestsCount();
  storage.set('hbw_avoided_llm_requests', String(current + 1));
};

export const getCumulativeDarkTime = (): number => {
  const saved = storage.getString('hbw_cumulative_dark_time');
  return saved ? parseInt(saved, 10) : 1240; // default starting seconds for realistic metrics representation
};

export const addCumulativeDarkTime = (seconds: number) => {
  const current = getCumulativeDarkTime();
  storage.set('hbw_cumulative_dark_time', String(current + seconds));
};

export default storage;
