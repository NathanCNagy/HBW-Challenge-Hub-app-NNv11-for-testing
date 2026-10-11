# Implementation Plan: Personalized Daily Habit Tips with Verified Sources

Replace the static daily quote in the home screen with personalized, demographic-aware daily tips designed to help users succeed with their chosen habit.

## 1. Curated Habit & Demographic Tip Catalog (`src/data/tips.ts`)
Create a structured catalog of actionable tips categorized by:
- **Category & Habit**:
  - `Environment` (e.g. *Plant-Protein Meal Swap*): Batch prep shortcuts, flavor balancing, high-protein plant hacks, cooking without extra dirty dishes.
  - `Responsible AI` (e.g. *Mindful AI & Fact-Check*): Concise prompting strategies, single-pass system instructions that reduce multi-turn energy drain, critical source-checking routines.
  - `Well-Being` (e.g. *Evening Screen Sunset*): Screen replacement rituals, circadian lighting, bedroom device docking stations.
  - `Compassion` (e.g. *Weekly Kindness Circle*): Micro-affirmations, frictionless appreciation habits, community gestures.
- **Demographic Targeting**:
  - Age brackets: Under 25 (students/early career, budget-friendly, quick meals), 26–45 (busy working professionals/parents, time efficiency, family-friendly batching), 46+ (longevity, heart health, ease, sustainable routines).
  - Gender awareness: Subtle contextual hooks (e.g., muscle recovery & plant iron for active men/women, hormone balance/satiety) or universal high-value tips when demographics are broad.
- **Each Tip Structure**:
  - `id`: Unique identifier
  - `category`: Category string
  - `title`: Short punchy tip title (e.g., *"10-Minute Canned Chickpea Crunch"*, *"One-Shot Prompt Framework"*)
  - `content`: 1–2 practical, actionable sentences
  - `demographicTag`: Label explaining relevance (e.g., *"Best for ages 20–35"*, *"Quick prep for busy schedules"*)
  - `source`:
    - `name`: Verified channel/creator/organization (e.g., *"Rainbow Plant Life (YouTube)"*, *"Pick Up Limes"*, *"OpenAI Energy Research"*, *"Huberman Lab"*)
    - `url`: Direct link to external verified video or guide
    - `isVerified`: `true`

## 2. Tip Selection Utility (`src/utils/tipSelector.ts`)
- Function `getDailyTip(category, answers, dayOffset = 0)`:
  - Filters matching tips for the user's category and demographic profile (age, gender).
  - Uses the current calendar day (`new Date().toDateString()`) plus optional `dayOffset` (or shuffle counter) to select a deterministic tip for the day.
  - Fallbacks gracefully to general category tips if demographics don't match strict filters.

## 3. UI Update in `HomeTab.tsx`
Replace the `Motivational Psychology Card` at the bottom of `HomeTab.tsx` with a **Daily Habit Tip** card:
- Header: Lightbulb icon (`Lightbulb`), `"Daily Habit Tip"` label, plus a subtle demographic badge (e.g. `"Tailored for You"`).
- Action buttons: A `"Next Tip"` / `"Shuffle"` button (`RefreshCw` icon) to browse other tips.
- Body:
  - Tip title in bold font-sans.
  - Actionable advice text in clean typography.
- Verified Source Footer:
  - Verified badge with checkmark (`CheckCircle2` / `ExternalLink`).
  - Clickable link opening in safe new tab (`target="_blank" rel="noopener noreferrer"`).
- Retains existing dark/light theme tokens and sacrosanct brand styles (`#0080FF`, `#34C759`, JetBrains Mono / Inter).

## 4. Verification & Testing
- Test across various demographic profiles (e.g., age 22 vs 35 vs 55, Environment vs Responsible AI).
- Verify the Shuffle button cycles through tips smoothly.
- Ensure linting and compilation succeed with 0 errors.
