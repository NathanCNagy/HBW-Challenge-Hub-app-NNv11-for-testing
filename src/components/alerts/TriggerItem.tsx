/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Edit2, Trash2, Calendar } from 'lucide-react';
import { HabitTrigger } from '../../types';

interface TriggerItemProps {
  key?: React.Key;
  trigger: HabitTrigger;
  isDark: boolean;
  onToggle: (id: string) => void;
  onStartEdit: (trigger: HabitTrigger) => void;
  onDelete: (id: string) => void;
}

export function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return '08:00 AM';
  const [hourStr, minStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const min = minStr || '00';
  if (isNaN(hour)) return timeStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour}:${min} ${ampm}`;
}

export function formatDaysSummary(days: string[]): string {
  if (!days || days.length === 0) return 'No days set';
  if (days.length === 7) return 'Every day';
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const weekends = ['Sat', 'Sun'];
  if (days.length === 5 && weekdays.every((d) => days.includes(d))) return 'Weekdays (Mon–Fri)';
  if (days.length === 2 && weekends.every((d) => days.includes(d))) return 'Weekends (Sat–Sun)';
  if (days.length === 3 && ['Mon', 'Wed', 'Fri'].every((d) => days.includes(d))) return 'Mon · Wed · Fri';
  if (days.length === 2 && ['Tue', 'Thu'].every((d) => days.includes(d))) return 'Tue · Thu';
  if (days.length === 1) return `Weekly (${days[0]})`;
  return days.join(' · ');
}

export default function TriggerItem({
  trigger,
  isDark,
  onToggle,
  onStartEdit,
  onDelete
}: TriggerItemProps) {
  const daysSummary = formatDaysSummary(trigger.days);
  const isAlternate = trigger.days && trigger.days.length > 0 && trigger.days.length < 7;

  return (
    <div
      className={`p-3.5 border rounded-[16px] flex flex-col gap-2.5 transition-all ${
        trigger.enabled
          ? isDark
            ? 'bg-[#0A0A0C] border-[#1F1F24] hover:border-[#27272A]'
            : 'bg-[#F9F9FB] border-[#E5E5EA] hover:border-[#D1D1D6]'
          : isDark
            ? 'bg-[#0A0A0C]/50 border-[#1F1F24]/50 opacity-60'
            : 'bg-[#F9F9FB]/60 border-[#E5E5EA]/60 opacity-60'
      }`}
    >
      {/* Top Row: Toggle switch + Anchor Name (expanded width) + Time badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <label className="relative inline-flex items-center cursor-pointer shrink-0" title={trigger.enabled ? 'Enabled' : 'Disabled'}>
            <input
              type="checkbox"
              checked={trigger.enabled}
              onChange={() => onToggle(trigger.id)}
              className="sr-only peer"
            />
            <div
              className={`w-8 h-4.5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#0080FF] ${
                isDark ? 'bg-[#1F1F24]' : 'bg-[#E5E5EA]'
              }`}
            />
          </label>

          <p
            className={`text-xs font-sans font-semibold truncate ${
              isDark ? 'text-white' : 'text-[#1C1C1E]'
            }`}
            title={trigger.name}
          >
            {trigger.name}
          </p>
        </div>

        {/* Time Badge */}
        <button
          type="button"
          onClick={() => onStartEdit(trigger)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border transition-colors cursor-pointer shrink-0 ${
            isDark
              ? 'bg-[#121214] hover:bg-[#18181B] text-[#0080FF] border-[#1F1F24] hover:border-[#0080FF]/50'
              : 'bg-white hover:bg-[#F2F2F7] text-[#0066CC] border-[#E5E5EA] hover:border-[#0080FF]/50 shadow-2xs'
          }`}
          title="Click to edit trigger time & days"
        >
          <Clock className="w-3.5 h-3.5 text-[#0080FF]" />
          <span>{formatTimeDisplay(trigger.time)}</span>
        </button>
      </div>

      {/* Bottom Row: Days Schedule & Actions with clean spacing */}
      <div className={`flex items-center justify-between gap-2.5 pt-2 border-t border-dashed ${
        isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
      }`}>
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Calendar className="w-3.5 h-3.5 text-[#0080FF] shrink-0 opacity-80" />
          <span
            className={`text-[11px] font-sans truncate ${
              isAlternate
                ? isDark ? 'text-[#3892FF] font-medium' : 'text-[#0066CC] font-medium'
                : isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
            }`}
          >
            {daysSummary}
          </span>
        </div>

        {/* Actions: Edit & Delete buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onStartEdit(trigger)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-sans font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
              isDark
                ? 'border-[#1F1F24] hover:border-[#0080FF] text-[#98989D] hover:text-white bg-[#121214]'
                : 'border-[#E5E5EA] hover:border-[#0080FF] text-[#6C6C70] hover:text-[#1C1C1E] bg-white'
            }`}
            title="Edit trigger"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(trigger.id)}
            className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
              isDark
                ? 'border-[#1F1F24] hover:border-red-500/50 text-[#98989D] hover:text-red-400 bg-[#121214]'
                : 'border-[#E5E5EA] hover:border-red-500/50 text-[#6C6C70] hover:text-red-500 bg-white'
            }`}
            title="Delete trigger"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
