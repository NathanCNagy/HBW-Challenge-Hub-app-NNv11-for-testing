import React, { useState, useEffect } from 'react';
import { Trophy, ShieldCheck, Heart, Sparkles, Zap, Users, Flame, Cloud, X, ArrowRight, CheckCircle2, Droplets, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useHabit } from '../context/HabitContext';

interface EcosystemVisualizationProps {
  category: 'Environment' | 'Well-Being' | 'Compassion' | 'Responsible AI';
  streak: number;
  individualEnergy: number;
  setIndividualEnergy: React.Dispatch<React.SetStateAction<number>>;
  hasLoggedToday: boolean;
  onLogToday: () => void;
  goalTitle: string;
  bubbles: { id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean }[];
  setBubbles: React.Dispatch<React.SetStateAction<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean }[]>>;
  theme?: 'dark' | 'light';
  children?: React.ReactNode;
  isWeekly?: boolean;
}

interface TaskMilestone {
  targetTasks: number;
  prevTasks: number;
  label: string;
  stageName: string;
}

const TASK_MILESTONES: TaskMilestone[] = [
  { targetTasks: 10, prevTasks: 0, label: '10 Tasks Sprout', stageName: 'Sprout' },
  { targetTasks: 25, prevTasks: 10, label: '25 Tasks Sapling', stageName: 'Sapling' },
  { targetTasks: 50, prevTasks: 25, label: '50 Tasks Canopy', stageName: 'Canopy' },
  { targetTasks: 100, prevTasks: 50, label: '100 Tasks Bloom', stageName: 'Full Bloom' }
];

const DAILY_TASKS_TARGET = 4; // 3 daily clouds + 1 daily habit log = 4 tasks / day

export default function EcosystemVisualization({
  category,
  streak,
  individualEnergy,
  setIndividualEnergy,
  hasLoggedToday,
  onLogToday,
  goalTitle,
  bubbles,
  setBubbles,
  theme = 'light',
  children,
  isWeekly = false
}: EcosystemVisualizationProps) {
  const [raindrops, setRaindrops] = useState<{ id: string; startX: number; startY: number; targetX: number; delay: number; size: number }[]>([]);
  const [isHydrating, setIsHydrating] = useState<boolean>(false);
  const [hydrationMessage, setHydrationMessage] = useState<string>('');
  const { unitSystem } = useHabit();

  // Target milestone is anchored cleanly below the top stat pills (y = 88)
  const currentMilestone = TASK_MILESTONES.find(m => individualEnergy < m.targetTasks) || TASK_MILESTONES[TASK_MILESTONES.length - 1];
  const targetMilestoneY = 88;
  const isMastered = individualEnergy >= 100;
  const tasksRemaining = isMastered ? 0 : Math.max(0, currentMilestone.targetTasks - individualEnergy);
  const daysToNext = isMastered ? 0 : Math.max(1, Math.ceil(tasksRemaining / DAILY_TASKS_TARGET));

  // Progress within the current milestone stage (0.0 to 1.0)
  const stageSpan = currentMilestone.targetTasks - currentMilestone.prevTasks;
  const stageProgress = isMastered 
    ? 1 
    : Math.min(1, Math.max(0, (individualEnergy - currentMilestone.prevTasks) / stageSpan));

  // Dynamic botanical scaling: plant grows upward toward the milestone line (y = 88)
  const milestoneIndex = TASK_MILESTONES.indexOf(currentMilestone);
  const stageBaseTipY = 
    milestoneIndex === 0 ? 305 :
    milestoneIndex === 1 ? 235 :
    milestoneIndex === 2 ? 170 :
    125;

  const stageTargetTipY = 
    milestoneIndex === 0 ? 210 :
    milestoneIndex === 1 ? 150 :
    milestoneIndex === 2 ? 106 :
    targetMilestoneY;

  const plantTipY = isMastered 
    ? targetMilestoneY 
    : Math.round(stageBaseTipY - stageProgress * (stageBaseTipY - stageTargetTipY));

  const trunkTopY = Math.min(322, Math.round(plantTipY + (individualEnergy < 10 ? 20 : individualEnergy < 25 ? 36 : individualEnergy < 50 ? 52 : 66)));
  const foliageCenterY = Math.round((plantTipY + trunkTopY) / 2);
  const progressRatio = Math.min(1, individualEnergy / 100);
  const canopyW = Math.min(70, Math.round(26 + progressRatio * 44));
  const canopyH = Math.min(62, Math.round(22 + progressRatio * 40));

  const handlePopBubble = (id: number, value: number, cx: number, cy: number) => {
    const increment = value || 1;
    setIndividualEnergy(prev => prev + increment);
    setBubbles(prev => prev.filter(b => b.id !== id));

    // Generate cheerful hydration rainfall drops originating from cloud position down to the tree
    const newRaindrops = Array.from({ length: 16 }).map((_, i) => ({
      id: `rain-${Date.now()}-${i}-${Math.random()}`,
      startX: cx + (Math.random() * 10 - 5), // slight horizontal variance
      startY: cy + 3, // starting below the cloud
      targetX: 60 + (Math.random() * 16 - 8), // lands near tree base (x: 60% of stage)
      delay: i * 0.035,
      size: 9 + Math.random() * 8
    }));

    setRaindrops(prev => [...prev, ...newRaindrops]);
    setIsHydrating(true);
    setHydrationMessage('Plant Watered! (+1 Growth) 💧');

    // Clear drops after animation
    setTimeout(() => {
      setRaindrops(prev => prev.filter(r => !newRaindrops.some(nr => nr.id === r.id)));
    }, 1100);

    setTimeout(() => {
      setIsHydrating(false);
    }, 1400);
  };

  // Real-world impact translator calculated from completed tasks
  const getImpactDetails = (cat: string, tasks: number, unit: 'imperial' | 'metric') => {
    switch (cat) {
      case 'Environment': {
        const dollarsSaved = Math.round(tasks * 4.5);
        const lightHours = Math.max(2, tasks * 2);
        const co2Val = unit === 'imperial'
          ? `${Math.round(tasks * 5.2)} lbs CO2 avoided`
          : `${(tasks * 2.4).toFixed(1)} kg CO2 avoided`;
        return {
          headline: `~${lightHours} hrs lights off & $${dollarsSaved} saved in groceries`,
          tangibleShort: `${lightHours} hrs lights off`,
          metric1Label: 'ENVIRONMENT IMPACT',
          metric1Value: `~${lightHours} hrs lights off`,
          metric2Label: 'PERSONAL ADVANTAGE',
          metric2Value: `$${dollarsSaved}`,
          context: `Each completed task cuts energy like keeping lights off for 2 hours while saving ~$4.50 on groceries and reducing heart risk (${co2Val}).`
        };
      }
      case 'Well-Being': {
        const sleepHours = Math.round(tasks * 2.5);
        const gridHours = Math.max(2, Math.round(tasks * 1.5));
        return {
          headline: `~${gridHours} hrs grid saved & +${sleepHours} hrs deep sleep`,
          tangibleShort: `~${gridHours} hrs grid saved`,
          metric1Label: 'ENVIRONMENT IMPACT',
          metric1Value: `~${gridHours} hrs grid saved`,
          metric2Label: 'PERSONAL ADVANTAGE',
          metric2Value: `+${sleepHours} hrs`,
          context: 'Powering down screens saves grid electricity while restoring deep restorative sleep cycles.'
        };
      }
      case 'Compassion': {
        return {
          headline: `${tasks} acts of kindness & +35% mood lift`,
          tangibleShort: `${tasks} kindness acts`,
          metric1Label: 'COMMUNITY IMPACT',
          metric1Value: `${tasks} neighbor acts`,
          metric2Label: 'PERSONAL ADVANTAGE',
          metric2Value: `+35%`,
          context: 'Intentional acts of connection strengthen community support and elevate daily emotional resilience.'
        };
      }
      case 'Responsible AI':
      default: {
        const queriesSaved = Math.max(8, tasks * 8);
        const focusHours = (tasks * 0.75).toFixed(1);
        return {
          headline: `${queriesSaved} queries saved & +${focusHours} hrs deep focus`,
          tangibleShort: `${queriesSaved} queries saved`,
          metric1Label: 'ENVIRONMENT IMPACT',
          metric1Value: `${queriesSaved} queries saved`,
          metric2Label: 'PERSONAL ADVANTAGE',
          metric2Value: `+${focusHours} hrs`,
          context: 'Mindful computing eliminates wasted datacenter power and protects cognitive stamina.'
        };
      }
    }
  };

  const currentImpact = getImpactDetails(category, individualEnergy, unitSystem);

  // Group stats mapped to categories
  const co2RawKg = 125480 + (individualEnergy * 2.3);
  const co2Display = unitSystem === 'imperial'
    ? `${(co2RawKg * 2.20462).toLocaleString(undefined, { maximumFractionDigits: 0 })} lbs`
    : `${co2RawKg.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg`;

  const groupStats = {
    'Environment': {
      groupName: 'The Plant-Forward Kitchen & Active Travelers',
      subgroup: 'Environmental Challenge Group',
      activeMembers: '24,198',
      collectiveTasks: 76240 + individualEnergy,
      planetMetricLabel: 'Environment Impact',
      planetMetricValue: `~${Math.max(2, individualEnergy * 2)} hrs`,
      planetMetricSubtext: 'Keeping a light off',
      personalMetricLabel: 'Personal Advantage',
      personalMetricValue: `$${Math.round(individualEnergy * 4.5)}`,
      personalMetricSubtext: 'saved in groceries',
      dualExplanation: 'Every habit you log cuts environmental draw—like keeping household lights off for 2 hours—while trimming ~$4.50 from your grocery expenses and lowering cardiovascular risk.',
      visualColor: 'from-[#0285ff]/30 to-emerald-500/20'
    },
    'Well-Being': {
      groupName: 'Universal Vitality & Digital Mindfulness',
      subgroup: 'Well-Being Challenge Group',
      activeMembers: '18,402',
      collectiveTasks: 34120 + individualEnergy,
      planetMetricLabel: 'Environment Impact',
      planetMetricValue: `~${Math.max(2, Math.round(individualEnergy * 1.5))} hrs`,
      planetMetricSubtext: 'Powering down devices',
      personalMetricLabel: 'Personal Advantage',
      personalMetricValue: `+${Math.round(individualEnergy * 2.5)} hrs`,
      personalMetricSubtext: 'saved in deep sleep',
      dualExplanation: 'Powering down devices saves grid electricity while giving you deeper, restorative sleep cycles and lowering chronic stress.',
      visualColor: 'from-[#0285ff]/30 to-indigo-500/20'
    },
    'Compassion': {
      groupName: 'Everyday Kindness & Food Security allies',
      subgroup: 'Kindness Challenge Group',
      activeMembers: '15,221',
      collectiveTasks: 18230 + individualEnergy,
      planetMetricLabel: 'Community Impact',
      planetMetricValue: `${individualEnergy} acts`,
      planetMetricSubtext: 'Acts of kindness',
      personalMetricLabel: 'Personal Advantage',
      personalMetricValue: `+35%`,
      personalMetricSubtext: 'lift in mood vitality',
      dualExplanation: 'Connecting with neighbors strengthens community solidarity while boosting your own mood and emotional resilience.',
      visualColor: 'from-[#0285ff]/30 to-pink-500/20'
    },
    'Responsible AI': {
      groupName: 'Cognitive Integrity & AI Fact-Checkers',
      subgroup: 'Mindful AI Challenge Group',
      activeMembers: '9,812',
      collectiveTasks: 9840 + individualEnergy,
      planetMetricLabel: 'Environment Impact',
      planetMetricValue: `~${Math.max(8, individualEnergy * 8)} queries`,
      planetMetricSubtext: 'Compute energy saved',
      personalMetricLabel: 'Personal Advantage',
      personalMetricValue: `+${(individualEnergy * 0.75).toFixed(1)} hrs`,
      personalMetricSubtext: 'saved in deep focus',
      dualExplanation: 'Mindful computing prevents datacenter power spikes while freeing up hours of deep focus for your own projects.',
      visualColor: 'from-[#0285ff]/30 to-teal-500/20'
    }
  }[category];

  const [showGroupModal, setShowGroupModal] = useState<boolean>(false);
  const [showGrowthModal, setShowGrowthModal] = useState<boolean>(false);

  // Close modals on Escape key press
  useEffect(() => {
    if (!showGroupModal && !showGrowthModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGroupModal(false);
        setShowGrowthModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGroupModal, showGrowthModal]);

  // Group Progress & Team Milestone Calculations (measured in clouds clicked on)
  const cloudsPerMilestone = 10000;
  const currentTeamMilestone = Math.max(1, Math.floor(groupStats.collectiveTasks / cloudsPerMilestone));
  const nextMilestoneNum = currentTeamMilestone + 1;
  const milestoneFloor = currentTeamMilestone * cloudsPerMilestone;
  const nextMilestoneCloudsTarget = nextMilestoneNum * cloudsPerMilestone;
  const teamCloudsRemaining = Math.max(0, nextMilestoneCloudsTarget - groupStats.collectiveTasks);
  const teamMilestoneProgressPercent = Math.min(100, Math.max(0, Math.round(((groupStats.collectiveTasks - milestoneFloor) / cloudsPerMilestone) * 100)));
  const dailyTeamVelocity = 1850; // community average clouds clicked per day
  const daysToTeamMilestone = Math.max(1, Math.ceil(teamCloudsRemaining / dailyTeamVelocity));

  // Individual user stacking benchmark against their team (measured in clouds clicked)
  const teamAverageClouds = 12; // benchmark median clouds clicked per member
  const userVsTeamDiff = teamAverageClouds > 0 ? Math.round(((individualEnergy - teamAverageClouds) / teamAverageClouds) * 100) : 0;
  const userTier = 
    individualEnergy >= 25 ? 'Top 10% Impact Contributor 🏆' :
    individualEnergy >= 12 ? 'Above Team Median 🌟' :
    'Active Impact Explorer 🌱';

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Interactive Alipay-Style Ant Forest Stage */}
      <div className={`relative w-full h-[420px] rounded-[20px] overflow-hidden flex flex-col justify-between p-4 transition-all duration-300 border ${
        theme === 'dark' 
          ? 'bg-[#0A0A0C] border-[#1F1F24] shadow-md text-white' 
          : 'bg-gradient-to-b from-[#EBF5FF] via-[#E2F0FE] to-[#D5E8FC] border-[#BDE0FE] shadow-sm text-[#1C1C1E]'
      }`}>
        {/* Dynamic visual overlay corresponding to category */}
        <div className={`absolute inset-0 bg-gradient-to-b ${groupStats.visualColor} ${theme === 'dark' ? 'opacity-25' : 'opacity-40'} pointer-events-none`} />

        {/* Top Header stats overlay */}
        <div className="flex justify-between items-start z-10">
          <div className={`space-y-0.5 p-2 px-3 rounded-full border backdrop-blur-md ${
            theme === 'dark' ? 'bg-[#121214]/80 border-[#1F1F24]' : 'bg-white/90 border-[#BDE0FE] shadow-2xs'
          }`}>
            <span className={`text-[9px] font-sans uppercase tracking-wider font-bold block ${
              theme === 'dark' ? 'text-[#98989D]' : 'text-[#5C6C7E]'
            }`}>CLOUDS CLICKED</span>
            <div className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-[#0080FF]" />
              <span className={`text-sm font-serif font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
              }`}>{individualEnergy}</span>
              <span className={`text-[10px] font-sans ${theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                {individualEnergy === 1 ? 'cloud' : 'clouds'}
              </span>
            </div>
          </div>

          {/* Group Progress interactive button with see group progress icon */}
          <button
            type="button"
            onClick={() => setShowGroupModal(true)}
            className={`text-right space-y-0.5 p-2 px-3 rounded-full border backdrop-blur-md transition-all cursor-pointer group hover:scale-[1.03] active:scale-[0.98] ${
              theme === 'dark' 
                ? 'bg-[#121214]/80 hover:bg-[#1A1A1E] border-[#1F1F24] hover:border-[#0080FF]/50 text-white' 
                : 'bg-white/90 hover:bg-white border-[#BDE0FE] hover:border-[#0080FF]/50 text-[#1C1C1E] shadow-2xs'
            }`}
            title="See group progress & how you stack up against your team"
            aria-label="See group progress"
          >
            <div className="flex items-center justify-end">
              <span className={`text-[9px] font-sans uppercase tracking-wider font-bold block ${
                theme === 'dark' ? 'text-[#98989D]' : 'text-[#5C6C7E]'
              }`}>GROUP PROGRESS</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <Users className="w-3.5 h-3.5 text-[#0080FF]" />
              <span className={`text-xs font-sans font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
              }`}>Milestone {currentTeamMilestone}</span>
              <span className="text-[10px] text-[#0080FF] font-medium group-hover:translate-x-0.5 transition-transform">
                &rarr;
              </span>
            </div>
          </button>
        </div>

        {/* Floating Monochromatic Cloud Outlines */}
        <div className="absolute inset-x-0 top-16 bottom-20 z-20 overflow-visible pointer-events-none">
          <AnimatePresence>
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                style={{ left: `${bubble.cx}%`, top: `${bubble.cy}%`, transform: 'translate(-50%, -50%)' }}
                className="absolute z-20 pointer-events-auto"
              >
                <motion.button
                  initial={{ scale: 0, y: 15, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    y: [0, -6, 0], 
                    opacity: 0.98,
                    transition: {
                      y: {
                        repeat: Infinity,
                        duration: 3 + (bubble.id % 3) * 0.7,
                        ease: "easeInOut"
                      }
                    }
                  }}
                  exit={{ scale: 1.25, opacity: 0, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handlePopBubble(bubble.id, bubble.value, bubble.cx, bubble.cy)}
                  className="relative flex flex-col items-center justify-center cursor-pointer select-none group pointer-events-auto focus:outline-hidden"
                >
                  {/* Monochromatic Vector Cloud Outline */}
                  <div className="relative flex items-center justify-center">
                    <svg width="68" height="44" viewBox="0 0 68 44" className="overflow-visible filter drop-shadow-xs">
                      <path
                        d="M 14 36 
                           C 7 36, 2 30, 3 23 
                           C 4 16, 11 11, 18 12 
                           C 21 5, 29 1, 37 3 
                           C 45 4, 50 10, 51 16 
                           C 58 16, 64 21, 63 28 
                           C 62 35, 56 36, 50 36 
                           Z"
                        fill={
                          bubble.isNew
                            ? theme === 'dark' ? 'rgba(0, 128, 255, 0.25)' : 'rgba(0, 128, 255, 0.12)'
                            : theme === 'dark' ? 'rgba(18, 18, 20, 0.85)' : 'rgba(255, 255, 255, 0.92)'
                        }
                        stroke={
                          bubble.isNew
                            ? '#0080FF'
                            : theme === 'dark' ? '#38BDF8' : '#0080FF'
                        }
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {/* Centered +1 only with no other text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className={`text-[12px] font-mono font-bold tracking-tight leading-none ${
                        bubble.isNew
                          ? 'text-[#0080FF] font-extrabold'
                          : theme === 'dark' ? 'text-white' : 'text-[#0080FF]'
                      }`}>
                        +1
                      </span>
                    </div>
                  </div>
                </motion.button>
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* Rainfall Particles Container */}
        <AnimatePresence>
          {raindrops.map((drop) => (
            <motion.div
              key={drop.id}
              initial={{ 
                left: `${drop.startX}%`, 
                top: `${drop.startY}%`, 
                opacity: 0,
                scale: 0.5
              }}
              animate={{ 
                left: `${drop.targetX}%`, 
                top: '78%', // Hits the plant milestone
                opacity: [0, 1, 1, 0.8, 0],
                scale: [0.5, 1, 0.9, 0.3]
              }}
              transition={{ 
                duration: 0.75, 
                delay: drop.delay, 
                ease: "easeIn" 
              }}
              className="absolute z-30 pointer-events-none transform -translate-x-1/2"
            >
              {/* Hydration Rain Drop SVG */}
              <svg width={drop.size} height={drop.size * 1.4} viewBox="0 0 16 22" className="drop-shadow-xs">
                <path 
                  d="M 8 1 C 8 1 1 10 1 15 A 7 7 0 0 0 15 15 C 15 10 8 1 8 1 Z" 
                  fill="#38BDF8" 
                  opacity="0.9"
                />
                <circle cx="6" cy="13" r="1.8" fill="#FFFFFF" opacity="0.8" />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Hydration Ripple FX & Banner */}
        <AnimatePresence>
          {isHydrating && (
            <>
              <motion.div
                initial={{ scale: 0.3, opacity: 0.9 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, repeat: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 h-7 rounded-full border-2 border-sky-400 bg-sky-400/20 pointer-events-none z-10"
              />
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 pointer-events-none font-bold font-mono text-xs text-[#0080FF] bg-white/95 dark:bg-[#121214]/95 border border-[#38BDF8] px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5"
              >
                <span className="text-sm">💧</span>
                <span>{hydrationMessage}</span>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* The Growth Visual Tree / Plant with Left Height Ruler extending all the way to top of tile */}
        <div 
          className="absolute inset-x-0 top-0 bottom-12 flex justify-center pointer-events-none z-10"
        >
          <svg width="360" height="370" viewBox="0 0 360 370" className={`w-full h-full max-w-[370px] ${theme === 'dark' ? "drop-shadow-[0_0_18px_rgba(0,128,255,0.25)]" : "drop-shadow-[0_4px_12px_rgba(0,128,255,0.18)]"}`}>
            <defs>
              {/* Organic Trunk Wood Gradients */}
              <linearGradient id="botanicalTrunkLight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#432818" />
                <stop offset="45%" stopColor="#6F4E37" />
                <stop offset="80%" stopColor="#85583E" />
                <stop offset="100%" stopColor="#432818" />
              </linearGradient>
              <linearGradient id="botanicalTrunkDark" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0B1B2B" />
                <stop offset="40%" stopColor="#133A5C" />
                <stop offset="85%" stopColor="#1E527F" />
                <stop offset="100%" stopColor="#0B1B2B" />
              </linearGradient>

              {/* Organic Canopy Gradients with HBW Palette */}
              <linearGradient id="botanicalCanopyLight" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1E8236" />
                <stop offset="35%" stopColor="#28A745" />
                <stop offset="70%" stopColor="#34C759" />
                <stop offset="100%" stopColor="#4ADE80" />
              </linearGradient>
              <linearGradient id="botanicalCanopyDark" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#004D99" />
                <stop offset="40%" stopColor="#0066CC" />
                <stop offset="75%" stopColor="#0080FF" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>

              {/* Soft Soil Mound Gradient */}
              <linearGradient id="soilLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34C759" stopOpacity="0.4" />
                <stop offset="40%" stopColor="#62929E" />
                <stop offset="100%" stopColor="#3F5E6B" />
              </linearGradient>
              <linearGradient id="soilDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0080FF" stopOpacity="0.35" />
                <stop offset="45%" stopColor="#0A1C2E" />
                <stop offset="100%" stopColor="#050E18" />
              </linearGradient>
            </defs>

            {/* === ONE SIMPLE MILESTONE LINE (Positioned slightly lower than Habit Energy label) === */}
            {!isMastered ? (
              <g>
                {/* Horizontal milestone target guideline */}
                <line 
                  x1="20" 
                  y1={targetMilestoneY} 
                  x2="340" 
                  y2={targetMilestoneY} 
                  stroke="#0080FF" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  opacity={theme === 'dark' ? 0.75 : 0.6} 
                />

                {/* Left accent pip */}
                <circle 
                  cx="24" 
                  cy={targetMilestoneY} 
                  r="3.5" 
                  fill="#0080FF" 
                />

                {/* Right accent pip */}
                <circle 
                  cx="336" 
                  cy={targetMilestoneY} 
                  r="3.5" 
                  fill="#0080FF" 
                />

                {/* Milestone label with clear cloud count target */}
                <text 
                  x="180" 
                  y={targetMilestoneY - 6} 
                  fontSize="11" 
                  fontFamily="'Poppins', sans-serif" 
                  fontWeight="bold" 
                  fill="#0080FF"
                  textAnchor="middle"
                  className="select-none tracking-wide"
                >
                  {tasksRemaining} {tasksRemaining === 1 ? 'CLOUD' : 'CLOUDS'} LEFT TO NEXT MILESTONE: {currentMilestone.stageName?.toUpperCase()}
                </text>
              </g>
            ) : (
              <g>
                <line 
                  x1="20" 
                  y1={targetMilestoneY} 
                  x2="340" 
                  y2={targetMilestoneY} 
                  stroke="#34C759" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  opacity={theme === 'dark' ? 0.75 : 0.6} 
                />
                <circle cx="24" cy={targetMilestoneY} r="3.5" fill="#34C759" />
                <circle cx="336" cy={targetMilestoneY} r="3.5" fill="#34C759" />
                <text 
                  x="180" 
                  y={targetMilestoneY - 6} 
                  fontSize="11" 
                  fontFamily="'Poppins', sans-serif" 
                  fontWeight="bold" 
                  fill="#34C759"
                  textAnchor="middle"
                  className="select-none tracking-wide"
                >
                  MILESTONE REACHED: 100 TASKS FULL BLOOM 🌟
                </text>
              </g>
            )}

            {/* === ARTISTIC BOTANICAL PLANT ILLUSTRATION (NO GEOMETRIC SHAPES) === */}

            {/* Natural Organic Ground Mound */}
            <path 
              d="M 28 335 C 80 320, 135 316, 195 316 C 255 316, 310 320, 356 335 C 360 354, 340 365, 195 365 C 50 365, 30 354, 28 335 Z" 
              fill={theme === 'dark' ? "url(#soilDark)" : "url(#soilLight)"} 
            />
            {/* Organic moss & grass layer */}
            <path 
              d="M 46 335 C 90 323, 140 320, 195 320 C 250 320, 300 323, 344 335 C 325 342, 265 345, 195 345 C 125 345, 65 342, 46 335 Z" 
              fill={theme === 'dark' ? "#0A3B66" : "#A7D7C5"} 
              opacity="0.8" 
            />
            {/* Grass tufts around trunk roots */}
            <path 
              d="M 166 330 Q 162 320 158 316 Q 164 322 168 329 Q 172 318 175 314 Q 175 322 173 331 Z" 
              fill={theme === 'dark' ? "#38BDF8" : "#2E7D32"} 
              opacity="0.85" 
            />
            <path 
              d="M 218 331 Q 222 320 226 315 Q 222 323 220 331 Q 225 319 230 316 Q 226 324 224 332 Z" 
              fill={theme === 'dark' ? "#38BDF8" : "#2E7D32"} 
              opacity="0.85" 
            />

            {/* STAGE 0: Organically Sprouting Seedling */}
            {streak === 0 && (
              <g>
                {/* Tender curved green stem */}
                <path 
                  d="M 193 330 C 193 315 194 305 195 295 C 196 305 197 315 197 330 Z" 
                  fill={theme === 'dark' ? "#38BDF8" : "#34C759"} 
                />
                {/* Left cotyledon leaf */}
                <path 
                  d="M 195 300 C 176 296 166 280 176 272 C 188 270 194 286 195 300 Z" 
                  fill={theme === 'dark' ? "#0080FF" : "#34C759"} 
                />
                <path 
                  d="M 195 300 Q 184 285 178 275" 
                  stroke="rgba(255,255,255,0.6)" 
                  strokeWidth="1" 
                  fill="none" 
                />
                {/* Right cotyledon leaf */}
                <path 
                  d="M 195 300 C 214 296 224 280 214 272 C 202 270 196 286 195 300 Z" 
                  fill={theme === 'dark' ? "#38BDF8" : "#22C55E"} 
                />
                <path 
                  d="M 195 300 Q 206 285 212 275" 
                  stroke="rgba(255,255,255,0.6)" 
                  strokeWidth="1" 
                  fill="none" 
                />
                {/* Delicate unfurling center shoot */}
                <path 
                  d="M 195 295 C 193 286, 194 280, 195 275 C 196 280, 197 286, 195 295 Z" 
                  fill={theme === 'dark' ? "#BAE6FD" : "#86EFAC"} 
                />
                {/* Glistening morning dewdrop */}
                <circle cx="178" cy="275" r="2" fill="#fff" opacity="0.95" className="animate-pulse" />
                <circle cx="212" cy="275" r="1.8" fill="#fff" opacity="0.95" />
              </g>
            )}

            {/* STAGE 1: Young Growing Sprout (Streak 1–3) */}
            {streak >= 1 && streak < 4 && (
              <g>
                {/* Graceful curved botanical stalk with natural taper */}
                <path 
                  d={`M 191 332 
                      C 192 310, ${193 + Math.sin(streak) * 3} ${(332 + trunkTopY) / 2}, 194 ${trunkTopY} 
                      L 196 ${trunkTopY} 
                      C ${197 + Math.sin(streak) * 3} ${(332 + trunkTopY) / 2}, 198 310, 199 332 Z`} 
                  fill={theme === 'dark' ? "#38BDF8" : "#2E7D32"} 
                />
                {/* Lower Left Leaf */}
                <path 
                  d={`M 193 ${(332 + trunkTopY * 2) / 3 + 8} 
                      C 172 ${(332 + trunkTopY * 2) / 3}, 158 ${(332 + trunkTopY * 2) / 3 - 10}, 162 ${(332 + trunkTopY * 2) / 3 - 22} 
                      C 174 ${(332 + trunkTopY * 2) / 3 - 14}, 186 ${(332 + trunkTopY * 2) / 3 - 4}, 193 ${(332 + trunkTopY * 2) / 3 + 4} Z`} 
                  fill={theme === 'dark' ? "#0080FF" : "#388E3C"} 
                />
                <path 
                  d={`M 193 ${(332 + trunkTopY * 2) / 3 + 6} Q 174 ${(332 + trunkTopY * 2) / 3 - 6} 164 ${(332 + trunkTopY * 2) / 3 - 18}`} 
                  stroke="rgba(255,255,255,0.5)" 
                  strokeWidth="1" 
                  fill="none" 
                />
                {/* Lower Right Leaf */}
                <path 
                  d={`M 197 ${(332 + trunkTopY) / 2 + 10} 
                      C 218 ${(332 + trunkTopY) / 2 + 2}, 232 ${(332 + trunkTopY) / 2 - 8}, 228 ${(332 + trunkTopY) / 2 - 20} 
                      C 216 ${(332 + trunkTopY) / 2 - 12}, 204 ${(332 + trunkTopY) / 2 - 2}, 197 ${(332 + trunkTopY) / 2 + 6} Z`} 
                  fill={theme === 'dark' ? "#0284C7" : "#43A047"} 
                />
                <path 
                  d={`M 197 ${(332 + trunkTopY) / 2 + 8} Q 216 ${(332 + trunkTopY) / 2 - 4} 226 ${(332 + trunkTopY) / 2 - 16}`} 
                  stroke="rgba(255,255,255,0.5)" 
                  strokeWidth="1" 
                  fill="none" 
                />
                {/* Upper Sprout Foliage Crown */}
                <path 
                  d={`M 195 ${trunkTopY + 4} 
                      C 180 ${trunkTopY - 8}, 176 ${plantTipY + 8}, 188 ${plantTipY} 
                      C 193 ${plantTipY - 8}, 197 ${plantTipY - 8}, 202 ${plantTipY} 
                      C 214 ${plantTipY + 8}, 210 ${trunkTopY - 8}, 195 ${trunkTopY + 4} Z`} 
                  fill={theme === 'dark' ? "#38BDF8" : "#4CAF50"} 
                />
                {/* Apex Leaf Shoot reaching up towards top milestone */}
                <path 
                  d={`M 195 ${plantTipY + 6} C 192 ${plantTipY - 4}, 193 ${plantTipY - 14}, 195 ${plantTipY - 20} C 197 ${plantTipY - 14}, 198 ${plantTipY - 4}, 195 ${plantTipY + 6} Z`} 
                  fill={theme === 'dark' ? "#BAE6FD" : "#81C784"} 
                />
                <circle cx="195" cy={plantTipY - 18} r="2" fill="#fff" opacity="0.9" className="animate-ping" />
              </g>
            )}

            {/* STAGES 2, 3 & 4: Established Botanical Tree (Streak >= 4) */}
            {streak >= 4 && (
              <g>
                {/* Organic Trunk with Root Flares & Contours */}
                <path 
                  d={`M 183 333 
                      C 186 320, ${189 + Math.sin(streak * 0.5) * 3} ${(333 + trunkTopY) / 2}, 192 ${trunkTopY} 
                      L 198 ${trunkTopY} 
                      C ${201 + Math.sin(streak * 0.5) * 3} ${(333 + trunkTopY) / 2}, 204 320, 207 333 
                      C 200 334, 190 334, 183 333 Z`} 
                  fill={theme === 'dark' ? "url(#botanicalTrunkDark)" : "url(#botanicalTrunkLight)"} 
                />
                {/* Bark Wood Contour Shadow Line */}
                <path 
                  d={`M 186 331 C 188 320, ${191 + Math.sin(streak * 0.5) * 3} ${(331 + trunkTopY) / 2}, 193 ${trunkTopY}`} 
                  stroke={theme === 'dark' ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.22)"} 
                  strokeWidth="1.6" 
                  fill="none" 
                />

                {/* Left Branch */}
                <path 
                  d={`M 192 ${(333 + trunkTopY * 2) / 3 + 4} 
                      C 174 ${(333 + trunkTopY * 2) / 3 - 2}, 158 ${(333 + trunkTopY * 2) / 3 - 10}, 142 ${(333 + trunkTopY * 2) / 3 - 22} 
                      C 152 ${(333 + trunkTopY * 2) / 3 - 16}, 170 ${(333 + trunkTopY * 2) / 3 - 10}, 193 ${(333 + trunkTopY * 2) / 3 - 4} Z`} 
                  fill={theme === 'dark' ? "#133A5C" : "#5A3E2B"} 
                />

                {/* Right Branch */}
                <path 
                  d={`M 197 ${(333 + trunkTopY) / 2 + 4} 
                      C 216 ${(333 + trunkTopY) / 2 - 2}, 232 ${(333 + trunkTopY) / 2 - 10}, 250 ${(333 + trunkTopY) / 2 - 22} 
                      C 240 ${(333 + trunkTopY) / 2 - 16}, 222 ${(333 + trunkTopY) / 2 - 10}, 198 ${(333 + trunkTopY) / 2 - 4} Z`} 
                  fill={theme === 'dark' ? "#133A5C" : "#5A3E2B"} 
                />

                {/* Left Branch Foliage: Clustered Botanical Leaves */}
                <g transform={`translate(142, ${(333 + trunkTopY * 2) / 3 - 22})`}>
                  {/* Leaf 1 (top-left) */}
                  <path d="M 0 0 C -12 -6, -20 -18, -14 -24 C -8 -22, -2 -12, 0 0 Z" fill={theme === 'dark' ? "#38BDF8" : "#2E7D32"} />
                  <path d="M 0 0 Q -10 -12 -14 -22" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
                  {/* Leaf 2 (lateral-left) */}
                  <path d="M 0 0 C -14 4, -26 2, -26 -6 C -20 -10, -8 -4, 0 0 Z" fill={theme === 'dark' ? "#0080FF" : "#388E3C"} />
                  <path d="M 0 0 Q -14 2 -24 -5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
                  {/* Leaf 3 (upright) */}
                  <path d="M 0 0 C -4 -12, -4 -24, 4 -26 C 10 -22, 6 -10, 0 0 Z" fill={theme === 'dark' ? "#60A5FA" : "#4CAF50"} />
                  <path d="M 0 0 Q 0 -14 3 -24" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
                  {/* Leaf 4 (downward-left) */}
                  <path d="M 0 0 C -8 10, -18 14, -20 8 C -18 2, -10 -2, 0 0 Z" fill={theme === 'dark' ? "#0284C7" : "#1B5E20"} opacity="0.9" />
                </g>

                {/* Right Branch Foliage: Clustered Botanical Leaves */}
                <g transform={`translate(250, ${(333 + trunkTopY) / 2 - 22})`}>
                  {/* Leaf 1 (top-right) */}
                  <path d="M 0 0 C 12 -6, 20 -18, 14 -24 C 8 -22, 2 -12, 0 0 Z" fill={theme === 'dark' ? "#38BDF8" : "#2E7D32"} />
                  <path d="M 0 0 Q 10 -12 14 -22" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
                  {/* Leaf 2 (lateral-right) */}
                  <path d="M 0 0 C 14 4, 26 2, 26 -6 C 20 -10, 8 -4, 0 0 Z" fill={theme === 'dark' ? "#0080FF" : "#388E3C"} />
                  <path d="M 0 0 Q 14 2 24 -5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
                  {/* Leaf 3 (upright) */}
                  <path d="M 0 0 C 4 -12, 4 -24, -4 -26 C -10 -22, -6 -10, 0 0 Z" fill={theme === 'dark' ? "#60A5FA" : "#4CAF50"} />
                  <path d="M 0 0 Q 0 -14 -3 -24" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
                  {/* Leaf 4 (downward-right) */}
                  <path d="M 0 0 C 8 10, 18 14, 20 8 C 18 2, 10 -2, 0 0 Z" fill={theme === 'dark' ? "#0284C7" : "#1B5E20"} opacity="0.9" />
                </g>

                {/* Main Crown: Organic Billowing Foliage Clouds (Layer 1 - Deep Volume Shadow) */}
                <path 
                  d={`M ${195 - canopyW * 0.75} ${foliageCenterY + 12} 
                      C ${195 - canopyW * 1.05} ${foliageCenterY + 2}, ${195 - canopyW * 0.95} ${foliageCenterY - canopyH * 0.5}, ${195 - canopyW * 0.55} ${foliageCenterY - canopyH * 0.8} 
                      C ${195 - canopyW * 0.28} ${plantTipY - 8}, ${195 + canopyW * 0.28} ${plantTipY - 8}, ${195 + canopyW * 0.55} ${foliageCenterY - canopyH * 0.8} 
                      C ${195 + canopyW * 0.95} ${foliageCenterY - canopyH * 0.5}, ${195 + canopyW * 1.05} ${foliageCenterY + 2}, ${195 + canopyW * 0.75} ${foliageCenterY + 12} 
                      C ${195 + canopyW * 0.4} ${foliageCenterY + canopyH * 0.45}, ${195 - canopyW * 0.4} ${foliageCenterY + canopyH * 0.45}, ${195 - canopyW * 0.75} ${foliageCenterY + 12} Z`} 
                  fill={theme === 'dark' ? "#052238" : "#1B4D2E"} 
                  opacity="0.95" 
                />

                {/* Main Crown: Organic Mid-tone Foliage (Layer 2) */}
                <path 
                  d={`M ${195 - canopyW * 0.65} ${foliageCenterY + 8} 
                      C ${195 - canopyW * 0.88} ${foliageCenterY - 2}, ${195 - canopyW * 0.78} ${foliageCenterY - canopyH * 0.45}, ${195 - canopyW * 0.42} ${foliageCenterY - canopyH * 0.7} 
                      C ${195 - canopyW * 0.16} ${plantTipY - 2}, ${195 + canopyW * 0.16} ${plantTipY - 2}, ${195 + canopyW * 0.42} ${foliageCenterY - canopyH * 0.7} 
                      C ${195 + canopyW * 0.78} ${foliageCenterY - canopyH * 0.45}, ${195 + canopyW * 0.88} ${foliageCenterY - 2}, ${195 + canopyW * 0.65} ${foliageCenterY + 8} 
                      C ${195 + canopyW * 0.3} ${foliageCenterY + canopyH * 0.35}, ${195 - canopyW * 0.3} ${foliageCenterY + canopyH * 0.35}, ${195 - canopyW * 0.65} ${foliageCenterY + 8} Z`} 
                  fill={theme === 'dark' ? "url(#botanicalCanopyDark)" : "url(#botanicalCanopyLight)"} 
                  opacity="0.98" 
                />

                {/* Main Crown: Sunlight Highlight Leaf Lobes (Layer 3) */}
                <path 
                  d={`M ${195 - canopyW * 0.35} ${plantTipY + 22} 
                      C ${195 - canopyW * 0.5} ${plantTipY + 6}, ${195 - canopyW * 0.35} ${plantTipY - 4}, ${195} ${plantTipY - 6} 
                      C ${195 + canopyW * 0.35} ${plantTipY - 4}, ${195 + canopyW * 0.5} ${plantTipY + 6}, ${195 + canopyW * 0.35} ${plantTipY + 22} 
                      C ${195 + canopyW * 0.15} ${plantTipY + 28}, ${195 - canopyW * 0.15} ${plantTipY + 28}, ${195 - canopyW * 0.35} ${plantTipY + 22} Z`} 
                  fill={theme === 'dark' ? "#38BDF8" : "#81C784"} 
                  opacity="0.85" 
                />

                {/* Apex Leaf Crest reaching toward top milestone */}
                <path 
                  d={`M 195 ${plantTipY + 8} C 188 ${plantTipY - 6}, 184 ${plantTipY - 14}, 195 ${plantTipY - 20} C 206 ${plantTipY - 14}, 202 ${plantTipY - 6}, 195 ${plantTipY + 8} Z`} 
                  fill={theme === 'dark' ? "#BAE6FD" : "#C8E6C9"} 
                />
                <path 
                  d={`M 195 ${plantTipY + 8} L 195 ${plantTipY - 16}`} 
                  stroke="rgba(255,255,255,0.7)" 
                  strokeWidth="1" 
                  fill="none" 
                />
                <circle cx="195" cy={plantTipY - 18} r="2.2" fill="#fff" className="animate-ping" />

                {/* STAGE 4: Full Bloom Blossoming Flowers (Streak >= 14) */}
                {streak >= 14 && (
                  <g>
                    {/* Flower 1 - Left Crown */}
                    <g transform={`translate(${195 - canopyW * 0.35}, ${foliageCenterY - 10})`}>
                      {[0, 72, 144, 216, 288].map((angle) => (
                        <path key={angle} d="M 0 0 C -2.8 -4, -3.5 -8, 0 -10 C 3.5 -8, 2.8 -4, 0 0 Z" transform={`rotate(${angle})`} fill={theme === 'dark' ? "#F472B6" : "#FF69B4"} opacity="0.95" />
                      ))}
                      <circle cx="0" cy="0" r="2.4" fill="#FFD700" />
                    </g>
                    {/* Flower 2 - Right Crown */}
                    <g transform={`translate(${195 + canopyW * 0.38}, ${foliageCenterY - 6})`}>
                      {[0, 72, 144, 216, 288].map((angle) => (
                        <path key={angle} d="M 0 0 C -2.8 -4, -3.5 -8, 0 -10 C 3.5 -8, 2.8 -4, 0 0 Z" transform={`rotate(${angle})`} fill={theme === 'dark' ? "#F472B6" : "#FF69B4"} opacity="0.95" />
                      ))}
                      <circle cx="0" cy="0" r="2.4" fill="#FFD700" />
                    </g>
                    {/* Flower 3 - Apex Blossom */}
                    {streak >= 20 && (
                      <g transform={`translate(195, ${plantTipY + 12})`}>
                        {[0, 72, 144, 216, 288].map((angle) => (
                          <path key={angle} d="M 0 0 C -3.2 -5, -4 -9, 0 -11 C 4 -9, 3.2 -5, 0 0 Z" transform={`rotate(${angle})`} fill={theme === 'dark' ? "#FBCFE8" : "#FFF0F5"} opacity="0.98" />
                        ))}
                        <circle cx="0" cy="0" r="2.8" fill="#FFD700" />
                      </g>
                    )}
                    {/* Golden Pollen / Spores */}
                    {streak >= 30 && (
                      <g>
                        <circle cx={195 - canopyW * 0.5} cy={foliageCenterY - 24} r="2" fill="#FFD700" className="animate-ping" />
                        <circle cx={195 + canopyW * 0.5} cy={foliageCenterY - 28} r="2" fill="#FFD700" className="animate-pulse" />
                        <circle cx="195" cy={plantTipY - 24} r="2.5" fill="#FFD700" className="animate-ping" />
                      </g>
                    )}
                  </g>
                )}
              </g>
            )}

            {/* Dewdrop Water Droplets on Foliage (During Rainfall Hydration) */}
            {isHydrating && (
              <g>
                <path d={`M ${195 - 24} ${plantTipY + 16} C ${195 - 26} ${plantTipY + 19}, ${195 - 27} ${plantTipY + 21}, ${195 - 24} ${plantTipY + 23} C ${195 - 21} ${plantTipY + 21}, ${195 - 22} ${plantTipY + 19}, ${195 - 24} ${plantTipY + 16} Z`} fill="#38BDF8" className="animate-pulse" />
                <path d={`M ${195 + 26} ${plantTipY + 20} C ${195 + 24} ${plantTipY + 23}, ${195 + 23} ${plantTipY + 25}, ${195 + 26} ${plantTipY + 27} C ${195 + 29} ${plantTipY + 25}, ${195 + 28} ${plantTipY + 23}, ${195 + 26} ${plantTipY + 20} Z`} fill="#7DD3FC" className="animate-pulse" />
                <path d={`M 142 ${trunkTopY + 10} C 140 ${trunkTopY + 13}, 139 ${trunkTopY + 15}, 142 ${trunkTopY + 17} C 145 ${trunkTopY + 15}, 144 ${trunkTopY + 13}, 142 ${trunkTopY + 10} Z`} fill="#38BDF8" className="animate-ping" />
                <path d={`M 248 ${trunkTopY + 12} C 246 ${trunkTopY + 15}, 245 ${trunkTopY + 17}, 248 ${trunkTopY + 19} C 251 ${trunkTopY + 17}, 250 ${trunkTopY + 15}, 248 ${trunkTopY + 12} Z`} fill="#7DD3FC" className="animate-ping" />
              </g>
            )}
          </svg>
        </div>

        {/* One-Sentence Explanation on the empty blue space under the plant */}
        <div className="z-20 mt-auto w-full flex items-center justify-between gap-2.5 px-1 pt-1 pb-0.5">
          <p className={`text-[11px] sm:text-[11.5px] font-sans font-medium leading-tight flex-1 ${
            theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#2C4F70]'
          }`}>
            Unlock clouds by completing tasks - Click them to water plant and help it grow
          </p>
          <button
            type="button"
            onClick={() => setShowGrowthModal(true)}
            className="w-7 h-7 rounded-full bg-[#0080FF] hover:bg-[#0066CC] active:scale-90 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0"
            title="How to grow your tree guide"
            aria-label="How to grow your tree guide"
          >
            <Info className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {children}

      {/* Gamified Impact Progress Indicators */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
      }`}>
        <div className={`flex justify-between items-center border-b pb-2.5 ${
          theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
        }`}>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#0080FF]" />
            <h4 className={`text-xs font-sans font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'}`}>
              Community Challenge
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setShowGroupModal(true)}
            className="flex items-center gap-1 text-[11px] font-sans font-semibold text-[#0080FF] hover:underline cursor-pointer group"
          >
            <span>See Group Progress</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <p className={`text-xs font-sans leading-normal ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
          Your {goalTitle} habit fuels collective impact.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Square 1 (Left): Environment Impact Metric */}
          <div className={`py-4 px-3 sm:py-5 sm:px-4 rounded-[18px] text-center border flex flex-col justify-center items-center min-w-0 transition-all shadow-2xs ${
            theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
          }`}>
            <div className="w-full space-y-1.5 flex flex-col items-center justify-center">
              <span className={`text-xl sm:text-2xl font-mono font-bold tracking-tight block w-full text-center ${
                theme === 'dark' ? 'text-[#0080FF]' : 'text-[#0066CC]'
              }`}>
                {groupStats.planetMetricValue}
              </span>
              <span className={`text-xs sm:text-[13px] font-sans block leading-snug text-center max-w-[130px] ${
                theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                {groupStats.planetMetricSubtext}
              </span>
            </div>
          </div>

          {/* Square 2 (Right): Personal Advantage Metric */}
          <div className={`py-4 px-3 sm:py-5 sm:px-4 rounded-[18px] text-center border flex flex-col justify-center items-center min-w-0 transition-all shadow-2xs ${
            theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
          }`}>
            <div className="w-full space-y-1.5 flex flex-col items-center justify-center">
              <span className={`text-xl sm:text-2xl font-mono font-bold tracking-tight block w-full text-center ${
                theme === 'dark' ? 'text-emerald-400' : 'text-[#00875A]'
              }`}>
                {groupStats.personalMetricValue}
              </span>
              <span className={`text-xs sm:text-[13px] font-sans block leading-snug text-center max-w-[130px] ${
                theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                {groupStats.personalMetricSubtext}
              </span>
            </div>
          </div>
        </div>

        {/* Next Milestone & Estimated Days Explanation Box */}
        <div className={`p-3 rounded-[12px] border flex flex-col gap-1.5 transition-colors ${
          theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F2F8FF] border-[#BDE0FE]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-bold text-[#0080FF] flex items-center gap-1.5">
              <span>🎯</span> Next Milestone: {currentMilestone.stageName}
            </span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#0080FF]/15 text-[#0080FF]">
              {individualEnergy} / {currentMilestone.targetTasks} clouds
            </span>
          </div>
          <p className={`text-xs leading-relaxed font-sans ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#5C6C7E]'}`}>
            Click <strong className={theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'}>{tasksRemaining} more {tasksRemaining === 1 ? 'cloud' : 'clouds'}</strong> to reach <strong>{currentMilestone.stageName}</strong> (estimated in <strong className={theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'}>{isWeekly && daysToNext >= 7 ? `~${Math.ceil(daysToNext / 7)} ${Math.ceil(daysToNext / 7)} === 1 ? 'week' : 'weeks'}` : `~${daysToNext} ${daysToNext === 1 ? 'day' : 'days'}`}</strong>).
          </p>
          <p className={`text-[11px] font-sans leading-normal pt-1 border-t border-dashed ${
            theme === 'dark' ? 'border-[#1F1F24] text-[#8E8E93]' : 'border-[#BDE0FE] text-[#6C6C70]'
          }`}>
            {groupStats.dualExplanation}
          </p>
        </div>
      </div>

      {/* Group Progress & Standing Modal */}
      <AnimatePresence>
        {showGroupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`w-full max-w-sm rounded-[24px] border shadow-2xl p-5 overflow-hidden flex flex-col gap-4 max-h-[90%] overflow-y-auto ${
                theme === 'dark' 
                  ? 'bg-[#121214] border-[#1F1F24] text-white' 
                  : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-base font-sans font-bold leading-tight">
                    Group Progress & Standing
                  </h3>
                  <p className={`text-xs font-sans ${theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                    {groupStats.groupName} • {groupStats.activeMembers} members
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className={`p-1.5 -mr-1.5 -mt-1 rounded-full transition-colors cursor-pointer ${
                    theme === 'dark' ? 'hover:bg-[#1F1F24] text-[#8E8E93] hover:text-white' : 'hover:bg-[#F2F2F7] text-[#6C6C70] hover:text-[#1C1C1E]'
                  }`}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Team Milestone Progress */}
              <div className={`p-4 rounded-[16px] border flex flex-col gap-2.5 ${
                theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                  }`}>
                    TEAM MILESTONE
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0080FF]">
                    Milestone {nextMilestoneNum} ({teamMilestoneProgressPercent}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-[#1F1F24]' : 'bg-[#E5E5EA]'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${teamMilestoneProgressPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#0080FF] to-[#3892FF] rounded-full"
                  />
                </div>

                <div className={`flex items-center justify-between text-[11px] font-sans ${
                  theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                }`}>
                  <span className="font-mono">{groupStats.collectiveTasks.toLocaleString()} / {nextMilestoneCloudsTarget.toLocaleString()} clouds clicked</span>
                  <span>~{daysToTeamMilestone} {daysToTeamMilestone === 1 ? 'day' : 'days'} left</span>
                </div>
              </div>

              {/* Individual Standing */}
              <div className={`p-4 rounded-[16px] border flex flex-col gap-3 ${
                theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                  }`}>
                    YOUR STANDING
                  </span>
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#0080FF]/10 text-[#0080FF]">
                    {userTier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className={`py-2.5 px-3 rounded-[12px] border ${
                    theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
                  }`}>
                    <span className={`text-[10px] font-sans block ${theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                      You
                    </span>
                    <span className="text-lg font-serif font-bold text-[#0080FF] block mt-0.5">
                      {individualEnergy} {individualEnergy === 1 ? 'cloud clicked' : 'clouds clicked'}
                    </span>
                  </div>

                  <div className={`py-2.5 px-3 rounded-[12px] border ${
                    theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
                  }`}>
                    <span className={`text-[10px] font-sans block ${theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                      Team Median
                    </span>
                    <span className={`text-lg font-serif font-bold block mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'}`}>
                      {teamAverageClouds} clouds clicked
                    </span>
                  </div>
                </div>

                <p className={`text-xs font-sans text-center leading-normal ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  {userVsTeamDiff > 0 ? (
                    <span>You're <strong className="text-[#34C759]">+{userVsTeamDiff}%</strong> above the team median.</span>
                  ) : userVsTeamDiff < 0 ? (
                    <span>You're <strong className="text-[#0080FF]">{Math.abs(userVsTeamDiff)}%</strong> from the team median.</span>
                  ) : (
                    <span>You're right at the team median.</span>
                  )}
                </p>
              </div>

              {/* Done Button */}
              <button
                type="button"
                onClick={() => setShowGroupModal(false)}
                className="w-full h-11 bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] text-white text-xs font-sans font-semibold rounded-full transition-all cursor-pointer shadow-xs"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pop-up Panel Modal: "How to Grow Your Tree" Infographic Card */}
      <AnimatePresence>
        {showGrowthModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowGrowthModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`w-full max-w-sm rounded-[24px] border p-5 shadow-2xl relative flex flex-col gap-4 overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-[#121214] border-[#1F1F24] text-white shadow-black/80' 
                  : 'bg-white border-[#E5E5EA] text-[#1C1C1E] shadow-xl'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#0080FF]/15 flex items-center justify-center text-[#0080FF] shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold leading-tight">
                      How to Grow Your Tree
                    </h3>
                    <p className={`text-xs font-sans mt-0.5 ${
                      theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                    }`}>
                      {isWeekly ? 'The weekly habit growth loop' : 'The daily habit growth loop'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGrowthModal(false)}
                  className={`p-1.5 -mr-1 -mt-1 rounded-full transition-colors cursor-pointer ${
                    theme === 'dark' ? 'text-[#8E8E93] hover:text-white hover:bg-white/10' : 'text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-black/5'
                  }`}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3-Step Infographic Flow */}
              <div className="flex flex-col gap-2.5 pt-1">
                {/* Step 1 */}
                <div className={`p-3 rounded-[16px] border flex items-center gap-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
                }`}>
                  <div className="w-9 h-9 rounded-full bg-[#34C759]/15 flex items-center justify-center text-[#34C759] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-sans font-bold block leading-tight">
                      1. Complete a Task
                    </span>
                    <p className={`text-[11px] font-sans leading-normal mt-0.5 ${
                      theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                    }`}>
                      {isWeekly 
                        ? 'Check off your weekly habit in the checklist to log completed actions.'
                        : 'Check off your daily habit in the checklist to log completed actions.'}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`p-3 rounded-[16px] border flex items-center gap-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
                }`}>
                  <div className="w-9 h-9 rounded-full bg-[#3892FF]/15 flex items-center justify-center text-[#3892FF] shrink-0">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-sans font-bold block leading-tight">
                      2. Unlock Energy Clouds
                    </span>
                    <p className={`text-[11px] font-sans leading-normal mt-0.5 ${
                      theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                    }`}>
                      Completed tasks release floating energy clouds in the sky above.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`p-3 rounded-[16px] border flex items-center gap-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
                }`}>
                  <div className="w-9 h-9 rounded-full bg-[#0080FF]/15 flex items-center justify-center text-[#0080FF] shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-sans font-bold block leading-tight">
                      3. Tap Cloud to Water
                    </span>
                    <p className={`text-[11px] font-sans leading-normal mt-0.5 ${
                      theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                    }`}>
                      Click any cloud to trigger rainfall, nourish your tree, and watch it grow! Clicking enough clouds over time advances you to the next milestone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setShowGrowthModal(false)}
                className="w-full h-11 bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] text-white text-xs font-sans font-bold rounded-full transition-all cursor-pointer shadow-xs mt-1"
              >
                Got it, let's grow!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
