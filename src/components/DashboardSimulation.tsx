/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Goal, QuizAnswers } from '../types';
import { 
  Home, 
  TrendingUp, 
  Users, 
  User, 
  Sun, 
  Moon, 
  MoreVertical,
  CheckCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HBWLogo from './HBWLogo';
import CommunityChat from './CommunityChat';
import HomeTab from './dashboard/HomeTab';
import ProgressTab from './dashboard/ProgressTab';
import ProfileTab from './dashboard/ProfileTab';
import OverflowSettingsMenu from './dashboard/OverflowSettingsMenu';
import ScreenshotGalleryModal from './ScreenshotGalleryModal';
import { downloadHabitPlanPDF } from '../utils/pdfExport';
import { useHabit } from '../context/HabitContext';
import { formatDrivingStreak } from '../utils/units';

interface DashboardSimulationProps {
  goal: Goal;
  onReset: () => void;
  answers: QuizAnswers;
  onUpdateAnswers?: (newAnswers: QuizAnswers) => void;
  user?: any;
  onSignOut?: () => void;
  onOpenAuth?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
}

type TabType = 'home' | 'community' | 'progress' | 'profile';

export default function DashboardSimulation({ 
  goal, 
  onReset, 
  answers, 
  onUpdateAnswers,
  user,
  onSignOut,
  onOpenAuth,
  theme = 'light',
  onToggleTheme
}: DashboardSimulationProps) {
  const { unitSystem, isUS } = useHabit();
  // Store the active focusing goal. It defaults to the onboarding selected habit.
  const [activeGoal, setActiveGoal] = useState<Goal>(goal);
  
  // Mobile app bottom tab selection state
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Overflow menu visibility state
  const [showOverflowMenu, setShowOverflowMenu] = useState<boolean>(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState<boolean>(false);

  // Interactive habit progress states
  const [streak, setStreak] = useState<number>(3);
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [individualEnergy, setIndividualEnergy] = useState<number>(14); // Completed tasks & popped clouds
  const [dismissedBubbleAlert, setDismissedBubbleAlert] = useState<boolean>(false);

  // Notification configuration state
  const [hasConfiguredNotifications, setHasConfiguredNotifications] = useState<boolean>(false);
  const [anchorHabit, setAnchorHabit] = useState<string>('pouring my morning coffee');

  // Shared Bubble State for Ecosystem Tree (percentages for responsiveness)
  const [bubbles, setBubbles] = useState<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean; taskId?: string }[]>([]);

  // Category bubble types - each cloud is worth 1 task
  const bubbleTypesByCategory: Record<string, Array<{ type: string; label: string; value: number }>> = {
    'Environment': [
      { type: 'co2', label: 'Eco Action', value: 1 },
      { type: 'water', label: 'Water Save', value: 1 },
      { type: 'land', label: 'Green Step', value: 1 }
    ],
    'Well-Being': [
      { type: 'focus', label: 'Focus Boost', value: 1 },
      { type: 'sleep', label: 'Rest Habit', value: 1 },
      { type: 'mind', label: 'Mindful Step', value: 1 }
    ],
    'Compassion': [
      { type: 'kind', label: 'Kindness Unit', value: 1 },
      { type: 'bond', label: 'Social Tie', value: 1 },
      { type: 'warmth', label: 'Daily Care', value: 1 }
    ],
    'Responsible AI': [
      { type: 'verify', label: 'Fact Guard', value: 1 },
      { type: 'compute', label: 'Cycle Saved', value: 1 },
      { type: 'mind', label: 'Original Thought', value: 1 }
    ]
  };

  // Initialize bubbles on category change
  useEffect(() => {
    const category = activeGoal.category;
    const bubbleTypes = bubbleTypesByCategory[category] || [{ type: 'generic', label: 'Habit Point', value: 10 }];
    const initialBubbles = Array.from({ length: 3 }).map((_, i) => {
      const typeObj = bubbleTypes[i % bubbleTypes.length];
      return {
        id: Math.floor(Math.random() * 10000000) + i,
        cx: 15 + Math.random() * 70, // percentage 15% to 85%
        cy: 15 + Math.random() * 60, // percentage 15% to 75%
        value: typeObj.value,
        type: typeObj.type,
        label: typeObj.label
      };
    });
    setBubbles(initialBubbles);
  }, [activeGoal.category]);

  // Interactive checklist sub-items
  const [checklist, setChecklist] = useState({
    habitDone: false,
    anchorDone: false,
    reflectDone: false
  });

  // Global Escape key listener to dismiss overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showOverflowMenu) setShowOverflowMenu(false);
        if (showScreenshotModal) setShowScreenshotModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showOverflowMenu, showScreenshotModal]);

  // Encouraging psychological motivational quotes
  const [motivationalQuote, setMotivationalQuote] = useState<string>(
    "Every small habit you build is a step toward a better world. Start small, think big."
  );

  const quotesList = [
    "Every action you take is a vote for the type of person you wish to become. — James Clear",
    "By keeping your actions small, you make starting effortless. — B.J. Fogg",
    "A beautiful forest begins with nurturing a single tiny seed.",
    "Small steps compound over time. In 90 days, you will be amazed by your progress.",
    "Don't worry about the mountain. Just take the next small step. The rest will follow.",
    "Repeated actions shape your mind. You are building positive new habits today!"
  ];

  // Track which task clouds have been popped (watered) today to support undoing cloud clicks
  const [poppedTaskClouds, setPoppedTaskClouds] = useState<Record<string, boolean>>({});

  const handleCheckItem = (item: 'habitDone' | 'anchorDone' | 'reflectDone') => {
    const isChecking = !checklist[item];
    const updated = { ...checklist, [item]: isChecking };
    setChecklist(updated);

    // Dynamic quote update on checking items
    const randomQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
    setMotivationalQuote(randomQuote);

    if (isChecking) {
      // 1. Mark as logged for today if not already
      if (!hasLoggedToday) {
        setHasLoggedToday(true);
        setStreak((prev) => prev + 1);
      }
      setDismissedBubbleAlert(false);

      // 2. Spawn an energy cloud for this specific task
      const category = activeGoal.category;
      const bubbleTypes = bubbleTypesByCategory[category] || [{ type: 'generic', label: 'Energy Cloud', value: 1 }];
      const typeIndex = item === 'habitDone' ? 0 : item === 'anchorDone' ? 1 : 2;
      const randomType = bubbleTypes[typeIndex % bubbleTypes.length];

      setBubbles((prev) => {
        // If this cloud already exists in bubbles, don't duplicate
        if (prev.some((b) => b.taskId === item)) return prev;
        return [
          ...prev,
          {
            id: Date.now() + Math.floor(Math.random() * 1000),
            cx: 20 + Math.random() * 60,
            cy: 20 + Math.random() * 45,
            value: 1,
            type: randomType.type,
            label: `${randomType.label} (Task Cloud)`,
            isNew: true,
            taskId: item
          }
        ];
      });
    } else {
      // User unchecked this task (undoing mistake):
      // If the cloud was already clicked to water the plant, undo that cloud click!
      if (poppedTaskClouds[item]) {
        setIndividualEnergy((prev) => Math.max(0, prev - 1));
        setPoppedTaskClouds((prev) => ({ ...prev, [item]: false }));
      } else {
        // If the cloud wasn't clicked yet, remove it from the sky
        setBubbles((prev) => prev.filter((b) => b.taskId !== item));
      }

      // If no tasks remain checked, revert today's logged status and streak
      const remainingChecked = Object.values(updated).some(Boolean);
      if (!remainingChecked) {
        setHasLoggedToday(false);
        setStreak((prev) => Math.max(0, prev - 1));
      }
    }
  };

  const handlePopCloud = (taskId?: string) => {
    if (taskId) {
      setPoppedTaskClouds((prev) => ({ ...prev, [taskId]: true }));
    }
  };

  const handleLogSuccess = () => {
    if (!checklist.habitDone) {
      handleCheckItem('habitDone');
    }
  };

  const handleResetLog = () => {
    // Count how many task clouds were already popped to water the plant
    const poppedCount = Object.values(poppedTaskClouds).filter(Boolean).length;
    if (poppedCount > 0) {
      setIndividualEnergy((prev) => Math.max(0, prev - poppedCount));
    }
    // Remove all task clouds from bubbles
    setBubbles((prev) => prev.filter((b) => !b.taskId));
    setPoppedTaskClouds({});
    setChecklist({ habitDone: false, anchorDone: false, reflectDone: false });
    if (hasLoggedToday) {
      setStreak((prev) => Math.max(0, prev - 1));
      setHasLoggedToday(false);
    }
    setShowConfetti(false);
  };

  // Listen for completed from watch or sync requests
  useEffect(() => {
    const handleCompleteFromWatch = () => {
      if (!hasLoggedToday) {
        handleLogSuccess();
      }
    };

    const handleSyncRequest = () => {
      window.dispatchEvent(new CustomEvent('hbw:sync-state', {
        detail: {
          streak,
          hasLoggedToday,
          individualEnergy,
          goalTitle: activeGoal.title,
          goalCategory: activeGoal.category,
          checklist,
        }
      }));
    };

    window.addEventListener('hbw:complete-habit-from-watch', handleCompleteFromWatch);
    window.addEventListener('hbw:request-state-sync', handleSyncRequest);

    return () => {
      window.removeEventListener('hbw:complete-habit-from-watch', handleCompleteFromWatch);
      window.removeEventListener('hbw:request-state-sync', handleSyncRequest);
    };
  }, [hasLoggedToday, streak, individualEnergy, activeGoal, checklist]);

  // Dispatch sync event whenever states change
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('hbw:sync-state', {
      detail: {
        streak,
        hasLoggedToday,
        individualEnergy,
        goalTitle: activeGoal.title,
        goalCategory: activeGoal.category,
        checklist,
      }
    }));
  }, [streak, hasLoggedToday, individualEnergy, activeGoal, checklist]);

  // Projected 3-Month metrics calculator based on active habit category
  const getMetricsLabels = () => {
    switch (activeGoal.category) {
      case 'Environment': {
        return {
          primaryBadge: 'Personal Win',
          primaryValue: `$${Math.round(streak * 4.5)}`,
          primaryLabel: 'saved in groceries',
          secondaryBadge: 'Planet Win',
          secondaryValue: `~${Math.max(2, streak * 2)} hrs`,
          secondaryLabel: 'Keeping a light off',
          targetTip: 'Plant-protein food swaps save money on weekly groceries and boost vitality while cutting energy draw like keeping lights off.'
        };
      }
      case 'Well-Being':
        return {
          primaryBadge: 'Personal Win',
          primaryValue: `${(streak * 0.75).toFixed(1)} hrs`,
          primaryLabel: 'saved in deep sleep',
          secondaryBadge: 'Planet Win',
          secondaryValue: `${(streak * 1.0).toFixed(0)} hrs`,
          secondaryLabel: 'Powering down devices',
          targetTip: 'Powering down screens before bed restores deep restorative sleep while saving electricity and battery health.'
        };
      case 'Compassion':
        return {
          primaryBadge: 'Personal Win',
          primaryValue: `+${Math.min(35, Math.round(15 + streak * 1.5))}%`,
          primaryLabel: 'boost in mood vitality',
          secondaryBadge: 'Community Win',
          secondaryValue: `${Math.max(1, Math.round(streak * 0.7))} acts`,
          secondaryLabel: 'Acts of kindness',
          targetTip: 'Intentional weekly kindness gestures boost your personal joy while triggering lasting warmth in your community.'
        };
      case 'Responsible AI':
      default:
        return {
          primaryBadge: 'Personal Win',
          primaryValue: `+${(streak * 0.75).toFixed(1)} hrs`,
          primaryLabel: 'saved in deep focus',
          secondaryBadge: 'Planet Win',
          secondaryValue: `~${Math.max(8, streak * 8)} queries`,
          secondaryLabel: 'Compute queries saved',
          targetTip: 'Fact-checking generative responses keeps critical thinking sharp while saving grid compute queries and cooling water.'
        };
    }
  };

  const metrics = getMetricsLabels();

  const handleDownloadPDF = () => {
    downloadHabitPlanPDF(activeGoal, streak, metrics.targetTip);
  };

  const handleQuickEnableReminders = () => {
    setHasConfiguredNotifications(true);
    try {
      const existing = JSON.parse(localStorage.getItem('hbw_habit_triggers') || '[]');
      const updated = [
        {
          id: 'trigger-quick-1',
          name: anchorHabit || 'Brewing morning coffee',
          time: '08:00',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          enabled: true
        },
        ...(Array.isArray(existing) ? existing.filter((t: any) => t.id !== 'trigger-quick-1') : [])
      ];
      localStorage.setItem('hbw_habit_triggers', JSON.stringify(updated));
    } catch {
      // ignore
    }
    window.dispatchEvent(
      new CustomEvent('hbw:add-notification', {
        detail: {
          id: Date.now(),
          title: 'Smart Reminders Activated ⏰',
          body: `Habit paired with anchor: "${anchorHabit}". Trigger time set to 08:00 AM.`,
          type: 'system'
        }
      })
    );
  };

  return (
    <div className={`w-full flex-grow flex flex-col justify-between max-w-sm mx-auto min-h-[730px] relative font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0A0A0C] text-white' : 'bg-[#F5F5F7] text-[#1C1C1E]'
    }`}>
      
      {/* Dynamic Mini Bezel Header */}
      <div className={`px-4 py-2 border-b flex items-center justify-between shadow-xs shrink-0 z-20 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
      }`}>
        {/* HBW Logo on Top Left - Tap to navigate to Home tab */}
        <button
          type="button"
          id="hbw-home-btn"
          onClick={() => {
            setActiveTab('home');
            setShowOverflowMenu(false);
          }}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 active:scale-95 transition-all text-left group py-0.5 px-1.5 -ml-1 rounded-xl"
          title="Return to Home Tab"
          aria-label="Return to Home Tab"
        >
          <HBWLogo variant="favicon" size="sm" className="h-7 w-7" theme={theme} />
          <span 
            className={`font-['Poppins',sans-serif] font-extrabold text-[15px] tracking-[0.04em] uppercase select-none transition-colors duration-200 ${
              theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
            }`}
            style={{ color: theme === 'dark' ? '#FFFFFF' : '#1C1C1E' }}
          >
            H<span className="text-[#0080FF]" style={{ color: '#0080FF' }}>B</span>W
          </span>
        </button>

        <div className="flex items-center gap-1.5 relative">
          {/* Quick Header Theme Toggle */}
          <button
            type="button"
            id="header-theme-toggle-btn"
            onClick={() => onToggleTheme && onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              theme === 'dark'
                ? 'text-[#98989D] hover:text-white hover:bg-[#1F1F24]'
                : 'text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#E5E5EA]'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0080FF]" />}
          </button>

          <button
            id="overflow-menu-btn"
            onClick={() => setShowOverflowMenu(!showOverflowMenu)}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              showOverflowMenu 
                ? 'bg-[#0080FF] text-white' 
                : theme === 'dark'
                  ? 'text-[#98989D] hover:text-white hover:bg-[#1F1F24]'
                  : 'text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#F5F5F7]'
            }`}
            title="Settings & Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overflow Menu Overlay (Settings & Options) */}
      <OverflowSettingsMenu
        isOpen={showOverflowMenu}
        onClose={() => setShowOverflowMenu(false)}
        theme={theme}
        onToggleTheme={(t) => onToggleTheme && onToggleTheme(t)}
        user={user}
        answers={answers}
        activeGoal={activeGoal}
        onUpdateAnswers={onUpdateAnswers}
        onSignOut={onSignOut}
        onOpenAuth={onOpenAuth}
        onDownloadPDF={handleDownloadPDF}
        onOpenScreenshots={() => setShowScreenshotModal(true)}
        onOpenProfile={() => {
          setActiveTab('profile');
          setShowOverflowMenu(false);
        }}
      />

      {/* Screenshot Export & Gallery Modal */}
      <ScreenshotGalleryModal
        isOpen={showScreenshotModal}
        onClose={() => setShowScreenshotModal(false)}
        defaultTheme={theme}
      />

      {/* Confetti Micro-Simulator Alert */}
      {showConfetti && (
        <div className="mx-4 mt-2 text-center p-2.5 bg-[#0080FF] text-white font-sans text-xs font-semibold rounded-full animate-bounce shadow-md">
          🎉 Incredible! Habit completed. +1 Task added toward your milestone.
        </div>
      )}

      {/* Primary Tab View Area (Scrollable content) */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4 custom-scrollbar">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <HomeTab
            activeGoal={activeGoal}
            answers={answers}
            checklist={checklist}
            onCheckItem={handleCheckItem}
            hasLoggedToday={hasLoggedToday}
            onLogSuccess={handleLogSuccess}
            onResetLog={handleResetLog}
            bubbles={bubbles}
            dismissedBubbleAlert={dismissedBubbleAlert}
            setDismissedBubbleAlert={setDismissedBubbleAlert}
            motivationalQuote={motivationalQuote}
            hasConfiguredNotifications={hasConfiguredNotifications}
            anchorHabit={anchorHabit}
            setAnchorHabit={setAnchorHabit}
            onQuickEnableReminders={handleQuickEnableReminders}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            theme={theme}
          />
        )}

        {/* TAB 2: PROGRESS */}
        {activeTab === 'progress' && (
          <ProgressTab
            activeGoal={activeGoal}
            streak={streak}
            individualEnergy={individualEnergy}
            setIndividualEnergy={setIndividualEnergy}
            hasLoggedToday={hasLoggedToday}
            onLogSuccess={handleLogSuccess}
            onResetLog={handleResetLog}
            bubbles={bubbles}
            setBubbles={setBubbles}
            onPopCloud={handlePopCloud}
            checklist={checklist}
            onCheckItem={handleCheckItem}
            anchorHabit={anchorHabit}
            metrics={metrics}
            theme={theme}
          />
        )}

        {/* TAB 3: COMMUNITY */}
        {activeTab === 'community' && (
          <CommunityChat
            category={activeGoal.category}
            goalTitle={activeGoal.title}
            theme={theme}
          />
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <ProfileTab
            user={user}
            answers={answers}
            onUpdateAnswers={onUpdateAnswers}
            onSignOut={onSignOut}
            onOpenAuth={onOpenAuth}
            theme={theme}
            onToggleTheme={onToggleTheme}
            activeGoal={activeGoal}
            setActiveGoal={setActiveGoal}
            onReset={onReset}
            anchorHabit={anchorHabit}
            setAnchorHabit={setAnchorHabit}
            setHasConfiguredNotifications={setHasConfiguredNotifications}
            onDownloadPDF={handleDownloadPDF}
          />
        )}

      </div>

      {/* Bottom Navigation Bar */}
      <div className={`border-t h-[64px] grid grid-cols-4 items-center shrink-0 z-20 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        {/* TAB 1: HOME */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeTab === 'home' 
              ? 'text-[#0080FF]' 
              : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-sans font-medium leading-none">Home</span>
        </button>

        {/* TAB 2: PROGRESS */}
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer relative ${
            activeTab === 'progress' 
              ? 'text-[#0080FF]' 
              : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <div className="relative">
            <TrendingUp className="w-5 h-5 mb-0.5" />
            {bubbles.length > 0 && (
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#FF9500] ring-2 ring-white" />
            )}
          </div>
          <span className="text-[11px] font-sans font-medium leading-none">Progress</span>
        </button>

        {/* TAB 3: COMMUNITY */}
        <button
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeTab === 'community' 
              ? 'text-[#0080FF]' 
              : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-sans font-medium leading-none">Community</span>
        </button>

        {/* TAB 4: PROFILE */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeTab === 'profile' 
              ? 'text-[#0080FF]' 
              : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-sans font-medium leading-none">Profile</span>
        </button>
      </div>

    </div>
  );
}
