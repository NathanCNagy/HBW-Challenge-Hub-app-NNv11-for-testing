/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, WeeklyTimelineState } from '../../types';
import storage from '../../services/storage';
import {
  TOTAL_PLAN_DAYS,
  TOTAL_PLAN_WEEKS,
  getDefaultTwistOrder,
  getTwistById,
  getWeekDaySpan
} from '../../data/noveltyTwists';

interface WeeklyNoveltyTimelineProps {
  goalId: string;
  category: Category;
  goalTitle?: string;
  isWeekly?: boolean;
  theme: 'dark' | 'light';
}

function getStorageKey(goalId: string, category: Category): string {
  return `hbw_focus_timeline_${goalId}_${category.toLowerCase().replace(/\s+/g, '-')}`;
}

function loadOrInitTimelineState(goalId: string, category: Category): WeeklyTimelineState {
  const defaultOrder = getDefaultTwistOrder(category);
  const key = getStorageKey(goalId, category);
  const saved = storage.getString(key);

  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Partial<WeeklyTimelineState>;
      const validIds =
        Array.isArray(parsed.orderedTwistIds) &&
        parsed.orderedTwistIds.length === defaultOrder.length &&
        defaultOrder.every((id) => parsed.orderedTwistIds!.includes(id))
          ? parsed.orderedTwistIds
          : defaultOrder;

      return {
        startDateIso:
          typeof parsed.startDateIso === 'string' && !Number.isNaN(Date.parse(parsed.startDateIso))
            ? parsed.startDateIso
            : new Date().toISOString(),
        manualWeekOverride: null,
        orderedTwistIds: validIds
      };
    } catch {
      // Fall back to fresh initialization below
    }
  }

  const fresh: WeeklyTimelineState = {
    startDateIso: new Date().toISOString(),
    manualWeekOverride: null,
    orderedTwistIds: defaultOrder
  };
  storage.set(key, fresh);
  return fresh;
}

export default function WeeklyNoveltyTimeline({
  goalId,
  category,
  isWeekly = false,
  theme
}: WeeklyNoveltyTimelineProps) {
  const isDark = theme === 'dark';
  const [timelineState, setTimelineState] = useState<WeeklyTimelineState>(() =>
    loadOrInitTimelineState(goalId, category)
  );
  const [swapFeedback, setSwapFeedback] = useState<string | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setTimelineState(loadOrInitTimelineState(goalId, category));
    setSwapFeedback(null);
  }, [goalId, category]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const persistState = (next: WeeklyTimelineState) => {
    setTimelineState(next);
    storage.set(getStorageKey(goalId, category), next);
  };

  const showFeedback = (message: string) => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    setSwapFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => {
      setSwapFeedback(null);
    }, 2400);
  };

  // Compute current week & day from plan start date
  const elapsedMs = Math.max(0, Date.now() - Date.parse(timelineState.startDateIso));
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const activeWeek = Math.min(TOTAL_PLAN_WEEKS, Math.max(1, Math.floor(elapsedDays / 7) + 1));
  const activeDay = Math.min(TOTAL_PLAN_DAYS, elapsedDays + 1);

  // Rolling window: Current week + next 2 weeks only
  const visibleWeeks = [activeWeek, activeWeek + 1, activeWeek + 2].filter(
    (w) => w <= TOTAL_PLAN_WEEKS
  );

  const defaultOrder = getDefaultTwistOrder(category);
  const isCustomOrder = timelineState.orderedTwistIds.some((id, idx) => id !== defaultOrder[idx]);

  const handleMoveTwist = (weekNum: number, direction: 'up' | 'down') => {
    const currentIndex = weekNum - 1;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= TOTAL_PLAN_WEEKS) return;

    const nextOrder = [...timelineState.orderedTwistIds];
    const movedTwistId = nextOrder[currentIndex];
    nextOrder[currentIndex] = nextOrder[targetIndex];
    nextOrder[targetIndex] = movedTwistId;

    persistState({
      ...timelineState,
      orderedTwistIds: nextOrder
    });

    const movedTwist = getTwistById(category, movedTwistId);
    showFeedback(`Moved "${movedTwist.title}" to Week ${targetIndex + 1}`);
  };

  const handleResetOrder = () => {
    persistState({
      ...timelineState,
      orderedTwistIds: defaultOrder
    });
    showFeedback('Restored default order');
  };

  return (
    <section
      aria-label="90-Day Weekly Timeline"
      className={`p-4 border rounded-[16px] shadow-xs flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}
    >
      {/* Minimalist Header */}
      <div
        className={`flex items-baseline justify-between gap-2 pb-3 border-b ${
          isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
        }`}
      >
        <h2 className="text-base font-serif font-normal leading-tight truncate">
          90-Day Timeline
        </h2>
        <span
          className={`text-[11px] font-mono tabular-nums shrink-0 ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}
        >
          Week {activeWeek}/{TOTAL_PLAN_WEEKS} · Day {activeDay}/{TOTAL_PLAN_DAYS}
        </span>
      </div>

      {/* Minimalist Week Rows (Current Week + Next 2 Weeks) */}
      <div className="flex flex-col">
        {visibleWeeks.map((weekNum, idx) => {
          const twistId = timelineState.orderedTwistIds[weekNum - 1];
          const twist = getTwistById(category, twistId);
          const isCurrent = weekNum === activeWeek;
          const isFirstWeek = weekNum === 1;
          const isLastWeek = weekNum === TOTAL_PLAN_WEEKS;

          return (
            <motion.div
              layout="position"
              key={`${weekNum}-${twist.id}`}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className={`flex items-center justify-between gap-3 transition-colors ${
                isCurrent
                  ? isDark
                    ? 'bg-[#0080FF]/[0.10] -mx-2 px-2.5 py-3 mt-2 mb-1 rounded-[12px]'
                    : 'bg-[#0080FF]/[0.06] -mx-2 px-2.5 py-3 mt-2 mb-1 rounded-[12px]'
                  : `py-3 last:pb-1 ${
                      idx > 1
                        ? isDark
                          ? 'border-t border-[#1F1F24]'
                          : 'border-t border-[#E5E5EA]'
                        : ''
                    }`
              }`}
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono tabular-nums uppercase tracking-wider">
                  <span
                    className={
                      isCurrent
                        ? 'font-bold text-[#0080FF]'
                        : isDark
                          ? 'text-[#8E8E93]'
                          : 'text-[#6C6C70]'
                    }
                  >
                    {isCurrent
                      ? isWeekly
                        ? `This Week · W${weekNum}`
                        : `Current · W${weekNum}`
                      : `Week ${weekNum}`}
                  </span>
                  <span aria-hidden="true" className={isDark ? 'text-[#52525B]' : 'text-[#AEAEB2]'}>
                    ·
                  </span>
                  <span className={isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}>
                    {getWeekDaySpan(weekNum)}
                  </span>
                </div>

                <h3
                  className={`text-xs font-sans font-semibold leading-snug ${
                    isDark ? 'text-white' : 'text-[#1C1C1E]'
                  }`}
                >
                  {twist.title}
                </h3>

                <p
                  className={`text-xs font-sans leading-relaxed ${
                    isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                  }`}
                >
                  {twist.twistPrompt}
                </p>
              </div>

              {/* Minimal Up / Down Reorder Controls */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMoveTwist(weekNum, 'up')}
                  disabled={isFirstWeek}
                  aria-label={`Move ${twist.title} to Week ${weekNum - 1}`}
                  title={isFirstWeek ? 'Already Week 1' : `Move to Week ${weekNum - 1}`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isFirstWeek
                      ? 'opacity-25 cursor-not-allowed'
                      : isDark
                        ? 'text-[#8E8E93] hover:text-[#0080FF] hover:bg-white/5 cursor-pointer'
                        : 'text-[#6C6C70] hover:text-[#0080FF] hover:bg-black/5 cursor-pointer'
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveTwist(weekNum, 'down')}
                  disabled={isLastWeek}
                  aria-label={`Move ${twist.title} to Week ${weekNum + 1}`}
                  title={isLastWeek ? 'Already Week 13' : `Move to Week ${weekNum + 1}`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isLastWeek
                      ? 'opacity-25 cursor-not-allowed'
                      : isDark
                        ? 'text-[#8E8E93] hover:text-[#0080FF] hover:bg-white/5 cursor-pointer'
                        : 'text-[#6C6C70] hover:text-[#0080FF] hover:bg-black/5 cursor-pointer'
                  }`}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Minimal Footer (shown only when feedback or custom order exists) */}
      {(swapFeedback || isCustomOrder) && (
        <div
          className={`mt-2 pt-2.5 border-t flex items-center justify-between gap-2 text-[11px] font-sans ${
            isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
          }`}
        >
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              {swapFeedback && (
                <motion.span
                  key={swapFeedback}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[#34C759] font-medium block truncate"
                >
                  {swapFeedback}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {isCustomOrder && (
            <button
              type="button"
              onClick={handleResetOrder}
              className="inline-flex items-center gap-1 font-medium text-[#0080FF] hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset order</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
