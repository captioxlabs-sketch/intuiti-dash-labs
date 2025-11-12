import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Network, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  Globe,
  Shield,
  Wifi,
  Lock
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const trafficVolume = [
  { hour: "00:00", inbound: 245, outbound: 189, malicious: 12 },
  { hour: "04:00", inbound: 178, outbound: 134, malicious: 8 },
  { hour: "08:00", inbound: 456, outbound: 389, malicious: 22 },
  { hour: "12:00", inbound: 589, outbound: 512, malicious: 35 },
  { hour: "16:00", inbound: 612, outbound: 545, malicious: 28 },
  { hour: "20:00", inbound: 423, outbound: 367, malicious: 18 },
];

const protocolDistribution = [
  { protocol: "HTTPS", traffic: 45.2, color: "hsl(var(--accent))" },
  { protocol: "HTTP", traffic: 18.5, color: "hsl(var(--primary))" },
  { protocol: "DNS", traffic: 12.3, color: "hsl(142, 76%, 36%)" },
  { protocol: "SSH", traffic: 8.7, color: "hsl(48, 96%, 53%)" },
  { protocol: "FTP", traffic: 5.4, color: "hsl(var(--destructive))" },
  { protocol: "Other", traffic: 9.9, color: "hsl(var(--muted))" },
];

const anomalyDetection = [
  { time: "14:15", score: 85, events: 45, severity: "high", type: "Port Scan" },
  { time: "14:32", score: 92, events: 67, severity: "critical", type: "DDoS Pattern" },
  { time: "14:48", score: 78, events: 34, severity: "high", type: "Unusual Traffic" },
  { time: "15:05", score: 65, events: 28, severity: "medium", type: "Protocol Anomaly" },
  { time: "15:23", score: 88, events: 52, severity: "high", type: "Data Exfiltration" },
  { time: "15:41", score: 72, events: 41, severity: "medium", type: "Brute Force" },
];

const bandwidthTrends = [
  { day: "Mon", upload: 2.3, download: 4.5, peak: 6.8 },
  { day: "Tue", upload: 2.8, download: 5.2, peak: 7.5 },
  { day: "Wed", upload: 3.1, download: 5.8, peak: 8.2 },
  { day: "Thu", upload: 2.9, download: 5.4, peak: 7.8 },
  { day: "Fri", upload: 3.5, download: 6.2, peak: 9.1 },
  { day: "Sat", upload: 1.8, download: 3.2, peak: 4.5 },
  { day: "Sun", upload: 1.5, download: 2.8, peak: 3.8 },
];

const topTalkers = [
  { rank: 1, ip: "192.168.1.45", hostname: "web-server-01", traffic: 2.3, sessions: 15234, risk: "low" },
  { rank: 2, ip: "10.0.0.122", hostname: "db-primary", traffic: 1.8, sessions: 8945, risk: "low" },
  { rank: 3, ip: "172.16.0.89", hostname: "api-gateway", traffic: 1.5, sessions: 12456, risk: "low" },
  { rank: 4, ip: "192.168.2.34", hostname: "unknown", traffic: 1.2, sessions: 6789, risk: "medium" },
  { rank: 5, ip: "10.0.1.156", hostname: "backup-server", traffic: 0.9, sessions: 4523, risk: "low" },
];

const suspiciousConnections = [
  {
    id: "CONN-001",
    timestamp: "15:42:18",
    sourceIP: "185.220.101.45",
    sourcePort: 443,
    destIP: "192.168.1.78",
    destPort: 22,
    protocol: "SSH",
    threat: "Brute Force Attempt",
    severity: "critical",
    packets: 1456,
    bytes: "245 KB",
    country: "Russia",
    action: "Blocked",
    confidence: 95,
  },
  {
    id: "CONN-002",
    timestamp: "15:38:45",
    sourceIP: "103.75.201.22",
    sourcePort: 8080,
    destIP: "10.0.0.145",
    destPort: 3306,
    protocol: "MySQL",
    threat: "SQL Injection Attempt",
    severity: "high",
    packets: 892,
    bytes: "156 KB",
    country: "China",
    action: "Blocked",
    confidence: 88,
  },
  {
    id: "CONN-003",
    timestamp: "15:35:12",
    sourceIP: "45.142.120.67",
    sourcePort: 53,
    destIP: "192.168.2.90",
    destPort: 53,
    protocol: "DNS",
    threat: "DNS Tunneling",
    severity: "high",
    packets: 2341,
    bytes: "412 KB",
    country: "Netherlands",
    action: "Monitored",
    confidence: 82,
  },
  {
    id: "CONN-004",
    timestamp: "15:31:56",
    sourceIP: "198.51.100.89",
    sourcePort: 443,
    destIP: "172.16.0.122",
    destPort: 443,
    protocol: "HTTPS",
    threat: "C2 Callback",
    severity: "critical",
    packets: 567,
    bytes: "89 KB",
    country: "United States",
    action: "Blocked",
    confidence: 92,
  },
  {
    id: "CONN-005",
    timestamp: "15:28:33",
    sourceIP: "91.198.174.192",
    sourcePort: 80,
    destIP: "10.0.1.67",
    destPort: 80,
    protocol: "HTTP",
    threat: "Port Scanning",
    severity: "medium",
    packets: 4523,
    bytes: "678 KB",
    country: "Ukraine",
    action: "Logged",
    confidence: 75,
  },
];

const categoryFilters = [
  { value: "all", label: "All Traffic" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const NetworkMonitoring = () => {
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
      value: data.value || data.count || data.inbound,
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

  const filteredConnections = useMemo(() => {
    if (selectedCategory === "all") return suspiciousConnections;
    return suspiciousConnections.filter(conn => conn.severity === selectedCategory);
  }, [selectedCategory]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "hsl(var(--destructive))";
      case "high": return "hsl(48, 96%, 53%)";
      case "medium": return "hsl(var(--primary))";
      case "low": return "hsl(var(--accent))";
      default: return "hsl(var(--muted))";
    }
  };

  const getSeverityBadgeVariant = (severity: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  const getActionBadgeVariant = (action: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (action) {
      case "Blocked": return "destructive";
      case "Monitored": return "default";
      case "Logged": return "outline";
      default: return "secondary";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Network Security Monitoring
          </h2>
          <p className="text-muted-foreground mt-2">
            Real-time traffic analysis, anomaly detection, and threat monitoring
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
            title="Network Throughput"
            value={`${(4.2 * multiplier).toFixed(1)} GB/s`}
            change="+15% from avg"
            changeType="neutral"
            icon={Network}
            iconColor="text-primary"
            onClick={() => handleCardClick("throughput")}
            isSelected={selectedCard === "throughput"}
          />
          <MetricCard
            title="Anomalies Detected"
            value={Math.round(87 * multiplier)}
            change="+22 from last hour"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="text-destructive"
            onClick={() => handleCardClick("anomalies")}
            isSelected={selectedCard === "anomalies"}
          />
          <MetricCard
            title="Active Connections"
            value={`${(15.4 * multiplier).toFixed(1)}K`}
            change="+8% from baseline"
            changeType="neutral"
            icon={Activity}
            iconColor="text-accent"
            onClick={() => handleCardClick("connections")}
            isSelected={selectedCard === "connections"}
          />
          <MetricCard
            title="Blocked Threats"
            value={Math.round(234 * multiplier)}
            change="-12% from yesterday"
            changeType="positive"
            icon={Shield}
            iconColor="text-accent"
            onClick={() => handleCardClick("blocked")}
            isSelected={selectedCard === "blocked"}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Traffic Volume Analysis
              </CardTitle>
              <CardDescription>Real-time network traffic patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trafficVolume}>
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
                  <Area 
                    type="monotone" 
                    dataKey="inbound" 
                    stackId="1"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="outbound" 
                    stackId="1"
                    stroke="hsl(var(--accent))" 
                    fill="hsl(var(--accent))"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="malicious" 
                    stackId="2"
                    stroke="hsl(var(--destructive))" 
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-accent" />
                Protocol Distribution
              </CardTitle>
              <CardDescription>Network traffic by protocol type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={protocolDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ protocol, traffic }) => `${protocol} (${traffic}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="traffic"
                    onClick={(data) => handleChartClick(data, "Protocol Distribution")}
                  >
                    {protocolDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Anomaly Detection Timeline
              </CardTitle>
              <CardDescription>AI-powered threat detection scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    dataKey="score" 
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: "Anomaly Score", angle: -90, position: "insideLeft" }}
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
                    name="Anomalies" 
                    data={anomalyDetection} 
                    fill="hsl(var(--destructive))"
                    onClick={(data) => handleChartClick(data, "Anomaly Detection")}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Bandwidth Trends
              </CardTitle>
              <CardDescription>Weekly bandwidth utilization (GB/day)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bandwidthTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
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
                    dataKey="upload" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="download" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="peak" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              Top Network Talkers
            </CardTitle>
            <CardDescription>Highest traffic sources in the network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTalkers.map((talker) => (
                <div
                  key={talker.rank}
                  className="border border-border rounded-lg p-3 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-2xl font-bold text-muted-foreground w-8">
                        #{talker.rank}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-semibold">{talker.ip}</span>
                          <Badge variant="outline">{talker.hostname}</Badge>
                          <Badge variant={talker.risk === "low" ? "outline" : "default"}>
                            {talker.risk.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Traffic: {talker.traffic} GB</span>
                          <span>•</span>
                          <span>Sessions: {talker.sessions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{talker.traffic} GB</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-destructive" />
              Suspicious Connection Tracking
            </CardTitle>
            <CardDescription>
              Real-time monitoring of potentially malicious network connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredConnections.map((conn) => (
                <div
                  key={conn.id}
                  className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{conn.threat}</h4>
                        <Badge variant={getSeverityBadgeVariant(conn.severity)}>
                          {conn.severity.toUpperCase()}
                        </Badge>
                        <Badge variant={getActionBadgeVariant(conn.action)}>
                          {conn.action.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{conn.protocol}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="font-mono">{conn.id}</span>
                        <span>•</span>
                        <span>{conn.timestamp}</span>
                        <span>•</span>
                        <span>Origin: {conn.country}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: getSeverityColor(conn.severity) }}>
                        {conn.confidence}%
                      </div>
                      <div className="text-xs text-muted-foreground">Confidence</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 p-3 bg-muted/50 rounded-md">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Source</div>
                      <div className="font-mono text-sm">
                        {conn.sourceIP}:{conn.sourcePort}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Destination</div>
                      <div className="font-mono text-sm">
                        {conn.destIP}:{conn.destPort}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Threat Confidence</span>
                      <span className="text-sm text-muted-foreground">{conn.confidence}%</span>
                    </div>
                    <Progress value={conn.confidence} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">Packets:</span>
                      <span className="font-semibold">{conn.packets.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">Data Transferred:</span>
                      <span className="font-semibold">{conn.bytes}</span>
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

export default NetworkMonitoring;
