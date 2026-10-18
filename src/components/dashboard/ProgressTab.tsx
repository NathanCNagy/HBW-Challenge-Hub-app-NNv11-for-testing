/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle, Check, Calendar, Sparkles } from 'lucide-react';
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

          {/* Action Cue (If-Then Trigger) Callout Banner */}
          {activeGoal.actionCue && (
            <div className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-colors ${
              theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F2F8FF] border-[#BDE0FE]'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-[#0080FF] shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0080FF] block">
                  {isWeekly ? 'Weekly Action Cue (If-Then Trigger)' : 'Daily Action Cue (If-Then Trigger)'}
                </span>
                <p className={`text-xs font-sans italic leading-snug ${
                  theme === 'dark' ? 'text-[#E5E5EA]' : 'text-[#1C1C1E]'
                }`}>
                  &ldquo;{activeGoal.actionCue}&rdquo;
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* Checklist Item 1: Core Habit with If-Then Trigger */}
            <button
              onClick={() => onCheckItem && onCheckItem('habitDone')}
              className={`flex items-start gap-3 text-left transition-colors p-2 rounded-xl cursor-pointer ${
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
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className={`font-semibold text-xs leading-tight block ${
                    checklistState.habitDone 
                      ? 'line-through text-[#8E8E93]' 
                      : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                  }`}>
                    {isWeekly 
                      ? `Task 1: Execute weekly habit (${activeGoal.selectedOption?.scheduleText || '1 meal/week'})` 
                      : 'Task 1: Complete daily habit'}
                  </span>
                  <span></span>
                </div>

                <p className={`text-[11px] font-sans italic leading-tight ${
                  checklistState.habitDone
                    ? 'line-through text-[#8E8E93]'
                    : theme === 'dark' ? 'text-[#3892FF]' : 'text-[#0066CC]'
                }`}>
                  Trigger: &ldquo;{activeGoal.actionCue || activeGoal.action}&rdquo;
                </p>

                <span className={`text-[11px] block leading-normal ${
                  checklistState.habitDone
                    ? 'line-through text-[#8E8E93]'
                    : theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>{activeGoal.action}</span>
              </div>
            </button>

            {/* Checklist Item 2: Habit Anchor Routine */}
            <button
              onClick={() => onCheckItem && onCheckItem('anchorDone')}
              className={`flex items-start gap-3 text-left transition-colors p-2 rounded-xl cursor-pointer ${
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
              <div className="space-y-1 flex-1 min-w-0">
                <span className={`font-semibold text-xs leading-tight block ${
                  checklistState.anchorDone 
                    ? 'line-through text-[#8E8E93]' 
                    : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                }`}>
                  {isWeekly ? 'Task 2: Anchor to weekly routine' : 'Task 2: Pair with daily anchor cue'}
                </span>
                <p className={`text-[11px] font-sans italic leading-tight ${
                  checklistState.anchorDone
                    ? 'line-through text-[#8E8E93]'
                    : theme === 'dark' ? 'text-[#E5E5EA]' : 'text-[#2C2C2E]'
                }`}>
                  {isWeekly
                    ? `“WHEN planning my weekly groceries or dining out, THEN I will prepare my plant-based meal.”`
                    : `“WHEN I begin ${anchorHabit || 'pouring my morning coffee'}, THEN I start my habit cue.”`}
                </p>
                <span className={`text-[11px] block leading-normal ${
                  checklistState.anchorDone
                    ? 'line-through text-[#8E8E93]'
                    : theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {isWeekly
                    ? `Anchored to: ${anchorHabit || 'Sunday grocery run or meal prep'}`
                    : `Anchored to: ${anchorHabit || 'Morning coffee / evening dock'}`}
                </span>
              </div>
            </button>

            {/* Checklist Item 3: Reflection & Impact Check */}
            <button
              onClick={() => onCheckItem && onCheckItem('reflectDone')}
              className={`flex items-start gap-3 text-left transition-colors p-2 rounded-xl cursor-pointer ${
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
              <div className="space-y-1 flex-1 min-w-0">
                <span className={`font-semibold text-xs leading-tight block ${
                  checklistState.reflectDone 
                    ? 'line-through text-[#8E8E93]' 
                    : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                }`}>
                  {isWeekly ? 'Task 3: Weekly reflection & win check' : 'Task 3: Quick 10-second reflection'}
                </span>
                <p className={`text-[11px] font-sans italic leading-tight ${
                  checklistState.reflectDone
                    ? 'line-through text-[#8E8E93]'
                    : theme === 'dark' ? 'text-[#E5E5EA]' : 'text-[#2C2C2E]'
                }`}>
                  {isWeekly
                    ? `“WHEN I finish this meal swap, THEN I log my grocery savings and carbon reduction.”`
                    : `“WHEN I complete my habit, THEN I celebrate my streak and release a cloud.”`}
                </p>
                <span className={`text-[11px] block leading-normal ${
                  checklistState.reflectDone
                    ? 'line-through text-[#8E8E93]'
                    : theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {isWeekly
                    ? 'Acknowledge your personal grocery savings and environmental carbon reduction for the week.'
                    : 'Take 10 seconds to acknowledge your win and streak momentum.'}
                </span>
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
