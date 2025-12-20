import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { LoginModal } from "@/components/LoginModal";
import { ConceptCard } from "@/components/ConceptCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Upload, Sparkles, Gem, Heart, ArrowRight, CheckCircle2, MessageCircle, 
  Palette, FileCheck, Package, Loader2, Wand2, ImagePlus, HelpCircle, Camera
} from "lucide-react";

type DesignFlow = "general" | "engagement" | null;

interface Concept {
  id: string;
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
  images: {
    hero: string;
    side: string;
    top: string;
  };
}

// Visual selection options
const jewelryTypeOptions = [
  { value: "ring", label: "Ring", icon: "💍" },
  { value: "pendant", label: "Pendant", icon: "📿" },
  { value: "chain", label: "Chain", icon: "⛓️" },
  { value: "bracelet", label: "Bracelet", icon: "⌚" },
  { value: "earrings", label: "Earrings", icon: "✨" },
  { value: "redesign", label: "Redesign / Heirloom", icon: "♻️" },
];

const ringStyleOptions = [
  { value: "solitaire", label: "Solitaire", description: "Classic & timeless" },
  { value: "halo", label: "Halo", description: "Extra sparkle" },
  { value: "hidden-halo", label: "Hidden Halo", description: "Subtle brilliance" },
  { value: "three-stone", label: "Three-Stone", description: "Symbolic trio" },
  { value: "pave", label: "Pavé", description: "Diamond-encrusted" },
  { value: "other", label: "Other / Unsure", description: "Open to ideas" },
];

const stoneShapeOptions = [
  { value: "round", label: "Round", icon: "⚪" },
  { value: "oval", label: "Oval", icon: "⬭" },
  { value: "emerald", label: "Emerald", icon: "▭" },
  { value: "cushion", label: "Cushion", icon: "⬜" },
  { value: "pear", label: "Pear", icon: "💧" },
  { value: "radiant", label: "Radiant", icon: "◇" },
  { value: "marquise", label: "Marquise", icon: "◆" },
];

const metalOptions = [
  { value: "14k-yellow", label: "Yellow Gold", color: "#FFD700" },
  { value: "14k-white", label: "White Gold", color: "#E8E8E8" },
  { value: "14k-rose", label: "Rose Gold", color: "#E8B4B8" },
  { value: "platinum", label: "Platinum", color: "#D4D4D4" },
  { value: "not-sure", label: "Not Sure", color: null },
];

const Custom = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const styleParam = searchParams.get('style');
  
  const [activeFlow, setActiveFlow] = useState<DesignFlow>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDirectUploadModal, setShowDirectUploadModal] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const conceptsRef = useRef<HTMLDivElement>(null);
  
  // AI Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  
  // Direct upload state
  const [directUploadImages, setDirectUploadImages] = useState<File[]>([]);
  const [directUploadForm, setDirectUploadForm] = useState({
    metal: "",
    stoneDetails: "",
    budget: "",
    notes: "",
  });
  const [isSubmittingDirect, setIsSubmittingDirect] = useState(false);
  
  // Set mode from URL params on mount
  useEffect(() => {
    if (modeParam === 'engagement') {
      setActiveFlow('engagement');
      if (styleParam) {
        setEngagementForm(prev => ({ ...prev, style: styleParam }));
      }
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (modeParam === 'general') {
      setActiveFlow('general');
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [modeParam, styleParam]);
  
  // General jewelry form state
  const [generalForm, setGeneralForm] = useState({
    pieceType: "",
    metal: "",
    style: "",
    stonePreferences: "",
    budget: "",
    description: "",
  });
  
  // Engagement ring form state
  const [engagementForm, setEngagementForm] = useState({
    style: styleParam || "",
    stoneShape: "",
    centerStoneType: "",
    centerStoneSize: "",
    metal: "",
    ringSize: "",
    budget: "",
    specialRequests: "",
  });
  
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (uploadedImages.length + files.length > 6) {
        toast.error("Maximum 6 images allowed");
        return;
      }
      setUploadedImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCardSelect = (flow: DesignFlow) => {
    setActiveFlow(flow);
    setConcepts([]); // Clear previous concepts
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleGenerateConcepts = async (surpriseMe = false) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    setIsGenerating(true);
    setConcepts([]);
    
    try {
      const formInputs = activeFlow === "engagement" ? {
        flowType: "engagement",
        ...engagementForm,
      } : {
        flowType: "general",
        ...generalForm,
      };

      const { data, error } = await supabase.functions.invoke('generate-ring-concepts', {
        body: { formInputs, surpriseMe }
      });

      if (error) throw error;
      
      if (data?.concepts) {
        setConcepts(data.concepts);
        toast.success(`Generated ${data.concepts.length} concept${data.concepts.length > 1 ? 's' : ''}!`);
        
        setTimeout(() => {
          conceptsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        throw new Error("No concepts returned");
      }
    } catch (error) {
      console.error('Error generating concepts:', error);
      toast.error("Failed to generate concepts. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateConcept = async (concept: Concept) => {
    if (!user) return;
    
    setRegeneratingId(concept.id);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ring-concepts', {
        body: { 
          formInputs: activeFlow === "engagement" ? { flowType: "engagement", ...engagementForm } : { flowType: "general", ...generalForm },
          regenerateFrom: concept 
        }
      });

      if (error) throw error;
      
      if (data?.concepts) {
        // Add new variations while keeping the original
        setConcepts(prev => [...prev, ...data.concepts]);
        toast.success(`Generated ${data.concepts.length} variation${data.concepts.length > 1 ? 's' : ''}!`);
      }
    } catch (error) {
      console.error('Error regenerating:', error);
      toast.error("Failed to regenerate. Please try again.");
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleChooseConcept = async (concept: Concept) => {
    if (!user) return;
    
    setSavingId(concept.id);
    
    try {
      const formInputs = activeFlow === "engagement" ? engagementForm : generalForm;
      
      const { data, error } = await supabase
        .from('user_designs')
        .insert([{
          user_id: user.id,
          name: concept.name,
          overview: concept.overview,
          flow_type: activeFlow || 'engagement',
          form_inputs: formInputs,
          spec_sheet: {
            metal: concept.metal,
            center_stone: concept.center_stone,
            setting_style: concept.setting_style,
            band: concept.band,
            gallery_details: concept.gallery_details,
            prongs: concept.prongs,
            accent_stones: concept.accent_stones,
            manufacturing_notes: concept.manufacturing_notes,
          },
          hero_image_url: concept.images.hero,
          side_image_url: concept.images.side,
          top_image_url: concept.images.top,
          status: 'saved',
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success(
        <div className="flex flex-col gap-1">
          <span>Design saved to your account!</span>
          <Link to={`/my-designs/${data.id}`} className="text-luxury-champagne underline text-sm">
            View in My Designs →
          </Link>
        </div>,
        { duration: 5000 }
      );
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error("Failed to save design. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  // Direct upload handlers
  const handleDirectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (directUploadImages.length + files.length > 6) {
        toast.error("Maximum 6 images allowed");
        return;
      }
      setDirectUploadImages(prev => [...prev, ...files]);
    }
  };

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (directUploadImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    
    setIsSubmittingDirect(true);
    
    try {
      // In a real implementation, we'd upload images to storage first
      // For now, we'll just create the inquiry
      const { error } = await supabase
        .from('custom_inquiries')
        .insert([{
          piece_type: 'Direct Upload - Quote Request',
          description: `Metal: ${directUploadForm.metal}\nStone Details: ${directUploadForm.stoneDetails}\n\nNotes:\n${directUploadForm.notes}`,
          budget_range: directUploadForm.budget,
          name: user.email?.split('@')[0] || 'Customer',
          email: user.email || '',
          user_id: user.id,
        }]);

      if (error) throw error;

      toast.success("Quote request submitted! We'll contact you soon.");
      setShowDirectUploadModal(false);
      setDirectUploadImages([]);
      setDirectUploadForm({ metal: "", stoneDetails: "", budget: "", notes: "" });
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmittingDirect(false);
    }
  };

  const processSteps = [
    { step: 1, title: "Share Your Inspiration", icon: MessageCircle },
    { step: 2, title: "AI Generates Concepts", icon: Sparkles },
    { step: 3, title: "Approve the Final CAD", icon: FileCheck },
    { step: 4, title: "Cast, Set & Polish in NYC", icon: Gem },
    { step: 5, title: "Ships Fully Insured", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-luxury-bg pb-mobile-nav">
      <Navigation />
      
      {/* HERO SECTION */}
      <section className="relative pt-20 sm:pt-28 pb-10 sm:pb-16 bg-luxury-bg overflow-hidden">
        <div className="absolute top-40 left-10 w-72 h-72 bg-luxury-champagne/10 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-champagne/5 rounded-full blur-3xl hidden sm:block"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-luxury-champagne/15 border border-luxury-champagne/20 rounded-full mb-6 sm:mb-8">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-luxury-champagne" />
              <span className="text-xs sm:text-sm font-medium text-luxury-text">Ramessés Custom Lab</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif luxury-heading text-luxury-text mb-4 sm:mb-6 leading-tight px-2">
              Start Your Custom Jewelry Project
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-luxury-text-muted mb-3 max-w-3xl mx-auto leading-relaxed font-body px-2">
              Start with rough ideas — we'll help you shape them. No design experience required.
            </p>
            <p className="text-sm text-luxury-text-muted/70 mb-8 sm:mb-12 max-w-2xl mx-auto font-body px-2">
              Every concept you generate is saved to your account. Come back anytime to continue or refine.
            </p>
          </div>
        </div>
      </section>

      {/* SELECTION CARDS */}
      <section className="py-8 sm:py-12 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Engagement Ring Card */}
            <div 
              className={`relative group cursor-pointer rounded-xl sm:rounded-2xl border-2 p-5 sm:p-8 transition-all duration-300 ${
                activeFlow === 'engagement'
                  ? 'border-luxury-champagne bg-luxury-champagne/10 shadow-xl'
                  : 'border-luxury-divider bg-white hover:border-luxury-champagne/50 hover:shadow-luxury'
              }`}
              onClick={() => handleCardSelect('engagement')}
            >
              <div className="absolute -top-2.5 sm:-top-3 left-4 sm:left-6 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-luxury-champagne text-luxury-text text-[10px] sm:text-xs font-semibold rounded-full">
                Most Popular
              </div>
              
              <div className="flex items-start gap-4 sm:gap-5">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  activeFlow === 'engagement' ? 'bg-luxury-champagne' : 'bg-luxury-champagne/20'
                }`}>
                  <Heart className={`w-6 h-6 sm:w-8 sm:h-8 ${activeFlow === 'engagement' ? 'text-luxury-text' : 'text-luxury-champagne'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-2xl font-serif text-luxury-text mb-1.5 sm:mb-2">Design an Engagement Ring</h3>
                  <p className="text-luxury-text-muted font-body mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                    Custom engagement rings with AI-powered concept generation, multi-angle views, and premium craftsmanship.
                  </p>
                  <Button 
                    className="w-full sm:w-auto bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold tap-target"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardSelect('engagement');
                    }}
                  >
                    Start Engagement Ring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Any Jewelry Card */}
            <div 
              className={`relative group cursor-pointer rounded-xl sm:rounded-2xl border-2 p-5 sm:p-8 transition-all duration-300 ${
                activeFlow === 'general'
                  ? 'border-luxury-champagne bg-luxury-champagne/10 shadow-xl'
                  : 'border-luxury-divider bg-white hover:border-luxury-champagne/50 hover:shadow-luxury'
              }`}
              onClick={() => handleCardSelect('general')}
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  activeFlow === 'general' ? 'bg-luxury-champagne' : 'bg-luxury-champagne/20'
                }`}>
                  <Gem className={`w-6 h-6 sm:w-8 sm:h-8 ${activeFlow === 'general' ? 'text-luxury-text' : 'text-luxury-champagne'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-2xl font-serif text-luxury-text mb-1.5 sm:mb-2">Design Any Jewelry</h3>
                  <p className="text-luxury-text-muted font-body mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                    Rings, pendants, chains, earrings, bracelets, redesigns, and more.
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text font-semibold tap-target"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardSelect('general');
                    }}
                  >
                    Start Custom Jewelry
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4-STEP VISUAL PROCESS ==================== */}
      <section className="py-14 bg-luxury-bg border-y border-luxury-divider">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Steps */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 mb-10">
              {/* Step 1 — Explore Ideas */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-luxury-champagne/10 border border-luxury-champagne/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-base font-serif font-semibold text-luxury-champagne">1</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-luxury-champagne" />
                  <h3 className="text-sm font-semibold text-luxury-text">Explore Ideas</h3>
                </div>
                <p className="text-xs text-luxury-text-muted font-body leading-relaxed">
                  Generate instant concepts or start with inspiration.
                </p>
              </div>
              
              {/* Step 2 — Refine Direction */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-luxury-champagne/10 border border-luxury-champagne/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-base font-serif font-semibold text-luxury-champagne">2</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Palette className="w-4 h-4 text-luxury-champagne" />
                  <h3 className="text-sm font-semibold text-luxury-text">Refine Direction</h3>
                </div>
                <p className="text-xs text-luxury-text-muted font-body leading-relaxed">
                  Adjust styles, stones, and details at your pace.
                </p>
              </div>
              
              {/* Step 3 — Jeweler Review */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-luxury-champagne/10 border border-luxury-champagne/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-base font-serif font-semibold text-luxury-champagne">3</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileCheck className="w-4 h-4 text-luxury-champagne" />
                  <h3 className="text-sm font-semibold text-luxury-text">Jeweler Review</h3>
                </div>
                <p className="text-xs text-luxury-text-muted font-body leading-relaxed">
                  A master jeweler reviews feasibility and pricing.
                </p>
              </div>
              
              {/* Step 4 — Crafted in NYC */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-luxury-champagne/10 border border-luxury-champagne/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-base font-serif font-semibold text-luxury-champagne">4</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gem className="w-4 h-4 text-luxury-champagne" />
                  <h3 className="text-sm font-semibold text-luxury-text">Crafted in NYC</h3>
                </div>
                <p className="text-xs text-luxury-text-muted font-body leading-relaxed">
                  Your piece is made in New York's Diamond District.
                </p>
              </div>
            </div>
            
            {/* Reassurance line */}
            <p className="text-center text-xs text-luxury-text-muted/80 font-body">
              No commitment until you approve the final design.
            </p>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section ref={formRef} className="py-10 sm:py-16 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {activeFlow ? (
              <Card className="border border-luxury-divider shadow-luxury rounded-xl sm:rounded-2xl bg-white">
                <CardContent className="p-5 sm:p-8 md:p-10">
                  <div className="text-center mb-8">
                    <h2 className="text-xl sm:text-2xl font-serif text-luxury-text mb-2">
                      {activeFlow === 'engagement' ? 'Design Your Engagement Ring' : 'Design Your Custom Piece'}
                    </h2>
                    <p className="text-luxury-text-muted text-sm sm:text-base">Select your preferences below.</p>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleGenerateConcepts(); }} className="space-y-8">
                    {activeFlow === "general" ? (
                      <>
                        {/* Step 1: Jewelry Type - Card Grid */}
                        <div className="space-y-4">
                          <Label className="text-base font-medium text-luxury-text block">What are you designing?</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {jewelryTypeOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setGeneralForm({...generalForm, pieceType: option.value})}
                                className={`p-4 rounded-xl border-2 transition-all text-center ${
                                  generalForm.pieceType === option.value
                                    ? "border-luxury-champagne bg-luxury-champagne/10"
                                    : "border-luxury-divider hover:border-luxury-champagne/50 bg-white"
                                }`}
                              >
                                <span className="text-2xl mb-2 block">{option.icon}</span>
                                <span className="text-sm font-medium text-luxury-text">{option.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Step 2: Metal Selection - Card Grid */}
                        {generalForm.pieceType && (
                          <div className="space-y-4">
                            <Label className="text-base font-medium text-luxury-text block">Metal preference</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              {metalOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => setGeneralForm({...generalForm, metal: option.value})}
                                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                                    generalForm.metal === option.value
                                      ? "border-luxury-champagne bg-luxury-champagne/10"
                                      : "border-luxury-divider hover:border-luxury-champagne/50 bg-white"
                                  }`}
                                >
                                  {option.color ? (
                                    <div 
                                      className="w-8 h-8 rounded-full mx-auto mb-2 border border-luxury-divider"
                                      style={{ backgroundColor: option.color }}
                                    />
                                  ) : (
                                    <HelpCircle className="w-8 h-8 mx-auto mb-2 text-luxury-text-muted" />
                                  )}
                                  <span className="text-xs font-medium text-luxury-text">{option.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Step 3: Style (Optional) */}
                        {generalForm.metal && (
                          <div className="space-y-4">
                            <Label className="text-base font-medium text-luxury-text block">Choose a style (optional)</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {[
                                { value: "classic", label: "Classic", icon: "✨" },
                                { value: "modern", label: "Modern", icon: "◇" },
                                { value: "vintage", label: "Vintage", icon: "🕰️" },
                                { value: "minimalist", label: "Minimalist", icon: "○" },
                                { value: "bold", label: "Bold", icon: "💎" },
                                { value: "delicate", label: "Delicate", icon: "🌸" },
                                { value: "surprise", label: "Surprise Me", icon: "🎁" },
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => setGeneralForm({...generalForm, style: option.value})}
                                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                                    generalForm.style === option.value
                                      ? "border-luxury-champagne bg-luxury-champagne/10"
                                      : "border-luxury-divider hover:border-luxury-champagne/50 bg-white"
                                  }`}
                                >
                                  <span className="text-lg mb-1 block">{option.icon}</span>
                                  <span className="text-xs font-medium text-luxury-text">{option.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Step 4: Description */}
                        {generalForm.metal && (
                          <div className="space-y-2">
                            <Label className="text-base font-medium text-luxury-text">Describe your vision</Label>
                            <Textarea
                              value={generalForm.description}
                              onChange={(e) => setGeneralForm({...generalForm, description: e.target.value})}
                              placeholder="Tell us about your vision — style, details, occasion, or any specific requirements..."
                              rows={3}
                              className="border-luxury-divider focus:border-luxury-champagne resize-none bg-white rounded-lg font-body"
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Engagement Ring Flow */}
                        
                        {/* Step 1: Ring Style - Visual Cards */}
                        <div className="space-y-4">
                          <Label className="text-base font-medium text-luxury-text block">Choose a ring style</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {ringStyleOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setEngagementForm({...engagementForm, style: option.value})}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                  engagementForm.style === option.value
                                    ? "border-luxury-champagne bg-luxury-champagne/10"
                                    : "border-luxury-divider hover:border-luxury-champagne/50 bg-white"
                                }`}
                              >
                                <span className="text-sm font-semibold text-luxury-text block mb-1">{option.label}</span>
                                <span className="text-xs text-luxury-text-muted">{option.description}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Step 2: Stone Shape - Visual Cards */}
                        {engagementForm.style && (
                          <div className="space-y-4">
                            <Label className="text-base font-medium text-luxury-text block">Choose stone shape</Label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                              {stoneShapeOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => setEngagementForm({...engagementForm, stoneShape: option.value})}
                                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                                    engagementForm.stoneShape === option.value
                                      ? "border-luxury-champagne bg-luxury-champagne/10"
                                      : "border-luxury-divider hover:border-luxury-champagne/50 bg-white"
                                  }`}
                                >
                                  <span className="text-xl mb-1 block">{option.icon}</span>
                                  <span className="text-xs font-medium text-luxury-text">{option.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Step 3: Metal Selection - Card Grid */}
                        {engagementForm.stoneShape && (
                          <div className="space-y-4">
                            <Label className="text-base font-medium text-luxury-text block">Metal preference</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              {metalOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => setEngagementForm({...engagementForm, metal: option.value})}
                                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                                    engagementForm.metal === option.value
                                      ? "border-luxury-champagne bg-luxury-champagne/10"
                                      : "border-luxury-divider hover:border-luxury-champagne/50 bg-white"
                                  }`}
                                >
                                  {option.color ? (
                                    <div 
                                      className="w-8 h-8 rounded-full mx-auto mb-2 border border-luxury-divider"
                                      style={{ backgroundColor: option.color }}
                                    />
                                  ) : (
                                    <HelpCircle className="w-8 h-8 mx-auto mb-2 text-luxury-text-muted" />
                                  )}
                                  <span className="text-xs font-medium text-luxury-text">{option.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Step 4: Ring Size */}
                        {engagementForm.metal && (
                          <div className="space-y-2">
                            <Label className="text-base font-medium text-luxury-text">Ring size (optional)</Label>
                            <Input
                              value={engagementForm.ringSize}
                              onChange={(e) => setEngagementForm({...engagementForm, ringSize: e.target.value})}
                              placeholder="E.g., 6, 7.5, or leave blank if unsure"
                              className="border-luxury-divider focus:border-luxury-champagne bg-white rounded-lg font-body"
                            />
                          </div>
                        )}
                        
                        {/* Step 5: Special Requests */}
                        {engagementForm.metal && (
                          <div className="space-y-2">
                            <Label className="text-base font-medium text-luxury-text">Special requests (optional)</Label>
                            <Textarea
                              value={engagementForm.specialRequests}
                              onChange={(e) => setEngagementForm({...engagementForm, specialRequests: e.target.value})}
                              placeholder="E.g., hidden diamond detail, custom engraving, timeline needs..."
                              rows={2}
                              className="border-luxury-divider focus:border-luxury-champagne bg-white rounded-lg font-body"
                            />
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Image Upload */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-luxury-text">Have inspiration? (Optional)</Label>
                      <p className="text-sm text-luxury-text-muted -mt-1">Pinterest pins, sketches, or photos you like. Helpful but not required — you can always add them later.</p>
                      <div className="border-2 border-dashed border-luxury-divider rounded-xl p-6 text-center hover:border-luxury-champagne/50 transition-colors bg-luxury-bg/50">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Camera className="w-8 h-8 text-luxury-text-muted mx-auto mb-2" />
                          <p className="text-sm text-luxury-text-muted font-body">Tap to upload photos</p>
                        </label>
                      </div>
                      
                      {uploadedImages.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {uploadedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="w-16 h-16 bg-luxury-bg-warm rounded-lg flex items-center justify-center overflow-hidden">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Trust messaging */}
                    <div className="text-center py-3 border-t border-luxury-divider">
                      <p className="text-sm text-luxury-text-muted/80">
                        AI generates starting points for exploration — not final designs. A master jeweler reviews every piece before production.
                      </p>
                    </div>
                    
                    {/* Generate Concepts Button */}
                    <Button 
                      type="submit" 
                      disabled={isGenerating}
                      className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover py-6 text-lg font-semibold rounded-lg shadow-luxury"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating your designs…
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Concepts
                        </>
                      )}
                    </Button>
                    
                    {/* Surprise Me Button */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        type="button"
                        onClick={() => handleGenerateConcepts(true)}
                        disabled={isGenerating}
                        variant="outline"
                        className="flex-1 border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text py-4"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Surprise Me
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setShowDirectUploadModal(true)}
                        variant="outline"
                        className="flex-1 border-luxury-divider text-luxury-text-muted hover:border-luxury-champagne hover:text-luxury-champagne py-4"
                      >
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Upload Your Design
                      </Button>
                    </div>
                    
                    <p className="text-center text-xs text-luxury-text-muted">
                      Already have a design in mind? Click "Upload Your Design" to skip AI and request a direct quote.
                    </p>
                    
                    {!user && (
                      <p className="text-center text-sm text-luxury-text-muted">
                        You'll be asked to sign in before generating concepts.
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-16">
                <Gem className="w-16 h-16 text-luxury-champagne/50 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-luxury-text mb-2">Select a project type above to get started</h3>
                <p className="text-luxury-text-muted">Choose "Engagement Ring" or "Any Jewelry" to begin your custom design.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LOADING STATE */}
      {isGenerating && (
        <section className="py-16 bg-luxury-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-luxury-champagne/20 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-12 h-12 text-luxury-champagne animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <h3 className="text-2xl font-serif text-luxury-text mb-2">Creating your designs…</h3>
              <p className="text-luxury-text-muted mb-1">We're generating concepts based on your inputs.</p>
              <p className="text-xs text-luxury-text-muted/70">This takes about 15–30 seconds.</p>
            </div>
          </div>
        </section>
      )}

      {/* GENERATED CONCEPTS */}
      {concepts.length > 0 && (
        <section ref={conceptsRef} className="py-16 bg-luxury-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-serif text-luxury-text mb-2">Your Custom Concepts</h2>
                <p className="text-luxury-text-muted mb-1">Like one? Save it. Want changes? Request variations — nothing is final until you approve.</p>
                <p className="text-sm text-luxury-text-muted/70 mb-1">
                  These AI concepts are for exploration. Our master jeweler refines every detail before anything is made.
                </p>
                <p className="text-sm text-luxury-text-muted/70">
                  All saved designs live in{" "}
                  <Link to="/my-designs" className="text-luxury-champagne underline">My Designs</Link>
                  {" "}— revisit or continue anytime.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {concepts.map((concept) => (
                  <ConceptCard
                    key={concept.id}
                    concept={concept}
                    onChoose={handleChooseConcept}
                    onRegenerate={handleRegenerateConcept}
                    isRegenerating={regeneratingId === concept.id}
                    isSaving={savingId === concept.id}
                  />
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Link to="/my-designs">
                  <Button variant="outline" className="border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text">
                    View Saved Designs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="py-20 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-text mb-4">
              How Our Custom Process Works
            </h2>
            <p className="text-luxury-text-muted max-w-2xl mx-auto mb-2">
              From inspiration to finished piece, we guide you every step of the way.
            </p>
            <p className="text-sm text-luxury-text-muted/70 max-w-xl mx-auto">
              AI helps you explore ideas. A Diamond District master jeweler reviews and refines every detail. No work begins without your approval.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {processSteps.map((step) => (
                <div key={step.step} className="text-center relative">
                  <div className="w-14 h-14 bg-luxury-champagne/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-luxury-champagne">
                    <step.icon className="w-6 h-6 text-luxury-champagne" />
                  </div>
                  <div className="text-xs font-semibold text-luxury-champagne mb-1">Step {step.step}</div>
                  <h3 className="text-sm font-medium text-luxury-text leading-snug">{step.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-service-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Why Work With Ramessés
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Master Jeweler Quality", desc: "30+ years of Diamond District expertise in every piece" },
              { title: "AI-Powered Concepts", desc: "See your ideas come to life before committing" },
              { title: "Unlimited Revisions", desc: "We refine until you're 100% satisfied with the design" },
              { title: "Made in NYC", desc: "Designed and crafted on 47th Street" },
              { title: "1-on-1 Support", desc: "Work directly with your dedicated jeweler" },
              { title: "Insured Shipping", desc: "Fully insured nationwide delivery" },
            ].map((item, index) => (
              <div key={index} className="bg-service-bg-secondary rounded-xl p-6 border border-service-gold/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-service-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-service-text-muted">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-text mb-4">
              Ready to Start Your Custom Project?
            </h2>
            <p className="text-lg text-luxury-text-muted mb-8">
              Choose your path and let's create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/custom?mode=engagement">
                <Button size="lg" className="w-full sm:w-auto bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8">
                  Start Engagement Ring
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/custom?mode=general">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 font-semibold px-8">
                  Start Custom Jewelry
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        redirectTo="/custom"
      />
      
      {/* Direct Upload Modal */}
      <Dialog open={showDirectUploadModal} onOpenChange={setShowDirectUploadModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">Upload Your Design</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleDirectSubmit} className="space-y-4 mt-4">
            <p className="text-sm text-luxury-text-muted">
              Already have a ring design? Upload images and we'll provide a direct quote.
            </p>
            
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Images (1-6 required)</Label>
              <div className="border-2 border-dashed border-luxury-divider rounded-lg p-4 text-center hover:border-luxury-champagne/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDirectImageUpload}
                  className="hidden"
                  id="direct-image-upload"
                />
                <label htmlFor="direct-image-upload" className="cursor-pointer">
                  <Upload className="w-6 h-6 text-luxury-text-muted mx-auto mb-2" />
                  <p className="text-sm text-luxury-text-muted">Click to upload</p>
                </label>
              </div>
              
              {directUploadImages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {directUploadImages.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="w-12 h-12 bg-luxury-bg-warm rounded overflow-hidden">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setDirectUploadImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Metal Preference</Label>
              <div className="grid grid-cols-5 gap-2">
                {metalOptions.slice(0, -1).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDirectUploadForm({...directUploadForm, metal: option.value})}
                    className={`p-2 rounded-lg border-2 transition-all text-center ${
                      directUploadForm.metal === option.value
                        ? "border-luxury-champagne bg-luxury-champagne/10"
                        : "border-luxury-divider hover:border-luxury-champagne/50"
                    }`}
                  >
                    {option.color && (
                      <div 
                        className="w-6 h-6 rounded-full mx-auto mb-1 border border-luxury-divider"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className="text-xs text-luxury-text">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Stone Details (optional)</Label>
              <Input
                value={directUploadForm.stoneDetails}
                onChange={(e) => setDirectUploadForm({...directUploadForm, stoneDetails: e.target.value})}
                placeholder="E.g., 1ct round diamond, lab-grown"
                className="border-luxury-divider"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Budget Range</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "1000-2500", label: "$1K–$2.5K" },
                  { value: "2500-5000", label: "$2.5K–$5K" },
                  { value: "5000-10000", label: "$5K–$10K" },
                  { value: "10000+", label: "$10K+" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDirectUploadForm({...directUploadForm, budget: option.value})}
                    className={`p-2 rounded-lg border-2 transition-all text-center text-sm ${
                      directUploadForm.budget === option.value
                        ? "border-luxury-champagne bg-luxury-champagne/10 text-luxury-text"
                        : "border-luxury-divider hover:border-luxury-champagne/50 text-luxury-text-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Additional Notes</Label>
              <Textarea
                value={directUploadForm.notes}
                onChange={(e) => setDirectUploadForm({...directUploadForm, notes: e.target.value})}
                placeholder="Any specific requirements or questions..."
                rows={3}
                className="border-luxury-divider"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmittingDirect || directUploadImages.length === 0}
              className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover"
            >
              {isSubmittingDirect ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Request Quote'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Custom;
