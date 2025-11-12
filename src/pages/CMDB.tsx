import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { Server, Database, Network, GitBranch } from "lucide-react";
import { subDays } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
} from "recharts";

const ciTypeData = [
  { type: "Servers", count: 342, critical: 28 },
  { type: "Applications", count: 567, critical: 45 },
  { type: "Databases", count: 128, critical: 12 },
  { type: "Network Devices", count: 234, critical: 18 },
  { type: "Storage", count: 89, critical: 6 },
  { type: "Services", count: 445, critical: 32 },
];

const healthStatusData = [
  { name: "Healthy", value: 1523 },
  { name: "Warning", value: 187 },
  { name: "Critical", value: 95 },
  { name: "Unknown", value: 45 },
];

const changeActivityData = [
  { week: "Week 1", changes: 45, incidents: 3 },
  { week: "Week 2", changes: 52, incidents: 2 },
  { week: "Week 3", changes: 38, incidents: 5 },
  { week: "Week 4", changes: 61, incidents: 4 },
];

const dependencyData = [
  { x: 1, y: 15, name: "Web-App-01", dependencies: 15, impact: "High" },
  { x: 2, y: 8, name: "DB-Primary", dependencies: 8, impact: "Critical" },
  { x: 3, y: 23, name: "Auth-Service", dependencies: 23, impact: "High" },
  { x: 4, y: 5, name: "Email-Server", dependencies: 5, impact: "Medium" },
  { x: 5, y: 18, name: "API-Gateway", dependencies: 18, impact: "High" },
  { x: 6, y: 3, name: "Cache-Redis", dependencies: 3, impact: "Low" },
];

const recentChanges = [
  { ci: "SRV-WEB-001", type: "Server", change: "OS Patch Applied", date: "2h ago", status: "Success" },
  { ci: "APP-CRM-PROD", type: "Application", change: "Version Upgrade", date: "5h ago", status: "Success" },
  { ci: "DB-SALES-01", type: "Database", change: "Schema Update", date: "1d ago", status: "Success" },
  { ci: "NET-SW-CORE-02", type: "Network", change: "Firmware Update", date: "1d ago", status: "Failed" },
  { ci: "SRV-API-003", type: "Server", change: "Config Change", date: "2d ago", status: "Success" },
];

const COLORS = [
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-4))",
];

const categories = [
  { value: "all", label: "All CIs" },
  { value: "servers", label: "Servers" },
  { value: "applications", label: "Applications" },
  { value: "databases", label: "Databases" },
];

const CMDB = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleReset = () => {
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    });
    setSelectedCategory("all");
    setSelectedCard(null);
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(selectedCard === cardType ? null : cardType);
  };

  const handleChartClick = (data: any, chartType: string) => {
    if (!data) return;
    
    let drillDown;
    if (chartType === "ci-type") {
      drillDown = {
        title: `${data.type} Configuration Items`,
        value: data.count.toLocaleString(),
        trend: 5.3,
        period: "vs. previous month",
        details: [
          { label: "Total CIs", value: data.count.toLocaleString(), change: "+4%" },
          { label: "Critical", value: data.critical.toString(), change: "-8%" },
          { label: "Active Changes", value: Math.round(data.count * 0.05).toString(), change: "+12%" },
          { label: "Avg. Dependencies", value: "8.3", change: "+2%" },
        ],
        timeSeriesData: [
          { date: "Week 1", value: Math.round(data.count * 0.23) },
          { date: "Week 2", value: Math.round(data.count * 0.25) },
          { date: "Week 3", value: Math.round(data.count * 0.26) },
          { date: "Week 4", value: Math.round(data.count * 0.26) },
        ],
      };
    } else if (chartType === "health") {
      drillDown = {
        title: `${data.name} Status CIs`,
        value: data.value.toLocaleString(),
        trend: data.name === "Healthy" ? 3.2 : -5.7,
        period: "vs. previous month",
        details: [
          { label: "Total Count", value: data.value.toLocaleString(), change: data.name === "Healthy" ? "+3%" : "-6%" },
          { label: "Percentage", value: `${((data.value / 1850) * 100).toFixed(1)}%`, change: "+1%" },
          { label: "Trend", value: data.name === "Healthy" ? "Improving" : "Stable", change: "0%" },
          { label: "SLA Compliance", value: "98.5%", change: "+0.5%" },
        ],
      };
    } else {
      drillDown = {
        title: `${data.name} Dependencies`,
        value: `${data.dependencies} connections`,
        trend: 4.8,
        period: "vs. previous period",
        details: [
          { label: "Direct Dependencies", value: data.dependencies.toString(), change: "+2%" },
          { label: "Indirect Dependencies", value: Math.round(data.dependencies * 2.5).toString(), change: "+5%" },
          { label: "Impact Level", value: data.impact, change: "0" },
          { label: "Change Risk", value: data.impact === "Critical" ? "High" : "Medium", change: "0" },
        ],
      };
    }
    
    setDrillDownData(drillDown);
    setModalOpen(true);
  };

  const filteredChanges = useMemo(() => {
    if (selectedCategory === "all") return recentChanges;
    return recentChanges.filter(change => 
      change.type.toLowerCase() === selectedCategory || 
      (selectedCategory === "servers" && change.type === "Server") ||
      (selectedCategory === "applications" && change.type === "Application") ||
      (selectedCategory === "databases" && change.type === "Database")
    );
  }, [selectedCategory]);

  const getMetricMultiplier = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0.8, Math.min(1.2, days / 30));
  };

  const multiplier = getMetricMultiplier();

  const getFilteredCIData = () => {
    if (!selectedCard) return ciTypeData;
    
    switch (selectedCard) {
      case "critical":
        return ciTypeData.filter(d => d.critical > 10);
      case "servers":
        return ciTypeData.filter(d => d.type === "Servers");
      default:
        return ciTypeData;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            CMDB Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Configuration Management Database - Track CIs, dependencies, and changes
          </p>
        </div>

        <FilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          onReset={handleReset}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Total CIs"
            value={Math.round(1850 * multiplier).toLocaleString()}
            change={`+${Math.round(67 * multiplier)} this month`}
            changeType="positive"
            icon={Database}
            iconColor="text-chart-1"
            onClick={() => handleCardClick("total")}
            isSelected={selectedCard === "total"}
          />
          <MetricCard
            title="Critical CIs"
            value={Math.round(141 * multiplier).toString()}
            change={`${(7.6 * multiplier).toFixed(1)}% of total`}
            changeType="neutral"
            icon={Server}
            iconColor="text-chart-5"
            onClick={() => handleCardClick("critical")}
            isSelected={selectedCard === "critical"}
          />
          <MetricCard
            title="Active Changes"
            value={Math.round(196 * multiplier).toString()}
            change={`+${Math.round(23 * multiplier)} this week`}
            changeType="neutral"
            icon={GitBranch}
            iconColor="text-chart-3"
            onClick={() => handleCardClick("changes")}
            isSelected={selectedCard === "changes"}
          />
          <MetricCard
            title="Dependencies"
            value={Math.round(4527 * multiplier).toLocaleString()}
            change="Mapped relationships"
            changeType="positive"
            icon={Network}
            iconColor="text-chart-4"
            onClick={() => handleCardClick("dependencies")}
            isSelected={selectedCard === "dependencies"}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                CIs by Type
                {selectedCard && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by {selectedCard})
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFilteredCIData()} onClick={(e) => e?.activePayload && handleChartClick(e.activePayload[0].payload, "ci-type")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    cursor={{ fill: "hsl(var(--muted) / 0.1)" }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} cursor="pointer" />
                  <Bar dataKey="critical" fill="hsl(var(--chart-5))" radius={[8, 8, 0, 0]} cursor="pointer" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Health Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data) => handleChartClick(data, "health")}
                    cursor="pointer"
                  >
                    {healthStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Change Activity & Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={changeActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="changes"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-3))", r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="incidents"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-5))", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Dependency Impact Map</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="CI" 
                    stroke="hsl(var(--muted-foreground))"
                    domain={[0, 7]}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Dependencies" 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded-lg p-3">
                            <p className="font-semibold text-foreground">{data.name}</p>
                            <p className="text-sm text-muted-foreground">Dependencies: {data.dependencies}</p>
                            <p className="text-sm text-muted-foreground">Impact: {data.impact}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    name="CIs" 
                    data={dependencyData} 
                    fill="hsl(var(--chart-1))"
                    onClick={(data) => handleChartClick(data, "dependency")}
                    cursor="pointer"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Recent Configuration Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredChanges.map((change, index) => (
                <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{change.ci}</p>
                      <Badge variant="outline" className="text-xs">
                        {change.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{change.change}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{change.date}</span>
                    <Badge 
                      variant={change.status === "Success" ? "default" : "destructive"}
                      className="min-w-[80px] justify-center"
                    >
                      {change.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <DrillDownModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        data={drillDownData} 
      />
    </DashboardLayout>
  );
};

export default CMDB;
