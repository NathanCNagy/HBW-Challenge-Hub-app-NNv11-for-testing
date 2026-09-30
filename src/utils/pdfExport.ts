/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { Goal } from '../types';

export function downloadHabitPlanPDF(activeGoal: Goal, streak: number, targetTip: string): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4' // 595.28 x 841.89 points
  });

  const primaryColor = [2, 133, 255]; // Blue accent
  const accentColor = [56, 161, 243]; // Light blue
  const textDark = [15, 23, 42]; // Slate 900
  const textMuted = [100, 116, 139]; // Slate 500
  const bgLight = [248, 250, 252]; // Slate 50

  // Draw background
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.rect(0, 0, 595, 842, 'F');

  // Draw border
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(2);
  doc.rect(20, 20, 555, 802, 'D');

  // Title / Header
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.text('HABITS FOR A BETTER WORLD', 297, 65, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('3-MONTH CLINICAL BEHAVIOR CHANGE ACTION PLAN', 297, 85, { align: 'center' });

  // Decorative line
  doc.setDrawColor(2, 133, 255);
  doc.setLineWidth(1.5);
  doc.line(50, 95, 545, 95);

  // Section 1: Active Focus
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('COMMITTED HABIT FOCUS', 50, 125);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(activeGoal.title, 50, 145);

  // ACTION
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('DAILY HABIT ACTION PATHWAY:', 50, 172);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const actionText = doc.splitTextToSize(activeGoal.action, 495);
  doc.text(actionText, 50, 190);

  const actionHeight = actionText.length * 15;
  const impactStart = 190 + actionHeight + 20;

  // Section 2: Personal Impact Projection
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('90-DAY COMPOUNDING DIRECT IMPACT', 50, impactStart);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  const cleanImpact = activeGoal.impact
    .replace(/\[IMPACT\]\n/g, '')
    .replace(/\[CONTEXT\]\n/g, '\nContext:\n')
    .replace(/\[OPTIMIZATION\]\n/g, '\nOptimization Insights:\n');

  const impactTextLines = doc.splitTextToSize(cleanImpact, 495);
  doc.text(impactTextLines, 50, impactStart + 18);

  const impactHeight = impactTextLines.length * 14;
  const routineStart = impactStart + 18 + impactHeight + 22;

  // Section 3: Daily Routine Anchoring
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SCIENTIFIC ROUTINE ANCHORING TIP', 50, routineStart);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const tipText = doc.splitTextToSize(
    `${targetTip} To maximize reliability: perform your microchange right after a static daily anchor event (such as brushing your teeth or brewing your morning coffee). Placing visual reminders in plain sight removes starting friction.`,
    495
  );
  doc.text(tipText, 50, routineStart + 18);

  const tipHeight = tipText.length * 14;
  const progressStart = routineStart + 18 + tipHeight + 25;

  // Section 4: Progress Grid
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('90-DAY PROGRESS JOURNAL & STREAK TRACKER', 50, progressStart);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Active Streak: ${streak} days completed. Check off each box upon completing your habit today.`, 50, progressStart + 15);

  const boxSize = 22;
  const spacing = 6;
  const startX = 50;
  const startY = progressStart + 28;

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 15; c++) {
      const x = startX + c * (boxSize + spacing);
      const y = startY + r * (boxSize + spacing);
      const boxIndex = r * 15 + c + 1;

      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(1);

      if (boxIndex <= streak) {
        doc.setFillColor(2, 133, 255);
        doc.rect(x, y, boxSize, boxSize, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('✔', x + boxSize / 2, y + boxSize / 2 + 3, { align: 'center' });
      } else {
        doc.setFillColor(255, 255, 255);
        doc.rect(x, y, boxSize, boxSize, 'FD');

        doc.setTextColor(148, 163, 184);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(boxIndex.toString(), x + boxSize / 2, y + boxSize / 2 + 3, { align: 'center' });
      }
    }
  }

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Habits for a Better World Foundation', 297, 785, { align: 'center' });

  doc.save(`habits_better_world_${activeGoal.id}_plan.pdf`);
}
