'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, RotateCcw } from 'lucide-react';
import { ComparisonMode } from './ComparisonSelector';

interface SectionComparisonSelectorProps {
  value: ComparisonMode | null; // null means using global
  globalValue: ComparisonMode;
  onChange: (mode: ComparisonMode | null) => void;
  compact?: boolean;
}

export default function SectionComparisonSelector({
  value,
  globalValue,
  onChange,
  compact = false,
}: SectionComparisonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options: { id: ComparisonMode; label: string }[] = [
    { id: 'latest', label: 'Previous Day' },
    { id: 'week', label: 'Last Week' },
    { id: 'month', label: 'Last Month' },
    { id: 'year', label: 'Last Year' },
    { id: 'decade', label: '10 Years Ago' },
  ];

  const activeValue = value ?? globalValue;
  const isUsingGlobal = value === null;
  const selectedOption = options.find(opt => opt.id === activeValue) || options[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 ${
          compact
            ? 'px-2.5 py-1.5 text-xs'
            : 'px-3 py-2 text-sm'
        } ${
          isUsingGlobal
            ? 'bg-white/5 border-white/10 text-white/60'
            : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
        } rounded-lg border hover:border-[#D4AF37]/50 transition-all font-medium`}
        title={isUsingGlobal ? 'Using global comparison' : 'Section-specific comparison'}
      >
        <Calendar size={compact ? 12 : 14} />
        <span>{selectedOption.label}</span>
        <ChevronDown
          size={compact ? 10 : 12}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute top-full right-0 mt-2 w-56 bg-[#1A2332] backdrop-blur-xl border border-[#D4AF37]/30 rounded-lg shadow-2xl overflow-hidden z-[70]"
          >
            <div className="p-2">
              {/* Use Global Option */}
              <motion.button
                whileHover={{ x: 2 }}
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all mb-1 ${
                  isUsingGlobal
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <RotateCcw size={14} />
                  <div>
                    <div className="font-semibold text-xs">Use Global</div>
                    <div className="text-[10px] text-white/50">
                      Follow dashboard setting
                    </div>
                  </div>
                </div>
              </motion.button>

              <div className="border-t border-white/10 my-1.5"></div>

              {/* Specific Options */}
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ x: 2 }}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    !isUsingGlobal && value === option.id
                      ? 'bg-[#D4AF37] text-[#1A2332]'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <div className="font-semibold text-xs">{option.label}</div>
                </motion.button>
              ))}
            </div>

            <div className="border-t border-white/10 p-2 bg-[#0F1419]/50">
              <p className="text-white/40 text-[10px]">
                {isUsingGlobal
                  ? 'Currently using global comparison mode'
                  : 'Section-specific override active'}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
