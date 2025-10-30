'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface HeatMapProps {
  data: any[];
  title: string;
}

export default function HeatMap({ data, title }: HeatMapProps) {
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
    <div className="bg-gradient-to-br from-[#1A2332]/90 via-[#1A2332]/80 to-[#2C3E50]/90 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold text-[#D4AF37] mb-6">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {spreads.map((spread, index) => {
          const change = getChangePercentage(spread);
          const value = parseFloat(latestData[spread]) || 0;

          return (
            <motion.div
              key={spread}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative overflow-hidden rounded-lg p-4 cursor-pointer group"
              style={{
                backgroundColor: getHeatColor(change),
                border: `1px solid ${change > 0 ? '#22c55e' : change < 0 ? '#ef4444' : '#64748b'}40`,
              }}
            >
              <div className="relative z-10">
                <p className="text-white/80 text-xs font-medium mb-1 line-clamp-1">
                  {spread}
                </p>
                <p className="text-white text-lg font-bold">
                  {value.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {change > 0 ? (
                    <TrendingUp size={12} className="text-green-300" />
                  ) : change < 0 ? (
                    <TrendingDown size={12} className="text-red-300" />
                  ) : null}
                  <span
                    className={`text-xs font-semibold ${
                      change > 0 ? 'text-green-300' : change < 0 ? 'text-red-300' : 'text-gray-400'
                    }`}
                  >
                    {change > 0 ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </div>
              </div>
              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 bg-white/5"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
