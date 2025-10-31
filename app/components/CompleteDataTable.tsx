'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, TrendingUp, TrendingDown } from 'lucide-react';

interface CompleteDataTableProps {
  data: any[];
}

type TabCategory = 'prices' | 'spreads' | 'structure' | 'volatility' | 'currency' | 'products';

export default function CompleteDataTable({ data }: CompleteDataTableProps) {
  const [activeTab, setActiveTab] = useState<TabCategory>('prices');
  const [sortKey, setSortKey] = useState<string>('Date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [rowsToShow, setRowsToShow] = useState(100);
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Column categories
  const columnCategories = {
    prices: {
      label: 'Prices',
      icon: '💵',
      columns: [
        { key: 'Date', label: 'Date' },
        { key: 'ICE', label: 'ICE Cotton No. 2 (¢/lb)' },
        { key: 'CZCE cotton usc/lb', label: 'CZCE Cotton (¢/lb)' },
        { key: 'MCX usc/lb', label: 'MCX Cotton (¢/lb)' },
        { key: 'AWP', label: 'Adjusted World Price' },
        { key: 'A-Index', label: 'Cotlook A-Index' },
        { key: 'CEPEA', label: 'CEPEA Brazil' },
        { key: 'CC-Index usc/lb', label: 'CC-Index (¢/lb)' },
      ]
    },
    spreads: {
      label: 'Spreads',
      icon: '📊',
      columns: [
        { key: 'Column_0', label: 'Date' },
        { key: 'CZCE - ICE', label: 'CZCE-ICE (Priority #1)' },
        { key: 'AWP - ICE', label: 'AWP-ICE (Priority #2)' },
        { key: 'MCX - ICE', label: 'MCX-ICE (Priority #3)' },
        { key: 'CZCE Cotton - PSF', label: 'Cotton-PSF (Priority #4)' },
        { key: 'CZCE - MCX', label: 'CZCE-MCX' },
        { key: 'CEPEA-ICE', label: 'CEPEA-ICE' },
        { key: 'PSF-PTA', label: 'PSF-PTA' },
        { key: 'ICE - PSF', label: 'ICE-PSF' },
        { key: 'A-Ind basis', label: 'A-Index Basis' },
        { key: 'CC - A', label: 'CC vs A-Index' },
        { key: 'CC basis CZCE', label: 'CC Basis CZCE' },
        { key: 'Cotlook - CEPEA', label: 'Cotlook-CEPEA' },
        { key: 'AWP - ICE Hi', label: 'AWP-ICE High' },
        { key: 'AWP - ICE Lo', label: 'AWP-ICE Low' },
      ]
    },
    structure: {
      label: 'Market Structure',
      icon: '🏗️',
      columns: [
        { key: 'Column_0', label: 'Date' },
        { key: 'Volume', label: 'Volume' },
        { key: 'O/I', label: 'Open Interest' },
        { key: 'Cert', label: 'Certified Stocks' },
        { key: 'Hi', label: 'Daily High' },
        { key: 'Lo', label: 'Daily Low' },
        { key: 'Spread', label: 'Hi-Lo Spread' },
        { key: 'EFP', label: 'Exchange for Physical' },
        { key: 'EFS', label: 'Exchange for Swap' },
        { key: 'EFP&S', label: 'EFP & EFS Combined' },
      ]
    },
    volatility: {
      label: 'Volatility & Ranges',
      icon: '📈',
      columns: [
        { key: 'Column_0', label: 'Date' },
        { key: 'Daily range', label: 'Daily Range' },
        { key: 'Five day range', label: '5-Day Range' },
        { key: '3 month range', label: '3-Month Range' },
        { key: '6 month range', label: '6-Month Range' },
        { key: 'Week move', label: 'Weekly Movement' },
      ]
    },
    currency: {
      label: 'Currency & FX',
      icon: '💱',
      columns: [
        { key: 'Column_0', label: 'Date' },
        { key: 'CNY', label: 'Chinese Yuan (CNY)' },
        { key: 'INR', label: 'Indian Rupee (INR)' },
        { key: 'CZCE cotton', label: 'CZCE Cotton (CNY)' },
        { key: 'MCX', label: 'MCX Cotton (INR)' },
      ]
    },
    products: {
      label: 'Related Products',
      icon: '🧵',
      columns: [
        { key: 'Column_0', label: 'Date' },
        { key: 'CZCE yarn usc/lb', label: 'CZCE Yarn (¢/lb)' },
        { key: 'CZCE PSF usc/lb', label: 'CZCE PSF (¢/lb)' },
        { key: 'CZCE PTA usc/lb', label: 'CZCE PTA (¢/lb)' },
        { key: 'CZCE cotton- yarn', label: 'Cotton-Yarn Spread' },
        { key: 'CZCE cotton / PTA', label: 'Cotton/PTA Ratio' },
        { key: 'MY', label: 'Marketing Year' },
      ]
    },
  };

  const sortedData = useMemo(() => {
    let filtered = [...data];

    // Apply date range filter if enabled
    if (showDateRange && (startDate || endDate)) {
      filtered = filtered.filter(row => {
        const rowDate = new Date(row['Date']);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          return rowDate >= start && rowDate <= end;
        } else if (start) {
          return rowDate >= start;
        } else if (end) {
          return rowDate <= end;
        }
        return true;
      });
    }

    // Limit rows if not showing all
    if (!showDateRange) {
      filtered = filtered.slice(0, rowsToShow);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      // Handle dates
      if (sortKey === 'Column_0') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [data, sortKey, sortDirection, rowsToShow, showDateRange, startDate, endDate]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const exportToCSV = () => {
    const category = columnCategories[activeTab];
    const headers = category.columns.map(col => col.label);
    const rows = sortedData.map(row =>
      category.columns.map(col => {
        const value = row[col.key];
        if (col.key === 'Date') {
          return new Date(value).toLocaleDateString('en-US');
        }
        return value != null ? value : 'N/A';
      })
    );

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lcb-${activeTab}-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const currentCategory = columnCategories[activeTab];

  // Get min/max dates from data for input constraints
  const minDate = data.length > 0 ? data[data.length - 1]['Date'] : '2005-01-01';
  const maxDate = data.length > 0 ? data[0]['Date'] : new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden">
      {/* Header with Tabs */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#1A2332]/95 to-[#2C3E50]/95 backdrop-blur-xl">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h3 className="text-2xl font-bold text-[#D4AF37]">Complete Market Data</h3>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Date Range Toggle */}
              <button
                onClick={() => setShowDateRange(!showDateRange)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all shadow-lg ${
                  showDateRange
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                📅 {showDateRange ? 'Custom Range' : 'View Range'}
              </button>

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-gradient-to-r from-[#2C7A7B] to-[#3B9B9B] text-white rounded-lg font-semibold text-sm flex items-center gap-2 hover:from-[#3B9B9B] hover:to-[#2C7A7B] transition-all shadow-lg"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Date Range Selector */}
          {showDateRange && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-white/70 text-sm font-semibold">From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={minDate}
                    max={maxDate}
                    className="px-3 py-2 bg-[#0F1419]/50 border border-white/20 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-white/70 text-sm font-semibold">To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={minDate}
                    max={maxDate}
                    className="px-3 py-2 bg-[#0F1419]/50 border border-white/20 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-semibold transition-all"
                >
                  Clear
                </button>
                <div className="text-white/50 text-sm">
                  <span className="font-semibold">Available:</span> {data.length > 0 ? new Date(data[data.length - 1]['Date']).getFullYear() : '?'} - {data.length > 0 ? new Date(data[0]['Date']).getFullYear() : '?'}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(Object.keys(columnCategories) as TabCategory[]).map((tab) => {
              const category = columnCategories[tab];
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSortKey('Column_0');
                  }}
                  className={`px-5 py-3 rounded-t-xl font-semibold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeTab === tab
                      ? 'bg-white/10 text-[#D4AF37] border-t-2 border-x-2 border-[#D4AF37] shadow-lg'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.label}
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {category.columns.length - 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0F1419]/50 backdrop-blur-sm sticky top-0 z-10">
            <tr className="border-b border-white/10">
              {currentCategory.columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="p-4 text-left text-white/70 font-semibold cursor-pointer hover:text-[#D4AF37] transition-colors whitespace-nowrap"
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
            {sortedData.map((row, rowIndex) => {
              const prevRow = rowIndex > 0 ? sortedData[rowIndex - 1] : null;

              return (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rowIndex * 0.01 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  {currentCategory.columns.map((col) => {
                    const value = row[col.key];
                    const prevValue = prevRow ? prevRow[col.key] : null;
                    const isDate = col.key === 'Date';

                    let displayValue: string;
                    let change: number | null = null;
                    let textColor = 'text-white';

                    if (isDate) {
                      displayValue = new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                    } else if (value != null && !isNaN(parseFloat(value))) {
                      const numValue = parseFloat(value);
                      displayValue = numValue.toFixed(2);

                      // Calculate change
                      if (prevValue != null && !isNaN(parseFloat(prevValue))) {
                        const prevNum = parseFloat(prevValue);
                        if (prevNum !== 0) {
                          change = ((numValue - prevNum) / prevNum) * 100;

                          if (col.key.includes('Spread') || col.key.includes('-')) {
                            textColor = change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-white';
                          }
                        }
                      }
                    } else {
                      displayValue = 'N/A';
                      textColor = 'text-white/40';
                    }

                    return (
                      <td key={col.key} className={`p-4 ${textColor}`}>
                        <div className="flex items-center gap-2">
                          <span>{displayValue}</span>
                          {change !== null && Math.abs(change) > 0.1 && (
                            <span className={`text-xs flex items-center gap-0.5 ${
                              change > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                              {Math.abs(change).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="border-t border-white/10 p-4 bg-[#0F1419]/30 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-xs">
              Showing {sortedData.length} of {data.length} trading days
            </span>
            <span className="text-white/60 text-xs">
              Category: {currentCategory.label} • {currentCategory.columns.length - 1} columns
            </span>
          </div>

          {/* Load More Button */}
          {!showDateRange && sortedData.length < data.length && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRowsToShow(prev => prev + 100)}
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332] rounded-lg font-semibold text-sm hover:from-[#F4C430] hover:to-[#D4AF37] transition-all shadow-lg"
              >
                Load 100 More
              </button>
              <button
                onClick={() => setRowsToShow(data.length)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-sm transition-all"
              >
                Load All ({data.length - rowsToShow} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
