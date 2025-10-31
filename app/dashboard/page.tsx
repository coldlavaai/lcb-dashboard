'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Download, Bell, Settings, ChevronDown, LayoutGrid } from 'lucide-react';

// Import components
import HeatMap from '../components/HeatMap';
import CorrelationMatrix from '../components/CorrelationMatrix';
import MarketDataTable from '../components/MarketDataTable';
import CompleteDataTable from '../components/CompleteDataTable';
import AdvancedChart from '../components/AdvancedChart';
import CommentaryPanel from '../components/CommentaryPanel';
import LiveTicker from '../components/LiveTicker';
import CustomDatePicker from '../components/CustomDatePicker';
import ComparisonSelector, { ComparisonMode } from '../components/ComparisonSelector';
import SettingsModal from '../components/SettingsModal';

// Import data
import cottonData from '../data/cotton_data.json';
import cottonDataFull from '../data/cotton_data_full.json';

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
type ViewMode = 'overview' | 'spreads' | 'markets' | 'data';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedSpread, setSelectedSpread] = useState('CZCE - ICE');
  const [customDateRange, setCustomDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('latest');
  const [showSettings, setShowSettings] = useState(false);

  const getFilteredData = () => {
    // No filtering needed - all data is valid
    const filteredCottonData = cottonData;

    // Use custom date range if set
    if (useCustomRange && customDateRange.start && customDateRange.end) {
      return filteredCottonData.filter((item) => {
        const itemDate = new Date(item.Date);
        return itemDate >= customDateRange.start! && itemDate <= customDateRange.end!;
      });
    }

    // Otherwise use preset time ranges
    const days = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
      'all': filteredCottonData.length
    }[timeRange];
    return filteredCottonData.slice(0, days);
  };

  const handleCustomDateRange = (startDate: Date, endDate: Date) => {
    setCustomDateRange({ start: startDate, end: endDate });
    setUseCustomRange(true);
    // Reset preset time range visual state
    setTimeRange('30d'); // Keep a default selected
  };

  const filteredData = getFilteredData();

  // No filtering needed for full dataset
  const filteredFullData = cottonDataFull;

  // Check if MCX data is available in latest record
  const latestData = filteredData[0] || {};
  const hasMCXData = latestData['MCX'] != null && latestData['MCX usc/lb'] != null;

  // Only include MCX spread if data is available
  const spreads = [
    { id: 'CZCE - ICE', name: 'CZCE-ICE', description: 'China vs US Cotton Futures', color: '#D4AF37' },
    { id: 'AWP - ICE', name: 'AWP-ICE', description: 'Adjusted World Price vs US', color: '#F4C430' },
    ...(hasMCXData ? [{ id: 'MCX - ICE', name: 'MCX-ICE', description: 'India vs US Cotton', color: '#2C7A7B' }] : []),
    { id: 'CZCE Cotton - PSF', name: 'Cotton-PSF', description: 'Cotton vs Polyester', color: '#E07A5F' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #0A0B0D, #13151A, #1C1F26)' }}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-[#0D1B2A]/98 via-[#1B263B]/98 to-[#0D1B2A]/98 backdrop-blur-2xl border-b-2 border-[#D4AF37]/30 sticky top-0 z-50 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
      >
        <div className="max-w-[2000px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between gap-6">
            {/* Logo & Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-5"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/lcb-logo.png"
                alt="Liverpool Cotton Brokers"
                width={240}
                height={60}
                className="h-16 w-auto drop-shadow-2xl"
                priority
              />
              <div className="border-l-2 border-[#D4AF37]/50 pl-5 hidden lg:block">
                <p className="text-white/90 text-sm font-semibold tracking-wide">Professional Market Intelligence</p>
                <p className="text-[#D4AF37]/80 text-xs font-medium tracking-wide mt-0.5">20 Years of Data</p>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap justify-end">
              {/* View Mode */}
              <div className="flex bg-[#0F1419]/80 rounded-xl p-1 border border-white/10 backdrop-blur-sm">
                {([
                  { id: 'overview', label: 'Overview' },
                  { id: 'spreads', label: 'Spreads' },
                  { id: 'markets', label: 'Markets' },
                  { id: 'data', label: 'Data' },
                ] as { id: ViewMode; label: string }[]).map((mode) => (
                  <motion.button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      viewMode === mode.id
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332] shadow-lg shadow-[#D4AF37]/30'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {mode.label}
                  </motion.button>
                ))}
              </div>

              {/* Time Range */}
              <div className="flex bg-[#0F1419]/80 rounded-xl p-1 border border-white/10 backdrop-blur-sm">
                {(['7d', '30d', '90d', '1y', 'all'] as TimeRange[]).map((range) => (
                  <motion.button
                    key={range}
                    onClick={() => {
                      setTimeRange(range);
                      setUseCustomRange(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                      timeRange === range && !useCustomRange
                        ? 'bg-[#2C7A7B] text-white shadow-lg shadow-[#2C7A7B]/40'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {range}
                  </motion.button>
                ))}
              </div>

              {/* Custom Date Picker */}
              <CustomDatePicker onRangeChange={handleCustomDateRange} />

              {/* Comparison Selector */}
              <ComparisonSelector value={comparisonMode} onChange={setComparisonMode} />

              {/* Action Buttons */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#2C7A7B] to-[#3B9B9B] text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-[0_8px_24px_rgba(44,122,123,0.4)] transition-all"
              >
                <Download size={16} />
                Export PDF
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 bg-[#0F1419]/80 hover:bg-[#2C7A7B]/20 text-white/70 hover:text-[#2C7A7B] rounded-xl transition-all border border-white/10 hover:border-[#2C7A7B]/40"
              >
                <Bell size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSettings(true)}
                className="p-2.5 bg-[#0F1419]/80 hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-all border border-white/10 hover:border-white/30"
              >
                <Settings size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Live Ticker */}
      <LiveTicker data={filteredData} comparisonMode={comparisonMode} />

      <main className="max-w-[2000px] mx-auto px-8 py-12">
        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {/* Row 1: Heat Map + Correlation Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <HeatMap data={filteredData} title="Spread Heat Map" comparisonMode={comparisonMode} />
              <CorrelationMatrix data={filteredData} />
            </div>

            {/* Row 2: Main Chart + Commentary */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
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
              {hasMCXData && (
                <AdvancedChart
                  data={filteredData}
                  spread="MCX - ICE"
                  title="MCX-ICE"
                  description="India vs US Cotton Futures"
                  color="#2C7A7B"
                />
              )}
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
            className="space-y-10"
          >
            {/* Spread Selector */}
            <div className="flex gap-4 flex-wrap">
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
            className="space-y-10"
          >
            <HeatMap data={filteredData} title="Global Market Overview" comparisonMode={comparisonMode} />
            <CorrelationMatrix data={filteredData} />

            {/* Market Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
            className="space-y-10"
          >
            <CompleteDataTable data={filteredFullData as any[]} />
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

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
