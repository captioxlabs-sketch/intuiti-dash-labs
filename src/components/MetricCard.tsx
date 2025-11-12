import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const MetricCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  onClick,
  isSelected = false,
}: MetricCardProps) => {
  const glowClass = changeType === "positive" ? "hover:glow-neon-green" :
                   changeType === "negative" ? "hover:glow-neon-pink" :
                   "hover:glow-primary";

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-lg animate-fade-in hover:scale-105",
        glowClass,
        onClick && "cursor-pointer active:scale-95",
        isSelected && "ring-2 ring-primary shadow-lg scale-105 bg-primary/5 glow-primary"
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
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {change && (
          <p
            className={cn(
              "text-sm mt-1 font-medium",
              changeType === "positive" && "text-neon-green",
              changeType === "negative" && "text-neon-pink",
              changeType === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
