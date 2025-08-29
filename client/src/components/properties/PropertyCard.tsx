import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Edit, Trash2 } from "lucide-react";
import { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-accent text-accent-foreground";
    case "pending":
      return "bg-chart-3 text-foreground";
    case "sold":
      return "bg-muted text-muted-foreground";
    case "off-market":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatPrice = (price: string) => {
  const numPrice = parseFloat(price);
  return `$${numPrice.toLocaleString()}`;
};

export default function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`property-card-${property.id}`}>
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
        
        <p className="text-lg font-bold text-primary mb-1" data-testid={`text-property-price-${property.id}`}>
          {formatPrice(property.price)}
        </p>
        
        <p className="text-sm text-muted-foreground mb-3" data-testid={`text-property-location-${property.id}`}>
          {property.address}, {property.city}, {property.state}
        </p>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(property)}
            data-testid={`button-edit-property-${property.id}`}
          >
            <Edit size={14} className="mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(property.id)}
            data-testid={`button-delete-property-${property.id}`}
          >
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
