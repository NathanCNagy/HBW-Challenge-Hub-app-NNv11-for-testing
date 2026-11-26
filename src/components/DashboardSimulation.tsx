/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Goal, QuizAnswers, CloudBubble, AccomplishedMilestone } from '../types';
import { 
  Target, 
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
import { MILESTONE_STAGES } from '../utils/milestones';
import MilestoneShareModal from './MilestoneShareModal';

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

  // Interactive habit progress states (calibrated for fresh starts & usability tests)
  const [streak, setStreak] = useState<number>(() => {
    try {
      const isCalibrated = localStorage.getItem('hbw_demo_zero_clouds_v2');
      if (!isCalibrated) {
        localStorage.setItem('hbw_demo_zero_clouds_v2', 'true');
        localStorage.setItem('hbw_individual_energy', '0');
        localStorage.setItem('hbw_streak', '0');
        return 0;
      }
      const saved = localStorage.getItem('hbw_streak');
      if (saved !== null) return parseInt(saved, 10);
    } catch {
      // ignore
    }
    return 0;
  });
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [individualEnergy, setIndividualEnergy] = useState<number>(() => {
    try {
      const isCalibrated = localStorage.getItem('hbw_demo_zero_clouds_v2');
      if (!isCalibrated) {
        localStorage.setItem('hbw_demo_zero_clouds_v2', 'true');
        localStorage.setItem('hbw_individual_energy', '0');
        localStorage.setItem('hbw_streak', '0');
        return 0;
      }
      const saved = localStorage.getItem('hbw_individual_energy');
      if (saved !== null) return parseInt(saved, 10);
    } catch {
      // ignore
    }
    return 0; // Starts at 0 so first milestone (3 clouds) occurs after 3 clouds clicked
  });
  const [dismissedBubbleAlert, setDismissedBubbleAlert] = useState<boolean>(false);

  // Notification configuration state
  const [hasConfiguredNotifications, setHasConfiguredNotifications] = useState<boolean>(false);
  const [anchorHabit, setAnchorHabit] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('hbw_anchor_habit');
      if (saved) return saved;
    } catch {
      // ignore
    }
    const isWeeklyGoal = activeGoal.selectedOption?.scheduleText?.toLowerCase().includes('week') || activeGoal.title.toLowerCase().includes('weekly');
    return isWeeklyGoal ? 'Sunday grocery run' : 'morning coffee';
  });

  // Shared Bubble State for Ecosystem Tree: starts EMPTY for demo consistency
  const [bubbles, setBubbles] = useState<CloudBubble[]>([]);

  // Accomplished milestones persisted across sessions for Profile card & sharing
  const [accomplishedMilestones, setAccomplishedMilestones] = useState<AccomplishedMilestone[]>(() => {
    try {
      const saved = localStorage.getItem('hbw_accomplished_milestones');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [shareModalMilestone, setShareModalMilestone] = useState<AccomplishedMilestone | null>(null);

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

  // Sync activeGoal when props.goal updates
  useEffect(() => {
    setActiveGoal(goal);
  }, [goal]);

  // When activeGoal changes (starting a new habit or switching in HabitsManager),
  // reset all task tracking, clouds, and progress score to the initial state for demo consistency
  const prevGoalIdRef = useRef<string>(activeGoal.id);
  useEffect(() => {
    if (prevGoalIdRef.current !== activeGoal.id) {
      prevGoalIdRef.current = activeGoal.id;
      setChecklist({ habitDone: false, anchorDone: false, reflectDone: false });
      setBubbles([]);
      setPoppedTaskClouds({});
      setPoppedStreakValue(0);
      setHasLoggedToday(false);
      setStreak(0);
      setIndividualEnergy(0);
      try {
        localStorage.setItem('hbw_individual_energy', '0');
        localStorage.setItem('hbw_streak', '0');
      } catch {
        // ignore
      }
    }
  }, [activeGoal.id]);

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

  // Track which task clouds and streak bonus cloud have been popped (watered) today to support undoing cloud clicks
  const [poppedTaskClouds, setPoppedTaskClouds] = useState<Record<string, boolean>>({});
  const [poppedStreakValue, setPoppedStreakValue] = useState<number>(0);

  const handleCheckItem = (item: 'habitDone' | 'anchorDone' | 'reflectDone') => {
    const isChecking = !checklist[item];
    const updated = { ...checklist, [item]: isChecking };
    setChecklist(updated);

    // Dynamic quote update on checking items
    const randomQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
    setMotivationalQuote(randomQuote);

    if (isChecking) {
      // 1. Mark as logged for today if not already
      const effectiveStreak = !hasLoggedToday ? streak + 1 : streak;
      if (!hasLoggedToday) {
        setHasLoggedToday(true);
        setStreak((prev) => prev + 1);
      }
      setDismissedBubbleAlert(false);

      // 2. Spawn an energy cloud for this specific task (+ bonus streak cloud if on a streak)
      const category = activeGoal.category;
      const bubbleTypes = bubbleTypesByCategory[category] || [{ type: 'generic', label: 'Energy Cloud', value: 1 }];
      const typeIndex = item === 'habitDone' ? 0 : item === 'anchorDone' ? 1 : 2;
      const randomType = bubbleTypes[typeIndex % bubbleTypes.length];

      const fixedPositions: Record<string, { cx: number; cy: number }> = {
        habitDone: { cx: 24, cy: 31 },
        anchorDone: { cx: 76, cy: 31 },
        reflectDone: { cx: 50, cy: 19 }
      };
      const pos = fixedPositions[item] || { cx: 20 + Math.random() * 60, cy: 20 + Math.random() * 45 };
      const bonusValue = effectiveStreak >= 7 ? 3 : 2;

      setBubbles((prev) => {
        const next = [...prev];
        // Add task cloud if it doesn't already exist
        if (!next.some((b) => b.taskId === item)) {
          next.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            cx: pos.cx,
            cy: pos.cy,
            value: 1,
            type: randomType.type,
            label: `${randomType.label} (Task Cloud)`,
            isNew: true,
            taskId: item
          });
        }
        // Spawn 1 Bonus Streak Cloud when on an active streak and not yet earned/popped this session
        if (effectiveStreak >= 1 && poppedStreakValue === 0 && !next.some((b) => b.isStreakBonus)) {
          next.push({
            id: Date.now() + Math.floor(Math.random() * 1000) + 1001,
            cx: 50,
            cy: 45,
            value: bonusValue,
            type: 'streak',
            label: `Streak Bonus (+${bonusValue} Growth)`,
            isNew: true,
            taskId: 'streak-bonus',
            isStreakBonus: true,
            streakCount: effectiveStreak
          });
        }
        return next;
      });
    } else {
      // User unchecked this task (undoing mistake):
      const remainingChecked = Object.values(updated).some(Boolean);
      let refund = 0;

      if (poppedTaskClouds[item]) {
        refund += 1;
        setPoppedTaskClouds((prev) => ({ ...prev, [item]: false }));
      }
      if (!remainingChecked && poppedStreakValue > 0) {
        refund += poppedStreakValue;
        setPoppedStreakValue(0);
      }

      if (refund > 0) {
        setIndividualEnergy((prev) => Math.max(0, prev - refund));
      }

      // Remove unpopped task cloud (and unpopped streak bonus cloud if no tasks remain)
      setBubbles((prev) =>
        prev.filter((b) => {
          if (b.taskId === item && !poppedTaskClouds[item]) return false;
          if (!remainingChecked && b.isStreakBonus) return false;
          return true;
        })
      );

      // If no tasks remain checked, revert today's logged status and streak
      if (!remainingChecked) {
        setHasLoggedToday(false);
        setStreak((prev) => Math.max(0, prev - 1));
      }
    }
  };

  const handlePopCloud = (taskId?: string, poppedValue?: number) => {
    if (taskId === 'streak-bonus') {
      setPoppedStreakValue(poppedValue || 2);
    } else if (taskId) {
      setPoppedTaskClouds((prev) => ({ ...prev, [taskId]: true }));
    }
  };

  const handleLogSuccess = () => {
    if (!checklist.habitDone) {
      handleCheckItem('habitDone');
    }
  };

  const handleResetLog = () => {
    // Count how many task clouds and streak bonus points were already popped to water the plant
    const poppedCount = Object.values(poppedTaskClouds).filter(Boolean).length;
    const totalRefund = poppedCount + poppedStreakValue;
    if (totalRefund > 0) {
      setIndividualEnergy((prev) => Math.max(0, prev - totalRefund));
    }
    // Remove all task and streak bonus clouds from bubbles
    setBubbles((prev) => prev.filter((b) => !b.taskId));
    setPoppedTaskClouds({});
    setPoppedStreakValue(0);
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
    try {
      localStorage.setItem('hbw_individual_energy', individualEnergy.toString());
      localStorage.setItem('hbw_streak', streak.toString());
    } catch {
      // ignore
    }
  }, [streak, hasLoggedToday, individualEnergy, activeGoal, checklist]);

  // Record any newly accomplished milestones whenever Growth points advance
  useEffect(() => {
    setAccomplishedMilestones((prev) => {
      const newlyUnlocked = MILESTONE_STAGES.filter(
        (stage) =>
          individualEnergy >= stage.targetTasks &&
          !prev.some((existing) => existing.targetTasks === stage.targetTasks)
      ).map((stage) => ({
        targetTasks: stage.targetTasks,
        stageName: stage.stageName,
        streakAtUnlock: Math.max(1, streak),
        goalTitle: activeGoal.title,
        category: activeGoal.category,
        unlockedAt: new Date().toISOString()
      }));

      if (newlyUnlocked.length === 0) return prev;
      const updated = [...prev, ...newlyUnlocked];
      try {
        localStorage.setItem('hbw_accomplished_milestones', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, [individualEnergy, streak, activeGoal.title, activeGoal.category]);

  // Projected 3-Month metrics calculator based on active habit category
  const getMetricsLabels = () => {
    switch (activeGoal.category) {
      case 'Environment': {
        const distVal = unitSystem === 'metric'
          ? `~${Math.round(streak * 4.0)} km`
          : `~${Math.round(streak * 2.5)} mi`;
        return {
          primaryBadge: 'Personal Win',
          primaryValue: `$${Math.round(streak * 4.5)}`,
          primaryLabel: 'saved in groceries & digestion',
          secondaryBadge: 'Planet Win',
          secondaryValue: distVal,
          secondaryLabel: 'car emissions cut (EPA standard)',
          targetTip: 'Plant-protein food swaps save money on weekly groceries and boost vitality while cutting carbon emissions equal to driving fewer miles.'
        };
      }
      case 'Well-Being':
        return {
          primaryBadge: 'Personal Win',
          primaryValue: `${(streak * 0.75).toFixed(1)} hrs`,
          primaryLabel: 'restorative deep sleep gained',
          secondaryBadge: 'Planet Win',
          secondaryValue: `${(streak * 1.0).toFixed(0)} hrs`,
          secondaryLabel: 'battery health & grid relief',
          targetTip: 'Powering down screens before bed restores deep restorative sleep while protecting device battery health and providing grid relief.'
        };
      case 'Compassion':
        return {
          primaryBadge: 'Personal Win',
          primaryValue: `+${Math.min(35, Math.round(15 + streak * 1.5))}%`,
          primaryLabel: 'boost in mood vitality & joy',
          secondaryBadge: 'Community Win',
          secondaryValue: `${Math.max(1, Math.round(streak * 0.7))} acts`,
          secondaryLabel: 'people uplifted in circle',
          targetTip: 'Intentional weekly kindness gestures boost your personal joy while triggering lasting warmth in your community.'
        };
      case 'Responsible AI':
      default:
        return {
          primaryBadge: 'Personal Win',
          primaryValue: `+${(streak * 0.75).toFixed(1)} hrs`,
          primaryLabel: 'saved in deep focus',
          secondaryBadge: 'Planet Win',
          secondaryValue: `~${Math.round(streak * 1.5)}L`,
          secondaryLabel: 'cooling water saved (~0.5L/query)',
          targetTip: 'Fact-checking generative responses keeps critical thinking sharp while saving grid compute and data center cooling water (~0.5L/query).'
        };
    }
  };

  const metrics = getMetricsLabels();

  const handleDownloadPDF = () => {
    downloadHabitPlanPDF(activeGoal, streak, metrics.targetTip);
  };

  const handleSelectAnchor = (anchor: string, defaultTime?: string, defaultDays?: string[]) => {
    setAnchorHabit(anchor);
    setHasConfiguredNotifications(true);
    try {
      localStorage.setItem('hbw_anchor_habit', anchor);
      const isWeeklyGoal = activeGoal.selectedOption?.scheduleText?.toLowerCase().includes('week') || activeGoal.title.toLowerCase().includes('weekly');
      const time = defaultTime || (isWeeklyGoal ? '10:00' : '08:00');
      const days = defaultDays && defaultDays.length > 0 ? defaultDays : (isWeeklyGoal ? ['Sun'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
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
          title="Return to Daily Focus"
          aria-label="Return to Daily Focus"
        >
          <HBWLogo variant="favicon" size="sm" className="h-7 w-7" theme={theme} />
          <span 
            className={`font-['Poppins',sans-serif] font-extrabold text-[15px] tracking-[0.04em] uppercase select-none transition-colors duration-200 ${
              theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
            }`}
            style={{ color: theme === 'dark' ? '#FFFFFF' : '#1C1C1E' }}
          >
            H<span className={theme === 'dark' ? 'text-white' : 'text-black'} style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>B</span>W
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
            onSelectAnchor={handleSelectAnchor}
            onNavigateToProfile={() => setActiveTab('profile')}
            onShareMilestone={(m) => setShareModalMilestone(m)}
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
            accomplishedMilestones={accomplishedMilestones}
            individualEnergy={individualEnergy}
            onShareMilestone={(m) => setShareModalMilestone(m)}
          />
        )}

      </div>

      {/* Shared In-App Milestone Social Share Sheet */}
      <MilestoneShareModal
        milestone={shareModalMilestone}
        isWeekly={Boolean(
          activeGoal.selectedOption?.scheduleText?.toLowerCase().includes('week') ||
          activeGoal.title.toLowerCase().includes('weekly')
        )}
        theme={theme}
        onClose={() => setShareModalMilestone(null)}
      />

      {/* Bottom Navigation Bar */}
      <div className={`border-t h-[64px] grid grid-cols-4 items-center shrink-0 z-20 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        {/* TAB 1: DAILY FOCUS */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center h-full px-1 transition-all cursor-pointer ${
            activeTab === 'home' 
              ? 'text-[#0080FF]' 
              : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <Target className="w-5 h-5 mb-0.5 shrink-0" />
          <span className="text-[10px] font-sans font-medium leading-none tracking-tight whitespace-nowrap">
            Daily Focus
          </span>
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
