'use client';

import { motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 288, // 288px = w-72
      });
    }
  }, [isOpen]);

  const options: { id: ComparisonMode; label: string; description: string }[] = [
    { id: 'latest', label: 'Latest', description: 'Compare to previous data point' },
    { id: 'week', label: 'Week Ago', description: 'Same day last week' },
    { id: 'month', label: 'Month Ago', description: 'Same day last month' },
    { id: 'year', label: 'Year Ago', description: 'Same day last year' },
    { id: 'decade', label: 'Decade Ago', description: 'Same day 10 years ago' },
  ];

  const selectedOption = options.find(opt => opt.id === value) || options[0];

  const dropdownContent = mounted && isOpen && typeof document !== 'undefined' && createPortal(
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
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        className="w-72 bg-[#1A2332]/98 backdrop-blur-2xl border-2 border-[#D4AF37]/40 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] overflow-hidden z-[9999]"
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
    </>,
    document.body
  );

  return (
    <>
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all text-white"
      >
        <Calendar size={18} className="text-[#D4AF37]" />
        <span className="text-sm font-medium">{selectedOption.label}</span>
        <ChevronDown
          size={16}
          className={`text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>
      {dropdownContent}
    </>
  );
}
