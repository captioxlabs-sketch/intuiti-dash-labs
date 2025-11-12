import { StatusIndicator, StatusDot } from "./StatusIndicator";
import { cn } from "@/lib/utils";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  title?: string;
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;
  showStatus?: boolean;
  statusThresholds?: {
    critical: number;
    warning: number;
    success: number;
  };
  accentColor?: "blue" | "cyan" | "green" | "pink" | "purple" | "yellow";
}

export const ChartTooltip = ({
  active,
  payload,
  label,
  title,
  valueFormatter = (v) => v.toLocaleString(),
  labelFormatter = (l) => l,
  showStatus = false,
  statusThresholds = { critical: 80, warning: 50, success: 0 },
  accentColor = "cyan",
}: ChartTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const getStatusFromValue = (value: number): "critical" | "warning" | "success" | "info" => {
    if (value >= statusThresholds.critical) return "critical";
    if (value >= statusThresholds.warning) return "warning";
    if (value >= statusThresholds.success) return "success";
    return "info";
  };

  const borderColorClass = {
    blue: "border-neon-blue",
    cyan: "border-neon-cyan",
    green: "border-neon-green",
    pink: "border-neon-pink",
    purple: "border-neon-purple",
    yellow: "border-neon-yellow",
  }[accentColor];

  const glowClass = {
    blue: "glow-neon-blue",
    cyan: "glow-neon-cyan",
    green: "glow-neon-green",
    pink: "glow-neon-pink",
    purple: "glow-neon-purple",
    yellow: "glow-neon-yellow",
  }[accentColor];

  return (
    <div
      className={cn(
        "rounded-lg border-2 bg-card/95 backdrop-blur-sm p-3 shadow-lg transition-all",
        borderColorClass,
        glowClass
      )}
    >
      {/* Header */}
      {(title || label) && (
        <div className="mb-2 pb-2 border-b border-border">
          {title && (
            <div className="font-semibold text-sm text-foreground mb-1">{title}</div>
          )}
          {label && (
            <div className="text-xs text-muted-foreground">
              {labelFormatter(label)}
            </div>
          )}
        </div>
      )}

      {/* Values */}
      <div className="space-y-2">
        {payload.map((entry, index) => {
          const value = typeof entry.value === 'number' ? entry.value : 0;
          const status = showStatus ? getStatusFromValue(value) : undefined;

          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {showStatus && status && (
                  <StatusDot status={status} size="sm" />
                )}
                {entry.color && !showStatus && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                )}
                <span className="text-sm font-medium text-foreground">
                  {entry.name || entry.dataKey}
                </span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {valueFormatter(value)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      {payload[0]?.payload && (
        <div className="mt-2 pt-2 border-t border-border">
          {Object.entries(payload[0].payload)
            .filter(([key]) => !['name', 'value', 'color', ...payload.map(p => p.dataKey)].includes(key))
            .slice(0, 2)
            .map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-foreground font-medium">
                  {String(value)}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

interface SimpleTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  accentColor?: "blue" | "cyan" | "green" | "pink" | "purple" | "yellow";
}

export const SimpleTooltip = ({
  active,
  payload,
  label,
  accentColor = "cyan",
}: SimpleTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const borderColorClass = {
    blue: "border-neon-blue/50",
    cyan: "border-neon-cyan/50",
    green: "border-neon-green/50",
    pink: "border-neon-pink/50",
    purple: "border-neon-purple/50",
    yellow: "border-neon-yellow/50",
  }[accentColor];

  const glowClass = {
    blue: "hover:glow-neon-blue",
    cyan: "hover:glow-neon-cyan",
    green: "hover:glow-neon-green",
    pink: "hover:glow-neon-pink",
    purple: "hover:glow-neon-purple",
    yellow: "hover:glow-neon-yellow",
  }[accentColor];

  return (
    <div
      className={cn(
        "rounded-md border bg-card/98 backdrop-blur-sm px-3 py-2 shadow-md text-sm transition-all",
        borderColorClass,
        glowClass
      )}
    >
      {label && (
        <div className="font-semibold text-foreground mb-1">{label}</div>
      )}
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          {entry.color && (
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
          )}
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-bold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};
