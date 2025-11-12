import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { useDashboardLayout } from "@/hooks/useDashboardLayout";
import { DateRange } from "react-day-picker";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { addDays, subDays } from "date-fns";
import { cn } from "@/lib/utils";

const metrics = [
  { value: "all", label: "All Metrics" },
  { value: "users", label: "Users Only" },
  { value: "revenue", label: "Revenue Only" },
  { value: "growth", label: "Growth Only" },
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
  } = useDashboardLayout("overview-layout");

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
    users: {
      title: "Total Users",
      value: Math.round(12345 * multiplier).toLocaleString(),
      change: `+${(12.5 * multiplier).toFixed(1)}% from last period`,
      changeType: "positive" as const,
      icon: Users,
      iconColor: "text-chart-1",
    },
    revenue: {
      title: "Revenue",
      value: `$${Math.round(45678 * multiplier).toLocaleString()}`,
      change: `+${(8.2 * multiplier).toFixed(1)}% from last period`,
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "text-chart-2",
    },
    growth: {
      title: "Growth Rate",
      value: `${(23.5 * multiplier).toFixed(1)}%`,
      change: `+${(3.1 * multiplier).toFixed(1)}% from last period`,
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "text-chart-3",
    },
    sessions: {
      title: "Active Sessions",
      value: Math.round(892 * multiplier).toString(),
      change: "Live tracking",
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
            Dashboard Showcase
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore the most intuitive and dynamic dashboard examples
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
            if (selectedMetric !== "all" && widget.id !== selectedMetric && widget.id !== "sessions") {
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
            Welcome to Dashboard Hub
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Discover beautifully crafted, highly intuitive dashboard examples designed for modern applications. 
            Each dashboard showcases best practices in data visualization, user experience, and interface design.
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-card border border-border rounded-lg p-4 flex-1 min-w-[200px]">
              <h3 className="font-semibold text-foreground mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Advanced metrics and visualizations for data-driven insights
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex-1 min-w-[200px]">
              <h3 className="font-semibold text-foreground mb-2">Sales Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Track performance, revenue, and conversion metrics
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex-1 min-w-[200px]">
              <h3 className="font-semibold text-foreground mb-2">Project Management</h3>
              <p className="text-sm text-muted-foreground">
                Monitor tasks, progress, and team productivity
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
