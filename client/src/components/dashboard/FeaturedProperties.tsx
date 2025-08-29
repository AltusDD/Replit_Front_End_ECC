import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Building } from "lucide-react";
import { Property } from "@shared/schema";
import { Link } from "wouter";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-accent text-accent-foreground";
    case "pending":
      return "bg-chart-3 text-foreground";
    case "sold":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatPrice = (price: string) => {
  const numPrice = parseFloat(price);
  return `$${numPrice.toLocaleString()}`;
};

export default function FeaturedProperties() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const featuredProperties = properties?.slice(0, 3) || [];

  return (
    <Card data-testid="card-featured-properties">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle data-testid="text-featured-properties-title">Featured Properties</CardTitle>
        <Link href="/properties">
          <Button variant="ghost" size="sm" data-testid="button-view-all-properties">
            View All Properties <ArrowRight className="ml-1" size={16} />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} data-testid={`skeleton-property-${i}`}>
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground" data-testid="text-no-properties">
            No properties available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <Card 
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                data-testid={`property-card-${property.id}`}
              >
                {property.imageUrl ? (
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                    data-testid={`img-property-${property.id}`}
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Building className="text-muted-foreground" size={48} />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold" data-testid={`text-property-title-${property.id}`}>
                      {property.title}
                    </h4>
                    <Badge className={getStatusColor(property.status)} data-testid={`badge-property-status-${property.id}`}>
                      {property.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2" data-testid={`text-property-details-${property.id}`}>
                    {property.bedrooms} bed • {property.bathrooms} bath • {property.squareFeet.toLocaleString()} sqft
                  </p>
                  <p className="text-lg font-bold text-primary" data-testid={`text-property-price-${property.id}`}>
                    {formatPrice(property.price)}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-property-location-${property.id}`}>
                    {property.city}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
