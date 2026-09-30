/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { toPng } from 'html-to-image';
import JSZip from 'jszip';

export interface AppScreenshotItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  fileName: string;
}

export const APP_SCREENSHOTS_CATALOG: AppScreenshotItem[] = [
  {
    id: 'screen-01-onboarding',
    title: 'Onboarding Assessment & Quiz',
    subtitle: 'Clinical Habit Diagnostic & Personalization',
    category: 'Assessment',
    description: 'Personalized demographic assessment matching age, life stage, and core motivation with evidence-based habit interventions.',
    fileName: '01_onboarding_assessment.png'
  },
  {
    id: 'screen-02-recommendation',
    title: 'Recommended Habit Plan',
    subtitle: 'Win-Win Planetary & Personal Impact',
    category: 'Recommendation',
    description: 'Pillar action recommendation displaying tangible 3-month win-win projections (avoided driving miles, saved grocery budget, restorative sleep).',
    fileName: '02_recommended_habit_plan.png'
  },
  {
    id: 'screen-03-dashboard',
    title: 'Daily Action Dashboard',
    subtitle: 'Active Streak & Habit Check-in',
    category: 'Daily Routine',
    description: 'Real-time habit execution hub with instant logging, streak counters, daily tips, and contextual behavioral prompts.',
    fileName: '03_daily_action_dashboard.png'
  },
  {
    id: 'screen-04-ecosystem',
    title: 'Gamified Ecosystem Visualizer',
    subtitle: 'Living Energy Tree & Floating Bubbles',
    category: 'Gamification',
    description: 'Ant-Forest inspired gamification where every logged habit earns energy bubbles to nourish and grow your personal forest ecosystem.',
    fileName: '04_ecosystem_tree_visualizer.png'
  },
  {
    id: 'screen-05-wardrobe',
    title: 'Multi-Pillar Habit Wardrobe',
    subtitle: 'Evidence-Based Scientific Catalog',
    category: 'Catalog',
    description: 'Comprehensive library of high-leverage habits across Environment, Well-Being, Compassion, and Responsible AI.',
    fileName: '05_habit_wardrobe_catalog.png'
  },
  {
    id: 'screen-06-alerts',
    title: 'Smart Cues & Anchors',
    subtitle: 'Contextual In-App & Push Previews',
    category: 'Behavioral Science',
    description: 'B.J. Fogg Tiny Habits implementation attaching habit actions to existing sensory triggers, morning routines, and notification previews.',
    fileName: '06_smart_cues_and_alerts.png'
  },
  {
    id: 'screen-07-community',
    title: 'Peer Support & Community Channels',
    subtitle: 'Real-Time Global Discussion Feed',
    category: 'Social Accountability',
    description: 'Live peer discussion channels organized by habit pillar to share daily wins, tips, and mutual accountability.',
    fileName: '07_community_channels.png'
  },
  {
    id: 'screen-08-profile',
    title: 'Clinical Profile & 90-Day Plan',
    subtitle: 'PDF Action Plan & Compounding Stats',
    category: 'Profile & Export',
    description: 'Complete user demographic profile, compliance metrics, and printable 90-day behavioral action plan export.',
    fileName: '08_clinical_profile_and_pdf.png'
  },
  {
    id: 'screen-09-smartwatch',
    title: 'Smartwatch Companion',
    subtitle: 'Wrist Micro-Interactions & Haptic Prompts',
    category: 'Wearables',
    description: 'Quick-glance Apple Watch and Wear OS companion interface for friction-free wrist check-ins and heart-rate sync.',
    fileName: '09_smartwatch_companion.png'
  }
];

/**
 * Downloads a DOM element as a high-resolution PNG image, extending to capture the full frame
 */
export async function downloadElementAsPNG(element: HTMLElement, fileName: string): Promise<void> {
  const scrollHeight = Math.max(element.scrollHeight, element.offsetHeight);
  const scrollWidth = Math.max(element.scrollWidth, element.offsetWidth);

  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    cacheBust: true,
    width: scrollWidth,
    height: scrollHeight,
    style: {
      height: `${scrollHeight}px`,
      maxHeight: 'none',
      overflow: 'visible',
    }
  });

  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates and downloads a ZIP containing all rendered screen elements as PNGs
 */
export async function downloadAllScreenshotsZip(
  screenElements: { id: string; fileName: string; element: HTMLElement }[],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('habits-app-screenshots');

  for (let i = 0; i < screenElements.length; i++) {
    const item = screenElements[i];
    if (onProgress) onProgress(i + 1, screenElements.length);

    const el = item.element;
    const scrollHeight = Math.max(el.scrollHeight, el.offsetHeight);
    const scrollWidth = Math.max(el.scrollWidth, el.offsetWidth);

    const dataUrl = await toPng(el, {
      pixelRatio: 2,
      cacheBust: true,
      width: scrollWidth,
      height: scrollHeight,
      style: {
        height: `${scrollHeight}px`,
        maxHeight: 'none',
        overflow: 'visible',
      }
    });

    const base64Data = dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    folder?.file(item.fileName, base64Data, { base64: true });
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.download = 'Habits_For_A_Better_World_Screenshots_PNG.zip';
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
