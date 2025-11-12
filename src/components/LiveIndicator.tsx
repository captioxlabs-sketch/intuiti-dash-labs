import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  isLive: boolean;
  lastUpdate?: Date;
  onToggle: () => void;
}

export const LiveIndicator = ({ isLive, lastUpdate, onToggle }: LiveIndicatorProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="gap-2"
    >
      <div className="relative">
        <Activity className={cn(
          "h-4 w-4",
          isLive && "text-accent animate-pulse"
        )} />
        {isLive && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent animate-ping" />
        )}
      </div>
      <span className="text-sm">
        {isLive ? "Live" : "Paused"}
      </span>
      {lastUpdate && (
        <Badge variant="outline" className="ml-1 font-mono text-xs">
          {formatTime(lastUpdate)}
        </Badge>
      )}
    </Button>
  );
};
