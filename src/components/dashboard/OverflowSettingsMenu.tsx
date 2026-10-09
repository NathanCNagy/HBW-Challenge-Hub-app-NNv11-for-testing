/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  AlertCircle,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { QuizAnswers, Goal } from '../../types';
import { useHabit } from '../../context/HabitContext';

interface OverflowSettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: (theme: 'dark' | 'light') => void;
  user: any;
  answers: QuizAnswers;
  activeGoal?: Goal;
  onUpdateAnswers?: (newAnswers: QuizAnswers) => void;
  onSignOut?: () => void;
  onOpenAuth?: () => void;
  onDownloadPDF?: () => void;
  onOpenScreenshots?: () => void;
  onOpenProfile?: () => void;
}

export default function OverflowSettingsMenu({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  user,
  answers,
  activeGoal,
  onSignOut,
  onOpenAuth,
  onOpenProfile
}: OverflowSettingsMenuProps) {
  const { unitSystem, setUnitSystem } = useHabit();
  const [confirmSignOut, setConfirmSignOut] = useState<boolean>(false);

  const handleClose = () => {
    setConfirmSignOut(false);
    onClose();
  };

  const handleOpenFullProfile = () => {
    if (onOpenProfile) {
      onOpenProfile();
    }
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 z-40 bg-black/20 backdrop-blur-xs transition-opacity"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute top-12 right-3 w-72 border rounded-[20px] shadow-2xl p-3.5 z-50 flex flex-col gap-2.5 font-sans transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-[#121214] border-[#1F1F24] text-white shadow-black/80'
                : 'bg-white border-[#E5E5EA] text-[#1C1C1E] shadow-xl'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between border-b pb-2 ${
              theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
            }`}>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                Settings & Options
              </span>
              <button 
                id="close-menu-btn"
                onClick={handleClose}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-[#1F1F24] text-[#98989D] hover:text-white' : 'hover:bg-[#F5F5F7] text-[#6C6C70] hover:text-[#1C1C1E]'
                }`}
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Summary Card (Condensed Profile Preview) */}
            <div className={`p-2.5 border rounded-[14px] flex flex-col gap-2 ${
              theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#0080FF]/15 border border-[#0080FF]/30 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-[#0080FF]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold leading-tight truncate">
                      {user?.displayName || 'My Profile'}
                    </h4>
                    <p className={`text-[9px] font-mono uppercase tracking-wider font-bold ${
                      user ? 'text-[#34C759]' : 'text-[#FF9500]'
                    }`}>
                      {user ? 'Verified Member' : 'Guest Mode'}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-semibold shrink-0 ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {answers.age || 'All Ages'}
                </span>
              </div>

              {/* Focus / Active Habit summary line */}
              {activeGoal && (
                <div className={`text-[11px] flex items-center justify-between pt-1 border-t ${
                  theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
                }`}>
                  <span className={`text-[10px] uppercase font-mono tracking-wider ${
                    theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                  }`}>
                    Option
                  </span>
                  <span className="font-medium truncate max-w-[170px] text-right">
                    {activeGoal.selectedOption?.title || activeGoal.title}
                  </span>
                </div>
              )}

              {/* Guest Sign-up CTA if not logged in */}
              {!user && (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAuth) onOpenAuth();
                    handleClose();
                  }}
                  className="w-full py-1.5 px-2 bg-[#0080FF] hover:bg-[#0066CC] text-white text-[11px] font-semibold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs mt-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Sign Up / Sync Account</span>
                </button>
              )}
            </div>

            {/* Combined Preferences Card: Appearance & Units */}
            <div className={`p-2.5 border rounded-[14px] flex flex-col gap-2 ${
              theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
            }`}>
              {/* Appearance Subsection */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-sans">Appearance</span>
                </div>

                <div className={`p-0.5 rounded-full border grid grid-cols-2 gap-1 ${
                  theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
                }`}>
                  <button
                    type="button"
                    id="theme-toggle-light-btn"
                    onClick={() => onToggleTheme('light')}
                    className={`py-1 px-2.5 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-[#0080FF] text-white shadow-xs'
                        : theme === 'dark'
                          ? 'text-[#98989D] hover:text-white'
                          : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Light</span>
                  </button>

                  <button
                    type="button"
                    id="theme-toggle-dark-btn"
                    onClick={() => onToggleTheme('dark')}
                    className={`py-1 px-2.5 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#0080FF] text-white shadow-xs'
                        : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Subtle Divider */}
              <div className={`border-t ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`} />

              {/* Units & Measures Subsection */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-sans">Units & Measures</span>
                </div>

                <div className={`p-0.5 rounded-full border grid grid-cols-2 gap-1 ${
                  theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
                }`}>
                  <button
                    type="button"
                    id="units-toggle-imperial-btn"
                    onClick={() => setUnitSystem('imperial')}
                    className={`py-1 px-2 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
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
                    id="units-toggle-metric-btn"
                    onClick={() => setUnitSystem('metric')}
                    className={`py-1 px-2 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      unitSystem === 'metric'
                        ? 'bg-[#0080FF] text-white shadow-xs'
                        : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                    }`}
                  >
                    <span>Metric (km, kg)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* "More Settings & Profile" Action Button (Moved below Units & Measures) */}
            <button
              type="button"
              id="open-profile-tab-btn"
              onClick={handleOpenFullProfile}
              className={`w-full py-2 px-3 rounded-[12px] border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer shadow-xs ${
                theme === 'dark'
                  ? 'bg-[#18181C] border-[#27272A] hover:bg-[#222226] text-white'
                  : 'bg-white border-[#E5E5EA] hover:bg-[#F5F5F7] text-[#1C1C1E]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#0080FF]" />
                <span>More Settings & Profile</span>
              </span>
              <ChevronRight className={`w-4 h-4 ${theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`} />
            </button>

            {/* Log Out / Exit Guest Session */}
            <div className={`pt-2 border-t mt-0.5 ${
              theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
            }`}>
              {confirmSignOut ? (
                <div className={`p-2.5 rounded-[12px] border flex flex-col gap-2 transition-all ${
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
                      <p className={`text-[10px] leading-relaxed mt-0.5 ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
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
                      className={`px-2.5 py-0.5 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer ${
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
                        handleClose();
                      }}
                      className="px-3 py-0.5 bg-[#FF3B30] hover:bg-[#D70015] text-white text-xs font-sans font-semibold rounded-full transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      {user ? 'Log Out' : 'Exit Guest'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  id="settings-logout-btn"
                  onClick={() => setConfirmSignOut(true)}
                  className={`w-full py-1 px-2 flex items-center justify-between text-xs font-sans font-medium rounded-lg transition-colors cursor-pointer group ${
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
