import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Home, DollarSign, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MetricsData {
  totalProperties: number;
  activeListings: number;
  totalRevenue: number;
  activeClients: number;
}

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery<MetricsData>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} data-testid={`skeleton-metric-card-${i}`}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="error-metrics">
        Failed to load metrics
      </div>
    );
  }

  const metricsData = [
    {
      title: "Total Properties",
      value: metrics.totalProperties.toString(),
      change: "+12%",
      icon: Building,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      testId: "total-properties",
    },
    {
      title: "Active Listings",
      value: metrics.activeListings.toString(),
      change: "+8%",
      icon: Home,
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
      testId: "active-listings",
    },
    {
      title: "Total Revenue",
      value: `$${(metrics.totalRevenue / 1000000).toFixed(1)}M`,
      change: "+15%",
      icon: DollarSign,
      bgColor: "bg-chart-3/10",
      iconColor: "text-chart-3",
      testId: "total-revenue",
    },
    {
      title: "Active Clients",
      value: metrics.activeClients.toString(),
      change: "+6%",
      icon: Users,
      bgColor: "bg-chart-4/10",
      iconColor: "text-chart-4",
      testId: "active-clients",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.testId} data-testid={`card-metric-${metric.testId}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground" data-testid={`text-${metric.testId}-label`}>
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground" data-testid={`text-${metric.testId}-value`}>
                    {metric.value}
                  </p>
                </div>
                <div className={cn("p-3 rounded-lg", metric.bgColor)}>
                  <Icon className={cn("text-xl", metric.iconColor)} size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-accent" data-testid={`text-${metric.testId}-change`}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
