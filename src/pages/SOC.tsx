import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
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

  const handleReset = () => {
    setDateRange({ from: new Date(2024, 0, 1), to: new Date() });
    setSelectedCategory("all");
    setSelectedCard(null);
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
    if (selectedCategory === "all") return activeIncidents;
    return activeIncidents.filter(inc => 
      inc.title.toLowerCase().includes(selectedCategory)
    );
  }, [selectedCategory]);

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
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Active Alerts"
            value={Math.round(152 * multiplier)}
            change="+18% from last hour"
            changeType="negative"
            icon={Bell}
            iconColor="text-destructive"
            onClick={() => handleCardClick("alerts")}
            isSelected={selectedCard === "alerts"}
          />
          <MetricCard
            title="Open Incidents"
            value={Math.round(45 * multiplier)}
            change="-8% from yesterday"
            changeType="positive"
            icon={AlertTriangle}
            iconColor="text-accent"
            onClick={() => handleCardClick("incidents")}
            isSelected={selectedCard === "incidents"}
          />
          <MetricCard
            title="Avg MTTR"
            value={`${Math.round(24 * multiplier)}m`}
            change="-12% improvement"
            changeType="positive"
            icon={Clock}
            iconColor="text-primary"
            onClick={() => handleCardClick("mttr")}
            isSelected={selectedCard === "mttr"}
          />
          <MetricCard
            title="Analyst Efficiency"
            value="91%"
            change="+5% this week"
            changeType="positive"
            icon={Users}
            iconColor="text-accent"
            onClick={() => handleCardClick("efficiency")}
            isSelected={selectedCard === "efficiency"}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Real-Time Alert Distribution
              </CardTitle>
              <CardDescription>Alert volume by severity over 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={alertTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="critical" 
                    stackId="1"
                    stroke="hsl(var(--destructive))" 
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="high" 
                    stackId="1"
                    stroke="hsl(48, 96%, 53%)" 
                    fill="hsl(48, 96%, 53%)"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="medium" 
                    stackId="1"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="low" 
                    stackId="1"
                    stroke="hsl(var(--accent))" 
                    fill="hsl(var(--accent))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Incident Queue by Status
              </CardTitle>
              <CardDescription>Current incident distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incidentsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    onClick={(data) => handleChartClick(data, "Incident Status")}
                    cursor="pointer"
                  >
                    {incidentsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                MTTR Trends & Performance
              </CardTitle>
              <CardDescription>Mean Time To Respond tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mttrTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="mttr" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Actual MTTR (min)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target MTTR (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Security Event Correlation
              </CardTitle>
              <CardDescription>Real-time event correlation analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number" 
                    dataKey="events" 
                    name="Events" 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    type="number" 
                    dataKey="severity" 
                    name="Severity" 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Legend />
                  <Scatter 
                    name="Security Events" 
                    data={eventCorrelation} 
                    fill="hsl(var(--primary))"
                    onClick={(data) => handleChartClick(data, "Event Correlation")}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Analyst Workload Distribution
            </CardTitle>
            <CardDescription>Team performance and case assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analystWorkload.map((analyst) => (
                <div
                  key={analyst.analyst}
                  className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{analyst.analyst}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Active Cases: {analyst.active}</span>
                        <span>•</span>
                        <span>Resolved: {analyst.resolved}</span>
                        <span>•</span>
                        <span>Avg MTTR: {analyst.avgMTTR}m</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{analyst.efficiency}%</div>
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Performance Score</span>
                      <span className="text-sm text-muted-foreground">{analyst.efficiency}%</span>
                    </div>
                    <Progress value={analyst.efficiency} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Active Incident Queue
            </CardTitle>
            <CardDescription>
              Current incidents requiring attention and response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{incident.title}</h4>
                        <Badge variant={getSeverityBadgeVariant(incident.severity)}>
                          {incident.severity.toUpperCase()}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(incident.status)}>
                          {incident.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>{incident.id}</span>
                        <span>•</span>
                        <span>Assigned to: {incident.assignedTo}</span>
                        <span>•</span>
                        <span>Created: {incident.created}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold" style={{ color: getSeverityColor(incident.severity) }}>
                        {incident.mttr}m
                      </div>
                      <div className="text-xs text-muted-foreground">MTTR</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Correlated Events:</span>{" "}
                      <span className="font-semibold">{incident.events}</span>
                    </div>
                    <div className="text-sm text-right">
                      <span className="text-muted-foreground">Affected Systems:</span>{" "}
                      <span className="font-semibold">{incident.affectedSystems}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
