import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { HardDrive, Package, Cpu, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
} from "recharts";

const assetTypeData = [
  { type: "Hardware", count: 1247, value: 2850000 },
  { type: "Software", count: 3421, value: 1250000 },
  { type: "Licenses", count: 2156, value: 850000 },
  { type: "Services", count: 234, value: 450000 },
];

const lifecycleData = [
  { name: "Active", value: 5234 },
  { name: "Retiring", value: 892 },
  { name: "Retired", value: 432 },
  { name: "In Storage", value: 324 },
];

const inventoryTrendData = [
  { month: "Jan", hardware: 1180, software: 3200 },
  { month: "Feb", hardware: 1205, software: 3280 },
  { month: "Mar", hardware: 1223, software: 3350 },
  { month: "Apr", hardware: 1237, software: 3390 },
  { month: "May", hardware: 1242, software: 3410 },
  { month: "Jun", hardware: 1247, software: 3421 },
];

const recentAssets = [
  { name: "Dell Precision 5570", type: "Laptop", location: "IT Department", value: "$2,450", status: "Active" },
  { name: "Microsoft 365 E5", type: "License", location: "All Departments", value: "$57/user", status: "Active" },
  { name: "Cisco Catalyst 9300", type: "Network Switch", location: "Data Center 1", value: "$8,900", status: "Active" },
  { name: "VMware vSphere", type: "Software", location: "Virtual Infrastructure", value: "$4,500", status: "Active" },
  { name: "HP ProLiant DL380", type: "Server", location: "Data Center 2", value: "$12,500", status: "Retiring" },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const categories = [
  { value: "all", label: "All Assets" },
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
  { value: "licenses", label: "Licenses" },
];

const Assets = () => {
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
    
    const drillDown = {
      title: `${data.type || data.name} Assets`,
      value: data.count?.toLocaleString() || data.value?.toLocaleString(),
      trend: 7.3,
      period: "vs. previous period",
      details: [
        { label: "Total Count", value: (data.count || data.value).toLocaleString(), change: "+5%" },
        { label: "Total Value", value: `$${((data.value || data.count) * 1000).toLocaleString()}`, change: "+8%" },
        { label: "Active", value: Math.round((data.count || data.value) * 0.85).toString(), change: "+6%" },
        { label: "Maintenance Cost", value: `$${Math.round((data.value || data.count) * 50).toLocaleString()}`, change: "+3%" },
      ],
    };
    
    setDrillDownData(drillDown);
    setModalOpen(true);
  };

  const filteredAssets = useMemo(() => {
    if (selectedCategory === "all") return recentAssets;
    return recentAssets.filter(asset => 
      asset.type.toLowerCase() === selectedCategory || 
      (selectedCategory === "hardware" && (asset.type === "Laptop" || asset.type === "Server" || asset.type === "Network Switch"))
    );
  }, [selectedCategory]);

  const getMetricMultiplier = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0.8, Math.min(1.2, days / 180));
  };

  const multiplier = getMetricMultiplier();

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            IT Asset Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Track hardware, software, licenses, and asset lifecycle
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
            title="Total Assets"
            value={Math.round(7058 * multiplier).toLocaleString()}
            change={`+${Math.round(142 * multiplier)} this period`}
            changeType="positive"
            icon={Package}
            iconColor="text-chart-1"
            onClick={() => handleCardClick("total")}
            isSelected={selectedCard === "total"}
          />
          <MetricCard
            title="Hardware"
            value={Math.round(1247 * multiplier).toLocaleString()}
            change={`$${(2.85 * multiplier).toFixed(1)}M value`}
            changeType="neutral"
            icon={HardDrive}
            iconColor="text-chart-2"
            onClick={() => handleCardClick("hardware")}
            isSelected={selectedCard === "hardware"}
          />
          <MetricCard
            title="Software & Licenses"
            value={Math.round(5577 * multiplier).toLocaleString()}
            change={`$${(2.1 * multiplier).toFixed(1)}M value`}
            changeType="neutral"
            icon={Cpu}
            iconColor="text-chart-3"
            onClick={() => handleCardClick("software")}
            isSelected={selectedCard === "software"}
          />
          <MetricCard
            title="Total Value"
            value={`$${(5.4 * multiplier).toFixed(1)}M`}
            change={`+${(8.7 * multiplier).toFixed(1)}% from last period`}
            changeType="positive"
            icon={Database}
            iconColor="text-chart-4"
            onClick={() => handleCardClick("value")}
            isSelected={selectedCard === "value"}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                Asset Distribution
                {selectedCard && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by {selectedCard})
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetTypeData} onClick={(e) => e?.activePayload && handleChartClick(e.activePayload[0].payload, "type")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" />
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
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Asset Lifecycle</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={lifecycleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data) => handleChartClick(data, "lifecycle")}
                    cursor="pointer"
                  >
                    {lifecycleData.map((entry, index) => (
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
              <CardTitle>Inventory Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={inventoryTrendData}>
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
                    dataKey="hardware"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="software"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-3))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Recent Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAssets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.type} • {asset.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{asset.value}</p>
                      <Badge 
                        variant={asset.status === "Active" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {asset.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
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

export default Assets;
