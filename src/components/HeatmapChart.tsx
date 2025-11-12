import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface HeatmapDataPoint {
  day: string;
  hour: number;
  value: number;
  severity?: "low" | "medium" | "high" | "critical";
}

interface HeatmapChartProps {
  data: HeatmapDataPoint[];
  title: string;
  description?: string;
  colorScale?: {
    low: string;
    medium: string;
    high: string;
    critical: string;
  };
  onCellClick?: (data: HeatmapDataPoint) => void;
}

const defaultColorScale = {
  low: "hsl(var(--accent))",
  medium: "hsl(var(--primary))",
  high: "hsl(48, 96%, 53%)",
  critical: "hsl(var(--destructive))",
};

export const HeatmapChart = ({
  data,
  title,
  description,
  colorScale = defaultColorScale,
  onCellClick,
}: HeatmapChartProps) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Find min and max values for scaling
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const getDataPoint = (day: string, hour: number): HeatmapDataPoint | undefined => {
    return data.find(d => d.day === day && d.hour === hour);
  };

  const getIntensity = (value: number): number => {
    if (maxValue === minValue) return 0.5;
    return (value - minValue) / (maxValue - minValue);
  };

  const getCellColor = (dataPoint: HeatmapDataPoint | undefined): string => {
    if (!dataPoint) return "hsl(var(--muted))";
    
    const intensity = getIntensity(dataPoint.value);
    
    // Determine severity based on intensity
    if (intensity >= 0.75) {
      return colorScale.critical;
    } else if (intensity >= 0.5) {
      return colorScale.high;
    } else if (intensity >= 0.25) {
      return colorScale.medium;
    } else {
      return colorScale.low;
    }
  };

  const getCellOpacity = (dataPoint: HeatmapDataPoint | undefined): number => {
    if (!dataPoint) return 0.1;
    const intensity = getIntensity(dataPoint.value);
    return 0.3 + (intensity * 0.7); // Range from 0.3 to 1.0
  };

  const formatHour = (hour: number): string => {
    if (hour === 0) return "12AM";
    if (hour < 12) return `${hour}AM`;
    if (hour === 12) return "12PM";
    return `${hour - 12}PM`;
  };

  return (
    <Card className="animate-fade-in hover-scale transition-all">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center justify-end gap-4 text-xs">
            <span className="text-muted-foreground">Event Volume:</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Low</span>
              <div className="flex gap-1">
                {[0.3, 0.5, 0.7, 1.0].map((opacity, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor: colorScale.medium,
                      opacity,
                    }}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">High</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <TooltipProvider>
                <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${hours.length}, 1fr)` }}>
                  {/* Header row with hours */}
                  <div className="text-xs font-medium text-muted-foreground p-2"></div>
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="text-xs font-medium text-muted-foreground text-center p-1"
                    >
                      {hour % 3 === 0 ? formatHour(hour) : ""}
                    </div>
                  ))}

                  {/* Data rows */}
                  {days.map((day) => (
                    <>
                      <div
                        key={`${day}-label`}
                        className="text-xs font-medium text-muted-foreground flex items-center p-2"
                      >
                        {day}
                      </div>
                      {hours.map((hour) => {
                        const dataPoint = getDataPoint(day, hour);
                        return (
                          <Tooltip key={`${day}-${hour}`}>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "aspect-square rounded transition-all cursor-pointer hover:ring-2 hover:ring-primary hover:scale-110",
                                  dataPoint && "hover:shadow-lg"
                                )}
                                style={{
                                  backgroundColor: getCellColor(dataPoint),
                                  opacity: getCellOpacity(dataPoint),
                                }}
                                onClick={() => dataPoint && onCellClick?.(dataPoint)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <div className="font-semibold">
                                  {day} at {formatHour(hour)}
                                </div>
                                <div className="text-muted-foreground">
                                  Events: {dataPoint?.value || 0}
                                </div>
                                {dataPoint?.severity && (
                                  <div className="text-muted-foreground capitalize">
                                    Severity: {dataPoint.severity}
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{maxValue}</div>
              <div className="text-xs text-muted-foreground">Peak Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {Math.round(values.reduce((a, b) => a + b, 0) / values.length)}
              </div>
              <div className="text-xs text-muted-foreground">Avg Events/Hour</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {values.reduce((a, b) => a + b, 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Events</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
