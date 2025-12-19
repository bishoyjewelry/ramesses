import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, ArrowRight, Check, CheckCircle, Upload, 
  CircleDot, Package, MapPin, Truck, UserPlus, LogIn, Home,
  Camera, Shield, Video
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

// Types
type FulfillmentMethod = "mail_in" | "drop_off" | "courier";

interface FormData {
  name: string;
  email: string;
  phone: string;
  jewelryType: string;
  repairNeeded: string[];
  notes: string;
  fulfillmentMethod: FulfillmentMethod;
  preferredDropoffDate: string;
  preferredDropoffTime: string;
  dropoffNotes: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  pickupWindow: string;
  courierNotes: string;
}

// Jewelry type options
const jewelryTypes = [
  { value: "ring", label: "Ring", icon: "💍" },
  { value: "necklace", label: "Necklace / Chain", icon: "📿" },
  { value: "bracelet", label: "Bracelet", icon: "⌚" },
  { value: "earrings", label: "Earrings", icon: "✨" },
  { value: "watch", label: "Watch", icon: "⏱️" },
  { value: "other", label: "Other", icon: "💎" },
];

// Repair type options with estimate ranges
const repairTypes = [
  { value: "broken_chain", label: "Broken chain", estimate: "$25–$75" },
  { value: "ring_resizing", label: "Ring resizing", estimate: "$45–$95" },
  { value: "stone_loose", label: "Stone loose or missing", estimate: "$35–$120" },
  { value: "prong_repair", label: "Prong repair", estimate: "$35–$90" },
  { value: "clasp_repair", label: "Clasp repair", estimate: "$25–$65" },
  { value: "polishing", label: "Polishing / cleaning", estimate: "$35–$65" },
  { value: "soldering", label: "Soldering", estimate: "$30–$80" },
  { value: "not_sure", label: "Not sure / need expert review", estimate: null },
];

// Fulfillment options
const fulfillmentOptions = [
  { 
    value: "mail_in", 
    label: "Mail-in (insured shipping)", 
    description: "We email you a prepaid label. Ship when ready.",
    icon: Package 
  },
  { 
    value: "drop_off", 
    label: "Drop off in person (NYC)", 
    description: "Bring it to our 47th Street location.",
    icon: MapPin 
  },
  { 
    value: "courier", 
    label: "Local pickup (Manhattan / North Jersey)", 
    description: "We arrange a pickup time that works for you.",
    icon: Truck 
  },
];

interface RepairWizardProps {
  preselectedRepair?: string | null;
  notSureMode?: boolean;
}

export const RepairWizard = ({ preselectedRepair, notSureMode }: RepairWizardProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    // Initialize with preselected repair if provided
    const initialRepairs: string[] = [];
    if (preselectedRepair) {
      initialRepairs.push(preselectedRepair);
    } else if (notSureMode) {
      initialRepairs.push("not_sure");
    }
    
    return {
      name: "",
      email: "",
      phone: "",
      jewelryType: "",
      repairNeeded: initialRepairs,
      notes: "",
      fulfillmentMethod: "mail_in",
      preferredDropoffDate: "",
      preferredDropoffTime: "",
      dropoffNotes: "",
      streetAddress: "",
      city: "",
      state: "",
      zip: "",
      pickupWindow: "",
      courierNotes: "",
    };
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = 5;

  // Navigation
  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Validation
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.jewelryType !== "";
      case 2:
        return formData.repairNeeded.length > 0;
      case 3:
        return true; // Photos are optional
      case 4:
        return true; // Fulfillment method always has a default value
      case 5:
        return formData.name.trim() !== "" && formData.email.trim() !== "";
      default:
        return false;
    }
  };

  // Handle repair type selection (multi-select)
  const toggleRepairType = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      repairNeeded: prev.repairNeeded.includes(value)
        ? prev.repairNeeded.filter((v) => v !== value)
        : [...prev.repairNeeded, value],
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (uploadedImages.length + files.length > 6) {
        toast.error("Maximum 6 images allowed");
        return;
      }
      setUploadedImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Convert repair types array to string for notes
      const repairDescription = formData.repairNeeded
        .map((r) => repairTypes.find((t) => t.value === r)?.label || r)
        .join(", ");

      const repairData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        item_type: formData.jewelryType,
        repair_type: repairDescription,
        description: formData.notes || repairDescription,
        status: "pending" as const,
        fulfillment_method: formData.fulfillmentMethod,
        preferred_dropoff_time:
          formData.fulfillmentMethod === "drop_off"
            ? formData.preferredDropoffDate
              ? `${formData.preferredDropoffDate} - ${formData.preferredDropoffTime || "Any time"}`
              : formData.preferredDropoffTime
            : null,
        logistics_notes:
          formData.fulfillmentMethod === "drop_off"
            ? formData.dropoffNotes
            : formData.fulfillmentMethod === "courier"
              ? formData.courierNotes
              : null,
        street_address: formData.fulfillmentMethod === "courier" ? formData.streetAddress : null,
        city: formData.fulfillmentMethod === "courier" ? formData.city : null,
        state: formData.fulfillmentMethod === "courier" ? formData.state : null,
        zip: formData.fulfillmentMethod === "courier" ? formData.zip : null,
        pickup_window: formData.fulfillmentMethod === "courier" ? formData.pickupWindow : null,
        user_id: user?.id || null,
      };

      const { data: insertedRepair, error } = await supabase
        .from("repair_quotes")
        .insert([repairData])
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email
      try {
        await supabase.functions.invoke("send-repair-status-email", {
          body: {
            repair_id: insertedRepair.id,
            previous_status: null,
            new_status: "pending",
          },
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting repair quote:", error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress indicator
  const ProgressIndicator = () => (
    <div className="mb-10">
      <div className="flex items-center justify-center gap-2 mb-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                i + 1 < currentStep
                  ? "bg-service-gold text-white"
                  : i + 1 === currentStep
                    ? "bg-service-gold text-white ring-4 ring-service-gold/20"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-1 transition-all ${
                  i + 1 < currentStep ? "bg-service-gold" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );

  // Step 1: Jewelry Type
  const Step1 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-serif font-medium text-foreground mb-2">
          What type of jewelry is it?
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {jewelryTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setFormData({ ...formData, jewelryType: type.value })}
            className={`p-6 rounded-lg border-2 transition-all text-center ${
              formData.jewelryType === type.value
                ? "border-service-gold bg-service-gold/5"
                : "border-border hover:border-service-gold/50 bg-background"
            }`}
          >
            <span className="text-3xl mb-3 block">{type.icon}</span>
            <span className="font-medium text-foreground">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 2: Repair Type
  const Step2 = () => {
    const isNotSureSelected = formData.repairNeeded.includes("not_sure");
    const selectedRepairs = formData.repairNeeded.filter(r => r !== "not_sure");
    const hasMultipleSelections = selectedRepairs.length > 1;
    
    // Get estimate for display
    const getEstimateDisplay = () => {
      if (isNotSureSelected) {
        return null; // Will show special message
      }
      if (hasMultipleSelections) {
        return "multiple";
      }
      if (selectedRepairs.length === 1) {
        const repair = repairTypes.find(t => t.value === selectedRepairs[0]);
        return repair?.estimate || null;
      }
      return null;
    };
    
    const estimateDisplay = getEstimateDisplay();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-serif font-medium text-foreground mb-2">
            What does it need?
          </h3>
          <p className="text-muted-foreground text-sm">Select all that apply. Not sure? That's okay — choose "Need expert review" below.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {repairTypes.map((type) => {
            const isSelected = formData.repairNeeded.includes(type.value);
            const isNotSureOption = type.value === "not_sure";
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => toggleRepairType(type.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? "border-service-gold bg-service-gold/5"
                    : "border-border hover:border-service-gold/50 bg-background"
                } ${isNotSureOption ? "sm:col-span-2" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? "border-service-gold bg-service-gold"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">{type.label}</span>
                </div>
                {/* Show estimate inline when selected and it's a single selection */}
                {isSelected && type.estimate && !hasMultipleSelections && !isNotSureSelected && (
                  <div className="mt-2 ml-8 text-sm text-service-gold">
                    Typical range: {type.estimate}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Estimate/Reassurance Panel */}
        {isNotSureSelected ? (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-foreground text-sm mb-1">No problem — we'll figure it out together.</p>
            <p className="text-muted-foreground text-sm">
              Send photos or ship it to us. Our jeweler will inspect it on video and send you a quote before any work begins.
            </p>
          </div>
        ) : estimateDisplay === "multiple" ? (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground text-sm text-center">
              Multiple repairs selected — we'll send a combined quote after inspection.
            </p>
            <p className="text-xs text-muted-foreground/70 text-center mt-2">
              No work begins without your approval.
            </p>
          </div>
        ) : estimateDisplay ? (
          <div className="p-4 bg-service-gold/5 border border-service-gold/20 rounded-lg">
            <p className="text-foreground text-sm text-center mb-1">
              Typical repair range: <span className="font-semibold text-service-gold">{estimateDisplay}</span>
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Final quote provided after inspection. No work begins without your approval.
            </p>
          </div>
        ) : null}
      </div>
    );
  };

  // Step 3: Photo Upload
  const Step3 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-serif font-medium text-foreground mb-2">
          Got photos? They help us quote faster.
        </h3>
        <p className="text-muted-foreground text-sm">
          A quick snapshot of the damage speeds up the process — but it's not required. We'll inspect everything when it arrives.
        </p>
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-service-gold/50 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
          id="wizard-image-upload"
        />
        <label htmlFor="wizard-image-upload" className="cursor-pointer block">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-1">Tap to add photos</p>
          <p className="text-muted-foreground text-sm">Up to 6 images — phone photos work great</p>
        </label>
      </div>

      {uploadedImages.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {uploadedImages.map((file, index) => (
            <div key={index} className="relative group">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadedImages.length === 0 && (
        <p className="text-center text-xs text-muted-foreground">
          No camera handy? No problem — skip this step and we'll assess everything in person.
        </p>
      )}
    </div>
  );

  // Step 4: Fulfillment Method
  const Step4 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-serif font-medium text-foreground mb-2">
          How would you like to get your jewelry to us?
        </h3>
      </div>

      <div className="space-y-3">
        {fulfillmentOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              setFormData({ ...formData, fulfillmentMethod: option.value as FulfillmentMethod })
            }
            className={`w-full p-5 rounded-lg border-2 transition-all text-left flex items-start gap-4 ${
              formData.fulfillmentMethod === option.value
                ? "border-service-gold bg-service-gold/5"
                : "border-border hover:border-service-gold/50 bg-background"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                formData.fulfillmentMethod === option.value
                  ? "border-service-gold"
                  : "border-muted-foreground/30"
              }`}
            >
              {formData.fulfillmentMethod === option.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-service-gold" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <option.icon className="w-5 h-5 text-service-gold" />
                <span className="font-medium text-foreground">{option.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      {formData.fulfillmentMethod === "courier" && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-muted-foreground text-sm">
            We'll contact you to schedule a pickup window after you submit your request.
          </p>
        </div>
      )}
    </div>
  );

  // Step 5: Contact Info
  const Step5 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-serif font-medium text-foreground mb-2">
          Where should we send updates?
        </h3>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Full name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Your name"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">Email *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="your@email.com"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">Phone (optional)</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(555) 123-4567"
            className="h-12"
          />
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        We will inspect your jewelry on video and email you a quote. No work begins without your approval.
      </p>
    </div>
  );

  // Success Confirmation
  const SuccessConfirmation = () => (
    <div className="text-center py-8 space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-serif font-medium text-foreground mb-2">
          You're all set.
        </h3>
        <p className="text-muted-foreground">
          We received your request and will email you within 24 hours.
        </p>
      </div>

      <div className="bg-muted rounded-lg p-6 text-left max-w-md mx-auto">
        <h4 className="font-semibold text-foreground mb-3">Here's what to expect:</h4>
        <ol className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary font-medium">1.</span>
            <span>We email you a <strong className="text-foreground">prepaid, insured shipping label</strong> within 24 hours.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-medium">2.</span>
            <span>Ship your jewelry when ready. We <strong className="text-foreground">record a video</strong> when it arrives so you see exactly what we receive.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-medium">3.</span>
            <span>You receive a quote. <strong className="text-foreground">No work begins until you approve.</strong></span>
          </li>
        </ol>
      </div>

      <div className="bg-service-gold/5 border border-service-gold/20 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-foreground">
          Your piece is <strong>fully insured</strong> from the moment it leaves your hands until it's returned to you.
        </p>
      </div>

      {user ? (
        <Link to="/my-repairs">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
            Track Your Repair
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Check your email for confirmation and next steps.
          </p>
          <Link to="/auth?mode=signup&redirect=/my-repairs">
            <Button variant="outline" className="px-6 w-full sm:w-auto">
              <UserPlus className="w-4 h-4 mr-2" />
              Create account to track online
            </Button>
          </Link>
          <div>
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Return to homepage
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border border-border shadow-soft">
        <CardContent className="p-8 md:p-10">
          <SuccessConfirmation />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-soft">
      <CardContent className="p-6 md:p-10">
        {/* Safety reassurance strip */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground mb-8 pb-6 border-b border-border">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-service-gold" />
            Fully insured shipping
          </span>
          <span className="flex items-center gap-1.5">
            <Video className="w-4 h-4 text-service-gold" />
            Video documentation
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Check className="w-4 h-4 text-service-gold" />
            No work without approval
          </span>
        </div>
        
        <ProgressIndicator />

        <div className="min-h-[320px]">{renderStep()}</div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={currentStep === 1}
            className={currentStep === 1 ? "invisible" : ""}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={goNext}
              disabled={!canProceed()}
              className="bg-service-gold text-white hover:bg-service-gold-hover px-8"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="bg-service-gold text-white hover:bg-service-gold-hover px-8"
            >
              {isSubmitting ? "Submitting..." : "Submit Repair Request"}
            </Button>
          )}
        </div>

        {/* Skip option for Step 3 */}
        {currentStep === 3 && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={goNext}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip this step
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
