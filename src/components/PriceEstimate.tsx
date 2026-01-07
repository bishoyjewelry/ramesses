import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DollarSign, Info, ChevronDown, ChevronUp } from "lucide-react";

interface PriceEstimateProps {
  estimate?: {
    low: number;
    high: number;
    breakdown?: {
      metal_weight_grams: number;
      metal_cost: number;
      center_stone_cost: string;
      accent_stones_cost: number;
      labor_cost: number;
    };
  };
  compact?: boolean;
}

export function PriceEstimate({ estimate, compact = false }: PriceEstimateProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!estimate) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1.5 text-sm text-luxury-text-muted cursor-help">
              <DollarSign className="w-3.5 h-3.5" />
              <span>
                {formatPrice(estimate.low)} – {formatPrice(estimate.high)}
              </span>
              <Info className="w-3 h-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-[200px]">
              Estimated price range. Final quote may vary based on exact stone quality and specifications.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="bg-luxury-bg rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-luxury-champagne/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-luxury-champagne" />
          </div>
          <div>
            <p className="text-xs text-luxury-text-muted">Estimated Price</p>
            <p className="text-lg font-semibold text-luxury-text">
              {formatPrice(estimate.low)} – {formatPrice(estimate.high)}
            </p>
          </div>
        </div>
        
        {estimate.breakdown && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-xs text-luxury-text-muted hover:text-luxury-text"
          >
            {showBreakdown ? (
              <>Hide <ChevronUp className="w-3 h-3 ml-1" /></>
            ) : (
              <>Details <ChevronDown className="w-3 h-3 ml-1" /></>
            )}
          </Button>
        )}
      </div>

      {showBreakdown && estimate.breakdown && (
        <div className="pt-3 border-t border-luxury-divider space-y-2 text-sm">
          <div className="flex justify-between text-luxury-text-muted">
            <span>Metal (~{estimate.breakdown.metal_weight_grams}g)</span>
            <span>{formatPrice(estimate.breakdown.metal_cost)}</span>
          </div>
          <div className="flex justify-between text-luxury-text-muted">
            <span>Center Stone</span>
            <span>{estimate.breakdown.center_stone_cost}</span>
          </div>
          {estimate.breakdown.accent_stones_cost > 0 && (
            <div className="flex justify-between text-luxury-text-muted">
              <span>Accent Stones</span>
              <span>{formatPrice(estimate.breakdown.accent_stones_cost)}</span>
            </div>
          )}
          <div className="flex justify-between text-luxury-text-muted">
            <span>Design & Labor</span>
            <span>{formatPrice(estimate.breakdown.labor_cost)}</span>
          </div>
          <p className="text-xs text-luxury-text-muted/70 pt-2">
            * Center stone price varies by quality. Request quote for exact pricing.
          </p>
        </div>
      )}
    </div>
  );
}
