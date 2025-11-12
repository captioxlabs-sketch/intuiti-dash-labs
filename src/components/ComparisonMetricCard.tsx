import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComparisonData } from "@/hooks/useComparisonMode";

interface ComparisonMetricCardProps {
  title: string;
  data: ComparisonData<number>;
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
  isSelected?: boolean;
  format?: (value: number) => string;
}

export const ComparisonMetricCard = ({
  title,
  data,
  icon: Icon,
  iconColor = "text-primary",
  onClick,
  isSelected = false,
  format = (value) => String(value),
}: ComparisonMetricCardProps) => {
  const TrendIcon = data.delta.isPositive ? TrendingUp : TrendingDown;
  
  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-lg animate-fade-in",
        onClick && "cursor-pointer hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary shadow-lg scale-[1.02] bg-primary/5"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Current Value */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Current Period</div>
            <div className="text-2xl font-bold text-foreground">{format(data.current)}</div>
          </div>
          
          {/* Comparison Value */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Comparison Period</div>
            <div className="text-xl font-semibold text-muted-foreground/80">{format(data.comparison)}</div>
          </div>
          
          {/* Delta */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <TrendIcon className={cn(
              "h-4 w-4",
              data.delta.isPositive ? "text-accent" : "text-destructive"
            )} />
            <span className={cn(
              "text-sm font-medium",
              data.delta.isPositive ? "text-accent" : "text-destructive"
            )}>
              {data.delta.isPositive ? "+" : ""}{data.delta.percentage}%
            </span>
            <span className="text-xs text-muted-foreground">
              ({data.delta.isPositive ? "+" : ""}{format(data.delta.value)})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
