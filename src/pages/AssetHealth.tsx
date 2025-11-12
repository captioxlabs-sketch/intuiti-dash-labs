import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Cpu,
  Brain,
  Zap,
  Server,
  HardDrive
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const healthScoreData = [
  { range: "90-100", count: 245, color: "hsl(var(--accent))" },
  { range: "80-89", count: 189, color: "hsl(var(--primary))" },
  { range: "70-79", count: 156, color: "hsl(142, 76%, 36%)" },
  { range: "60-69", count: 98, color: "hsl(48, 96%, 53%)" },
  { range: "0-59", count: 67, color: "hsl(var(--destructive))" },
];

const failurePredictions = [
  { month: "Jan", predicted: 12, actual: 10, prevented: 8 },
  { month: "Feb", predicted: 15, actual: 14, prevented: 11 },
  { month: "Mar", predicted: 18, actual: 16, prevented: 13 },
  { month: "Apr", predicted: 14, actual: 13, prevented: 10 },
  { month: "May", predicted: 20, actual: 18, prevented: 15 },
  { month: "Jun", predicted: 22, actual: 19, prevented: 17 },
];

const usagePatterns = [
  { hour: "00:00", cpu: 25, memory: 30, network: 15 },
  { hour: "04:00", cpu: 20, memory: 25, network: 10 },
  { hour: "08:00", cpu: 65, memory: 70, network: 55 },
  { hour: "12:00", cpu: 80, memory: 85, network: 70 },
  { hour: "16:00", cpu: 75, memory: 80, network: 65 },
  { hour: "20:00", cpu: 50, memory: 55, network: 40 },
];

const aiRecommendations = [
  {
    id: 1,
    asset: "FW-CORE-01",
    type: "Firewall",
    healthScore: 68,
    currentAge: 4.2,
    predictedFailure: "45 days",
    confidence: 92,
    recommendation: "Replace immediately",
    reason: "High CPU degradation pattern detected, 92% failure probability within 45 days",
    estimatedCost: "$8,500",
    urgency: "critical",
    metrics: {
      cpuDegradation: 78,
      memoryLeaks: 65,
      networkLatency: 45,
      errorRate: 82
    }
  },
  {
    id: 2,
    asset: "SRV-DB-03",
    type: "Database Server",
    healthScore: 74,
    currentAge: 3.8,
    predictedFailure: "90 days",
    confidence: 87,
    recommendation: "Schedule replacement in 60 days",
    reason: "Memory degradation trend indicates potential failure, plan proactive replacement",
    estimatedCost: "$12,000",
    urgency: "high",
    metrics: {
      cpuDegradation: 45,
      memoryLeaks: 72,
      networkLatency: 38,
      errorRate: 52
    }
  },
  {
    id: 3,
    asset: "EP-LAPTOP-142",
    type: "Endpoint",
    healthScore: 82,
    currentAge: 2.5,
    predictedFailure: "180 days",
    confidence: 78,
    recommendation: "Monitor and plan for Q4 refresh",
    reason: "Normal wear patterns, optimal to replace during Q4 refresh cycle",
    estimatedCost: "$1,200",
    urgency: "medium",
    metrics: {
      cpuDegradation: 28,
      memoryLeaks: 35,
      networkLatency: 22,
      errorRate: 18
    }
  },
  {
    id: 4,
    asset: "NET-SW-CORE-02",
    type: "Network Switch",
    healthScore: 91,
    currentAge: 1.2,
    predictedFailure: "360+ days",
    confidence: 95,
    recommendation: "Continue monitoring",
    reason: "Excellent health metrics, AI predicts extended operational life",
    estimatedCost: "N/A",
    urgency: "low",
    metrics: {
      cpuDegradation: 12,
      memoryLeaks: 8,
      networkLatency: 5,
      errorRate: 3
    }
  },
];

const refreshOptimization = [
  { category: "Firewalls", current: 4.2, optimal: 3.5, savings: "$45K", impact: 85 },
  { category: "Servers", current: 3.8, optimal: 4.0, savings: "$12K", impact: 62 },
  { category: "Endpoints", current: 2.5, optimal: 3.0, savings: "$89K", impact: 45 },
  { category: "Network Gear", current: 1.2, optimal: 5.0, savings: "$0", impact: 95 },
  { category: "Storage", current: 3.5, optimal: 3.5, savings: "$0", impact: 78 },
];

const categoryFilters = [
  { value: "all", label: "All Assets" },
  { value: "firewall", label: "Firewalls" },
  { value: "server", label: "Servers" },
  { value: "endpoint", label: "Endpoints" },
  { value: "network", label: "Network Gear" },
  { value: "storage", label: "Storage" },
];

const AssetHealth = () => {
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
      value: data.value || data.count || data.predicted,
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

  const filteredRecommendations = useMemo(() => {
    if (selectedCategory === "all") return aiRecommendations;
    return aiRecommendations.filter(rec => 
      rec.type.toLowerCase().includes(selectedCategory)
    );
  }, [selectedCategory]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "hsl(var(--destructive))";
      case "high": return "hsl(48, 96%, 53%)";
      case "medium": return "hsl(var(--primary))";
      case "low": return "hsl(var(--accent))";
      default: return "hsl(var(--muted))";
    }
  };

  const getUrgencyBadgeVariant = (urgency: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (urgency) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI-Powered Asset Health
          </h2>
          <p className="text-muted-foreground mt-2">
            Predictive analytics and proactive replacement recommendations
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
            title="Average Health Score"
            value={Math.round(78 * multiplier)}
            change="+5% from last month"
            changeType="positive"
            icon={Activity}
            iconColor="text-accent"
            onClick={() => handleCardClick("health")}
            isSelected={selectedCard === "health"}
          />
          <MetricCard
            title="Predicted Failures"
            value={Math.round(22 * multiplier)}
            change="Next 90 days"
            changeType="neutral"
            icon={AlertTriangle}
            iconColor="text-destructive"
            onClick={() => handleCardClick("failures")}
            isSelected={selectedCard === "failures"}
          />
          <MetricCard
            title="AI Confidence Level"
            value="89%"
            change="+3% accuracy improvement"
            changeType="positive"
            icon={Brain}
            iconColor="text-primary"
            onClick={() => handleCardClick("confidence")}
            isSelected={selectedCard === "confidence"}
          />
          <MetricCard
            title="Proactive Savings"
            value={`$${Math.round(146 * multiplier)}K`}
            change="From prevented failures"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-accent"
            onClick={() => handleCardClick("savings")}
            isSelected={selectedCard === "savings"}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Health Score Distribution
              </CardTitle>
              <CardDescription>Asset health by score ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={healthScoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
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
                    onClick={(data) => handleChartClick(data, "Health Score")}
                    cursor="pointer"
                  >
                    {healthScoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Failure Predictions vs Actuals
              </CardTitle>
              <CardDescription>AI prediction accuracy tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={failurePredictions}>
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
                    dataKey="predicted" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    onClick={(data) => handleChartClick(data, "Predicted Failures")}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="hsl(48, 96%, 53%)" 
                    strokeWidth={2}
                    onClick={(data) => handleChartClick(data, "Actual Failures")}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="prevented" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    onClick={(data) => handleChartClick(data, "Prevented Failures")}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                Usage Patterns & Performance
              </CardTitle>
              <CardDescription>24-hour resource utilization trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usagePatterns}>
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
                  <Line 
                    type="monotone" 
                    dataKey="cpu" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="memory" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="network" 
                    stroke="hsl(142, 76%, 36%)" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Refresh Cycle Optimization
              </CardTitle>
              <CardDescription>Current vs optimal asset age by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number" 
                    dataKey="current" 
                    name="Current Age" 
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: "Current Age (years)", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="optimal" 
                    name="Optimal Age" 
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: "Optimal Age (years)", angle: -90, position: "insideLeft" }}
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
                    name="Assets" 
                    data={refreshOptimization} 
                    fill="hsl(var(--primary))"
                    onClick={(data) => handleChartClick(data, "Refresh Optimization")}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI-Powered Replacement Recommendations
            </CardTitle>
            <CardDescription>
              Predictive analytics with failure forecasting and proactive maintenance suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{rec.asset}</h4>
                        <Badge variant="outline">{rec.type}</Badge>
                        <Badge variant={getUrgencyBadgeVariant(rec.urgency)}>
                          {rec.urgency.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>Health Score: {rec.healthScore}%</span>
                        <span>•</span>
                        <span>Age: {rec.currentAge} years</span>
                        <span>•</span>
                        <span>Predicted Failure: {rec.predictedFailure}</span>
                        <span>•</span>
                        <span>AI Confidence: {rec.confidence}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{rec.healthScore}%</div>
                      <div className="text-xs text-muted-foreground">Health Score</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Health Score</span>
                      <span className="text-sm text-muted-foreground">{rec.healthScore}%</span>
                    </div>
                    <Progress value={rec.healthScore} className="h-2" />
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">CPU Degradation</div>
                      <Progress value={rec.metrics.cpuDegradation} className="h-1.5" />
                      <div className="text-xs text-right mt-0.5">{rec.metrics.cpuDegradation}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Memory Leaks</div>
                      <Progress value={rec.metrics.memoryLeaks} className="h-1.5" />
                      <div className="text-xs text-right mt-0.5">{rec.metrics.memoryLeaks}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Network Latency</div>
                      <Progress value={rec.metrics.networkLatency} className="h-1.5" />
                      <div className="text-xs text-right mt-0.5">{rec.metrics.networkLatency}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Error Rate</div>
                      <Progress value={rec.metrics.errorRate} className="h-1.5" />
                      <div className="text-xs text-right mt-0.5">{rec.metrics.errorRate}%</div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-md p-3 mb-2">
                    <div className="flex items-start gap-2">
                      <Brain className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm mb-1">AI Analysis</div>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Recommendation:</span>{" "}
                        <span className="font-medium" style={{ color: getUrgencyColor(rec.urgency) }}>
                          {rec.recommendation}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Est. Cost:</span>{" "}
                      <span className="font-semibold">{rec.estimatedCost}</span>
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

export default AssetHealth;
