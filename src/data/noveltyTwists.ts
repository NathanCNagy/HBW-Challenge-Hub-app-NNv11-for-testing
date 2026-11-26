/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, WeeklyNoveltyTwist } from '../types';

export const TOTAL_PLAN_DAYS = 90;
export const TOTAL_PLAN_WEEKS = 13;

export const NOVELTY_TWISTS_BY_CATEGORY: Record<Category, WeeklyNoveltyTwist[]> = {
  'Environment': [
    {
      id: 'env-twist-1',
      category: 'Environment',
      defaultWeek: 1,
      title: 'Global Spice Swap',
      twistPrompt: 'Season your plant-protein meal with one spice blend you rarely cook with (smoked paprika, berbere, or za’atar).',
      benefitNote: 'Fresh aroma cues trigger dopamine and prevent meal fatigue.'
    },
    {
      id: 'env-twist-2',
      category: 'Environment',
      defaultWeek: 2,
      title: '15-Minute One-Pan Sprint',
      twistPrompt: 'Make this week’s swap in a single skillet or bowl in 15 minutes or less to prove how fast plant prep can be.',
      benefitNote: 'Lowers friction while keeping weeknight cooking playful.'
    },
    {
      id: 'env-twist-3',
      category: 'Environment',
      defaultWeek: 3,
      title: 'Local Seasonal Produce Pick',
      twistPrompt: 'Anchor your bean, lentil, or tofu dish around one seasonal vegetable picked up locally.',
      benefitNote: 'Adds vibrant flavor variety and cuts food-mile emissions.'
    },
    {
      id: 'env-twist-4',
      category: 'Environment',
      defaultWeek: 4,
      title: 'Crunch & Texture Contrast',
      twistPrompt: 'Top your plant meal with roasted chickpeas, toasted pumpkin seeds, or crushed walnuts for crisp texture.',
      benefitNote: 'Texture variety boosts meal satisfaction and fullness.'
    },
    {
      id: 'env-twist-5',
      category: 'Environment',
      defaultWeek: 5,
      title: 'Classic Comfort Remix',
      twistPrompt: 'Take a childhood comfort dish (tacos, chili, or pasta) and swap in red lentils or black beans.',
      benefitNote: 'Links familiar taste memories with your sustainable routine.'
    },
    {
      id: 'env-twist-6',
      category: 'Environment',
      defaultWeek: 6,
      title: 'Zero-Knife Pantry Meal',
      twistPrompt: 'Build your weekly swap strictly from pantry staples (canned beans, jarred salsa, pre-washed greens) with zero chopping.',
      benefitNote: 'Eliminates prep burnout midway through the 90-day arc.'
    },
    {
      id: 'env-twist-7',
      category: 'Environment',
      defaultWeek: 7,
      title: 'Shared Plate Challenge',
      twistPrompt: 'Serve or share your plant-protein dish with a friend, partner, or coworker without announcing it as a "diet swap."',
      benefitNote: 'Social enjoyment reinforces pride and long-term identity.'
    },
    {
      id: 'env-twist-8',
      category: 'Environment',
      defaultWeek: 8,
      title: 'New Protein Source Week',
      twistPrompt: 'Try a plant protein you haven’t used yet in this plan—tempeh, edamame, split peas, or hemp hearts.',
      benefitNote: 'Expands your automatic go-to ingredient rotation.'
    },
    {
      id: 'env-twist-9',
      category: 'Environment',
      defaultWeek: 9,
      title: 'Breakfast or Lunch Flip',
      twistPrompt: 'Move your plant swap to breakfast or lunch instead of dinner (like a savory tofu scramble or chickpea wrap).',
      benefitNote: 'Changing time-of-day refreshes stale routine cues.'
    },
    {
      id: 'env-twist-10',
      category: 'Environment',
      defaultWeek: 10,
      title: 'Bright Citrus & Herb Finish',
      twistPrompt: 'Finish your swap with fresh lemon zest, lime juice, or chopped herbs right before eating.',
      benefitNote: 'Elevates simple staples into restaurant-level freshness.'
    },
    {
      id: 'env-twist-11',
      category: 'Environment',
      defaultWeek: 11,
      title: 'Two-Batch Freezer Bonus',
      twistPrompt: 'Double your bean or lentil batch once this week and freeze half for an effortless future win.',
      benefitNote: 'Turns one effort into two high-impact days.'
    },
    {
      id: 'env-twist-12',
      category: 'Environment',
      defaultWeek: 12,
      title: 'Restaurant Menu Explorer',
      twistPrompt: 'When eating out or ordering in, pick the most interesting plant-based protein entrée on the menu.',
      benefitNote: 'Sparks new flavor ideas you can recreate at home.'
    },
    {
      id: 'env-twist-13',
      category: 'Environment',
      defaultWeek: 13,
      title: 'Signature Dish Celebration',
      twistPrompt: 'Revisit your favorite plant swap from the past 12 weeks and make it your signature go-to meal.',
      benefitNote: 'Locks in a permanent, enjoyable habit beyond Day 90.'
    }
  ],
  'Well-Being': [
    {
      id: 'well-twist-1',
      category: 'Well-Being',
      defaultWeek: 1,
      title: 'Across-the-Room Dock',
      twistPrompt: 'Move your charger across the room or outside the bedroom so reaching for your phone requires standing up.',
      benefitNote: 'Physical distance removes late-night scrolling autopilot.'
    },
    {
      id: 'well-twist-2',
      category: 'Well-Being',
      defaultWeek: 2,
      title: 'Warm Lamp Transition',
      twistPrompt: 'Swap bright overhead lights for a single warm lamp when your screen sunset begins.',
      benefitNote: 'Signals natural melatonin release earlier in the evening.'
    },
    {
      id: 'well-twist-3',
      category: 'Well-Being',
      defaultWeek: 3,
      title: 'Analog Audio Wind-Down',
      twistPrompt: 'Replace the last 15 minutes of screen time with calm instrumental music, an audiobook, or ambient rain.',
      benefitNote: 'Keeps evenings relaxing without visual blue-light stimulation.'
    },
    {
      id: 'well-twist-4',
      category: 'Well-Being',
      defaultWeek: 4,
      title: '2-Minute Brain Dump',
      twistPrompt: 'Jot tomorrow’s top 3 thoughts on paper right as screens power off so your mind rests clear.',
      benefitNote: 'Reduces mental racing when your head hits the pillow.'
    },
    {
      id: 'well-twist-5',
      category: 'Well-Being',
      defaultWeek: 5,
      title: 'Herbal Tea Ritual Cue',
      twistPrompt: 'Pair plugging in your phone for the night with brewing a caffeine-free chamomile or peppermint tea.',
      benefitNote: 'A soothing sensory reward makes powering down appealing.'
    },
    {
      id: 'well-twist-6',
      category: 'Well-Being',
      defaultWeek: 6,
      title: 'Grayscale Evening Mode',
      twistPrompt: 'Turn your phone display to grayscale 30 minutes before your sunset cutoff to strip visual scroll appeal.',
      benefitNote: 'Makes notifications and feeds noticeably less tempting.'
    },
    {
      id: 'well-twist-7',
      category: 'Well-Being',
      defaultWeek: 7,
      title: '5-Page Paper Book Sprint',
      twistPrompt: 'Keep a physical book or magazine on your nightstand and read just 5 relaxed pages after sunset.',
      benefitNote: 'Gives your attention a satisfying, screen-free landing pad.'
    },
    {
      id: 'well-twist-8',
      category: 'Well-Being',
      defaultWeek: 8,
      title: 'Evening Shoulder Unwind',
      twistPrompt: 'Do two slow neck and shoulder stretches the moment your screens go dark.',
      benefitNote: 'Releases physical tension built up from daytime posture.'
    },
    {
      id: 'well-twist-9',
      category: 'Well-Being',
      defaultWeek: 9,
      title: 'Early Sunset Experiment',
      twistPrompt: 'Try starting your screen sunset 15 minutes earlier on two nights this week and note morning alertness.',
      benefitNote: 'Micro-experiments reveal your personal sweet spot for deep rest.'
    },
    {
      id: 'well-twist-10',
      category: 'Well-Being',
      defaultWeek: 10,
      title: 'Sunrise Analog Morning',
      twistPrompt: 'Delay checking your phone for the first 10 minutes after waking up to extend last night’s calm.',
      benefitNote: 'Protects morning focus alongside your evening boundary.'
    },
    {
      id: 'well-twist-11',
      category: 'Well-Being',
      defaultWeek: 11,
      title: 'Co-Sunset Accountability',
      twistPrompt: 'Invite someone in your household or a friend to do a shared screen cutoff for one evening.',
      benefitNote: 'Shared quiet evenings turn rest into quality connection.'
    },
    {
      id: 'well-twist-12',
      category: 'Well-Being',
      defaultWeek: 12,
      title: 'Unplug One Extra Appliance',
      twistPrompt: 'Power down one extra standby screen or strip when you dock your phone for extra grid relief.',
      benefitNote: 'Amplifies your personal sleep ritual with tangible energy savings.'
    },
    {
      id: 'well-twist-13',
      category: 'Well-Being',
      defaultWeek: 13,
      title: 'Signature Wind-Down Mix',
      twistPrompt: 'Combine your favorite two evening cues from Weeks 1–12 into your permanent bedtime blueprint.',
      benefitNote: 'Cements a restorative night routine past Day 90.'
    }
  ],
  'Compassion': [
    {
      id: 'comp-twist-1',
      category: 'Compassion',
      defaultWeek: 1,
      title: 'Specific Praise Text',
      twistPrompt: 'Send a quick message naming one specific thing you appreciated about someone’s recent effort.',
      benefitNote: 'Specificity makes gratitude land twice as deeply.'
    },
    {
      id: 'comp-twist-2',
      category: 'Compassion',
      defaultWeek: 2,
      title: 'Unexpected Voice Note',
      twistPrompt: 'Swap a typed text for a 20-second warm voice memo wishing a friend or relative a great day.',
      benefitNote: 'Hearing a friendly voice sparks stronger emotional warmth.'
    },
    {
      id: 'comp-twist-3',
      category: 'Compassion',
      defaultWeek: 3,
      title: 'Frontline & Service Shoutout',
      twistPrompt: 'Leave a glowing 2-sentence review or direct thank-you for a local barista, driver, or helper.',
      benefitNote: 'Brightens everyday moments for people who rarely get praised.'
    },
    {
      id: 'comp-twist-4',
      category: 'Compassion',
      defaultWeek: 4,
      title: 'Long-Time-No-Talk Check-In',
      twistPrompt: 'Reach out to someone you haven’t spoken with in months just to share a positive memory.',
      benefitNote: 'Low-pressure reconnection yields high mutual joy.'
    },
    {
      id: 'comp-twist-5',
      category: 'Compassion',
      defaultWeek: 5,
      title: 'Micro-Treat Pay-Forward',
      twistPrompt: 'Surprise a coworker, neighbor, or friend with a small snack, tea bag, or coffee.',
      benefitNote: 'Small tangible gestures break up ordinary midweek routines.'
    },
    {
      id: 'comp-twist-6',
      category: 'Compassion',
      defaultWeek: 6,
      title: 'Active Listening Pause',
      twistPrompt: 'During one conversation, put devices away and ask one thoughtful follow-up question.',
      benefitNote: 'Undivided attention is one of the rarest forms of kindness.'
    },
    {
      id: 'comp-twist-7',
      category: 'Compassion',
      defaultWeek: 7,
      title: 'Handwritten Sticky Note',
      twistPrompt: 'Leave a short encouraging handwritten note on a desk, fridge, or lunchbox.',
      benefitNote: 'Physical notes stay visible and spark repeated smiles.'
    },
    {
      id: 'comp-twist-8',
      category: 'Compassion',
      defaultWeek: 8,
      title: 'Silent Burden Lifter',
      twistPrompt: 'Quietly handle one small shared chore or errand for someone before they expect it.',
      benefitNote: 'Practical kindness relieves everyday stress instantaneously.'
    },
    {
      id: 'comp-twist-9',
      category: 'Compassion',
      defaultWeek: 9,
      title: 'Mentor or Teacher Thank-You',
      twistPrompt: 'Message someone who taught or guided you earlier in life to share how their advice still helps.',
      benefitNote: 'Shows lasting impact and boosts both peoples’ sense of purpose.'
    },
    {
      id: 'comp-twist-10',
      category: 'Compassion',
      defaultWeek: 10,
      title: 'Community Resource Share',
      twistPrompt: 'Pass along a helpful book, article, job lead, or recipe tailored to someone’s current goal.',
      benefitNote: 'Turns everyday attention into meaningful support.'
    },
    {
      id: 'comp-twist-11',
      category: 'Compassion',
      defaultWeek: 11,
      title: 'Self-Compassion Reset',
      twistPrompt: 'Write down one win you gave yourself grace on this week alongside your outreach to others.',
      benefitNote: 'Sustainable compassion starts with keeping your own tank full.'
    },
    {
      id: 'comp-twist-12',
      category: 'Compassion',
      defaultWeek: 12,
      title: 'Neighborhood Ripple Walk',
      twistPrompt: 'Offer genuine eye contact, a warm greeting, or a helping hand to three neighbors or passersby.',
      benefitNote: 'Strengthens local belonging right outside your door.'
    },
    {
      id: 'comp-twist-13',
      category: 'Compassion',
      defaultWeek: 13,
      title: 'Kindness Highlight Reel',
      twistPrompt: 'Pick your favorite kindness format from the past 12 weeks and repeat it for someone new.',
      benefitNote: 'Carries your effortless kindness rhythm past Day 90.'
    }
  ],
  'Responsible AI': [
    {
      id: 'rai-twist-1',
      category: 'Responsible AI',
      defaultWeek: 1,
      title: '3-Bullet Brainstorm First',
      twistPrompt: 'Write three rough bullets of your own thinking before opening any AI tool this week.',
      benefitNote: 'Preserves original voice and cuts unnecessary follow-up prompts.'
    },
    {
      id: 'rai-twist-2',
      category: 'Responsible AI',
      defaultWeek: 2,
      title: 'One-Shot Format Constraint',
      twistPrompt: 'Include exact output length and structure in your very first prompt to avoid repeat regeneration.',
      benefitNote: 'Reduces wasted server compute while giving cleaner answers.'
    },
    {
      id: 'rai-twist-3',
      category: 'Responsible AI',
      defaultWeek: 3,
      title: 'Primary Statistic Audit',
      twistPrompt: 'Pick one number, date, or citation from an AI reply and trace it directly to its primary source.',
      benefitNote: 'Catches subtle hallucinations before they reach your work.'
    },
    {
      id: 'rai-twist-4',
      category: 'Responsible AI',
      defaultWeek: 4,
      title: 'Human Search Sprint',
      twistPrompt: 'For one quick factual question a day, check a trusted bookmarked reference directly instead of prompting AI.',
      benefitNote: 'Saves energy-heavy LLM calls for tasks that truly need synthesis.'
    },
    {
      id: 'rai-twist-5',
      category: 'Responsible AI',
      defaultWeek: 5,
      title: 'Counter-Argument Check',
      twistPrompt: 'Ask yourself what perspective or nuance the AI summary left out before adopting its conclusion.',
      benefitNote: 'Sharpens critical judgment and balanced decision-making.'
    },
    {
      id: 'rai-twist-6',
      category: 'Responsible AI',
      defaultWeek: 6,
      title: 'Plain-English Rewrite Pass',
      twistPrompt: 'Take one AI-assisted draft and rewrite the opening lines completely in your natural speaking voice.',
      benefitNote: 'Keeps communication authentic, crisp, and recognizably yours.'
    },
    {
      id: 'rai-twist-7',
      category: 'Responsible AI',
      defaultWeek: 7,
      title: 'Local Knowledge First',
      twistPrompt: 'Check your own notes, docs, or bookmarks for 60 seconds before launching a new AI chat.',
      benefitNote: 'Strengthens recall and trims redundant cloud queries.'
    },
    {
      id: 'rai-twist-8',
      category: 'Responsible AI',
      defaultWeek: 8,
      title: 'Quote & Attribution Check',
      twistPrompt: 'Verify any attributed quote or author name directly before pasting it into notes or slides.',
      benefitNote: 'Protects your credibility and prevents misattribution.'
    },
    {
      id: 'rai-twist-9',
      category: 'Responsible AI',
      defaultWeek: 9,
      title: 'Batch Your Questions',
      twistPrompt: 'Group 2–3 related questions into a single structured prompt rather than firing separate chats.',
      benefitNote: 'Saves cooling water and time in one clean workflow.'
    },
    {
      id: 'rai-twist-10',
      category: 'Responsible AI',
      defaultWeek: 10,
      title: 'AI-Free Creative Block',
      twistPrompt: 'Complete one full 20-minute outline or creative draft completely offline before reviewing with tools.',
      benefitNote: 'Keeps creative problem-solving muscles agile and confident.'
    },
    {
      id: 'rai-twist-11',
      category: 'Responsible AI',
      defaultWeek: 11,
      title: 'Edge-Case Stress Test',
      twistPrompt: 'Spot one hidden assumption in an AI recommendation and check whether it fits your real-world context.',
      benefitNote: 'Builds sharper analytical instincts in work and daily life.'
    },
    {
      id: 'rai-twist-12',
      category: 'Responsible AI',
      defaultWeek: 12,
      title: 'Share a Verification Habit',
      twistPrompt: 'Pass along one reliable source or crisp prompt habit you discovered to a peer or teammate.',
      benefitNote: 'Multiplies accurate, sustainable AI habits across your circle.'
    },
    {
      id: 'rai-twist-13',
      category: 'Responsible AI',
      defaultWeek: 13,
      title: 'Personal Guardrail Checklist',
      twistPrompt: 'Combine your top two source-checking and single-pass habits into your everyday digital workflow.',
      benefitNote: 'Keeps your mind sharp and digital footprint light past Day 90.'
    }
  ]
};

export function getDefaultTwistOrder(category: Category): string[] {
  const twists = NOVELTY_TWISTS_BY_CATEGORY[category] || NOVELTY_TWISTS_BY_CATEGORY['Environment'];
  return twists.map((t) => t.id);
}

export function getTwistById(category: Category, id: string): WeeklyNoveltyTwist {
  const twists = NOVELTY_TWISTS_BY_CATEGORY[category] || NOVELTY_TWISTS_BY_CATEGORY['Environment'];
  return twists.find((t) => t.id === id) || twists[0];
}

export function getWeekDaySpan(weekNumber: number): string {
  const startDay = (weekNumber - 1) * 7 + 1;
  const endDay = Math.min(TOTAL_PLAN_DAYS, weekNumber * 7);
  return `Days ${startDay}–${endDay}`;
}
