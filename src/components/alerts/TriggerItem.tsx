/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Edit2, Trash2 } from 'lucide-react';
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
  if (days.length === 5 && weekdays.every((d) => days.includes(d))) return 'Weekdays';
  if (days.length === 2 && weekends.every((d) => days.includes(d))) return 'Weekends';
  return days.join(', ');
}

export default function TriggerItem({
  trigger,
  isDark,
  onToggle,
  onStartEdit,
  onDelete
}: TriggerItemProps) {
  return (
    <div
      className={`p-3 border rounded-[14px] flex items-center justify-between gap-3 transition-all ${
        trigger.enabled
          ? isDark
            ? 'bg-[#0A0A0C] border-[#1F1F24]'
            : 'bg-[#F9F9FB] border-[#E5E5EA]'
          : isDark
            ? 'bg-[#0A0A0C]/50 border-[#1F1F24]/50 opacity-60'
            : 'bg-[#F9F9FB]/60 border-[#E5E5EA]/60 opacity-60'
      }`}
    >
      {/* Left: Checkbox toggle & Name */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
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

        <div className="min-w-0 flex-1">
          <p
            className={`text-xs font-sans font-semibold truncate ${
              isDark ? 'text-white' : 'text-[#1C1C1E]'
            }`}
          >
            {trigger.name}
          </p>
          <p
            className={`text-[10px] font-mono leading-tight ${
              isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
            }`}
          >
            {formatDaysSummary(trigger.days)}
          </p>
        </div>
      </div>

      {/* Right: Time Pill & Edit / Delete */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onStartEdit(trigger)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium border transition-colors cursor-pointer ${
            isDark
              ? 'bg-[#121214] hover:bg-[#18181B] text-[#0080FF] border-[#1F1F24] hover:border-[#0080FF]/50'
              : 'bg-white hover:bg-[#F2F2F7] text-[#0066CC] border-[#E5E5EA] hover:border-[#0080FF]/50 shadow-2xs'
          }`}
          title="Click to edit trigger time & days"
        >
          <Clock className="w-3 h-3 text-[#0080FF]" />
          <span>{formatTimeDisplay(trigger.time)}</span>
        </button>

        <button
          type="button"
          onClick={() => onStartEdit(trigger)}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isDark
              ? 'border-[#1F1F24] hover:border-[#0080FF] text-[#98989D] hover:text-white bg-[#121214]'
              : 'border-[#E5E5EA] hover:border-[#0080FF] text-[#6C6C70] hover:text-[#1C1C1E] bg-white'
          }`}
          title="Edit trigger"
        >
          <Edit2 className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(trigger.id)}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
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
  );
}
