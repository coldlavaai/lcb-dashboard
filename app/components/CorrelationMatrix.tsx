'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import theme from '@/lib/theme';

interface CorrelationMatrixProps {
  data: any[];
}

export default function CorrelationMatrix({ data }: CorrelationMatrixProps) {
  const markets = ['ICE', 'CZCE cotton usc/lb', 'MCX usc/lb', 'AWP', 'CEPEA', 'A-Index'];
  const marketLabels = ['ICE', 'CZCE', 'MCX', 'AWP', 'CEPEA', 'A-Index'];

  const correlationData = useMemo(() => {
    // Calculate correlation coefficients between markets
    const calculateCorrelation = (field1: string, field2: string) => {
      const validData = data.filter(
        (d) => d[field1] != null && d[field2] != null && !isNaN(d[field1]) && !isNaN(d[field2])
      );

      if (validData.length < 2) return 0;

      const x = validData.map((d) => parseFloat(d[field1]));
      const y = validData.map((d) => parseFloat(d[field2]));

      const n = x.length;
      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
      const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
      const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

      return denominator === 0 ? 0 : numerator / denominator;
    };

    const matrix: number[][] = [];
    for (let i = 0; i < markets.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < markets.length; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          matrix[i][j] = calculateCorrelation(markets[i], markets[j]);
        }
      }
    }
    return matrix;
  }, [data, markets]);

  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value);
    if (value > 0.7) {
      return theme.colors.data.profit; // Strong positive
    } else if (value > 0.3) {
      return `rgba(16, 185, 129, ${absValue})`; // Medium positive
    } else if (value < -0.7) {
      return theme.colors.data.loss; // Strong negative
    } else if (value < -0.3) {
      return `rgba(239, 68, 68, ${absValue})`; // Medium negative
    }
    return `rgba(100, 116, 139, 0.3)`; // Weak correlation
  };

  return (
    <div className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
      <h3 className="text-2xl font-bold text-[#D4AF37] mb-3 relative z-10 flex items-center gap-3">
        <span className="h-1 w-12 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full"></span>
        Market Correlation Matrix
      </h3>
      <p className="text-white/60 text-sm mb-8 relative z-10">
        Correlation coefficients between major markets • Last 365 days
      </p>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left"></th>
              {marketLabels.map((label, i) => (
                <th key={i} className="p-3 text-center">
                  <div className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
                    {label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {markets.map((rowMarket, i) => (
              <tr key={i}>
                <td className="p-3 text-left">
                  <div className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider whitespace-nowrap">
                    {marketLabels[i]}
                  </div>
                </td>
                {markets.map((colMarket, j) => (
                  <td key={j} className="p-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (i + j) * 0.02 }}
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-all backdrop-blur-sm shadow-lg border border-white/10 font-tabular"
                      style={{
                        backgroundColor: getCorrelationColor(correlationData[i]?.[j] || 0),
                      }}
                      title={`${marketLabels[i]} vs ${marketLabels[j]}: ${(correlationData[i]?.[j] || 0).toFixed(3)}`}
                    >
                      {(correlationData[i]?.[j] || 0).toFixed(2)}
                    </motion.div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-6 text-xs text-white/60 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.colors.data.profit }}></div>
          <span>Strong Positive (&gt;0.7)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.colors.data.loss }}></div>
          <span>Strong Negative (&lt;-0.7)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-500/30"></div>
          <span>Weak (-0.3 to 0.3)</span>
        </div>
      </div>
    </div>
  );
}
