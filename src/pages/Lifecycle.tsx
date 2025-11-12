import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DateRange } from "react-day-picker";
import { Calendar, AlertTriangle, Clock, RefreshCw } from "lucide-react";
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
  AreaChart,
  Area,
} from "recharts";

const assetAgeData = [
  { range: "0-1 yr", count: 342, healthy: 340 },
  { range: "1-2 yrs", count: 456, healthy: 448 },
  { range: "2-3 yrs", count: 523, healthy: 498 },
  { range: "3-4 yrs", count: 387, healthy: 345 },
  { range: "4-5 yrs", count: 234, healthy: 187 },
  { range: "5+ yrs", count: 128, healthy: 72 },
];

const eolStatusData = [
  { name: "Current", value: 1456 },
  { name: "Approaching EOL", value: 387 },
  { name: "EOL Reached", value: 156 },
  { name: "Extended Support", value: 71 },
];

const warrantyExpirationData = [
  { month: "Jan", expiring: 23, renewed: 18 },
  { month: "Feb", expiring: 31, renewed: 25 },
  { month: "Mar", expiring: 28, renewed: 22 },
  { month: "Apr", expiring: 45, renewed: 38 },
  { month: "May", expiring: 52, renewed: 41 },
  { month: "Jun", expiring: 38, renewed: 32 },
];

const refreshCycleData = [
  { quarter: "Q1 2024", planned: 125, completed: 118 },
  { quarter: "Q2 2024", planned: 145, completed: 132 },
  { quarter: "Q3 2024", planned: 167, completed: 0 },
  { quarter: "Q4 2024", planned: 189, completed: 0 },
];

const replacementRecommendations = [
  { 
    ci: "SRV-DB-001", 
    type: "Server", 
    age: "5.2 years",
    eol: "2024-08-15",
    warranty: "Expired",
    risk: "Critical",
    recommendation: "Immediate Replacement",
    estimatedCost: "$12,500",
    urgency: 95
  },
  { 
    ci: "NET-SW-CORE-03", 
    type: "Network Switch", 
    age: "4.8 years",
    eol: "2024-11-30",
    warranty: "Expires in 2 months",
    risk: "High",
    recommendation: "Schedule Replacement",
    estimatedCost: "$8,900",
    urgency: 85
  },
  { 
    ci: "WKS-SALES-042", 
    type: "Workstation", 
    age: "4.3 years",
    eol: "2025-03-20",
    warranty: "Active",
    risk: "Medium",
    recommendation: "Plan for Q1 2025",
    estimatedCost: "$2,450",
    urgency: 60
  },
  { 
    ci: "SRV-WEB-005", 
    type: "Server", 
    age: "5.7 years",
    eol: "2024-06-01",
    warranty: "Expired",
    risk: "Critical",
    recommendation: "Immediate Replacement",
    estimatedCost: "$15,200",
    urgency: 98
  },
  { 
    ci: "STG-SAN-002", 
    type: "Storage", 
    age: "3.9 years",
    eol: "2025-12-31",
    warranty: "Active",
    risk: "Low",
    recommendation: "Monitor",
    estimatedCost: "$28,000",
    urgency: 35
  },
];

const COLORS = [
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-4))",
];

const categories = [
  { value: "all", label: "All Assets" },
  { value: "critical", label: "Critical Risk" },
  { value: "high", label: "High Risk" },
  { value: "eol", label: "Approaching EOL" },
];

const Lifecycle = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 365),
    to: new Date(),
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleReset = () => {
    setDateRange({
      from: subDays(new Date(), 365),
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
    if (chartType === "age") {
      drillDown = {
        title: `Assets ${data.range} Old`,
        value: data.count.toLocaleString(),
        trend: -3.5,
        period: "vs. previous year",
        details: [
          { label: "Total Assets", value: data.count.toLocaleString(), change: "-4%" },
          { label: "Healthy", value: data.healthy.toString(), change: "+2%" },
          { label: "At Risk", value: (data.count - data.healthy).toString(), change: "+18%" },
          { label: "Avg. Health Score", value: `${((data.healthy / data.count) * 100).toFixed(1)}%`, change: "+5%" },
        ],
        timeSeriesData: [
          { date: "Q1", value: Math.round(data.count * 0.22) },
          { date: "Q2", value: Math.round(data.count * 0.24) },
          { date: "Q3", value: Math.round(data.count * 0.26) },
          { date: "Q4", value: Math.round(data.count * 0.28) },
        ],
      };
    } else if (chartType === "eol") {
      drillDown = {
        title: `${data.name} Assets`,
        value: data.value.toLocaleString(),
        trend: data.name === "Current" ? 2.3 : -8.7,
        period: "vs. previous quarter",
        details: [
          { label: "Total Count", value: data.value.toLocaleString(), change: data.name === "Current" ? "+2%" : "-9%" },
          { label: "Percentage", value: `${((data.value / 2070) * 100).toFixed(1)}%`, change: "+1%" },
          { label: "Budget Impact", value: `$${(data.value * 8500).toLocaleString()}`, change: "+12%" },
          { label: "Replacement Timeline", value: data.name === "EOL Reached" ? "Urgent" : "Planned", change: "0" },
        ],
      };
    } else if (chartType === "warranty") {
      drillDown = {
        title: `Warranty Expirations - ${data.month}`,
        value: `${data.expiring} expiring`,
        trend: -12.4,
        period: "vs. previous month",
        details: [
          { label: "Total Expiring", value: data.expiring.toString(), change: "+8%" },
          { label: "Renewed", value: data.renewed.toString(), change: "+5%" },
          { label: "Pending Renewal", value: (data.expiring - data.renewed).toString(), change: "+15%" },
          { label: "Renewal Rate", value: `${((data.renewed / data.expiring) * 100).toFixed(1)}%`, change: "-3%" },
        ],
      };
    } else {
      drillDown = {
        title: `Refresh Cycle - ${data.quarter}`,
        value: `${data.planned} planned`,
        trend: 6.8,
        period: "vs. previous quarter",
        details: [
          { label: "Planned Replacements", value: data.planned.toString(), change: "+15%" },
          { label: "Completed", value: data.completed.toString(), change: data.completed > 0 ? "+12%" : "N/A" },
          { label: "Completion Rate", value: data.completed > 0 ? `${((data.completed / data.planned) * 100).toFixed(1)}%` : "In Progress", change: data.completed > 0 ? "-5%" : "0" },
          { label: "Budget Utilized", value: data.completed > 0 ? `$${(data.completed * 8200).toLocaleString()}` : "$0", change: "+8%" },
        ],
      };
    }
    
    setDrillDownData(drillDown);
    setModalOpen(true);
  };

  const filteredRecommendations = useMemo(() => {
    if (selectedCategory === "all") return replacementRecommendations;
    if (selectedCategory === "critical") return replacementRecommendations.filter(r => r.risk === "Critical");
    if (selectedCategory === "high") return replacementRecommendations.filter(r => r.risk === "High");
    if (selectedCategory === "eol") return replacementRecommendations.filter(r => r.eol < "2025-01-01");
    return replacementRecommendations;
  }, [selectedCategory]);

  const getMetricMultiplier = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0.8, Math.min(1.2, days / 365));
  };

  const multiplier = getMetricMultiplier();

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            CI Lifecycle Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Track asset age, EOL dates, warranties, refresh cycles, and replacement planning
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
            title="Approaching EOL"
            value={Math.round(387 * multiplier).toString()}
            change="Within 12 months"
            changeType="negative"
            icon={Calendar}
            iconColor="text-chart-5"
            onClick={() => handleCardClick("eol")}
            isSelected={selectedCard === "eol"}
          />
          <MetricCard
            title="Warranty Expiring"
            value={Math.round(217 * multiplier).toString()}
            change="Next 90 days"
            changeType="neutral"
            icon={AlertTriangle}
            iconColor="text-chart-3"
            onClick={() => handleCardClick("warranty")}
            isSelected={selectedCard === "warranty"}
          />
          <MetricCard
            title="Avg. Asset Age"
            value={`${(2.8 * multiplier).toFixed(1)} yrs`}
            change={`+${(0.3 * multiplier).toFixed(1)} from last year`}
            changeType="neutral"
            icon={Clock}
            iconColor="text-chart-4"
            onClick={() => handleCardClick("age")}
            isSelected={selectedCard === "age"}
          />
          <MetricCard
            title="Pending Refreshes"
            value={Math.round(356 * multiplier).toString()}
            change="Q3-Q4 2024"
            changeType="positive"
            icon={RefreshCw}
            iconColor="text-chart-2"
            onClick={() => handleCardClick("refresh")}
            isSelected={selectedCard === "refresh"}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                Asset Age Distribution
                {selectedCard && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by {selectedCard})
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetAgeData} onClick={(e) => e?.activePayload && handleChartClick(e.activePayload[0].payload, "age")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
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
                  <Bar dataKey="healthy" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} cursor="pointer" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>End of Life Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eolStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data) => handleChartClick(data, "eol")}
                    cursor="pointer"
                  >
                    {eolStatusData.map((entry, index) => (
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
              <CardTitle>Warranty Expirations & Renewals</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={warrantyExpirationData} onClick={(e) => e?.activePayload && handleChartClick(e.activePayload[0].payload, "warranty")}>
                  <defs>
                    <linearGradient id="colorExpiring" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRenewed" x1="0" y1="0" x2="0" y2="1">
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
                    cursor={{ fill: "hsl(var(--muted) / 0.1)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="expiring"
                    stroke="hsl(var(--chart-5))"
                    fillOpacity={1}
                    fill="url(#colorExpiring)"
                    strokeWidth={2}
                    cursor="pointer"
                  />
                  <Area
                    type="monotone"
                    dataKey="renewed"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorRenewed)"
                    strokeWidth={2}
                    cursor="pointer"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Asset Refresh Cycles</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={refreshCycleData} onClick={(e) => e?.activePayload && handleChartClick(e.activePayload[0].payload, "refresh")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" />
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
                    dataKey="planned"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-3))", r: 5 }}
                    cursor="pointer"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-2))", r: 5 }}
                    cursor="pointer"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Automated Replacement Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecommendations.map((asset, index) => (
                <div key={index} className="border border-border rounded-lg p-4 hover-scale transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground text-lg">{asset.ci}</p>
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                        <Badge 
                          variant={
                            asset.risk === "Critical" ? "destructive" : 
                            asset.risk === "High" ? "default" : 
                            "secondary"
                          }
                        >
                          {asset.risk} Risk
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Age:</span>
                          <p className="font-medium text-foreground">{asset.age}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">EOL Date:</span>
                          <p className="font-medium text-foreground">{asset.eol}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Warranty:</span>
                          <p className={`font-medium ${asset.warranty === "Expired" ? "text-chart-5" : "text-foreground"}`}>
                            {asset.warranty}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Est. Cost:</span>
                          <p className="font-medium text-foreground">{asset.estimatedCost}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <Badge 
                        variant={
                          asset.recommendation === "Immediate Replacement" ? "destructive" :
                          asset.recommendation === "Schedule Replacement" ? "default" :
                          "secondary"
                        }
                        className="mb-2"
                      >
                        {asset.recommendation}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Urgency Score</span>
                      <span className="font-medium text-foreground">{asset.urgency}/100</span>
                    </div>
                    <Progress value={asset.urgency} className="h-2" />
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

export default Lifecycle;
