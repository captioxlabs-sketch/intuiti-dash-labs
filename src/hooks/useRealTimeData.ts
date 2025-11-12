import { useState, useEffect, useCallback } from "react";

export interface UseRealTimeDataOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

/**
 * Hook for simulating real-time data updates
 * Cycles through data variations to create dynamic dashboard effect
 */
export const useRealTimeData = <T,>(
  initialData: T,
  updateFn: (data: T) => T,
  options: UseRealTimeDataOptions = {}
) => {
  const { refreshInterval = 5000, enabled = true } = options;
  const [data, setData] = useState<T>(initialData);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(enabled);

  const refresh = useCallback(() => {
    setData(prev => updateFn(prev));
    setLastUpdate(new Date());
  }, [updateFn]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isLive, refreshInterval, refresh]);

  const toggleLive = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  return {
    data,
    lastUpdate,
    isLive,
    toggleLive,
    refresh,
  };
};
