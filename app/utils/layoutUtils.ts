/**
 * Utility functions for managing dashboard layout and section ordering
 */

export interface SectionConfig {
  id: string;
  component: string;
  enabled: boolean;
  order: number;
}

export interface LayoutConfig {
  overview: SectionConfig[];
  spreads: SectionConfig[];
  markets: SectionConfig[];
  data: SectionConfig[];
}

// Default layout configuration
export const DEFAULT_LAYOUT: LayoutConfig = {
  overview: [
    { id: 'heatmap-correlation', component: 'HeatMapCorrelationRow', enabled: true, order: 0 },
    { id: 'main-chart', component: 'MainChartCommentary', enabled: true, order: 1 },
    { id: 'secondary-charts', component: 'SecondaryCharts', enabled: true, order: 2 },
    { id: 'data-table', component: 'MarketDataTable', enabled: true, order: 3 },
  ],
  spreads: [
    { id: 'spread-selector', component: 'SpreadSelector', enabled: true, order: 0 },
    { id: 'main-spread', component: 'MainSpreadAnalysis', enabled: true, order: 1 },
    { id: 'all-spreads', component: 'AllSpreadsGrid', enabled: true, order: 2 },
  ],
  markets: [
    { id: 'market-heatmap', component: 'MarketHeatMap', enabled: true, order: 0 },
    { id: 'correlation-matrix', component: 'CorrelationMatrix', enabled: true, order: 1 },
    { id: 'market-charts', component: 'MarketChartsGrid', enabled: true, order: 2 },
  ],
  data: [
    { id: 'complete-data-table', component: 'CompleteDataTable', enabled: true, order: 0 },
    { id: 'correlation-matrix-data', component: 'CorrelationMatrix', enabled: true, order: 1 },
  ],
};

/**
 * Save layout configuration to localStorage
 */
export function saveLayout(layout: LayoutConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lcb-dashboard-layout', JSON.stringify(layout));
  }
}

/**
 * Load layout configuration from localStorage
 */
export function loadLayout(): LayoutConfig {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('lcb-dashboard-layout');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved layout:', e);
      }
    }
  }
  return DEFAULT_LAYOUT;
}

/**
 * Reset layout to default
 */
export function resetLayout(): LayoutConfig {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lcb-dashboard-layout');
  }
  return DEFAULT_LAYOUT;
}

/**
 * Update section order within a view
 */
export function updateSectionOrder(
  layout: LayoutConfig,
  view: keyof LayoutConfig,
  oldIndex: number,
  newIndex: number
): LayoutConfig {
  const sections = [...layout[view]];
  const [moved] = sections.splice(oldIndex, 1);
  sections.splice(newIndex, 0, moved);

  // Update order values
  sections.forEach((section, index) => {
    section.order = index;
  });

  return {
    ...layout,
    [view]: sections,
  };
}

/**
 * Toggle section visibility
 */
export function toggleSection(
  layout: LayoutConfig,
  view: keyof LayoutConfig,
  sectionId: string
): LayoutConfig {
  const sections = layout[view].map((section) =>
    section.id === sectionId
      ? { ...section, enabled: !section.enabled }
      : section
  );

  return {
    ...layout,
    [view]: sections,
  };
}

/**
 * Get ordered and enabled sections for a view
 */
export function getActiveSections(
  layout: LayoutConfig,
  view: keyof LayoutConfig
): SectionConfig[] {
  return layout[view]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);
}
