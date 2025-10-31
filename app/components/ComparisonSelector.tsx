'use client';

import { motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export type ComparisonMode =
  | 'latest'
  | 'week'
  | 'month'
  | 'year'
  | 'decade'
  | 'custom';

interface ComparisonSelectorProps {
  value: ComparisonMode;
  onChange: (mode: ComparisonMode) => void;
}

export default function ComparisonSelector({ value, onChange }: ComparisonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options: { id: ComparisonMode; label: string; description: string }[] = [
    { id: 'latest', label: 'Latest', description: 'Compare to previous data point' },
    { id: 'week', label: 'Week Ago', description: 'Same day last week' },
    { id: 'month', label: 'Month Ago', description: 'Same day last month' },
    { id: 'year', label: 'Year Ago', description: 'Same day last year' },
    { id: 'decade', label: 'Decade Ago', description: 'Same day 10 years ago' },
  ];

  const selectedOption = options.find(opt => opt.id === value) || options[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1419]/80 hover:bg-[#0F1419] text-white/90 rounded-xl border border-white/10 hover:border-[#D4AF37]/40 transition-all text-sm font-medium"
      >
        <Calendar size={16} className="text-[#D4AF37]" />
        <span>Compare: {selectedOption.label}</span>
        <ChevronDown
          size={16}
          className={`text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-72 bg-[#1A2332]/98 backdrop-blur-2xl border-2 border-[#D4AF37]/40 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] overflow-hidden z-[9999]"
          >
            <div className="p-2">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    value === option.id
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332]'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className={`text-xs mt-0.5 ${
                    value === option.id ? 'text-[#1A2332]/80' : 'text-white/60'
                  }`}>
                    {option.description}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="border-t border-white/10 p-3 bg-[#0F1419]/50">
              <p className="text-white/50 text-xs">
                Changes will apply to all percentage comparisons across the dashboard
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
