import React, { useState } from 'react';
import { QuizAnswers, Category, Goal, ImplementationOption } from '../types';
import { 
  Leaf, 
  Heart, 
  Bot, 
  Activity, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Zap, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HBWLogo from './HBWLogo';
import { TOP_IMPACT_GOALS, getDemographicResonance, buildRoutineOption, EffortTier, CATEGORY_EFFORT_CONFIGS } from '../data';
import { useHabit } from '../context/HabitContext';
import { formatImpactMetric } from '../utils/units';
import { resolveProfileTags } from '../utils/profileTags';

interface OnboardingQuizProps {
  answers: QuizAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<QuizAnswers>>;
  onSubmit: () => void;
  isLoading: boolean;
  skipDemographics?: boolean;
  theme?: 'dark' | 'light';
  onBack?: () => void;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onCommitGoal?: (goal: Goal) => void;
}

export default function OnboardingQuiz({ 
  answers, 
  setAnswers, 
  onSubmit, 
  isLoading, 
  skipDemographics = false, 
  theme = 'light', 
  onBack, 
  initialStep = 1, 
  onStepChange,
  onCommitGoal
}: OnboardingQuizProps) {
  const { unitSystem } = useHabit();
  const [step, setStep] = useState<number>(skipDemographics ? 2 : initialStep);
  const isDark = theme === 'dark';

  // Category accordion state: start with current category expanded so users immediately see details
  const [expandedCategory, setExpandedCategory] = useState<Category | null>(() => {
    return answers.categories?.[0] || 'Environment';
  });

  // Track effort tier ('more' or 'less') for each category
  const [effortTierMap, setEffortTierMap] = useState<Record<Category, EffortTier>>({
    'Compassion': 'more',
    'Environment': 'more',
    'Responsible AI': 'more',
    'Well-Being': 'more'
  });

  // Track weekly commitment (1 to 5 days) for each category
  const [daysPerWeekMap, setDaysPerWeekMap] = useState<Record<Category, number>>({
    'Compassion': 3,
    'Environment': 2,
    'Responsible AI': 3,
    'Well-Being': 5
  });

  React.useEffect(() => {
    if (initialStep) {
      setStep(skipDemographics ? 2 : initialStep);
    }
  }, [initialStep, skipDemographics]);

  // Synchronize expanded category if answers.categories changes from outside
  React.useEffect(() => {
    if (answers.categories?.[0] && answers.categories[0] !== expandedCategory && !expandedCategory) {
      setExpandedCategory(answers.categories[0]);
    }
  }, [answers.categories]);

  // Validate step inputs
  const isStep1Valid = answers.age.trim() !== '' && answers.gender !== '';
  const activeCategory: Category | null = expandedCategory || answers.categories?.[0] || null;
  const isStep2Valid = Boolean(activeCategory);

  const handleCommitThisGoal = (categoryName: Category) => {
    const goal = TOP_IMPACT_GOALS[categoryName];
    const demographicInsight = getDemographicResonance(categoryName, answers.age, answers.gender);
    const effort = effortTierMap[categoryName] || 'more';
    const days = daysPerWeekMap[categoryName] || 3;
    const chosenOption = buildRoutineOption(categoryName, effort, days);
    const committedGoal: Goal = {
      ...goal,
      demographicInsight,
      selectedOption: chosenOption,
      action: `${chosenOption.title}: ${chosenOption.description}`
    };

    setAnswers(prev => ({
      ...prev,
      categories: [categoryName]
    }));

    if (onCommitGoal) {
      onCommitGoal(committedGoal);
    } else {
      onSubmit();
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const nextS = 2;
      setStep(nextS);
      onStepChange?.(nextS);
      if (!expandedCategory) {
        setExpandedCategory(answers.categories?.[0] || 'Environment');
      }
    } else {
      if (activeCategory) {
        handleCommitThisGoal(activeCategory);
      } else {
        onSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1 && !skipDemographics) {
      const prevS = step - 1;
      setStep(prevS);
      onStepChange?.(prevS);
    } else if (onBack) {
      onBack();
    }
  };

  const handleToggleCategory = (categoryName: Category) => {
    // If clicking the already expanded one, toggle collapse
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
      setAnswers(prev => ({ ...prev, categories: [categoryName] }));
      setTimeout(() => {
        const el = document.getElementById(`category-accordion-${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 60);
    }
  };

  const ageRanges = ['18–24', '25–34', '35–44', '45–54', '55–64', '65–69', '70+'];
  const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

  const categories: { name: Category; title: string; description: string; icon: React.ReactNode }[] = [
    {
      name: 'Compassion',
      title: 'Compassion',
      description: 'Cultivate kindness and community connection',
      icon: <Heart className="w-5 h-5 text-[#8E8E93]" />
    },
    {
      name: 'Environment',
      title: 'Environment',
      description: 'Build habits that protect the planet',
      icon: <Leaf className="w-5 h-5 text-[#8E8E93]" />
    },
    {
      name: 'Responsible AI',
      title: 'Responsible AI',
      description: 'Foster digital ethics and mindfulness',
      icon: <Bot className="w-5 h-5 text-[#8E8E93]" />
    },
    {
      name: 'Well-Being',
      title: 'Well-being',
      description: 'Nurture mental clarity and physical habits',
      icon: <Activity className="w-5 h-5 text-[#8E8E93]" />
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-start min-h-full">
      {/* Top Header with back button and HBW Logo */}
      <div className="flex items-center justify-between mb-6 pt-1">
        {(step > 1 && !skipDemographics) || onBack ? (
          <button
            onClick={handleBack}
            className={`p-1 -ml-1 transition-colors cursor-pointer flex items-center gap-1 text-xs font-sans font-semibold ${
              isDark ? 'text-[#8E8E93] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
            }`}
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        ) : (
          <div className="w-5 h-5" />
        )}

        <HBWLogo size="md" theme={isDark ? 'dark' : 'light'} />

        <div className="w-5 h-5" />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-1.5">
              <h2 className={`text-2xl font-serif font-normal tracking-tight sm:text-3xl ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                A little about <i className="italic font-serif">you</i>.
              </h2>
              <p className={`text-sm font-sans leading-relaxed ${
                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                This helps us recommend habits and communities that fit you.
              </p>
            </div>

            {/* Age range selection */}
            <div className="space-y-2.5">
              <label className={`text-xs font-semibold tracking-wide ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                What is your age range?
              </label>
              <div className="flex flex-wrap gap-2">
                {ageRanges.map((range) => {
                  const isSelected = answers.age === range || (() => {
                    const num = parseInt(answers.age, 10);
                    if (isNaN(num)) return false;
                    if (range.endsWith('+')) {
                      const min = parseInt(range, 10);
                      return num >= min;
                    }
                    const parts = range.split('–').map(p => parseInt(p.trim(), 10));
                    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                      return num >= parts[0] && num <= parts[1];
                    }
                    return false;
                  })();
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setAnswers({ ...answers, age: range })}
                      className={`h-[38px] px-4 rounded-full font-sans text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#0080FF] text-white font-semibold shadow-xs'
                          : isDark
                          ? 'bg-[#121214] border border-[#1F1F24] text-white hover:border-[#0080FF]/50 font-medium'
                          : 'bg-white border border-[#E5E5EA] text-[#1C1C1E] hover:border-[#0080FF]/50 font-medium shadow-2xs'
                      }`}
                    >
                      {range}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender options without preselection */}
            <div className="space-y-2.5">
              <label className={`text-xs font-semibold tracking-wide ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                Select Gender
              </label>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map((g) => {
                  const isSelected = Boolean(answers.gender && answers.gender === g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setAnswers({ ...answers, gender: g })}
                      className={`h-[38px] px-4 rounded-full font-sans text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#0080FF] text-white font-semibold shadow-xs'
                          : isDark
                          ? 'bg-[#121214] border border-[#1F1F24] text-white hover:border-[#0080FF]/50 font-medium'
                          : 'bg-white border border-[#E5E5EA] text-[#1C1C1E] hover:border-[#0080FF]/50 font-medium shadow-2xs'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="space-y-1.5">
              <h2 className={`text-2xl font-serif font-normal tracking-tight sm:text-3xl ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                Make an <i className="italic font-serif">Impact</i>
              </h2>
              <p className={`text-sm font-sans leading-relaxed ${
                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                Pick an area to explore. Tap any category to preview its 3-month plan and routine options before deciding.
              </p>
            </div>

            {/* Pillars Accordion List */}
            <div className="flex flex-col gap-3">
              {categories.map((c) => {
                const isExpanded = expandedCategory === c.name;
                const isSelected = (answers.categories || []).includes(c.name) || isExpanded;
                const goal = TOP_IMPACT_GOALS[c.name];
                const currentEffort = effortTierMap[c.name] || 'more';
                const currentDays = daysPerWeekMap[c.name] || 3;
                const activeOption = buildRoutineOption(c.name, currentEffort, currentDays);
                const effortConfig = CATEGORY_EFFORT_CONFIGS[c.name];
                const demographicInsight = getDemographicResonance(c.name, answers.age, answers.gender);

                return (
                  <div
                    key={c.name}
                    id={`category-accordion-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`rounded-[20px] transition-all duration-200 overflow-hidden ${
                      isExpanded
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
                      onClick={() => handleToggleCategory(c.name)}
                      className="w-full p-4 text-left transition-colors flex flex-col gap-3 cursor-pointer"
                      aria-expanded={isExpanded}
                      aria-controls={`accordion-body-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {/* Top Row: Icon + Title & Description */}
                      <div className="flex items-center gap-3.5 w-full">
                        {/* Icon container */}
                        <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? isDark ? 'bg-[#0080FF]/20 text-[#0080FF]' : 'bg-[#E5F1FF] text-[#0080FF]'
                            : isDark ? 'bg-[#1C1C1E] text-[#8E8E93]' : 'bg-[#F2F2F7] text-[#8E8E93]'
                        }`}>
                          {c.icon}
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <h3 className={`text-base font-sans font-bold leading-tight ${
                            isDark ? 'text-white' : 'text-[#1C1C1E]'
                          }`}>
                            {c.title}
                          </h3>
                          <p className={`text-xs font-sans leading-normal ${
                            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                          }`}>
                            {c.description}
                          </p>
                        </div>
                      </div>

                      {/* Underneath: "View Plan" / "Hide Plan Details" Bar */}
                      <div className={`w-full pt-2.5 flex items-center justify-between border-t transition-colors text-xs font-sans font-semibold ${
                        isExpanded
                          ? isDark ? 'border-[#1F1F24] text-[#0080FF]' : 'border-[#E5F1FF] text-[#0080FF]'
                          : isDark ? 'border-[#1F1F24] text-[#8E8E93]' : 'border-[#E5E5EA] text-[#6C6C70]'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <span>{isExpanded ? 'Hide 3-Month Plan Details' : 'View Plan'}</span>
                          {isExpanded && (
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              isDark ? 'bg-[#0080FF]/20 text-[#0080FF]' : 'bg-[#E5F1FF] text-[#0066CC]'
                            }`}>
                              Plan Preview
                            </span>
                          )}
                        </div>

                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isExpanded
                            ? isDark ? 'bg-[#0080FF]/20 text-[#0080FF]' : 'bg-[#E5F1FF] text-[#0080FF]'
                            : isDark ? 'bg-[#1C1C1E] text-[#8E8E93]' : 'bg-[#F2F2F7] text-[#6C6C70]'
                        }`}>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Accordion Expandable Plan Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          id={`accordion-body-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                                {goal.title}
                              </h4>
                              <p className={`text-xs font-sans leading-relaxed ${
                                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                              }`}>
                                {goal.action}
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
                                  onClick={() => setEffortTierMap(prev => ({ ...prev, [c.name]: 'more' }))}
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
                                  onClick={() => setEffortTierMap(prev => ({ ...prev, [c.name]: 'less' }))}
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
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDaysPerWeekMap(prev => ({ ...prev, [c.name]: d }));
                                        }}
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

                            {/* Live 3-Month Dual Impact Preview for Selected Option */}
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

                            {/* Action Cue (If-Then Trigger) */}
                            {goal.actionCue && (
                              <div className={`p-2.5 rounded-xl border text-center transition-colors ${
                                isDark ? 'bg-[#0A0A0C]/80 border-[#1F1F24]' : 'bg-[#F2F8FF] border-[#BDE0FE]'
                              }`}>
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block mb-0.5 ${
                                  isDark ? 'text-[#0080FF]' : 'text-[#0066CC]'
                                }`}>
                                  Action Cue (If-Then Trigger)
                                </span>
                                <p className={`text-xs font-sans italic leading-tight ${
                                  isDark ? 'text-[#E5E5EA]' : 'text-[#1C1C1E]'
                                }`}>
                                  &ldquo;{goal.actionCue}&rdquo;
                                </p>
                              </div>
                            )}

                            {/* Commit to this habit button inside accordion */}
                            <button
                              type="button"
                              onClick={() => handleCommitThisGoal(c.name)}
                              className="w-full h-[46px] px-5 bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] text-white font-sans font-semibold text-xs sm:text-sm rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-1"
                            >
                              <span>Start with this Habit: {activeOption.scheduleText}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation footer */}
      <div className="mt-8 flex flex-col items-center gap-3">
        {/* Step dots indicator: 2 actual steps in the quiz */}
        <div className="flex items-center justify-center gap-1.5" aria-label={`Step ${step} of 2`}>
          <div className={`h-1.5 rounded-full transition-all duration-300 ${
            step === 1 ? 'w-5 bg-[#0080FF]' : isDark ? 'w-2 bg-[#3A3A3C]' : 'w-2 bg-[#D1D1D6]'
          }`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${
            step === 2 ? 'w-5 bg-[#0080FF]' : isDark ? 'w-2 bg-[#3A3A3C]' : 'w-2 bg-[#D1D1D6]'
          }`} />
        </div>

        {/* Helpful error-prevention hint when selection is incomplete */}
        {!((step === 1 && isStep1Valid) || (step === 2 && isStep2Valid)) && (
          <p className={`text-[11px] font-sans font-medium text-center transition-opacity duration-200 ${
            isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
          }`}>
            {step === 1 && !answers.age.trim() && 'Please select your age range to continue'}
            {step === 1 && answers.age.trim() !== '' && !answers.gender && 'Please select your gender to continue'}
            {step === 2 && !isStep2Valid && 'Tap any category to explore its plan and options'}
          </p>
        )}

        <button
          id="next-btn"
          onClick={handleNext}
          disabled={
            isLoading ||
            (step === 1 && !isStep1Valid) ||
            (step === 2 && !isStep2Valid)
          }
          className={`w-full h-[50px] font-sans font-semibold text-[15px] text-white rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            isLoading ||
            (step === 1 && !isStep1Valid) ||
            (step === 2 && !isStep2Valid)
              ? isDark
                ? 'bg-[#121214] border border-[#1F1F24] cursor-not-allowed text-[#636366]'
                : 'bg-[#E5E5EA] cursor-not-allowed text-[#8E8E93]'
              : 'bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Building Plan...</span>
            </div>
          ) : step === 2 && activeCategory ? (
            <div className="flex items-center gap-2">
              <span>Start Habit: {daysPerWeekMap[activeCategory] || 3} {(daysPerWeekMap[activeCategory] || 3) === 1 ? 'day' : 'days'} / week</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          ) : (
            <span>Continue</span>
          )}
        </button>
      </div>
    </div>
  );
}
