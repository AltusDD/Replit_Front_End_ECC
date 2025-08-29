import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Handshake, UserPlus, Building, Users, FileText } from "lucide-react";
import { Activity } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

const getActivityIcon = (type: string) => {
  switch (type) {
    case "listing_added":
      return Plus;
    case "deal_closed":
      return Handshake;
    case "client_added":
      return UserPlus;
    case "property_updated":
      return Building;
    case "client_updated":
      return Users;
    case "report_generated":
      return FileText;
    default:
      return Plus;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "listing_added":
      return "bg-primary";
    case "deal_closed":
      return "bg-accent";
    case "client_added":
      return "bg-chart-3";
    case "property_updated":
      return "bg-chart-4";
    case "client_updated":
      return "bg-chart-2";
    case "report_generated":
      return "bg-chart-5";
    default:
      return "bg-primary";
  }
};

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  return (
    <Card data-testid="card-recent-activity">
      <CardHeader>
        <CardTitle data-testid="text-recent-activity-title">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4 p-4" data-testid={`skeleton-activity-${i}`}>
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !activities || activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground" data-testid="text-no-activities">
            No recent activities
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <div 
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 hover:bg-muted rounded-lg transition-colors"
                  data-testid={`activity-${activity.id}`}
                >
                  <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center`}>
                    <Icon className="text-white" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" data-testid={`text-activity-title-${activity.id}`}>
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-activity-description-${activity.id}`}>
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1" data-testid={`text-activity-time-${activity.id}`}>
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
