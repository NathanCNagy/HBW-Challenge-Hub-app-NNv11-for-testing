/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, Check, Calendar, Bell } from 'lucide-react';
import EcosystemVisualization from '../EcosystemVisualization';
import { Goal } from '../../types';
import { getAnchorSuggestions, AnchorSuggestion } from '../../data/anchors';
import { formatTimeDisplay, formatDaysSummary } from '../alerts/TriggerItem';

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
  onSelectAnchor?: (anchor: string, defaultTime?: string, defaultDays?: string[]) => void;
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
  onSelectAnchor,
  theme
}: ProgressTabProps) {
  const checklistState = checklist || {
    habitDone: false,
    anchorDone: false,
    reflectDone: false
  };

  const checkedCount = (checklistState.habitDone ? 1 : 0) + (checklistState.anchorDone ? 1 : 0) + (checklistState.reflectDone ? 1 : 0);
  const isWeekly = activeGoal.selectedOption?.scheduleText?.toLowerCase().includes('week') || activeGoal.title.toLowerCase().includes('weekly');
  const suggestions = getAnchorSuggestions(activeGoal.category, isWeekly);

  // Initialize selected anchor from prop or category default
  const [selectedAnchor, setSelectedAnchor] = useState<string>(() => {
    return anchorHabit || suggestions[0]?.name || (isWeekly ? 'Sunday grocery run' : 'morning coffee');
  });

  const [activeTime, setActiveTime] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('hbw_habit_triggers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].time) {
          return parsed[0].time;
        }
      }
    } catch {
      // ignore
    }
    return suggestions[0]?.defaultTime || (isWeekly ? '10:00' : '08:00');
  });

  const [activeDays, setActiveDays] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hbw_habit_triggers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0].days)) {
          return parsed[0].days;
        }
      }
    } catch {
      // ignore
    }
    return suggestions[0]?.defaultDays || (isWeekly ? ['Sun'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  const [showAdjust, setShowAdjust] = useState<boolean>(false);

  // Synchronize when anchorHabit changes from parent
  useEffect(() => {
    if (anchorHabit && anchorHabit !== selectedAnchor) {
      setSelectedAnchor(anchorHabit);
    }
  }, [anchorHabit]);

  const saveUpdatedSchedule = (anchor: string, time: string, days: string[]) => {
    try {
      localStorage.setItem('hbw_anchor_habit', anchor);
      const existing = JSON.parse(localStorage.getItem('hbw_habit_triggers') || '[]');
      const updated = [
        {
          id: 'primary-anchor-trigger',
          name: anchor,
          time,
          days,
          enabled: true
        },
        ...(Array.isArray(existing) ? existing.filter((t: any) => t.id !== 'primary-anchor-trigger' && t.name !== anchor) : [])
      ];
      localStorage.setItem('hbw_habit_triggers', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleChooseAnchor = (suggestion: AnchorSuggestion) => {
    setSelectedAnchor(suggestion.name);
    setActiveTime(suggestion.defaultTime);
    setActiveDays(suggestion.defaultDays);
    saveUpdatedSchedule(suggestion.name, suggestion.defaultTime, suggestion.defaultDays);
    if (onSelectAnchor) {
      onSelectAnchor(suggestion.name, suggestion.defaultTime, suggestion.defaultDays);
    }
  };

  const handleToggleDay = (day: string) => {
    let updatedDays: string[];
    if (activeDays.includes(day)) {
      if (activeDays.length === 1) return; // Retain at least one day
      updatedDays = activeDays.filter((d) => d !== day);
    } else {
      updatedDays = [...activeDays, day];
    }
    setActiveDays(updatedDays);
    saveUpdatedSchedule(selectedAnchor, activeTime, updatedDays);
  };

  const handleTimeChange = (newTime: string) => {
    setActiveTime(newTime);
    saveUpdatedSchedule(selectedAnchor, newTime, activeDays);
  };

  // Capitalize first letter helper
  const formattedAnchor = selectedAnchor.charAt(0).toUpperCase() + selectedAnchor.slice(1);
  const resolvedTask2Title = activeGoal.category === 'Responsible AI'
    ? (isWeekly
        ? `When opening my AI work tool, I will structure my AI prompt using my own brain first ("Draft First, Refine Second")`
        : `When opening my AI work tool, I will structure my AI prompt using my own brain first ("Draft First, Refine Second")`)
    : (isWeekly
        ? `When on my ${selectedAnchor.toLowerCase()}, I lock in my habit routine`
        : `When enjoying my ${selectedAnchor.toLowerCase()}, I initiate my daily habit`);

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

            {/* Checklist Item 2: Routine Anchor with 1-Tap Chips */}
            <div className={`flex flex-col gap-2 p-2.5 rounded-xl transition-colors ${
              theme === 'dark' ? 'hover:bg-[#1A1A1E]' : 'hover:bg-[#F5F5F7]'
            }`}>
              <div className="flex items-start gap-3 text-left">
                <button
                  type="button"
                  onClick={() => onCheckItem && onCheckItem('anchorDone')}
                  className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                    checklistState.anchorDone 
                      ? 'bg-[#0080FF] border-[#0080FF] text-white' 
                      : theme === 'dark' ? 'border-[#3A3A3C] text-transparent hover:border-[#0080FF]' : 'border-[#D1D1D6] text-transparent hover:border-[#0080FF]'
                  }`}
                  aria-label="Toggle habit routine"
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </button>

                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className={`font-semibold text-xs leading-snug block ${
                    checklistState.anchorDone 
                      ? 'line-through text-[#8E8E93]' 
                      : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                  }`}>
                    {resolvedTask2Title}
                  </span>
                  <p className={`text-[11px] font-sans leading-tight ${
                    checklistState.anchorDone
                      ? 'line-through text-[#8E8E93]'
                      : theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                  }`}>
                    {isWeekly ? 'Tap anchor below to pair with weekly routine' : 'Tap anchor below to pair with daily habit'}
                  </p>
                </div>
              </div>

              {/* 1-Tap Anchor Suggestion Chips */}
              <div className="pl-[34px] pt-0.5">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {suggestions.map((sug) => {
                    const isSelected = selectedAnchor.toLowerCase() === sug.name.toLowerCase();
                    return (
                      <button
                        key={sug.id}
                        type="button"
                        onClick={() => handleChooseAnchor(sug)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-sans font-medium whitespace-nowrap transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#0080FF]/15 border-[#0080FF] text-[#0080FF] shadow-xs'
                            : theme === 'dark'
                              ? 'bg-[#121214] border-[#2C2C2E] text-[#98989D] hover:text-white hover:border-[#3A3A3C]'
                              : 'bg-white border-[#E5E5EA] text-[#6C6C70] hover:text-[#1C1C1E] hover:border-[#D1D1D6]'
                        }`}
                      >
                        {sug.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

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
                  {checkedCount} {isWeekly ? (checkedCount === 1 ? 'weekly task' : 'weekly tasks') : (checkedCount === 1 ? 'task' : 'tasks')} checked! Click {checkedCount === 1 ? 'the cloud' : 'the clouds'} above to water plant 💧
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
              {isWeekly ? 'Check off any weekly task above to unlock a cloud, then click the cloud to water your plant!' : 'Check off any task above to unlock a cloud, then click the cloud to water your plant!'}
            </div>
          )}
        </div>
      </EcosystemVisualization>
    </div>
  );
}
