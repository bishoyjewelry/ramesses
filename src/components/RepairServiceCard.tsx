import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";

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
}

export const RepairServiceCard = ({ service, onSelect, isSelected }: RepairServiceCardProps) => {
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
        <Button
          size="sm"
          variant={isSelected ? "secondary" : "default"}
          onClick={() => onSelect(service)}
        >
          {isSelected ? (
            "Selected ✓"
          ) : (
            <>
              <Plus className="w-3 h-3" />
              Select
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
