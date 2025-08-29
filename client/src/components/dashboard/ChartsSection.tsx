import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const salesData = [
  { month: "Jan", sales: 25 },
  { month: "Feb", sales: 30 },
  { month: "Mar", sales: 28 },
  { month: "Apr", sales: 35 },
  { month: "May", sales: 42 },
  { month: "Jun", sales: 38 },
];

const propertyTypeData = [
  { name: "Residential", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Commercial", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Condos", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Other", value: 10, color: "hsl(var(--chart-4))" },
];

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card data-testid="card-sales-chart">
        <CardHeader>
          <CardTitle data-testid="text-sales-chart-title">Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64" data-testid="chart-sales">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-property-types-chart">
        <CardHeader>
          <CardTitle data-testid="text-property-types-chart-title">Property Types Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64" data-testid="chart-property-types">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
