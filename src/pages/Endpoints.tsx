import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { Laptop, Smartphone, Server, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
} from "recharts";

const endpointTypeData = [
  { type: "Workstations", count: 342, protected: 328 },
  { type: "Servers", count: 89, protected: 87 },
  { type: "Mobile Devices", count: 256, protected: 241 },
  { type: "IoT Devices", count: 145, protected: 132 },
];

const osDistributionData = [
  { name: "Windows", value: 425 },
  { name: "macOS", value: 187 },
  { name: "Linux", value: 98 },
  { name: "Mobile OS", value: 256 },
];

const vulnerableEndpoints = [
  { name: "WKS-SALES-042", os: "Windows 10", risk: "High", compliance: 65 },
  { name: "SRV-DB-001", os: "Ubuntu 22.04", risk: "Critical", compliance: 45 },
  { name: "WKS-DEV-128", os: "macOS 14", risk: "Medium", compliance: 78 },
  { name: "SRV-WEB-003", os: "CentOS 8", risk: "High", compliance: 58 },
  { name: "MOB-EXEC-067", os: "iOS 17", risk: "Low", compliance: 92 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const categories = [
  { value: "all", label: "All Devices" },
  { value: "workstations", label: "Workstations" },
  { value: "servers", label: "Servers" },
  { value: "mobile", label: "Mobile" },
];

const Endpoints = () => {
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

  const handleChartClick = (data: any) => {
    if (!data) return;
    
    const drillDown = {
      title: `${data.type || data.name} Details`,
      value: data.count?.toString() || data.value?.toString(),
      trend: 6.2,
      period: "vs. previous period",
      details: [
        { label: "Total Devices", value: (data.count || data.value).toString(), change: "+4%" },
        { label: "Protected", value: (data.protected || Math.round((data.value || data.count) * 0.95)).toString(), change: "+2%" },
        { label: "At Risk", value: Math.round((data.count || data.value) * 0.08).toString(), change: "-3%" },
        { label: "Avg. Patch Level", value: "94%", change: "+5%" },
      ],
    };
    
    setDrillDownData(drillDown);
    setModalOpen(true);
  };

  const filteredEndpoints = useMemo(() => {
    if (selectedCategory === "all") return vulnerableEndpoints;
    const categoryMap: Record<string, string> = {
      workstations: "WKS",
      servers: "SRV",
      mobile: "MOB",
    };
    return vulnerableEndpoints.filter(endpoint => 
      endpoint.name.startsWith(categoryMap[selectedCategory])
    );
  }, [selectedCategory]);

  const getMetricMultiplier = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0.7, Math.min(1.3, days / 30));
  };

  const multiplier = getMetricMultiplier();

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Endpoint Security
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor device compliance, vulnerabilities, and protection status
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
            title="Total Endpoints"
            value={Math.round(832 * multiplier).toString()}
            change={`+${Math.round(12 * multiplier)} new this month`}
            changeType="neutral"
            icon={Laptop}
            iconColor="text-chart-1"
            onClick={() => handleCardClick("total")}
            isSelected={selectedCard === "total"}
          />
          <MetricCard
            title="Protected"
            value={Math.round(788 * multiplier).toString()}
            change={`${(94.7 * Math.min(multiplier, 1)).toFixed(1)}% coverage`}
            changeType="positive"
            icon={Server}
            iconColor="text-chart-2"
            onClick={() => handleCardClick("protected")}
            isSelected={selectedCard === "protected"}
          />
          <MetricCard
            title="Mobile Devices"
            value={Math.round(256 * multiplier).toString()}
            change={`+${Math.round(8 * multiplier)} this month`}
            changeType="neutral"
            icon={Smartphone}
            iconColor="text-chart-3"
            onClick={() => handleCardClick("mobile")}
            isSelected={selectedCard === "mobile"}
          />
          <MetricCard
            title="At Risk"
            value={Math.round(44 * multiplier).toString()}
            change="Requires attention"
            changeType="negative"
            icon={AlertCircle}
            iconColor="text-chart-5"
            onClick={() => handleCardClick("risk")}
            isSelected={selectedCard === "risk"}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                Endpoints by Type
                {selectedCard && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by {selectedCard})
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={endpointTypeData} onClick={(e) => e?.activePayload && handleChartClick(e.activePayload[0].payload)}>
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
                  <Bar dataKey="protected" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} cursor="pointer" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>OS Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={osDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data) => handleChartClick(data)}
                    cursor="pointer"
                  >
                    {osDistributionData.map((entry, index) => (
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

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>High-Risk Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEndpoints.map((endpoint, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{endpoint.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {endpoint.os} • Risk: {endpoint.risk}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        endpoint.risk === "Critical" || endpoint.risk === "High"
                          ? "text-chart-5"
                          : endpoint.risk === "Medium"
                          ? "text-chart-3"
                          : "text-chart-2"
                      }`}
                    >
                      {endpoint.compliance}%
                    </span>
                  </div>
                  <Progress value={endpoint.compliance} className="h-2" />
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

export default Endpoints;
