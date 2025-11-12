import { useState, useEffect } from "react";

export type WidgetSize = "small" | "medium" | "large";

export interface WidgetConfig {
  id: string;
  visible: boolean;
  size: WidgetSize;
  order: number;
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "users", visible: true, size: "medium", order: 0 },
  { id: "revenue", visible: true, size: "medium", order: 1 },
  { id: "growth", visible: true, size: "medium", order: 2 },
  { id: "sessions", visible: true, size: "medium", order: 3 },
];

export const useDashboardLayout = (storageKey: string = "dashboard-layout") => {
  const [layout, setLayout] = useState<DashboardLayout>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { widgets: DEFAULT_WIDGETS };
      }
    }
    return { widgets: DEFAULT_WIDGETS };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(layout));
  }, [layout, storageKey]);

  const updateWidget = (id: string, updates: Partial<WidgetConfig>) => {
    setLayout((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    }));
  };

  const toggleVisibility = (id: string) => {
    setLayout((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, visible: !w.visible } : w
      ),
    }));
  };

  const setSize = (id: string, size: WidgetSize) => {
    updateWidget(id, { size });
  };

  const reorderWidgets = (fromIndex: number, toIndex: number) => {
    setLayout((prev) => {
      const newWidgets = [...prev.widgets];
      const [moved] = newWidgets.splice(fromIndex, 1);
      newWidgets.splice(toIndex, 0, moved);
      return {
        ...prev,
        widgets: newWidgets.map((w, idx) => ({ ...w, order: idx })),
      };
    });
  };

  const resetLayout = () => {
    setLayout({ widgets: DEFAULT_WIDGETS });
  };

  const getWidgetConfig = (id: string) => {
    return layout.widgets.find((w) => w.id === id);
  };

  const getSortedWidgets = () => {
    return [...layout.widgets].sort((a, b) => a.order - b.order);
  };

  return {
    layout,
    updateWidget,
    toggleVisibility,
    setSize,
    reorderWidgets,
    resetLayout,
    getWidgetConfig,
    getSortedWidgets,
  };
};
