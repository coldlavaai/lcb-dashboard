'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import theme from '@/lib/theme';

interface VolatilityDashboardProps {
  data: any[];
  title?: string;
}

export default function VolatilityDashboard({ data, title = 'Market Volatility' }: VolatilityDashboardProps) {
  const latest = data[0] || {};

  const volatilityMetrics = [
    {
      id: 'daily',
      label: 'Daily Range',
      value: parseFloat(latest['Daily range']) || 0,
      field: 'Daily range',
      color: '#D4AF37',
      icon: Activity,
    },
    {
      id: 'five-day',
      label: '5-Day Range',
      value: parseFloat(latest['Five day range']) || 0,
      field: 'Five day range',
      color: '#F4C430',
      icon: Activity,
    },
    {
      id: 'three-month',
      label: '3-Month Range',
      value: parseFloat(latest['3 month range']) || 0,
      field: '3 month range',
      color: '#2C7A7B',
      icon: TrendingUp,
    },
    {
      id: 'six-month',
      label: '6-Month Range',
      value: parseFloat(latest['6 month range']) || 0,
      field: '6 month range',
      color: '#4F46E5',
      icon: TrendingDown,
    },
  ];

  const weekMove = parseFloat(latest['Week move']) || 0;
  const hiLo = {
    hi: parseFloat(latest['Hi']) || 0,
    lo: parseFloat(latest['Lo']) || 0,
    spread: parseFloat(latest['Spread']) || 0,
  };

  const getIntensityColor = (value: number, max: number = 20) => {
    const intensity = Math.min((value / max) * 100, 100);
    return `rgba(212, 175, 55, ${intensity / 100})`;
  };

  return (
    <div className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none overflow-hidden group">
      <h3 className="text-2xl font-bold text-[#D4AF37] mb-8 relative z-10 flex items-center gap-3">
        <Zap size={24} className="text-[#D4AF37]" />
        <span className="h-1 w-12 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full"></span>
        {title}
      </h3>

      <div className="space-y-6 relative z-10">
        {/* Volatility Range Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {volatilityMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-xl p-6 backdrop-blur-md border-2"
                style={{
                  backgroundColor: getIntensityColor(metric.value),
                  borderColor: `${metric.color}60`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon size={20} style={{ color: metric.color }} />
                  <span className="text-white/60 text-xs font-medium">{metric.label}</span>
                </div>
                <div className="text-white text-3xl font-black font-tabular">
                  {metric.value.toFixed(2)}¢
                </div>
                <div className="mt-2 text-white/50 text-xs">Price movement range</div>
              </motion.div>
            );
          })}
        </div>

        {/* Week Move & Hi/Lo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Week Move */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden rounded-xl p-8 backdrop-blur-md border-2"
            style={{
              backgroundColor: getIntensityColor(Math.abs(weekMove)),
              borderColor: weekMove >= 0 ? `${theme.colors.data.profit}60` : `${theme.colors.data.loss}60`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              {weekMove >= 0 ? (
                <TrendingUp size={24} style={{ color: theme.colors.data.profit }} />
              ) : (
                <TrendingDown size={24} style={{ color: theme.colors.data.loss }} />
              )}
              <h4 className="text-white font-bold text-lg">Weekly Movement</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-5xl font-black font-tabular"
                style={{ color: weekMove >= 0 ? theme.colors.data.profitLight : theme.colors.data.lossLight }}
              >
                {weekMove >= 0 ? '+' : ''}{weekMove.toFixed(2)}¢
              </span>
            </div>
            <p className="text-white/50 text-sm mt-3">7-day price change</p>
          </motion.div>

          {/* Hi/Lo Spread */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden rounded-xl p-8 backdrop-blur-md border-2 border-[#2C7A7B]/60"
            style={{ backgroundColor: 'rgba(44, 122, 123, 0.1)' }}
          >
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Activity size={20} className="text-[#2C7A7B]" />
              Daily High/Low
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">High</span>
                <span className="text-green-400 text-2xl font-bold font-tabular">
                  {hiLo.hi.toFixed(2)}¢
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Low</span>
                <span className="text-red-400 text-2xl font-bold font-tabular">
                  {hiLo.lo.toFixed(2)}¢
                </span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm font-semibold">Spread</span>
                  <span className="text-[#D4AF37] text-3xl font-black font-tabular">
                    {hiLo.spread.toFixed(2)}¢
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Volatility Indicator Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-r from-[#1A2332] to-[#2C3E50] border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">Volatility Index</h4>
            <span className="text-white/50 text-xs">Based on 3-month range</span>
          </div>
          <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((volatilityMetrics[2].value / 30) * 100, 100)}%` }}
              transition={{ delay: 0.8, duration: 1 }}
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-white/50">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
