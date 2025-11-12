import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { Shield, Bug, Lock, AlertTriangle } from "lucide-react";
import { addDays, subDays } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const threatData = [
  { month: "Jan", threats: 342, blocked: 328 },
  { month: "Feb", threats: 298, blocked: 285 },
  { month: "Mar", threats: 412, blocked: 395 },
  { month: "Apr", threats: 378, blocked: 362 },
  { month: "May", threats: 445, blocked: 428 },
  { month: "Jun", threats: 389, blocked: 374 },
];

const attackTypeData = [
  { category: "Malware", incidents: 892 },
  { category: "Phishing", incidents: 734 },
  { category: "DDoS", incidents: 521 },
  { category: "SQL Injection", incidents: 412 },
  { category: "Brute Force", incidents: 387 },
];

const metrics = [
  { value: "all", label: "All Metrics" },
  { value: "threats", label: "Threats" },
  { value: "blocked", label: "Blocked" },
  { value: "incidents", label: "Incidents" },
];

const Threats = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 180),
    to: new Date(),
  });
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleReset = () => {
    setDateRange({
      from: subDays(new Date(), 180),
      to: new Date(),
    });
    setSelectedMetric("all");
    setSelectedCard(null);
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(selectedCard === cardType ? null : cardType);
  };

  const handleChartClick = (data: any, chartType: string) => {
    if (!data) return;
    
    let drillDown;
    if (chartType === "revenue") {
      drillDown = {
        title: `Revenue - ${data.month}`,
        value: `$${data.value.toLocaleString()}`,
        trend: 12.5,
        period: "vs. previous month",
        details: [
          { label: "Online Sales", value: `$${Math.round(data.value * 0.6).toLocaleString()}`, change: "+15%" },
          { label: "In-Store Sales", value: `$${Math.round(data.value * 0.3).toLocaleString()}`, change: "+8%" },
          { label: "Wholesale", value: `$${Math.round(data.value * 0.1).toLocaleString()}`, change: "+22%" },
        ],
        timeSeriesData: [
          { date: "Week 1", value: Math.round(data.value * 0.2) },
          { date: "Week 2", value: Math.round(data.value * 0.25) },
          { date: "Week 3", value: Math.round(data.value * 0.28) },
          { date: "Week 4", value: Math.round(data.value * 0.27) },
        ],
      };
    } else {
      drillDown = {
        title: data.product,
        value: `${data.sales} units sold`,
        trend: 8.3,
        period: "vs. previous period",
        details: [
          { label: "Revenue", value: `$${(data.sales * 45).toLocaleString()}`, change: "+12%" },
          { label: "Units Sold", value: data.sales.toString(), change: "+8%" },
          { label: "Average Price", value: "$45", change: "+4%" },
          { label: "Customer Satisfaction", value: "4.5/5", change: "+0.2" },
        ],
        timeSeriesData: [
          { date: "Week 1", value: Math.round(data.sales * 0.22) },
          { date: "Week 2", value: Math.round(data.sales * 0.24) },
          { date: "Week 3", value: Math.round(data.sales * 0.27) },
          { date: "Week 4", value: Math.round(data.sales * 0.27) },
        ],
      };
    }
    
    setDrillDownData(drillDown);
    setModalOpen(true);
  };

  const getMetricMultiplier = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0.3, Math.min(2, days / 180));
  };

  const multiplier = getMetricMultiplier();

  // Filter data based on selected card
  const getFilteredThreatData = () => {
    if (!selectedCard) return threatData;
    
    switch (selectedCard) {
      case "threats":
        return threatData.map(d => ({ ...d, blocked: 0 }));
      case "blocked":
        return threatData.map(d => ({ ...d, threats: 0 }));
      default:
        return threatData;
    }
  };

  const getFilteredAttackData = () => {
    if (!selectedCard || selectedCard === "incidents") return attackTypeData;
    return [];
  };
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Threat Intelligence</h1>
          <p className="text-muted-foreground text-lg">
            Monitor security threats, attacks, and incident response
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
          {(selectedMetric === "all" || selectedMetric === "threats") && (
            <MetricCard
              title="Total Threats"
              value={Math.round(2264 * multiplier).toLocaleString()}
              change={`-${(8.3 * multiplier).toFixed(1)}% from last period`}
              changeType="positive"
              icon={AlertTriangle}
              iconColor="text-chart-5"
              onClick={() => handleCardClick("threats")}
              isSelected={selectedCard === "threats"}
            />
          )}
          {(selectedMetric === "all" || selectedMetric === "blocked") && (
            <MetricCard
              title="Threats Blocked"
              value={Math.round(2172 * multiplier).toLocaleString()}
              change={`96% success rate`}
              changeType="positive"
              icon={Shield}
              iconColor="text-chart-2"
              onClick={() => handleCardClick("blocked")}
              isSelected={selectedCard === "blocked"}
            />
          )}
          <MetricCard
            title="Critical Incidents"
            value={Math.round(23 * multiplier).toString()}
            change={`-${(12.1 * multiplier).toFixed(1)}% from last period`}
            changeType="positive"
            icon={Bug}
            iconColor="text-chart-3"
            onClick={() => handleCardClick("critical")}
            isSelected={selectedCard === "critical"}
          />
          {(selectedMetric === "all" || selectedMetric === "incidents") && (
            <MetricCard
              title="Active Incidents"
              value={Math.round(147 * multiplier).toString()}
              change={`+${(5.7 * multiplier).toFixed(1)}% from last period`}
              changeType="neutral"
              icon={Lock}
              iconColor="text-chart-4"
              onClick={() => handleCardClick("incidents")}
              isSelected={selectedCard === "incidents"}
            />
          )}
        </div>

        <div className="grid gap-6 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                Threat Activity Trend
                {selectedCard && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by {selectedCard})
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={getFilteredThreatData()}>
                  <defs>
                    <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="threats"
                    stroke="hsl(var(--chart-5))"
                    fillOpacity={1}
                    fill="url(#colorThreats)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                Attack Types
                {selectedCard === "incidents" && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by incidents)
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFilteredAttackData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="incidents" fill="hsl(var(--chart-1))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                Blocked Threats
                {selectedCard === "blocked" && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by blocked)
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getFilteredThreatData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
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
                    dataKey="blocked"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-2))", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <DrillDownModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        data={drillDownData} 
      />
    </DashboardLayout>
  );
};

export default Threats;
