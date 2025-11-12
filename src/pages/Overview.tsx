import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";

const Overview = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Dashboard Showcase
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore the most intuitive and dynamic dashboard examples
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Total Users"
            value="12,345"
            change="+12.5% from last month"
            changeType="positive"
            icon={Users}
            iconColor="text-chart-1"
          />
          <MetricCard
            title="Revenue"
            value="$45,678"
            change="+8.2% from last month"
            changeType="positive"
            icon={DollarSign}
            iconColor="text-chart-2"
          />
          <MetricCard
            title="Growth Rate"
            value="23.5%"
            change="+3.1% from last month"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-chart-3"
          />
          <MetricCard
            title="Active Sessions"
            value="892"
            change="Live tracking"
            changeType="neutral"
            icon={Activity}
            iconColor="text-chart-4"
          />
        </div>

        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Welcome to Dashboard Hub
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Discover beautifully crafted, highly intuitive dashboard examples designed for modern applications. 
            Each dashboard showcases best practices in data visualization, user experience, and interface design.
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-card border border-border rounded-lg p-4 flex-1 min-w-[200px]">
              <h3 className="font-semibold text-foreground mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Advanced metrics and visualizations for data-driven insights
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex-1 min-w-[200px]">
              <h3 className="font-semibold text-foreground mb-2">Sales Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Track performance, revenue, and conversion metrics
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex-1 min-w-[200px]">
              <h3 className="font-semibold text-foreground mb-2">Project Management</h3>
              <p className="text-sm text-muted-foreground">
                Monitor tasks, progress, and team productivity
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
