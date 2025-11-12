import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DraggableWidget } from "./DraggableWidget";
import {
  Shield,
  AlertTriangle,
  Clock,
  Users,
  Activity,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

interface SOCChartsProps {
  widget: any;
  isDragEnabled: boolean;
  handleChartClick: (data: any, chartType: string) => void;
  alertTrends: any[];
  incidentsByStatus: any[];
  mttrTrends: any[];
  eventCorrelation: any[];
  analystWorkload: any[];
  filteredIncidents: any[];
  getSeverityColor: (severity: string) => string;
  getSeverityBadgeVariant: (severity: string) => any;
  getStatusBadgeVariant: (status: string) => any;
}

export const SOCCharts = ({
  widget,
  isDragEnabled,
  handleChartClick,
  alertTrends,
  incidentsByStatus,
  mttrTrends,
  eventCorrelation,
  analystWorkload,
  filteredIncidents,
  getSeverityColor,
  getSeverityBadgeVariant,
  getStatusBadgeVariant,
}: SOCChartsProps) => {
  switch (widget.id) {
    case "alert-chart":
      return (
        <DraggableWidget key="alert-chart" id="alert-chart" isDragEnabled={isDragEnabled}>
          <Card className="animate-fade-in hover-scale transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Real-Time Alert Distribution
              </CardTitle>
              <CardDescription>Alert volume by severity over 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={alertTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="critical"
                    stackId="1"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="high"
                    stackId="1"
                    stroke="hsl(48, 96%, 53%)"
                    fill="hsl(48, 96%, 53%)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="medium"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="low"
                    stackId="1"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </DraggableWidget>
      );

    case "incident-chart":
      return (
        <DraggableWidget key="incident-chart" id="incident-chart" isDragEnabled={isDragEnabled}>
          <Card className="animate-fade-in hover-scale transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Incident Queue by Status
              </CardTitle>
              <CardDescription>Current incident distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incidentsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    onClick={(data) => handleChartClick(data, "Incident Status")}
                    cursor="pointer"
                  >
                    {incidentsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </DraggableWidget>
      );

    case "mttr-chart":
      return (
        <DraggableWidget key="mttr-chart" id="mttr-chart" isDragEnabled={isDragEnabled}>
          <Card className="animate-fade-in hover-scale transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                MTTR Trends & Performance
              </CardTitle>
              <CardDescription>Mean Time To Respond tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mttrTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="mttr"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Actual MTTR (min)"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target MTTR (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </DraggableWidget>
      );

    case "correlation-chart":
      return (
        <DraggableWidget key="correlation-chart" id="correlation-chart" isDragEnabled={isDragEnabled}>
          <Card className="animate-fade-in hover-scale transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Security Event Correlation
              </CardTitle>
              <CardDescription>Real-time event correlation analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    dataKey="events"
                    name="Events"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    type="number"
                    dataKey="severity"
                    name="Severity"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Scatter
                    name="Security Events"
                    data={eventCorrelation}
                    fill="hsl(var(--primary))"
                    onClick={(data) => handleChartClick(data, "Event Correlation")}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </DraggableWidget>
      );

    case "analysts":
      return (
        <DraggableWidget key="analysts" id="analysts" isDragEnabled={isDragEnabled}>
          <Card className="animate-fade-in hover-scale transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Analyst Workload Distribution
              </CardTitle>
              <CardDescription>Team performance and case assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analystWorkload.map((analyst) => (
                  <div
                    key={analyst.analyst}
                    className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{analyst.analyst}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Active Cases: {analyst.active}</span>
                          <span>•</span>
                          <span>Resolved: {analyst.resolved}</span>
                          <span>•</span>
                          <span>Avg MTTR: {analyst.avgMTTR}m</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{analyst.efficiency}%</div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Performance Score</span>
                        <span className="text-sm text-muted-foreground">{analyst.efficiency}%</span>
                      </div>
                      <Progress value={analyst.efficiency} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </DraggableWidget>
      );

    case "queue":
      return (
        <DraggableWidget key="queue" id="queue" isDragEnabled={isDragEnabled}>
          <Card className="animate-fade-in hover-scale transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Active Incident Queue
              </CardTitle>
              <CardDescription>Current incidents requiring attention and response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{incident.title}</h4>
                          <Badge variant={getSeverityBadgeVariant(incident.severity)}>
                            {incident.severity.toUpperCase()}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(incident.status)}>
                            {incident.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span>{incident.id}</span>
                          <span>•</span>
                          <span>Assigned to: {incident.assignedTo}</span>
                          <span>•</span>
                          <span>Created: {incident.created}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-xl font-bold"
                          style={{ color: getSeverityColor(incident.severity) }}
                        >
                          {incident.mttr}m
                        </div>
                        <div className="text-xs text-muted-foreground">MTTR</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Correlated Events:</span>{" "}
                        <span className="font-semibold">{incident.events}</span>
                      </div>
                      <div className="text-sm text-right">
                        <span className="text-muted-foreground">Affected Systems:</span>{" "}
                        <span className="font-semibold">{incident.affectedSystems}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </DraggableWidget>
      );

    default:
      return null;
  }
};
