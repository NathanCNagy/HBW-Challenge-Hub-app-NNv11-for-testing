import React, { useState } from 'react';
import { Goal, QuizAnswers, ImplementationOption } from '../types';
import { RefreshCw, Trophy, Sparkles, ArrowRight, Zap, CheckCircle2, Sliders, Gauge, Info, ShieldCheck, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HBWLogo from './HBWLogo';
import { useHabit } from '../context/HabitContext';
import { formatImpactMetric } from '../utils/units';

interface GoalRecommendationsProps {
  answers: QuizAnswers;
  topGoal: Goal;
  alternatives?: Goal[];
  onCommit: (selectedGoal: Goal) => void;
  onReset: () => void;
  hasAI: boolean;
  theme?: 'dark' | 'light';
}

export default function GoalRecommendations({ answers, topGoal, onCommit, onReset, hasAI, theme = 'light' }: GoalRecommendationsProps) {
  const { unitSystem } = useHabit();
  // Active goal selected among the pillars
  const [activeGoal] = useState<Goal>(topGoal);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState<boolean>(false);
  const isDark = theme === 'dark';

  // Selected implementation option within the active goal
  const [selectedOption, setSelectedOption] = useState<ImplementationOption>(
    activeGoal.selectedOption || activeGoal.implementationOptions[0]
  );

  const handleOptionChange = (option: ImplementationOption) => {
    setSelectedOption(option);
  };

  const handleFinalCommit = () => {
    const committedGoal: Goal = {
      ...activeGoal,
      action: `${selectedOption.title}: ${selectedOption.description}`,
      selectedOption: selectedOption
    };
    onCommit(committedGoal);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onReset}
          className={`p-1 -ml-1 transition-colors cursor-pointer ${
            isDark ? 'text-[#8E8E93] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
          }`}
          aria-label="Go back to focus area selection"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <HBWLogo size="md" theme={isDark ? 'dark' : 'light'} />

        <div className="w-5 h-5" />
      </div>

      {/* Top Header */}
      <div className="space-y-2 text-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase ${
          isDark ? 'bg-[#0080FF]/15 border border-[#0080FF]/30 text-[#0080FF]' : 'bg-[#E5F1FF] border border-[#0080FF]/30 text-[#0066CC]'
        }`}>
          <Trophy className="w-3.5 h-3.5" />
          Recommended Habit Plan
        </div>
        <h2 className={`text-2xl font-serif font-normal tracking-tight sm:text-3xl ${
          isDark ? 'text-white' : 'text-[#1C1C1E]'
        }`}>
          Your 3-Month <i className="italic font-serif">Plan</i>
        </h2>
        <p className={`text-xs sm:text-sm max-w-md mx-auto font-sans leading-relaxed ${
          isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
        }`}>
          Your top-impact habit for <strong className={isDark ? 'text-white' : 'text-[#1C1C1E]'}>{activeGoal.category}</strong>. Adjust your schedule below to fit your daily routine.
        </p>
      </div>

      {/* Main Card */}
      <motion.div
        layout
        className={`relative rounded-[20px] p-5 sm:p-6 border-2 border-[#0080FF] overflow-hidden flex flex-col gap-5 ${
          isDark
            ? 'bg-[#121214] text-white shadow-2xl'
            : 'bg-white text-[#1C1C1E] shadow-lg border-2 border-[#0080FF]'
        }`}
      >
        {/* Ambient top-right gradient design (replaces hard circle outline) */}
        <div 
          className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(circle at 100% 0%, rgba(0, 128, 255, 0.25) 0%, rgba(0, 128, 255, 0.08) 40%, rgba(0, 128, 255, 0.01) 65%, transparent 75%)'
              : 'radial-gradient(circle at 100% 0%, rgba(0, 128, 255, 0.18) 0%, rgba(0, 128, 255, 0.06) 45%, rgba(0, 128, 255, 0.01) 70%, transparent 80%)'
          }}
          aria-hidden="true"
        />

        {/* Card Header: Centered & Space-Optimized */}
        <div className="flex flex-col items-center text-center gap-2 z-10 w-full">
          {/* Habit Title */}
          <div className="space-y-1.5 max-w-xl mx-auto">
            <h3 className={`text-2xl sm:text-3xl font-serif font-normal leading-tight tracking-tight ${
              isDark ? 'text-white' : 'text-[#1C1C1E]'
            }`}>
              {activeGoal.title}
            </h3>
            {activeGoal.action && (
              <p className={`text-xs sm:text-sm font-sans max-w-md mx-auto leading-relaxed ${
                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                {activeGoal.action}
              </p>
            )}
          </div>
        </div>

        {/* Demographic Resonance Callout */}
        {activeGoal.demographicInsight && (
          <div className={`p-3.5 rounded-[14px] flex items-start gap-3 z-10 border ${
            isDark
              ? 'bg-[#0A0A0C] border-[#1F1F24]'
              : 'bg-[#F9F9FB] border-[#E5E5EA]'
          }`}>
            <ShieldCheck className="w-5 h-5 text-[#0080FF] shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0080FF] block">
                Tailored for {answers.gender || 'You'} ({answers.age || '28'} yrs)
              </span>
              <p className={`text-xs font-sans leading-relaxed ${
                isDark ? 'text-[#E5E5EA]' : 'text-[#2C2C2E]'
              }`}>
                {unitSystem === 'metric'
                  ? activeGoal.demographicInsight
                      .replace(/460\s*fewer\s*miles/gi, '740 fewer km')
                      .replace(/hundreds\s*of\s*driving\s*miles/gi, 'hundreds of driving km')
                      .replace(/hundreds\s*of\s*miles/gi, 'hundreds of km')
                      .replace(/\bmiles\b/gi, 'km')
                  : activeGoal.demographicInsight
                      .replace(/460\s*fewer\s*miles/gi, '460 fewer mi')
                      .replace(/\bmiles\b/gi, 'mi')}
              </p>
            </div>
          </div>
        )}

        {/* IMPLEMENTATION TUNER (EXPANDABLE) */}
        <div className={`z-10 pt-4 space-y-2 border-t ${
          isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
        }`}>
          {/* Micro-explanation callout */}
          <div className={`text-[11px] font-sans font-medium px-0.5 ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}>
            <span>Adapt plan to work for you</span>
          </div>

          {/* Accordion Header / Trigger Button */}
          <button
            type="button"
            id="toggle-schedule-tuner-btn"
            onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
            className={`w-full flex items-center justify-between p-4 rounded-[16px] transition-all cursor-pointer group text-left ${
              isScheduleExpanded
                ? isDark
                  ? 'bg-[#0A0A0C] border-2 border-[#0080FF] shadow-md'
                  : 'bg-[#F2F8FF] border-2 border-[#0080FF] shadow-xs'
                : isDark
                ? 'bg-[#0A0A0C] hover:bg-[#121214] border border-[#1F1F24] hover:border-[#0080FF]/60'
                : 'bg-[#F9F9FB] hover:bg-[#F2F2F7] border border-[#E5E5EA] hover:border-[#0080FF]/60'
            }`}
          >
            <div className="space-y-1.5 flex-1 min-w-0 pr-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className={`text-sm font-sans font-bold ${
                  isDark ? 'text-white' : 'text-[#1C1C1E]'
                }`}>
                  Choose Your Pace
                </h4>
                <span className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                  isDark ? 'bg-[#0080FF]/15 text-[#0080FF]' : 'bg-[#E5F1FF] text-[#0066CC]'
                }`}>
                  {selectedOption.title.split('(')[0].trim()}
                </span>
              </div>
              <p className={`text-xs font-sans leading-relaxed ${
                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                {isScheduleExpanded
                  ? 'Select the frequency that feels easiest to start with.'
                  : `Currently: ${selectedOption.scheduleText} · Tap to change`}
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
                className="overflow-hidden space-y-3 pt-2"
              >
                <div className={`p-3 rounded-[12px] text-xs leading-relaxed flex items-start gap-2 border ${
                  isDark
                    ? 'bg-[#0A0A0C]/80 border-[#1F1F24] text-[#98989D]'
                    : 'bg-[#F2F2F7] border-[#E5E5EA] text-[#6C6C70]'
                }`}>
                  <Info className="w-4 h-4 text-[#0080FF] shrink-0 mt-0.5" />
                  <span>
                    <strong className={isDark ? 'text-white font-medium' : 'text-[#1C1C1E] font-semibold'}>Quick tip:</strong> Starting small makes habits stick. Pick what feels 100% doable today—you can always level up later.
                  </span>
                </div>

                {/* Implementation Options Radio List */}
                <div className="space-y-2">
                  {activeGoal.implementationOptions.map((option) => {
                    const isSelected = selectedOption.id === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleOptionChange(option)}
                        className={`w-full p-3.5 rounded-[14px] border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-[#0A0A0C] border-2 border-[#0080FF] shadow-sm'
                              : 'bg-[#F2F8FF] border-2 border-[#0080FF] shadow-xs'
                            : isDark
                            ? 'bg-[#0A0A0C]/50 border-[#1F1F24] hover:border-[#0080FF]/40'
                            : 'bg-white border-[#E5E5EA] hover:border-[#0080FF]/40 shadow-2xs'
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#0080FF] bg-[#0080FF]'
                            : isDark ? 'border-[#636366]' : 'border-[#C7C7CC]'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className={`text-xs font-sans font-bold ${
                              isSelected
                                ? isDark ? 'text-white' : 'text-[#1C1C1E]'
                                : isDark ? 'text-[#E5E5EA]' : 'text-[#2C2C2E]'
                            }`}>
                              {option.title}
                            </span>
                            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? isDark ? 'bg-[#0080FF]/20 text-[#0080FF] border border-[#0080FF]/30' : 'bg-[#E5F1FF] text-[#0066CC] border border-[#0080FF]/30'
                                : isDark ? 'bg-[#121214] text-[#8E8E93]' : 'bg-[#F2F2F7] text-[#6C6C70]'
                            }`}>
                              {option.foggAbilityRating}
                            </span>
                          </div>

                          <p className={`text-xs font-sans leading-normal ${
                            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
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

        {/* LIVE IMPACT RECALCULATOR DASHBOARD */}
        <div className={`space-y-2.5 z-10 border-t pt-4 ${
          isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <Zap className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400 fill-amber-400' : 'text-amber-600 fill-amber-600'}`} />
              <h4 className={`text-sm font-mono font-bold uppercase tracking-wider ${
                isDark ? 'text-amber-400' : 'text-amber-700'
              }`}>
                3-MONTH IMPACT
              </h4>
            </div>
            <span className={`text-xs ${isDark ? 'text-[#48484A]' : 'text-[#AEAEB2]'}`}>•</span>
            <span className={`text-xs font-mono font-medium ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
              Pace: {Math.round(selectedOption.impactMultiplier * 100)}%
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedOption.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-2 gap-2.5 sm:gap-3"
            >
              {/* Primary Metric: Planetary / Community */}
              {(() => {
                const primaryMetric = formatImpactMetric(
                  selectedOption.metrics.primaryUnit,
                  selectedOption.metrics.primaryValue,
                  unitSystem
                );
                const secondaryMetric = formatImpactMetric(
                  selectedOption.metrics.secondaryUnit,
                  selectedOption.metrics.secondaryValue,
                  unitSystem
                );
                return (
                  <>
                    <div className={`py-4 px-3 sm:py-4.5 sm:px-4 rounded-[16px] text-center border flex flex-col justify-center items-center min-w-0 transition-all ${
                      isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
                    }`}>
                      <div className="w-full space-y-1">
                        <span className={`text-lg sm:text-xl font-mono font-bold tracking-tight block w-full whitespace-nowrap overflow-hidden text-ellipsis ${
                          isDark ? 'text-[#0080FF]' : 'text-[#0066CC]'
                        }`}>
                          {primaryMetric.display}
                        </span>
                        <span className={`text-[11px] sm:text-xs font-sans block leading-tight text-center ${
                          isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                        }`}>
                          {selectedOption.metrics.primaryLabel}
                        </span>
                      </div>
                    </div>

                    {/* Secondary Metric: Personal */}
                    <div className={`py-4 px-3 sm:py-4.5 sm:px-4 rounded-[16px] text-center border flex flex-col justify-center items-center min-w-0 transition-all ${
                      isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F9F9FB] border-[#E5E5EA]'
                    }`}>
                      <div className="w-full space-y-1">
                        <span className={`text-lg sm:text-xl font-mono font-bold tracking-tight block w-full whitespace-nowrap overflow-hidden text-ellipsis ${
                          isDark ? 'text-emerald-400' : 'text-emerald-700'
                        }`}>
                          {secondaryMetric.display}
                        </span>
                        <span className={`text-[11px] sm:text-xs font-sans block leading-tight text-center ${
                          isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                        }`}>
                          {selectedOption.metrics.secondaryLabel}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Commitment Action */}
        <div className="z-10 pt-2 shrink-0 flex justify-center w-full">
          <button
            id="commit-challenge-btn"
            onClick={handleFinalCommit}
            className="w-full h-[52px] px-6 bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] text-white font-sans font-semibold text-[15px] rounded-full transition-all flex items-center justify-center cursor-pointer shadow-md"
          >
            <div className="inline-flex items-center justify-center gap-2.5 min-w-0 max-w-full">
              <span className="truncate leading-none">Start Habit: {selectedOption.scheduleText}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </div>
          </button>
        </div>
      </motion.div>

      {/* Redo Onboarding / Adjust Plan */}
      <div className="flex justify-center pt-2 shrink-0">
        <button
          id="redo-quiz-btn"
          onClick={onReset}
          className={`h-[44px] px-5 flex items-center gap-2 font-sans font-medium text-[13px] rounded-full border transition-all cursor-pointer ${
            isDark
              ? 'text-[#98989D] hover:text-white bg-transparent hover:bg-[#121214] border-[#1F1F24]'
              : 'text-[#6C6C70] hover:text-[#1C1C1E] bg-transparent hover:bg-white border-[#E5E5EA] shadow-2xs'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Change Profile or Plan</span>
        </button>
      </div>
    </div>
  );
}
