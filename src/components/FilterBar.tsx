import { DateRangePicker } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { SearchBar } from "./SearchBar";
import { ExportMenu } from "./ExportMenu";
import { LiveIndicator } from "./LiveIndicator";
import { WidgetCustomizer, Widget } from "./WidgetCustomizer";
import { ExportFormat } from "@/hooks/useDataExport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface FilterBarProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedMetric?: string;
  onMetricChange?: (value: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
  metrics?: { value: string; label: string }[];
  categories?: { value: string; label: string }[];
  onReset?: () => void;
  // Enhanced features
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onExport?: (format: ExportFormat) => void;
  isLive?: boolean;
  lastUpdate?: Date;
  onToggleLive?: () => void;
  isDragEnabled?: boolean;
  onToggleDrag?: () => void;
  widgets?: Widget[];
  onToggleWidgetVisibility?: (id: string) => void;
  onWidgetSizeChange?: (id: string, size: "small" | "medium" | "large") => void;
  onResetLayout?: () => void;
  storageKey?: string;
}

export const FilterBar = ({
  dateRange,
  onDateRangeChange,
  selectedMetric,
  onMetricChange,
  selectedCategory,
  onCategoryChange,
  metrics,
  categories,
  onReset,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onExport,
  isLive,
  lastUpdate,
  onToggleLive,
  isDragEnabled,
  onToggleDrag,
  widgets,
  onToggleWidgetVisibility,
  onWidgetSizeChange,
  onResetLayout,
  storageKey,
}: FilterBarProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap gap-4 items-center p-4 bg-card border border-border rounded-lg">
        <DateRangePicker date={dateRange} onDateChange={onDateRangeChange} />
        
        {metrics && onMetricChange && (
          <Select value={selectedMetric} onValueChange={onMetricChange}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {metrics.map((metric) => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {categories && onCategoryChange && (
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {searchValue !== undefined && onSearchChange && (
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            className="flex-1 min-w-[200px]"
          />
        )}

        <div className="ml-auto flex items-center gap-2">
          {isLive !== undefined && onToggleLive && (
            <LiveIndicator
              isLive={isLive}
              lastUpdate={lastUpdate}
              onToggle={onToggleLive}
            />
          )}
          
          {onExport && <ExportMenu onExport={onExport} />}
          
          {widgets && onToggleWidgetVisibility && onWidgetSizeChange && (
            <WidgetCustomizer
              widgets={widgets}
              onToggleVisibility={onToggleWidgetVisibility}
              onSizeChange={onWidgetSizeChange}
              onReset={onResetLayout}
              isDragEnabled={isDragEnabled}
              onToggleDrag={onToggleDrag}
              storageKey={storageKey}
            />
          )}
          
          {onReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
