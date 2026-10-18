/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle, Check, Calendar } from 'lucide-react';
import EcosystemVisualization from '../EcosystemVisualization';
import { Goal } from '../../types';

interface ProgressTabProps {
  activeGoal: Goal;
  streak: number;
  individualEnergy: number;
  setIndividualEnergy: React.Dispatch<React.SetStateAction<number>>;
  hasLoggedToday: boolean;
  onLogSuccess: () => void;
  onResetLog?: () => void;
  bubbles: Array<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean; taskId?: string }>;
  setBubbles: React.Dispatch<React.SetStateAction<Array<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean; taskId?: string }>>>;
  onPopCloud?: (taskId?: string) => void;
  checklist?: {
    habitDone: boolean;
    anchorDone: boolean;
    reflectDone: boolean;
  };
  onCheckItem?: (item: 'habitDone' | 'anchorDone' | 'reflectDone') => void;
  anchorHabit?: string;
  metrics?: {
    primaryBadge?: string;
    primaryValue: string;
    primaryLabel: string;
    secondaryBadge?: string;
    secondaryValue: string;
    secondaryLabel: string;
    targetTip: string;
  };
  theme: 'dark' | 'light';
}

export default function ProgressTab({
  activeGoal,
  streak,
  individualEnergy,
  setIndividualEnergy,
  hasLoggedToday,
  onLogSuccess,
  onResetLog,
  bubbles,
  setBubbles,
  onPopCloud,
  checklist,
  onCheckItem,
  anchorHabit,
  theme
}: ProgressTabProps) {
  const checklistState = checklist || {
    habitDone: false,
    anchorDone: false,
    reflectDone: false
  };

  const checkedCount = (checklistState.habitDone ? 1 : 0) + (checklistState.anchorDone ? 1 : 0) + (checklistState.reflectDone ? 1 : 0);
  const isWeekly = activeGoal.selectedOption?.scheduleText?.toLowerCase().includes('week') || activeGoal.title.toLowerCase().includes('weekly');

  return (
    <div className="flex flex-col gap-4 w-full">
      <EcosystemVisualization
        category={activeGoal.category}
        streak={streak}
        individualEnergy={individualEnergy}
        setIndividualEnergy={setIndividualEnergy}
        hasLoggedToday={hasLoggedToday}
        onLogToday={onLogSuccess}
        goalTitle={activeGoal.title}
        bubbles={bubbles}
        setBubbles={setBubbles}
        onPopCloud={onPopCloud}
        theme={theme}
        isWeekly={isWeekly}
      >
        {/* Habit Checklist Card - directly under the plant visual */}
        <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3.5 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
        }`}>
          <div className={`flex items-center justify-between border-b pb-2.5 gap-2 ${
            theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
          }`}>
            <h4 className={`text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
              theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
            }`}>
              <CheckCircle className="w-4 h-4 text-[#0080FF]" />
              {isWeekly ? 'Weekly Checklist' : 'Daily Checklist'}
            </h4>
            <span className={`text-[10px] font-sans text-right leading-tight ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
              {isWeekly ? 'Check off weekly habit tasks to unlock clouds' : 'Check off daily habit tasks to unlock clouds'}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Checklist Item 1: Core Habit Statement */}
            <button
              onClick={() => onCheckItem && onCheckItem('habitDone')}
              className={`flex items-start gap-3 text-left transition-colors p-2.5 rounded-xl cursor-pointer ${
                theme === 'dark' ? 'hover:bg-[#1A1A1E]' : 'hover:bg-[#F5F5F7]'
              }`}
            >
              <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                checklistState.habitDone 
                  ? 'bg-[#0080FF] border-[#0080FF] text-white' 
                  : theme === 'dark' ? 'border-[#3A3A3C] text-transparent' : 'border-[#D1D1D6] text-transparent'
              }`}>
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <span className={`font-semibold text-xs leading-snug block ${
                  checklistState.habitDone 
                    ? 'line-through text-[#8E8E93]' 
                    : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                }`}>
                  {activeGoal.actionCue || activeGoal.action}
                </span>
                <p className={`text-[11px] font-sans leading-tight ${
                  checklistState.habitDone
                    ? 'line-through text-[#8E8E93]'
                    : theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {isWeekly ? (activeGoal.selectedOption?.scheduleText || '1 meal per week') : 'Daily habit action'}
                </p>
              </div>
            </button>

            {/* Checklist Item 2: Schedule & Routine Anchor */}
            <button
              onClick={() => onCheckItem && onCheckItem('anchorDone')}
              className={`flex items-start gap-3 text-left transition-colors p-2.5 rounded-xl cursor-pointer ${
                theme === 'dark' ? 'hover:bg-[#1A1A1E]' : 'hover:bg-[#F5F5F7]'
              }`}
            >
              <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                checklistState.anchorDone 
                  ? 'bg-[#0080FF] border-[#0080FF] text-white' 
                  : theme === 'dark' ? 'border-[#3A3A3C] text-transparent' : 'border-[#D1D1D6] text-transparent'
              }`}>
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <span className={`font-semibold text-xs leading-snug block ${
                  checklistState.anchorDone 
                    ? 'line-through text-[#8E8E93]' 
                    : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                }`}>
                  {isWeekly
                    ? 'When preparing my weekly schedule, I set my habit routine'
                    : 'When starting my morning routine, I set my habit reminder'}
                </span>
                <p className={`text-[11px] font-sans leading-tight ${
                  checklistState.anchorDone
                    ? 'line-through text-[#8E8E93]'
                    : theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {isWeekly
                    ? 'Pair with Sunday planning or your weekly grocery run.'
                    : 'Connect to an existing routine like pouring morning coffee.'}
                </p>
              </div>
            </button>

            {/* Checklist Item 3: Reflection & Progress Check */}
            <button
              onClick={() => onCheckItem && onCheckItem('reflectDone')}
              className={`flex items-start gap-3 text-left transition-colors p-2.5 rounded-xl cursor-pointer ${
                theme === 'dark' ? 'hover:bg-[#1A1A1E]' : 'hover:bg-[#F5F5F7]'
              }`}
            >
              <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                checklistState.reflectDone 
                  ? 'bg-[#0080FF] border-[#0080FF] text-white' 
                  : theme === 'dark' ? 'border-[#3A3A3C] text-transparent' : 'border-[#D1D1D6] text-transparent'
              }`}>
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <span className={`font-semibold text-xs leading-snug block ${
                  checklistState.reflectDone 
                    ? 'line-through text-[#8E8E93]' 
                    : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                }`}>
                  {isWeekly
                    ? 'When I finish this week’s habit, I record my savings & impact'
                    : 'When I complete my habit, I celebrate my win & streak'}
                </span>
                <p className={`text-[11px] font-sans leading-tight ${
                  checklistState.reflectDone
                    ? 'line-through text-[#8E8E93]'
                    : theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {isWeekly
                    ? 'Notice personal budget savings and carbon reduction.'
                    : 'Take a quick moment to acknowledge your streak momentum.'}
                </p>
              </div>
            </button>
          </div>

          {/* Real-time Cloud Status & Undo Control */}
          {checkedCount > 0 ? (
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
              theme === 'dark' ? 'bg-[#18181B] border-[#2C2C2E]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">🌧️</span>
                <span className={`font-sans font-medium truncate ${theme === 'dark' ? 'text-[#E5E5EA]' : 'text-[#1C1C1E]'}`}>
                  {checkedCount} {checkedCount === 1 ? 'task' : 'tasks'} checked! Click the cloud above to water plant 💧
                </span>
              </div>
              {onResetLog && (
                <button
                  type="button"
                  onClick={onResetLog}
                  className={`text-[11px] font-sans font-semibold hover:underline cursor-pointer shrink-0 ml-2 ${
                    theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                  }`}
                  title="Made a mistake? Undo today's tasks and cloud progress"
                >
                  Made a mistake? Undo
                </button>
              )}
            </div>
          ) : (
            <div className={`py-2 px-3 rounded-xl text-center text-[11px] font-sans transition-colors ${
              theme === 'dark' ? 'text-[#8E8E93] bg-[#161618]' : 'text-[#6C6C70] bg-[#F5F5F7]'
            }`}>
              Check off any task above to unlock a cloud, then click the cloud to water your tree!
            </div>
          )}
        </div>
      </EcosystemVisualization>
    </div>
  );
}
