/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Camera, 
  FolderArchive, 
  Eye, 
  Sun, 
  Moon,
  Smartphone,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { REAL_APP_SCREENS, AppScreenDefinition } from '../utils/screenCatalog';
import { downloadElementAsPNG, downloadAllScreenshotsZip } from '../utils/screenshotExport';
import RealScreenRenderer from './RealScreenRenderer';
import HBWLogo from './HBWLogo';

interface ScreenshotGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTheme?: 'dark' | 'light';
}

export default function ScreenshotGalleryModal({
  isOpen,
  onClose,
  defaultTheme = 'light'
}: ScreenshotGalleryModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>(defaultTheme);
  const [frameMode, setFrameMode] = useState<'extended' | 'viewport'>('extended');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<{ current: number; total: number } | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'.png' | '.pgn'>('.png');
  const [inspectedScreenshot, setInspectedScreenshot] = useState<AppScreenDefinition | null>(null);

  // References to actual phone viewport elements for full-fidelity rasterization
  const screenRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const categories = ['all', 'Auth', 'Assessment', 'Recommendations', 'Daily Routine', 'Gamification', 'Habit Catalog', 'Behavioral Science', 'Social Support', 'Profile & Export', 'Wearables'];

  const filteredScreens = activeCategory === 'all'
    ? REAL_APP_SCREENS
    : REAL_APP_SCREENS.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase());

  const handleDownloadSingle = async (screen: AppScreenDefinition) => {
    const el = screenRefs.current[screen.id];
    if (!el) return;

    try {
      setDownloadingId(screen.id);
      const ext = selectedFormat;
      const targetFileName = screen.fileName.replace('.png', ext);
      await downloadElementAsPNG(el, targetFileName);
    } catch (err) {
      console.error('Failed to download screenshot PNG:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    setZipProgress({ current: 0, total: REAL_APP_SCREENS.length });

    try {
      const itemsToZip = REAL_APP_SCREENS.map(s => ({
        id: s.id,
        fileName: s.fileName.replace('.png', selectedFormat),
        element: screenRefs.current[s.id]!
      })).filter(item => Boolean(item.element));

      await downloadAllScreenshotsZip(itemsToZip, (current, total) => {
        setZipProgress({ current, total });
      });
    } catch (err) {
      console.error('Error generating screenshot zip:', err);
    } finally {
      setIsZipping(false);
      setZipProgress(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-7xl h-[94vh] bg-[#000814] border border-[#002246] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white font-sans"
        >
          {/* Header Bar */}
          <div className="px-5 sm:px-8 py-4 border-b border-[#002246] bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#002246] border border-[#00488A]/60 flex items-center justify-center text-[#0285FF] shadow-inner">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">
                    Real App Screenshots & Download Center
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#0080FF]/15 text-[#0080FF] border border-[#0080FF]/30">
                    {REAL_APP_SCREENS.length} Real App Screens
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans">
                  Capture authentic, full-fidelity screenshots rendered directly from the live application components.
                </p>
              </div>
            </div>

            {/* Global Controls */}
            <div className="flex items-center gap-2.5 flex-wrap self-end sm:self-center">
              {/* Phone Frame Mode Toggle (Extended Full Screen vs Fixed Viewport) */}
              <div className="flex items-center bg-[#001428] p-1 rounded-xl border border-[#002B54] text-xs">
                <button
                  type="button"
                  onClick={() => setFrameMode('extended')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-sans font-semibold transition-all cursor-pointer ${
                    frameMode === 'extended' ? 'bg-[#0285FF] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Extend phone frame to show entire screen in exported PNG"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Extended Frame</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFrameMode('viewport')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-sans font-semibold transition-all cursor-pointer ${
                    frameMode === 'viewport' ? 'bg-[#0285FF] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Standard fixed 640px phone viewport"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Fixed (640px)</span>
                </button>
              </div>

              {/* Format selection */}
              <div className="flex items-center bg-[#001428] p-1 rounded-xl border border-[#002B54] text-xs">
                <button
                  onClick={() => setSelectedFormat('.png')}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                    selectedFormat === '.png' ? 'bg-[#0285FF] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  .png
                </button>
                <button
                  onClick={() => setSelectedFormat('.pgn')}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                    selectedFormat === '.pgn' ? 'bg-[#0285FF] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Save with .pgn extension as requested"
                >
                  .pgn
                </button>
              </div>

              {/* Theme Toggle for Screenshots */}
              <button
                onClick={() => setPreviewTheme(t => t === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001428] border border-[#002B54] hover:bg-[#002246] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                {previewTheme === 'dark' ? <Moon className="w-3.5 h-3.5 text-[#0080FF]" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                <span>{previewTheme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
              </button>

              {/* Download All as ZIP */}
              <button
                onClick={handleDownloadAllZip}
                disabled={isZipping}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#0080FF] hover:bg-[#0066CC] active:scale-95 text-white font-sans text-xs font-bold transition-all shadow-md cursor-pointer disabled:bg-slate-800 disabled:text-slate-500"
              >
                <FolderArchive className="w-4 h-4" />
                {isZipping 
                  ? `Archiving (${zipProgress?.current}/${zipProgress?.total})...`
                  : `Download All ${REAL_APP_SCREENS.length} Screens (${selectedFormat})`
                }
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="px-6 py-2.5 border-b border-[#002246]/60 bg-[#000a18] flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold shrink-0 mr-1">
              Screen Filter:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0285FF] text-white font-semibold shadow-xs'
                    : 'bg-[#001830] text-slate-300 hover:bg-[#00254A] border border-[#002F5C]/40'
                }`}
              >
                {cat === 'all' ? `All Screens (${REAL_APP_SCREENS.length})` : cat}
              </button>
            ))}
          </div>

          {/* Main Scrollable Grid with Real App Component Renderers */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#000b1d] space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredScreens.map((screen, idx) => (
                <motion.div
                  key={screen.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex flex-col bg-[#001026] border border-[#002B54] rounded-2xl p-4 shadow-xl hover:border-[#0285FF]/50 transition-all group"
                >
                  {/* Card Header & Controls */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#0080FF]/15 text-[#0080FF] border border-[#0080FF]/30">
                          {screen.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          #{idx + 1}
                        </span>
                        <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {frameMode === 'extended' ? 'Extended Full Screen' : 'Fixed 640px'}
                        </span>
                      </div>
                      <h3 className="text-sm font-serif font-bold text-white group-hover:text-[#0285FF] transition-colors">
                        {screen.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {screen.subtitle}
                      </p>
                    </div>

                    {/* Single Download Button */}
                    <button
                      onClick={() => handleDownloadSingle(screen)}
                      disabled={downloadingId === screen.id}
                      className="p-2 bg-[#002246] hover:bg-[#0285FF] text-white rounded-xl transition-all shadow-md shrink-0 active:scale-95 cursor-pointer disabled:bg-slate-800"
                      title={`Download ${screen.fileName.replace('.png', selectedFormat)}`}
                    >
                      {downloadingId === screen.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Authentic Smartphone Viewport Frame (Captured by html-to-image) */}
                  <div className="relative w-full rounded-2xl border border-[#002B54]/70 bg-black/80 flex justify-center p-3 shadow-inner max-h-[740px] overflow-y-auto custom-scrollbar">
                    {/* The exact phone viewport targeted by ref for crisp 2x export */}
                    <div
                      ref={el => { screenRefs.current[screen.id] = el; }}
                      className={`w-[360px] sm:w-[375px] rounded-[44px] p-3.5 flex flex-col border-[3px] transition-colors duration-200 shadow-2xl relative select-none shrink-0 ${
                        frameMode === 'extended' ? 'min-h-[640px] h-auto overflow-visible' : 'h-[640px] overflow-hidden'
                      } ${
                        previewTheme === 'dark'
                          ? 'bg-[#0A0A0C] border-[#2C2C2E] text-[#F5F5F7]'
                          : 'bg-[#F5F5F7] border-[#D1D1D6] text-[#1C1C1E]'
                      }`}
                    >
                      {/* Realistic Status Bar & Dynamic Island */}
                      <div className="w-full flex justify-between items-center px-3 pt-1 pb-3 text-[10px] font-mono font-semibold text-slate-400 shrink-0">
                        <span className="font-bold">9:41</span>
                        <div className="w-24 h-5 bg-black rounded-full border border-neutral-800 flex items-center justify-between px-2.5 shadow-inner">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-700 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-[#0080FF]/80" />
                          </div>
                          <div className="w-2 h-2 rounded-full bg-[#0080FF] animate-pulse" />
                        </div>
                        <span className="flex items-center gap-1">
                          <span>5G</span>
                          <span className="font-bold">100%</span>
                        </span>
                      </div>

                      {/* Real Live Component Render - Extended Full Screen or Scrollable Viewport */}
                      <div className={`w-full px-1 py-1 ${
                        frameMode === 'extended' ? 'h-auto overflow-visible flex flex-col' : 'flex-1 overflow-y-auto scrollbar-none'
                      }`}>
                        <RealScreenRenderer
                          screenId={screen.id}
                          theme={previewTheme}
                        />
                      </div>

                      {/* Home Indicator Bar at bottom of phone */}
                      <div className="w-full pt-4 pb-1.5 flex items-center justify-center shrink-0">
                        <div className="w-32 h-1 bg-slate-500/40 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-3 pt-2 border-t border-[#002246]/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate pr-2 font-mono text-[10px]">
                      {screen.fileName.replace('.png', selectedFormat)}
                    </span>
                    <button
                      onClick={() => setInspectedScreenshot(screen)}
                      className="text-[#0285FF] hover:underline font-semibold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="px-6 py-3 border-t border-[#002246] bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <HBWLogo size="sm" theme="dark" />
              <span>Screenshots are generated from live application React views in Retina resolution.</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              Format: {selectedFormat.toUpperCase()} · High-DPI Output
            </div>
          </div>
        </motion.div>

        {/* Detailed Inspector Modal */}
        {inspectedScreenshot && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
            <div className="bg-[#000814] border border-[#002B54] rounded-3xl p-6 max-w-lg w-full flex flex-col gap-4 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#0285FF] font-bold">
                    {inspectedScreenshot.category}
                  </span>
                  <h3 className="text-lg font-serif font-bold">{inspectedScreenshot.title}</h3>
                  <p className="text-xs text-slate-400">{inspectedScreenshot.subtitle}</p>
                </div>
                <button
                  onClick={() => setInspectedScreenshot(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-[#001026] rounded-2xl border border-[#002B54] text-xs text-slate-300 space-y-2">
                <p className="leading-relaxed">{inspectedScreenshot.description}</p>
                <div className="font-mono text-[11px] text-[#0285FF]">
                  Target Export File: {inspectedScreenshot.fileName.replace('.png', selectedFormat)}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    handleDownloadSingle(inspectedScreenshot);
                    setInspectedScreenshot(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0285FF] hover:bg-[#0066CC] text-white font-sans text-xs font-bold rounded-xl transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Screenshot ({selectedFormat})
                </button>
                <button
                  onClick={() => setInspectedScreenshot(null)}
                  className="px-4 py-2 bg-[#001830] hover:bg-[#002850] text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
