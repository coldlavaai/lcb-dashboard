'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, Activity, Info } from 'lucide-react';
import DetailModal from './DetailModal';
import { ComparisonMode } from './ComparisonSelector';
import { getComparisonDataPoint, calculatePercentageChange, calculatePointChange } from '../utils/comparisonUtils';

interface TickerItem {
  id: string;
  label: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  alert?: boolean;
  dataKey: string;
  isSpread?: boolean; // Indicates if this is a spread (should use points not %)
  description?: string; // Tooltip description
}

interface LiveTickerProps {
  data: any[];
  comparisonMode?: ComparisonMode;
}

export default function LiveTicker({ data, comparisonMode = 'latest' }: LiveTickerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  // Get comparison label
  const getComparisonLabel = () => {
    switch (comparisonMode) {
      case 'latest': return 'vs Previous Day';
      case 'week': return 'vs Last Week';
      case 'month': return 'vs Last Month';
      case 'year': return 'vs Last Year';
      case 'decade': return 'vs 10 Years Ago';
      case 'custom': return 'vs Custom';
      default: return 'vs Previous';
    }
  };

  // Calculate ticker items from data
  const getTickerItems = (): TickerItem[] => {
    if (!data || data.length < 2) return [];

    const latest = data[0];
    const { compareIndex } = getComparisonDataPoint(data, 0, comparisonMode);

    if (compareIndex === -1 || !data[compareIndex]) return [];

    const previous = data[compareIndex];

    // Check if MCX source data is available
    const hasMCXData = latest['MCX'] != null && latest['MCX usc/lb'] != null;

    const items: TickerItem[] = [];

    // CZCE-ICE Spread (Priority #1 from Harry)
    if (latest['CZCE - ICE'] != null) {
      const current = parseFloat(latest['CZCE - ICE']);
      const prev = parseFloat(previous['CZCE - ICE']);
      const change = calculatePointChange(current, prev); // Use point change for spreads
      items.push({
        id: 'czce-ice',
        label: 'CZCE-ICE Spread',
        value: current.toFixed(2) + '¢',
        change: change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
        alert: Math.abs(change) > 2, // Alert if >2 point move
        dataKey: 'CZCE - ICE',
        isSpread: true,
        description: 'China (CZCE) vs US (ICE) Cotton Futures Spread'
      });
    }

    // AWP-ICE Spread (Priority #2)
    if (latest['AWP - ICE'] != null) {
      const current = parseFloat(latest['AWP - ICE']);
      const prev = parseFloat(previous['AWP - ICE']);
      const change = calculatePointChange(current, prev); // Use point change for spreads
      items.push({
        id: 'awp-ice',
        label: 'AWP-ICE Spread',
        value: current.toFixed(2) + '¢',
        change: change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
        dataKey: 'AWP - ICE',
        isSpread: true,
        description: 'Adjusted World Price vs US (ICE) Cotton Futures Spread'
      });
    }

    // MCX-ICE Spread (Priority #3) - Only show if MCX source data exists
    if (hasMCXData && latest['MCX - ICE'] != null) {
      const current = parseFloat(latest['MCX - ICE']);
      const prev = parseFloat(previous['MCX - ICE']);
      const change = calculatePointChange(current, prev); // Use point change for spreads
      items.push({
        id: 'mcx-ice',
        label: 'MCX-ICE Spread',
        value: current.toFixed(2) + '¢',
        change: change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
        dataKey: 'MCX - ICE',
        isSpread: true,
        description: 'India (MCX) vs US (ICE) Cotton Futures Spread'
      });
    }

    // ICE Cotton No. 2 Price
    if (latest['ICE'] != null) {
      const current = parseFloat(latest['ICE']);
      const prev = parseFloat(previous['ICE']);
      const change = calculatePercentageChange(current, prev);
      items.push({
        id: 'ice-cotton',
        label: 'ICE Cotton No. 2',
        value: current.toFixed(2) + '¢',
        change: change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
        dataKey: 'ICE',
        description: 'US Cotton Futures (ICE) - Main Benchmark Price'
      });
    }

    // Volume
    if (latest['Volume'] != null) {
      const volume = parseFloat(latest['Volume']);
      items.push({
        id: 'volume',
        label: 'Trading Volume',
        value: (volume / 1000).toFixed(1) + 'K',
        trend: 'neutral',
        dataKey: 'Volume',
        description: 'Number of contracts traded (in thousands)'
      });
    }

    // Open Interest
    if (latest['Open Interest'] != null) {
      const oi = parseFloat(latest['Open Interest']);
      items.push({
        id: 'open-interest',
        label: 'Open Interest',
        value: (oi / 1000).toFixed(1) + 'K',
        trend: 'neutral',
        dataKey: 'O/I',
        description: 'Total outstanding contracts (in thousands)'
      });
    }

    // Cotton-PSF Spread (Priority #4)
    if (latest['CZCE Cotton - PSF'] != null) {
      const current = parseFloat(latest['CZCE Cotton - PSF']);
      const prev = parseFloat(previous['CZCE Cotton - PSF']);
      const change = calculatePointChange(current, prev); // Use point change for spreads
      items.push({
        id: 'cotton-psf',
        label: 'Cotton-PSF Spread',
        value: current.toFixed(2),
        change: change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
        dataKey: 'CZCE Cotton - PSF',
        isSpread: true,
        description: 'Cotton vs Polyester Staple Fiber Spread'
      });
    }

    // Cotlook A-Index
    if (latest['A-Index'] != null) {
      const current = parseFloat(latest['A-Index']);
      items.push({
        id: 'a-index',
        label: 'Cotlook A-Index',
        value: current.toFixed(2) + '¢',
        trend: 'neutral',
        dataKey: 'A-Index',
        description: 'International Cotton Price Benchmark'
      });
    }

    return items;
  };

  const tickerItems = getTickerItems();

  // Double the items for seamless loop
  const doubledItems = [...tickerItems, ...tickerItems];

  return (
    <div
      className="bg-[#0F1419]/80 backdrop-blur-xl border-y border-white/20 overflow-hidden relative shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ticker content */}
      <div className="flex items-center py-2 px-4">
        <div className="flex items-center gap-3 mr-6 flex-shrink-0">
          <Activity size={16} className="text-[#D4AF37]" />
          <div className="flex flex-col">
            <span className="text-white/70 text-xs font-semibold uppercase tracking-wide">
              Live Market Data
            </span>
            <span className="text-white/50 text-[10px] font-medium">
              {getComparisonLabel()}
            </span>
          </div>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group/info"
            title="Show legend"
          >
            <Info size={14} className="text-white/40 group-hover/info:text-[#D4AF37] transition-colors" />
          </button>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden">
          <div
            className="flex gap-12 animate-scroll"
            style={{
              width: 'max-content',
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {doubledItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => setSelectedItem(item.dataKey)}
                className="flex items-center gap-3 whitespace-nowrap cursor-pointer hover:bg-white/5 px-4 py-2 rounded-lg transition-colors group/item"
                title={item.description || item.label}
              >
                {/* Alert icon for significant changes */}
                {item.alert && (
                  <AlertCircle size={14} className="text-yellow-400" />
                )}

                {/* Label */}
                <span className="text-white/60 text-xs font-medium">
                  {item.label}:
                </span>

                {/* Value */}
                <span className="text-white text-sm font-bold">
                  {item.value}
                </span>

                {/* Change & Trend */}
                {item.change !== undefined && (
                  <div className={`flex items-center gap-1 ${
                    item.trend === 'up' ? 'text-green-400' :
                    item.trend === 'down' ? 'text-red-400' :
                    'text-white/50'
                  }`}>
                    {item.trend === 'up' && <TrendingUp size={12} />}
                    {item.trend === 'down' && <TrendingDown size={12} />}
                    <span className="text-xs font-semibold">
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}{item.isSpread ? ' pts' : '%'}
                    </span>
                  </div>
                )}

                {/* Separator */}
                <span className="text-white/20 text-lg mx-4">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for infinite scroll */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 45s linear infinite;
        }
      `}</style>

      {/* Legend Panel */}
      {showLegend && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-r from-[#1A2332]/95 to-[#2C3E50]/95 backdrop-blur-lg border-t border-white/10 px-8 py-4"
        >
          <div className="flex items-start gap-8 text-xs">
            <div>
              <p className="text-[#D4AF37] font-bold mb-2">Legend</p>
              <div className="space-y-1.5 text-white/70">
                <p><span className="text-white font-semibold">¢</span> = US cents per pound</p>
                <p><span className="text-white font-semibold">pts</span> = Points (absolute change for spreads)</p>
                <p><span className="text-white font-semibold">%</span> = Percentage change</p>
                <p><span className="text-white font-semibold">K</span> = Thousands of contracts</p>
              </div>
            </div>
            <div>
              <p className="text-[#D4AF37] font-bold mb-2">Key Spreads</p>
              <div className="space-y-1.5 text-white/70">
                <p><span className="text-white font-semibold">CZCE-ICE:</span> China vs US futures</p>
                <p><span className="text-white font-semibold">AWP-ICE:</span> World price vs US</p>
                <p><span className="text-white font-semibold">MCX-ICE:</span> India vs US futures</p>
                <p><span className="text-white font-semibold">Cotton-PSF:</span> Cotton vs Polyester</p>
              </div>
            </div>
            <div>
              <p className="text-[#D4AF37] font-bold mb-2">Indicators</p>
              <div className="space-y-1.5 text-white/70">
                <p className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-400" />
                  <span>Positive movement</span>
                </p>
                <p className="flex items-center gap-2">
                  <TrendingDown size={14} className="text-red-400" />
                  <span>Negative movement</span>
                </p>
                <p className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-yellow-400" />
                  <span>Significant change (&gt;2pts)</span>
                </p>
              </div>
            </div>
            <div className="ml-auto">
              <p className="text-white/50 text-[10px] italic">
                Click any item to view detailed historical analysis
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem}
          dataKey={selectedItem}
          data={data}
          description={`Historical performance and analysis of ${selectedItem}`}
          color={
            selectedItem === 'CZCE - ICE' ? '#D4AF37' :
            selectedItem === 'AWP - ICE' ? '#F4C430' :
            selectedItem === 'MCX - ICE' ? '#2C7A7B' :
            selectedItem === 'CZCE Cotton - PSF' ? '#E07A5F' :
            selectedItem === 'ICE' ? '#4F46E5' :
            '#2C7A7B'
          }
          comparisonMode={comparisonMode}
        />
      )}
    </div>
  );
}
