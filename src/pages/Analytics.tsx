import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { Eye, MousePointer, Clock, Users } from "lucide-react";
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

const pageViewsData = [
  { month: "Jan", views: 4000, users: 2400 },
  { month: "Feb", views: 3000, users: 1398 },
  { month: "Mar", views: 5000, users: 3800 },
  { month: "Apr", views: 4500, users: 3908 },
  { month: "May", views: 6000, users: 4800 },
  { month: "Jun", views: 7000, users: 5800 },
];

const trafficSourceData = [
  { name: "Direct", value: 4500 },
  { name: "Organic", value: 3200 },
  { name: "Social", value: 2100 },
  { name: "Referral", value: 1800 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const categories = [
  { value: "all", label: "All Sources" },
  { value: "direct", label: "Direct" },
  { value: "organic", label: "Organic" },
  { value: "social", label: "Social" },
];

const Analytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 180),
    to: new Date(),
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

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

  const filteredTrafficData = useMemo(() => {
    if (selectedCategory === "all") return trafficSourceData;
    return trafficSourceData.filter(
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
  const getFilteredPageViewsData = () => {
    if (!selectedCard) return pageViewsData;
    
    switch (selectedCard) {
      case "views":
        return pageViewsData.map(d => ({ ...d, users: 0 }));
      case "users":
        return pageViewsData.map(d => ({ ...d, views: 0 }));
      default:
        return pageViewsData;
    }
  };
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground text-lg">
            Deep dive into your metrics and user behavior
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Page Views"
            value={`${(45.2 * multiplier).toFixed(1)}K`}
            change={`+${(20.1 * multiplier).toFixed(1)}% from last period`}
            changeType="positive"
            icon={Eye}
            iconColor="text-chart-1"
            onClick={() => handleCardClick("views")}
            isSelected={selectedCard === "views"}
          />
          <MetricCard
            title="Avg. Session"
            value={`${Math.floor(3 * multiplier)}m ${Math.floor(24 * multiplier)}s`}
            change={`+${(5.4 * multiplier).toFixed(1)}% from last period`}
            changeType="positive"
            icon={Clock}
            iconColor="text-chart-2"
            onClick={() => handleCardClick("session")}
            isSelected={selectedCard === "session"}
          />
          <MetricCard
            title="Click Rate"
            value={`${(12.8 * multiplier).toFixed(1)}%`}
            change={`+${(2.3 * multiplier).toFixed(1)}% from last period`}
            changeType="positive"
            icon={MousePointer}
            iconColor="text-chart-3"
            onClick={() => handleCardClick("clicks")}
            isSelected={selectedCard === "clicks"}
          />
          <MetricCard
            title="Active Users"
            value={Math.round(8234 * multiplier).toLocaleString()}
            change={`+${(18.2 * multiplier).toFixed(1)}% from last period`}
            changeType="positive"
            icon={Users}
            iconColor="text-chart-4"
            onClick={() => handleCardClick("users")}
            isSelected={selectedCard === "users"}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                Traffic Overview
                {selectedCard === "views" && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by page views)
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getFilteredPageViewsData()}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="views"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorViews)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                User Growth
                {selectedCard === "users" && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by users)
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getFilteredPageViewsData()}>
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
                    dataKey="users"
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
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={filteredTrafficData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {filteredTrafficData.map((entry, index) => (
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
                <BarChart data={pageViewsData}>
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
                  <Bar dataKey="views" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="users" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
