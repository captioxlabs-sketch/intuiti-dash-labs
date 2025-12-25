import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusIndicator, StatusBadge, StatusDot } from "@/components/StatusIndicator";
import { ChartTooltip } from "@/components/ChartTooltip";
import {
  Shield,
  Server,
  Users,
  Settings,
  Lock,
  Eye,
  FileText,
  Network,
  Mail,
  Globe,
  Database,
  AlertTriangle,
  Activity,
  Smartphone,
  CloudCog,
  UserCheck,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Download,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  Area,
  AreaChart,
} from "recharts";

const cisControls = [
  { id: 1, name: "Inventory and Control of Enterprise Assets", icon: Server, implemented: 87, total: 12, priority: "IG1", status: "success" },
  { id: 2, name: "Inventory and Control of Software Assets", icon: Database, implemented: 78, total: 14, priority: "IG1", status: "success" },
  { id: 3, name: "Data Protection", icon: Lock, implemented: 65, total: 14, priority: "IG1", status: "warning" },
  { id: 4, name: "Secure Configuration of Enterprise Assets", icon: Settings, implemented: 72, total: 12, priority: "IG1", status: "warning" },
  { id: 5, name: "Account Management", icon: Users, implemented: 91, total: 6, priority: "IG1", status: "success" },
  { id: 6, name: "Access Control Management", icon: UserCheck, implemented: 84, total: 8, priority: "IG1", status: "success" },
  { id: 7, name: "Continuous Vulnerability Management", icon: AlertTriangle, implemented: 58, total: 7, priority: "IG2", status: "warning" },
  { id: 8, name: "Audit Log Management", icon: FileText, implemented: 69, total: 12, priority: "IG2", status: "warning" },
  { id: 9, name: "Email and Web Browser Protections", icon: Mail, implemented: 82, total: 7, priority: "IG2", status: "success" },
  { id: 10, name: "Malware Defenses", icon: ShieldCheck, implemented: 95, total: 7, priority: "IG2", status: "success" },
  { id: 11, name: "Data Recovery", icon: CloudCog, implemented: 76, total: 5, priority: "IG1", status: "success" },
  { id: 12, name: "Network Infrastructure Management", icon: Network, implemented: 61, total: 8, priority: "IG2", status: "warning" },
  { id: 13, name: "Network Monitoring and Defense", icon: Eye, implemented: 54, total: 11, priority: "IG2", status: "critical" },
  { id: 14, name: "Security Awareness and Skills Training", icon: Users, implemented: 88, total: 9, priority: "IG1", status: "success" },
  { id: 15, name: "Service Provider Management", icon: Globe, implemented: 45, total: 7, priority: "IG2", status: "critical" },
  { id: 16, name: "Application Software Security", icon: Smartphone, implemented: 52, total: 14, priority: "IG2", status: "critical" },
  { id: 17, name: "Incident Response Management", icon: Zap, implemented: 73, total: 9, priority: "IG2", status: "warning" },
  { id: 18, name: "Penetration Testing", icon: Activity, implemented: 67, total: 5, priority: "IG3", status: "warning" },
];

const implementationGroups = [
  { name: "IG1 - Essential", controls: 56, implemented: 48, color: "hsl(var(--chart-1))" },
  { name: "IG2 - Foundational", controls: 74, implemented: 52, color: "hsl(var(--chart-2))" },
  { name: "IG3 - Organizational", controls: 23, implemented: 14, color: "hsl(var(--chart-3))" },
];

const trendData = [
  { month: "Jul", ig1: 72, ig2: 45, ig3: 32, overall: 52 },
  { month: "Aug", ig1: 75, ig2: 48, ig3: 35, overall: 55 },
  { month: "Sep", ig1: 78, ig2: 52, ig3: 38, overall: 58 },
  { month: "Oct", ig1: 82, ig2: 58, ig3: 42, overall: 63 },
  { month: "Nov", ig1: 85, ig2: 64, ig3: 48, overall: 68 },
  { month: "Dec", ig1: 86, ig2: 70, ig3: 61, overall: 74 },
];

const safeguardsByStatus = [
  { name: "Implemented", value: 114, color: "hsl(var(--success))" },
  { name: "In Progress", value: 28, color: "hsl(var(--warning))" },
  { name: "Planned", value: 8, color: "hsl(var(--info))" },
  { name: "Not Started", value: 3, color: "hsl(var(--destructive))" },
];

const radarData = cisControls.slice(0, 9).map(c => ({
  control: `CIS ${c.id}`,
  score: c.implemented,
  fullMark: 100,
}));

const recentActivities = [
  { control: "CIS 10", action: "Deployed EDR to remaining endpoints", status: "success", date: "2024-01-15" },
  { control: "CIS 5", action: "Completed privileged account audit", status: "success", date: "2024-01-14" },
  { control: "CIS 13", action: "Network segmentation review started", status: "warning", date: "2024-01-13" },
  { control: "CIS 16", action: "SAST integration pending approval", status: "info", date: "2024-01-12" },
  { control: "CIS 7", action: "Vulnerability scan scheduled", status: "info", date: "2024-01-11" },
];

const priorityActions = [
  { control: 15, action: "Establish vendor security assessment program", priority: "High", dueDate: "2024-02-01" },
  { control: 13, action: "Deploy network traffic analysis tools", priority: "High", dueDate: "2024-02-15" },
  { control: 16, action: "Implement secure SDLC practices", priority: "High", dueDate: "2024-02-28" },
  { control: 7, action: "Automate vulnerability remediation workflow", priority: "Medium", dueDate: "2024-03-15" },
  { control: 12, action: "Update network device configurations", priority: "Medium", dueDate: "2024-03-30" },
];

const CISControls = () => {
  const [selectedIG, setSelectedIG] = useState<string>("all");

  const overallCompliance = Math.round(
    cisControls.reduce((acc, c) => acc + c.implemented, 0) / cisControls.length
  );

  const filteredControls = selectedIG === "all" 
    ? cisControls 
    : cisControls.filter(c => c.priority === selectedIG);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-emerald-400";
      case "warning": return "text-amber-400";
      case "critical": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Low": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-7 w-7 text-cyan-400" />
              CIS Controls v8 Compliance
            </h1>
            <p className="text-muted-foreground mt-1">
              Implementation progress across 18 control groups and 153 safeguards
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Compliance</p>
                  <p className="text-3xl font-bold text-cyan-400">{overallCompliance}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
              <Progress value={overallCompliance} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Safeguards Implemented</p>
                  <p className="text-3xl font-bold text-emerald-400">114/153</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-sm text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span>+12 this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-3xl font-bold text-amber-400">28</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">Active implementation tasks</p>
            </CardContent>
          </Card>

          <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Gaps</p>
                  <p className="text-3xl font-bold text-red-400">3</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">Controls below 60%</p>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Groups Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {implementationGroups.map((ig, index) => (
            <Card key={ig.name} className="border-border/50 hover:border-cyan-500/30 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>{ig.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {ig.controls} safeguards
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-bold" style={{ color: ig.color }}>
                    {Math.round((ig.implemented / ig.controls) * 100)}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {ig.implemented}/{ig.controls} implemented
                  </span>
                </div>
                <Progress 
                  value={(ig.implemented / ig.controls) * 100} 
                  className="h-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="controls" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="controls">Control Groups</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="actions">Priority Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter by:</span>
              <div className="flex gap-1">
                {["all", "IG1", "IG2", "IG3"].map((ig) => (
                  <Button
                    key={ig}
                    size="sm"
                    variant={selectedIG === ig ? "default" : "outline"}
                    onClick={() => setSelectedIG(ig)}
                    className="text-xs"
                  >
                    {ig === "all" ? "All Controls" : ig}
                  </Button>
                ))}
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredControls.map((control) => {
                const Icon = control.icon;
                return (
                  <Card 
                    key={control.id} 
                    className="border-border/50 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/5 cursor-pointer group"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          control.status === "success" ? "bg-emerald-500/20" :
                          control.status === "warning" ? "bg-amber-500/20" : "bg-red-500/20"
                        }`}>
                          <Icon className={`h-5 w-5 ${getStatusColor(control.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs font-mono">
                              CIS {control.id}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                              {control.priority}
                            </Badge>
                          </div>
                          <h3 className="text-sm font-medium text-foreground leading-tight truncate">
                            {control.name}
                          </h3>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">{control.total} safeguards</span>
                          <span className={`font-medium ${getStatusColor(control.status)}`}>
                            {control.implemented}%
                          </span>
                        </div>
                        <Progress value={control.implemented} className="h-2" />
                      </div>
                      <div className="flex items-center justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Compliance Trend */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Compliance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip content={<ChartTooltip title="Compliance %" accentColor="cyan" />} />
                        <Area type="monotone" dataKey="ig1" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} name="IG1" />
                        <Area type="monotone" dataKey="ig2" stackId="2" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} name="IG2" />
                        <Area type="monotone" dataKey="ig3" stackId="3" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.3} name="IG3" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Safeguards Distribution */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Safeguards by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={safeguardsByStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {safeguardsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip title="Safeguards" accentColor="cyan" />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {safeguardsByStatus.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                        <span className="text-xs font-medium ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Control Coverage (CIS 1-9)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="control" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                        <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                        <Tooltip content={<ChartTooltip title="Implementation %" accentColor="cyan" />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Control Performance */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Control Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cisControls.slice(0, 9)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis type="category" dataKey="id" stroke="hsl(var(--muted-foreground))" fontSize={12} width={40} tickFormatter={(v) => `CIS ${v}`} />
                        <Tooltip content={<ChartTooltip title="Implementation %" accentColor="cyan" />} />
                        <Bar dataKey="implemented" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Priority Actions */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Priority Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {priorityActions.map((action, index) => (
                      <div 
                        key={index} 
                        className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs font-mono">
                                CIS {action.control}
                              </Badge>
                              <Badge className={`text-xs ${getPriorityBadge(action.priority)}`}>
                                {action.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground">{action.action}</p>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            Due: {action.dueDate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <StatusDot status={activity.status as any} pulse={activity.status === "warning"} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs font-mono">
                              {activity.control}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{activity.date}</span>
                          </div>
                          <p className="text-sm text-foreground">{activity.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CISControls;
