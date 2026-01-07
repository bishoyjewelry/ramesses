import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const QUICK_REFINEMENTS = [
  { label: "Thinner band", instruction: "Make the band thinner by about 0.3mm" },
  { label: "Wider band", instruction: "Make the band wider by about 0.3mm" },
  { label: "More sparkle", instruction: "Add more accent diamonds or pavé" },
  { label: "Simpler", instruction: "Remove accent stones, keep it clean and minimal" },
  { label: "Add hidden halo", instruction: "Add a hidden halo beneath the center stone" },
  { label: "Cathedral shoulders", instruction: "Change to cathedral-style shoulders" },
  { label: "Split shank", instruction: "Change the band to a split shank design" },
  { label: "Knife-edge band", instruction: "Change to a knife-edge band profile" },
];

interface ConceptRefinementProps {
  concept: any;
  onRefined: (refinedConcept: any) => void;
  onClose: () => void;
}

export function ConceptRefinement({ concept, onRefined, onClose }: ConceptRefinementProps) {
  const [isRefining, setIsRefining] = useState(false);
  const [customInstruction, setCustomInstruction] = useState("");
  const [refinementHistory, setRefinementHistory] = useState<string[]>([]);

  const handleRefine = async (instruction: string) => {
    if (!instruction.trim()) {
      toast.error("Please enter a refinement instruction");
      return;
    }

    setIsRefining(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-ring-concepts", {
        body: {
          request_type: "refine",
          concept: concept,
          refinement_instruction: instruction,
          views_to_regenerate: ["hero", "side"],
        },
      });

      if (error) throw error;

      if (data?.success && data?.concept) {
        setRefinementHistory((prev) => [...prev, instruction]);
        onRefined(data.concept);
        toast.success("Design refined successfully!");
        setCustomInstruction("");
      } else {
        throw new Error(data?.error || "Failed to refine design");
      }
    } catch (error) {
      console.error("Refinement error:", error);
      toast.error("Failed to refine design. Please try again.");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="bg-white border border-luxury-divider rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif text-luxury-text">Refine This Design</h3>
        <div className="flex items-center gap-2">
          {refinementHistory.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {refinementHistory.length} change{refinementHistory.length > 1 ? "s" : ""}
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_REFINEMENTS.map((refinement) => (
          <Button
            key={refinement.label}
            variant="outline"
            size="sm"
            disabled={isRefining}
            onClick={() => handleRefine(refinement.instruction)}
            className="text-xs border-luxury-divider hover:border-luxury-champagne hover:bg-luxury-champagne/10"
          >
            {refinement.label}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <Textarea
          value={customInstruction}
          onChange={(e) => setCustomInstruction(e.target.value)}
          placeholder="Or describe your own change... (e.g., 'Add milgrain detail to the band edges')"
          rows={2}
          disabled={isRefining}
          className="border-luxury-divider focus:border-luxury-champagne text-sm"
        />
        <Button
          onClick={() => handleRefine(customInstruction)}
          disabled={isRefining || !customInstruction.trim()}
          className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover"
        >
          {isRefining ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Refining design...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Apply Custom Change
            </>
          )}
        </Button>
      </div>

      {refinementHistory.length > 0 && (
        <div className="pt-3 border-t border-luxury-divider">
          <p className="text-xs text-luxury-text-muted mb-2">Changes applied:</p>
          <ul className="space-y-1">
            {refinementHistory.map((instruction, index) => (
              <li key={index} className="text-xs text-luxury-text-muted flex items-start gap-2">
                <span className="text-luxury-champagne">✓</span>
                {instruction}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
