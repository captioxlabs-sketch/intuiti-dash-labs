import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
import { LoadingState } from "@/components/LoadingState";
import { DraggableDashboard } from "@/components/DraggableDashboard";
import { DraggableWidget } from "@/components/DraggableWidget";
import { SOCCharts } from "@/components/SOCCharts";
import { Widget } from "@/components/WidgetCustomizer";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { useDataExport } from "@/hooks/useDataExport";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  Users,
  Activity,
  Bell,
  Target,
  TrendingUp
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const alertTrends = [
  { hour: "00:00", critical: 12, high: 28, medium: 45, low: 67 },
  { hour: "04:00", critical: 8, high: 22, medium: 38, low: 52 },
  { hour: "08:00", critical: 18, high: 42, medium: 68, low: 89 },
  { hour: "12:00", critical: 25, high: 55, medium: 82, low: 105 },
  { hour: "16:00", critical: 22, high: 48, medium: 75, low: 98 },
  { hour: "20:00", critical: 15, high: 35, medium: 58, low: 78 },
];

const incidentsByStatus = [
  { status: "New", count: 45, color: "hsl(var(--destructive))" },
  { status: "In Progress", count: 78, color: "hsl(48, 96%, 53%)" },
  { status: "Investigating", count: 62, color: "hsl(var(--primary))" },
  { status: "Resolved", count: 234, color: "hsl(var(--accent))" },
  { status: "Closed", count: 512, color: "hsl(142, 76%, 36%)" },
];

const analystWorkload = [
  { analyst: "Sarah M.", active: 12, resolved: 45, avgMTTR: 28, efficiency: 92 },
  { analyst: "John D.", active: 8, resolved: 52, avgMTTR: 22, efficiency: 95 },
  { analyst: "Alex K.", active: 15, resolved: 38, avgMTTR: 35, efficiency: 85 },
  { analyst: "Emma R.", active: 10, resolved: 48, avgMTTR: 25, efficiency: 90 },
  { analyst: "Mike L.", active: 14, resolved: 41, avgMTTR: 32, efficiency: 87 },
];

const mttrTrends = [
  { month: "Jan", mttr: 32, target: 30, incidents: 145 },
  { month: "Feb", mttr: 28, target: 30, incidents: 162 },
  { month: "Mar", mttr: 25, target: 30, incidents: 178 },
  { month: "Apr", mttr: 22, target: 30, incidents: 156 },
  { month: "May", mttr: 24, target: 30, incidents: 189 },
  { month: "Jun", mttr: 21, target: 30, incidents: 203 },
];

const eventCorrelation = [
  { time: "14:23", events: 45, correlated: 12, severity: 85, impact: 72 },
  { time: "14:45", events: 67, correlated: 18, severity: 92, impact: 88 },
  { time: "15:12", events: 89, correlated: 25, severity: 78, impact: 65 },
  { time: "15:34", events: 52, correlated: 15, severity: 68, impact: 55 },
  { time: "16:01", events: 73, correlated: 22, severity: 82, impact: 70 },
  { time: "16:28", events: 41, correlated: 10, severity: 58, impact: 45 },
];

const activeIncidents = [
  {
    id: "INC-2024-001",
    title: "Potential Data Exfiltration Detected",
    severity: "critical",
    status: "investigating",
    assignedTo: "Sarah M.",
    created: "2 hours ago",
    events: 234,
    affectedSystems: 12,
    mttr: 125,
    description: "Unusual outbound traffic to suspicious IP addresses detected across multiple endpoints",
  },
  {
    id: "INC-2024-002",
    title: "Brute Force Attack on Authentication System",
    severity: "high",
    status: "in-progress",
    assignedTo: "John D.",
    created: "45 minutes ago",
    events: 456,
    affectedSystems: 3,
    mttr: 45,
    description: "Multiple failed login attempts from distributed sources targeting admin accounts",
  },
  {
    id: "INC-2024-003",
    title: "Malware Signature Detected",
    severity: "high",
    status: "new",
    assignedTo: "Alex K.",
    created: "30 minutes ago",
    events: 78,
    affectedSystems: 1,
    mttr: 30,
    description: "Endpoint protection detected known malware signature on user workstation",
  },
  {
    id: "INC-2024-004",
    title: "Unusual Database Query Activity",
    severity: "medium",
    status: "investigating",
    assignedTo: "Emma R.",
    created: "1 hour ago",
    events: 145,
    affectedSystems: 2,
    mttr: 60,
    description: "Abnormal database query patterns detected, possible SQL injection attempt",
  },
  {
    id: "INC-2024-005",
    title: "Privilege Escalation Attempt",
    severity: "critical",
    status: "in-progress",
    assignedTo: "Mike L.",
    created: "3 hours ago",
    events: 89,
    affectedSystems: 5,
    mttr: 180,
    description: "Unauthorized privilege elevation detected on critical production servers",
  },
];

const categoryFilters = [
  { value: "all", label: "All Incidents" },
  { value: "malware", label: "Malware" },
  { value: "intrusion", label: "Intrusion" },
  { value: "data-loss", label: "Data Loss" },
  { value: "phishing", label: "Phishing" },
  { value: "ddos", label: "DDoS" },
];

const SOC = () => {
  const [dateRange, setDateRange] = useState({ from: new Date(2024, 0, 1), to: new Date() });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragEnabled, setIsDragEnabled] = useState(false);

  // Widget customization
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "alerts", label: "Active Alerts", visible: true, size: "medium", order: 0 },
    { id: "incidents", label: "Open Incidents", visible: true, size: "medium", order: 1 },
    { id: "mttr", label: "Avg MTTR", visible: true, size: "medium", order: 2 },
    { id: "efficiency", label: "Analyst Efficiency", visible: true, size: "medium", order: 3 },
    { id: "alert-chart", label: "Alert Distribution", visible: true, size: "large", order: 4 },
    { id: "incident-chart", label: "Incident Queue", visible: true, size: "large", order: 5 },
    { id: "mttr-chart", label: "MTTR Trends", visible: true, size: "large", order: 6 },
    { id: "correlation-chart", label: "Event Correlation", visible: true, size: "large", order: 7 },
    { id: "analysts", label: "Analyst Workload", visible: true, size: "large", order: 8 },
    { id: "queue", label: "Incident Queue", visible: true, size: "large", order: 9 },
  ]);

  // Real-time data updates
  const { data: liveData, lastUpdate, isLive, toggleLive } = useRealTimeData(
    { alertCount: 152, incidentCount: 45 },
    (prev) => ({
      alertCount: Math.max(100, prev.alertCount + Math.floor(Math.random() * 20 - 10)),
      incidentCount: Math.max(30, prev.incidentCount + Math.floor(Math.random() * 6 - 3)),
    }),
    { refreshInterval: 8000 }
  );

  // Export functionality
  const { exportData } = useDataExport();

  const handleReset = () => {
    setDateRange({ from: new Date(2024, 0, 1), to: new Date() });
    setSelectedCategory("all");
    setSelectedCard(null);
    setSearchValue("");
  };

  const handleExport = (format: "csv" | "json" | "pdf") => {
    const exportDataset = {
      incidents: filteredIncidents,
      analysts: analystWorkload,
      metrics: {
        activeAlerts: liveData.alertCount,
        openIncidents: liveData.incidentCount,
        avgMTTR: Math.round(24 * multiplier),
        efficiency: "91%",
      },
    };
    exportData(exportDataset, format, "soc-dashboard");
  };

  const toggleWidgetVisibility = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };

  const changeWidgetSize = (id: string, size: "small" | "medium" | "large") => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
  };

  const resetLayout = () => {
    setWidgets([
      { id: "alerts", label: "Active Alerts", visible: true, size: "medium", order: 0 },
      { id: "incidents", label: "Open Incidents", visible: true, size: "medium", order: 1 },
      { id: "mttr", label: "Avg MTTR", visible: true, size: "medium", order: 2 },
      { id: "efficiency", label: "Analyst Efficiency", visible: true, size: "medium", order: 3 },
      { id: "alert-chart", label: "Alert Distribution", visible: true, size: "large", order: 4 },
      { id: "incident-chart", label: "Incident Queue", visible: true, size: "large", order: 5 },
      { id: "mttr-chart", label: "MTTR Trends", visible: true, size: "large", order: 6 },
      { id: "correlation-chart", label: "Event Correlation", visible: true, size: "large", order: 7 },
      { id: "analysts", label: "Analyst Workload", visible: true, size: "large", order: 8 },
      { id: "queue", label: "Incident Queue", visible: true, size: "large", order: 9 },
    ]);
  };

  const reorderWidgets = (oldIndex: number, newIndex: number) => {
    setWidgets((prev) => {
      const newWidgets = [...prev];
      const [movedWidget] = newWidgets.splice(oldIndex, 1);
      newWidgets.splice(newIndex, 0, movedWidget);
      return newWidgets.map((w, idx) => ({ ...w, order: idx }));
    });
  };

  const handleCardClick = (cardId: string) => {
    setSelectedCard(selectedCard === cardId ? null : cardId);
  };

  const handleChartClick = (data: any, chartType: string) => {
    setDrillDownData({
      title: `${chartType} Details`,
      value: data.value || data.count || data.events,
      trend: "+12%",
      period: "vs last period",
      details: Object.entries(data).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: String(value),
      })),
    });
    setIsModalOpen(true);
  };

  const getMetricMultiplier = () => {
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0.5, Math.min(2, days / 180));
  };

  const multiplier = getMetricMultiplier();

  const filteredIncidents = useMemo(() => {
    let results = activeIncidents;
    
    if (selectedCategory !== "all") {
      results = results.filter(inc => 
        inc.title.toLowerCase().includes(selectedCategory)
      );
    }
    
    if (searchValue) {
      results = results.filter(inc =>
        inc.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        inc.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        inc.assignedTo.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    return results;
  }, [selectedCategory, searchValue]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "hsl(var(--destructive))";
      case "high": return "hsl(48, 96%, 53%)";
      case "medium": return "hsl(var(--primary))";
      case "low": return "hsl(var(--accent))";
      default: return "hsl(var(--muted))";
    }
  };

  const getSeverityBadgeVariant = (severity: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (status) {
      case "new": return "destructive";
      case "in-progress": return "default";
      case "investigating": return "secondary";
      default: return "outline";
    }
  };

  const getWidget = (id: string) => widgets.find((w) => w.id === id);
  const isWidgetVisible = (id: string) => getWidget(id)?.visible ?? true;
  const sortedWidgets = useMemo(() => 
    [...widgets].sort((a, b) => a.order - b.order),
    [widgets]
  );
  const visibleWidgetIds = sortedWidgets.filter(w => w.visible).map(w => w.id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <LoadingState type="skeleton" message="Loading SOC dashboard..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Security Operations Center
          </h2>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring, incident management, and threat response
          </p>
        </div>

        <FilterBar
          dateRange={dateRange}
          onDateRangeChange={(range) => {
            if (range?.from && range?.to) {
              setDateRange({ from: range.from, to: range.to });
            }
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categoryFilters}
          onReset={handleReset}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search incidents, IDs, analysts..."
          onExport={handleExport}
          isLive={isLive}
          lastUpdate={lastUpdate}
          onToggleLive={toggleLive}
          widgets={widgets}
          onToggleWidgetVisibility={toggleWidgetVisibility}
          onWidgetSizeChange={changeWidgetSize}
          onResetLayout={resetLayout}
          isDragEnabled={isDragEnabled}
          onToggleDrag={() => setIsDragEnabled(!isDragEnabled)}
        />

        <DraggableDashboard
          items={visibleWidgetIds}
          onReorder={reorderWidgets}
          isDragEnabled={isDragEnabled}
        >
          <div className={isDragEnabled ? "pl-8 space-y-6" : "space-y-6"}>
            {/* Metric Cards Section */}
            {sortedWidgets.some(w => 
              ["alerts", "incidents", "mttr", "efficiency"].includes(w.id) && w.visible
            ) && (
              <DraggableWidget id="metrics-section" isDragEnabled={isDragEnabled}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {sortedWidgets.map((widget) => {
                    if (!widget.visible) return null;
                    
                    switch (widget.id) {
                      case "alerts":
                        return (
                          <MetricCard
                            key="alerts"
                            title="Active Alerts"
                            value={Math.round(liveData.alertCount * multiplier)}
                            change="+18% from last hour"
                            changeType="negative"
                            icon={Bell}
                            iconColor="text-destructive"
                            onClick={() => handleCardClick("alerts")}
                            isSelected={selectedCard === "alerts"}
                          />
                        );
                      case "incidents":
                        return (
                          <MetricCard
                            key="incidents"
                            title="Open Incidents"
                            value={Math.round(liveData.incidentCount * multiplier)}
                            change="-8% from yesterday"
                            changeType="positive"
                            icon={AlertTriangle}
                            iconColor="text-accent"
                            onClick={() => handleCardClick("incidents")}
                            isSelected={selectedCard === "incidents"}
                          />
                        );
                      case "mttr":
                        return (
                          <MetricCard
                            key="mttr"
                            title="Avg MTTR"
                            value={`${Math.round(24 * multiplier)}m`}
                            change="-12% improvement"
                            changeType="positive"
                            icon={Clock}
                            iconColor="text-primary"
                            onClick={() => handleCardClick("mttr")}
                            isSelected={selectedCard === "mttr"}
                          />
                        );
                      case "efficiency":
                        return (
                          <MetricCard
                            key="efficiency"
                            title="Analyst Efficiency"
                            value="91%"
                            change="+5% this week"
                            changeType="positive"
                            icon={Users}
                            iconColor="text-accent"
                            onClick={() => handleCardClick("efficiency")}
                            isSelected={selectedCard === "efficiency"}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </DraggableWidget>
            )}

            {/* Individual Widget Sections - Render Charts */}
            {sortedWidgets.map((widget) => {
              if (!widget.visible) return null;
              if (["alerts", "incidents", "mttr", "efficiency"].includes(widget.id)) return null;
              
              return (
                <SOCCharts
                  key={widget.id}
                  widget={widget}
                  isDragEnabled={isDragEnabled}
                  handleChartClick={handleChartClick}
                  alertTrends={alertTrends}
                  incidentsByStatus={incidentsByStatus}
                  mttrTrends={mttrTrends}
                  eventCorrelation={eventCorrelation}
                  analystWorkload={analystWorkload}
                  filteredIncidents={filteredIncidents}
                  getSeverityColor={getSeverityColor}
                  getSeverityBadgeVariant={getSeverityBadgeVariant}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                />
              );
            })}
          </div>
        </DraggableDashboard>

        <DrillDownModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          data={drillDownData}
        />
      </div>
    </DashboardLayout>
  );
};

export default SOC;
