import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { LoginModal } from "@/components/LoginModal";
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
  ChevronRight,
  Camera,
  Send
} from "lucide-react";

// Ring style images
import ringSolitaire from "@/assets/ring-style-solitaire.png";
import ringHalo from "@/assets/ring-style-halo.png";
import ringHiddenHalo from "@/assets/ring-style-hidden-halo.png";
import ringThreeStone from "@/assets/ring-style-three-stone.png";
import ringPave from "@/assets/ring-style-pave.png";
import ringOther from "@/assets/ring-style-other.png";

// Style options with visual representations
const styleOptions = [
  { id: "solitaire", name: "Solitaire", description: "Timeless elegance", icon: CircleDot, image: ringSolitaire },
  { id: "hidden-halo", name: "Hidden Halo", description: "Subtle sparkle beneath", icon: Circle, image: ringHiddenHalo },
  { id: "halo", name: "Halo", description: "Maximum brilliance", icon: Sparkles, image: ringHalo },
  { id: "three-stone", name: "Three-Stone", description: "Past, present, future", icon: Triangle, image: ringThreeStone },
  { id: "vintage", name: "Vintage / Heirloom", description: "Classic intricate details", icon: Hexagon, image: ringPave },
  { id: "modern", name: "Modern / Minimal", description: "Clean contemporary lines", icon: Star, image: ringOther },
];

export default function EngagementRings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const bypassRef = useRef<HTMLDivElement>(null);
  
  // Login modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Bypass upload state
  const [bypassImages, setBypassImages] = useState<File[]>([]);
  const [bypassDescription, setBypassDescription] = useState("");
  const [isSubmittingBypass, setIsSubmittingBypass] = useState(false);

  const scrollToBypass = () => {
    bypassRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Navigate to Custom Lab with engagement mode and optional style pre-selected
  const goToCustomLab = (style?: string) => {
    const params = new URLSearchParams({ mode: 'engagement' });
    if (style) {
      params.set('style', style);
    }
    navigate(`/custom?${params.toString()}`);
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
              Every inspiration you create is saved to your account. Come back anytime to continue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8"
                onClick={() => goToCustomLab()}
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
            <p className="text-xs text-luxury-text-muted/70 mt-4">
              Visualize your idea — final details are always refined by our master jewelers.
            </p>
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
                  Visualize inspirations, then refine with a jeweler.
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

      {/* RING STYLES PREVIEW - Click to go to Custom Lab with style pre-selected */}
      <section className="py-12 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-luxury-text mb-2">Explore Ring Styles</h2>
              <p className="text-luxury-text-muted">
                Select a style to start building your ring in our Design Studio.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {styleOptions.map((style) => (
                <button
                  key={style.id}
                  onClick={() => goToCustomLab(style.id)}
                  className="p-3 sm:p-4 rounded-xl border-2 border-luxury-divider bg-white hover:border-luxury-champagne/50 hover:shadow-lg transition-all text-center group"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-3 rounded-lg overflow-hidden bg-white p-1">
                    <img 
                      src={style.image} 
                      alt={style.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-serif text-luxury-text text-sm sm:text-base mb-1">{style.name}</h3>
                  <p className="text-xs text-luxury-text-muted">{style.description}</p>
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-luxury-champagne opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Start with this style</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>

            {/* CTA to go to full Custom Lab */}
            <div className="text-center mt-8">
              <Button 
                size="lg"
                onClick={() => goToCustomLab()}
                className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8"
              >
                Create Your Engagement Ring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs text-luxury-text-muted/70 mt-3">
                Visualize your idea — final details are always refined by our master jewelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BYPASS SECTION - Direct to designer without AI generation */}
      <section ref={bypassRef} id="bypass-section" className="py-16 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-luxury-text mb-2">Already Have a Design?</h2>
              <p className="text-luxury-text-muted mb-1">
                Send photos or sketches directly to our master jeweler — we'll provide a quote and work with you one-on-one.
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
                Looking to design something other than an engagement ring?
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}
