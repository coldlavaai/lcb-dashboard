/**
 * LCB Dashboard Professional Theme System
 *
 * A comprehensive design system inspired by Bloomberg Terminal,
 * CME Group, and modern financial platforms.
 */

export const theme = {
  colors: {
    // Background layers - Deep navy-black progression
    background: {
      primary: '#0A0B0D',      // Deepest black-navy
      secondary: '#13151A',    // Card backgrounds
      tertiary: '#1C1F26',     // Elevated surfaces
      elevated: '#242832',     // Modals, popovers
      hover: '#2C303A',        // Interactive hover states
    },

    // Borders and dividers
    border: {
      subtle: 'rgba(255, 255, 255, 0.05)',
      default: 'rgba(255, 255, 255, 0.1)',
      strong: 'rgba(255, 255, 255, 0.2)',
      accent: 'rgba(212, 175, 55, 0.3)',  // Gold
      accentStrong: 'rgba(212, 175, 55, 0.5)',
    },

    // Text hierarchy
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.8)',
      tertiary: 'rgba(255, 255, 255, 0.6)',
      quaternary: 'rgba(255, 255, 255, 0.4)',
      disabled: 'rgba(255, 255, 255, 0.2)',
    },

    // Data visualization - Financial color palette
    data: {
      // Primary accent
      primary: '#F59E0B',      // Amber - main data highlight
      primaryLight: '#FBBF24',
      primaryDark: '#D97706',

      // Market indicators
      profit: '#10B981',       // True emerald green
      profitLight: '#34D399',
      profitDark: '#059669',

      loss: '#EF4444',         // True red
      lossLight: '#F87171',
      lossDark: '#DC2626',

      // Gold accent (Liverpool Cotton Brokers brand)
      gold: '#D4AF37',
      goldLight: '#F4C430',
      goldDark: '#B8941F',

      // Market-specific colors
      ice: '#4F46E5',          // Indigo - ICE futures
      czce: '#DC2626',         // Red - China cotton
      mcx: '#059669',          // Green - India cotton
      awp: '#D97706',          // Orange - AWP
      cepea: '#7C3AED',        // Purple - CEPEA
      psf: '#EC4899',          // Pink - Polyester
      pta: '#06B6D4',          // Cyan - PTA

      // Neutral data colors
      neutral: '#64748B',
      neutralLight: '#94A3B8',
      neutralDark: '#475569',
    },

    // Status and semantic colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },

    // Glass morphism overlays
    glass: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.1)',
      strong: 'rgba(255, 255, 255, 0.15)',
    },
  },

  // Typography system
  typography: {
    fonts: {
      display: 'var(--font-inter)',      // Headers and display text
      body: 'var(--font-inter)',         // Body text
      mono: 'var(--font-jetbrains)',     // Numbers and data
    },

    sizes: {
      // Display sizes (headers)
      display: {
        xl: '3rem',        // 48px
        lg: '2.5rem',      // 40px
        md: '2rem',        // 32px
        sm: '1.5rem',      // 24px
      },

      // Body text
      body: {
        xl: '1.25rem',     // 20px
        lg: '1.125rem',    // 18px
        md: '1rem',        // 16px
        sm: '0.875rem',    // 14px
        xs: '0.75rem',     // 12px
      },

      // Data and numbers (tabular)
      data: {
        xl: '2.5rem',      // 40px - hero numbers
        lg: '1.875rem',    // 30px - key metrics
        md: '1.5rem',      // 24px - chart labels
        sm: '1.125rem',    // 18px - table data
        xs: '1rem',        // 16px - small data
      },
    },

    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },

    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },

    // Font feature settings for data
    features: {
      tabular: 'font-variant-numeric: tabular-nums;',
      slashed: 'font-variant-numeric: slashed-zero;',
    },
  },

  // Spacing system (8px base)
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
  },

  // Border radius
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadow system - 4 layers
  shadows: {
    // Subtle elevation
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',

    // Card elevation
    md: '0 4px 16px 0 rgba(0, 0, 0, 0.4)',

    // Modal/popover elevation
    lg: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',

    // Maximum depth
    xl: '0 20px 60px 0 rgba(0, 0, 0, 0.6)',

    // Colored shadows for emphasis
    goldGlow: '0 8px 32px 0 rgba(212, 175, 55, 0.2)',
    amberGlow: '0 8px 32px 0 rgba(245, 158, 11, 0.2)',
    greenGlow: '0 8px 32px 0 rgba(16, 185, 129, 0.2)',
    redGlow: '0 8px 32px 0 rgba(239, 68, 68, 0.2)',

    // Inner shadows for depth
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  },

  // Animation
  animation: {
    durations: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },

    easings: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  // Breakpoints (matches Tailwind defaults)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Layout constants
  layout: {
    headerHeight: '4rem',        // 64px
    sidebarWidth: '16rem',       // 256px
    sidebarCollapsed: '4rem',    // 64px
    bottomPanelHeight: '20rem',  // 320px
    maxContentWidth: '2000px',
  },

  // Grid system
  grid: {
    columns: 12,
    gap: '1.5rem',  // 24px
  },
} as const;

// Type exports
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;

// Utility functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

export const getDataColor = (value: number, type: 'change' | 'correlation' = 'change') => {
  if (type === 'change') {
    if (value > 0) return theme.colors.data.profit;
    if (value < 0) return theme.colors.data.loss;
    return theme.colors.data.neutral;
  }

  if (type === 'correlation') {
    const abs = Math.abs(value);
    if (value > 0.7) return theme.colors.data.profit;
    if (value > 0.3) return getColorWithOpacity(theme.colors.data.profit, abs);
    if (value < -0.7) return theme.colors.data.loss;
    if (value < -0.3) return getColorWithOpacity(theme.colors.data.loss, abs);
    return getColorWithOpacity(theme.colors.data.neutral, 0.3);
  }
};

export const getMarketColor = (market: string): string => {
  const marketMap: Record<string, string> = {
    'ICE': theme.colors.data.ice,
    'CZCE': theme.colors.data.czce,
    'MCX': theme.colors.data.mcx,
    'AWP': theme.colors.data.awp,
    'CEPEA': theme.colors.data.cepea,
    'PSF': theme.colors.data.psf,
    'PTA': theme.colors.data.pta,
  };
  return marketMap[market.toUpperCase()] || theme.colors.data.primary;
};

// CSS-in-JS utility for glass morphism
export const glassMorphism = (strength: 'light' | 'medium' | 'strong' = 'medium') => ({
  background: theme.colors.glass[strength],
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${theme.colors.border.default}`,
});

export default theme;
