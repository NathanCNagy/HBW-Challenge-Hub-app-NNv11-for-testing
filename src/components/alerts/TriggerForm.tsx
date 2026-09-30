/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check } from 'lucide-react';
import { formatTimeDisplay } from './TriggerItem';

interface TriggerFormProps {
  key?: React.Key;
  title: string;
  name: string;
  setName: (name: string) => void;
  time: string;
  setTime: (time: string) => void;
  days: string[];
  setDays: (days: string[]) => void;
  allDays: string[];
  onSave: () => void;
  onCancel: () => void;
  isDark: boolean;
  submitLabel: string;
}

export default function TriggerForm({
  title,
  name,
  setName,
  time,
  setTime,
  days,
  setDays,
  allDays,
  onSave,
  onCancel,
  isDark,
  submitLabel
}: TriggerFormProps) {
  const toggleDaySelection = (day: string) => {
    if (days.includes(day)) {
      if (days.length === 1) return; // keep at least 1 day
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  return (
    <div
      className={`p-3.5 border rounded-[14px] flex flex-col gap-3 transition-all ${
        isDark
          ? 'bg-[#0A0A0C] border-[#0080FF]/60'
          : 'bg-[#F9F9FB] border-[#0080FF]/60 ring-1 ring-[#0080FF]/20'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0080FF]">
          {title}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className={`p-1 rounded-full hover:opacity-75 cursor-pointer ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Routine / Cue input */}
      <div className="space-y-1">
        <label
          className={`text-[10px] font-mono uppercase font-semibold ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}
        >
          Daily Routine / Cue
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Brushing teeth, after lunch, evening tea"
          autoFocus
          className={`w-full px-3 py-2 text-xs border rounded-lg outline-none font-sans ${
            isDark
              ? 'bg-[#121214] text-white border-[#1F1F24] focus:border-[#0080FF]'
              : 'bg-white text-[#1C1C1E] border-[#E5E5EA] focus:border-[#0080FF]'
          }`}
        />
      </div>

      {/* Time */}
      <div className="space-y-1">
        <label
          className={`text-[10px] font-mono uppercase font-semibold ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}
        >
          Trigger Time
        </label>
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`w-full px-3 py-2 text-xs font-mono font-semibold border rounded-lg outline-none cursor-pointer ${
              isDark
                ? 'bg-[#121214] text-white border-[#1F1F24] focus:border-[#0080FF]'
                : 'bg-white text-[#1C1C1E] border-[#E5E5EA] focus:border-[#0080FF]'
            }`}
          />
          <span
            className={`text-xs font-sans font-medium shrink-0 ${
              isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
            }`}
          >
            ({formatTimeDisplay(time)})
          </span>
        </div>
      </div>

      {/* Days of week */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            className={`text-[10px] font-mono uppercase font-semibold ${
              isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
            }`}
          >
            Days of Week
          </label>
          <div className="flex gap-1.5 text-[10px] font-sans">
            <button
              type="button"
              onClick={() => setDays(allDays)}
              className={`hover:underline cursor-pointer ${
                days.length === 7
                  ? 'text-[#0080FF] font-bold'
                  : isDark
                    ? 'text-[#98989D]'
                    : 'text-[#6C6C70]'
              }`}
            >
              All
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])}
              className={`hover:underline cursor-pointer ${
                days.length === 5 && !days.includes('Sat')
                  ? 'text-[#0080FF] font-bold'
                  : isDark
                    ? 'text-[#98989D]'
                    : 'text-[#6C6C70]'
              }`}
            >
              Weekdays
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {allDays.map((day) => {
            const selected = days.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDaySelection(day)}
                className={`py-1.5 text-[11px] font-sans font-semibold rounded-md border text-center transition-all cursor-pointer ${
                  selected
                    ? 'bg-[#0080FF] border-[#0080FF] text-white'
                    : isDark
                      ? 'bg-[#121214] border-[#1F1F24] text-[#98989D] hover:text-white'
                      : 'bg-white border-[#E5E5EA] text-[#6C6C70] hover:text-[#1C1C1E]'
                }`}
              >
                {day[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className={`px-3 py-1.5 text-xs font-sans font-medium rounded-lg border cursor-pointer ${
            isDark
              ? 'border-[#1F1F24] text-[#98989D] hover:text-white'
              : 'border-[#E5E5EA] text-[#6C6C70] hover:text-[#1C1C1E]'
          }`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!name.trim()}
          className="px-3.5 py-1.5 bg-[#0080FF] hover:bg-[#0066CC] disabled:opacity-50 text-white text-xs font-sans font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{submitLabel}</span>
        </button>
      </div>
    </div>
  );
}
