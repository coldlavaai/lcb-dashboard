'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Download, Bell, Settings, ChevronDown, LayoutGrid } from 'lucide-react';

// Import components
import HeatMap from '../components/HeatMap';
import CorrelationMatrix from '../components/CorrelationMatrix';
import MarketDataTable from '../components/MarketDataTable';
import AdvancedChart from '../components/AdvancedChart';
import CommentaryPanel from '../components/CommentaryPanel';

// Import data
import cottonData from '../data/cotton_data.json';

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
type ViewMode = 'overview' | 'spreads' | 'markets' | 'data';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedSpread, setSelectedSpread] = useState('CZCE - ICE');

  const getFilteredData = () => {
    const days = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
      'all': cottonData.length
    }[timeRange];
    return cottonData.slice(0, days);
  };

  const filteredData = getFilteredData();

  const spreads = [
    { id: 'CZCE - ICE', name: 'CZCE-ICE', description: 'China vs US Cotton Futures', color: '#D4AF37' },
    { id: 'AWP - ICE', name: 'AWP-ICE', description: 'Adjusted World Price vs US', color: '#F4C430' },
    { id: 'MCX - ICE', name: 'MCX-ICE', description: 'India vs US Cotton', color: '#2C7A7B' },
    { id: 'CZCE Cotton - PSF', name: 'Cotton-PSF', description: 'Cotton vs Polyester', color: '#E07A5F' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E1A] via-[#111827] to-[#1F2937]">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-[#1A2332]/95 via-[#2C3E50]/95 to-[#1A2332]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 sticky top-0 z-50 shadow-2xl"
      >
        <div className="max-w-[2000px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Image
                src="/lcb-logo.png"
                alt="Liverpool Cotton Brokers"
                width={200}
                height={50}
                className="h-12 w-auto"
                priority
              />
              <div className="border-l border-[#D4AF37]/30 pl-4">
                <p className="text-white/70 text-sm">Professional Market Intelligence • 20 Years of Data</p>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* View Mode */}
              <div className="flex bg-[#0F1419] rounded-xl p-1 border border-white/10">
                {([
                  { id: 'overview', label: 'Overview' },
                  { id: 'spreads', label: 'Spreads' },
                  { id: 'markets', label: 'Markets' },
                  { id: 'data', label: 'Data' },
                ] as { id: ViewMode; label: string }[]).map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                      viewMode === mode.id
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332] shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Time Range */}
              <div className="flex bg-[#0F1419] rounded-xl p-1 border border-white/10">
                {(['7d', '30d', '90d', '1y', 'all'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                      timeRange === range
                        ? 'bg-[#2C7A7B] text-white shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#2C7A7B] to-[#3B9B9B] text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Download size={16} />
                Export PDF
              </motion.button>

              <button className="p-2.5 bg-[#0F1419] hover:bg-white/5 text-white/60 hover:text-white rounded-xl transition-all border border-white/10">
                <Bell size={18} />
              </button>

              <button className="p-2.5 bg-[#0F1419] hover:bg-white/5 text-white/60 hover:text-white rounded-xl transition-all border border-white/10">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-[2000px] mx-auto px-8 py-8">
        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Row 1: Heat Map + Correlation Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <HeatMap data={filteredData} title="Spread Heat Map" />
              <CorrelationMatrix data={filteredData} />
            </div>

            {/* Row 2: Main Chart + Commentary */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <AdvancedChart
                  data={filteredData}
                  spread={selectedSpread}
                  title={spreads.find(s => s.id === selectedSpread)?.name || 'CZCE-ICE'}
                  description={spreads.find(s => s.id === selectedSpread)?.description || ''}
                  color={spreads.find(s => s.id === selectedSpread)?.color || '#D4AF37'}
                />
              </div>
              <div>
                <CommentaryPanel spread={selectedSpread} />
              </div>
            </div>

            {/* Row 3: Secondary Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdvancedChart
                data={filteredData}
                spread="AWP - ICE"
                title="AWP-ICE"
                description="Adjusted World Price vs US Futures"
                color="#F4C430"
              />
              <AdvancedChart
                data={filteredData}
                spread="MCX - ICE"
                title="MCX-ICE"
                description="India vs US Cotton Futures"
                color="#2C7A7B"
              />
            </div>

            {/* Row 4: Data Table */}
            <MarketDataTable data={filteredData} />
          </motion.div>
        )}

        {/* Spreads Mode */}
        {viewMode === 'spreads' && (
          <motion.div
            key="spreads"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Spread Selector */}
            <div className="flex gap-3 flex-wrap">
              {spreads.map((spread) => (
                <motion.button
                  key={spread.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSpread(spread.id)}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                    selectedSpread === spread.id
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332] shadow-xl'
                      : 'bg-[#1A2332]/80 text-white border border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                  }`}
                  style={{
                    boxShadow: selectedSpread === spread.id ? `0 10px 40px ${spread.color}40` : 'none',
                  }}
                >
                  {spread.name}
                </motion.button>
              ))}
            </div>

            {/* Main Spread Analysis */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <AdvancedChart
                  data={filteredData}
                  spread={selectedSpread}
                  title={spreads.find(s => s.id === selectedSpread)?.name || ''}
                  description={spreads.find(s => s.id === selectedSpread)?.description || ''}
                  color={spreads.find(s => s.id === selectedSpread)?.color || '#D4AF37'}
                />
              </div>
              <div>
                <CommentaryPanel spread={selectedSpread} />
              </div>
            </div>

            {/* All Spreads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {spreads.filter(s => s.id !== selectedSpread).map((spread) => (
                <AdvancedChart
                  key={spread.id}
                  data={filteredData}
                  spread={spread.id}
                  title={spread.name}
                  description={spread.description}
                  color={spread.color}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Markets Mode */}
        {viewMode === 'markets' && (
          <motion.div
            key="markets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <HeatMap data={filteredData} title="Global Market Overview" />
            <CorrelationMatrix data={filteredData} />

            {/* Market Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { field: 'ICE', title: 'ICE (US)', color: '#4F46E5' },
                { field: 'CZCE cotton usc/lb', title: 'CZCE (China)', color: '#DC2626' },
                { field: 'MCX usc/lb', title: 'MCX (India)', color: '#059669' },
                { field: 'AWP', title: 'AWP', color: '#D97706' },
              ].map((market) => (
                <AdvancedChart
                  key={market.field}
                  data={filteredData}
                  spread={market.field}
                  title={market.title}
                  description={`${market.title} Price Trends`}
                  color={market.color}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Data Mode */}
        {viewMode === 'data' && (
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <MarketDataTable data={filteredData} />
            <CorrelationMatrix data={filteredData} />
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center pb-8"
        >
          <p className="text-white/30 text-sm">
            Last Updated: {new Date(filteredData[0]?.Date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-white/20 text-xs mt-2">
            © 2025 Liverpool Cotton Brokers • 4,965 trading days analyzed • Built by Cold Lava
          </p>
        </motion.div>
      </main>
    </div>
  );
}
