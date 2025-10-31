'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, Download, Bell, Settings as SettingsIcon, TrendingUp } from 'lucide-react';

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

interface MobileMenuProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  useCustomRange: boolean;
  onResetCustomRange: () => void;
  comparisonMode: string;
  onComparisonChange: (mode: any) => void;
  onExportPDF: () => void;
  onShowSettings: () => void;
  onShowDatePicker: () => void;
}

export default function MobileMenu({
  timeRange,
  onTimeRangeChange,
  useCustomRange,
  onResetCustomRange,
  comparisonMode,
  onComparisonChange,
  onExportPDF,
  onShowSettings,
  onShowDatePicker,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const timeRanges: TimeRange[] = ['7d', '30d', '90d', '1y', 'all'];

  const comparisonModes = [
    { id: 'latest', label: 'Latest', icon: '📊' },
    { id: 'previous-day', label: 'vs Previous Day', icon: '📅' },
    { id: 'week-ago', label: 'vs Week Ago', icon: '📈' },
    { id: 'month-ago', label: 'vs Month Ago', icon: '📉' },
  ];

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2.5 bg-[#0F1419]/80 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X size={20} className="text-white" />
        ) : (
          <Menu size={20} className="text-white" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000]"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-gradient-to-br from-[#1A2332] via-[#2C3E50] to-[#1A2332] border-l-2 border-[#D4AF37]/30 z-[10001] overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="sticky top-0 bg-[#1A2332]/95 backdrop-blur-sm border-b border-white/10 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Controls</h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-white/70" />
                  </button>
                </div>
              </div>

              {/* Menu Content */}
              <div className="p-5 space-y-6">
                {/* Time Range Section */}
                <div>
                  <label className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3 block">
                    Time Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          onTimeRangeChange(range);
                          onResetCustomRange();
                        }}
                        className={`py-3 px-4 rounded-xl text-sm font-bold uppercase transition-all ${
                          timeRange === range && !useCustomRange
                            ? 'bg-[#2C7A7B] text-white shadow-lg shadow-[#2C7A7B]/40'
                            : 'bg-[#0F1419]/80 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      onShowDatePicker();
                      handleClose();
                    }}
                    className={`w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      useCustomRange
                        ? 'bg-[#2C7A7B] text-white shadow-lg'
                        : 'bg-[#0F1419]/80 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <Calendar size={16} />
                    Custom Range
                  </button>
                </div>

                {/* Comparison Mode Section */}
                <div>
                  <label className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3 block">
                    Comparison Mode
                  </label>
                  <div className="space-y-2">
                    {comparisonModes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => {
                          onComparisonChange(mode.id);
                        }}
                        className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                          comparisonMode === mode.id
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332] shadow-lg'
                            : 'bg-[#0F1419]/80 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <span className="text-lg">{mode.icon}</span>
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions Section */}
                <div>
                  <label className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3 block">
                    Actions
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onExportPDF();
                        handleClose();
                      }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#2C7A7B] to-[#3B9B9B] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Download size={16} />
                      Export PDF
                    </button>

                    <button
                      onClick={handleClose}
                      className="w-full py-3 px-4 bg-[#0F1419]/80 text-white/70 hover:text-white hover:bg-white/10 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border border-white/10"
                    >
                      <Bell size={16} />
                      Notifications
                    </button>

                    <button
                      onClick={() => {
                        onShowSettings();
                        handleClose();
                      }}
                      className="w-full py-3 px-4 bg-[#0F1419]/80 text-white/70 hover:text-white hover:bg-white/10 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border border-white/10"
                    >
                      <SettingsIcon size={16} />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
