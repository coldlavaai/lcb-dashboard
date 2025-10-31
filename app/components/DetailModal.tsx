'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, BarChart3, Info, Calendar, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  dataKey: string;
  data: any[];
  description?: string;
  color?: string;
}

export default function DetailModal({
  isOpen,
  onClose,
  title,
  dataKey,
  data,
  description,
  color = '#D4AF37',
}: DetailModalProps) {
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prepare chart data
  const chartData = data
    .filter((d) => d[dataKey] != null && !isNaN(parseFloat(d[dataKey])))
    .reverse()
    .slice(0, 90); // Last 90 days for performance

  // Calculate statistics
  const values = data
    .filter((d) => d[dataKey] != null && !isNaN(parseFloat(d[dataKey])))
    .map((d) => parseFloat(d[dataKey]));

  const latestValue = values[0] || 0;
  const previousValue = values[1] || 0;
  const change = previousValue ? (((latestValue - previousValue) / Math.abs(previousValue)) * 100) : 0;
  const isPositive = change > 0;

  const stats = {
    current: latestValue.toFixed(2),
    change: change.toFixed(2),
    high: Math.max(...values).toFixed(2),
    low: Math.min(...values.filter(v => v !== 0)).toFixed(2),
    avg: (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2),
    volatility: (Math.max(...values) - Math.min(...values.filter(v => v !== 0))).toFixed(2),
    median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)]?.toFixed(2) || '0.00',
  };

  // Percentile calculation
  const sortedValues = [...values].sort((a, b) => a - b);
  const percentile = ((sortedValues.indexOf(latestValue) / sortedValues.length) * 100).toFixed(0);

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-gradient-to-br from-[#1A2332]/95 via-[#1A2332]/90 to-[#2C3E50]/95 backdrop-blur-xl border border-[#D4AF37]/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#1A2332]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-[#D4AF37] flex items-center gap-2">
                    <Activity size={24} style={{ color }} />
                    {title}
                  </h2>
                  {description && (
                    <p className="text-white/60 text-sm mt-1">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={24} className="text-white/70 hover:text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Current Value & Change */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0F1419]/50 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs uppercase mb-1">Current Value</p>
                    <p className="text-white text-2xl font-bold">{stats.current}</p>
                  </div>
                  <div className="bg-[#0F1419]/50 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs uppercase mb-1">24h Change</p>
                    <p className={`text-2xl font-bold flex items-center gap-2 ${
                      isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      {isPositive ? '+' : ''}{stats.change}%
                    </p>
                  </div>
                  <div className="bg-[#0F1419]/50 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs uppercase mb-1">90D High</p>
                    <p className="text-white text-2xl font-bold">{stats.high}</p>
                  </div>
                  <div className="bg-[#0F1419]/50 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs uppercase mb-1">90D Low</p>
                    <p className="text-white text-2xl font-bold">{stats.low}</p>
                  </div>
                </div>

                {/* Chart Controls */}
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg">Historical Data (90 Days)</h3>
                  <div className="flex bg-[#0F1419] rounded-lg p-1">
                    <button
                      onClick={() => setChartType('area')}
                      className={`px-4 py-2 text-xs rounded transition-all ${
                        chartType === 'area' ? 'bg-[#D4AF37] text-[#1A2332]' : 'text-white/70'
                      }`}
                    >
                      Area
                    </button>
                    <button
                      onClick={() => setChartType('line')}
                      className={`px-4 py-2 text-xs rounded transition-all ${
                        chartType === 'line' ? 'bg-[#D4AF37] text-[#1A2332]' : 'text-white/70'
                      }`}
                    >
                      Line
                    </button>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-[#0F1419]/50 rounded-xl p-4 border border-white/10">
                  <ResponsiveContainer width="100%" height={300}>
                    <ChartComponent data={chartData}>
                      <defs>
                        <linearGradient id={`detail-gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.6}/>
                          <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2C3E50" />
                      <XAxis
                        dataKey="Date"
                        stroke="#fff"
                        tick={{ fill: '#fff', fontSize: 11 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth()+1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis stroke="#fff" tick={{ fill: '#fff', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1A2332',
                          border: '1px solid #D4AF37',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: '#D4AF37' }}
                        formatter={(value: any) => [parseFloat(value).toFixed(2), dataKey]}
                      />
                      {chartType === 'area' ? (
                        <Area
                          type="monotone"
                          dataKey={dataKey}
                          stroke={color}
                          fill={`url(#detail-gradient-${dataKey})`}
                          strokeWidth={3}
                        />
                      ) : (
                        <Line
                          type="monotone"
                          dataKey={dataKey}
                          stroke={color}
                          strokeWidth={3}
                          dot={false}
                        />
                      )}
                    </ChartComponent>
                  </ResponsiveContainer>
                </div>

                {/* Detailed Statistics */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-3">Statistical Analysis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-[#0F1419]/50 rounded-lg p-3 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">90-Day Average</p>
                      <p className="text-white font-bold">{stats.avg}</p>
                    </div>
                    <div className="bg-[#0F1419]/50 rounded-lg p-3 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Median</p>
                      <p className="text-white font-bold">{stats.median}</p>
                    </div>
                    <div className="bg-[#0F1419]/50 rounded-lg p-3 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Volatility (Hi-Lo)</p>
                      <p className="text-white font-bold">{stats.volatility}</p>
                    </div>
                    <div className="bg-[#0F1419]/50 rounded-lg p-3 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Current Percentile</p>
                      <p className="text-white font-bold">{percentile}th</p>
                    </div>
                    <div className="bg-[#0F1419]/50 rounded-lg p-3 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Data Points</p>
                      <p className="text-white font-bold">{values.length}</p>
                    </div>
                    <div className="bg-[#0F1419]/50 rounded-lg p-3 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Range</p>
                      <p className="text-white font-bold">{stats.low} - {stats.high}</p>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-[#2C7A7B]/20 border border-[#2C7A7B]/40 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info size={20} className="text-[#2C7A7B] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-[#2C7A7B] font-semibold mb-1">About this Metric</h4>
                      <p className="text-white/80 text-sm">
                        {dataKey.includes('Spread')
                          ? 'Spread metrics show the price differential between two markets or contracts, indicating arbitrage opportunities and market relationships.'
                          : dataKey.includes('ICE')
                          ? 'ICE Cotton No. 2 is the benchmark futures contract for US cotton, traded on the Intercontinental Exchange.'
                          : dataKey.includes('Volume')
                          ? 'Volume represents the total number of contracts traded, indicating market activity and liquidity.'
                          : dataKey.includes('O/I') || dataKey.includes('Open Interest')
                          ? 'Open Interest shows the total number of outstanding contracts, reflecting market commitment and positioning.'
                          : 'This metric provides insight into market trends, pricing dynamics, and trading opportunities in the cotton industry.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-4 flex items-center justify-between bg-[#0F1419]/30">
                <p className="text-white/50 text-xs flex items-center gap-2">
                  <Calendar size={14} />
                  Last updated: {new Date(data[0]?.Date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332] font-semibold rounded-lg hover:from-[#F4C430] hover:to-[#D4AF37] transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
