import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";

export interface ComparisonData<T> {
  current: T;
  comparison: T;
  delta: {
    value: number;
    percentage: number;
    isPositive: boolean;
  };
}

interface UseComparisonModeOptions {
  initialEnabled?: boolean;
}

export const useComparisonMode = (
  options: UseComparisonModeOptions = {}
) => {
  const { initialEnabled = false } = options;
  
  const [isComparisonMode, setIsComparisonMode] = useState(initialEnabled);
  const [primaryDateRange, setPrimaryDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
  const [comparisonDateRange, setComparisonDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 11, 31),
  });

  const toggleComparisonMode = () => {
    setIsComparisonMode((prev) => !prev);
  };

  const calculateDelta = <T extends number>(current: T, comparison: T): ComparisonData<T>["delta"] => {
    const delta = current - comparison;
    const percentage = comparison !== 0 ? ((delta / comparison) * 100) : 0;
    
    return {
      value: delta,
      percentage: Math.round(percentage * 10) / 10,
      isPositive: delta > 0,
    };
  };

  const createComparisonData = <T extends number>(
    current: T,
    comparison: T
  ): ComparisonData<T> => {
    return {
      current,
      comparison,
      delta: calculateDelta(current, comparison),
    };
  };

  return {
    isComparisonMode,
    toggleComparisonMode,
    primaryDateRange,
    setPrimaryDateRange,
    comparisonDateRange,
    setComparisonDateRange,
    calculateDelta,
    createComparisonData,
  };
};
