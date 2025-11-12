import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { Network, Wifi, Server, Database } from "lucide-react";
import { addDays, subDays } from "date-fns";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
} from "recharts";

const networkActivityData = [
  { month: "Jan", traffic: 4200, requests: 3100 },
  { month: "Feb", traffic: 3800, requests: 2900 },
  { month: "Mar", traffic: 5100, requests: 4200 },
  { month: "Apr", traffic: 4700, requests: 3800 },
  { month: "May", traffic: 6200, requests: 5100 },
  { month: "Jun", traffic: 7300, requests: 6200 },
];

const vulnerabilityData = [
  { name: "Critical", value: 23 },
  { name: "High", value: 87 },
  { name: "Medium", value: 142 },
  { name: "Low", value: 215 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const categories = [
  { value: "all", label: "All Severities" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
];

const Analytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 180),
    to: new Date(),
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleReset = () => {
    setDateRange({
      from: subDays(new Date(), 180),
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
    if (chartType === "pageviews") {
      drillDown = {
        title: `Page Views - ${data.day}`,
        value: data.views.toLocaleString(),
        trend: 15.2,
        period: "vs. previous day",
        details: [
          { label: "Desktop Views", value: Math.round(data.views * 0.65).toLocaleString(), change: "+18%" },
          { label: "Mobile Views", value: Math.round(data.views * 0.30).toLocaleString(), change: "+12%" },
          { label: "Tablet Views", value: Math.round(data.views * 0.05).toLocaleString(), change: "+5%" },
        ],
        timeSeriesData: [
          { date: "00:00-06:00", value: Math.round(data.views * 0.1) },
          { date: "06:00-12:00", value: Math.round(data.views * 0.25) },
          { date: "12:00-18:00", value: Math.round(data.views * 0.4) },
          { date: "18:00-24:00", value: Math.round(data.views * 0.25) },
        ],
      };
    } else {
      drillDown = {
        title: `${data.source} Traffic`,
        value: `${data.value.toLocaleString()} visitors`,
        trend: 9.7,
        period: "vs. previous period",
        details: [
          { label: "New Visitors", value: Math.round(data.value * 0.6).toLocaleString(), change: "+14%" },
          { label: "Returning Visitors", value: Math.round(data.value * 0.4).toLocaleString(), change: "+5%" },
          { label: "Bounce Rate", value: "42%", change: "-3%" },
          { label: "Avg. Session Duration", value: "3m 24s", change: "+12%" },
        ],
      };
    }
    
    setDrillDownData(drillDown);
    setModalOpen(true);
  };

  const filteredVulnerabilityData = useMemo(() => {
    if (selectedCategory === "all") return vulnerabilityData;
    return vulnerabilityData.filter(
      (item) => item.name.toLowerCase() === selectedCategory
    );
  }, [selectedCategory]);

  const getMetricMultiplier = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0.3, Math.min(2, days / 180));
  };

  const multiplier = getMetricMultiplier();

  // Filter data based on selected card
  const getFilteredNetworkData = () => {
    if (!selectedCard) return networkActivityData;
    
    switch (selectedCard) {
      case "traffic":
        return networkActivityData.map(d => ({ ...d, requests: 0 }));
      case "requests":
        return networkActivityData.map(d => ({ ...d, traffic: 0 }));
      default:
        return networkActivityData;
    }
  };
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Security Analytics</h1>
          <p className="text-muted-foreground text-lg">
            Deep dive into network traffic, vulnerabilities, and security metrics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Network Traffic"
            value={`${(32.7 * multiplier).toFixed(1)} TB`}
            change={`+${(12.4 * multiplier).toFixed(1)}% from last period`}
            changeType="neutral"
            icon={Network}
            iconColor="text-chart-1"
            onClick={() => handleCardClick("traffic")}
            isSelected={selectedCard === "traffic"}
          />
          <MetricCard
            title="API Requests"
            value={`${(25.3 * multiplier).toFixed(1)}M`}
            change={`+${(8.7 * multiplier).toFixed(1)}% from last period`}
            changeType="positive"
            icon={Wifi}
            iconColor="text-chart-2"
            onClick={() => handleCardClick("requests")}
            isSelected={selectedCard === "requests"}
          />
          <MetricCard
            title="Server Uptime"
            value={`${(99.97 * Math.min(multiplier, 1)).toFixed(2)}%`}
            change={`+${(0.03 * multiplier).toFixed(2)}% from last period`}
            changeType="positive"
            icon={Server}
            iconColor="text-chart-3"
            onClick={() => handleCardClick("uptime")}
            isSelected={selectedCard === "uptime"}
          />
          <MetricCard
            title="Active Endpoints"
            value={Math.round(1847 * multiplier).toLocaleString()}
            change={`+${(6.8 * multiplier).toFixed(1)}% from last period`}
            changeType="positive"
            icon={Database}
            iconColor="text-chart-4"
            onClick={() => handleCardClick("endpoints")}
            isSelected={selectedCard === "endpoints"}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                Network Activity
                {selectedCard === "traffic" && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by traffic)
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getFilteredNetworkData()}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
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
                    dataKey="traffic"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorTraffic)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                API Request Volume
                {selectedCard === "requests" && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by requests)
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getFilteredNetworkData()}>
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
                    dataKey="requests"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Vulnerability Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={filteredVulnerabilityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {filteredVulnerabilityData.map((entry, index) => (
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
              <CardTitle>Monthly Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={networkActivityData}>
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
                  <Bar dataKey="traffic" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="requests" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                </BarChart>
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

export default Analytics;
