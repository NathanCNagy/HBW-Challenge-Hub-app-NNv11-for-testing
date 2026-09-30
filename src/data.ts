import { Category, Goal, QuizAnswers, RecommendationResponse, ImplementationOption } from './types';

export const TOP_IMPACT_GOALS: Record<Category, Goal> = {
  'Environment': {
    id: 'env-top',
    title: 'Plant-Protein Meal Swap',
    category: 'Environment',
    badgeLabel: '#1 Planet Impact Habit',
    action: 'Swap animal protein for beans, lentils, or organic tofu.',
    impact: 'Switching to plant proteins is the ultimate win-win: you cut greenhouse emissions equivalent to hundreds of driving mi while trimming $200+ from your grocery bill.',
    defaultOptionId: 'opt-env-full',
    implementationOptions: [
      {
        id: 'opt-env-full',
        title: 'Weekly Meal Swap',
        description: 'Enjoy 1 plant-based meal every week.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'High Impact · Easy Start',
        scheduleText: '1 meal per week',
        metrics: {
          primaryBadge: 'Planet Win',
          primaryLabel: 'Driving emissions avoided',
          primaryValue: 460,
          primaryUnit: 'mi',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Grocery budget saved',
          secondaryValue: 210,
          secondaryUnit: 'dollars'
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
          primaryBadge: 'Planet Win',
          primaryLabel: 'Driving emissions avoided',
          primaryValue: 345,
          primaryUnit: 'mi',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Grocery budget saved',
          secondaryValue: 160,
          secondaryUnit: 'dollars'
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
          primaryBadge: 'Planet Win',
          primaryLabel: 'Driving emissions avoided',
          primaryValue: 185,
          primaryUnit: 'mi',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Grocery budget saved',
          secondaryValue: 85,
          secondaryUnit: 'dollars'
        }
      }
    ]
  },
  'Well-Being': {
    id: 'well-top',
    title: 'Evening Screen Sunset',
    category: 'Well-Being',
    badgeLabel: '#1 Sleep & Focus Habit',
    action: 'Power down screens before bed to restore deep sleep and mental clarity.',
    impact: 'Powering down screens early reduces energy grid draw and device battery degradation while restoring 68+ hours of deep, restorative sleep.',
    defaultOptionId: 'opt-well-full',
    implementationOptions: [
      {
        id: 'opt-well-full',
        title: '60-Minute Sunset',
        description: 'Screens off 60 minutes before bed; charge phone across the room.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'Best Sleep Gain · Deep Reset',
        scheduleText: '60 min before bed nightly',
        metrics: {
          primaryBadge: 'Planet Win',
          primaryLabel: 'Standby power saved',
          primaryValue: 90,
          primaryUnit: 'hrs',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Deep sleep gained',
          secondaryValue: 68,
          secondaryUnit: 'hrs'
        }
      },
      {
        id: 'opt-well-half',
        title: '30-Minute Sunset',
        description: 'Screens off 30 minutes before sleep.',
        impactMultiplier: 0.75,
        foggAbilityRating: 'Balanced · Simple Routine',
        scheduleText: '30 min before bed nightly',
        metrics: {
          primaryBadge: 'Planet Win',
          primaryLabel: 'Standby power saved',
          primaryValue: 45,
          primaryUnit: 'hrs',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Deep sleep gained',
          secondaryValue: 45,
          secondaryUnit: 'hrs'
        }
      },
      {
        id: 'opt-well-starter',
        title: '15-Minute Pause',
        description: 'A quick 15-minute screen pause right before closing your eyes.',
        impactMultiplier: 0.40,
        foggAbilityRating: 'Micro Habit · Zero Friction',
        scheduleText: '15 min before bed nightly',
        metrics: {
          primaryBadge: 'Planet Win',
          primaryLabel: 'Standby power saved',
          primaryValue: 22,
          primaryUnit: 'hrs',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Deep sleep gained',
          secondaryValue: 23,
          secondaryUnit: 'hrs'
        }
      }
    ]
  },
  'Compassion': {
    id: 'comp-top',
    title: 'Weekly Kindness Circle',
    category: 'Compassion',
    badgeLabel: '#1 Social Connection Habit',
    action: 'Group small acts of kindness into a dedicated day each week.',
    impact: 'Grouping kindness acts creates a ripple effect in your community while triggering a lasting 35% boost in your own mood and resilience.',
    defaultOptionId: 'opt-comp-full',
    implementationOptions: [
      {
        id: 'opt-comp-full',
        title: '5 Acts on Focus Day',
        description: 'Complete 5 small thoughtful acts (thank-yous, tips, check-ins) on 1 chosen day.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'Peak Happiness · Deep Impact',
        scheduleText: '5 acts, 1 day / week',
        metrics: {
          primaryBadge: 'Community Win',
          primaryLabel: 'People brightened',
          primaryValue: 60,
          primaryUnit: 'people',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Mood & resilience lift',
          secondaryValue: 35,
          secondaryUnit: '%'
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
          primaryBadge: 'Community Win',
          primaryLabel: 'People brightened',
          primaryValue: 36,
          primaryUnit: 'people',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Mood & resilience lift',
          secondaryValue: 25,
          secondaryUnit: '%'
        }
      },
      {
        id: 'opt-comp-starter',
        title: 'Micro Kind Words',
        description: 'Send 1 encouraging note or warm greeting twice a week.',
        impactMultiplier: 0.40,
        foggAbilityRating: 'Micro Habit · Effortless',
        scheduleText: '1 gesture, 2x / week',
        metrics: {
          primaryBadge: 'Community Win',
          primaryLabel: 'People brightened',
          primaryValue: 24,
          primaryUnit: 'people',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Mood & resilience lift',
          secondaryValue: 15,
          secondaryUnit: '%'
        }
      }
    ]
  },
  'Responsible AI': {
    id: 'rai-top',
    title: 'Mindful AI & Fact-Check',
    category: 'Responsible AI',
    badgeLabel: '#1 Digital Integrity Habit',
    action: 'Verify key facts in AI responses and draft your own ideas first.',
    impact: 'Fact-checking and mindful prompting saves data-center energy and water while preserving 85% of your independent critical thinking.',
    defaultOptionId: 'opt-rai-full',
    implementationOptions: [
      {
        id: 'opt-rai-full',
        title: 'Complete Fact-Check',
        description: 'Verify sources on AI answers and write your initial thoughts first.',
        impactMultiplier: 1.0,
        foggAbilityRating: 'Full Accuracy · Sharp Mind',
        scheduleText: 'Every AI session',
        metrics: {
          primaryBadge: 'Planet Win',
          primaryLabel: 'Data center power saved',
          primaryValue: 18,
          primaryUnit: 'kWh',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Critical thinking kept',
          secondaryValue: 85,
          secondaryUnit: '%'
        }
      },
      {
        id: 'opt-rai-half',
        title: 'Work & Public Checks',
        description: 'Verify facts, stats, and quotes for work or shared content.',
        impactMultiplier: 0.75,
        foggAbilityRating: 'High-Value · Fast Workflow',
        scheduleText: 'Key work sessions',
        metrics: {
          primaryBadge: 'Planet Win',
          primaryLabel: 'Data center power saved',
          primaryValue: 12,
          primaryUnit: 'kWh',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Critical thinking kept',
          secondaryValue: 65,
          secondaryUnit: '%'
        }
      },
      {
        id: 'opt-rai-starter',
        title: '1 Daily Source Check',
        description: 'Check 1 claim or link each day before accepting it.',
        impactMultiplier: 0.40,
        foggAbilityRating: 'Micro Step · 30 Seconds',
        scheduleText: '1 claim per day',
        metrics: {
          primaryBadge: 'Planet Win',
          primaryLabel: 'Data center power saved',
          primaryValue: 7,
          primaryUnit: 'kWh',
          secondaryBadge: 'Personal Win',
          secondaryLabel: 'Critical thinking kept',
          secondaryValue: 35,
          secondaryUnit: '%'
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

export function getDemographicResonance(category: Category, ageStr: string, genderStr: string): string {
  const age = parseInt(ageStr, 10) || 28;
  const isYoung = age < 30;
  const isMid = age >= 30 && age < 50;
  const isMature = age >= 50;

  const gender = (genderStr || '').toLowerCase();
  const genderTerm = gender.includes('female') ? 'women' : gender.includes('male') ? 'men' : 'everyone';

  switch (category) {
    case 'Environment':
      if (isYoung) {
        return `At ${age}, swapping one meal a week is a direct win-win: prevents emissions equal to driving 460 fewer mi and saves you over $200 on groceries every 3 months.`;
      } else if (isMid) {
        return `For ${genderTerm} in their ${Math.floor(age / 10) * 10}s, swapping protein once a week equals parking your car for hundreds of mi while trimming weekly grocery bills.`;
      } else {
        return `At ${age}, plant-forward meals protect clean water reserves and native habitats while promoting vitality and heart health.`;
      }

    case 'Well-Being':
      if (isYoung) {
        return `A win-win for tech and mind: cutting late-night screen time saves device power while giving you 68+ hours of restorative deep sleep.`;
      } else if (isMid) {
        return `Balancing busy days at age ${age}? An evening screen sunset reduces home power draw while delivering 32% evening stress relief and deep sleep.`;
      } else {
        return `At ${age}, a peaceful evening screen sunset saves energy, protects eye comfort, and restores high-quality restorative sleep.`;
      }

    case 'Compassion':
      if (isYoung) {
        return `Dedicated kindness days create a win-win: you brighten 60+ people in your community while unlocking a 35% boost in personal joy and resilience.`;
      } else if (isMid) {
        return `For ${genderTerm} at age ${age}, grouping small acts of kindness uplifts your entire social circle while lifting your own daily fulfillment.`;
      } else {
        return `At ${age}, purposeful acts of warmth strengthen neighborhood bonds and elevate your own happiness and sense of purpose.`;
      }

    case 'Responsible AI':
    default:
      if (isYoung) {
        return `A digital win-win: verifying AI claims cuts data-center compute energy while keeping your independent critical thinking 85% sharper.`;
      } else if (isMid) {
        return `Fact-checking AI outputs saves central server energy, ensures 100% accuracy in your work, and keeps your mind agile.`;
      } else {
        return `A 30-second fact check reduces compute load, keeps you in full control of AI tools, and protects total integrity in what you share.`;
      }
  }
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
