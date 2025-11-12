import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";
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

const revenueData = [
  { month: "Jan", revenue: 12000, orders: 145 },
  { month: "Feb", revenue: 15000, orders: 178 },
  { month: "Mar", revenue: 18000, orders: 210 },
  { month: "Apr", revenue: 22000, orders: 245 },
  { month: "May", revenue: 25000, orders: 289 },
  { month: "Jun", revenue: 29000, orders: 325 },
];

const productData = [
  { category: "Electronics", sales: 12500 },
  { category: "Clothing", sales: 8900 },
  { category: "Home & Garden", sales: 6700 },
  { category: "Sports", sales: 5400 },
  { category: "Books", sales: 3200 },
];

const metrics = [
  { value: "all", label: "All Metrics" },
  { value: "revenue", label: "Revenue" },
  { value: "orders", label: "Orders" },
  { value: "products", label: "Products" },
];

const Sales = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 180),
    to: new Date(),
  });
  const [selectedMetric, setSelectedMetric] = useState("all");

  const handleReset = () => {
    setDateRange({
      from: subDays(new Date(), 180),
      to: new Date(),
    });
    setSelectedMetric("all");
  };

  const getMetricMultiplier = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0.3, Math.min(2, days / 180));
  };

  const multiplier = getMetricMultiplier();
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Sales Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Track revenue, orders, and product performance
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
          {(selectedMetric === "all" || selectedMetric === "revenue") && (
            <MetricCard
              title="Total Revenue"
              value={`$${Math.round(121 * multiplier)}K`}
              change={`+${(24.5 * multiplier).toFixed(1)}% from last period`}
              changeType="positive"
              icon={DollarSign}
              iconColor="text-chart-2"
            />
          )}
          {(selectedMetric === "all" || selectedMetric === "orders") && (
            <MetricCard
              title="Orders"
              value={Math.round(1392 * multiplier).toLocaleString()}
              change={`+${(12.3 * multiplier).toFixed(1)}% from last period`}
              changeType="positive"
              icon={ShoppingCart}
              iconColor="text-chart-1"
            />
          )}
          <MetricCard
            title="Conversion Rate"
            value={`${(3.2 * multiplier).toFixed(1)}%`}
            change={`+${(0.8 * multiplier).toFixed(1)}% from last period`}
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-chart-3"
          />
          {(selectedMetric === "all" || selectedMetric === "products") && (
            <MetricCard
              title="Products Sold"
              value={Math.round(8456 * multiplier).toLocaleString()}
              change={`+${(18.9 * multiplier).toFixed(1)}% from last period`}
              changeType="positive"
              icon={Package}
              iconColor="text-chart-4"
            />
          )}
        </div>

        <div className="grid gap-6 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
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
                    dataKey="revenue"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
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
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productData} layout="vertical">
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
                  <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Order Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
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
                    dataKey="orders"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-3))", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sales;
