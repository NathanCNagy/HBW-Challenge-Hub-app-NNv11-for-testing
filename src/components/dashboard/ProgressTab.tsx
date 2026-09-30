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
  bubbles: Array<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean }>;
  setBubbles: React.Dispatch<React.SetStateAction<Array<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean }>>>;
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
  bubbles,
  setBubbles,
  checklist,
  onCheckItem,
  anchorHabit,
  theme
}: ProgressTabProps) {
  const checklistState = checklist || {
    habitDone: hasLoggedToday,
    anchorDone: hasLoggedToday,
    reflectDone: hasLoggedToday
  };

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
        theme={theme}
      >
        {/* Daily Checklist Card - directly under the plant visual */}
        <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3.5 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
        }`}>
          <div className={`flex items-center justify-between border-b pb-2.5 ${
            theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
          }`}>
            <h4 className={`text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
            }`}>
              <CheckCircle className="w-4 h-4 text-[#0080FF]" />
              Daily Checklist
            </h4>
            <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#8E8E93]'}`}>
              Tap to check
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Checklist Item 1 */}
            <button
              onClick={() => onCheckItem && onCheckItem('habitDone')}
              className={`flex items-start gap-3 text-left transition-colors p-1.5 rounded-xl cursor-pointer ${
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
              <div className="space-y-0.5">
                <span className={`font-semibold text-xs leading-tight block ${
                  checklistState.habitDone 
                    ? 'line-through text-[#8E8E93]' 
                    : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                }`}>
                  Complete habit
                </span>
                <span className={`text-[11px] block leading-normal ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>{activeGoal.action}</span>
              </div>
            </button>

            {/* Checklist Item 2 */}
            <button
              onClick={() => onCheckItem && onCheckItem('anchorDone')}
              className={`flex items-start gap-3 text-left transition-colors p-1.5 rounded-xl cursor-pointer ${
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
              <div className="space-y-0.5">
                <span className={`font-semibold text-xs leading-tight block ${
                  checklistState.anchorDone 
                    ? 'line-through text-[#8E8E93]' 
                    : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                }`}>
                  Pair with daily cue
                </span>
                <span className={`text-[11px] block leading-normal ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>Done right after {anchorHabit || 'your daily routine'}.</span>
              </div>
            </button>

            {/* Checklist Item 3 */}
            <button
              onClick={() => onCheckItem && onCheckItem('reflectDone')}
              className={`flex items-start gap-3 text-left transition-colors p-1.5 rounded-xl cursor-pointer ${
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
              <div className="space-y-0.5">
                <span className={`font-semibold text-xs leading-tight block ${
                  checklistState.reflectDone 
                    ? 'line-through text-[#8E8E93]' 
                    : theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                }`}>
                  Pause and reflect
                </span>
                <span className={`text-[11px] block leading-normal ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>Take 10 seconds to acknowledge your win.</span>
              </div>
            </button>
          </div>

          {/* Log Button */}
          <button
            onClick={onLogSuccess}
            disabled={hasLoggedToday}
            className={`h-[50px] w-full rounded-full font-sans font-semibold text-[14px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              hasLoggedToday
                ? theme === 'dark' ? 'bg-[#1F1F24] text-[#8E8E93] cursor-not-allowed' : 'bg-[#E5E5EA] text-[#8E8E93] cursor-not-allowed'
                : 'bg-[#0080FF] hover:bg-[#0066CC] text-white active:scale-[0.99]'
            }`}
          >
            {hasLoggedToday ? (
              <>
                <CheckCircle className="w-4 h-4 text-[#8E8E93]" />
                <span>Logged for Today</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Log Today's Habit</span>
              </>
            )}
          </button>
        </div>
      </EcosystemVisualization>
    </div>
  );
}
