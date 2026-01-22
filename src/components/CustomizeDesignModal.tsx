import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Design {
  id: string;
  title: string;
  description: string | null;
  main_image_url: string;
  startingPrice: number;
  creator_profiles?: {
    display_name: string;
  };
}

interface CustomizeDesignModalProps {
  design: Design | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizeDesignModal = ({ design, isOpen, onClose }: CustomizeDesignModalProps) => {
  const [metal, setMetal] = useState('');
  const [ringSize, setRingSize] = useState('');
  const [customizations, setCustomizations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!design) return null;

  const handleSubmit = async () => {
    if (!customizations.trim()) {
      toast.error("Please describe the changes you'd like");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Submit to backend/Supabase
      // This should follow the same flow as submitting a custom design
      // Include: design.id, design.title, metal, ringSize, customizations
      
      // For now, show success and close
      toast.success("Customization request submitted! We'll be in touch within 24 hours.");
      
      // Reset form
      setMetal('');
      setRingSize('');
      setCustomizations('');
      onClose();
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setMetal('');
    setRingSize('');
    setCustomizations('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Customize This Design</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Design Preview */}
          <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
            <img 
              src={design.main_image_url} 
              alt={design.title}
              className="w-20 h-20 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-foreground font-medium truncate">
                {design.title}
              </h3>
              {design.description && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {design.description}
                </p>
              )}
              <p className="text-primary font-medium mt-1">
                Starting at ${design.startingPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Metal Selection */}
          <div>
            <Label className="text-sm font-medium">Preferred Metal (optional)</Label>
            <Select value={metal} onValueChange={setMetal}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select metal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="14k-yellow">14K Yellow Gold</SelectItem>
                <SelectItem value="14k-white">14K White Gold</SelectItem>
                <SelectItem value="14k-rose">14K Rose Gold</SelectItem>
                <SelectItem value="18k-yellow">18K Yellow Gold</SelectItem>
                <SelectItem value="18k-white">18K White Gold</SelectItem>
                <SelectItem value="18k-rose">18K Rose Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="not-sure">Not sure yet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ring Size */}
          <div>
            <Label className="text-sm font-medium">Ring Size (optional)</Label>
            <Select value={ringSize} onValueChange={setRingSize}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select ring size" />
              </SelectTrigger>
              <SelectContent>
                {[4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12].map(size => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
                <SelectItem value="not-sure">Not sure yet</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Don't worry - we offer free resizing
            </p>
          </div>

          {/* Customization Description */}
          <div>
            <Label className="text-sm font-medium">
              What changes would you like? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={customizations}
              onChange={(e) => setCustomizations(e.target.value)}
              placeholder="Example: I'd like to change the center stone to a sapphire, make the band thinner, and add small diamonds on the sides..."
              className="mt-1.5 min-h-[120px] resize-none"
            />
          </div>

          {/* Info Note */}
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Our jeweler will review your request and send you a custom quote within 24 hours.
            No commitment until you approve the final design.
          </p>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-[hsl(var(--color-gold-hover))]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit to Jeweler'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
