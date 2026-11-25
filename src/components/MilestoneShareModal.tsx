/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Share2, Copy, Check, Flame, Trophy, Link as LinkIcon, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AccomplishedMilestone } from '../types';
import {
  APP_DOWNLOAD_URL,
  buildMilestoneShareText,
  getMilestoneStageConfig
} from '../utils/milestones';

interface MilestoneShareModalProps {
  milestone: AccomplishedMilestone | null;
  isWeekly?: boolean;
  theme?: 'dark' | 'light';
  onClose: () => void;
}

async function copyTextSafely(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export default function MilestoneShareModal({
  milestone,
  isWeekly = false,
  theme = 'light',
  onClose
}: MilestoneShareModalProps) {
  const isDark = theme === 'dark';
  const [postText, setPostText] = useState<string>('');
  const [copiedPost, setCopiedPost] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [nativeStatus, setNativeStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!milestone) return;
    setPostText(buildMilestoneShareText(milestone, isWeekly));
    setCopiedPost(false);
    setCopiedLink(false);
    setNativeStatus(null);
  }, [milestone, isWeekly]);

  useEffect(() => {
    if (!milestone) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [milestone, onClose]);

  if (!milestone) return null;

  const stage = getMilestoneStageConfig(milestone.targetTasks);
  const streakUnit = isWeekly
    ? milestone.streakAtUnlock === 1
      ? 'week'
      : 'weeks'
    : milestone.streakAtUnlock === 1
      ? 'day'
      : 'days';

  const handleCopyPost = async () => {
    const ok = await copyTextSafely(postText);
    if (ok) {
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 2200);
    }
  };

  const handleCopyLink = async () => {
    const ok = await copyTextSafely(APP_DOWNLOAD_URL);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${milestone.stageName} Unlocked — Habits for a Better World`,
          text: postText,
          url: APP_DOWNLOAD_URL
        });
        setNativeStatus('Shared!');
        setTimeout(() => setNativeStatus(null), 2200);
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        // Fall back to copying post + link when browser/iframe blocks navigator.share
      }
    }

    const ok = await copyTextSafely(postText);
    if (ok) {
      setCopiedPost(true);
      setNativeStatus('Post copied to share');
      setTimeout(() => {
        setCopiedPost(false);
        setNativeStatus(null);
      }, 2200);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 14 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`w-full max-w-[346px] max-h-[90%] overflow-y-auto rounded-[24px] border p-4 shadow-2xl relative flex flex-col gap-3.5 ${
            isDark
              ? 'bg-[#121214] border-[#1F1F24] text-white shadow-black/80'
              : 'bg-white border-[#E5E5EA] text-[#1C1C1E] shadow-xl'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="milestone-share-title"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#0080FF]/15 flex items-center justify-center text-[#0080FF] shrink-0">
                <Share2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3
                  id="milestone-share-title"
                  className="text-base font-serif font-bold leading-tight"
                >
                  Share Milestone
                </h3>
                <p className={`text-[11px] font-sans mt-0.5 truncate ${
                  isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  Inspire others &amp; grow the community
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 -mr-1 -mt-1 rounded-full transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? 'text-[#8E8E93] hover:text-white hover:bg-white/10'
                  : 'text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-black/5'
              }`}
              aria-label="Close share sheet"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Shareable Milestone Card Preview */}
          <div
            className={`rounded-[18px] p-3.5 text-white bg-gradient-to-br ${stage.bannerGradient} shadow-sm flex flex-col gap-2.5`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-black/20 px-2.5 py-1 rounded-full">
                <Trophy className="w-3 h-3 shrink-0" />
                <span>{milestone.targetTasks} Growth</span>
              </span>
              {milestone.streakAtUnlock > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-white/20 px-2.5 py-1 rounded-full tabular-nums">
                  <Flame className="w-3 h-3 fill-current shrink-0" />
                  <span>
                    {milestone.streakAtUnlock} {streakUnit} streak
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0">
                {stage.badgeEmoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif font-bold text-base leading-tight truncate">
                  {milestone.stageName}
                </p>
                <p className="text-[11px] font-sans text-white/90 truncate mt-0.5">
                  Habit: {milestone.goalTitle}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] font-mono text-white/90">
              <span>Habits for a Better World</span>
              <span className="truncate ml-2 font-semibold">{APP_DOWNLOAD_URL.replace('https://', '')}</span>
            </div>
          </div>

          {/* Editable Social Post */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="milestone-share-textarea"
                className={`text-[10px] font-sans font-bold uppercase tracking-wider ${
                  isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}
              >
                Social Post Preview
              </label>
              <button
                type="button"
                onClick={() => setPostText(buildMilestoneShareText(milestone, isWeekly))}
                className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-[#0080FF] hover:underline cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset text</span>
              </button>
            </div>
            <textarea
              id="milestone-share-textarea"
              rows={4}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className={`w-full rounded-xl border p-2.5 text-xs font-sans leading-relaxed outline-none resize-none transition-colors ${
                isDark
                  ? 'bg-[#0A0A0C] border-[#1F1F24] text-[#E5E5EA] focus:border-[#0080FF]'
                  : 'bg-[#F5F5F7] border-[#E5E5EA] text-[#1C1C1E] focus:border-[#0080FF]'
              }`}
            />
          </div>

          {/* App Download Link Copy Row */}
          <div
            className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-2 ${
              isDark ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <LinkIcon className="w-3.5 h-3.5 text-[#0080FF] shrink-0" />
              <span className={`text-[11px] font-mono truncate ${
                isDark ? 'text-[#D1D1D6]' : 'text-[#3A3A3C]'
              }`}>
                {APP_DOWNLOAD_URL}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`text-[11px] font-sans font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                copiedLink
                  ? 'bg-[#34C759]/15 border-[#34C759]/40 text-[#34C759]'
                  : isDark
                    ? 'bg-[#121214] border-[#1F1F24] text-[#0080FF] hover:border-[#0080FF]/50'
                    : 'bg-white border-[#E5E5EA] text-[#0080FF] hover:border-[#0080FF]/50'
              }`}
            >
              {copiedLink ? 'Link Copied' : 'Copy Link'}
            </button>
          </div>

          {/* Primary Share Actions */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={handleCopyPost}
              className={`h-[44px] px-3 rounded-xl border text-xs font-sans font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                copiedPost
                  ? 'bg-[#34C759]/15 border-[#34C759]/40 text-[#34C759]'
                  : isDark
                    ? 'border-[#1F1F24] bg-[#18181B] text-white hover:bg-[#222226]'
                    : 'border-[#E5E5EA] bg-[#F5F5F7] text-[#1C1C1E] hover:bg-[#E5E5EA]'
              }`}
            >
              {copiedPost ? (
                <>
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 shrink-0" />
                  <span>Copy Post</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="h-[44px] px-3 rounded-xl bg-[#0080FF] hover:bg-[#0066CC] text-white text-xs font-sans font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs active:scale-[0.98]"
            >
              <Share2 className="w-3.5 h-3.5 shrink-0" />
              <span>{nativeStatus || 'Share Now'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
