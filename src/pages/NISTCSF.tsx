import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusIndicator, StatusBadge, StatusDot } from "@/components/StatusIndicator";
import { ChartTooltip } from "@/components/ChartTooltip";
import {
  Shield,
  Search,
  Lock,
  Eye,
  Zap,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  FileCheck,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Building2,
  Users,
  Server,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// Core Functions Data
const coreFunctions = [
  {
    id: "ID",
    name: "Identify",
    icon: Search,
    color: "neon-cyan",
    compliance: 88,
    categories: 6,
    subcategories: 29,
    implemented: 25,
    description: "Develop organizational understanding to manage cybersecurity risk",
  },
  {
    id: "PR",
    name: "Protect",
    icon: Lock,
    color: "neon-green",
    compliance: 82,
    categories: 6,
    subcategories: 39,
    implemented: 32,
    description: "Implement safeguards to ensure delivery of critical services",
  },
  {
    id: "DE",
    name: "Detect",
    icon: Eye,
    color: "neon-yellow",
    compliance: 76,
    categories: 3,
    subcategories: 18,
    implemented: 14,
    description: "Develop activities to identify cybersecurity events",
  },
  {
    id: "RS",
    name: "Respond",
    icon: Zap,
    color: "neon-pink",
    compliance: 71,
    categories: 5,
    subcategories: 16,
    implemented: 11,
    description: "Develop activities to take action regarding detected events",
  },
  {
    id: "RC",
    name: "Recover",
    icon: RotateCcw,
    color: "neon-purple",
    compliance: 68,
    categories: 3,
    subcategories: 6,
    implemented: 4,
    description: "Develop activities to maintain resilience and restore capabilities",
  },
];

// Categories by Function
const categories = {
  ID: [
    { id: "ID.AM", name: "Asset Management", compliance: 92, controls: 6 },
    { id: "ID.BE", name: "Business Environment", compliance: 85, controls: 5 },
    { id: "ID.GV", name: "Governance", compliance: 88, controls: 4 },
    { id: "ID.RA", name: "Risk Assessment", compliance: 82, controls: 6 },
    { id: "ID.RM", name: "Risk Management Strategy", compliance: 90, controls: 3 },
    { id: "ID.SC", name: "Supply Chain Risk", compliance: 78, controls: 5 },
  ],
  PR: [
    { id: "PR.AC", name: "Access Control", compliance: 86, controls: 7 },
    { id: "PR.AT", name: "Awareness & Training", compliance: 79, controls: 5 },
    { id: "PR.DS", name: "Data Security", compliance: 84, controls: 8 },
    { id: "PR.IP", name: "Info Protection", compliance: 81, controls: 12 },
    { id: "PR.MA", name: "Maintenance", compliance: 88, controls: 2 },
    { id: "PR.PT", name: "Protective Technology", compliance: 75, controls: 5 },
  ],
  DE: [
    { id: "DE.AE", name: "Anomalies & Events", compliance: 78, controls: 5 },
    { id: "DE.CM", name: "Continuous Monitoring", compliance: 72, controls: 8 },
    { id: "DE.DP", name: "Detection Processes", compliance: 80, controls: 5 },
  ],
  RS: [
    { id: "RS.RP", name: "Response Planning", compliance: 75, controls: 1 },
    { id: "RS.CO", name: "Communications", compliance: 68, controls: 5 },
    { id: "RS.AN", name: "Analysis", compliance: 72, controls: 5 },
    { id: "RS.MI", name: "Mitigation", compliance: 70, controls: 3 },
    { id: "RS.IM", name: "Improvements", compliance: 74, controls: 2 },
  ],
  RC: [
    { id: "RC.RP", name: "Recovery Planning", compliance: 70, controls: 1 },
    { id: "RC.IM", name: "Improvements", compliance: 65, controls: 2 },
    { id: "RC.CO", name: "Communications", compliance: 68, controls: 3 },
  ],
};

// Radar data for core functions
const radarData = coreFunctions.map((fn) => ({
  subject: fn.id,
  fullName: fn.name,
  compliance: fn.compliance,
  target: 100,
}));

// Implementation Tiers
const implementationTiers = [
  { tier: 1, name: "Partial", description: "Ad-hoc, reactive", current: false },
  { tier: 2, name: "Risk Informed", description: "Risk-aware but not org-wide", current: false },
  { tier: 3, name: "Repeatable", description: "Formally approved, expressed as policy", current: true },
  { tier: 4, name: "Adaptive", description: "Continuous improvement based on lessons", current: false },
];

// Compliance Trend
const complianceTrend = [
  { month: "Jul", overall: 62, identify: 75, protect: 68, detect: 58, respond: 52, recover: 48 },
  { month: "Aug", overall: 66, identify: 78, protect: 72, detect: 62, respond: 56, recover: 52 },
  { month: "Sep", overall: 70, identify: 82, protect: 75, detect: 66, respond: 60, recover: 58 },
  { month: "Oct", overall: 73, identify: 84, protect: 78, detect: 70, respond: 65, recover: 62 },
  { month: "Nov", overall: 76, identify: 86, protect: 80, detect: 73, respond: 68, recover: 65 },
  { month: "Dec", overall: 77, identify: 88, protect: 82, detect: 76, respond: 71, recover: 68 },
];

// Gap Analysis
const gapAnalysis = [
  { category: "Asset Management", current: 92, target: 95, gap: 3, priority: "low" },
  { category: "Access Control", current: 86, target: 95, gap: 9, priority: "medium" },
  { category: "Continuous Monitoring", current: 72, target: 90, gap: 18, priority: "high" },
  { category: "Incident Response", current: 68, target: 90, gap: 22, priority: "critical" },
  { category: "Recovery Planning", current: 70, target: 85, gap: 15, priority: "high" },
  { category: "Supply Chain Risk", current: 78, target: 90, gap: 12, priority: "medium" },
];

// Action Items
const actionItems = [
  { id: "AI-001", action: "Implement automated asset discovery", function: "ID", priority: "high", status: "in-progress", dueDate: "2024-01-20" },
  { id: "AI-002", action: "Deploy SIEM for continuous monitoring", function: "DE", priority: "critical", status: "open", dueDate: "2024-01-15" },
  { id: "AI-003", action: "Update incident response playbooks", function: "RS", priority: "high", status: "in-progress", dueDate: "2024-01-25" },
  { id: "AI-004", action: "Conduct tabletop recovery exercise", function: "RC", priority: "medium", status: "open", dueDate: "2024-02-01" },
  { id: "AI-005", action: "Implement MFA for privileged accounts", function: "PR", priority: "critical", status: "completed", dueDate: "2024-01-10" },
  { id: "AI-006", action: "Review third-party vendor assessments", function: "ID", priority: "medium", status: "open", dueDate: "2024-02-05" },
];

// Profiles
const profiles = [
  { name: "Current Profile", score: 77, lastUpdated: "Dec 15, 2024" },
  { name: "Target Profile", score: 92, lastUpdated: "Oct 1, 2024" },
];

// Risk distribution
const riskDistribution = [
  { name: "Critical", value: 4, color: "hsl(var(--neon-pink))" },
  { name: "High", value: 12, color: "hsl(var(--neon-yellow))" },
  { name: "Medium", value: 18, color: "hsl(var(--neon-cyan))" },
  { name: "Low", value: 28, color: "hsl(var(--neon-green))" },
];

const getStatusType = (status: string) => {
  switch (status) {
    case "completed":
      return "success";
    case "in-progress":
      return "warning";
    case "open":
      return "critical";
    default:
      return "info";
  }
};

const getPriorityType = (priority: string) => {
  switch (priority) {
    case "critical":
      return "critical";
    case "high":
      return "warning";
    case "medium":
      return "info";
    default:
      return "success";
  }
};

const getColorClass = (color: string) => {
  return `text-${color}`;
};

const getBgColorClass = (color: string) => {
  return `bg-${color}/10`;
};

const NISTCSF = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  const overallCompliance = Math.round(
    coreFunctions.reduce((acc, fn) => acc + fn.compliance, 0) / coreFunctions.length
  );

  const openActions = actionItems.filter((a) => a.status === "open").length;
  const criticalActions = actionItems.filter((a) => a.priority === "critical" && a.status !== "completed").length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              NIST CSF Compliance
            </h1>
            <p className="text-muted-foreground mt-1">
              Cybersecurity Framework - Core Functions Assessment
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-neon-cyan border-neon-cyan/30 px-3 py-1">
              Tier 3 - Repeatable
            </Badge>
            <StatusIndicator status={criticalActions > 0 ? "critical" : "success"} label="Critical Actions" count={criticalActions} />
          </div>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Compliance</p>
                  <p className="text-4xl font-bold text-foreground mt-1">{overallCompliance}%</p>
                  <div className="flex items-center gap-2 mt-2">
                    <ArrowUp className="h-4 w-4 text-neon-green" />
                    <span className="text-sm text-neon-green">+5% from last quarter</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {profiles.map((profile, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${index === 0 ? "bg-primary/20 text-primary" : "bg-neon-green/20 text-neon-green"}`}>
                        {profile.score}%
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{profile.name}</p>
                        <p className="text-xs text-muted-foreground">{profile.lastUpdated}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Progress value={overallCompliance} className="mt-4 h-2" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Current: {overallCompliance}%</span>
                <span>Target: 92%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Actions</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{openActions}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusDot status="critical" size="sm" pulse />
                    <span className="text-sm text-muted-foreground">{criticalActions} critical</span>
                  </div>
                </div>
                <div className="h-14 w-14 rounded-full bg-neon-yellow/10 flex items-center justify-center">
                  <AlertTriangle className="h-7 w-7 text-neon-yellow" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Controls Implemented</p>
                  <p className="text-3xl font-bold text-foreground mt-1">86/108</p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle2 className="h-4 w-4 text-neon-green" />
                    <span className="text-sm text-muted-foreground">80% complete</span>
                  </div>
                </div>
                <div className="h-14 w-14 rounded-full bg-neon-green/10 flex items-center justify-center">
                  <FileCheck className="h-7 w-7 text-neon-green" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Functions Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {coreFunctions.map((fn) => {
            const Icon = fn.icon;
            return (
              <Card
                key={fn.id}
                className={`border-border/50 bg-card/80 backdrop-blur cursor-pointer transition-all hover:scale-[1.02] ${selectedFunction === fn.id ? `border-${fn.color}/50` : ""}`}
                onClick={() => setSelectedFunction(selectedFunction === fn.id ? null : fn.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-${fn.color}/10`}>
                      <Icon className={`h-5 w-5 text-${fn.color}`} />
                    </div>
                    <div>
                      <Badge variant="outline" className={`text-${fn.color} border-${fn.color}/30 text-xs`}>{fn.id}</Badge>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">{fn.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{fn.description}</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Compliance</span>
                      <span className={`font-bold text-${fn.color}`}>{fn.compliance}%</span>
                    </div>
                    <Progress value={fn.compliance} className="h-1.5" />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>{fn.implemented}/{fn.subcategories} controls</span>
                    <span>{fn.categories} categories</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="functions">Functions & Categories</TabsTrigger>
            <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
            <TabsTrigger value="tiers">Implementation Tiers</TabsTrigger>
            <TabsTrigger value="actions">Action Items</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Core Functions Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <Radar name="Target" dataKey="target" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.1} strokeDasharray="5 5" />
                      <Radar name="Compliance" dataKey="compliance" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
                      <Tooltip content={<ChartTooltip title="Function Compliance" valueFormatter={(val) => `${val}%`} accentColor="cyan" />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Compliance Trend */}
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Compliance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={complianceTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[40, 100]} />
                      <Tooltip content={<ChartTooltip title="Compliance %" valueFormatter={(val) => `${val}%`} accentColor="cyan" />} />
                      <Legend />
                      <Line type="monotone" dataKey="overall" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} name="Overall" />
                      <Line type="monotone" dataKey="identify" stroke="hsl(var(--neon-cyan))" strokeWidth={1.5} dot={false} strokeDasharray="5 5" name="Identify" />
                      <Line type="monotone" dataKey="detect" stroke="hsl(var(--neon-yellow))" strokeWidth={1.5} dot={false} strokeDasharray="5 5" name="Detect" />
                      <Line type="monotone" dataKey="recover" stroke="hsl(var(--neon-purple))" strokeWidth={1.5} dot={false} strokeDasharray="5 5" name="Recover" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Risk Distribution */}
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip title="Risks" accentColor="cyan" />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {riskDistribution.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-border/50 bg-card/80 backdrop-blur lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Framework Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <Building2 className="h-6 w-6 mx-auto mb-2 text-neon-cyan" />
                      <p className="text-2xl font-bold text-foreground">5</p>
                      <p className="text-xs text-muted-foreground">Core Functions</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <Server className="h-6 w-6 mx-auto mb-2 text-neon-green" />
                      <p className="text-2xl font-bold text-foreground">23</p>
                      <p className="text-xs text-muted-foreground">Categories</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <FileCheck className="h-6 w-6 mx-auto mb-2 text-neon-yellow" />
                      <p className="text-2xl font-bold text-foreground">108</p>
                      <p className="text-xs text-muted-foreground">Subcategories</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <Users className="h-6 w-6 mx-auto mb-2 text-neon-purple" />
                      <p className="text-2xl font-bold text-foreground">15</p>
                      <p className="text-xs text-muted-foreground">Stakeholders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Functions & Categories Tab */}
          <TabsContent value="functions" className="space-y-6">
            {coreFunctions.map((fn) => {
              const Icon = fn.icon;
              const fnCategories = categories[fn.id as keyof typeof categories] || [];
              return (
                <Card key={fn.id} className="border-border/50 bg-card/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-${fn.color}/10`}>
                        <Icon className={`h-5 w-5 text-${fn.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-${fn.color} border-${fn.color}/30`}>{fn.id}</Badge>
                          <span>{fn.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground font-normal mt-1">{fn.description}</p>
                      </div>
                      <div className="ml-auto">
                        <StatusBadge status={fn.compliance >= 80 ? "success" : fn.compliance >= 70 ? "warning" : "critical"} label={`${fn.compliance}%`} />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {fnCategories.map((cat) => (
                        <div key={cat.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">{cat.id}</Badge>
                            <span className={`text-sm font-bold ${cat.compliance >= 85 ? "text-neon-green" : cat.compliance >= 75 ? "text-neon-yellow" : "text-neon-pink"}`}>
                              {cat.compliance}%
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground">{cat.name}</p>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>{cat.controls} controls</span>
                            <Progress value={cat.compliance} className="w-16 h-1.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Gap Analysis Tab */}
          <TabsContent value="gaps" className="space-y-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Gap Analysis - Current vs Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={gapAnalysis} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis type="category" dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={150} />
                    <Tooltip content={<ChartTooltip title="Compliance %" valueFormatter={(val) => `${val}%`} accentColor="cyan" />} />
                    <Legend />
                    <Bar dataKey="current" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Current" />
                    <Bar dataKey="target" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gapAnalysis.map((item, index) => (
                <Card key={index} className={`border-border/50 bg-card/80 backdrop-blur ${item.priority === "critical" ? "border-neon-pink/30" : item.priority === "high" ? "border-neon-yellow/30" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{item.category}</h3>
                      <StatusIndicator status={getPriorityType(item.priority)} label={item.priority} size="sm" showIcon={false} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Current</span>
                        <span className="font-medium text-foreground">{item.current}%</span>
                      </div>
                      <Progress value={item.current} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Target</span>
                        <span className="font-medium text-neon-green">{item.target}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                        <span className="text-muted-foreground">Gap</span>
                        <span className={`font-bold ${item.gap > 15 ? "text-neon-pink" : item.gap > 10 ? "text-neon-yellow" : "text-neon-cyan"}`}>
                          {item.gap}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Implementation Tiers Tab */}
          <TabsContent value="tiers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {implementationTiers.map((tier) => (
                <Card key={tier.tier} className={`border-border/50 bg-card/80 backdrop-blur ${tier.current ? "border-primary ring-2 ring-primary/20" : ""}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4 ${tier.current ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                      <span className="text-2xl font-bold">{tier.tier}</span>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                    {tier.current && (
                      <Badge className="mt-4 bg-primary/20 text-primary border-primary/30">Current Tier</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Tier Progression Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-8">
                    {[
                      { tier: 1, status: "completed", date: "Q1 2023", items: ["Basic risk assessment", "Ad-hoc security practices"] },
                      { tier: 2, status: "completed", date: "Q3 2023", items: ["Risk-informed decisions", "Management approval"] },
                      { tier: 3, status: "current", date: "Q4 2024", items: ["Formal policies", "Regular risk assessments", "Organizational adoption"] },
                      { tier: 4, status: "planned", date: "Q2 2025", items: ["Continuous improvement", "Lessons learned integration", "Predictive analytics"] },
                    ].map((milestone, index) => (
                      <div key={index} className="relative pl-20">
                        <div className={`absolute left-6 w-5 h-5 rounded-full border-2 ${milestone.status === "completed" ? "bg-neon-green border-neon-green" : milestone.status === "current" ? "bg-primary border-primary animate-pulse" : "bg-muted border-border"}`} />
                        <div className={`p-4 rounded-lg ${milestone.status === "current" ? "bg-primary/10 border border-primary/30" : "bg-muted/30"}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">Tier {milestone.tier}</h4>
                            <Badge variant="outline" className={milestone.status === "completed" ? "text-neon-green border-neon-green/30" : milestone.status === "current" ? "text-primary border-primary/30" : ""}>
                              {milestone.date}
                            </Badge>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {milestone.items.map((item, i) => (
                              <li key={i} className="flex items-center gap-2">
                                {milestone.status === "completed" ? (
                                  <CheckCircle2 className="h-3 w-3 text-neon-green" />
                                ) : milestone.status === "current" ? (
                                  <Clock className="h-3 w-3 text-primary" />
                                ) : (
                                  <Minus className="h-3 w-3" />
                                )}
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Action Items Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <XCircle className="h-8 w-8 mx-auto mb-3 text-neon-pink" />
                  <p className="text-3xl font-bold text-foreground">{actionItems.filter((a) => a.status === "open").length}</p>
                  <p className="text-sm text-muted-foreground">Open Actions</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-neon-yellow" />
                  <p className="text-3xl font-bold text-foreground">{actionItems.filter((a) => a.status === "in-progress").length}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-neon-green" />
                  <p className="text-3xl font-bold text-foreground">{actionItems.filter((a) => a.status === "completed").length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Action Items & Remediation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actionItems.map((action) => (
                    <div key={action.id} className={`p-4 rounded-lg border ${action.status === "completed" ? "bg-neon-green/5 border-neon-green/20" : action.priority === "critical" ? "bg-neon-pink/5 border-neon-pink/20" : "bg-card border-border/50"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-xs">{action.id}</Badge>
                            <StatusIndicator status={getPriorityType(action.priority)} label={action.priority} size="sm" showIcon={false} />
                            <Badge variant="outline" className={`text-xs ${action.function === "ID" ? "text-neon-cyan border-neon-cyan/30" : action.function === "PR" ? "text-neon-green border-neon-green/30" : action.function === "DE" ? "text-neon-yellow border-neon-yellow/30" : action.function === "RS" ? "text-neon-pink border-neon-pink/30" : "text-neon-purple border-neon-purple/30"}`}>
                              {action.function}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground">{action.action}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {action.dueDate}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={getStatusType(action.status)} label={action.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default NISTCSF;
