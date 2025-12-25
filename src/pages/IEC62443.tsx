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
  ShieldCheck,
  ShieldAlert,
  Lock,
  Network,
  Server,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  FileCheck,
  Target,
  Layers,
  ArrowRight,
  Calendar,
  Users,
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

// Security Levels Data
const securityLevels = [
  { name: "SL 1 - Basic", target: 100, achieved: 98, zones: 12 },
  { name: "SL 2 - Enhanced", target: 100, achieved: 87, zones: 8 },
  { name: "SL 3 - Critical", target: 100, achieved: 72, zones: 4 },
  { name: "SL 4 - Maximum", target: 100, achieved: 45, zones: 2 },
];

// Foundational Requirements (FR) Compliance
const foundationalRequirements = [
  { id: "FR1", name: "Identification & Authentication", compliance: 92, controls: 18, passed: 17 },
  { id: "FR2", name: "Use Control", compliance: 88, controls: 14, passed: 12 },
  { id: "FR3", name: "System Integrity", compliance: 85, controls: 22, passed: 19 },
  { id: "FR4", name: "Data Confidentiality", compliance: 91, controls: 16, passed: 15 },
  { id: "FR5", name: "Restricted Data Flow", compliance: 78, controls: 12, passed: 9 },
  { id: "FR6", name: "Timely Response to Events", compliance: 83, controls: 20, passed: 17 },
  { id: "FR7", name: "Resource Availability", compliance: 95, controls: 15, passed: 14 },
];

// Radar chart data for FR compliance
const radarData = foundationalRequirements.map((fr) => ({
  subject: fr.id,
  fullName: fr.name,
  compliance: fr.compliance,
  target: 100,
}));

// Zone and Conduit Security
const zones = [
  { id: "Z1", name: "Enterprise Zone", level: "SL-1", status: "compliant", conduits: 4, devices: 156 },
  { id: "Z2", name: "DMZ", level: "SL-2", status: "compliant", conduits: 6, devices: 24 },
  { id: "Z3", name: "Manufacturing Zone", level: "SL-3", status: "warning", conduits: 8, devices: 89 },
  { id: "Z4", name: "Control Zone", level: "SL-3", status: "compliant", conduits: 5, devices: 45 },
  { id: "Z5", name: "Safety Zone", level: "SL-4", status: "critical", conduits: 3, devices: 18 },
  { id: "Z6", name: "Field Devices", level: "SL-2", status: "warning", conduits: 12, devices: 234 },
];

// Maturity Levels
const maturityData = [
  { category: "Policies & Procedures", current: 3, target: 4 },
  { category: "Risk Assessment", current: 3, target: 4 },
  { category: "Security Architecture", current: 2, target: 4 },
  { category: "Patch Management", current: 2, target: 3 },
  { category: "Incident Response", current: 3, target: 4 },
  { category: "Access Control", current: 4, target: 4 },
  { category: "Network Security", current: 3, target: 4 },
  { category: "Security Monitoring", current: 2, target: 4 },
];

// Compliance Trend
const complianceTrend = [
  { month: "Jul", overall: 68, fr1: 72, fr3: 65, fr5: 58 },
  { month: "Aug", overall: 72, fr1: 78, fr3: 70, fr5: 62 },
  { month: "Sep", overall: 75, fr1: 82, fr3: 74, fr5: 68 },
  { month: "Oct", overall: 79, fr1: 86, fr3: 78, fr5: 72 },
  { month: "Nov", overall: 82, fr1: 89, fr3: 82, fr5: 75 },
  { month: "Dec", overall: 86, fr1: 92, fr3: 85, fr5: 78 },
];

// Audit Findings
const auditFindings = [
  { id: "AF-001", finding: "Missing authentication for remote access", severity: "critical", fr: "FR1", status: "open", dueDate: "2024-01-15" },
  { id: "AF-002", finding: "Inadequate network segmentation in Zone 3", severity: "warning", fr: "FR5", status: "in-progress", dueDate: "2024-01-20" },
  { id: "AF-003", finding: "Outdated firmware on PLCs", severity: "warning", fr: "FR3", status: "in-progress", dueDate: "2024-01-25" },
  { id: "AF-004", finding: "Incomplete audit logging", severity: "info", fr: "FR6", status: "open", dueDate: "2024-02-01" },
  { id: "AF-005", finding: "Weak password policies on HMI systems", severity: "critical", fr: "FR1", status: "resolved", dueDate: "2024-01-10" },
  { id: "AF-006", finding: "Missing data encryption at rest", severity: "warning", fr: "FR4", status: "open", dueDate: "2024-02-05" },
];

// Component Security Lifecycle
const componentLifecycle = [
  { phase: "Specification", complete: 100, status: "done" },
  { phase: "Design", complete: 100, status: "done" },
  { phase: "Implementation", complete: 85, status: "active" },
  { phase: "Verification", complete: 60, status: "active" },
  { phase: "Validation", complete: 30, status: "pending" },
  { phase: "Operations", complete: 0, status: "pending" },
];

// Risk Assessment Summary
const riskDistribution = [
  { name: "Critical", value: 3, color: "hsl(var(--neon-pink))" },
  { name: "High", value: 8, color: "hsl(var(--neon-yellow))" },
  { name: "Medium", value: 15, color: "hsl(var(--neon-cyan))" },
  { name: "Low", value: 24, color: "hsl(var(--neon-green))" },
];

const getStatusType = (status: string) => {
  switch (status) {
    case "compliant":
    case "resolved":
    case "done":
      return "success";
    case "warning":
    case "in-progress":
    case "active":
      return "warning";
    case "critical":
    case "open":
      return "critical";
    default:
      return "info";
  }
};

const getSeverityType = (severity: string) => {
  switch (severity) {
    case "critical":
      return "critical";
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "info";
  }
};

const IEC62443 = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const overallCompliance = Math.round(
    foundationalRequirements.reduce((acc, fr) => acc + fr.compliance, 0) / foundationalRequirements.length
  );

  const openFindings = auditFindings.filter((f) => f.status === "open").length;
  const criticalFindings = auditFindings.filter((f) => f.severity === "critical" && f.status !== "resolved").length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              IEC 62443 Compliance
            </h1>
            <p className="text-muted-foreground mt-1">
              Industrial Automation and Control Systems Security
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusIndicator status="success" label="Last Audit" count={undefined} />
            <span className="text-sm text-muted-foreground">Dec 15, 2024</span>
            <StatusIndicator status={criticalFindings > 0 ? "critical" : "success"} label="Critical Issues" count={criticalFindings} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Compliance</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{overallCompliance}%</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-neon-green" />
                    <span className="text-sm text-neon-green">+4% this month</span>
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
              </div>
              <Progress value={overallCompliance} className="mt-4 h-2" />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Zones Monitored</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{zones.length}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusDot status="success" size="sm" />
                    <span className="text-sm text-muted-foreground">
                      {zones.filter((z) => z.status === "compliant").length} compliant
                    </span>
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full bg-neon-cyan/10 flex items-center justify-center">
                  <Network className="h-8 w-8 text-neon-cyan" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Findings</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{openFindings}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusDot status="critical" size="sm" pulse />
                    <span className="text-sm text-muted-foreground">{criticalFindings} critical</span>
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full bg-neon-yellow/10 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-neon-yellow" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Level Target</p>
                  <p className="text-3xl font-bold text-foreground mt-1">SL-3</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Target className="h-4 w-4 text-neon-cyan" />
                    <span className="text-sm text-muted-foreground">72% achieved</span>
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full bg-neon-purple/10 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-neon-purple" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="zones">Zones & Conduits</TabsTrigger>
            <TabsTrigger value="maturity">Maturity</TabsTrigger>
            <TabsTrigger value="findings">Audit Findings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Levels Progress */}
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Security Level Achievement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {securityLevels.map((level, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{level.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{level.zones} zones</span>
                          <Badge variant="outline" className={level.achieved >= 90 ? "text-neon-green border-neon-green/30" : level.achieved >= 70 ? "text-neon-yellow border-neon-yellow/30" : "text-neon-pink border-neon-pink/30"}>
                            {level.achieved}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={level.achieved} className="h-2" />
                    </div>
                  ))}
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
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={complianceTrend}>
                      <defs>
                        <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[50, 100]} />
                      <Tooltip content={<ChartTooltip title="Compliance %" valueFormatter={(val) => `${val}%`} accentColor="cyan" />} />
                      <Area type="monotone" dataKey="overall" stroke="hsl(var(--primary))" fill="url(#colorOverall)" strokeWidth={2} />
                      <Line type="monotone" dataKey="fr1" stroke="hsl(var(--neon-green))" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="fr5" stroke="hsl(var(--neon-yellow))" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Risk Distribution */}
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-primary" />
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

              {/* Component Lifecycle */}
              <Card className="border-border/50 bg-card/80 backdrop-blur lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Security Development Lifecycle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {componentLifecycle.map((phase, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${phase.status === "done" ? "bg-neon-green/20 text-neon-green" : phase.status === "active" ? "bg-neon-cyan/20 text-neon-cyan" : "bg-muted text-muted-foreground"}`}>
                          {phase.status === "done" ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : phase.status === "active" ? (
                            <Clock className="h-6 w-6" />
                          ) : (
                            <div className="h-3 w-3 rounded-full bg-current" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-foreground text-center">{phase.phase}</span>
                        <span className="text-xs text-muted-foreground">{phase.complete}%</span>
                        {index < componentLifecycle.length - 1 && (
                          <ArrowRight className="absolute transform translate-x-full text-border hidden md:block" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Requirements Tab */}
          <TabsContent value="requirements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FR Radar Chart */}
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Foundational Requirements Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <Radar name="Target" dataKey="target" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.1} strokeDasharray="5 5" />
                      <Radar name="Compliance" dataKey="compliance" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
                      <Tooltip content={<ChartTooltip title="FR Compliance" valueFormatter={(val) => `${val}%`} accentColor="cyan" />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* FR Details */}
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    Requirement Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {foundationalRequirements.map((fr) => (
                    <div key={fr.id} className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-primary border-primary/30">{fr.id}</Badge>
                          <span className="text-sm font-medium text-foreground">{fr.name}</span>
                        </div>
                        <StatusBadge status={fr.compliance >= 90 ? "success" : fr.compliance >= 75 ? "warning" : "critical"} label={`${fr.compliance}%`} size="sm" />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Controls: {fr.passed}/{fr.controls} passed</span>
                        <Progress value={(fr.passed / fr.controls) * 100} className="w-24 h-1.5" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Zones Tab */}
          <TabsContent value="zones" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {zones.map((zone) => (
                <Card key={zone.id} className="border-border/50 bg-card/80 backdrop-blur hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${zone.status === "compliant" ? "bg-neon-green/10" : zone.status === "warning" ? "bg-neon-yellow/10" : "bg-neon-pink/10"}`}>
                          <Server className={`h-5 w-5 ${zone.status === "compliant" ? "text-neon-green" : zone.status === "warning" ? "text-neon-yellow" : "text-neon-pink"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{zone.name}</h3>
                          <p className="text-xs text-muted-foreground">{zone.id}</p>
                        </div>
                      </div>
                      <StatusBadge status={getStatusType(zone.status)} label={zone.status} size="sm" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-2 rounded-lg bg-muted/30">
                        <p className="text-lg font-bold text-foreground">{zone.level}</p>
                        <p className="text-xs text-muted-foreground">Level</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/30">
                        <p className="text-lg font-bold text-foreground">{zone.conduits}</p>
                        <p className="text-xs text-muted-foreground">Conduits</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/30">
                        <p className="text-lg font-bold text-foreground">{zone.devices}</p>
                        <p className="text-xs text-muted-foreground">Devices</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Zone Topology Visualization */}
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Zone Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="flex items-center gap-4 flex-wrap justify-center">
                    {zones.slice(0, 3).map((zone, i) => (
                      <div key={zone.id} className="flex items-center gap-2">
                        <div className={`px-4 py-3 rounded-lg border-2 ${zone.status === "compliant" ? "border-neon-green/50 bg-neon-green/5" : zone.status === "warning" ? "border-neon-yellow/50 bg-neon-yellow/5" : "border-neon-pink/50 bg-neon-pink/5"}`}>
                          <p className="text-sm font-medium text-foreground">{zone.name}</p>
                          <p className="text-xs text-muted-foreground">{zone.level}</p>
                        </div>
                        {i < 2 && <ArrowRight className="h-5 w-5 text-border" />}
                      </div>
                    ))}
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="flex items-center gap-4 flex-wrap justify-center">
                    {zones.slice(3).map((zone, i) => (
                      <div key={zone.id} className="flex items-center gap-2">
                        <div className={`px-4 py-3 rounded-lg border-2 ${zone.status === "compliant" ? "border-neon-green/50 bg-neon-green/5" : zone.status === "warning" ? "border-neon-yellow/50 bg-neon-yellow/5" : "border-neon-pink/50 bg-neon-pink/5"}`}>
                          <p className="text-sm font-medium text-foreground">{zone.name}</p>
                          <p className="text-xs text-muted-foreground">{zone.level}</p>
                        </div>
                        {i < 2 && <ArrowRight className="h-5 w-5 text-border" />}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maturity Tab */}
          <TabsContent value="maturity" className="space-y-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Security Maturity Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={maturityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} horizontal={false} />
                    <XAxis type="number" domain={[0, 4]} stroke="hsl(var(--muted-foreground))" fontSize={12} ticks={[0, 1, 2, 3, 4]} />
                    <YAxis type="category" dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={140} />
                    <Tooltip content={<ChartTooltip title="Maturity Level" accentColor="cyan" />} />
                    <Bar dataKey="target" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} name="Target" />
                    <Bar dataKey="current" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Current" />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((level) => (
                <Card key={level} className="border-border/50 bg-card/80 backdrop-blur">
                  <CardContent className="p-4 text-center">
                    <div className={`h-12 w-12 mx-auto rounded-full flex items-center justify-center mb-3 ${level <= 2 ? "bg-neon-green/10 text-neon-green" : level === 3 ? "bg-neon-yellow/10 text-neon-yellow" : "bg-neon-cyan/10 text-neon-cyan"}`}>
                      <span className="text-xl font-bold">{level}</span>
                    </div>
                    <h3 className="font-semibold text-foreground">Level {level}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {level === 1 && "Initial / Ad-hoc"}
                      {level === 2 && "Managed"}
                      {level === 3 && "Defined"}
                      {level === 4 && "Optimizing"}
                    </p>
                    <p className="text-sm font-medium text-primary mt-2">
                      {maturityData.filter((m) => m.current >= level).length}/{maturityData.length}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Findings Tab */}
          <TabsContent value="findings" className="space-y-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Audit Findings & Remediation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditFindings.map((finding) => (
                    <div key={finding.id} className={`p-4 rounded-lg border ${finding.status === "resolved" ? "bg-neon-green/5 border-neon-green/20" : finding.severity === "critical" ? "bg-neon-pink/5 border-neon-pink/20" : "bg-card border-border/50"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-xs">{finding.id}</Badge>
                            <StatusIndicator status={getSeverityType(finding.severity)} label={finding.severity} size="sm" showIcon={false} />
                            <Badge variant="outline" className="text-primary border-primary/30 text-xs">{finding.fr}</Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground">{finding.finding}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {finding.dueDate}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={getStatusType(finding.status)} label={finding.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Findings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <XCircle className="h-8 w-8 mx-auto mb-3 text-neon-pink" />
                  <p className="text-3xl font-bold text-foreground">{auditFindings.filter((f) => f.status === "open").length}</p>
                  <p className="text-sm text-muted-foreground">Open Findings</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-neon-yellow" />
                  <p className="text-3xl font-bold text-foreground">{auditFindings.filter((f) => f.status === "in-progress").length}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-neon-green" />
                  <p className="text-3xl font-bold text-foreground">{auditFindings.filter((f) => f.status === "resolved").length}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default IEC62443;
