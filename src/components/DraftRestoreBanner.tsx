import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DraftRestoreBannerProps {
  onResume: () => void;
  onDiscard: () => void;
}

export function DraftRestoreBanner({ onResume, onDiscard }: DraftRestoreBannerProps) {
  return (
    <div className="bg-luxury-champagne/15 border border-luxury-champagne/30 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-luxury-champagne/20 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-luxury-champagne" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-luxury-text mb-1">
            We saved your draft.
          </p>
          <p className="text-xs text-luxury-text-muted mb-3">
            Continue where you left off.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onResume}
              className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover text-xs px-4"
            >
              Resume
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDiscard}
              className="text-luxury-text-muted hover:text-luxury-text text-xs px-3"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Discard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
