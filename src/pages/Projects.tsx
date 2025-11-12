import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { DrillDownModal } from "@/components/DrillDownModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { CheckCircle2, Clock, AlertCircle, FolderKanban } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { addDays, subDays } from "date-fns";
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

const statusCategories = [
  { value: "all", label: "All Projects" },
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "planned", label: "Planned" },
];

const Projects = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 90),
    to: new Date(),
  });
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleReset = () => {
    setDateRange({
      from: subDays(new Date(), 90),
      to: new Date(),
    });
    setSelectedStatus("all");
    setSelectedCard(null);
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(selectedCard === cardType ? null : cardType);
  };

  const handleChartClick = (data: any) => {
    if (!data) return;
    
    const drillDown = {
      title: `${data.status} Projects`,
      value: data.count.toString(),
      trend: 5.8,
      period: "vs. previous period",
      details: [
        { label: "Total Projects", value: data.count.toString(), change: "+6%" },
        { label: "Team Members", value: Math.round(data.count * 2.5).toString(), change: "+3%" },
        { label: "On Budget", value: Math.round(data.count * 0.85).toString(), change: "+2%" },
        { label: "Avg. Progress", value: `${Math.round(70 + Math.random() * 20)}%`, change: "+4%" },
      ],
      timeSeriesData: [
        { date: "Week 1", value: Math.round(data.count * 0.2) },
        { date: "Week 2", value: Math.round(data.count * 0.25) },
        { date: "Week 3", value: Math.round(data.count * 0.28) },
        { date: "Week 4", value: Math.round(data.count * 0.27) },
      ],
    };
    
    setDrillDownData(drillDown);
    setModalOpen(true);
  };

  const filteredProjects = useMemo(() => {
    if (selectedStatus === "all") return projects;
    return projects.filter(
      (project) => project.status.toLowerCase().replace(" ", "-") === selectedStatus
    );
  }, [selectedStatus]);

  const getMetricMultiplier = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0.5, Math.min(1.5, days / 90));
  };

  const multiplier = getMetricMultiplier();

  // Filter data based on selected card
  const getFilteredStatusData = () => {
    if (!selectedCard) return projectStatusData;
    
    switch (selectedCard) {
      case "completed":
        return projectStatusData.filter(d => d.status === "Completed");
      case "in-progress":
        return projectStatusData.filter(d => d.status === "In Progress");
      case "on-hold":
        return projectStatusData.filter(d => d.status === "On Hold");
      default:
        return projectStatusData;
    }
  };
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

        <FilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedCategory={selectedStatus}
          onCategoryChange={setSelectedStatus}
          categories={statusCategories}
          onReset={handleReset}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Active Projects"
            value={Math.round(18 * multiplier).toString()}
            change={`${Math.round(3 * multiplier)} new this period`}
            changeType="positive"
            icon={FolderKanban}
            iconColor="text-chart-1"
            onClick={() => handleCardClick("active")}
            isSelected={selectedCard === "active"}
          />
          <MetricCard
            title="Completed"
            value={Math.round(24 * multiplier).toString()}
            change={`+${Math.round(4 * multiplier)} this period`}
            changeType="positive"
            icon={CheckCircle2}
            iconColor="text-chart-2"
            onClick={() => handleCardClick("completed")}
            isSelected={selectedCard === "completed"}
          />
          <MetricCard
            title="In Progress"
            value={Math.round(12 * multiplier).toString()}
            change="On track"
            changeType="neutral"
            icon={Clock}
            iconColor="text-chart-3"
            onClick={() => handleCardClick("in-progress")}
            isSelected={selectedCard === "in-progress"}
          />
          <MetricCard
            title="Overdue"
            value="2"
            change="Needs attention"
            changeType="negative"
            icon={AlertCircle}
            iconColor="text-chart-5"
            onClick={() => handleCardClick("on-hold")}
            isSelected={selectedCard === "on-hold"}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                Project Status Distribution
                {selectedCard && <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Filtered by {selectedCard})
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFilteredStatusData()} onClick={(e) => e?.activePayload && handleChartClick(e.activePayload[0].payload)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" />
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
                {filteredProjects.map((project, index) => (
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
      <DrillDownModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        data={drillDownData} 
      />
    </DashboardLayout>
  );
};

export default Projects;
