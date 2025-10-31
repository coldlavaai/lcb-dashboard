'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Activity } from 'lucide-react';

interface TickerItem {
  id: string;
  label: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  alert?: boolean;
}

interface LiveTickerProps {
  data: any[];
}

export default function LiveTicker({ data }: LiveTickerProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Calculate ticker items from data
  const getTickerItems = (): TickerItem[] => {
    if (!data || data.length < 2) return [];

    const latest = data[0];
    const previous = data[1];

    const items: TickerItem[] = [];

    // CZCE-ICE Spread (Priority #1 from Harry)
    if (latest['CZCE - ICE'] != null) {
      const current = parseFloat(latest['CZCE - ICE']);
      const prev = parseFloat(previous['CZCE - ICE']);
      const change = prev ? ((current - prev) / Math.abs(prev)) * 100 : 0;
      items.push({
        id: 'czce-ice',
        label: 'CZCE-ICE',
        value: current.toFixed(2) + '¢',
        change: change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
        alert: Math.abs(change) > 5
      });
    }

    // AWP-ICE Spread (Priority #2)
    if (latest['AWP - ICE'] != null) {
      const current = parseFloat(latest['AWP - ICE']);
      const prev = parseFloat(previous['AWP - ICE']);
      const change = prev ? ((current - prev) / Math.abs(prev)) * 100 : 0;
      items.push({
        id: 'awp-ice',
        label: 'AWP-ICE',
        value: current.toFixed(2) + '¢',
        change: change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
      });
    }

    // MCX-ICE Spread (Priority #3)
    if (latest['MCX - ICE'] != null) {
      const current = parseFloat(latest['MCX - ICE']);
      const prev = parseFloat(previous['MCX - ICE']);
      const change = prev ? ((current - prev) / Math.abs(prev)) * 100 : 0;
      items.push({
        id: 'mcx-ice',
        label: 'MCX-ICE',
        value: current.toFixed(2) + '¢',
        change: change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
      });
    }

    // ICE Cotton No. 2 Price
    if (latest['ICE'] != null) {
      const current = parseFloat(latest['ICE']);
      const prev = parseFloat(previous['ICE']);
      const change = prev ? ((current - prev) / prev) * 100 : 0;
      items.push({
        id: 'ice-cotton',
        label: 'ICE Cotton',
        value: current.toFixed(2) + '¢',
        change: change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
      });
    }

    // Volume
    if (latest['Volume'] != null) {
      const volume = parseFloat(latest['Volume']);
      items.push({
        id: 'volume',
        label: 'Volume',
        value: (volume / 1000).toFixed(1) + 'K',
        trend: 'neutral'
      });
    }

    // Open Interest
    if (latest['Open Interest'] != null) {
      const oi = parseFloat(latest['Open Interest']);
      items.push({
        id: 'open-interest',
        label: 'Open Interest',
        value: (oi / 1000).toFixed(1) + 'K',
        trend: 'neutral'
      });
    }

    // Cotton-PSF Spread (Priority #4)
    if (latest['CZCE Cotton - PSF'] != null) {
      const current = parseFloat(latest['CZCE Cotton - PSF']);
      const prev = parseFloat(previous['CZCE Cotton - PSF']);
      const change = prev ? ((current - prev) / Math.abs(prev)) * 100 : 0;
      items.push({
        id: 'cotton-psf',
        label: 'Cotton-PSF',
        value: current.toFixed(2),
        change: change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
      });
    }

    // Cotlook A-Index
    if (latest['A-Index'] != null) {
      const current = parseFloat(latest['A-Index']);
      items.push({
        id: 'a-index',
        label: 'A-Index',
        value: current.toFixed(2) + '¢',
        trend: 'neutral'
      });
    }

    return items;
  };

  const tickerItems = getTickerItems();

  // Double the items for seamless loop
  const doubledItems = [...tickerItems, ...tickerItems];

  return (
    <div
      className="bg-[#0F1419] border-y border-[#D4AF37]/20 overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ticker content */}
      <div className="flex items-center py-2 px-4">
        <div className="flex items-center gap-2 mr-6 flex-shrink-0">
          <Activity size={16} className="text-[#D4AF37]" />
          <span className="text-white/70 text-xs font-semibold uppercase tracking-wide">
            Live Market Data
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden">
          <div
            className={`flex gap-8 ${isPaused ? '' : 'animate-scroll'}`}
            style={{
              width: 'max-content'
            }}
          >
            {doubledItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center gap-2 whitespace-nowrap"
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
                  <div className={`flex items-center gap-0.5 ${
                    item.trend === 'up' ? 'text-green-400' :
                    item.trend === 'down' ? 'text-red-400' :
                    'text-white/50'
                  }`}>
                    {item.trend === 'up' && <TrendingUp size={12} />}
                    {item.trend === 'down' && <TrendingDown size={12} />}
                    <span className="text-xs font-semibold">
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
                    </span>
                  </div>
                )}

                {/* Separator */}
                <span className="text-white/20 text-lg mx-2">|</span>
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

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
