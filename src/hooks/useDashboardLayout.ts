import { useState, useEffect } from "react";

export type WidgetSize = "small" | "medium" | "large";

export interface WidgetConfig {
  id: string;
  label: string;
  visible: boolean;
  size: WidgetSize;
  order: number;
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
  isDragEnabled: boolean;
}

export const useDashboardLayout = (
  storageKey: string,
  defaultWidgets: WidgetConfig[]
) => {
  const DEFAULT_LAYOUT: DashboardLayout = {
    widgets: defaultWidgets,
    isDragEnabled: false,
  };

  const [layout, setLayout] = useState<DashboardLayout>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate that the parsed data has the expected structure
        if (parsed.widgets && Array.isArray(parsed.widgets)) {
          // Merge saved layout with default widgets to handle new widgets
          const savedWidgetIds = new Set(parsed.widgets.map((w: WidgetConfig) => w.id));
          const newWidgets = defaultWidgets.filter(w => !savedWidgetIds.has(w.id));
          
          return {
            widgets: [...parsed.widgets, ...newWidgets],
            isDragEnabled: parsed.isDragEnabled ?? false,
          };
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard layout:', error);
    }
    return DEFAULT_LAYOUT;
  });

  // Save to localStorage whenever layout changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(layout));
    } catch (error) {
      console.error('Failed to save dashboard layout:', error);
    }
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
    setLayout(DEFAULT_LAYOUT);
    localStorage.removeItem(storageKey);
  };

  const toggleDragEnabled = () => {
    setLayout((prev) => ({
      ...prev,
      isDragEnabled: !prev.isDragEnabled,
    }));
  };

  const getWidgetConfig = (id: string) => {
    return layout.widgets.find((w) => w.id === id);
  };

  const getSortedWidgets = () => {
    return [...layout.widgets].sort((a, b) => a.order - b.order);
  };

  const isWidgetVisible = (id: string) => {
    return getWidgetConfig(id)?.visible ?? true;
  };

  return {
    layout,
    widgets: layout.widgets,
    isDragEnabled: layout.isDragEnabled,
    updateWidget,
    toggleVisibility,
    setSize,
    reorderWidgets,
    resetLayout,
    toggleDragEnabled,
    getWidgetConfig,
    getSortedWidgets,
    isWidgetVisible,
  };
};
