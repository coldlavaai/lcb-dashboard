/**
 * Technical indicator calculations for chart overlays
 */

export interface DataPoint {
  date: string;
  value: number;
}

/**
 * Calculate Simple Moving Average (SMA)
 */
export function calculateSMA(data: DataPoint[], period: number): DataPoint[] {
  if (data.length < period) return [];

  const result: DataPoint[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, point) => acc + point.value, 0);
    const average = sum / period;

    result.push({
      date: data[i].date,
      value: average,
    });
  }

  return result;
}

/**
 * Calculate Bollinger Bands
 */
export interface BollingerBands {
  date: string;
  middle: number;
  upper: number;
  lower: number;
}

export function calculateBollingerBands(
  data: DataPoint[],
  period: number = 20,
  stdDevMultiplier: number = 2
): BollingerBands[] {
  if (data.length < period) return [];

  const result: BollingerBands[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);

    // Calculate middle band (SMA)
    const sum = slice.reduce((acc, point) => acc + point.value, 0);
    const middle = sum / period;

    // Calculate standard deviation
    const squaredDiffs = slice.map((point) => Math.pow(point.value - middle, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / period;
    const stdDev = Math.sqrt(variance);

    // Calculate upper and lower bands
    const upper = middle + stdDev * stdDevMultiplier;
    const lower = middle - stdDev * stdDevMultiplier;

    result.push({
      date: data[i].date,
      middle,
      upper,
      lower,
    });
  }

  return result;
}

/**
 * Calculate Relative Strength Index (RSI)
 */
export function calculateRSI(data: DataPoint[], period: number = 14): DataPoint[] {
  if (data.length < period + 1) return [];

  const result: DataPoint[] = [];
  let avgGain = 0;
  let avgLoss = 0;

  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = data[i].value - data[i - 1].value;
    if (change > 0) {
      avgGain += change;
    } else {
      avgLoss += Math.abs(change);
    }
  }

  avgGain /= period;
  avgLoss /= period;

  // Calculate RSI for initial period
  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  let rsi = 100 - 100 / (1 + rs);

  result.push({
    date: data[period].date,
    value: rsi,
  });

  // Calculate RSI for remaining data using smoothed averages
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].value - data[i - 1].value;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi = 100 - 100 / (1 + rs);

    result.push({
      date: data[i].date,
      value: rsi,
    });
  }

  return result;
}

/**
 * Calculate Exponential Moving Average (EMA)
 */
export function calculateEMA(data: DataPoint[], period: number): DataPoint[] {
  if (data.length < period) return [];

  const result: DataPoint[] = [];
  const multiplier = 2 / (period + 1);

  // Calculate initial SMA as first EMA value
  const firstSum = data
    .slice(0, period)
    .reduce((acc, point) => acc + point.value, 0);
  let ema = firstSum / period;

  result.push({
    date: data[period - 1].date,
    value: ema,
  });

  // Calculate EMA for remaining data
  for (let i = period; i < data.length; i++) {
    ema = (data[i].value - ema) * multiplier + ema;
    result.push({
      date: data[i].date,
      value: ema,
    });
  }

  return result;
}

/**
 * Find support and resistance levels
 */
export interface SupportResistance {
  level: number;
  type: 'support' | 'resistance';
  strength: number; // Number of times price touched this level
}

export function findSupportResistanceLevels(
  data: DataPoint[],
  tolerance: number = 0.5 // Percentage tolerance for grouping levels
): SupportResistance[] {
  if (data.length < 10) return [];

  const levels: { [key: number]: { touches: number; type: 'support' | 'resistance' } } = {};

  // Find local minima (support) and maxima (resistance)
  for (let i = 2; i < data.length - 2; i++) {
    const current = data[i].value;
    const prev2 = data[i - 2].value;
    const prev1 = data[i - 1].value;
    const next1 = data[i + 1].value;
    const next2 = data[i + 2].value;

    // Local minimum (support)
    if (
      current < prev2 &&
      current < prev1 &&
      current < next1 &&
      current < next2
    ) {
      addOrUpdateLevel(levels, current, 'support', tolerance);
    }

    // Local maximum (resistance)
    if (
      current > prev2 &&
      current > prev1 &&
      current > next1 &&
      current > next2
    ) {
      addOrUpdateLevel(levels, current, 'resistance', tolerance);
    }
  }

  // Convert to array and sort by strength
  return Object.entries(levels)
    .map(([level, data]) => ({
      level: parseFloat(level),
      type: data.type,
      strength: data.touches,
    }))
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 5); // Return top 5 most significant levels
}

function addOrUpdateLevel(
  levels: { [key: number]: { touches: number; type: 'support' | 'resistance' } },
  value: number,
  type: 'support' | 'resistance',
  tolerance: number
) {
  // Check if this level is close to an existing one
  for (const [existingLevel, data] of Object.entries(levels)) {
    const level = parseFloat(existingLevel);
    const diff = Math.abs(level - value);
    const percentDiff = (diff / level) * 100;

    if (percentDiff <= tolerance && data.type === type) {
      // Update existing level
      const avgLevel = (level * data.touches + value) / (data.touches + 1);
      delete levels[level];
      levels[avgLevel] = {
        touches: data.touches + 1,
        type,
      };
      return;
    }
  }

  // Add new level
  levels[value] = {
    touches: 1,
    type,
  };
}

/**
 * Helper function to convert raw data to DataPoint array
 */
export function convertToDataPoints(data: any[], field: string): DataPoint[] {
  return data
    .map((item) => ({
      date: item.Date || item.date,
      value: parseFloat(item[field]),
    }))
    .filter((point) => !isNaN(point.value));
}
