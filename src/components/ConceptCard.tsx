import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Check, RefreshCw, Loader2, Send, Pencil } from "lucide-react";
import { PriceEstimate } from "@/components/PriceEstimate";

interface ConceptSpec {
  name: string;
  overview: string;
  metal: string;
  center_stone: {
    shape: string;
    size_mm: string;
    type: string;
  };
  setting_style: string;
  band: {
    width_mm: string;
    style: string;
    pave: string;
    shoulders: string;
  };
  gallery_details: string;
  prongs: string;
  accent_stones: string;
  manufacturing_notes: string;
}

interface Concept extends ConceptSpec {
  id: string;
  images: {
    hero: string;
    side: string;
    top: string;
  };
  estimated_price?: {
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
}

interface ConceptCardProps {
  concept: Concept;
  onChoose: (concept: Concept) => void;
  onRegenerate: (concept: Concept) => void;
  onSubmit: (concept: Concept) => void;
  onRefine?: (concept: Concept) => void;
  isRegenerating?: boolean;
  isSaving?: boolean;
  isSubmitting?: boolean;
}

export const ConceptCard = ({ 
  concept, 
  onChoose, 
  onRegenerate,
  onSubmit,
  onRefine,
  isRegenerating = false,
  isSaving = false,
  isSubmitting = false,
}: ConceptCardProps) => {
  const [showSpecs, setShowSpecs] = useState(false);
  const [activeImage, setActiveImage] = useState<'hero' | 'side' | 'top'>('hero');

  const currentImage = concept.images[activeImage];
  
  return (
    <Card className="border border-luxury-divider shadow-luxury rounded-xl overflow-hidden bg-white">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative">
          {/* Main Image */}
          <div className="aspect-[4/3] bg-luxury-bg-warm flex items-center justify-center overflow-hidden">
            {currentImage ? (
              <img 
                src={currentImage} 
                alt={`${concept.name} - ${activeImage} view`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8">
                <Sparkles className="w-12 h-12 text-luxury-champagne/40 mx-auto mb-2" />
                <p className="text-sm text-luxury-text-muted">Image generating...</p>
              </div>
            )}
          </div>
          
          {/* Image Thumbnails */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-lg">
            {(['hero', 'side', 'top'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveImage(view)}
                className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                  activeImage === view 
                    ? 'border-luxury-champagne ring-2 ring-luxury-champagne/30' 
                    : 'border-transparent hover:border-luxury-champagne/50'
                }`}
              >
                {concept.images[view] ? (
                  <img 
                    src={concept.images[view]} 
                    alt={`${view} view`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-luxury-bg flex items-center justify-center">
                    <span className="text-[8px] text-luxury-text-muted uppercase">{view}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-serif text-luxury-text mb-2">{concept.name}</h3>
          <p className="text-sm text-luxury-text-muted mb-4 leading-relaxed">{concept.overview}</p>
          
          {/* Quick Specs Preview */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-luxury-bg px-3 py-2 rounded-lg">
              <span className="text-luxury-text-muted">Metal:</span>
              <span className="block font-medium text-luxury-text">{concept.metal}</span>
            </div>
            <div className="bg-luxury-bg px-3 py-2 rounded-lg">
              <span className="text-luxury-text-muted">Stone:</span>
              <span className="block font-medium text-luxury-text">{concept.center_stone.type}</span>
            </div>
            <div className="bg-luxury-bg px-3 py-2 rounded-lg">
              <span className="text-luxury-text-muted">Setting:</span>
              <span className="block font-medium text-luxury-text">{concept.setting_style}</span>
            </div>
            <div className="bg-luxury-bg px-3 py-2 rounded-lg">
              <span className="text-luxury-text-muted">Band:</span>
              <span className="block font-medium text-luxury-text">{concept.band.width_mm}</span>
            </div>
          </div>

          {/* Expandable Full Specs */}
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-luxury-bg rounded-lg text-sm font-medium text-luxury-text hover:bg-luxury-bg-warm transition-colors mb-4"
          >
            <span>Full Specifications</span>
            {showSpecs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showSpecs && (
            <div className="bg-luxury-bg rounded-lg p-4 mb-4 space-y-3 text-sm animate-in slide-in-from-top-2">
              <div>
                <span className="text-luxury-text-muted">Center Stone:</span>
                <p className="font-medium text-luxury-text">
                  {concept.center_stone.shape} {concept.center_stone.type}, {concept.center_stone.size_mm}
                </p>
              </div>
              <div>
                <span className="text-luxury-text-muted">Band Details:</span>
                <p className="font-medium text-luxury-text">
                  {concept.band.style}, {concept.band.width_mm} width
                  {concept.band.pave !== "None" && ` with ${concept.band.pave}`}
                </p>
              </div>
              <div>
                <span className="text-luxury-text-muted">Shoulders:</span>
                <p className="font-medium text-luxury-text">{concept.band.shoulders}</p>
              </div>
              <div>
                <span className="text-luxury-text-muted">Prongs:</span>
                <p className="font-medium text-luxury-text">{concept.prongs}</p>
              </div>
              <div>
                <span className="text-luxury-text-muted">Gallery:</span>
                <p className="font-medium text-luxury-text">{concept.gallery_details}</p>
              </div>
              {concept.accent_stones && concept.accent_stones !== "None" && (
                <div>
                  <span className="text-luxury-text-muted">Accent Stones:</span>
                  <p className="font-medium text-luxury-text">{concept.accent_stones}</p>
                </div>
              )}
              <div className="pt-2 border-t border-luxury-divider">
                <span className="text-luxury-text-muted">Manufacturing Notes:</span>
                <p className="font-medium text-luxury-text text-xs">{concept.manufacturing_notes}</p>
              </div>
            </div>
          )}

          {/* Price Estimate */}
          {concept.estimated_price && (
            <div className="mb-4">
              <PriceEstimate estimate={concept.estimated_price} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary actions row */}
            <div className="flex gap-3">
              <Button 
                onClick={() => onSubmit(concept)}
                disabled={isSubmitting || isSaving}
                className="flex-1 bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold tap-target"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Design
                  </>
                )}
              </Button>
              {onRefine && (
                <Button 
                  variant="outline"
                  onClick={() => onRefine(concept)}
                  className="border-luxury-divider hover:border-luxury-champagne"
                  title="Refine this design"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => onRegenerate(concept)}
                disabled={isRegenerating || isSubmitting}
                className="border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text tap-target"
                title="Generate variations"
              >
                {isRegenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* Save to account */}
            <Button 
              variant="ghost"
              onClick={() => onChoose(concept)}
              disabled={isSaving || isSubmitting}
              className="w-full text-luxury-text-muted hover:text-luxury-text hover:bg-luxury-bg h-9 text-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 mr-2" />
                  Save to My Designs (decide later)
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
