import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle, FolderKanban } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const projectStatusData = [
  { status: "Completed", count: 24 },
  { status: "In Progress", count: 12 },
  { status: "On Hold", count: 6 },
  { status: "Planned", count: 8 },
];

const projects = [
  { name: "Website Redesign", progress: 85, status: "In Progress", team: 5 },
  { name: "Mobile App Launch", progress: 60, status: "In Progress", team: 8 },
  { name: "API Integration", progress: 100, status: "Completed", team: 3 },
  { name: "Database Migration", progress: 40, status: "In Progress", team: 4 },
  { name: "Marketing Campaign", progress: 95, status: "In Progress", team: 6 },
];

const Projects = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Project Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor project progress and team productivity
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Active Projects"
            value="18"
            change="3 new this week"
            changeType="positive"
            icon={FolderKanban}
            iconColor="text-chart-1"
          />
          <MetricCard
            title="Completed"
            value="24"
            change="+4 this month"
            changeType="positive"
            icon={CheckCircle2}
            iconColor="text-chart-2"
          />
          <MetricCard
            title="In Progress"
            value="12"
            change="On track"
            changeType="neutral"
            icon={Clock}
            iconColor="text-chart-3"
          />
          <MetricCard
            title="Overdue"
            value="2"
            change="Needs attention"
            changeType="negative"
            icon={AlertCircle}
            iconColor="text-chart-5"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Project Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.team} team members
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          project.status === "Completed"
                            ? "text-chart-2"
                            : "text-chart-3"
                        }`}
                      >
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Projects;
