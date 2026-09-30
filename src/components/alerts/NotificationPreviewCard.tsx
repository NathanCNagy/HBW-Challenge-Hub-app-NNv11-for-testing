/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Smartphone, Bell } from 'lucide-react';
import { HabitTrigger } from '../../types';
import { formatTimeDisplay, formatDaysSummary } from './TriggerItem';

interface NotificationPreviewCardProps {
  primaryTrigger: HabitTrigger;
  goalTitle: string;
  isDark: boolean;
}

export default function NotificationPreviewCard({
  primaryTrigger,
  goalTitle,
  isDark
}: NotificationPreviewCardProps) {
  const handleTestAlert = () => {
    window.dispatchEvent(
      new CustomEvent('hbw:add-notification', {
        detail: {
          id: Date.now(),
          title: 'Habit Reminder 🔔',
          body: `After "${primaryTrigger.name}", take a moment for "${goalTitle}".`,
          type: 'alert'
        }
      })
    );
  };

  return (
    <div
      className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-2.5 transition-colors duration-200 ${
        isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}
        >
          Notification Preview
        </span>
        <span
          className={`text-[10px] font-mono ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}
        >
          {formatTimeDisplay(primaryTrigger.time)} • {formatDaysSummary(primaryTrigger.days)}
        </span>
      </div>

      <div
        className={`p-3.5 rounded-[14px] flex items-start gap-3 border ${
          isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
        }`}
      >
        <Smartphone className="w-5 h-5 text-[#0080FF] shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <div className="flex justify-between items-baseline">
            <span
              className={`font-bold text-xs ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}
            >
              HABITS FOR A BETTER WORLD
            </span>
            <span
              className={`text-[10px] font-mono ${
                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}
            >
              {formatTimeDisplay(primaryTrigger.time)}
            </span>
          </div>
          <p
            className={`text-xs font-sans leading-normal ${
              isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
            }`}
          >
            ⏰ Reminder: Right after{' '}
            <strong>"{primaryTrigger.name}"</strong>, complete your{' '}
            <strong>"{goalTitle}"</strong>.
          </p>
        </div>
      </div>

      {/* Test In-App Notification Trigger */}
      <button
        type="button"
        onClick={handleTestAlert}
        className={`w-full h-[44px] mt-0.5 border text-xs font-sans font-semibold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isDark
            ? 'bg-[#0A0A0C] hover:bg-[#18181B] text-[#0080FF] border-[#1F1F24]'
            : 'bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#0080FF] border-[#E5E5EA]'
        }`}
      >
        <Bell className="w-4 h-4 text-[#0080FF]" />
        <span>Test In-App Alert</span>
      </button>
    </div>
  );
}
