import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { LoginModal } from "@/components/LoginModal";
import { ConceptCard } from "@/components/ConceptCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Gem, 
  Sparkles,
  ArrowRight,
  Heart,
  CircleDot,
  Circle,
  Hexagon,
  Triangle,
  Star,
  Loader2,
  Upload,
  Wand2,
  Check,
  ChevronRight,
  Camera,
  Send
} from "lucide-react";

// Style options with visual representations
const styleOptions = [
  { id: "solitaire", name: "Solitaire", description: "Timeless elegance", icon: CircleDot },
  { id: "hidden-halo", name: "Hidden Halo", description: "Subtle sparkle beneath", icon: Circle },
  { id: "halo", name: "Halo", description: "Maximum brilliance", icon: Sparkles },
  { id: "three-stone", name: "Three-Stone", description: "Past, present, future", icon: Triangle },
  { id: "vintage", name: "Vintage / Heirloom", description: "Classic intricate details", icon: Hexagon },
  { id: "modern", name: "Modern / Minimal", description: "Clean contemporary lines", icon: Star },
];

// Stone shape options
const stoneShapeOptions = [
  { id: "round", name: "Round", tooltip: "Classic, maximum sparkle" },
  { id: "oval", name: "Oval", tooltip: "Elongates the finger" },
  { id: "emerald", name: "Emerald", tooltip: "Sophisticated step cuts" },
  { id: "cushion", name: "Cushion", tooltip: "Soft, romantic" },
  { id: "princess", name: "Princess", tooltip: "Modern square brilliance" },
  { id: "pear", name: "Pear", tooltip: "Unique teardrop shape" },
  { id: "radiant", name: "Radiant", tooltip: "Bold and brilliant" },
  { id: "marquise", name: "Marquise", tooltip: "Maximizes carat size" },
];

// Metal options
const metalOptions = [
  { id: "14k-yellow", name: "Yellow Gold", color: "#FFD700" },
  { id: "14k-white", name: "White Gold", color: "#E8E8E8" },
  { id: "14k-rose", name: "Rose Gold", color: "#E8B4B8" },
  { id: "platinum", name: "Platinum", color: "#D4D4D4" },
];

interface Concept {
  id: string;
  name: string;
  overview: string;
  metal: string;
  center_stone: { shape: string; size_mm: string; type: string };
  setting_style: string;
  band: { width_mm: string; style: string; pave: string; shoulders: string };
  gallery_details: string;
  prongs: string;
  accent_stones: string;
  manufacturing_notes: string;
  images: { hero: string; side: string; top: string };
}

export default function EngagementRings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const bypassRef = useRef<HTMLDivElement>(null);
  
  // Builder state
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [pave, setPave] = useState(false);
  const [hiddenDetails, setHiddenDetails] = useState(false);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Bypass upload state
  const [bypassImages, setBypassImages] = useState<File[]>([]);
  const [bypassDescription, setBypassDescription] = useState("");
  const [isSubmittingBypass, setIsSubmittingBypass] = useState(false);

  const canGenerate = selectedStyle && selectedShape && selectedMetal;

  const scrollToBypass = () => {
    bypassRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerateConcepts = async (surpriseMe = false) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    setIsGenerating(true);
    setConcepts([]);
    
    try {
      const formInputs = {
        flowType: "engagement",
        style: surpriseMe ? "surprise" : selectedStyle,
        stoneShape: surpriseMe ? "" : selectedShape,
        metal: surpriseMe ? "" : selectedMetal,
        pave: pave ? "yes" : "no",
        hiddenDetails: hiddenDetails ? "yes" : "no",
      };

      const { data, error } = await supabase.functions.invoke('generate-ring-concepts', {
        body: { formInputs, surpriseMe }
      });

      if (error) throw error;
      
      if (data?.concepts) {
        setConcepts(data.concepts);
        toast.success(`Generated ${data.concepts.length} concept${data.concepts.length > 1 ? 's' : ''}!`);
        
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const handleSaveConcept = async (concept: Concept) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    setSavingId(concept.id);
    
    try {
      const { data, error } = await supabase
        .from('user_designs')
        .insert([{
          user_id: user.id,
          name: concept.name,
          overview: concept.overview,
          flow_type: 'engagement',
          form_inputs: {
            style: selectedStyle,
            stoneShape: selectedShape,
            metal: selectedMetal,
            pave,
            hiddenDetails,
          },
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
          <span>Design saved!</span>
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

  const handleSendToDesigner = async (concept: Concept) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    setSavingId(concept.id);
    
    try {
      // First save the design
      const { data: savedDesign, error: saveError } = await supabase
        .from('user_designs')
        .insert([{
          user_id: user.id,
          name: concept.name,
          overview: concept.overview,
          flow_type: 'engagement',
          form_inputs: {
            style: selectedStyle,
            stoneShape: selectedShape,
            metal: selectedMetal,
            pave,
            hiddenDetails,
          },
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
          status: 'submitted_for_cad',
          cad_submitted_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (saveError) throw saveError;

      toast.success("Design sent to our master jeweler! We'll be in touch soon.");
      navigate(`/my-designs/${savedDesign.id}`);
    } catch (error) {
      console.error('Error sending to designer:', error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleBypassImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (bypassImages.length + files.length > 6) {
        toast.error("Maximum 6 images allowed");
        return;
      }
      setBypassImages(prev => [...prev, ...files]);
    }
  };

  const handleBypassSubmit = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (bypassImages.length === 0 && !bypassDescription.trim()) {
      toast.error("Please add images or a description");
      return;
    }
    
    setIsSubmittingBypass(true);
    
    try {
      const { error } = await supabase
        .from('custom_inquiries')
        .insert([{
          piece_type: 'Engagement Ring - Direct Designer Request',
          description: bypassDescription || 'See attached images',
          name: user.email?.split('@')[0] || 'Customer',
          email: user.email || '',
          user_id: user.id,
        }]);

      if (error) throw error;

      toast.success("Request sent to our designer! We'll be in touch soon.");
      setBypassImages([]);
      setBypassDescription("");
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmittingBypass(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-bg pb-mobile-nav">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-20 sm:pt-24">
        <nav className="flex items-center gap-2 text-sm text-luxury-text-muted mb-6">
          <Link to="/" className="hover:text-luxury-champagne">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/custom" className="hover:text-luxury-champagne">Custom Jewelry</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-luxury-text">Engagement Rings</span>
        </nav>
      </div>

      {/* HERO SECTION */}
      <section className="relative py-12 sm:py-16 bg-luxury-bg overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-luxury-champagne/10 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-luxury-champagne/5 rounded-full blur-3xl hidden sm:block"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-luxury-champagne/15 border border-luxury-champagne/20 rounded-full mb-6">
              <Heart className="w-4 h-4 text-luxury-champagne" />
              <span className="text-sm font-medium text-luxury-text">Engagement Ring Builder</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-luxury-text mb-4 leading-tight">
              Design Your Engagement Ring — <span className="text-luxury-champagne">Instantly</span>
            </h1>
            
            <p className="text-lg text-luxury-text-muted mb-4 max-w-2xl mx-auto">
              Start with rough ideas — we'll help you refine them. No design experience needed.
            </p>
            <p className="text-sm text-luxury-text-muted/70 mb-8 max-w-xl mx-auto">
              Every design you generate is saved to your account. Come back anytime to continue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8"
                onClick={() => document.getElementById('style-selection')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Designing
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={scrollToBypass}
                className="border-luxury-divider text-luxury-text hover:bg-luxury-bg-warm font-medium px-8"
              >
                I Already Have a Design
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3-STEP PROCESS VISUALIZATION ==================== */}
      <section className="py-12 bg-luxury-bg border-b border-luxury-divider">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-8 md:gap-6 mb-8">
              {/* Step 1 — Discover Styles */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-luxury-champagne/10 border border-luxury-champagne/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-base font-serif font-semibold text-luxury-champagne">1</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-luxury-champagne" />
                  <h3 className="text-sm font-semibold text-luxury-text">Discover Styles</h3>
                </div>
                <p className="text-xs text-luxury-text-muted font-body leading-relaxed">
                  Explore ring styles and proportions.
                </p>
              </div>
              
              {/* Step 2 — Design Together */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-luxury-champagne/10 border border-luxury-champagne/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-base font-serif font-semibold text-luxury-champagne">2</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-luxury-champagne" />
                  <h3 className="text-sm font-semibold text-luxury-text">Design Together</h3>
                </div>
                <p className="text-xs text-luxury-text-muted font-body leading-relaxed">
                  Generate concepts, then refine with a jeweler.
                </p>
              </div>
              
              {/* Step 3 — Create with Confidence */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-luxury-champagne/10 border border-luxury-champagne/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-base font-serif font-semibold text-luxury-champagne">3</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gem className="w-4 h-4 text-luxury-champagne" />
                  <h3 className="text-sm font-semibold text-luxury-text">Create with Confidence</h3>
                </div>
                <p className="text-xs text-luxury-text-muted font-body leading-relaxed">
                  Final details approved before crafting.
                </p>
              </div>
            </div>
            
            {/* Microcopy */}
            <p className="text-center text-xs text-luxury-text-muted/80 font-body italic">
              Designed to guide — never to rush.
            </p>
          </div>
        </div>
      </section>

      {/* STEP 1: STYLE SELECTION */}
      <section id="style-selection" className="py-12 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-luxury-champagne text-luxury-text flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-xl sm:text-2xl font-serif text-luxury-text">Choose Your Ring Style</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {styleOptions.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 sm:p-6 rounded-xl border-2 transition-all text-left ${
                    selectedStyle === style.id
                      ? 'border-luxury-champagne bg-luxury-champagne/10 shadow-lg'
                      : 'border-luxury-divider bg-white hover:border-luxury-champagne/50'
                  }`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 ${
                    selectedStyle === style.id ? 'bg-luxury-champagne' : 'bg-luxury-champagne/20'
                  }`}>
                    <style.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      selectedStyle === style.id ? 'text-luxury-text' : 'text-luxury-champagne'
                    }`} />
                  </div>
                  <h3 className="font-serif text-luxury-text text-sm sm:text-base mb-1">{style.name}</h3>
                  <p className="text-xs text-luxury-text-muted">{style.description}</p>
                  {selectedStyle === style.id && (
                    <Check className="w-5 h-5 text-luxury-champagne mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2: STONE SHAPE */}
      <section className="py-12 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                selectedStyle ? 'bg-luxury-champagne text-luxury-text' : 'bg-luxury-divider text-luxury-text-muted'
              }`}>2</div>
              <h2 className="text-xl sm:text-2xl font-serif text-luxury-text">Select Center Stone Shape</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {stoneShapeOptions.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => setSelectedShape(shape.id)}
                  title={shape.tooltip}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-center ${
                    selectedShape === shape.id
                      ? 'border-luxury-champagne bg-luxury-champagne/10'
                      : 'border-luxury-divider bg-white hover:border-luxury-champagne/50'
                  }`}
                >
                  <Gem className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${
                    selectedShape === shape.id ? 'text-luxury-champagne' : 'text-luxury-text-muted'
                  }`} />
                  <span className="text-xs sm:text-sm font-medium text-luxury-text">{shape.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3: METAL & PREFERENCES */}
      <section className="py-12 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                selectedShape ? 'bg-luxury-champagne text-luxury-text' : 'bg-luxury-divider text-luxury-text-muted'
              }`}>3</div>
              <h2 className="text-xl sm:text-2xl font-serif text-luxury-text">Metal & Setting Preferences</h2>
            </div>

            {/* Metal Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-luxury-text mb-3">Metal</h3>
              <div className="flex flex-wrap gap-3">
                {metalOptions.map((metal) => (
                  <button
                    key={metal.id}
                    onClick={() => setSelectedMetal(metal.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedMetal === metal.id
                        ? 'border-luxury-champagne bg-luxury-champagne/10'
                        : 'border-luxury-divider bg-white hover:border-luxury-champagne/50'
                    }`}
                  >
                    <div 
                      className="w-5 h-5 rounded-full border border-luxury-divider" 
                      style={{ backgroundColor: metal.color }}
                    />
                    <span className="text-sm font-medium text-luxury-text">{metal.name}</span>
                    {selectedMetal === metal.id && <Check className="w-4 h-4 text-luxury-champagne" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Toggles */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setPave(!pave)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  pave ? 'border-luxury-champagne bg-luxury-champagne/10' : 'border-luxury-divider bg-white'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  pave ? 'border-luxury-champagne bg-luxury-champagne' : 'border-luxury-divider'
                }`}>
                  {pave && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-luxury-text">Pavé Band</span>
              </button>
              
              <button
                onClick={() => setHiddenDetails(!hiddenDetails)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  hiddenDetails ? 'border-luxury-champagne bg-luxury-champagne/10' : 'border-luxury-divider bg-white'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  hiddenDetails ? 'border-luxury-champagne bg-luxury-champagne' : 'border-luxury-divider'
                }`}>
                  {hiddenDetails && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-luxury-text">Hidden Details</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GENERATE SECTION */}
      <section className="py-12 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 border border-luxury-divider shadow-luxury">
              <Sparkles className="w-12 h-12 text-luxury-champagne mx-auto mb-4" />
              <h2 className="text-2xl font-serif text-luxury-text mb-2">Ready to See Your Ring?</h2>
              <p className="text-luxury-text-muted mb-2">
                {canGenerate 
                  ? "We'll generate a few concepts based on your choices. Not sure about something? That's okay — pick what feels right and we'll refine from there."
                  : "Complete the selections above to generate your custom ring concepts."
                }
              </p>
              <p className="text-sm text-luxury-text-muted/70 mb-2">
                These are starting points for exploration — not final designs. A master jeweler reviews every piece before production begins.
              </p>
              <p className="text-xs text-luxury-text-muted/70 mb-6">
                You're not committing to anything. No work starts without your approval.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => handleGenerateConcepts(false)}
                  disabled={!canGenerate || isGenerating}
                  className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate My Ring Concepts
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleGenerateConcepts(true)}
                  disabled={isGenerating}
                  className="border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text font-medium px-8"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Surprise Me
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      {concepts.length > 0 && (
        <section ref={resultsRef} className="py-12 bg-luxury-bg-warm">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-luxury-text mb-2">Your Ring Concepts</h2>
                <p className="text-luxury-text-muted mb-1">
                  Like one? Save it to refine later. Want changes? Let us know — nothing is final until you say so.
                </p>
                <p className="text-sm text-luxury-text-muted/70 mb-1">
                  These AI concepts are for exploration. Our master jeweler refines every detail before anything is made.
                </p>
                <p className="text-sm text-luxury-text-muted/70">
                  All designs are saved to{" "}
                  <Link to="/my-designs" className="text-luxury-champagne underline">My Designs</Link>
                  {" "}— revisit anytime.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {concepts.map((concept) => (
                  <ConceptCard
                    key={concept.id}
                    concept={concept}
                    onChoose={() => handleSaveConcept(concept)}
                    onRegenerate={() => handleSendToDesigner(concept)}
                    isSaving={savingId === concept.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BYPASS SECTION */}
      <section ref={bypassRef} id="bypass-section" className="py-16 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-luxury-text mb-2">Already Have a Design?</h2>
              <p className="text-luxury-text-muted mb-1">
                Send photos or sketches directly to our master jeweler — no AI step needed.
              </p>
              <p className="text-sm text-luxury-text-muted/70">
                We'll review and follow up within 24 hours. No commitment until you approve.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-luxury-divider shadow-luxury">
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-luxury-text mb-1">
                  Upload Design or Inspiration Images
                </label>
                <p className="text-xs text-luxury-text-muted mb-2">Pinterest screenshots, sketches, or photos of rings you like — anything helps.</p>
                <div className="border-2 border-dashed border-luxury-divider rounded-xl p-6 text-center hover:border-luxury-champagne/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBypassImageUpload}
                    className="hidden"
                    id="bypass-upload"
                  />
                  <label htmlFor="bypass-upload" className="cursor-pointer">
                    <Camera className="w-10 h-10 text-luxury-champagne/50 mx-auto mb-2" />
                    <p className="text-sm text-luxury-text-muted">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-luxury-text-muted mt-1">Max 6 images</p>
                  </label>
                </div>
                
                {bypassImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {bypassImages.map((file, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden bg-luxury-bg">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setBypassImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-bl"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-luxury-text mb-2">
                  Describe Your Vision (Optional)
                </label>
                <Textarea
                  value={bypassDescription}
                  onChange={(e) => setBypassDescription(e.target.value)}
                  placeholder="Tell us about the ring you want — metal, stones, style preferences..."
                  className="min-h-[100px] border-luxury-divider"
                />
              </div>

              <Button
                onClick={handleBypassSubmit}
                disabled={isSubmittingBypass || (bypassImages.length === 0 && !bypassDescription.trim())}
                className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold"
              >
                {isSubmittingBypass ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send to Designer
                  </>
                )}
              </Button>
            </div>

            {/* Link back to Custom */}
            <div className="text-center mt-8">
              <Link 
                to="/custom?mode=general" 
                className="text-luxury-text-muted hover:text-luxury-champagne text-sm inline-flex items-center gap-1"
              >
                Looking to design something else?
                <ArrowRight className="w-4 h-4" />
                Design Any Jewelry
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        redirectTo="/engagement-rings"
      />
    </div>
  );
}