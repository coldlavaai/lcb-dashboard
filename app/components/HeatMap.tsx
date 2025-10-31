'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import DetailModal from './DetailModal';
import { ComparisonMode } from './ComparisonSelector';
import SectionComparisonSelector from './SectionComparisonSelector';
import { getComparisonDataPoint, calculatePercentageChange, calculatePointChange } from '../utils/comparisonUtils';
import theme from '@/lib/theme';

interface HeatMapProps {
  data: any[];
  title: string;
  comparisonMode?: ComparisonMode;
  onComparisonChange?: (mode: ComparisonMode | null) => void;
  sectionComparisonMode?: ComparisonMode | null;
}

export default function HeatMap({
  data,
  title,
  comparisonMode = 'latest',
  onComparisonChange,
  sectionComparisonMode = null,
}: HeatMapProps) {
  const [selectedSpread, setSelectedSpread] = useState<string | null>(null);

  // Use section-specific mode if set, otherwise use global
  const activeComparisonMode = sectionComparisonMode ?? comparisonMode;

  // Check if MCX data is available in latest record
  const latestData = data[0] || {};
  const hasMCXData = latestData['MCX'] != null && latestData['MCX usc/lb'] != null;

  // Only show spreads where we have valid data
  const allSpreads = [
    'CZCE - ICE',
    'AWP - ICE',
    ...(hasMCXData ? ['MCX - ICE', 'CZCE - MCX'] : []), // Only show if MCX data exists
    'CZCE Cotton - PSF',
    'CEPEA-ICE',
    'PSF-PTA',
    'ICE - PSF',
  ];

  const spreads = allSpreads;

  const getChangeValue = (spread: string) => {
    const current = parseFloat(latestData[spread]) || 0;
    const { compareIndex } = getComparisonDataPoint(data, 0, activeComparisonMode);

    if (compareIndex === -1 || !data[compareIndex]) return 0;

    const previous = parseFloat(data[compareIndex][spread]) || 0;
    // Spreads use point change instead of percentage (more meaningful)
    return calculatePointChange(current, previous);
  };

  const getHeatColor = (change: number) => {
    const intensity = Math.min(Math.abs(change) * 10, 100);
    if (change > 0) {
      return `rgba(16, 185, 129, ${intensity / 100})`; // theme.colors.data.profit
    } else if (change < 0) {
      return `rgba(239, 68, 68, ${intensity / 100})`; // theme.colors.data.loss
    }
    return theme.colors.background.tertiary; // Neutral
  };

  return (
    <div className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none overflow-hidden group">
      <div className="flex items-center justify-between mb-10 relative z-10">
        <h3 className="text-2xl font-bold text-[#D4AF37] flex items-center gap-3">
          <span className="h-1 w-12 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full"></span>
          {title}
        </h3>
        {onComparisonChange && (
          <SectionComparisonSelector
            value={sectionComparisonMode}
            globalValue={comparisonMode}
            onChange={onComparisonChange}
            compact
          />
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 md:gap-6 relative z-10 mobile-card-grid">
        {spreads.map((spread, index) => {
          const change = getChangeValue(spread);
          const value = parseFloat(latestData[spread]) || 0;

          return (
            <motion.div
              key={spread}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSpread(spread)}
              className="relative overflow-hidden rounded-2xl p-4 md:p-8 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[140px] md:min-h-[180px] flex flex-col justify-between cursor-pointer"
              style={{
                backgroundColor: getHeatColor(change),
                border: `2px solid ${change > 0 ? theme.colors.data.profit : change < 0 ? theme.colors.data.loss : theme.colors.data.neutral}80`,
              }}
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="mb-4">
                  <p className="text-white/95 text-base font-bold line-clamp-2 leading-snug tracking-wide">
                    {spread}
                  </p>
                </div>
                <div>
                  <p className="text-white text-2xl md:text-4xl font-black mb-2 md:mb-3 font-tabular tracking-tight">
                    {value.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    {change > 0 ? (
                      <TrendingUp size={18} style={{ color: theme.colors.data.profitLight }} />
                    ) : change < 0 ? (
                      <TrendingDown size={18} style={{ color: theme.colors.data.lossLight }} />
                    ) : null}
                    <span
                      className="text-base font-bold font-tabular"
                      style={{
                        color: change > 0 ? theme.colors.data.profitLight : change < 0 ? theme.colors.data.lossLight : theme.colors.data.neutral
                      }}
                    >
                      {change > 0 ? '+' : ''}{change.toFixed(2)} pts
                    </span>
                  </div>
                </div>
              </div>
              {/* Shimmer hover effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
                initial={{ x: '-100%', y: '-100%' }}
                whileHover={{ x: '100%', y: '100%' }}
                transition={{ duration: 0.6 }}
              />
              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/10 to-transparent blur-xl"></div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedSpread && (
        <DetailModal
          isOpen={!!selectedSpread}
          onClose={() => setSelectedSpread(null)}
          title={selectedSpread}
          dataKey={selectedSpread}
          data={data}
          description={`Detailed analysis of ${selectedSpread} spread over time`}
          color={
            selectedSpread === 'CZCE - ICE' ? '#D4AF37' :
            selectedSpread === 'AWP - ICE' ? '#F4C430' :
            selectedSpread === 'MCX - ICE' ? '#2C7A7B' :
            selectedSpread === 'CZCE Cotton - PSF' ? '#E07A5F' :
            '#4F46E5'
          }
          comparisonMode={activeComparisonMode}
        />
      )}
    </div>
  );
}
