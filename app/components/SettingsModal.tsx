'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Moon, Sun, Bell, Database, Layout, Sliders } from 'lucide-react';
import theme from '@/lib/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserSettings {
  theme: 'dark' | 'light';
  notifications: boolean;
  defaultComparisonMode: 'latest' | 'week' | 'month' | 'year';
  defaultTimeRange: '7d' | '30d' | '90d' | '1y' | 'all';
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
  showVolatilityAlerts: boolean;
  compactMode: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  notifications: true,
  defaultComparisonMode: 'latest',
  defaultTimeRange: '30d',
  autoRefresh: false,
  refreshInterval: 5,
  showVolatilityAlerts: true,
  compactMode: false,
};

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('lcb-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('lcb-settings', JSON.stringify(settings));
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-3xl max-h-[85vh] overflow-hidden"
          >
            <div className="bg-gradient-to-br from-[#1A2332] via-[#2C3E50] to-[#1A2332] rounded-2xl shadow-2xl border-2 border-[#D4AF37]/30 flex flex-col">
              {/* Header */}
              <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#D4AF37]/10 to-transparent">
                <div className="flex items-center gap-3">
                  <Settings size={24} className="text-[#D4AF37]" />
                  <h2 className="text-2xl font-bold text-white">Dashboard Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto flex-1">
                <div className="space-y-8">
                  {/* Display Section */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Layout size={20} className="text-[#D4AF37]" />
                      <h3 className="text-lg font-bold text-white">Display Preferences</h3>
                    </div>
                    <div className="space-y-4 pl-7">
                      {/* Theme Toggle */}
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                          {settings.theme === 'dark' ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-yellow-400" />}
                          <div>
                            <p className="text-white font-semibold">Theme</p>
                            <p className="text-white/60 text-sm">Choose your preferred color scheme</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateSetting('theme', 'dark')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                              settings.theme === 'dark'
                                ? 'bg-[#D4AF37] text-[#1A2332]'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            Dark
                          </button>
                          <button
                            onClick={() => updateSetting('theme', 'light')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                              settings.theme === 'light'
                                ? 'bg-[#D4AF37] text-[#1A2332]'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            Light
                          </button>
                        </div>
                      </div>

                      {/* Compact Mode */}
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <p className="text-white font-semibold">Compact Mode</p>
                          <p className="text-white/60 text-sm">Reduce spacing and padding for more data density</p>
                        </div>
                        <button
                          onClick={() => updateSetting('compactMode', !settings.compactMode)}
                          className={`relative w-14 h-7 rounded-full transition-colors ${
                            settings.compactMode ? 'bg-[#D4AF37]' : 'bg-white/20'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            settings.compactMode ? 'translate-x-7' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Data Defaults Section */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Database size={20} className="text-[#D4AF37]" />
                      <h3 className="text-lg font-bold text-white">Default Data Settings</h3>
                    </div>
                    <div className="space-y-4 pl-7">
                      {/* Default Comparison Mode */}
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-white font-semibold mb-3">Default Comparison Mode</p>
                        <div className="grid grid-cols-2 gap-2">
                          {(['latest', 'week', 'month', 'year'] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => updateSetting('defaultComparisonMode', mode)}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                settings.defaultComparisonMode === mode
                                  ? 'bg-[#D4AF37] text-[#1A2332]'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20'
                              }`}
                            >
                              {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Default Time Range */}
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-white font-semibold mb-3">Default Time Range</p>
                        <div className="grid grid-cols-3 gap-2">
                          {(['7d', '30d', '90d', '1y', 'all'] as const).map((range) => (
                            <button
                              key={range}
                              onClick={() => updateSetting('defaultTimeRange', range)}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                settings.defaultTimeRange === range
                                  ? 'bg-[#D4AF37] text-[#1A2332]'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20'
                              }`}
                            >
                              {range.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Notifications Section */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Bell size={20} className="text-[#D4AF37]" />
                      <h3 className="text-lg font-bold text-white">Notifications & Alerts</h3>
                    </div>
                    <div className="space-y-4 pl-7">
                      {/* Enable Notifications */}
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <p className="text-white font-semibold">Enable Notifications</p>
                          <p className="text-white/60 text-sm">Receive alerts for market movements</p>
                        </div>
                        <button
                          onClick={() => updateSetting('notifications', !settings.notifications)}
                          className={`relative w-14 h-7 rounded-full transition-colors ${
                            settings.notifications ? 'bg-[#D4AF37]' : 'bg-white/20'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            settings.notifications ? 'translate-x-7' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Volatility Alerts */}
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <p className="text-white font-semibold">Volatility Alerts</p>
                          <p className="text-white/60 text-sm">Get notified of significant price movements</p>
                        </div>
                        <button
                          onClick={() => updateSetting('showVolatilityAlerts', !settings.showVolatilityAlerts)}
                          className={`relative w-14 h-7 rounded-full transition-colors ${
                            settings.showVolatilityAlerts ? 'bg-[#D4AF37]' : 'bg-white/20'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            settings.showVolatilityAlerts ? 'translate-x-7' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Auto Refresh */}
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-white font-semibold">Auto Refresh Data</p>
                            <p className="text-white/60 text-sm">Automatically update dashboard data</p>
                          </div>
                          <button
                            onClick={() => updateSetting('autoRefresh', !settings.autoRefresh)}
                            className={`relative w-14 h-7 rounded-full transition-colors ${
                              settings.autoRefresh ? 'bg-[#D4AF37]' : 'bg-white/20'
                            }`}
                          >
                            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                              settings.autoRefresh ? 'translate-x-7' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                        {settings.autoRefresh && (
                          <div>
                            <label className="text-white/70 text-sm mb-2 block">Refresh Interval (minutes)</label>
                            <input
                              type="number"
                              min="1"
                              max="60"
                              value={settings.refreshInterval}
                              onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value) || 5)}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-white/10 flex items-center justify-between bg-gradient-to-r from-transparent to-[#D4AF37]/5">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all"
                >
                  Reset to Defaults
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                      hasChanges
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332] shadow-lg hover:shadow-xl'
                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }`}
                    disabled={!hasChanges}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
