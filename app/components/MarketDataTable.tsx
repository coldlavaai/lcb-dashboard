'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';

interface MarketDataTableProps {
  data: any[];
}

export default function MarketDataTable({ data }: MarketDataTableProps) {
  const [sortKey, setSortKey] = useState<string>('Date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { key: 'Date', label: 'Date' },
    { key: 'ICE', label: 'ICE' },
    { key: 'CZCE - ICE', label: 'CZCE-ICE Spread' },
    { key: 'AWP - ICE', label: 'AWP-ICE Spread' },
    { key: 'MCX - ICE', label: 'MCX-ICE Spread' },
    { key: 'CZCE Cotton - PSF', label: 'Cotton-PSF' },
    { key: 'Volume', label: 'Volume' },
    { key: 'O/I', label: 'Open Interest' },
    { key: 'Daily range', label: 'Daily Range' },
  ];

  const sortedData = useMemo(() => {
    let sorted = [...data].slice(0, 100); // Show recent 100 rows

    // Sort
    sorted.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      // Handle dates
      if (sortKey === 'Date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return sorted;
  }, [data, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1A2332]/90 via-[#1A2332]/80 to-[#2C3E50]/90 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#D4AF37]">Historical Data Table</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#0F1419] border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="p-3 text-left text-white/70 font-semibold cursor-pointer hover:text-[#D4AF37] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortKey === col.key ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp size={14} className="text-[#D4AF37]" />
                      ) : (
                        <ArrowDown size={14} className="text-[#D4AF37]" />
                      )
                    ) : (
                      <ArrowUpDown size={14} className="opacity-30" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.slice(0, 30).map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.01 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                {columns.map((col) => {
                  const value = row[col.key];
                  const isDate = col.key === 'Date';
                  const displayValue = isDate
                    ? new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : value != null
                    ? parseFloat(value).toFixed(2)
                    : 'N/A';

                  // Color code spreads
                  const isSpread = col.key.includes('Spread') || col.key.includes('-');
                  const numValue = parseFloat(value);
                  const textColor =
                    isSpread && !isNaN(numValue)
                      ? numValue > 0
                        ? 'text-green-400'
                        : numValue < 0
                        ? 'text-red-400'
                        : 'text-white'
                      : 'text-white';

                  return (
                    <td key={col.key} className={`p-3 ${textColor}`}>
                      {displayValue}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
