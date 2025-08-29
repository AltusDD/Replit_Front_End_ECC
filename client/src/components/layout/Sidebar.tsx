import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Building, 
  FileText, 
  Settings, 
  Gauge, 
  Users 
} from "lucide-react";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: Gauge },
  { path: "/properties", label: "Properties", icon: Building },
  { path: "/clients", label: "Clients", icon: Users },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border shadow-lg" data-testid="sidebar">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary" data-testid="text-app-title">
          ECC-Genesis
        </h1>
        <p className="text-sm text-muted-foreground" data-testid="text-app-subtitle">
          Real Estate Command Center
        </p>
      </div>
      
      <nav className="p-4 space-y-2" data-testid="nav-main">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-foreground"
                )}
                data-testid={`nav-link-${item.label.toLowerCase()}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
