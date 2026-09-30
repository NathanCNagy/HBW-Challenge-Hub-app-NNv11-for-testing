# Habits for a Better World - Agent & Contributor Guidelines

This document establishes the architectural standards, code patterns, and design system conventions for the **Habits for a Better World** project to ensure maintainable, high-quality development for humans and vibe coding assistants.

---

## 🏛️ System Architecture

- **Framework**: React 18+ with TypeScript & Vite.
- **Backend / Deployment**: Custom Express production server (`server.ts` / `dist/server.cjs`) on Google Cloud Run container runtime.
- **Persistence Layer**:
  - `src/services/storage.ts`: Strongly-typed, resilient browser localStorage layer with in-memory fallback.
  - `src/services/syncQueue.ts`: Batched Firestore mutations with network & battery awareness.
  - `src/context/HabitContext.tsx`: Centralized React Context providing global user profile, theme, streak, energy, and committed habits.
- **Styling**: Tailwind CSS utility classes with light and dark theme styling tokens.
- **Icons**: Imported strictly from `lucide-react`.

---

## 📂 Codebase Structure

```
src/
├── components/
│   ├── alerts/                    # Smart alerts subcomponents (TriggerItem, TriggerForm, NotificationPreviewCard)
│   ├── dashboard/                 # Tab views (HomeTab, ProgressTab, ProfileTab, OverflowSettingsMenu)
│   ├── AuthScreen.tsx             # Authentication and guest sign-in
│   ├── CommunityChat.tsx          # Peer support & category channel
│   ├── DashboardSimulation.tsx    # Mobile dashboard coordinator & tab router
│   ├── DeviceSimulator.tsx        # Responsive viewport frame wrapper
│   ├── EcosystemVisualization.tsx # Gamified Ant Forest-style tree visualizer
│   ├── GoalRecommendations.tsx    # Recommended 3-month habit pathways
│   ├── HabitsManager.tsx          # Habit wardrobe and category catalog
│   ├── HBWLogo.tsx                # Scalable brand vector logo
│   ├── OnboardingQuiz.tsx         # Clinical assessment & preference quiz
│   └── SmartAlerts.tsx            # Habit anchors, cues & in-app reminder previews
├── context/
│   └── HabitContext.tsx           # Global state management
├── services/
│   ├── storage.ts                 # Unified typed persistent storage
│   ├── syncQueue.ts               # Batched Firestore sync queue
│   └── mmkv.ts                    # Compatibility proxy
├── utils/
│   └── pdfExport.ts               # Printable 90-day action plan PDF exporter
├── data.ts                        # Curated scientific habit pathways
├── firebase.ts                    # Firebase client initialization
├── types.ts                       # TypeScript interfaces & domain models
└── App.tsx                        # Root application orchestrator
```

---

## 🎨 Design Tokens & UI Rules (SACROSANCT)

> [!IMPORTANT]
> **SACROSANCT BRAND ASSETS & STYLING**:
> The favicon (`/public/favicon.svg`), typography system, and color palette defined below are **strictly sacrosanct**. They must never be altered, replaced, or overridden in any feature or styling updates.

1. **Favicon (Sacrosanct)**:
   - File: `/public/favicon.svg` (linked in `index.html` via `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`).
   - Visual: Two-tone circular emblem representing Habits for a Better World (`#0080FF` vibrant blue left hemisphere, `#3892FF` light blue right hemisphere). Do NOT replace or modify this asset.

2. **Colors (Sacrosanct Palette)**:
   - Primary Accent: `#0080FF` (Buttons, active tabs, energetic highlights)
   - Secondary Accent / Sky Blue: `#3892FF` (Logo split tone, brand gradient highlights)
   - Success: `#34C759` (Completions, verified status, PDF exports)
   - Alert / Energy: `#FF9500` (Gamified energy bubbles, notices)
   - Danger: `#FF3B30` (Sign out, destructive actions)
   - Light Mode Canvas: `#F5F5F7` (Background), `#FFFFFF` (Cards), `#E5E5EA` (Borders), `#1C1C1E` (Text)
   - Dark Mode Canvas: `#0A0A0C` (Background), `#121214` (Cards), `#1F1F24` (Borders), `#FFFFFF` (Text)
   - Muted Labels: `#6C6C70` (Light), `#8E8E93` / `#98989D` (Dark)

3. **Typography (Sacrosanct Fonts)**:
   - Font Definition (`src/index.css`):
     - Display / Headings (`font-serif`): `"Playfair Display", Georgia, serif`
     - Body & Controls (`font-sans`): `"Inter", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif`
     - Metrics & Timers (`font-mono`): `"JetBrains Mono", ui-monospace, SFMono-Regular, monospace`
   - Rules:
     - Headings: `font-serif` with editorial italic emphasis or bold `font-sans` with tight tracking.
     - Body & Controls: `font-sans` with line height 1.5–1.7.
     - Metrics & Timers: `font-mono` with uppercase styling.

4. **Interactivity & Craft**:
   - Always provide accessible touch targets (≥44px on interactive controls).
   - Use `motion/react` for smooth view entries and state transitions.
   - Keep button labels on a single line (`whitespace-nowrap`).

---

## 🛠️ Development & Build Commands

- **Local Dev Server**: `npm run dev`
- **Lint Codebase**: `npm run lint`
- **Production Build**: `npm run build`
- **Start Production Server**: `npm run start`

---

## 🤖 Vibe Coding Best Practices

- When modifying tabs, edit the specific subcomponent in `src/components/dashboard/` rather than expanding `DashboardSimulation.tsx`.
- Use the `useHabit()` hook from `src/context/HabitContext.tsx` to read or mutate global habit state instead of prop drilling.
- Rely on `src/services/storage.ts` for any persistent keys to ensure type safety and error tolerance.
