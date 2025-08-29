import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search } from "lucide-react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-sm" data-testid="header">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" data-testid="text-page-title">
            Dashboard Overview
          </h2>
          <p className="text-sm text-muted-foreground" data-testid="text-welcome">
            Welcome back, <span className="font-medium">Sarah Johnson</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              type="search"
              placeholder="Search properties..."
              className="pl-10 w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-global-search"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="relative" data-testid="button-notifications">
            <Bell size={18} />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              data-testid="badge-notification-count"
            >
              3
            </Badge>
          </Button>
          
          <div className="flex items-center space-x-3" data-testid="user-profile">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium" data-testid="text-user-name">Sarah Johnson</p>
              <p className="text-muted-foreground" data-testid="text-user-role">Senior Agent</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
