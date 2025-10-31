'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, BarChart3, Info, Calendar, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ComparisonMode } from './ComparisonSelector';
import { getComparisonDataPoint, calculatePercentageChange, calculatePointChange, formatComparisonLabel } from '../utils/comparisonUtils';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  dataKey: string;
  data: any[];
  description?: string;
  color?: string;
  comparisonMode?: ComparisonMode;
}

export default function DetailModal({
  isOpen,
  onClose,
  title,
  dataKey,
  data,
  description,
  color = '#D4AF37',
  comparisonMode = 'latest',
}: DetailModalProps) {
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [mounted, setMounted] = useState(false);

  // Ensure we're mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Get comparison data point based on mode
  const { compareIndex, compareDate } = getComparisonDataPoint(data, 0, comparisonMode);
  const previousValue = (compareIndex >= 0 && data[compareIndex])
    ? parseFloat(data[compareIndex][dataKey]) || 0
    : 0;

  // Detect if this is a spread (contains hyphen or specific keywords)
  const isSpread = dataKey.includes('-') || dataKey.toLowerCase().includes('spread') ||
                   dataKey.toLowerCase().includes('basis');

  const percentChange = calculatePercentageChange(latestValue, previousValue);
  const pointChange = calculatePointChange(latestValue, previousValue);

  // Use point change for spreads, percentage for absolute prices
  const change = isSpread ? pointChange : percentChange;
  const isPositive = change > 0;

  // Get actual dates for comparison label
  const latestDate = data[0]?.Date || null;
  const comparisonLabel = formatComparisonLabel(latestDate, compareDate, comparisonMode);

  // Calculate stats
  const sortedValues = [...values].sort((a, b) => a - b);

  const stats = {
    current: latestValue.toFixed(2),
    change: change.toFixed(2),
    high: Math.max(...values).toFixed(2),
    low: Math.min(...values.filter(v => v !== 0)).toFixed(2),
    avg: (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2),
    volatility: (Math.max(...values) - Math.min(...values.filter(v => v !== 0))).toFixed(2),
    median: sortedValues[Math.floor(sortedValues.length / 2)]?.toFixed(2) || '0.00',
  };

  // Percentile calculation - count how many values are less than current value
  const valuesLessThanCurrent = sortedValues.filter(v => v < latestValue).length;
  const percentile = sortedValues.length > 0
    ? ((valuesLessThanCurrent / sortedValues.length) * 100).toFixed(0)
    : '0';

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

  // Don't render on server or if not mounted
  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] cursor-pointer"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-gradient-to-br from-[#1A2332]/98 via-[#1A2332]/95 to-[#2C3E50]/98 backdrop-blur-2xl border-2 border-[#D4AF37]/40 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.8)] max-w-5xl w-full pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Always Visible (Sticky) */}
              <div className="bg-gradient-to-r from-[#1A2332] to-[#2C3E50] border-b-2 border-[#D4AF37]/40 p-6 flex items-center justify-between flex-shrink-0">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-[#D4AF37] flex items-center gap-2">
                    <Activity size={24} style={{ color }} />
                    <span className="truncate">{title}</span>
                  </h2>
                  {description && (
                    <p className="text-white/70 text-sm mt-1">{description}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="flex-shrink-0 ml-4 p-3 bg-red-500/10 hover:bg-red-500/30 rounded-xl transition-all border-2 border-red-500/30 hover:border-red-500 group"
                  title="Close (Esc)"
                >
                  <X size={24} className="text-red-400 group-hover:text-red-300 transition-colors" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Current Value & Change */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0F1419]/50 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs uppercase mb-1">Current Value</p>
                    <p className="text-white text-2xl font-bold">{stats.current}</p>
                  </div>
                  <div className="bg-[#0F1419]/50 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">Change: {comparisonLabel}</p>
                    <p className={`text-2xl font-bold flex items-center gap-2 ${
                      isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      {isPositive ? '+' : ''}{stats.change}{isSpread ? ' pts' : '%'}
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
                      <YAxis
                        stroke="#fff"
                        tick={{ fill: '#fff', fontSize: 12 }}
                        domain={['dataMin - 5', 'dataMax + 5']}
                        padding={{ top: 20, bottom: 20 }}
                      />
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

              {/* Footer - Always Visible (Sticky) */}
              <div className="border-t-2 border-[#D4AF37]/40 p-6 flex items-center justify-between bg-gradient-to-r from-[#1A2332] to-[#2C3E50] flex-shrink-0">
                <p className="text-white/60 text-sm flex items-center gap-2">
                  <Calendar size={16} />
                  Last updated: {new Date(data[0]?.Date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332] font-bold rounded-xl hover:from-[#F4C430] hover:to-[#D4AF37] transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Render modal in a portal at document.body level to escape all container constraints
  return createPortal(modalContent, document.body);
}
