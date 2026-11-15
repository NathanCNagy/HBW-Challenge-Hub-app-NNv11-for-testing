/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  LogOut, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  AlertCircle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Goal, QuizAnswers } from '../../types';
import SmartAlerts from '../SmartAlerts';
import HabitsManager from '../HabitsManager';
import { useHabit } from '../../context/HabitContext';
import { buildRoutineOption, EffortTier, CATEGORY_EFFORT_CONFIGS, getDemographicResonance } from '../../data';
import { formatImpactMetric } from '../../utils/units';
import { resolveProfileTags } from '../../utils/profileTags';

interface ProfileTabProps {
  user: any;
  answers: QuizAnswers;
  onUpdateAnswers?: (newAnswers: QuizAnswers) => void;
  onSignOut?: () => void;
  onOpenAuth?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
  activeGoal: Goal;
  setActiveGoal: (goal: Goal) => void;
  onReset: () => void;
  anchorHabit: string;
  setAnchorHabit: (anchor: string) => void;
  setHasConfiguredNotifications: (configured: boolean) => void;
  onDownloadPDF?: () => void;
}

export default function ProfileTab({
  user,
  answers,
  onUpdateAnswers,
  onSignOut,
  onOpenAuth,
  theme,
  onToggleTheme,
  activeGoal,
  setActiveGoal,
  onReset,
  anchorHabit,
  setAnchorHabit,
  setHasConfiguredNotifications,
  onDownloadPDF
}: ProfileTabProps) {
  const { unitSystem, setUnitSystem, isUS, commitGoal } = useHabit();
  const isWeekly = activeGoal.selectedOption?.scheduleText?.toLowerCase().includes('week') || activeGoal.title.toLowerCase().includes('weekly');
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState<boolean>(false);
  const [editAge, setEditAge] = useState<string>(answers.age);
  const [editGender, setEditGender] = useState<string>(answers.gender);
  const [confirmSignOut, setConfirmSignOut] = useState<boolean>(false);

  const handleStartEdit = () => {
    setEditAge(answers.age);
    setEditGender(answers.gender);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (onUpdateAnswers) {
      onUpdateAnswers({
        ...answers,
        age: editAge || answers.age,
        gender: editGender || answers.gender,
      });
    }
    setIsEditingProfile(false);
  };

  const deriveEffortFromGoal = (goal: Goal): EffortTier => {
    const opt = goal.selectedOption;
    if (!opt) return 'more';
    if (
      opt.id.includes('-less-') ||
      opt.foggAbilityRating?.toLowerCase().includes('less effort') ||
      opt.id.includes('-half') ||
      opt.id.includes('-starter')
    ) {
      return 'less';
    }
    return 'more';
  };

  const deriveDaysFromGoal = (goal: Goal): number => {
    const opt = goal.selectedOption;
    if (opt) {
      const idMatch = opt.id.match(/-(\d+)d$/);
      if (idMatch) {
        return Math.min(5, Math.max(1, parseInt(idMatch[1], 10)));
      }
      const schedMatch = opt.scheduleText?.match(/(\d+)\s*(?:day|days|meal|meals|night|nights|act|acts)/i);
      if (schedMatch) {
        return Math.min(5, Math.max(1, parseInt(schedMatch[1], 10)));
      }
    }
    if (goal.category === 'Environment') return 2;
    if (goal.category === 'Well-Being') return 5;
    return 3;
  };

  const handleUpdateRoutine = (newEffort: EffortTier, newDays: number) => {
    const updatedOption = buildRoutineOption(activeGoal.category, newEffort, newDays);
    const updatedGoal: Goal = {
      ...activeGoal,
      selectedOption: updatedOption,
      action: `${updatedOption.title}: ${updatedOption.description}`
    };
    setActiveGoal(updatedGoal);
    commitGoal(updatedGoal);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* User Profile Card */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        <div className={`flex items-center justify-between border-b pb-2.5 ${
          theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0080FF]/15 border border-[#0080FF]/30 flex items-center justify-center">
              <User className="w-5 h-5 text-[#0080FF]" />
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight">
                {user?.displayName || 'My Profile'}
              </h4>
              <p className={`text-[10px] font-sans uppercase tracking-wider font-semibold ${
                user ? 'text-[#34C759]' : 'text-[#FF9500]'
              }`}>
                {user ? 'Verified Account' : 'Guest Account'}
              </p>
            </div>
          </div>
          {!isEditingProfile && (
            <button
              onClick={handleStartEdit}
              className="text-xs font-semibold text-[#0080FF] hover:text-[#0066CC] transition-colors px-2.5 py-1 rounded-full border border-[#0080FF]/30 hover:bg-[#0080FF]/10 cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs leading-tight pt-1">
            <div className="flex flex-col gap-1">
              <label className={`font-sans text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Age</label>
              <input
                type="text"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0080FF] ${
                  theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
                }`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={`font-sans text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Gender</label>
              <select
                value={editGender}
                onChange={(e) => setEditGender(e.target.value)}
                className={`w-full px-2 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0080FF] ${
                  theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
                }`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary / Other">Non-binary</option>
                <option value="Prefer not to say">Secret</option>
              </select>
            </div>
            <div className={`flex gap-2 justify-end col-span-2 mt-2 pt-2 border-t ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
              <button
                onClick={() => setIsEditingProfile(false)}
                className={`text-xs font-medium transition-colors px-3 py-1 cursor-pointer ${
                  theme === 'dark' ? 'text-[#98989D] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="text-xs font-semibold bg-[#0080FF] text-white rounded-full px-4 py-1 hover:bg-[#0066CC] transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs leading-tight">
              <div className="flex flex-col">
                <span className={`font-sans text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Age</span>
                <span className="font-semibold text-sm">{answers.age || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-sans text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Gender</span>
                <span className="font-semibold text-sm">{answers.gender || 'N/A'}</span>
              </div>
              {user && (
                <div className={`flex flex-col col-span-2 border-t pt-1.5 ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
                  <span className={`font-sans text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Account Email</span>
                  <span className="font-semibold truncate text-xs font-mono">{user.email}</span>
                </div>
              )}
            </div>

            {/* Account CTA Button */}
            <div className={`pt-2 border-t flex flex-col gap-2 ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
              {!user && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="w-full py-2.5 bg-[#0080FF] hover:bg-[#0066CC] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Sign In to Sync</span>
                </button>
              )}

              {confirmSignOut ? (
                <div className={`p-3 rounded-[14px] border flex flex-col gap-2.5 transition-all ${
                  theme === 'dark' 
                    ? 'bg-[#18181B] border-[#27272A]' 
                    : 'bg-[#F9F9FB] border-[#E5E5EA]'
                }`}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                    <div className="text-xs font-sans">
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'}`}>
                        Confirm Sign Out?
                      </p>
                      <p className={`text-[11px] leading-relaxed mt-0.5 ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                        {user 
                          ? 'Are you sure you want to log out of your account?' 
                          : 'Are you sure you want to exit your guest session?'}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center justify-end gap-2 pt-1 border-t border-dashed ${
                    theme === 'dark' ? 'border-[#27272A]' : 'border-[#E5E5EA]'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setConfirmSignOut(false)}
                      className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer ${
                        theme === 'dark' ? 'text-[#98989D] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmSignOut(false);
                        if (onSignOut) onSignOut();
                      }}
                      className="px-3.5 py-1 bg-[#FF3B30] hover:bg-[#D70015] text-white text-xs font-sans font-semibold rounded-full transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      {user ? 'Log Out' : 'Exit Guest'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmSignOut(true)}
                  className={`w-full py-1.5 px-2 flex items-center justify-between text-xs font-sans font-medium rounded-lg transition-colors cursor-pointer group ${
                    theme === 'dark'
                      ? 'text-[#FF3B30] hover:bg-[#FF3B30]/10'
                      : 'text-[#FF3B30] hover:bg-[#FF3B30]/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>{user ? 'Log Out' : 'Exit Guest Session'}</span>
                  </span>
                  <span className={`text-[10px] font-sans ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#8E8E93]'}`}>
                    {user ? 'Sign out' : 'Guest'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Adapt Plan Card (Matches "Make an Impact" Accordion Design & Layout) */}
      {(() => {
        const isDark = theme === 'dark';
        const currentEffort = deriveEffortFromGoal(activeGoal);
        const currentDays = deriveDaysFromGoal(activeGoal);
        const activeOption = buildRoutineOption(activeGoal.category, currentEffort, currentDays);
        const effortConfig = CATEGORY_EFFORT_CONFIGS[activeGoal.category];
        const demographicInsight = activeGoal.demographicInsight || getDemographicResonance(activeGoal.category, answers.age, answers.gender);

        return (
          <div
            className={`rounded-[20px] transition-all duration-200 overflow-hidden ${
              isScheduleExpanded
                ? isDark
                  ? 'border-2 border-[#0080FF] bg-[#121214] text-white shadow-xl'
                  : 'border-2 border-[#0080FF] bg-white text-[#1C1C1E] shadow-md'
                : isDark
                ? 'border border-[#1F1F24] hover:border-[#0080FF]/50 bg-[#121214] text-white'
                : 'border border-[#E5E5EA] hover:border-[#0080FF]/50 bg-white text-[#1C1C1E] shadow-2xs'
            }`}
          >
            {/* Accordion Header Button */}
            <button
              type="button"
              id="toggle-profile-schedule-tuner-btn"
              onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
              className="w-full p-4 text-left transition-colors flex flex-col gap-3 cursor-pointer"
              aria-expanded={isScheduleExpanded}
              aria-controls="profile-adapt-plan-body"
            >
              {/* Top Row: Icon + Title & Description */}
              <div className="flex items-center gap-3.5 w-full">
                <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-colors ${
                  isScheduleExpanded
                    ? isDark ? 'bg-[#0080FF]/20 text-[#0080FF]' : 'bg-[#E5F1FF] text-[#0080FF]'
                    : isDark ? 'bg-[#1C1C1E] text-[#8E8E93]' : 'bg-[#F2F2F7] text-[#8E8E93]'
                }`}>
                  <Sliders className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h3 className={`text-base font-sans font-bold leading-tight ${
                    isDark ? 'text-white' : 'text-[#1C1C1E]'
                  }`}>
                    Adapt Plan for You
                  </h3>
                  <p className={`text-xs font-sans leading-normal truncate ${
                    isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                  }`}>
                    {activeOption.title} · {activeOption.scheduleText}
                  </p>
                </div>
              </div>

              {/* Underneath: "View Plan" / "Hide Plan Details" Bar */}
              <div className={`w-full pt-2.5 flex items-center justify-between border-t transition-colors text-xs font-sans font-semibold ${
                isScheduleExpanded
                  ? isDark ? 'border-[#1F1F24] text-[#0080FF]' : 'border-[#E5F1FF] text-[#0080FF]'
                  : isDark ? 'border-[#1F1F24] text-[#8E8E93]' : 'border-[#E5E5EA] text-[#6C6C70]'
              }`}>
                <div className="flex items-center gap-1.5">
                  <span>{isScheduleExpanded ? 'Hide Plan Details' : 'View Plan'}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isScheduleExpanded
                      ? isDark ? 'bg-[#0080FF]/20 text-[#0080FF]' : 'bg-[#E5F1FF] text-[#0066CC]'
                      : isDark ? 'bg-[#1C1C1E] text-[#8E8E93]' : 'bg-[#F2F2F7] text-[#6C6C70]'
                  }`}>
                    {activeOption.foggAbilityRating}
                  </span>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isScheduleExpanded
                    ? isDark ? 'bg-[#0080FF]/20 text-[#0080FF]' : 'bg-[#E5F1FF] text-[#0080FF]'
                    : isDark ? 'bg-[#1C1C1E] text-[#8E8E93]' : 'bg-[#F2F2F7] text-[#6C6C70]'
                }`}>
                  {isScheduleExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            </button>

            {/* Accordion Expandable Plan Content */}
            <AnimatePresence>
              {isScheduleExpanded && (
                <motion.div
                  id="profile-adapt-plan-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className={`px-4 pb-5 pt-2 border-t flex flex-col gap-4 ${
                    isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
                  }`}>
                    {/* Habit Title & Action Banner */}
                    <div className={`p-4 rounded-[16px] border flex flex-col gap-1.5 ${
                      isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
                    }`}>
                      <h4 className={`text-lg sm:text-xl font-serif font-normal tracking-tight ${
                        isDark ? 'text-white' : 'text-[#1C1C1E]'
                      }`}>
                        {activeGoal.title}
                      </h4>
                      <p className={`text-xs font-sans leading-relaxed ${
                        isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                      }`}>
                        {activeOption.description}
                      </p>
                    </div>

                    {/* Demographic Resonance Callout */}
                    {demographicInsight && (
                      <div className={`p-3.5 rounded-[14px] flex flex-col gap-1 border ${
                        isDark ? 'bg-[#0A0A0C]/70 border-[#1F1F24]' : 'bg-[#F2F8FF] border-[#BDE0FE]'
                      }`}>
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-[#0080FF] leading-snug">
                          Tailored for {answers.gender && answers.gender !== 'Prefer not to say' ? answers.gender : 'You'} ({answers.age ? `${answers.age} yrs` : '25–34 yrs'})
                        </span>
                        <p className={`text-xs font-sans leading-relaxed ${
                          isDark ? 'text-[#E5E5EA]' : 'text-[#2C2C2E]'
                        }`}>
                          {(() => {
                            const resolvedText = resolveProfileTags(demographicInsight, answers);
                            return unitSystem === 'metric'
                              ? resolvedText
                                  .replace(/460\s*fewer\s*miles/gi, '740 fewer km')
                                  .replace(/hundreds\s*of\s*driving\s*miles/gi, 'hundreds of driving km')
                                  .replace(/hundreds\s*of\s*miles/gi, 'hundreds of km')
                                  .replace(/\bmiles\b/gi, 'km')
                              : resolvedText
                                  .replace(/460\s*fewer\s*miles/gi, '460 fewer mi')
                                  .replace(/\bmiles\b/gi, 'mi');
                          })()}
                        </p>
                      </div>
                    )}

                    {/* Implementation Options Tuner: 2 Effort Tiers + 1-5 Days Selector */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className={`text-xs font-sans font-bold ${
                          isDark ? 'text-white' : 'text-[#1C1C1E]'
                        }`}>
                          Choose Your Routine
                        </label>
                        <span className={`text-[11px] font-sans ${
                          isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                        }`}>
                          Pick effort & weekly commitment
                        </span>
                      </div>

                      {/* 2 Effort Options */}
                      <div className="grid grid-cols-1 gap-2">
                        {/* Option 1: More Effort */}
                        <button
                          type="button"
                          onClick={() => handleUpdateRoutine('more', currentDays)}
                          className={`p-3.5 rounded-[14px] border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            currentEffort === 'more'
                              ? isDark
                                ? 'bg-[#0A0A0C] border-2 border-[#0080FF] shadow-xs'
                                : 'bg-[#F2F8FF] border-2 border-[#0080FF] shadow-xs'
                              : isDark
                              ? 'bg-[#0A0A0C]/50 border-[#1F1F24] hover:border-[#0080FF]/40'
                              : 'bg-white border-[#E5E5EA] hover:border-[#0080FF]/40 shadow-2xs'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            currentEffort === 'more'
                              ? 'border-[#0080FF] bg-[#0080FF]'
                              : isDark ? 'border-[#636366]' : 'border-[#C7C7CC]'
                          }`}>
                            {currentEffort === 'more' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>

                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <span className={`text-xs font-sans font-bold ${
                                currentEffort === 'more'
                                  ? isDark ? 'text-white' : 'text-[#1C1C1E]'
                                  : isDark ? 'text-[#E5E5EA]' : 'text-[#2C2C2E]'
                              }`}>
                                {effortConfig.moreTitle}
                              </span>
                              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                                currentEffort === 'more'
                                  ? isDark ? 'bg-[#0080FF]/20 text-[#0080FF] border border-[#0080FF]/30' : 'bg-[#E5F1FF] text-[#0066CC] border border-[#0080FF]/30'
                                  : isDark ? 'bg-[#121214] text-[#8E8E93]' : 'bg-[#F2F2F7] text-[#6C6C70]'
                              }`}>
                                More Effort
                              </span>
                            </div>

                            <p className={`text-xs font-sans leading-normal ${
                              isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                            }`}>
                              {effortConfig.moreDescription}
                            </p>
                          </div>
                        </button>

                        {/* Option 2: Less Effort */}
                        <button
                          type="button"
                          onClick={() => handleUpdateRoutine('less', currentDays)}
                          className={`p-3.5 rounded-[14px] border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            currentEffort === 'less'
                              ? isDark
                                ? 'bg-[#0A0A0C] border-2 border-[#0080FF] shadow-xs'
                                : 'bg-[#F2F8FF] border-2 border-[#0080FF] shadow-xs'
                              : isDark
                              ? 'bg-[#0A0A0C]/50 border-[#1F1F24] hover:border-[#0080FF]/40'
                              : 'bg-white border-[#E5E5EA] hover:border-[#0080FF]/40 shadow-2xs'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            currentEffort === 'less'
                              ? 'border-[#0080FF] bg-[#0080FF]'
                              : isDark ? 'border-[#636366]' : 'border-[#C7C7CC]'
                          }`}>
                            {currentEffort === 'less' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>

                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <span className={`text-xs font-sans font-bold ${
                                currentEffort === 'less'
                                  ? isDark ? 'text-white' : 'text-[#1C1C1E]'
                                  : isDark ? 'text-[#E5E5EA]' : 'text-[#2C2C2E]'
                              }`}>
                                {effortConfig.lessTitle}
                              </span>
                              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                                currentEffort === 'less'
                                  ? isDark ? 'bg-[#0080FF]/20 text-[#0080FF] border border-[#0080FF]/30' : 'bg-[#E5F1FF] text-[#0066CC] border border-[#0080FF]/30'
                                  : isDark ? 'bg-[#121214] text-[#8E8E93]' : 'bg-[#F2F2F7] text-[#6C6C70]'
                              }`}>
                                Less Effort
                              </span>
                            </div>

                            <p className={`text-xs font-sans leading-normal ${
                              isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                            }`}>
                              {effortConfig.lessDescription}
                            </p>
                          </div>
                        </button>
                      </div>

                      {/* Days per week selector (1 day to 5 days) */}
                      <div className={`p-3.5 rounded-[14px] border space-y-2.5 transition-colors ${
                        isDark ? 'bg-[#0A0A0C]/80 border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`text-xs font-sans font-bold block ${
                              isDark ? 'text-white' : 'text-[#1C1C1E]'
                            }`}>
                              Weekly Commitment
                            </span>
                            <span className={`text-[11px] font-sans ${
                              isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                            }`}>
                              Target: <strong className={isDark ? 'text-[#0080FF]' : 'text-[#0066CC]'}>
                                {currentDays} {currentDays === 1 ? 'day' : 'days'} / week
                              </strong>
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                            isDark ? 'bg-[#0080FF]/15 text-[#0080FF]' : 'bg-[#E5F1FF] text-[#0066CC]'
                          }`}>
                            1 to 5 days
                          </span>
                        </div>

                        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                          {[1, 2, 3, 4, 5].map((d) => {
                            const isCurrentDay = currentDays === d;
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => handleUpdateRoutine(currentEffort, d)}
                                className={`h-11 rounded-xl font-sans text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                                  isCurrentDay
                                    ? 'bg-[#0080FF] text-white shadow-sm ring-2 ring-[#0080FF]/30 scale-[1.02]'
                                    : isDark
                                    ? 'bg-[#121214] text-[#8E8E93] hover:text-white hover:bg-[#1C1C1E] border border-[#1F1F24]'
                                    : 'bg-white text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#F2F2F7] border border-[#E5E5EA] shadow-2xs'
                                }`}
                                aria-label={`${d} ${d === 1 ? 'day' : 'days'} per week`}
                              >
                                <span className="font-mono text-sm leading-none">{d}</span>
                                <span className="text-[9px] font-medium leading-none mt-1 opacity-85">
                                  {d === 1 ? 'day/wk' : 'days/wk'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Live 3-Month Dual Impact Preview */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Zap className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400 fill-amber-400' : 'text-amber-600 fill-amber-600'}`} />
                        <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                          isDark ? 'text-amber-400' : 'text-amber-700'
                        }`}>
                          3-MONTH IMPACT ({activeOption.scheduleText})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {(() => {
                          const personalMetric = formatImpactMetric(
                            activeOption.metrics.secondaryUnit,
                            activeOption.metrics.secondaryValue,
                            unitSystem
                          );
                          const planetMetric = formatImpactMetric(
                            activeOption.metrics.primaryUnit,
                            activeOption.metrics.primaryValue,
                            unitSystem
                          );
                          return (
                            <>
                              <div className={`p-3 rounded-[12px] text-center border flex flex-col justify-center items-center min-w-0 ${
                                isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
                              }`}>
                                <span className={`text-base sm:text-lg font-mono font-bold tracking-tight block w-full truncate ${
                                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                                }`}>
                                  {personalMetric.display}
                                </span>
                                <span className={`text-[10px] font-sans block leading-tight truncate w-full ${
                                  isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                                }`}>
                                  {activeOption.metrics.secondaryLabel}
                                </span>
                              </div>

                              <div className={`p-3 rounded-[12px] text-center border flex flex-col justify-center items-center min-w-0 ${
                                isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
                              }`}>
                                <span className={`text-base sm:text-lg font-mono font-bold tracking-tight block w-full truncate ${
                                  isDark ? 'text-[#0080FF]' : 'text-[#0066CC]'
                                }`}>
                                  {planetMetric.display}
                                </span>
                                <span className={`text-[10px] font-sans block leading-tight truncate w-full ${
                                  isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                                }`}>
                                  {activeOption.metrics.primaryLabel}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })()}

      {/* Appearance Theme Selector */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-sans font-bold uppercase tracking-wider">Appearance</h4>
        </div>

        <p className={`text-xs leading-relaxed font-sans ${
          theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
        }`}>
          Dark mode reduces energy consumption and screen glare.
        </p>

        <div className={`p-1 rounded-full border grid grid-cols-2 gap-1 ${
          theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
        }`}>
          <button
            type="button"
            onClick={() => onToggleTheme && onToggleTheme('light')}
            className={`py-2 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-[#0080FF] text-white shadow-xs'
                : theme === 'dark'
                  ? 'text-[#98989D] hover:text-white'
                  : 'text-[#6C6C70] hover:text-[#1C1C1E]'
            }`}
          >
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTheme && onToggleTheme('dark')}
            className={`py-2 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#0080FF] text-white shadow-xs'
                : 'text-[#6C6C70] hover:text-[#1C1C1E]'
            }`}
          >
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Impact Measurements Selector */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-sans font-bold uppercase tracking-wider">Impact Measurements</h4>
        </div>

        <div className={`p-1 rounded-full border grid grid-cols-2 gap-1 ${
          theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
        }`}>
          <button
            type="button"
            onClick={() => setUnitSystem('imperial')}
            className={`py-2 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              unitSystem === 'imperial'
                ? 'bg-[#0080FF] text-white shadow-xs'
                : theme === 'dark'
                  ? 'text-[#98989D] hover:text-white'
                  : 'text-[#6C6C70] hover:text-[#1C1C1E]'
            }`}
          >
            <span>US (mi, lbs)</span>
          </button>
          <button
            type="button"
            onClick={() => setUnitSystem('metric')}
            className={`py-2 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              unitSystem === 'metric'
                ? 'bg-[#0080FF] text-white shadow-xs'
                : theme === 'dark'
                  ? 'text-[#98989D] hover:text-white'
                  : 'text-[#6C6C70] hover:text-[#1C1C1E]'
            }`}
          >
            <span>Metric (km, kg)</span>
          </button>
        </div>
      </div>

      {/* Permanent Smart Reminders & Notification Settings */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#6C6C70] dark:text-[#98989D] px-1">
          Reminders & Notifications
        </h3>
        <SmartAlerts
          goalTitle={activeGoal.title}
          defaultAnchor={anchorHabit}
          isWeekly={isWeekly}
          theme={theme}
          onSaveConfigured={(newAnchor) => {
            setAnchorHabit(newAnchor);
            setHasConfiguredNotifications(true);
          }}
        />
      </div>

      {/* Habits Wardrobe & Catalog */}
      <HabitsManager
        activeGoal={activeGoal}
        setActiveGoal={setActiveGoal}
        onResetQuiz={onReset}
        theme={theme}
      />
    </div>
  );
}
