'use client';

import { useState } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Layers, BarChart3, Calendar } from 'lucide-react';

interface AdvancedChartProps {
  data: any[];
  spread: string;
  title: string;
  description: string;
  color: string;
}

export default function AdvancedChart({ data, spread, title, description, color }: AdvancedChartProps) {
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [showMA, setShowMA] = useState(false);

  // Prepare chart data
  const chartData = data
    .filter((d) => d[spread] != null && !isNaN(parseFloat(d[spread])))
    .reverse();

  // Calculate moving average
  const dataWithMA = showMA && chartData.length > 20 ? chartData.map((d, i) => {
    if (i < 19) return { ...d, ma20: null };
    const sum = chartData.slice(i - 19, i + 1).reduce((acc, item) => acc + (parseFloat(item[spread]) || 0), 0);
    return { ...d, ma20: sum / 20 };
  }) : chartData;

  const latestValue = data[0]?.[spread] ? parseFloat(data[0][spread]).toFixed(2) : 'N/A';
  const previousValue = data[1]?.[spread] ? parseFloat(data[1][spread]) : 0;
  const currentValue = data[0]?.[spread] ? parseFloat(data[0][spread]) : 0;
  const change = previousValue ? (((currentValue - previousValue) / previousValue) * 100).toFixed(2) : '0.00';
  const isPositive = parseFloat(change) > 0;

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

  return (
    <div className="bg-gradient-to-br from-[#1A2332]/90 via-[#1A2332]/80 to-[#2C3E50]/90 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl p-6 shadow-2xl">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-[#D4AF37] flex items-center gap-2">
            <TrendingUp size={24} />
            {title}
          </h3>
          <p className="text-white/60 text-sm mt-1">{description}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{latestValue}</p>
          <p className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{change}%
          </p>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex bg-[#0F1419] rounded-lg p-1">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 text-xs rounded transition-all ${
              chartType === 'area' ? 'bg-[#D4AF37] text-[#1A2332]' : 'text-white/70'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-xs rounded transition-all ${
              chartType === 'line' ? 'bg-[#D4AF37] text-[#1A2332]' : 'text-white/70'
            }`}
          >
            Line
          </button>
        </div>

        <button
          onClick={() => setShowMA(!showMA)}
          className={`px-3 py-1 text-xs rounded transition-all flex items-center gap-1 ${
            showMA ? 'bg-[#D4AF37] text-[#1A2332]' : 'bg-[#0F1419] text-white/70'
          }`}
        >
          <Layers size={12} />
          MA(20)
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <ChartComponent data={dataWithMA}>
          <defs>
            <linearGradient id={`gradient-${spread}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2C3E50" />
          <XAxis
            dataKey="Date"
            stroke="#fff"
            tick={{ fill: '#fff', fontSize: 10 }}
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
            formatter={(value: any) => [parseFloat(value).toFixed(2), spread]}
          />
          {chartType === 'area' ? (
            <Area
              type="monotone"
              dataKey={spread}
              stroke={color}
              fill={`url(#gradient-${spread})`}
              strokeWidth={3}
            />
          ) : (
            <Line
              type="monotone"
              dataKey={spread}
              stroke={color}
              strokeWidth={3}
              dot={false}
            />
          )}
          {showMA && (
            <Line
              type="monotone"
              dataKey="ma20"
              stroke="#F4C430"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>

      {/* Stats Footer */}
      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
        {[
          { label: '52W High', value: Math.max(...data.slice(0, 260).map(d => parseFloat(d[spread]) || 0)).toFixed(2) },
          { label: '52W Low', value: Math.min(...data.slice(0, 260).filter(d => d[spread] != null).map(d => parseFloat(d[spread]))).toFixed(2) },
          { label: '30D Avg', value: (data.slice(0, 30).reduce((sum, d) => sum + (parseFloat(d[spread]) || 0), 0) / 30).toFixed(2) },
          { label: '7D Volatility', value: (Math.max(...data.slice(0, 7).map(d => parseFloat(d[spread]) || 0)) - Math.min(...data.slice(0, 7).filter(d => d[spread] != null).map(d => parseFloat(d[spread])))).toFixed(2) },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-white/50 text-xs">{stat.label}</p>
            <p className="text-white font-bold text-sm mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
