import { Category, Goal, QuizAnswers, RecommendationResponse, ImplementationOption } from './types';

export const TOP_IMPACT_GOALS: Record<Category, Goal> = {
  'Environment': {
    id: 'env-top',
    title: 'Plant-Protein Meal Swap',
    category: 'Environment',
    badgeLabel: '#1 Health & Wallet Habit',
    actionCue: "When planning my weekly meal or eating out, I'll swap meat for lentils, beans, or organic tofu once a week.",
    action: 'Swap animal protein for lentils, beans, or organic tofu.',
    impact: 'Save $60+ on groceries every 90 days and boost your cardiovascular energy—while cutting carbon emissions equal to driving 110 miles (180 km) less.',
    dualWinNarrative: 'Every plant-based swap puts money back in your pocket and protects long-term health—while lightening agricultural water and land draw with every single plate.',
    defaultOptionId: 'opt-env-full',
    implementationOptions: [
      {
        id: 'opt-env-full',
        title: 'Weekly Swap',
        description: 'Enjoy 1 plant-based meal every week.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'Easy Start',
        scheduleText: '1 meal per week',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'saved on bills & improved digestion',
          secondaryValue: 63,
          secondaryUnit: 'dollars',
          primaryBadge: 'Planet Win',
          primaryLabel: 'car emissions cut (EPA standard)',
          primaryValue: 110,
          primaryUnit: 'mi'
        }
      },
      {
        id: 'opt-env-half',
        title: 'Half-Portion Blend',
        description: 'Replace half the meat in 2 meals a week with lentils or beans.',
        impactMultiplier: 0.75,
        foggAbilityRating: 'Ultra Flexible · Great Balance',
        scheduleText: '2 meals cut by 50%',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'saved on bills & lighter post-lunch energy',
          secondaryValue: 45,
          secondaryUnit: 'dollars',
          primaryBadge: 'Planet Win',
          primaryLabel: 'car emissions cut (EPA standard)',
          primaryValue: 80,
          primaryUnit: 'mi'
        }
      },
      {
        id: 'opt-env-starter',
        title: 'Starter Step',
        description: 'Try 1 plant-based meal every two weeks.',
        impactMultiplier: 0.40,
        foggAbilityRating: 'Gentle Start · Zero Stress',
        scheduleText: '1 meal every 2 weeks',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'saved on bills & effortless variety',
          secondaryValue: 25,
          secondaryUnit: 'dollars',
          primaryBadge: 'Planet Win',
          primaryLabel: 'car emissions cut (EPA standard)',
          primaryValue: 45,
          primaryUnit: 'mi'
        }
      }
    ]
  },
  'Well-Being': {
    id: 'well-top',
    title: 'Evening Screen Sunset',
    category: 'Well-Being',
    badgeLabel: '#1 Deep Sleep Habit',
    actionCue: "When my 9:00 PM alarm goes off, I will dock my phone charging cable away from my bed.",
    action: 'Power down screens before bed to restore deep sleep and mental clarity.',
    impact: 'Unlock up to 68 hours of deep, restorative sleep over 90 days and lower evening stress—while saving battery health and curbing home power draw.',
    dualWinNarrative: 'Powering down screens calms your nervous system for deeper sleep cycles—while extending device hardware life and lowering grid demand.',
    defaultOptionId: 'opt-well-full',
    implementationOptions: [
      {
        id: 'opt-well-full',
        title: '60-Minute Sunset',
        description: 'Screens off 60 minutes before bed; charge phone across the room.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'Peak Reset · Deep Rest',
        scheduleText: '60 min before bed nightly',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'restorative deep sleep & focus gained',
          secondaryValue: 68,
          secondaryUnit: 'hrs',
          primaryBadge: 'Planet Win',
          primaryLabel: 'standby power draw & battery saved',
          primaryValue: 90,
          primaryUnit: 'hrs'
        }
      },
      {
        id: 'opt-well-half',
        title: '30-Minute Sunset',
        description: 'Screens off 30 minutes before sleep.',
        impactMultiplier: 0.75,
        foggAbilityRating: 'Simple Routine',
        scheduleText: '30 min before bed nightly',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'restorative deep rest & calm gained',
          secondaryValue: 45,
          secondaryUnit: 'hrs',
          primaryBadge: 'Planet Win',
          primaryLabel: 'standby power draw & battery saved',
          primaryValue: 45,
          primaryUnit: 'hrs'
        }
      },
      {
        id: 'opt-well-starter',
        title: '15-Minute Pause',
        description: 'A quick 15-minute screen pause right before closing your eyes.',
        impactMultiplier: 0.40,
        foggAbilityRating: 'Micro Step · Zero Friction',
        scheduleText: '15 min before bed nightly',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'restorative sleep gained & eye strain cut',
          secondaryValue: 23,
          secondaryUnit: 'hrs',
          primaryBadge: 'Planet Win',
          primaryLabel: 'late-night power drain reduced',
          primaryValue: 22,
          primaryUnit: 'hrs'
        }
      }
    ]
  },
  'Compassion': {
    id: 'comp-top',
    title: 'Weekly Kindness Circle',
    category: 'Compassion',
    badgeLabel: '#1 Social Connection Habit',
    actionCue: "When I grab my Friday morning coffee, I will send one text of appreciation to a coworker, friend, or neighbor.",
    action: 'Group small acts of kindness into a dedicated day each week.',
    impact: 'Boost your mood vitality and daily happiness by up to 35% while brightening over 60 people in your community through quick micro-gestures.',
    dualWinNarrative: 'Expressing appreciation releases feel-good neurochemistry that builds personal resilience while weaving a more connected, resilient community.',
    defaultOptionId: 'opt-comp-full',
    implementationOptions: [
      {
        id: 'opt-comp-full',
        title: '5 Acts on Focus Day',
        description: 'Complete 5 small thoughtful acts (thank-yous, tips, check-ins) on 1 chosen day.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'Peak Happiness',
        scheduleText: '5 acts, 1 day / week',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'boost in mood vitality, joy & resilience',
          secondaryValue: 35,
          secondaryUnit: '%',
          primaryBadge: 'Community Win',
          primaryLabel: 'people uplifted in your circle',
          primaryValue: 60,
          primaryUnit: 'people'
        }
      },
      {
        id: 'opt-comp-half',
        title: '3 Acts on Focus Day',
        description: 'Share 3 intentional gestures of appreciation on your chosen day.',
        impactMultiplier: 0.75,
        foggAbilityRating: 'Sustainable · Fast & Fun',
        scheduleText: '3 acts, 1 day / week',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'boost in daily vitality & fulfillment',
          secondaryValue: 25,
          secondaryUnit: '%',
          primaryBadge: 'Community Win',
          primaryLabel: 'people touched with warmth',
          primaryValue: 36,
          primaryUnit: 'people'
        }
      },
      {
        id: 'opt-comp-starter',
        title: 'Micro Kind Words',
        description: 'Send 1 encouraging note or warm greeting twice a week.',
        impactMultiplier: 0.40,
        foggAbilityRating: 'Micro Step · Effortless',
        scheduleText: '1 gesture, 2x / week',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'boost in calm vitality & stress buffer',
          secondaryValue: 15,
          secondaryUnit: '%',
          primaryBadge: 'Community Win',
          primaryLabel: 'heartfelt touchpoints',
          primaryValue: 24,
          primaryUnit: 'people'
        }
      }
    ]
  },
  'Responsible AI': {
    id: 'rai-top',
    title: 'Mindful AI & Source Check',
    category: 'Responsible AI',
    badgeLabel: '#1 Digital Sharpness Habit',
    actionCue: "Before copying an AI answer into my work, I will check one primary source or jot down my own thoughts first.",
    action: 'Verify key facts in AI responses and draft your own ideas first.',
    impact: 'Sharpen your critical thinking, protect your reputation, and save hours of distraction—while conserving data-center energy and cooling water.',
    dualWinNarrative: 'Mindful prompting protects your analytical edge and frees up hours of deep focus—while lightening the electrical and water footprint of global server hubs.',
    defaultOptionId: 'opt-rai-full',
    implementationOptions: [
      {
        id: 'opt-rai-full',
        title: 'Complete Fact-Check',
        description: 'Verify sources on AI answers and write your initial thoughts first.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'Sharp Mind · Full Accuracy',
        scheduleText: 'Every AI session',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'deep focus saved & 85% sharper retention',
          secondaryValue: 10.5,
          secondaryUnit: 'hrs',
          primaryBadge: 'Planet Win',
          primaryLabel: 'server queries & ~150L cooling water saved',
          primaryValue: 112,
          primaryUnit: 'queries'
        }
      },
      {
        id: 'opt-rai-half',
        title: 'Work Checks',
        description: 'Verify facts, stats, and quotes for work or shared content.',
        impactMultiplier: 0.75,
        foggAbilityRating: 'High-Value · Fast Workflow',
        scheduleText: 'Key work sessions',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'saved from rework & distractions',
          secondaryValue: 7,
          secondaryUnit: 'hrs',
          primaryBadge: 'Planet Win',
          primaryLabel: 'server queries & ~90L cooling water saved',
          primaryValue: 72,
          primaryUnit: 'queries'
        }
      },
      {
        id: 'opt-rai-starter',
        title: '1 Daily Check',
        description: 'Check 1 claim or link each day before accepting it.',
        impactMultiplier: 0.40,
        foggAbilityRating: 'Micro Step · 30 Seconds',
        scheduleText: '1 claim per day',
        metrics: {
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'saved in workflow maintenance',
          secondaryValue: 3.5,
          secondaryUnit: 'hrs',
          primaryBadge: 'Planet Win',
          primaryLabel: 'cloud queries & ~45L cooling water saved',
          primaryValue: 36,
          primaryUnit: 'queries'
        }
      }
    ]
  }
};

export const STATIC_GOALS: Record<Category, Goal[]> = {
  'Environment': [TOP_IMPACT_GOALS['Environment']],
  'Well-Being': [TOP_IMPACT_GOALS['Well-Being']],
  'Compassion': [TOP_IMPACT_GOALS['Compassion']],
  'Responsible AI': [TOP_IMPACT_GOALS['Responsible AI']]
};

import { resolveProfileTags } from './utils/profileTags';

export function getDemographicResonance(category: Category, ageStr: string, genderStr: string): string {
  const age = parseInt(ageStr, 10) || 28;
  const isYoung = age < 30;
  const isMid = age >= 30 && age < 50;
  const isMature = age >= 50;

  let rawTemplate = '';

  switch (category) {
    case 'Environment':
      if (isYoung) {
        rawTemplate = "At age [Age], save over $200 a year on groceries and fuel up with clean, gut-friendly plant protein—while cutting emissions equal to driving 110 fewer miles in your [Age Range] cohort.";
      } else if (isMid) {
        rawTemplate = "For your [Age Range] routine at [Age], trim your family grocery bill and support long-term heart health while parking your carbon footprint for hundreds of miles every quarter.";
      } else {
        rawTemplate = "At [Age], promote joint comfort, vitality, and cardiovascular health with clean plant protein while helping preserve regional freshwater and native habitats.";
      }
      break;

    case 'Well-Being':
      if (isYoung) {
        rawTemplate = "At age [Age], reclaim 68+ hours of deep sleep and wake up sharper every morning while saving device battery life and unnecessary home power.";
      } else if (isMid) {
        rawTemplate = "For your [Age Range] lifestyle at [Age], melt away evening stress by 32% and protect your sleep after high-demand days while cutting late-night electricity use.";
      } else {
        rawTemplate = "At [Age], protect eye comfort, reduce evening brain fog, and enjoy deeper rest while keeping an energy-smart household in your [Age Range] years.";
      }
      break;

    case 'Compassion':
      if (isYoung) {
        rawTemplate = "At age [Age], unlock a 35% boost in personal joy and mental resilience while making 60+ people feel valued and seen in your community.";
      } else if (isMid) {
        rawTemplate = "For adults in their [Age Range] at age [Age], lifting others lifts you—grouping small acts of appreciation deepens workplace ties and protects against daily burnout.";
      } else {
        rawTemplate = "At [Age], strengthen local neighborhood connections and elevate your own daily purpose through regular, joyful expressions of warmth.";
      }
      break;

    case 'Responsible AI':
    default:
      if (isYoung) {
        rawTemplate = "At age [Age], keep your critical thinking 85% sharper and stand out with original ideas while cutting data-center energy and water draw in your [Age Range] field.";
      } else if (isMid) {
        rawTemplate = "For professionals in their [Age Range] at age [Age], ensure total accuracy in your work deliverables and save hours of focus while cutting redundant enterprise server load.";
      } else {
        rawTemplate = "At [Age], stay in full control of your digital tools, protect your information integrity, and lower high-density cloud computing demand in your [Age Range] routine.";
      }
      break;
  }

  return resolveProfileTags(rawTemplate, { age: ageStr, gender: genderStr });
}

export function getRecommendedGoals(answers: QuizAnswers): RecommendationResponse {
  const selectedCategories = answers.categories && answers.categories.length > 0 
    ? answers.categories 
    : ['Environment' as Category];

  const primaryCategory = selectedCategories[0] || 'Environment';
  const topImpactGoal = TOP_IMPACT_GOALS[primaryCategory];

  const demographicInsight = getDemographicResonance(primaryCategory, answers.age, answers.gender);

  // Find selected option or fallback to default
  const defaultOption = topImpactGoal.implementationOptions.find(o => o.id === topImpactGoal.defaultOptionId) 
    || topImpactGoal.implementationOptions[0];

  const personalizedTopGoal: Goal = {
    ...topImpactGoal,
    selectedOption: defaultOption,
    demographicInsight
  };

  // Alternative options from other pillars
  const allPillars: Category[] = ['Environment', 'Well-Being', 'Compassion', 'Responsible AI'];
  const altPillars = allPillars.filter(p => p !== primaryCategory);

  const alternatives: Goal[] = altPillars.map(pillar => {
    const goal = TOP_IMPACT_GOALS[pillar];
    const insight = getDemographicResonance(pillar, answers.age, answers.gender);
    return {
      ...goal,
      selectedOption: goal.implementationOptions.find(o => o.id === goal.defaultOptionId) || goal.implementationOptions[0],
      demographicInsight: insight
    };
  });

  return {
    topGoal: personalizedTopGoal,
    alternatives
  };
}
