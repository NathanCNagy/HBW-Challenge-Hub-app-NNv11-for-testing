import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { AlertTriangle, Trash2, RotateCcw } from 'lucide-react';

interface HabitsManagerProps {
  activeGoal: Goal;
  setActiveGoal: (goal: Goal) => void;
  onResetQuiz: () => void;
  theme?: 'dark' | 'light';
}

export default function HabitsManager({ activeGoal, setActiveGoal, onResetQuiz, theme = 'light' }: HabitsManagerProps) {
  const isDark = theme === 'dark';
  // Store multiple chosen habits. Initially contains the onboarding-committed habit.
  const [chosenHabits, setChosenHabits] = useState<Goal[]>([activeGoal]);

  // Sync if activeGoal changes (e.g. from quiz or external reset)
  useEffect(() => {
    setChosenHabits(prev => {
      if (prev.some(g => g.id === activeGoal.id)) return prev;
      return [activeGoal, ...prev];
    });
  }, [activeGoal]);

  // Remove habit from wardrobe (ensure we keep at least one)
  const handleRemoveHabit = (id: string) => {
    if (chosenHabits.length <= 1) return;
    const filtered = chosenHabits.filter(g => g.id !== id);
    setChosenHabits(filtered);
    
    // If the active goal was the removed one, fallback to the first remaining one
    if (activeGoal.id === id) {
      setActiveGoal(filtered[0]);
    }
  };

  const handleMakeActive = (goal: Goal) => {
    setActiveGoal(goal);
  };

  return (
    <div className={`flex flex-col gap-4 w-full ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>
      {/* Currently Active & Selected Habits */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 ${
        isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h4 className={`text-xs font-sans font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>
              My Active Habits
            </h4>
            <span className="text-[10px] font-mono font-semibold text-[#0080FF] bg-[#0080FF]/10 px-2 py-0.5 rounded-full">
              The One Habit Rule
            </span>
          </div>
          <p className={`text-xs leading-relaxed font-sans flex items-center gap-1.5 ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
            <span className="text-sm shrink-0" role="img" aria-label="caution">⚠️</span>
            <span>Focusing on one habit at a time makes you 80% more likely to succeed.</span>
          </p>
        </div>
        
        <div className="space-y-2.5">
          {chosenHabits.map((habit) => {
            const isActive = activeGoal.id === habit.id;
            return (
              <div 
                key={habit.id}
                className={`p-3.5 rounded-[14px] border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all ${
                  isActive 
                    ? isDark 
                      ? 'bg-[#18181B] border-[#0080FF] shadow-xs' 
                      : 'bg-[#F5F5F7] border-[#0080FF] shadow-xs' 
                    : isDark 
                      ? 'bg-[#0A0A0C] border-[#1F1F24]' 
                      : 'bg-white border-[#E5E5EA]'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isDark ? 'text-[#98989D] bg-[#1F1F24]' : 'text-[#6C6C70] bg-[#E5E5EA]/50'
                    }`}>
                      {habit.category}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-mono font-bold text-[#0080FF] bg-[#0080FF]/10 px-2 py-0.5 rounded-full">
                        ● PRIMARY FOCUS
                      </span>
                    )}
                  </div>
                  <h5 className={`font-serif font-semibold text-sm leading-tight ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>{habit.title}</h5>
                </div>

                <div className={`flex gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 ${
                  isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
                }`}>
                  {!isActive && (
                    <button
                      onClick={() => handleMakeActive(habit)}
                      className="px-3 py-1.5 bg-[#0080FF] hover:bg-[#0066CC] text-white font-sans text-xs font-semibold rounded-full transition-colors cursor-pointer"
                    >
                      Make Focus
                    </button>
                  )}
                  {chosenHabits.length > 1 && (
                    <button
                      onClick={() => handleRemoveHabit(habit.id)}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isDark ? 'text-[#98989D] hover:text-red-400 hover:bg-red-950/40' : 'text-[#98989D] hover:text-red-600 hover:bg-red-50'
                      }`}
                      title="Remove habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning if multiple habits are added to wardrobe */}
        {chosenHabits.length > 1 && (
          <div className={`p-3 border rounded-[12px] flex items-center gap-2 ${
            isDark ? 'bg-amber-950/40 border-amber-800/60 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-xs leading-tight">
              Notice: You are tracking {chosenHabits.length} habits. We highly recommend focusing your energy on your <strong>primary</strong> habit today.
            </p>
          </div>
        )}

        {/* Option to redo the clinical quiz */}
        <div className={`border-t pt-3 mt-1.5 ${isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
          <button
            onClick={onResetQuiz}
            className={`w-full h-[44px] border font-sans text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isDark
                ? 'bg-[#18181B] hover:bg-[#27272A] text-white border-[#27272A]'
                : 'bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1C1C1E] border-[#E5E5EA]'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-[#0080FF]" />
            <span className="text-center">Redo Questions to Change Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
