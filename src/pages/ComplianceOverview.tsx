import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StatusIndicator, StatusBadge, StatusDot } from "@/components/StatusIndicator";
import { ChartTooltip } from "@/components/ChartTooltip";
import {
  Shield,
  Target,
  ListChecks,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Layers,
  GitCompare,
  BarChart3,
  PieChart as PieChartIcon,
  FileWarning,
  Lightbulb,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Sankey,
  Layer,
  Rectangle,
} from "recharts";

// Framework compliance data
const frameworkScores = [
  {
    id: "iec62443",
    name: "IEC 62443",
    fullName: "Industrial Automation Security",
    score: 72,
    trend: 5,
    icon: Shield,
    color: "hsl(var(--chart-1))",
    status: "warning" as const,
    lastAudit: "2024-01-10",
    controls: { total: 127, implemented: 92, partial: 23, missing: 12 },
  },
  {
    id: "nistcsf",
    name: "NIST CSF",
    fullName: "Cybersecurity Framework",
    score: 78,
    trend: 8,
    icon: Target,
    color: "hsl(var(--chart-2))",
    status: "warning" as const,
    lastAudit: "2024-01-08",
    controls: { total: 108, implemented: 84, partial: 16, missing: 8 },
  },
  {
    id: "ciscontrols",
    name: "CIS Controls",
    fullName: "Critical Security Controls v8",
    score: 68,
    trend: -2,
    icon: ListChecks,
    color: "hsl(var(--chart-3))",
    status: "warning" as const,
    lastAudit: "2024-01-12",
    controls: { total: 153, implemented: 104, partial: 31, missing: 18 },
  },
];

// Cross-mapping data between frameworks
const crossMappingData = [
  {
    category: "Access Control",
    iec62443: { ref: "FR1", score: 85, status: "success" },
    nistcsf: { ref: "PR.AC", score: 82, status: "success" },
    ciscontrols: { ref: "CIS 5,6", score: 78, status: "warning" },
    alignment: 92,
  },
  {
    category: "System Integrity",
    iec62443: { ref: "FR3", score: 70, status: "warning" },
    nistcsf: { ref: "PR.DS", score: 75, status: "warning" },
    ciscontrols: { ref: "CIS 4,10", score: 65, status: "warning" },
    alignment: 85,
  },
  {
    category: "Incident Response",
    iec62443: { ref: "FR6", score: 65, status: "warning" },
    nistcsf: { ref: "RS.RP", score: 88, status: "success" },
    ciscontrols: { ref: "CIS 17", score: 72, status: "warning" },
    alignment: 78,
  },
  {
    category: "Data Protection",
    iec62443: { ref: "FR4", score: 78, status: "warning" },
    nistcsf: { ref: "PR.DS", score: 80, status: "success" },
    ciscontrols: { ref: "CIS 3", score: 85, status: "success" },
    alignment: 95,
  },
  {
    category: "Network Security",
    iec62443: { ref: "FR5", score: 82, status: "success" },
    nistcsf: { ref: "PR.PT", score: 76, status: "warning" },
    ciscontrols: { ref: "CIS 12,13", score: 70, status: "warning" },
    alignment: 88,
  },
  {
    category: "Asset Management",
    iec62443: { ref: "FR1.1", score: 60, status: "warning" },
    nistcsf: { ref: "ID.AM", score: 72, status: "warning" },
    ciscontrols: { ref: "CIS 1,2", score: 68, status: "warning" },
    alignment: 82,
  },
  {
    category: "Vulnerability Mgmt",
    iec62443: { ref: "FR2", score: 55, status: "critical" },
    nistcsf: { ref: "ID.RA", score: 62, status: "warning" },
    ciscontrols: { ref: "CIS 7", score: 58, status: "critical" },
    alignment: 90,
  },
  {
    category: "Security Monitoring",
    iec62443: { ref: "FR6.1", score: 75, status: "warning" },
    nistcsf: { ref: "DE.CM", score: 85, status: "success" },
    ciscontrols: { ref: "CIS 8", score: 80, status: "success" },
    alignment: 93,
  },
];

// Gap analysis data
const gapAnalysis = [
  {
    id: 1,
    area: "Vulnerability Management",
    severity: "critical",
    frameworks: ["IEC 62443", "CIS Controls"],
    gap: "Automated vulnerability scanning coverage below 60%",
    impact: "Unpatched systems exposed to known exploits",
    recommendation: "Deploy enterprise vulnerability scanner with automated remediation",
    effort: "High",
    priority: 1,
  },
  {
    id: 2,
    area: "Asset Inventory",
    severity: "warning",
    frameworks: ["IEC 62443", "NIST CSF", "CIS Controls"],
    gap: "OT asset discovery incomplete - 15% unidentified devices",
    impact: "Shadow IT and unknown attack surface",
    recommendation: "Implement passive network discovery for OT environments",
    effort: "Medium",
    priority: 2,
  },
  {
    id: 3,
    area: "Incident Response",
    severity: "warning",
    frameworks: ["IEC 62443", "CIS Controls"],
    gap: "ICS-specific playbooks not developed",
    impact: "Delayed response to industrial control system incidents",
    recommendation: "Create ICS-specific incident response procedures",
    effort: "Medium",
    priority: 3,
  },
  {
    id: 4,
    area: "Network Segmentation",
    severity: "warning",
    frameworks: ["NIST CSF", "CIS Controls"],
    gap: "DMZ architecture incomplete for 3 production zones",
    impact: "Lateral movement risk between IT and OT networks",
    recommendation: "Deploy next-gen firewalls with zone-based policies",
    effort: "High",
    priority: 4,
  },
  {
    id: 5,
    area: "Security Awareness",
    severity: "info",
    frameworks: ["NIST CSF", "CIS Controls"],
    gap: "OT-specific security training not mandatory",
    impact: "Human error in industrial environment security",
    recommendation: "Develop role-based security awareness program",
    effort: "Low",
    priority: 5,
  },
];

// Radar chart data for framework comparison
const radarData = [
  { category: "Access Control", IEC62443: 85, NISTCSF: 82, CISControls: 78 },
  { category: "System Integrity", IEC62443: 70, NISTCSF: 75, CISControls: 65 },
  { category: "Incident Response", IEC62443: 65, NISTCSF: 88, CISControls: 72 },
  { category: "Data Protection", IEC62443: 78, NISTCSF: 80, CISControls: 85 },
  { category: "Network Security", IEC62443: 82, NISTCSF: 76, CISControls: 70 },
  { category: "Asset Management", IEC62443: 60, NISTCSF: 72, CISControls: 68 },
  { category: "Vulnerability Mgmt", IEC62443: 55, NISTCSF: 62, CISControls: 58 },
  { category: "Security Monitoring", IEC62443: 75, NISTCSF: 85, CISControls: 80 },
];

// Control implementation distribution
const implementationData = [
  { name: "Implemented", IEC62443: 92, NISTCSF: 84, CISControls: 104 },
  { name: "Partial", IEC62443: 23, NISTCSF: 16, CISControls: 31 },
  { name: "Missing", IEC62443: 12, NISTCSF: 8, CISControls: 18 },
];

// Unified recommendations
const unifiedRecommendations = [
  {
    id: 1,
    title: "Enterprise Vulnerability Management Platform",
    description: "Deploy automated scanning and remediation across IT/OT environments",
    frameworks: ["IEC 62443", "NIST CSF", "CIS Controls"],
    impact: "High",
    effort: "High",
    scoreImprovement: { iec62443: 8, nistcsf: 5, ciscontrols: 10 },
  },
  {
    id: 2,
    title: "Unified Asset Discovery Solution",
    description: "Implement passive and active discovery for complete asset visibility",
    frameworks: ["IEC 62443", "NIST CSF", "CIS Controls"],
    impact: "High",
    effort: "Medium",
    scoreImprovement: { iec62443: 6, nistcsf: 4, ciscontrols: 7 },
  },
  {
    id: 3,
    title: "ICS Incident Response Playbooks",
    description: "Develop and test industrial control system-specific response procedures",
    frameworks: ["IEC 62443", "NIST CSF"],
    impact: "Medium",
    effort: "Medium",
    scoreImprovement: { iec62443: 5, nistcsf: 3, ciscontrols: 4 },
  },
  {
    id: 4,
    title: "Zero Trust Network Architecture",
    description: "Implement microsegmentation and continuous verification",
    frameworks: ["NIST CSF", "CIS Controls"],
    impact: "High",
    effort: "High",
    scoreImprovement: { iec62443: 4, nistcsf: 6, ciscontrols: 8 },
  },
];

const ComplianceOverview = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const overallScore = Math.round(
    frameworkScores.reduce((acc, f) => acc + f.score, 0) / frameworkScores.length
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-emerald-400";
      case "warning":
        return "text-amber-400";
      case "critical":
        return "text-rose-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "warning":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "info":
        return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Unified Compliance Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Cross-framework analysis with gap identification and remediation tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-2 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Last sync: 2 hours ago
            </Badge>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <svg className="w-32 h-32 -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#overallGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(overallScore / 100) * 352} 352`}
                    />
                    <defs>
                      <linearGradient id="overallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                        <stop offset="50%" stopColor="hsl(var(--chart-2))" />
                        <stop offset="100%" stopColor="hsl(var(--chart-3))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{overallScore}%</span>
                    <span className="text-xs text-muted-foreground">Unified Score</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {frameworkScores.map((framework) => {
                  const Icon = framework.icon;
                  return (
                    <div
                      key={framework.id}
                      className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${framework.color}20` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: framework.color }} />
                        </div>
                        <div>
                          <p className="font-semibold">{framework.name}</p>
                          <p className="text-xs text-muted-foreground">{framework.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-3xl font-bold">{framework.score}%</p>
                          <div className="flex items-center gap-1 mt-1">
                            {framework.trend > 0 ? (
                              <TrendingUp className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-rose-400" />
                            )}
                            <span
                              className={`text-xs ${
                                framework.trend > 0 ? "text-emerald-400" : "text-rose-400"
                              }`}
                            >
                              {framework.trend > 0 ? "+" : ""}
                              {framework.trend}% this month
                            </span>
                          </div>
                        </div>
                        <StatusDot status={framework.status} pulse size="md" />
                      </div>
                      <Progress value={framework.score} className="mt-3 h-1.5" />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="crossmap" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="crossmap" className="gap-2">
              <GitCompare className="h-4 w-4" />
              Cross-Mapping
            </TabsTrigger>
            <TabsTrigger value="gaps" className="gap-2">
              <FileWarning className="h-4 w-4" />
              Gap Analysis
            </TabsTrigger>
            <TabsTrigger value="comparison" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Comparison
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Recommendations
            </TabsTrigger>
          </TabsList>

          {/* Cross-Mapping Tab */}
          <TabsContent value="crossmap" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Framework Control Mapping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                            Control Category
                          </th>
                          <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                              <Shield className="h-4 w-4" style={{ color: "hsl(var(--chart-1))" }} />
                              IEC 62443
                            </div>
                          </th>
                          <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                              <Target className="h-4 w-4" style={{ color: "hsl(var(--chart-2))" }} />
                              NIST CSF
                            </div>
                          </th>
                          <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                              <ListChecks className="h-4 w-4" style={{ color: "hsl(var(--chart-3))" }} />
                              CIS Controls
                            </div>
                          </th>
                          <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                            Alignment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {crossMappingData.map((row, idx) => (
                          <tr
                            key={idx}
                            className={`border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer ${
                              selectedCategory === row.category ? "bg-primary/10" : ""
                            }`}
                            onClick={() =>
                              setSelectedCategory(
                                selectedCategory === row.category ? null : row.category
                              )
                            }
                          >
                            <td className="p-3 font-medium">{row.category}</td>
                            <td className="p-3 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  style={{
                                    borderColor: "hsl(var(--chart-1))",
                                    color: "hsl(var(--chart-1))",
                                  }}
                                >
                                  {row.iec62443.ref}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <StatusDot
                                    status={row.iec62443.status as "success" | "warning" | "critical"}
                                    size="sm"
                                  />
                                  <span className="text-sm">{row.iec62443.score}%</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  style={{
                                    borderColor: "hsl(var(--chart-2))",
                                    color: "hsl(var(--chart-2))",
                                  }}
                                >
                                  {row.nistcsf.ref}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <StatusDot
                                    status={row.nistcsf.status as "success" | "warning" | "critical"}
                                    size="sm"
                                  />
                                  <span className="text-sm">{row.nistcsf.score}%</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  style={{
                                    borderColor: "hsl(var(--chart-3))",
                                    color: "hsl(var(--chart-3))",
                                  }}
                                >
                                  {row.ciscontrols.ref}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <StatusDot
                                    status={row.ciscontrols.status as "success" | "warning" | "critical"}
                                    size="sm"
                                  />
                                  <span className="text-sm">{row.ciscontrols.score}%</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Progress value={row.alignment} className="w-16 h-2" />
                                <span className="text-sm font-medium">{row.alignment}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Control Status Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {frameworkScores.map((framework) => {
                      const Icon = framework.icon;
                      const total = framework.controls.total;
                      return (
                        <div key={framework.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" style={{ color: framework.color }} />
                            <span className="font-medium text-sm">{framework.name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {framework.controls.total} controls
                            </span>
                          </div>
                          <div className="flex h-3 rounded-full overflow-hidden bg-muted/30">
                            <div
                              className="bg-emerald-500 transition-all"
                              style={{
                                width: `${(framework.controls.implemented / total) * 100}%`,
                              }}
                            />
                            <div
                              className="bg-amber-500 transition-all"
                              style={{
                                width: `${(framework.controls.partial / total) * 100}%`,
                              }}
                            />
                            <div
                              className="bg-rose-500 transition-all"
                              style={{
                                width: `${(framework.controls.missing / total) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-emerald-500" />
                              {framework.controls.implemented} Implemented
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-amber-500" />
                              {framework.controls.partial} Partial
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-rose-500" />
                              {framework.controls.missing} Missing
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gap Analysis Tab */}
          <TabsContent value="gaps" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-rose-500/10 border-rose-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-rose-400 text-sm font-medium">Critical Gaps</p>
                      <p className="text-3xl font-bold text-rose-400">
                        {gapAnalysis.filter((g) => g.severity === "critical").length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-rose-400/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/10 border-amber-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-400 text-sm font-medium">Warning Gaps</p>
                      <p className="text-3xl font-bold text-amber-400">
                        {gapAnalysis.filter((g) => g.severity === "warning").length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-amber-400/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-sky-500/10 border-sky-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sky-400 text-sm font-medium">Informational</p>
                      <p className="text-3xl font-bold text-sky-400">
                        {gapAnalysis.filter((g) => g.severity === "info").length}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-sky-400/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary text-sm font-medium">Cross-Framework</p>
                      <p className="text-3xl font-bold text-primary">
                        {gapAnalysis.filter((g) => g.frameworks.length >= 2).length}
                      </p>
                    </div>
                    <Layers className="h-8 w-8 text-primary/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileWarning className="h-5 w-5 text-primary" />
                  Identified Compliance Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gapAnalysis.map((gap) => (
                    <div
                      key={gap.id}
                      className="p-4 rounded-xl border border-border/50 bg-background/50 hover:border-primary/30 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className="flex items-center gap-3 lg:w-48 shrink-0">
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(
                              gap.severity
                            )}`}
                          >
                            P{gap.priority}
                          </div>
                          <Badge
                            variant="outline"
                            className={getSeverityColor(gap.severity)}
                          >
                            {gap.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{gap.area}</h4>
                            <div className="flex gap-1">
                              {gap.frameworks.map((f, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {f}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{gap.gap}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
                            <span className="flex items-center gap-1 text-rose-400">
                              <AlertTriangle className="h-3 w-3" />
                              Impact: {gap.impact}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              Effort: {gap.effort}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
                            <p className="text-sm">{gap.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Framework Capability Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis
                          dataKey="category"
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                        />
                        <Radar
                          name="IEC 62443"
                          dataKey="IEC62443"
                          stroke="hsl(var(--chart-1))"
                          fill="hsl(var(--chart-1))"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                        <Radar
                          name="NIST CSF"
                          dataKey="NISTCSF"
                          stroke="hsl(var(--chart-2))"
                          fill="hsl(var(--chart-2))"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                        <Radar
                          name="CIS Controls"
                          dataKey="CISControls"
                          stroke="hsl(var(--chart-3))"
                          fill="hsl(var(--chart-3))"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                        <Tooltip content={<ChartTooltip accentColor="cyan" />} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Control Implementation by Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={implementationData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fill: "hsl(var(--muted-foreground))" }}
                          width={80}
                        />
                        <Tooltip content={<ChartTooltip accentColor="cyan" />} />
                        <Legend />
                        <Bar
                          dataKey="IEC62443"
                          name="IEC 62443"
                          fill="hsl(var(--chart-1))"
                          radius={[0, 4, 4, 0]}
                        />
                        <Bar
                          dataKey="NISTCSF"
                          name="NIST CSF"
                          fill="hsl(var(--chart-2))"
                          radius={[0, 4, 4, 0]}
                        />
                        <Bar
                          dataKey="CISControls"
                          name="CIS Controls"
                          fill="hsl(var(--chart-3))"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Framework Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {frameworkScores.map((framework) => {
                const Icon = framework.icon;
                const strengths = radarData
                  .map((d) => ({
                    category: d.category,
                    score: d[framework.id === "iec62443" ? "IEC62443" : framework.id === "nistcsf" ? "NISTCSF" : "CISControls"] as number,
                  }))
                  .sort((a, b) => b.score - a.score);

                return (
                  <Card key={framework.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Icon className="h-5 w-5" style={{ color: framework.color }} />
                        {framework.name} Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Top Strengths</p>
                        {strengths.slice(0, 3).map((s, i) => (
                          <div key={i} className="flex items-center justify-between py-1">
                            <span className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              {s.category}
                            </span>
                            <span className="text-sm font-medium text-emerald-400">{s.score}%</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border/50 pt-4">
                        <p className="text-xs text-muted-foreground mb-2">Areas for Improvement</p>
                        {strengths.slice(-2).map((s, i) => (
                          <div key={i} className="flex items-center justify-between py-1">
                            <span className="text-sm flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-amber-400" />
                              {s.category}
                            </span>
                            <span className="text-sm font-medium text-amber-400">{s.score}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                  Unified Remediation Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unifiedRecommendations.map((rec, idx) => (
                    <div
                      key={rec.id}
                      className="p-5 rounded-xl border border-border/50 bg-gradient-to-r from-background to-primary/5 hover:border-primary/30 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex items-center gap-4 lg:w-2/5">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Frameworks</p>
                            <div className="flex flex-wrap gap-1">
                              {rec.frameworks.map((f, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {f}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Impact</p>
                            <StatusBadge
                              status={rec.impact === "High" ? "critical" : "warning"}
                              label={rec.impact}
                              size="sm"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Effort</p>
                            <Badge variant="outline">{rec.effort}</Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Score Impact</p>
                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                              <TrendingUp className="h-4 w-4" />
                              <span>
                                +{rec.scoreImprovement.iec62443 + rec.scoreImprovement.nistcsf + rec.scoreImprovement.ciscontrols}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/30">
                        <p className="text-xs text-muted-foreground mb-2">Projected Score Improvements</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" style={{ color: "hsl(var(--chart-1))" }} />
                            <span className="text-sm">IEC 62443</span>
                            <span className="ml-auto text-sm font-medium text-emerald-400">
                              +{rec.scoreImprovement.iec62443}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" style={{ color: "hsl(var(--chart-2))" }} />
                            <span className="text-sm">NIST CSF</span>
                            <span className="ml-auto text-sm font-medium text-emerald-400">
                              +{rec.scoreImprovement.nistcsf}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ListChecks className="h-4 w-4" style={{ color: "hsl(var(--chart-3))" }} />
                            <span className="text-sm">CIS Controls</span>
                            <span className="ml-auto text-sm font-medium text-emerald-400">
                              +{rec.scoreImprovement.ciscontrols}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projected Compliance After Remediation */}
            <Card>
              <CardHeader>
                <CardTitle>Projected Compliance After Full Remediation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {frameworkScores.map((framework) => {
                    const Icon = framework.icon;
                    const improvement = unifiedRecommendations.reduce(
                      (acc, rec) =>
                        acc +
                        rec.scoreImprovement[
                          framework.id as keyof typeof rec.scoreImprovement
                        ],
                      0
                    );
                    const projectedScore = Math.min(framework.score + improvement, 100);

                    return (
                      <div
                        key={framework.id}
                        className="p-4 rounded-xl border border-border/50 bg-background/50"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <Icon className="h-5 w-5" style={{ color: framework.color }} />
                          <span className="font-semibold">{framework.name}</span>
                        </div>
                        <div className="flex items-end gap-4">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Current</p>
                            <p className="text-2xl font-bold">{framework.score}%</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground mb-2" />
                          <div className="text-center">
                            <p className="text-xs text-emerald-400">Projected</p>
                            <p className="text-2xl font-bold text-emerald-400">{projectedScore}%</p>
                          </div>
                        </div>
                        <Progress value={projectedScore} className="mt-4 h-2" />
                        <p className="text-xs text-emerald-400 mt-2">
                          +{improvement}% improvement potential
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ComplianceOverview;
