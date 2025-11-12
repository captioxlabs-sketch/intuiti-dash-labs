import { ReactNode } from "react";
import { Home, BarChart3, Shield, FolderKanban, Flame, Laptop, HardDrive, Database, Timer, Activity } from "lucide-react";
import { NavLink } from "@/components/NavLink";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Threats", href: "/threats", icon: Shield },
  { name: "Firewall", href: "/firewall", icon: Flame },
  { name: "Endpoints", href: "/endpoints", icon: Laptop },
  { name: "Assets", href: "/assets", icon: HardDrive },
  { name: "CMDB", href: "/cmdb", icon: Database },
  { name: "Lifecycle", href: "/lifecycle", icon: Timer },
  { name: "Asset Health", href: "/asset-health", icon: Activity },
  { name: "Compliance", href: "/projects", icon: FolderKanban },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-border bg-sidebar">
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Security Dashboard
          </h1>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
