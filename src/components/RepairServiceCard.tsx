import { Button } from "@/components/ui/button";
import { Plus, Clock, Minus } from "lucide-react";

interface RepairService {
  id: string;
  name: string;
  shortDescription: string;
  basePrice: number;
  priceVaries: boolean;
  priceNote?: string;
  turnaroundDays: string;
  popular?: boolean;
}

interface RepairServiceCardProps {
  service: RepairService;
  onSelect: (service: RepairService) => void;
  isSelected?: boolean;
  quantity?: number;
  onQuantityChange?: (serviceId: string, quantity: number) => void;
}

export const RepairServiceCard = ({ 
  service, 
  onSelect, 
  isSelected, 
  quantity = 0,
  onQuantityChange 
}: RepairServiceCardProps) => {
  return (
    <div className="group border border-border rounded-lg p-4 hover:border-primary/50 transition-colors bg-background">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-foreground leading-snug">{service.name}</h3>
        {service.popular && (
          <span className="shrink-0 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            🔥 Popular
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {service.shortDescription}
      </p>

      <div className="mb-3">
        <span className="text-lg font-semibold text-foreground">
          {service.basePrice === 0 ? "Free Quote" : `$${service.basePrice}`}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {service.turnaroundDays} days
        </span>
        
        {isSelected && quantity > 0 ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-secondary rounded-md">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuantityChange?.(service.id, quantity - 1);
                }}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-6 text-center text-sm font-medium">{quantity}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuantityChange?.(service.id, quantity + 1);
                }}
                disabled={quantity >= 10}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <span className="text-xs text-primary font-medium">Selected ✓</span>
          </div>
        ) : (
          <Button
            size="sm"
            variant="default"
            onClick={() => onSelect(service)}
          >
            <Plus className="w-3 h-3" />
            Select
          </Button>
        )}
      </div>
    </div>
  );
};
