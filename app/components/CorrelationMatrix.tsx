'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface CorrelationMatrixProps {
  data: any[];
}

export default function CorrelationMatrix({ data }: CorrelationMatrixProps) {
  const markets = ['ICE', 'CZCE cotton usc/lb', 'MCX usc/lb', 'AWP', 'CEPEA', 'A-Index'];

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
    // Strong positive correlation: blue, strong negative: red, weak: gray
    const absValue = Math.abs(value);
    if (value > 0.7) {
      return `rgb(34, 197, 94)`; // Strong positive - green
    } else if (value > 0.3) {
      return `rgba(34, 197, 94, ${absValue})`;
    } else if (value < -0.7) {
      return `rgb(239, 68, 68)`; // Strong negative - red
    } else if (value < -0.3) {
      return `rgba(239, 68, 68, ${absValue})`;
    }
    return `rgba(148, 163, 184, 0.3)`; // Weak correlation - gray
  };

  return (
    <div className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
      <h3 className="text-xl font-bold text-[#D4AF37] mb-4 relative z-10">Market Correlation Matrix</h3>
      <p className="text-white/60 text-sm mb-4 relative z-10">
        Correlation coefficients between major markets • Last 365 days
      </p>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 pb-24"></th>
              {markets.map((market, i) => (
                <th key={i} className="p-2 pb-24 relative h-32">
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform -rotate-45 origin-center text-xs text-white/70 font-medium whitespace-nowrap w-24 text-left">
                    {market.replace(' usc/lb', '')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {markets.map((rowMarket, i) => (
              <tr key={i}>
                <td className="p-2 text-xs text-white/70 font-medium whitespace-nowrap">
                  {rowMarket.replace(' usc/lb', '')}
                </td>
                {markets.map((colMarket, j) => (
                  <td key={j} className="p-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (i + j) * 0.02 }}
                      className="w-14 h-14 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-all backdrop-blur-sm shadow-lg"
                      style={{
                        backgroundColor: getCorrelationColor(correlationData[i]?.[j] || 0),
                      }}
                      title={`${rowMarket} vs ${colMarket}: ${(correlationData[i]?.[j] || 0).toFixed(3)}`}
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
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span>Strong Positive (&gt;0.7)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
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
