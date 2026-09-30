import React, { useState, useEffect } from 'react';
import { Trophy, ShieldCheck, Heart, Sparkles, Zap, Users, Flame, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
}

interface Milestone {
  days: number;
  label: string;
  y: number;
}

interface Milestone {
  days: number;
  label: string;
  stageName: string;
}

const STAGE_CONFIG = [
  { maxDays: 3, prevDays: 0, label: '3d Sprout', stageName: 'Sprout' },
  { maxDays: 7, prevDays: 3, label: '7d Sapling', stageName: 'Sapling' },
  { maxDays: 14, prevDays: 7, label: '14d Canopy', stageName: 'Canopy' },
  { maxDays: 30, prevDays: 14, label: '30d Bloom', stageName: 'Full Bloom' }
];

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
  children
}: EcosystemVisualizationProps) {
  const [raindrops, setRaindrops] = useState<{ id: string; startX: number; startY: number; targetX: number; delay: number; size: number }[]>([]);
  const [isHydrating, setIsHydrating] = useState<boolean>(false);
  const [hydrationMessage, setHydrationMessage] = useState<string>('');

  // Target milestone is anchored slightly lower than the Habits energy label (y = 74)
  const currentStage = STAGE_CONFIG.find(s => streak < s.maxDays) || STAGE_CONFIG[STAGE_CONFIG.length - 1];
  const targetMilestoneY = 74;
  const nextMilestone = { days: currentStage.maxDays, label: currentStage.label, y: targetMilestoneY, stageName: currentStage.stageName };
  const isMastered = streak >= 30;
  const daysToNext = isMastered ? 0 : Math.max(0, currentStage.maxDays - streak);

  // Progress within the current milestone stage (0.0 to 1.0)
  const stageSpan = currentStage.maxDays - currentStage.prevDays;
  const stageProgress = isMastered 
    ? 1 
    : Math.min(1, Math.max(0, (streak - currentStage.prevDays) / stageSpan));

  // Dynamic botanical scaling: plant grows upward toward the milestone line (y = 74)
  const stageBaseTipY = 
    streak < 3 ? 295 :
    streak < 7 ? 225 :
    streak < 14 ? 160 :
    115;

  const stageTargetTipY = 
    streak < 3 ? 200 :
    streak < 7 ? 140 :
    streak < 14 ? 96 :
    targetMilestoneY;

  const plantTipY = isMastered 
    ? targetMilestoneY 
    : Math.round(stageBaseTipY - stageProgress * (stageBaseTipY - stageTargetTipY));

  const trunkTopY = Math.min(322, Math.round(plantTipY + (streak === 0 ? 16 : streak < 3 ? 24 : streak < 7 ? 40 : streak < 14 ? 54 : 66)));
  const foliageCenterY = Math.round((plantTipY + trunkTopY) / 2);
  const canopyW = Math.min(68, Math.round(26 + streak * 1.4));
  const canopyH = Math.min(60, Math.round(22 + streak * 1.3));

  const handlePopBubble = (id: number, value: number, cx: number, cy: number) => {
    setIndividualEnergy(prev => prev + value);
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
    setHydrationMessage(`+${value}g Hydrated! 💧`);

    // Clear drops after animation
    setTimeout(() => {
      setRaindrops(prev => prev.filter(r => !newRaindrops.some(nr => nr.id === r.id)));
    }, 1100);

    setTimeout(() => {
      setIsHydrating(false);
    }, 1400);
  };

  // Group stats mapped to categories
  const groupStats = {
    'Environment': {
      groupName: 'The Plant-Forward Kitchen & Active Travelers',
      subgroup: 'Environmental Challenge Group',
      activeMembers: '24,198',
      collectiveScore: 762340 + streak * 140,
      resourceLabel: 'CO2 emissions offset',
      resourceValue: `${(125480 + (individualEnergy * 2.3)).toLocaleString(undefined, { maximumFractionDigits: 0 })} kg`,
      visualColor: 'from-[#0285ff]/30 to-emerald-500/20'
    },
    'Well-Being': {
      groupName: 'Universal Vitality & Digital Mindfulness',
      subgroup: 'Well-Being Challenge Group',
      activeMembers: '18,402',
      collectiveScore: 341200 + streak * 98,
      resourceLabel: 'Focused hours reclaimed',
      resourceValue: `${(48910 + (individualEnergy * 0.4)).toLocaleString(undefined, { maximumFractionDigits: 0 })} hrs`,
      visualColor: 'from-[#0285ff]/30 to-indigo-500/20'
    },
    'Compassion': {
      groupName: 'Everyday Kindness & Food Security allies',
      subgroup: 'Kindness Challenge Group',
      activeMembers: '15,221',
      collectiveScore: 182340 + streak * 74,
      resourceLabel: 'Stranger interactions & support logs',
      resourceValue: `${(54290 + individualEnergy).toLocaleString()} acts`,
      visualColor: 'from-[#0285ff]/30 to-pink-500/20'
    },
    'Responsible AI': {
      groupName: 'Cognitive Integrity & AI Fact-Checkers',
      subgroup: 'Mindful AI Challenge Group',
      activeMembers: '9,812',
      collectiveScore: 98420 + streak * 52,
      resourceLabel: 'Server compute cycles saved',
      resourceValue: `${(5400000 + (individualEnergy * 150)).toLocaleString()} units`,
      visualColor: 'from-[#0285ff]/30 to-teal-500/20'
    }
  }[category];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Interactive Alipay-Style Ant Forest Stage */}
      <div className={`relative w-full h-[370px] rounded-[20px] overflow-hidden flex flex-col justify-between p-4 transition-all duration-300 border ${
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
            <span className={`text-[9px] font-mono uppercase tracking-widest font-bold block ${
              theme === 'dark' ? 'text-[#98989D]' : 'text-[#5C6C7E]'
            }`}>HABIT ENERGY</span>
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#0080FF] fill-[#0080FF]" />
              <span className={`text-sm font-serif font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
              }`}>{individualEnergy} g</span>
            </div>
          </div>

          <div className={`text-right space-y-0.5 p-2 px-3 rounded-full border backdrop-blur-md ${
            theme === 'dark' ? 'bg-[#121214]/80 border-[#1F1F24]' : 'bg-white/90 border-[#BDE0FE] shadow-2xs'
          }`}>
            <span className={`text-[9px] font-mono uppercase tracking-widest font-bold block ${
              theme === 'dark' ? 'text-[#98989D]' : 'text-[#5C6C7E]'
            }`}>GROUP PROGRESS</span>
            <div className="flex items-center gap-1 justify-end">
              <Users className="w-3.5 h-3.5 text-[#0080FF]" />
              <span className={`text-xs font-sans font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
              }`}>Level {Math.floor(groupStats.collectiveScore / 100000)}</span>
            </div>
          </div>
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

                    {/* Centered Energy Amount (+10g) & Type Tag */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-0.5 pointer-events-none">
                      <span className={`text-[11px] font-mono font-bold tracking-tight leading-none ${
                        bubble.isNew
                          ? 'text-[#0080FF] font-extrabold'
                          : theme === 'dark' ? 'text-white' : 'text-[#0080FF]'
                      }`}>
                        +{bubble.value}g
                      </span>
                      <span className={`text-[7px] font-sans font-bold uppercase tracking-wider leading-none mt-1 ${
                        theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>
                        {bubble.type}
                      </span>
                    </div>

                    {bubble.isNew && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[7px] font-mono font-bold uppercase tracking-wide bg-[#0080FF] text-white rounded-full shadow-xs">
                        NEW
                      </span>
                    )}
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
                top: '78%', // Hits the plant level
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
          className="absolute inset-0 flex justify-center pointer-events-none z-10"
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

                {/* Milestone label with larger, prominent text */}
                <text 
                  x="34" 
                  y={targetMilestoneY - 6} 
                  fontSize="12" 
                  fontFamily="monospace" 
                  fontWeight="bold" 
                  fill="#0080FF"
                  className="select-none tracking-wide"
                >
                  NEXT MILESTONE: {nextMilestone.days}D {nextMilestone.stageName?.toUpperCase() || 'STAGE'} ({daysToNext}d left)
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
                  x="34" 
                  y={targetMilestoneY - 6} 
                  fontSize="12" 
                  fontFamily="monospace" 
                  fontWeight="bold" 
                  fill="#34C759"
                  className="select-none tracking-wide"
                >
                  MILESTONE REACHED: 30D FULL BLOOM 🌟
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

        {/* Bottom banner warning and hints */}
        <div className="absolute inset-x-0 bottom-2 flex flex-col items-center justify-center z-10 px-4 text-center">
          <p className={`text-[10px] font-sans font-semibold tracking-wide flex flex-col sm:flex-row items-center gap-1 p-1 px-3.5 rounded-full border backdrop-blur-md ${
            theme === 'dark' ? 'bg-[#121214]/90 border-[#1F1F24] text-white' : 'bg-white/90 border-[#BDE0FE] text-[#1C1C1E] shadow-2xs'
          }`}>
            <span className={hasLoggedToday ? "text-[#0080FF]" : "text-[#FF9500]"}>
              {hasLoggedToday ? "💧 Ecosystem hydrated!" : "🌱 Nurture your plant today!"}
            </span>
            <span className="text-[#98989D] sm:before:content-['•'] sm:before:mx-1">
              {streak >= 30 
                ? "Full Bloom reached! Keep your streak alive." 
                : `${daysToNext} ${daysToNext === 1 ? 'day' : 'days'} to ${nextMilestone.label}`}
            </span>
          </p>
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
          <span className={`text-[10px] font-mono uppercase font-semibold ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>90-Day Campaign</span>
        </div>

        <div className="space-y-1">
          <p className={`text-xs font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'}`}>
            {groupStats.groupName}
          </p>
          <p className={`text-xs font-sans leading-normal ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
            Your daily {goalTitle} habit fuels collective impact.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className={`p-3 border rounded-[14px] text-center space-y-0.5 ${
            theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
          }`}>
            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>GROUP SCORE</span>
            <span className="text-sm font-serif text-[#0080FF] font-semibold block">
              {groupStats.collectiveScore.toLocaleString()} pts
            </span>
          </div>

          <div className={`p-3 border rounded-[14px] text-center space-y-0.5 ${
            theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
          }`}>
            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>{groupStats.resourceLabel.toUpperCase()}</span>
            <span className={`text-sm font-serif font-semibold block ${theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'}`}>
              {groupStats.resourceValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
