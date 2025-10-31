'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import DetailModal from './DetailModal';

interface HeatMapProps {
  data: any[];
  title: string;
}

export default function HeatMap({ data, title }: HeatMapProps) {
  const [selectedSpread, setSelectedSpread] = useState<string | null>(null);
  const spreads = [
    'CZCE - ICE',
    'AWP - ICE',
    'MCX - ICE',
    'CZCE Cotton - PSF',
    'CEPEA-ICE',
    'CZCE - MCX',
    'PSF-PTA',
    'ICE - PSF',
  ];

  const latestData = data[0] || {};
  const previousData = data[1] || {};

  const getChangePercentage = (spread: string) => {
    const current = parseFloat(latestData[spread]) || 0;
    const previous = parseFloat(previousData[spread]) || 0;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getHeatColor = (change: number) => {
    const intensity = Math.min(Math.abs(change) * 10, 100);
    if (change > 0) {
      return `rgba(34, 197, 94, ${intensity / 100})`; // Green
    } else if (change < 0) {
      return `rgba(239, 68, 68, ${intensity / 100})`; // Red
    }
    return 'rgba(100, 116, 139, 0.3)'; // Neutral
  };

  return (
    <div className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none overflow-hidden group">
      <h3 className="text-2xl font-bold text-[#D4AF37] mb-8 relative z-10 flex items-center gap-3">
        <span className="h-1 w-12 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full"></span>
        {title}
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {spreads.map((spread, index) => {
          const change = getChangePercentage(spread);
          const value = parseFloat(latestData[spread]) || 0;

          return (
            <motion.div
              key={spread}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSpread(spread)}
              className="relative overflow-hidden rounded-2xl p-6 cursor-pointer group/card backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300"
              style={{
                backgroundColor: getHeatColor(change),
                border: `2px solid ${change > 0 ? '#22c55e' : change < 0 ? '#ef4444' : '#64748b'}80`,
              }}
            >
              <div className="relative z-10">
                <p className="text-white/90 text-sm font-semibold mb-3 line-clamp-2 leading-tight">
                  {spread}
                </p>
                <p className="text-white text-3xl font-black mb-2">
                  {value.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {change > 0 ? (
                    <TrendingUp size={16} className="text-green-300" />
                  ) : change < 0 ? (
                    <TrendingDown size={16} className="text-red-300" />
                  ) : null}
                  <span
                    className={`text-sm font-bold ${
                      change > 0 ? 'text-green-300' : change < 0 ? 'text-red-300' : 'text-gray-400'
                    }`}
                  >
                    {change > 0 ? '+' : ''}{change.toFixed(2)}%
                  </span>
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
        />
      )}
    </div>
  );
}
