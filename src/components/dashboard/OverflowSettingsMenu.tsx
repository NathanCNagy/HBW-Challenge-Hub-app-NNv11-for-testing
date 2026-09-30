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
  Globe
} from 'lucide-react';
import { QuizAnswers } from '../../types';
import { useHabit } from '../../context/HabitContext';

interface OverflowSettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: (theme: 'dark' | 'light') => void;
  user: any;
  answers: QuizAnswers;
  onUpdateAnswers?: (newAnswers: QuizAnswers) => void;
  onSignOut?: () => void;
  onOpenAuth?: () => void;
  onDownloadPDF?: () => void;
  onOpenScreenshots?: () => void;
}

export default function OverflowSettingsMenu({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  user,
  answers,
  onUpdateAnswers,
  onSignOut,
  onOpenAuth,
  onDownloadPDF,
  onOpenScreenshots
}: OverflowSettingsMenuProps) {
  const { unitSystem, setUnitSystem } = useHabit();
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editAge, setEditAge] = useState<string>(answers.age);
  const [editGender, setEditGender] = useState<string>(answers.gender);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 z-40 bg-black/20 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute top-12 right-3 w-72 border rounded-[20px] shadow-2xl p-4 z-50 flex flex-col gap-3 font-sans transition-colors duration-200 ${
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
                onClick={onClose}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-[#1F1F24] text-[#98989D] hover:text-white' : 'hover:bg-[#F5F5F7] text-[#6C6C70] hover:text-[#1C1C1E]'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Section */}
            <div className={`p-3 border rounded-[16px] flex flex-col gap-2 ${
              theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2 ${
                theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#0080FF]/10 border border-[#0080FF]/30 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#0080FF]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">
                      {user?.displayName || 'My Profile'}
                    </h4>
                    <p className={`text-[9px] font-mono uppercase tracking-wider font-bold ${
                      user ? 'text-[#34C759]' : 'text-[#FF9500]'
                    }`}>
                      {user ? 'Verified Challenger' : 'Guest Sandbox'}
                    </p>
                  </div>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={handleStartEdit}
                    className="text-[11px] font-semibold text-[#0080FF] hover:text-[#0066CC] transition-colors px-2 py-0.5 rounded-full border border-[#0080FF]/30 hover:bg-[#0080FF]/10 cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs leading-tight pt-1">
                  <div className="flex flex-col gap-1">
                    <label className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Age</label>
                    <input
                      type="text"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      className={`w-full px-2 py-1 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0080FF] ${
                        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Gender</label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      className={`w-full px-1.5 py-1 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0080FF] ${
                        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
                      }`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary / Other">Non-binary</option>
                      <option value="Prefer not to say">Secret</option>
                    </select>
                  </div>
                  <div className={`flex gap-2 justify-end col-span-2 mt-2 pt-1 border-t ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className={`text-xs font-medium transition-colors px-2 py-1 cursor-pointer ${
                        theme === 'dark' ? 'text-[#98989D] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="text-xs font-semibold bg-[#0080FF] text-white rounded-full px-3 py-1 hover:bg-[#0066CC] transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-0.5">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs leading-tight">
                    <div className="flex flex-col">
                      <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Age</span>
                      <span className="font-semibold">{answers.age || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Gender</span>
                      <span className="font-semibold">{answers.gender || 'N/A'}</span>
                    </div>
                    {user && (
                      <div className={`flex flex-col col-span-2 border-t pt-1 ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
                        <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Account Email</span>
                        <span className="font-semibold truncate text-[10px] font-mono">{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div className={`pt-2 border-t ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
                    {user ? (
                      <button
                        onClick={() => {
                          if (onSignOut) onSignOut();
                          onClose();
                        }}
                        className="w-full py-2 bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] text-xs font-bold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out of Account</span>
                      </button>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => {
                            if (onOpenAuth) onOpenAuth();
                            onClose();
                          }}
                          className="w-full py-2 bg-[#0080FF] hover:bg-[#0066CC] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span>Sign Up / Sync Account</span>
                        </button>
                        <button
                          onClick={() => {
                            if (onSignOut) onSignOut();
                            onClose();
                          }}
                          className="w-full py-1.5 bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] text-xs font-bold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out / Exit Guest Session</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Appearance / Theme Toggle */}
            <div className={`p-3 border rounded-[16px] flex flex-col gap-2 ${
              theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {theme === 'dark' ? (
                    <Moon className="w-3.5 h-3.5 text-[#0080FF]" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span className="text-xs font-bold font-sans">Appearance</span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#0080FF] bg-[#0080FF]/15 px-2 py-0.5 rounded-full">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>

              <p className={`text-[11px] font-sans leading-normal ${
                theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                Choose your preferred theme style for everyday use.
              </p>

              <div className={`p-1 rounded-full border grid grid-cols-2 gap-1 mt-0.5 ${
                theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
              }`}>
                <button
                  type="button"
                  id="theme-toggle-light-btn"
                  onClick={() => onToggleTheme('light')}
                  className={`py-1.5 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-[#0080FF] text-white shadow-xs'
                      : theme === 'dark'
                        ? 'text-[#98989D] hover:text-white'
                        : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>

                <button
                  type="button"
                  id="theme-toggle-dark-btn"
                  onClick={() => onToggleTheme('dark')}
                  className={`py-1.5 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-[#0080FF] text-white shadow-xs'
                      : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
              </div>
            </div>

            {/* Units & Measures Section */}
            <div className={`p-3 border rounded-[16px] flex flex-col gap-2 ${
              theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#0080FF]" />
                  <span className="text-xs font-bold font-sans">Units & Measures</span>
                </div>
                <span className="text-[10px] font-mono text-[#0080FF] font-semibold">
                  {unitSystem === 'imperial' ? 'US (mi)' : 'Metric (km)'}
                </span>
              </div>

              <div className={`p-1 rounded-full border grid grid-cols-2 gap-1 mt-0.5 ${
                theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
              }`}>
                <button
                  type="button"
                  id="units-toggle-imperial-btn"
                  onClick={() => setUnitSystem('imperial')}
                  className={`py-1.5 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    unitSystem === 'imperial'
                      ? 'bg-[#0080FF] text-white shadow-xs'
                      : theme === 'dark'
                        ? 'text-[#98989D] hover:text-white'
                        : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                  }`}
                >
                  <span>US (mi)</span>
                </button>

                <button
                  type="button"
                  id="units-toggle-metric-btn"
                  onClick={() => setUnitSystem('metric')}
                  className={`py-1.5 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    unitSystem === 'metric'
                      ? 'bg-[#0080FF] text-white shadow-xs'
                      : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                  }`}
                >
                  <span>Metric (km)</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
