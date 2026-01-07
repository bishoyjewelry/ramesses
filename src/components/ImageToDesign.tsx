import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, Loader2, Sparkles, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageToDesignProps {
  isOpen: boolean;
  onClose: () => void;
  onDesignGenerated: (concept: any) => void;
}

const METAL_OPTIONS = [
  { value: "14k white gold", label: "White Gold", color: "#E8E8E8" },
  { value: "14k yellow gold", label: "Yellow Gold", color: "#FFD700" },
  { value: "14k rose gold", label: "Rose Gold", color: "#E8B4B8" },
  { value: "platinum", label: "Platinum", color: "#D4D4D4" },
];

const STONE_OPTIONS = [
  { value: "round", label: "Round", icon: "⚪" },
  { value: "oval", label: "Oval", icon: "⬭" },
  { value: "cushion", label: "Cushion", icon: "⬜" },
  { value: "emerald", label: "Emerald", icon: "▭" },
  { value: "pear", label: "Pear", icon: "💧" },
  { value: "marquise", label: "Marquise", icon: "◆" },
];

export function ImageToDesign({ isOpen, onClose, onDesignGenerated }: ImageToDesignProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedStone, setSelectedStone] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be less than 10MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!imagePreview) {
      toast.error("Please upload a reference image");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-ring-concepts", {
        body: {
          request_type: "image_to_design",
          reference_image_url: imagePreview,
          style_preferences: {
            metal: selectedMetal || undefined,
            stone_shape: selectedStone || undefined,
          },
          description: description || undefined,
        },
      });

      if (error) throw error;

      if (data?.success && data?.concept) {
        toast.success("Design generated from your image!");
        onDesignGenerated(data.concept);
        handleClose();
      } else {
        throw new Error(data?.error || "Failed to generate design");
      }
    } catch (error) {
      console.error("Image-to-design error:", error);
      toast.error("Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    clearImage();
    setDescription("");
    setSelectedMetal("");
    setSelectedStone("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-serif">
            <ImageIcon className="w-5 h-5 text-luxury-champagne" />
            Create from Reference Image
          </DialogTitle>
          <DialogDescription>
            Upload a photo of a ring you love and we'll create a custom design inspired by it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Reference Image</Label>
            
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-luxury-divider rounded-xl p-8 text-center cursor-pointer hover:border-luxury-champagne/50 transition-colors bg-luxury-bg/50"
              >
                <Upload className="w-10 h-10 text-luxury-text-muted mx-auto mb-3" />
                <p className="text-sm font-medium text-luxury-text">Click to upload</p>
                <p className="text-xs text-luxury-text-muted mt-1">PNG, JPG up to 10MB</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Reference" className="w-full h-48 object-cover" />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Metal Preference */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Preferred Metal (optional)</Label>
            <div className="grid grid-cols-4 gap-2">
              {METAL_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedMetal(selectedMetal === option.value ? "" : option.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    selectedMetal === option.value
                      ? "border-luxury-champagne bg-luxury-champagne/10"
                      : "border-luxury-divider hover:border-luxury-champagne/50"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full mx-auto mb-1.5 border border-luxury-divider"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-xs font-medium text-luxury-text">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stone Shape */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Stone Shape (optional)</Label>
            <div className="grid grid-cols-6 gap-2">
              {STONE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedStone(selectedStone === option.value ? "" : option.value)}
                  className={`p-2 rounded-lg border-2 transition-all text-center ${
                    selectedStone === option.value
                      ? "border-luxury-champagne bg-luxury-champagne/10"
                      : "border-luxury-divider hover:border-luxury-champagne/50"
                  }`}
                >
                  <span className="text-lg block">{option.icon}</span>
                  <span className="text-[10px] text-luxury-text-muted">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">What do you love about this design?</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., I love the delicate band and low setting... but I'd prefer rose gold"
              rows={2}
              className="border-luxury-divider focus:border-luxury-champagne text-sm"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!imagePreview || isGenerating}
            className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover py-5"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Your Design...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Custom Design
              </>
            )}
          </Button>

          <p className="text-xs text-center text-luxury-text-muted">
            We'll create a unique design inspired by your reference — not an exact copy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
