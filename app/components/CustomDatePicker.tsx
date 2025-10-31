'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { DateRangePicker, Range, RangeKeyDict } from 'react-date-range';
import { format, subDays, subMonths, startOfYear, endOfDay } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface CustomDatePickerProps {
  onRangeChange: (startDate: Date, endDate: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export default function CustomDatePicker({
  onRangeChange,
  minDate = new Date('2005-01-01'),
  maxDate = new Date(),
}: CustomDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: subMonths(maxDate, 1),
      endDate: maxDate,
      key: 'selection',
    },
  ]);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Quick presets
  const presets = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
    { label: 'Last Quarter', days: 90 },
    { label: 'Last 6 Months', days: 180 },
    { label: 'Year to Date', days: null, custom: 'ytd' },
    { label: 'Last Year', days: 365 },
    { label: 'All Time', days: null, custom: 'all' },
  ];

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (ranges: RangeKeyDict) => {
    const selection = ranges.selection as Range;
    setDateRange([selection]);
  };

  const applyRange = () => {
    if (dateRange[0].startDate && dateRange[0].endDate) {
      onRangeChange(dateRange[0].startDate, dateRange[0].endDate);
      setShowPicker(false);
    }
  };

  const applyPreset = (preset: typeof presets[0]) => {
    let start: Date;
    let end: Date = endOfDay(maxDate);

    if (preset.custom === 'ytd') {
      start = startOfYear(maxDate);
    } else if (preset.custom === 'all') {
      start = minDate;
    } else if (preset.days) {
      start = subDays(maxDate, preset.days);
    } else {
      return;
    }

    setDateRange([{ startDate: start, endDate: end, key: 'selection' }]);
    onRangeChange(start, end);
    setShowPicker(false);
  };

  const formatDisplayRange = () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) return 'Select Range';
    const start = format(dateRange[0].startDate, 'MMM d, yyyy');
    const end = format(dateRange[0].endDate, 'MMM d, yyyy');
    return `${start} - ${end}`;
  };

  const hasCustomRange = dateRange[0].startDate && dateRange[0].endDate &&
    (dateRange[0].startDate.getTime() !== subMonths(maxDate, 1).getTime() ||
     dateRange[0].endDate.getTime() !== maxDate.getTime());

  return (
    <div className="relative" ref={pickerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="px-4 py-2.5 bg-[#0F1419] border border-white/10 rounded-xl text-white text-sm font-semibold hover:bg-white/5 hover:border-[#D4AF37]/40 transition-all flex items-center gap-2"
      >
        <Calendar size={16} className="text-[#D4AF37]" />
        <div className="flex flex-col items-start">
          <span className="hidden md:inline">Custom Range</span>
          <span className="md:hidden">Range</span>
          {hasCustomRange && (
            <span className="text-[10px] text-[#D4AF37] font-normal mt-0.5 whitespace-nowrap">
              {formatDisplayRange()}
            </span>
          )}
        </div>
      </button>

      {/* Picker Modal */}
      {showPicker && (
        <div className="absolute top-full right-0 mt-2 z-50 bg-[#1A2332]/95 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-white font-bold text-lg">Select Date Range</h3>
            <button
              onClick={() => setShowPicker(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} className="text-white/70" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Quick Presets */}
            <div className="p-4 border-r border-white/10 bg-[#0F1419]/50">
              <h4 className="text-white/70 text-xs font-semibold uppercase mb-3">Quick Select</h4>
              <div className="flex flex-col gap-1 min-w-[140px]">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-2 text-left text-white/80 text-sm hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] rounded-lg transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="p-4">
              <DateRangePicker
                ranges={dateRange}
                onChange={handleSelect}
                minDate={minDate}
                maxDate={maxDate}
                months={2}
                direction="horizontal"
                showDateDisplay={false}
                rangeColors={['#D4AF37']}
                color="#D4AF37"
              />

              {/* Selected Range Info */}
              <div className="mt-4 p-3 bg-[#0F1419]/50 rounded-lg border border-white/10">
                <p className="text-white/60 text-xs mb-1">Selected Range:</p>
                <p className="text-white font-semibold">{formatDisplayRange()}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowPicker(false)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white/70 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyRange}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332] font-bold rounded-lg hover:from-[#F4C430] hover:to-[#D4AF37] transition-all"
                >
                  Apply Range
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles for react-date-range */}
      <style jsx global>{`
        .rdrCalendarWrapper {
          background: transparent !important;
          color: white !important;
        }

        .rdrMonth {
          width: 300px !important;
        }

        .rdrMonthAndYearWrapper {
          background: rgba(15, 20, 25, 0.5) !important;
          padding: 10px !important;
          border-radius: 8px !important;
        }

        .rdrMonthPicker select,
        .rdrYearPicker select {
          background: rgba(26, 35, 50, 0.8) !important;
          color: white !important;
          border: 1px solid rgba(212, 175, 55, 0.3) !important;
          padding: 5px !important;
          border-radius: 6px !important;
        }

        .rdrDayNumber span {
          color: white !important;
        }

        .rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span,
        .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span,
        .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span {
          color: #1A2332 !important;
        }

        .rdrDayToday .rdrDayNumber span:after {
          background: #D4AF37 !important;
        }

        .rdrDayPassive .rdrDayNumber span {
          color: rgba(255, 255, 255, 0.3) !important;
        }

        .rdrDayDisabled {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }

        .rdrMonthAndYearPickers select:hover {
          background: rgba(212, 175, 55, 0.2) !important;
        }

        .rdrNextPrevButton {
          background: rgba(26, 35, 50, 0.8) !important;
          border-radius: 6px !important;
        }

        .rdrNextPrevButton:hover {
          background: rgba(212, 175, 55, 0.3) !important;
        }

        .rdrPprevButton i,
        .rdrNextButton i {
          border-color: transparent white transparent transparent !important;
        }

        .rdrWeekDay {
          color: rgba(212, 175, 55, 0.8) !important;
          font-weight: 600 !important;
        }
      `}</style>
    </div>
  );
}
