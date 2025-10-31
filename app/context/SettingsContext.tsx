'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserSettings {
  theme: 'dark' | 'light';
  notifications: boolean;
  defaultComparisonMode: 'latest' | 'week' | 'month' | 'year';
  defaultTimeRange: '7d' | '30d' | '90d' | '1y' | 'all';
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
  showVolatilityAlerts: boolean;
  compactMode: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  notifications: true,
  defaultComparisonMode: 'latest',
  defaultTimeRange: '30d',
  autoRefresh: false,
  refreshInterval: 5,
  showVolatilityAlerts: true,
  compactMode: false,
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setMounted(true);
    const savedSettings = localStorage.getItem('lcb-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const root = document.documentElement;

    if (settings.theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    }

    // Apply compact mode
    if (settings.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  }, [settings.theme, settings.compactMode, mounted]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('lcb-settings', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lcb-settings', JSON.stringify(DEFAULT_SETTINGS));
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
