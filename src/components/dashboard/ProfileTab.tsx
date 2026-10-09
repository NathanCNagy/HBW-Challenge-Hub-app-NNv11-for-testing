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
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Goal, QuizAnswers, ImplementationOption } from '../../types';
import SmartAlerts from '../SmartAlerts';
import HabitsManager from '../HabitsManager';
import { useHabit } from '../../context/HabitContext';

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

  const handleSelectOption = (option: ImplementationOption) => {
    const updatedGoal: Goal = {
      ...activeGoal,
      selectedOption: option,
      action: `${option.title}: ${option.description}`
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

      {/* Adapt Plan & Choose Your Option Card (Expandable Dropdown) */}
      {activeGoal.implementationOptions && activeGoal.implementationOptions.length > 0 && (() => {
        const currentOption = activeGoal.selectedOption || activeGoal.implementationOptions[0];
        return (
          <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-2 transition-colors duration-200 ${
            theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
          }`}>
            {/* Micro-explanation callout */}
            <div className={`text-[11px] font-sans font-medium px-0.5 flex items-center gap-1.5 ${
              theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
            }`}>
              <Sliders className="w-3.5 h-3.5 text-[#0080FF]" />
              <span>Adapt plan to work for you</span>
            </div>

            {/* Accordion Header / Trigger Button */}
            <button
              type="button"
              id="toggle-profile-schedule-tuner-btn"
              onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
              className={`w-full flex items-center justify-between p-3.5 rounded-[14px] transition-all cursor-pointer group text-left ${
                isScheduleExpanded
                  ? theme === 'dark'
                    ? 'bg-[#0A0A0C] border-2 border-[#0080FF] shadow-sm'
                    : 'bg-[#F2F8FF] border-2 border-[#0080FF] shadow-xs'
                  : theme === 'dark'
                  ? 'bg-[#0A0A0C] hover:bg-[#121214] border border-[#1F1F24] hover:border-[#0080FF]/60'
                  : 'bg-[#F9F9FB] hover:bg-[#F2F2F7] border border-[#E5E5EA] hover:border-[#0080FF]/60'
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0 pr-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className={`text-sm font-sans font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                  }`}>
                    Choose Your Option
                  </h4>
                  <span className={`text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border ${
                    theme === 'dark' ? 'bg-[#1F1F24] text-[#E5E5EA] border-[#27272A]' : 'bg-[#E5E5EA]/70 text-[#1C1C1E] border-[#E5E5EA]'
                  }`}>
                    {currentOption.title.split('(')[0].trim()}
                  </span>
                </div>
                <p className={`text-xs font-sans leading-relaxed ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {isScheduleExpanded
                    ? 'Select the frequency that feels easiest to start with.'
                    : `Currently: ${currentOption.scheduleText} · Tap to change`}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-sans font-semibold text-[#0080FF] shrink-0 pl-1">
                <span>{isScheduleExpanded ? 'Done' : 'Change'}</span>
                {isScheduleExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {/* Accordion Content */}
            <AnimatePresence>
              {isScheduleExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-3 pt-1.5"
                >
                  {/* Implementation Options Radio List */}
                  <div className="space-y-2">
                    {activeGoal.implementationOptions.map((option) => {
                      const isSelected = currentOption.id === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleSelectOption(option)}
                          className={`w-full p-3.5 rounded-[14px] border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? theme === 'dark'
                                ? 'bg-[#0A0A0C] border-2 border-[#0080FF] shadow-sm'
                                : 'bg-[#F2F8FF] border-2 border-[#0080FF] shadow-xs'
                              : theme === 'dark'
                              ? 'bg-[#0A0A0C]/50 border-[#1F1F24] hover:border-[#0080FF]/40'
                              : 'bg-white border-[#E5E5EA] hover:border-[#0080FF]/40 shadow-2xs'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#0080FF] bg-[#0080FF]'
                              : theme === 'dark' ? 'border-[#636366]' : 'border-[#C7C7CC]'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>

                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <span className={`text-xs font-sans font-bold ${
                                isSelected
                                  ? theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                                  : theme === 'dark' ? 'text-[#E5E5EA]' : 'text-[#2C2C2E]'
                              }`}>
                                {option.title}
                              </span>
                              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? theme === 'dark' ? 'bg-[#0080FF]/20 text-[#0080FF] border border-[#0080FF]/30' : 'bg-[#E5F1FF] text-[#0066CC] border border-[#0080FF]/30'
                                  : theme === 'dark' ? 'bg-[#121214] text-[#8E8E93]' : 'bg-[#F2F2F7] text-[#6C6C70]'
                              }`}>
                                {option.foggAbilityRating}
                              </span>
                            </div>

                            <p className={`text-xs font-sans leading-relaxed ${
                              theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                            }`}>
                              {option.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
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
