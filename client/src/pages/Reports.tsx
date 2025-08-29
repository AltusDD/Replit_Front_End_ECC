import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Property, Client } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { FileDown, TrendingUp, Building, Users, DollarSign, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ReportMetrics {
  totalProperties: number;
  totalClients: number;
  averagePrice: number;
  totalValue: number;
  activeListings: number;
  soldProperties: number;
}

export default function Reports() {
  const [reportType, setReportType] = useState("summary");
  const [dateRange, setDateRange] = useState("month");
  const { toast } = useToast();

  const { data: properties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Calculate report metrics
  const reportMetrics: ReportMetrics = {
    totalProperties: properties?.length || 0,
    totalClients: clients?.length || 0,
    averagePrice: properties?.length 
      ? properties.reduce((sum, p) => sum + parseFloat(p.price), 0) / properties.length 
      : 0,
    totalValue: properties?.reduce((sum, p) => sum + parseFloat(p.price), 0) || 0,
    activeListings: properties?.filter(p => p.status === "active").length || 0,
    soldProperties: properties?.filter(p => p.status === "sold").length || 0,
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for the last ${dateRange} has been generated.`,
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being exported. You'll receive a download link shortly.",
    });
  };

  return (
    <div className="space-y-6" data-testid="page-reports">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-reports-title">Reports</h1>
          <p className="text-muted-foreground" data-testid="text-reports-subtitle">
            Generate comprehensive business reports and analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48" data-testid="select-report-type">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Business Summary</SelectItem>
              <SelectItem value="properties">Property Report</SelectItem>
              <SelectItem value="clients">Client Report</SelectItem>
              <SelectItem value="financial">Financial Report</SelectItem>
              <SelectItem value="performance">Performance Report</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40" data-testid="select-date-range">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleGenerateReport} data-testid="button-generate-report">
            <TrendingUp className="mr-2" size={16} />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="card-metric-properties">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-total-properties">
                  {reportMetrics.totalProperties}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building className="text-primary" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-clients">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-total-clients">
                  {reportMetrics.totalClients}
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="text-accent" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-average-price">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-average-price">
                  ${(reportMetrics.averagePrice / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="p-3 bg-chart-3/10 rounded-lg">
                <DollarSign className="text-chart-3" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-total-value">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-portfolio-value">
                  ${(reportMetrics.totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-3 bg-chart-4/10 rounded-lg">
                <TrendingUp className="text-chart-4" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Content Based on Type */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Report Content */}
        <div className="lg:col-span-2">
          <Card data-testid="card-report-content">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span data-testid="text-report-title">
                  {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                </span>
                <Badge variant="outline" data-testid="badge-report-period">
                  {dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {reportType === "summary" && (
                <div className="space-y-4" data-testid="content-summary-report">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Active Listings</h4>
                      <p className="text-2xl font-bold text-accent">{reportMetrics.activeListings}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Sold Properties</h4>
                      <p className="text-2xl font-bold text-chart-3">{reportMetrics.soldProperties}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Performance Summary</h4>
                    <p className="text-muted-foreground">
                      Your portfolio consists of {reportMetrics.totalProperties} properties with a total value of 
                      ${(reportMetrics.totalValue / 1000000).toFixed(1)}M. You have {reportMetrics.activeListings} active 
                      listings and have successfully sold {reportMetrics.soldProperties} properties.
                    </p>
                  </div>
                </div>
              )}

              {reportType === "properties" && (
                <div className="space-y-4" data-testid="content-properties-report">
                  <h4 className="font-semibold">Property Portfolio Analysis</h4>
                  <div className="space-y-3">
                    {properties?.slice(0, 5).map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-muted-foreground">{property.city}, {property.state}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${parseFloat(property.price).toLocaleString()}</p>
                          <Badge variant={property.status === "active" ? "default" : "secondary"}>
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportType === "clients" && (
                <div className="space-y-4" data-testid="content-clients-report">
                  <h4 className="font-semibold">Client Overview</h4>
                  <div className="space-y-3">
                    {clients?.slice(0, 5).map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{client.firstName} {client.lastName}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                        <div className="text-right">
                          {client.budget && (
                            <p className="font-semibold">${parseFloat(client.budget).toLocaleString()}</p>
                          )}
                          <Badge variant={client.status === "active" ? "default" : "secondary"}>
                            {client.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportType === "financial" && (
                <div className="space-y-4" data-testid="content-financial-report">
                  <h4 className="font-semibold">Financial Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h5 className="font-medium">Total Portfolio Value</h5>
                      <p className="text-2xl font-bold text-primary">
                        ${(reportMetrics.totalValue / 1000000).toFixed(2)}M
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h5 className="font-medium">Average Property Value</h5>
                      <p className="text-2xl font-bold text-accent">
                        ${(reportMetrics.averagePrice / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {reportType === "performance" && (
                <div className="space-y-4" data-testid="content-performance-report">
                  <h4 className="font-semibold">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Active Listings Ratio</span>
                      <span className="font-semibold">
                        {((reportMetrics.activeListings / reportMetrics.totalProperties) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sold Properties Ratio</span>
                      <span className="font-semibold">
                        {((reportMetrics.soldProperties / reportMetrics.totalProperties) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Client to Property Ratio</span>
                      <span className="font-semibold">
                        {(reportMetrics.totalClients / reportMetrics.totalProperties).toFixed(2)}:1
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Report Actions Sidebar */}
        <div className="space-y-6">
          <Card data-testid="card-report-actions">
            <CardHeader>
              <CardTitle>Report Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                onClick={handleExportReport}
                data-testid="button-export-pdf"
              >
                <FileDown className="mr-2" size={16} />
                Export as PDF
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleExportReport}
                data-testid="button-export-excel"
              >
                <FileDown className="mr-2" size={16} />
                Export as Excel
              </Button>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Generated On</h4>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="mr-2" size={14} />
                  {format(new Date(), "MMM dd, yyyy 'at' h:mm a")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-report-schedule">
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  No scheduled reports configured
                </div>
                <Button variant="outline" size="sm" className="w-full" data-testid="button-schedule-report">
                  Schedule Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
