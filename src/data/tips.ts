export interface VerifiedSource {
  name: string;
  url: string;
  isVerified: boolean;
}

export interface HabitTip {
  id: string;
  category: 'Environment' | 'Responsible AI' | 'Well-Being' | 'Compassion';
  title: string;
  tip: string;
  demographicInsight: string;
  targetAges?: { min: number; max: number };
  targetGender?: 'Male' | 'Female' | 'Non-binary' | 'All';
  source: VerifiedSource;
}

export const HABIT_TIPS: HabitTip[] = [
  // ==========================================
  // ENVIRONMENT / PLANT-PROTEIN MEAL SWAP
  // ==========================================
  {
    id: 'env-1',
    category: 'Environment',
    title: 'Crispy 10-Min Canned Chickpea Skillet',
    tip: 'Rinse canned chickpeas, pat dry with a paper towel, and toss into a hot skillet with smoked paprika and garlic powder. They crisp up in 8 minutes with zero messy chopping.',
    demographicInsight: 'Great for fast weeknight dinners and high-protein fuel on a busy schedule.',
    targetAges: { min: 18, max: 40 },
    source: {
      name: 'Rainbow Plant Life (YouTube)',
      url: 'https://www.youtube.com/@RainbowPlantLife',
      isVerified: true
    }
  },
  {
    id: 'env-2',
    category: 'Environment',
    title: 'The "Umami Depth" Lentil Marinara Hack',
    tip: 'Stir 1/2 cup of red lentils directly into your favorite jarred marinara sauce with 1/2 cup extra water. Red lentils melt into rich sauce in 15 minutes without any pre-soaking.',
    demographicInsight: 'Comfort food favorite for families and quick solo meal preps.',
    targetAges: { min: 25, max: 65 },
    source: {
      name: 'Pick Up Limes (YouTube)',
      url: 'https://www.youtube.com/@PickUpLimes',
      isVerified: true
    }
  },
  {
    id: 'env-3',
    category: 'Environment',
    title: 'Sheet-Pan Tofu: Press-Free Method',
    tip: 'Skip the heavy book press: buy extra-firm vacuum-packed tofu, tear it into rustic bite-sized chunks by hand (more surface area for sauce), and toss in soy sauce and cornstarch for instant crunch.',
    demographicInsight: 'Cuts prep time from 40 minutes down to 4 minutes.',
    targetAges: { min: 18, max: 45 },
    source: {
      name: 'Yeung Man Cooking (YouTube)',
      url: 'https://www.youtube.com/@YeungManCooking',
      isVerified: true
    }
  },
  {
    id: 'env-4',
    category: 'Environment',
    title: 'Hearty Black Bean Taco Bowls',
    tip: 'Warm seasoned black beans with salsa and cumin, then layer over microwave brown rice with avocado. You get 22g of clean protein and 14g of fiber in under 7 minutes total.',
    demographicInsight: 'Budget-friendly staple that requires no culinary knives or pans.',
    targetAges: { min: 18, max: 35 },
    source: {
      name: 'Simnett Nutrition (YouTube)',
      url: 'https://www.youtube.com/@SimnettNutrition',
      isVerified: true
    }
  },
  {
    id: 'env-5',
    category: 'Environment',
    title: 'Golden Turmeric Tofu Scramble',
    tip: 'Crumble firm tofu straight into the pan with a pinch of nutritional yeast, turmeric, and black pepper. It cooks twice as fast as scrambled eggs and leaves zero pan odor.',
    demographicInsight: 'High bio-available plant protein with natural joint & anti-inflammatory support.',
    targetAges: { min: 35, max: 75 },
    source: {
      name: 'NutritionFacts.org (Dr. Michael Greger)',
      url: 'https://nutritionfacts.org',
      isVerified: true
    }
  },

  // ==========================================
  // RESPONSIBLE AI & FACT-CHECKING
  // ==========================================
  {
    id: 'rai-1',
    category: 'Responsible AI',
    title: 'Single-Pass Prompting (Cut Server Queries 75%)',
    tip: 'Specify your exact format, audience, and constraints in prompt #1 (e.g. "Answer in 3 bullets under 100 words"). Eliminating follow-up queries saves data-center electricity and cooling water.',
    demographicInsight: 'Essential for tech professionals and students balancing productivity with energy efficiency.',
    targetAges: { min: 18, max: 45 },
    source: {
      name: 'OpenAI Prompt Engineering Guide',
      url: 'https://platform.openai.com/docs/guides/prompt-engineering',
      isVerified: true
    }
  },
  {
    id: 'rai-2',
    category: 'Responsible AI',
    title: 'The "Draft First, Refine Second" Rule',
    tip: 'Type your raw bullet thoughts or outline first before asking AI to synthesize. This protects your core cognitive reasoning muscles while keeping AI as an editor rather than a creator.',
    demographicInsight: 'Proven cognitive retention method for writers, researchers, and students.',
    targetAges: { min: 18, max: 55 },
    source: {
      name: 'MIT Technology Review',
      url: 'https://www.technologyreview.com',
      isVerified: true
    }
  },
  {
    id: 'rai-3',
    category: 'Responsible AI',
    title: 'Rapid Source Triangulation Hack',
    tip: 'Whenever AI cites a study or metric, immediately search the exact author or DOI on Google Scholar. If the primary paper doesn\'t load in 30 seconds, treat the stat as unverified hallucination.',
    demographicInsight: 'Crucial verification reflex for professional integrity and data reliability.',
    targetAges: { min: 20, max: 65 },
    source: {
      name: 'Google Scholar Research Tools',
      url: 'https://scholar.google.com',
      isVerified: true
    }
  },
  {
    id: 'rai-4',
    category: 'Responsible AI',
    title: 'Batch Queries Instead of Stream-of-Consciousness',
    tip: 'Keep a quick scratchpad note of tasks, then run 1 comprehensive prompt instead of 10 micro-prompts. Data centers spin down compute clusters between batch calls, saving baseline grid power.',
    demographicInsight: 'Workplace strategy to stay in deep flow while curbing digital footprint.',
    targetAges: { min: 22, max: 50 },
    source: {
      name: 'Stanford HAI (Human-Centered AI)',
      url: 'https://hai.stanford.edu',
      isVerified: true
    }
  },

  // ==========================================
  // WELL-BEING / EVENING SCREEN SUNSET
  // ==========================================
  {
    id: 'well-1',
    category: 'Well-Being',
    title: 'The "Dock Across the Room" Trick',
    tip: 'Move your charger 8 feet away from your mattress before dinner. Removing reach temptation completely bypasses 90% of midnight doomscrolling willpower battles.',
    demographicInsight: 'Simple physical friction that restores 45+ minutes of natural sleep onset.',
    targetAges: { min: 18, max: 45 },
    source: {
      name: 'Huberman Lab (Sleep Toolkit)',
      url: 'https://www.hubermanlab.com/topics/sleep-optimization',
      isVerified: true
    }
  },
  {
    id: 'well-2',
    category: 'Well-Being',
    title: 'Warm Light Transition at 8:00 PM',
    tip: 'Switch overhead white LED bulbs to low warm lamps 90 minutes before bed. Blue wavelengths suppress melatonin production; amber lighting signals circadian winding down.',
    demographicInsight: 'Proven nervous system reset for busy minds and night owls.',
    targetAges: { min: 20, max: 70 },
    source: {
      name: 'Sleep Foundation (Circadian Health)',
      url: 'https://www.sleepfoundation.org',
      isVerified: true
    }
  },
  {
    id: 'well-3',
    category: 'Well-Being',
    title: 'The 3-Minute Paper "Brain Dump"',
    tip: 'Before putting down your phone, scribble 3 lingering to-dos on a bedside paper card. Offloading cognitive loop memory to physical paper stops 3 AM racing thoughts.',
    demographicInsight: 'High-efficacy technique for working parents and career professionals.',
    targetAges: { min: 25, max: 60 },
    source: {
      name: 'American Psychological Association',
      url: 'https://www.apa.org',
      isVerified: true
    }
  },

  // ==========================================
  // COMPASSION / WEEKLY KINDNESS CIRCLE
  // ==========================================
  {
    id: 'comp-1',
    category: 'Compassion',
    title: 'The 30-Second "Specific Appreciation" Text',
    tip: 'Instead of generic thanks, text one friend or colleague mentioning one exact detail: "I really appreciated how you handled that call yesterday." Specific recognition lingers for days.',
    demographicInsight: 'Frictionless micro-gesture that deepens personal connection.',
    targetAges: { min: 18, max: 60 },
    source: {
      name: 'Greater Good Science Center (UC Berkeley)',
      url: 'https://greatergood.berkeley.edu',
      isVerified: true
    }
  },
  {
    id: 'comp-2',
    category: 'Compassion',
    title: 'Grouped Kindness on Focus Day',
    tip: 'Batch your compliments, generous tips, and check-in messages onto one dedicated weekday. Grouping creates an intentional mood lift that sustains personal resilience all week.',
    demographicInsight: 'Scientifically demonstrated by Dr. Sonja Lyubomirsky to double subjective happiness.',
    targetAges: { min: 20, max: 75 },
    source: {
      name: 'Dr. Sonja Lyubomirsky (The How of Happiness)',
      url: 'https://sonjalyubomirsky.com',
      isVerified: true
    }
  },
  {
    id: 'comp-3',
    category: 'Compassion',
    title: 'The Unsung Contributor Shout-Out',
    tip: 'Leave a brief 5-star review naming a specific staff member or custodian who helped your day run smoothly. It costs 60 seconds and directly rewards someone\'s livelihood.',
    demographicInsight: 'High community impact for neighborhood connections and mutual care.',
    targetAges: { min: 18, max: 70 },
    source: {
      name: 'Random Acts of Kindness Foundation',
      url: 'https://www.randomactsofkindness.org',
      isVerified: true
    }
  }
];
