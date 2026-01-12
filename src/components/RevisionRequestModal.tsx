import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, MessageSquare, Phone } from "lucide-react";

interface RevisionRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designId: string;
  designName: string;
  onSuccess?: () => void;
}

export const RevisionRequestModal = ({
  open,
  onOpenChange,
  designId,
  designName,
  onSuccess,
}: RevisionRequestModalProps) => {
  const [revisionNotes, setRevisionNotes] = useState("");
  const [contactPreference, setContactPreference] = useState<string>("email");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!revisionNotes.trim()) {
      toast.error("Please describe what you'd like to change");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("user_designs")
        .update({
          status: "revision_requested",
          revision_notes: revisionNotes.trim(),
          revision_contact_preference: contactPreference,
          revision_requested_at: new Date().toISOString(),
        })
        .eq("id", designId);

      if (error) throw error;

      toast.success("We've received your changes. Your jeweler will review and follow up.");
      setRevisionNotes("");
      setContactPreference("email");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting revision request:", error);
      toast.error("Failed to submit revision request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-foreground">
            Request Changes
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Tell us what you'd like adjusted for "{designName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Revision Notes */}
          <div className="space-y-2">
            <Label htmlFor="revision-notes" className="text-foreground">
              What would you like to change?
            </Label>
            <Textarea
              id="revision-notes"
              placeholder="Describe what you want adjusted (e.g., band thickness, stone size, prongs, engraving)."
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Contact Preference */}
          <div className="space-y-3">
            <Label className="text-foreground">
              Preferred contact method (optional)
            </Label>
            <RadioGroup
              value={contactPreference}
              onValueChange={setContactPreference}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="contact-email" />
                <Label htmlFor="contact-email" className="font-normal text-muted-foreground cursor-pointer">
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="call" id="contact-call" />
                <Label htmlFor="contact-call" className="font-normal text-muted-foreground cursor-pointer">
                  Call
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="contact-text" />
                <Label htmlFor="contact-text" className="font-normal text-muted-foreground cursor-pointer">
                  Text
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Call option note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
            <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              If it's easier, call us and we'll refine it together.
            </p>
          </div>

          {/* Reassurance */}
          <p className="text-xs text-muted-foreground text-center">
            These are design inspirations. Every design is reviewed and handcrafted by a master jeweler.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !revisionNotes.trim()}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
