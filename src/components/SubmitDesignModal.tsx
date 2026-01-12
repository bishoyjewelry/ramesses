import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Phone, Loader2, Send, MessageSquare, ArrowLeft } from "lucide-react";

interface SubmitDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes?: string, contactPreference?: string, bestTime?: string) => Promise<void>;
  isSubmitting: boolean;
  designName: string;
}

export const SubmitDesignModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  designName,
}: SubmitDesignModalProps) => {
  const [mode, setMode] = useState<"choose" | "notes">("choose");
  const [notes, setNotes] = useState("");
  const [contactPreference, setContactPreference] = useState("");
  const [bestTime, setBestTime] = useState("");

  const handleDirectSubmit = async () => {
    await onSubmit();
  };

  const handleSubmitWithNotes = async () => {
    await onSubmit(notes, contactPreference, bestTime);
  };

  const handleClose = () => {
    setMode("choose");
    setNotes("");
    setContactPreference("");
    setBestTime("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-luxury-text">
            {mode === "choose" ? "Submit Your Design" : "Add Notes for Your Jeweler"}
          </DialogTitle>
        </DialogHeader>

        {mode === "choose" ? (
          <div className="space-y-5 py-2">
            <p className="text-sm text-luxury-text-muted">
              Ready to submit <span className="font-medium text-luxury-text">{designName}</span>?
            </p>

            {/* Reassurance */}
            <p className="text-xs text-luxury-text-muted/80 bg-luxury-bg px-3 py-2 rounded-lg">
              These are design inspirations to guide the conversation. Every design is reviewed and handcrafted by a master jeweler.
            </p>

            {/* Primary: Submit now */}
            <Button
              onClick={handleDirectSubmit}
              disabled={isSubmitting}
              className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold h-12"
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

            {/* Secondary: Add notes */}
            <Button
              variant="outline"
              onClick={() => setMode("notes")}
              disabled={isSubmitting}
              className="w-full border-luxury-divider text-luxury-text hover:bg-luxury-bg h-12"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Request changes / add notes
            </Button>

            {/* Call option */}
            <div className="flex items-center gap-2 text-xs text-luxury-text-muted pt-2 border-t border-luxury-divider">
              <Phone className="w-3.5 h-3.5" />
              <span>If it's easier, call us and we'll refine it together.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            {/* Back button */}
            <button
              onClick={() => setMode("choose")}
              className="flex items-center gap-1.5 text-sm text-luxury-text-muted hover:text-luxury-text transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            {/* Notes textarea */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-luxury-text">
                Notes for Your Jeweler
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us what the rendering missed or what you want changed (e.g., thinner band, higher setting, hidden halo, engraving, different prongs)."
                className="min-h-[100px] border-luxury-divider focus:border-luxury-champagne resize-none"
              />
            </div>

            {/* Optional: Contact preference */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-luxury-text">
                Preferred contact method <span className="text-luxury-text-muted font-normal">(optional)</span>
              </Label>
              <RadioGroup
                value={contactPreference}
                onValueChange={setContactPreference}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="call" id="call" />
                  <Label htmlFor="call" className="text-sm text-luxury-text cursor-pointer">Call</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text" className="text-sm text-luxury-text cursor-pointer">Text</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="text-sm text-luxury-text cursor-pointer">Email</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Optional: Best time */}
            <div className="space-y-2">
              <Label htmlFor="bestTime" className="text-sm font-medium text-luxury-text">
                Best time to reach you <span className="text-luxury-text-muted font-normal">(optional)</span>
              </Label>
              <Input
                id="bestTime"
                value={bestTime}
                onChange={(e) => setBestTime(e.target.value)}
                placeholder="e.g., Weekday afternoons, after 5pm"
                className="border-luxury-divider focus:border-luxury-champagne"
              />
            </div>

            {/* Reassurance */}
            <p className="text-xs text-luxury-text-muted/80">
              Every design is reviewed and handcrafted by a master jeweler.
            </p>

            {/* Submit button */}
            <Button
              onClick={handleSubmitWithNotes}
              disabled={isSubmitting}
              className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold h-12"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit with Notes
                </>
              )}
            </Button>

            {/* Call option */}
            <div className="flex items-center gap-2 text-xs text-luxury-text-muted pt-2 border-t border-luxury-divider">
              <Phone className="w-3.5 h-3.5" />
              <span>If it's easier, call us and we'll refine it together.</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
