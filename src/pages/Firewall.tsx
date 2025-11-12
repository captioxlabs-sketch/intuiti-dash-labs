import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { Shield, Ban, CheckCircle, Globe } from "lucide-react";
import { subDays } from "date-fns";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const firewallActivityData = [
  { hour: "00:00", blocked: 342, allowed: 8234 },
  { hour: "04:00", blocked: 298, allowed: 6891 },
  { hour: "08:00", blocked: 512, allowed: 12453 },
  { hour: "12:00", blocked: 678, allowed: 15234 },
  { hour: "16:00", blocked: 545, allowed: 14123 },
  { hour: "20:00", blocked: 423, allowed: 11234 },
];

const blockReasonData = [
  { name: "Geo-blocking", value: 892 },
  { name: "Port Scan", value: 734 },
  { name: "Malicious IP", value: 521 },
  { name: "Rate Limit", value: 412 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const metrics = [
  { value: "all", label: "All Metrics" },
  { value: "blocked", label: "Blocked" },
  { value: "allowed", label: "Allowed" },
  { value: "rules", label: "Rules" },
];

const Firewall = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleReset = () => {
    setDateRange({
      from: subDays(new Date(), 7),
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
    
    const drillDown = {
      title: `${chartType === "activity" ? "Traffic at " + data.hour : data.name}`,
      value: data.blocked || data.value,
      trend: 8.5,
      period: "vs. previous period",
      details: [
        { label: "Blocked Connections", value: Math.round((data.blocked || data.value) * 1).toLocaleString(), change: "-12%" },
        { label: "Source IPs", value: Math.round((data.blocked || data.value) * 0.45).toLocaleString(), change: "+8%" },
        { label: "Avg. Response Time", value: "2.3ms", change: "-5%" },
        { label: "False Positives", value: "1.2%", change: "-0.3%" },
      ],
    };
    
    setDrillDownData(drillDown);
    setModalOpen(true);
  };

  const getMetricMultiplier = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0.5, Math.min(1.5, days / 7));
  };

  const multiplier = getMetricMultiplier();

  const getFilteredActivityData = () => {
    if (!selectedCard) return firewallActivityData;
    
    switch (selectedCard) {
      case "blocked":
        return firewallActivityData.map(d => ({ ...d, allowed: 0 }));
      case "allowed":
        return firewallActivityData.map(d => ({ ...d, blocked: 0 }));
      default:
        return firewallActivityData;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Firewall Monitor</h1>
          <p className="text-muted-foreground text-lg">
            Real-time firewall activity, rules, and connection monitoring
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
          {(selectedMetric === "all" || selectedMetric === "blocked") && (
            <MetricCard
              title="Connections Blocked"
              value={Math.round(2559 * multiplier).toLocaleString()}
              change={`-${(15.7 * multiplier).toFixed(1)}% from last period`}
              changeType="positive"
              icon={Ban}
              iconColor="text-chart-5"
              onClick={() => handleCardClick("blocked")}
              isSelected={selectedCard === "blocked"}
            />
          )}
          {(selectedMetric === "all" || selectedMetric === "allowed") && (
            <MetricCard
              title="Connections Allowed"
              value={Math.round(68169 * multiplier).toLocaleString()}
              change={`+${(4.2 * multiplier).toFixed(1)}% from last period`}
              changeType="neutral"
              icon={CheckCircle}
              iconColor="text-chart-2"
              onClick={() => handleCardClick("allowed")}
              isSelected={selectedCard === "allowed"}
            />
          )}
          <MetricCard
            title="Success Rate"
            value={`${(96.4 * Math.min(multiplier, 1)).toFixed(1)}%`}
            change={`+${(0.8 * multiplier).toFixed(1)}% from last period`}
            changeType="positive"
            icon={Shield}
            iconColor="text-chart-3"
            onClick={() => handleCardClick("success")}
            isSelected={selectedCard === "success"}
          />
          {(selectedMetric === "all" || selectedMetric === "rules") && (
            <MetricCard
              title="Active Rules"
              value={Math.round(247 * multiplier).toString()}
              change="98% optimized"
              changeType="positive"
              icon={Globe}
              iconColor="text-chart-4"
              onClick={() => handleCardClick("rules")}
              isSelected={selectedCard === "rules"}
            />
          )}
        </div>

        <div className="grid gap-6 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                24-Hour Firewall Activity
                {selectedCard && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by {selectedCard})
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={getFilteredActivityData()}>
                  <defs>
                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
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
                    dataKey="blocked"
                    stroke="hsl(var(--chart-5))"
                    fillOpacity={1}
                    fill="url(#colorBlocked)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="allowed"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorAllowed)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Block Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={blockReasonData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data) => handleChartClick(data, "reason")}
                    cursor="pointer"
                  >
                    {blockReasonData.map((entry, index) => (
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

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Hourly Block Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={firewallActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
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
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-5))", r: 5 }}
                    onClick={(data: any) => handleChartClick(data, "activity")}
                    cursor="pointer"
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

export default Firewall;
