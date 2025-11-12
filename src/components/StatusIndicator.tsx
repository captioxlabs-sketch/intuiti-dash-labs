import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { AlertCircle, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

export type StatusType = "critical" | "warning" | "success" | "info" | "error";

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  count?: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const statusConfig: Record<StatusType, {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  glowClass: string;
}> = {
  critical: {
    icon: XCircle,
    color: "text-neon-pink",
    bgColor: "bg-neon-pink/10",
    borderColor: "border-neon-pink/30",
    glowClass: "glow-neon-pink",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-neon-yellow",
    bgColor: "bg-neon-yellow/10",
    borderColor: "border-neon-yellow/30",
    glowClass: "glow-neon-yellow",
  },
  success: {
    icon: CheckCircle,
    color: "text-neon-green",
    bgColor: "bg-neon-green/10",
    borderColor: "border-neon-green/30",
    glowClass: "glow-neon-green",
  },
  info: {
    icon: Info,
    color: "text-neon-cyan",
    bgColor: "bg-neon-cyan/10",
    borderColor: "border-neon-cyan/30",
    glowClass: "glow-neon-cyan",
  },
  error: {
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
    glowClass: "",
  },
};

const sizeConfig = {
  sm: {
    container: "px-2 py-1 text-xs",
    icon: "h-3 w-3",
  },
  md: {
    container: "px-3 py-1.5 text-sm",
    icon: "h-4 w-4",
  },
  lg: {
    container: "px-4 py-2 text-base",
    icon: "h-5 w-5",
  },
};

export const StatusIndicator = ({
  status,
  label,
  count,
  showIcon = true,
  size = "md",
  className,
  onClick,
}: StatusIndicatorProps) => {
  const config = statusConfig[status];
  const sizeClasses = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium transition-all",
        config.bgColor,
        config.borderColor,
        config.color,
        sizeClasses.container,
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      {showIcon && <Icon className={sizeClasses.icon} />}
      {label && <span>{label}</span>}
      {count !== undefined && (
        <span className={cn("font-bold", config.color)}>
          {count}
        </span>
      )}
    </div>
  );
};

interface StatusDotProps {
  status: StatusType;
  pulse?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const dotSizeConfig = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-4 w-4",
};

export const StatusDot = ({ status, pulse = false, size = "md", className }: StatusDotProps) => {
  const config = statusConfig[status];
  const sizeClass = dotSizeConfig[size];

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <span
        className={cn(
          "rounded-full",
          sizeClass,
          config.bgColor.replace("/10", ""),
          config.glowClass,
          pulse && "animate-pulse"
        )}
      />
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            config.bgColor.replace("/10", "/50")
          )}
        />
      )}
    </div>
  );
};

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StatusBadge = ({ status, label, size = "md", className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const sizeClasses = sizeConfig[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wide transition-all",
        config.bgColor,
        config.borderColor,
        config.color,
        config.glowClass,
        sizeClasses.container,
        className
      )}
    >
      <StatusDot status={status} size={size === "sm" ? "sm" : size === "lg" ? "md" : "sm"} />
      {label}
    </span>
  );
};
