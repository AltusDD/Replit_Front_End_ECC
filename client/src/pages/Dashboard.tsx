import MetricsCards from "@/components/dashboard/MetricsCards";
import ChartsSection from "@/components/dashboard/ChartsSection";
import RecentActivity from "@/components/dashboard/RecentActivity";
import FeaturedProperties from "@/components/dashboard/FeaturedProperties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, UserPlus, FileDown } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} clicked`,
      description: "This would open the appropriate modal or page",
    });
  };

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      <MetricsCards />
      <ChartsSection />
      <RecentActivity />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card data-testid="card-quick-actions">
          <CardHeader>
            <CardTitle data-testid="text-quick-actions-title">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/properties">
              <Button className="w-full" data-testid="button-add-property">
                <Plus className="mr-2" size={16} />
                Add New Property
              </Button>
            </Link>
            <Link href="/clients">
              <Button variant="secondary" className="w-full" data-testid="button-add-client">
                <UserPlus className="mr-2" size={16} />
                Add New Client
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleQuickAction("Generate Report")}
              data-testid="button-generate-report"
            >
              <FileDown className="mr-2" size={16} />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-upcoming-tasks">
          <CardHeader>
            <CardTitle data-testid="text-upcoming-tasks-title">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg" data-testid="task-1">
              <Checkbox id="task1" data-testid="checkbox-task-1" />
              <div className="flex-1">
                <label htmlFor="task1" className="font-medium text-sm cursor-pointer">
                  Property inspection - 123 Oak Street
                </label>
                <p className="text-xs text-muted-foreground">Today, 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg" data-testid="task-2">
              <Checkbox id="task2" data-testid="checkbox-task-2" />
              <div className="flex-1">
                <label htmlFor="task2" className="font-medium text-sm cursor-pointer">
                  Client meeting - Sarah & Mike Thompson
                </label>
                <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg" data-testid="task-3">
              <Checkbox id="task3" data-testid="checkbox-task-3" />
              <div className="flex-1">
                <label htmlFor="task3" className="font-medium text-sm cursor-pointer">
                  Document review - Pine Valley Contract
                </label>
                <p className="text-xs text-muted-foreground">Friday, 3:30 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <FeaturedProperties />
    </div>
  );
}
