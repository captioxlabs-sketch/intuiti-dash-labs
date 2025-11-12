import { DateRangePicker } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
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
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-card border border-border rounded-lg mb-6 animate-fade-in">
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

      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="ml-auto"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      )}
    </div>
  );
};
