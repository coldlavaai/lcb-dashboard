import { ComparisonMode } from '../components/ComparisonSelector';

export function getComparisonDataPoint(
  data: any[],
  currentIndex: number,
  mode: ComparisonMode
): { compareIndex: number; compareDate: string | null } {
  if (!data || data.length === 0) {
    return { compareIndex: -1, compareDate: null };
  }

  const currentDate = new Date(data[currentIndex]?.Date);

  switch (mode) {
    case 'latest':
      // Compare to previous data point
      const prevIndex = currentIndex + 1;
      if (prevIndex >= data.length) {
        return { compareIndex: -1, compareDate: null };
      }
      return {
        compareIndex: prevIndex,
        compareDate: data[prevIndex]?.Date || null
      };

    case 'week':
      // Find same day last week (7 days ago)
      return findClosestDateMatch(data, currentDate, 7, currentIndex);

    case 'month':
      // Find same day last month (30 days ago)
      return findClosestDateMatch(data, currentDate, 30, currentIndex);

    case 'year':
      // Find same day last year (365 days ago)
      return findClosestDateMatch(data, currentDate, 365, currentIndex);

    case 'decade':
      // Find same day 10 years ago (3650 days ago)
      return findClosestDateMatch(data, currentDate, 3650, currentIndex);

    default:
      return { compareIndex: currentIndex + 1, compareDate: data[currentIndex + 1]?.Date || null };
  }
}

function findClosestDateMatch(
  data: any[],
  targetDate: Date,
  daysAgo: number,
  startIndex: number
): { compareIndex: number; compareDate: string | null } {
  const comparisonDate = new Date(targetDate);
  comparisonDate.setDate(comparisonDate.getDate() - daysAgo);

  let closestIndex = -1;
  let smallestDiff = Infinity;

  // Search through data starting from startIndex + 1 to avoid comparing with itself
  for (let i = startIndex + 1; i < data.length; i++) {
    const dataDate = new Date(data[i]?.Date);
    const diff = Math.abs(dataDate.getTime() - comparisonDate.getTime());

    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestIndex = i;
    }

    // If we've passed the target date by more than 7 days, stop searching
    if (dataDate < comparisonDate && diff > 7 * 24 * 60 * 60 * 1000) {
      break;
    }
  }

  return {
    compareIndex: closestIndex,
    compareDate: closestIndex >= 0 ? data[closestIndex]?.Date : null
  };
}

export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0 || isNaN(previous) || isNaN(current)) return 0;
  return ((current - previous) / previous) * 100;
}

export function formatComparisonLabel(
  currentDate: string | null,
  compareDate: string | null,
  mode: ComparisonMode
): string {
  if (!currentDate || !compareDate) {
    return 'Change';
  }

  const currentFormatted = new Date(currentDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  const compareFormatted = new Date(compareDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: mode === 'year' || mode === 'decade' ? 'numeric' : undefined
  });

  return `${compareFormatted} → ${currentFormatted}`;
}
