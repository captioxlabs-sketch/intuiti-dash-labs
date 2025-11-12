import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { useDashboardLayout } from "@/hooks/useDashboardLayout";
import { DateRange } from "react-day-picker";
import { Shield, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { addDays, subDays } from "date-fns";
import { cn } from "@/lib/utils";

const metrics = [
  { value: "all", label: "All Metrics" },
  { value: "threats", label: "Threats Only" },
  { value: "blocked", label: "Blocked Only" },
  { value: "scanned", label: "Scanned Only" },
];

const DEFAULT_OVERVIEW_WIDGETS = [
  { id: "threats", label: "Active Threats", visible: true, size: "medium" as const, order: 0 },
  { id: "blocked", label: "Blocked Attacks", visible: true, size: "medium" as const, order: 1 },
  { id: "scanned", label: "Assets Scanned", visible: true, size: "medium" as const, order: 2 },
  { id: "compliance", label: "Compliance Score", visible: true, size: "medium" as const, order: 3 },
];

const Overview = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  const {
    getSortedWidgets,
    getWidgetConfig,
    toggleVisibility,
    setSize,
    reorderWidgets,
    resetLayout,
  } = useDashboardLayout("overview-layout", DEFAULT_OVERVIEW_WIDGETS);

  const handleReset = () => {
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    });
    setSelectedMetric("all");
    setSelectedCard(null);
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(selectedCard === cardType ? null : cardType);
  };

  const getMetricMultiplier = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0.5, Math.min(1.5, days / 30));
  };

  const multiplier = getMetricMultiplier();
  
  const widgetMap = {
    threats: {
      title: "Threats Detected",
      value: Math.round(1247 * multiplier).toLocaleString(),
      change: `-${(15.3 * multiplier).toFixed(1)}% from last period`,
      changeType: "positive" as const,
      icon: AlertTriangle,
      iconColor: "text-chart-5",
    },
    blocked: {
      title: "Threats Blocked",
      value: Math.round(1189 * multiplier).toLocaleString(),
      change: `95.3% success rate`,
      changeType: "positive" as const,
      icon: Shield,
      iconColor: "text-chart-2",
    },
    scanned: {
      title: "Endpoints Scanned",
      value: Math.round(8542 * multiplier).toLocaleString(),
      change: `+${(4.7 * multiplier).toFixed(1)}% from last period`,
      changeType: "positive" as const,
      icon: CheckCircle2,
      iconColor: "text-chart-3",
    },
    sessions: {
      title: "Active Monitors",
      value: Math.round(127 * multiplier).toString(),
      change: "Live monitoring",
      changeType: "neutral" as const,
      icon: Activity,
      iconColor: "text-chart-4",
    },
  };

  const sortedWidgets = getSortedWidgets();

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Network Security Overview
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor threats, vulnerabilities, and security metrics in real-time
          </p>
        </div>

        <FilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
          metrics={metrics}
          onReset={handleReset}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {sortedWidgets.map((widget) => {
            const config = getWidgetConfig(widget.id);
            const widgetData = widgetMap[widget.id as keyof typeof widgetMap];
            
            if (!config?.visible || !widgetData) return null;
            
            // Apply metric filter
            const metricMap: Record<string, string> = {
              users: "threats",
              revenue: "blocked", 
              growth: "scanned"
            };
            if (selectedMetric !== "all" && metricMap[selectedMetric] !== widget.id && widget.id !== "sessions") {
              return null;
            }

            const sizeClass = {
              small: "md:col-span-1",
              medium: "md:col-span-1",
              large: "md:col-span-2",
            }[config.size];

            return (
              <div key={widget.id} className={cn(sizeClass, "animate-fade-in")}>
                <MetricCard
                  title={widgetData.title}
                  value={widgetData.value}
                  change={widgetData.change}
                  changeType={widgetData.changeType}
                  icon={widgetData.icon}
                  iconColor={widgetData.iconColor}
                  onClick={() => handleCardClick(widget.id)}
                  isSelected={selectedCard === widget.id}
                />
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Network Security Command Center
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Comprehensive security monitoring with real-time threat detection, vulnerability scanning, and incident response. 
            Advanced analytics and AI-powered insights to protect your network infrastructure.
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-card border border-border rounded-lg p-4 flex-1 min-w-[200px]">
              <h3 className="font-semibold text-foreground mb-2">Threat Intelligence</h3>
              <p className="text-sm text-muted-foreground">
                Real-time monitoring and analysis of security threats and vulnerabilities
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex-1 min-w-[200px]">
              <h3 className="font-semibold text-foreground mb-2">Security Incidents</h3>
              <p className="text-sm text-muted-foreground">
                Track malware, phishing, DDoS attacks, and intrusion attempts
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex-1 min-w-[200px]">
              <h3 className="font-semibold text-foreground mb-2">Compliance Projects</h3>
              <p className="text-sm text-muted-foreground">
                Monitor security posture, policy compliance, and audit readiness
              </p>
            </div>
          </div>
        </div>
      </div>

      <CustomizationPanel
        widgets={sortedWidgets}
        onToggleVisibility={toggleVisibility}
        onSetSize={setSize}
        onReorder={reorderWidgets}
        onReset={resetLayout}
      />
    </DashboardLayout>
  );
};

export default Overview;
