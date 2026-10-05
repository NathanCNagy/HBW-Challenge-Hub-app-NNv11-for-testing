/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CheckCircle, 
  Calendar, 
  Sparkles, 
  Bell, 
  X,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Goal } from '../../types';

interface HomeTabProps {
  activeGoal: Goal;
  checklist?: {
    habitDone: boolean;
    anchorDone: boolean;
    reflectDone: boolean;
  };
  onCheckItem?: (item: 'habitDone' | 'anchorDone' | 'reflectDone') => void;
  hasLoggedToday: boolean;
  onLogSuccess?: () => void;
  bubbles: Array<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean }>;
  dismissedBubbleAlert: boolean;
  setDismissedBubbleAlert: (dismissed: boolean) => void;
  motivationalQuote: string;
  hasConfiguredNotifications: boolean;
  anchorHabit?: string;
  setAnchorHabit?: (anchor: string) => void;
  onQuickEnableReminders?: () => void;
  onNavigateToTab: (tab: 'progress' | 'profile') => void;
  theme: 'dark' | 'light';
}

export default function HomeTab({
  activeGoal,
  hasLoggedToday,
  onLogSuccess,
  bubbles,
  dismissedBubbleAlert,
  setDismissedBubbleAlert,
  motivationalQuote,
  hasConfiguredNotifications,
  anchorHabit,
  setAnchorHabit,
  onQuickEnableReminders,
  onNavigateToTab,
  theme
}: HomeTabProps) {
  const isWeekly = activeGoal.selectedOption?.scheduleText?.toLowerCase().includes('week') || activeGoal.title.toLowerCase().includes('weekly');

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Active Focus Header Details */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 relative overflow-hidden transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#6C6C70] dark:text-[#98989D]">
              {isWeekly ? "This Week's Focus" : "Today's Focus"}
            </span>
            {hasLoggedToday && (
              <span className="text-[10px] font-sans font-semibold text-[#34C759] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {isWeekly ? 'Logged This Week' : 'Logged Today'}
              </span>
            )}
          </div>
          <h3 className="text-base font-serif font-normal leading-tight z-10 truncate">
            {activeGoal.title}
          </h3>
          <p className={`text-xs leading-normal font-sans z-10 ${
            theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}>
            {activeGoal.action}
          </p>

          {/* Lightweight Pace Indicator & Shortcut to Profile Tab */}
          <div className={`flex items-center justify-between pt-2 mt-0.5 border-t border-dashed z-10 ${
            theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
          }`}>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`text-[11px] font-sans ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                Pace:
              </span>
              <span className={`text-[11px] font-sans font-semibold truncate ${
                theme === 'dark' ? 'text-[#E5E5EA]' : 'text-[#1C1C1E]'
              }`}>
                {activeGoal.selectedOption?.title?.split('(')[0]?.trim() || activeGoal.implementationOptions?.[0]?.title?.split('(')[0]?.trim() || 'Standard Plan'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('profile')}
              className="text-[11px] font-sans font-semibold text-[#0080FF] hover:underline cursor-pointer shrink-0"
            >
              Adjust pace &rarr;
            </button>
          </div>
        </div>

        {/* Habit Quick Logging Action */}
        {!hasLoggedToday ? (
          <button
            onClick={() => onLogSuccess && onLogSuccess()}
            className="h-[44px] w-full px-4 rounded-full font-sans font-semibold text-xs sm:text-[13px] bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <CheckCircle className="w-4 h-4 text-white shrink-0" />
            <span>{isWeekly ? 'Log Habit for This Week (+1 Task)' : 'Log Habit for Today (+1 Task)'}</span>
          </button>
        ) : (
          <div className={`h-[44px] w-full px-4 rounded-full font-sans font-medium text-xs sm:text-[13px] transition-all flex items-center justify-between border ${
            theme === 'dark'
              ? 'bg-[#18181B] text-[#34C759] border-[#34C759]/30'
              : 'bg-[#34C759]/10 text-[#248A3D] border-[#34C759]/30'
          }`}>
            <div className="flex items-center gap-2 truncate pl-1">
              <CheckCircle className="w-4 h-4 text-[#34C759] shrink-0" />
              <span className="truncate font-semibold">{isWeekly ? 'Logged for This Week!' : 'Logged for Today!'}</span>
            </div>
            <button
              onClick={() => onNavigateToTab('progress')}
              className="text-[11px] font-sans font-semibold text-[#0080FF] hover:underline cursor-pointer shrink-0 ml-2 pr-1"
            >
              View in Progress &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Energy Harvest Banner (if bubbles are waiting) */}
      {bubbles.length > 0 && (
        <button
          onClick={() => onNavigateToTab('progress')}
          className={`w-full p-3 border rounded-[14px] transition-all flex items-center justify-between group cursor-pointer ${
            theme === 'dark' 
              ? 'bg-[#FF9500]/10 border-[#FF9500]/30 hover:bg-[#FF9500]/20' 
              : 'bg-[#FF9500]/5 border-[#FF9500]/25 hover:bg-[#FF9500]/10'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">🌱</span>
            <div className="text-left">
              <span className="text-xs font-bold text-[#FF9500]">
                {bubbles.length} Energy {bubbles.length === 1 ? 'Bubble' : 'Bubbles'} Ready!
              </span>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                Harvest tree energy in the Progress tab
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#FF9500] group-hover:translate-x-1 transition-transform">
            &rarr;
          </span>
        </button>
      )}

      {hasLoggedToday && bubbles.some(b => b.isNew) && !dismissedBubbleAlert && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-[#0080FF]/10 border border-[#0080FF]/30 rounded-[14px] text-center space-y-1 relative"
        >
          <button 
            onClick={() => setDismissedBubbleAlert(true)}
            className="absolute top-1 right-2 text-[#6C6C70] hover:text-white transition-colors p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="text-xs font-sans font-semibold text-[#0080FF] pr-4">
            ✨ A new Energy Bubble (+15g) sprouted on your Ecosystem Tree!
          </p>
          <button
            onClick={() => onNavigateToTab('progress')}
            className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#0080FF] hover:underline cursor-pointer"
          >
            Go to Progress Tab to Pop It &rarr;
          </button>
        </motion.div>
      )}

      {/* Smart Reminders Section */}
      {!hasConfiguredNotifications ? (
        <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
        }`}>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-full bg-[#0080FF]/15 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-[#0080FF]" />
              </div>
              <h4 className="text-xs font-sans font-bold uppercase tracking-wider truncate">
                Smart Habit Reminders
              </h4>
            </div>
            <span className="text-[9px] font-sans font-semibold uppercase px-2 py-0.5 rounded-full bg-[#FF9500]/15 text-[#FF9500] shrink-0">
              Not Set Up
            </span>
          </div>

          <p className={`text-xs leading-relaxed font-sans ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
            {isWeekly
              ? 'Pair your habit with a regular routine (like your weekly grocery run or Sunday dinner) to make consistency automatic.'
              : 'Pair your habit with a daily routine (like morning coffee or evening wind-down) to make consistency automatic.'}
          </p>

          <button
            onClick={() => onNavigateToTab('profile')}
            className={`h-[44px] w-full px-5 rounded-full font-sans font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] ${
              theme === 'dark'
                ? 'bg-[#0080FF]/15 hover:bg-[#0080FF]/25 text-[#0080FF] border border-[#0080FF]/30'
                : 'bg-[#0080FF] hover:bg-[#0066CC] text-white'
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span>Set Up Reminders in Profile</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      ) : (
        <div className={`p-3 border rounded-[14px] flex items-center justify-between shadow-xs transition-colors duration-200 ${
          theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#34C759]/15 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-[#34C759]" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                <span>Reminders Active</span>
                <span className="text-[9px] font-sans font-bold text-[#34C759] bg-[#34C759]/15 px-1.5 py-0.2 rounded-full">
                  ON
                </span>
              </p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                Paired with "{anchorHabit}"
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('profile')}
            className="text-xs font-semibold text-[#0080FF] hover:underline cursor-pointer shrink-0"
          >
            Settings &rarr;
          </button>
        </div>
      )}

      {/* Motivational Psychology Card (at the bottom of home screen) */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-2 relative overflow-hidden transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#0080FF]" />
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#6C6C70] dark:text-[#98989D]">
            Daily Motivation
          </span>
        </div>
        <p className={`text-xs leading-relaxed font-sans italic ${
          theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
        }`}>
          "{motivationalQuote}"
        </p>
      </div>
    </div>
  );
}
