import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { LoginModal } from "@/components/LoginModal";
import { SimpleAccordion } from "@/components/SimpleAccordion";
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
  Send,
  DollarSign,
  Shield,
  Clock,
  CheckCircle2,
  Ruler,
  Quote,
  Leaf,
  Diamond
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

// Diamond shapes data
const diamondShapes = [
  { 
    id: "round", 
    name: "Round Brilliant", 
    description: "The classic choice. Maximum sparkle with 58 facets. 60% of engagement rings feature round diamonds.",
    popularity: "Most Popular"
  },
  { 
    id: "oval", 
    name: "Oval", 
    description: "Elongated elegance. Appears larger than a round of the same carat weight. Flatters the finger."
  },
  { 
    id: "emerald", 
    name: "Emerald", 
    description: "Art deco sophistication. Step-cut facets create a hall-of-mirrors effect. Best with high clarity stones."
  },
  { 
    id: "cushion", 
    name: "Cushion", 
    description: "Romantic and soft. Rounded corners with brilliant faceting. Vintage appeal with modern sparkle."
  },
  { 
    id: "pear", 
    name: "Pear", 
    description: "Unique teardrop silhouette. Elongates the finger. Perfect for those who want something different."
  },
  { 
    id: "marquise", 
    name: "Marquise", 
    description: "Dramatic and bold. Maximizes carat weight appearance. A statement choice."
  },
  { 
    id: "radiant", 
    name: "Radiant", 
    description: "Best of both worlds. Emerald shape with brilliant-cut sparkle. Great for colored stones too."
  },
  { 
    id: "princess", 
    name: "Princess", 
    description: "Modern and geometric. Square shape with exceptional brilliance. Second most popular after round."
  },
];

// Investment guide data
const investmentGuide = [
  { name: "Simple Solitaire", price: "$2,500", description: "Classic 4-prong setting in 14k gold. Stone not included." },
  { name: "Hidden Halo", price: "$3,200", description: "Solitaire with diamond halo beneath the center stone." },
  { name: "Full Halo", price: "$3,800", description: "Center stone surrounded by a brilliant diamond halo." },
  { name: "Three-Stone", price: "$4,500", description: "Center stone flanked by two side stones." },
  { name: "Pavé Band", price: "$3,500", description: "Diamonds set along the band for extra sparkle." },
];

// Ring size chart
const sizeChart = [
  { us: "4", mm: "14.9" },
  { us: "4.5", mm: "15.3" },
  { us: "5", mm: "15.7" },
  { us: "5.5", mm: "16.1" },
  { us: "6", mm: "16.5" },
  { us: "6.5", mm: "16.9" },
  { us: "7", mm: "17.3" },
  { us: "7.5", mm: "17.7" },
  { us: "8", mm: "18.1" },
  { us: "8.5", mm: "18.5" },
  { us: "9", mm: "18.9" },
  { us: "9.5", mm: "19.4" },
  { us: "10", mm: "19.8" },
  { us: "10.5", mm: "20.2" },
  { us: "11", mm: "20.6" },
  { us: "11.5", mm: "21.0" },
  { us: "12", mm: "21.4" },
  { us: "12.5", mm: "21.8" },
  { us: "13", mm: "22.2" },
];

// Testimonials
const testimonials = [
  {
    quote: "They took my rough sketch and turned it into the most beautiful ring I've ever seen. She said yes!",
    author: "Michael R.",
    location: "NYC"
  },
  {
    quote: "I wanted to use my grandmother's diamond in a modern setting. The team made it happen perfectly.",
    author: "Sarah K.",
    location: "Boston"
  },
  {
    quote: "Better quality and half the price of what I saw at retail stores. The process was so easy.",
    author: "James T.",
    location: "Chicago"
  },
];

// FAQ items
const faqItems = [
  {
    question: "How long does the process take?",
    answer: "Most custom engagement rings take 3-4 weeks from design approval to delivery. Rush orders are available for an additional fee."
  },
  {
    question: "Can I use my own diamond or gemstone?",
    answer: "Absolutely! We love working with family heirloom stones. We'll inspect it carefully and design a setting that showcases it beautifully."
  },
  {
    question: "What if I don't know what I want?",
    answer: "That's what we're here for. Start with our Design Studio to explore ideas visually, or schedule a consultation with our design team."
  },
  {
    question: "Do you offer payment plans?",
    answer: "Yes. We offer 6-12 month financing through Affirm with rates as low as 0% APR for qualified buyers."
  },
  {
    question: "What's included with my ring?",
    answer: "Every ring includes: professional appraisal, lifetime craftsmanship warranty, free resizing for life, and insured shipping."
  },
  {
    question: "Can I see the ring before it's finished?",
    answer: "Yes! We share CAD renders and photos throughout the process. Nothing is made without your approval at each stage."
  },
  {
    question: "What if I'm not happy with the final ring?",
    answer: "We offer a 30-day return policy for a full refund. But in 30+ years, we've never had a custom ring returned."
  },
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
  
  // 4 C's accordion state
  const [openCIndex, setOpenCIndex] = useState<number | null>(0);

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

  const fourCs = [
    {
      title: "Cut",
      subtitle: "The Most Important C",
      description: "Cut determines how brilliantly your diamond sparkles. A well-cut diamond reflects light beautifully, creating that coveted fire and brilliance. We only work with Excellent and Ideal cut grades."
    },
    {
      title: "Color",
      subtitle: "Near-Colorless is the Sweet Spot",
      description: "Diamonds range from D (colorless) to Z (yellow). We recommend G-H for the best balance of quality and value — these appear colorless to the naked eye but cost significantly less than D-F grades."
    },
    {
      title: "Clarity",
      subtitle: "Eye-Clean is What Matters",
      description: "Most inclusions are invisible to the naked eye. VS1-VS2 offers excellent value without visible flaws. You don't need to pay for Flawless — your jeweler will help you find an eye-clean stone."
    },
    {
      title: "Carat",
      subtitle: "Size Isn't Everything",
      description: "Carat measures weight, not size. A well-cut 1ct diamond can look larger than a poorly cut 1.2ct. Focus on cut quality first, then find the carat weight that fits your budget."
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-20 sm:pt-24">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/custom" className="hover:text-primary">Custom Jewelry</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Engagement Rings</span>
        </nav>
      </div>

      {/* HERO SECTION */}
      <section className="relative py-12 sm:py-16 bg-background overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl hidden sm:block"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/15 border border-primary/20 rounded-full mb-6">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Engagement Ring Builder</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-4 leading-tight">
              Design Your Engagement Ring — <span className="text-primary">Instantly</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
              Start with rough ideas — we'll help you refine them. No design experience needed.
            </p>
            <p className="text-sm text-muted-foreground/70 mb-8 max-w-xl mx-auto">
              Every inspiration you create is saved to your account. Come back anytime to continue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                onClick={() => goToCustomLab()}
              >
                Start Designing
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={scrollToBypass}
                className="border-border text-foreground hover:bg-muted font-medium px-8"
              >
                I Already Have a Design
              </Button>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-4">
              See your vision — final details are always refined by our master jewelers.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 3-STEP PROCESS VISUALIZATION ==================== */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-8 md:gap-6 mb-8">
              {/* Step 1 — Discover Styles */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-base font-serif font-semibold text-primary">1</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Discover Styles</h3>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  Explore ring styles and proportions.
                </p>
              </div>
              
              {/* Step 2 — Design Together */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-base font-serif font-semibold text-primary">2</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Design Together</h3>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  See your vision, then refine with a jeweler.
                </p>
              </div>
              
              {/* Step 3 — Create with Confidence */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-base font-serif font-semibold text-primary">3</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gem className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Create with Confidence</h3>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  Final details approved before crafting.
                </p>
              </div>
            </div>
            
            {/* Microcopy */}
            <p className="text-center text-xs text-muted-foreground/80 font-body italic">
              Designed to guide — never to rush.
            </p>
          </div>
        </div>
      </section>

      {/* RING STYLES PREVIEW - Click to go to Custom Lab with style pre-selected */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-2">Explore Ring Styles</h2>
              <p className="text-muted-foreground">
                Select a style to start building your ring in our Design Studio.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {styleOptions.map((style) => (
                <button
                  key={style.id}
                  onClick={() => goToCustomLab(style.id)}
                  className="p-3 sm:p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all text-center group"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-3 rounded-lg overflow-hidden bg-card p-1">
                    <img 
                      src={style.image} 
                      alt={style.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-serif text-foreground text-sm sm:text-base mb-1">{style.name}</h3>
                  <p className="text-xs text-muted-foreground">{style.description}</p>
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
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
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
              >
                Create Your Engagement Ring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs text-muted-foreground/70 mt-3">
                See your vision — final details are always refined by our master jewelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 1: WHY CHOOSE CUSTOM ==================== */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">Why Choose a Custom Engagement Ring?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Skip the mall. Create something as unique as your love story.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* One-of-a-Kind */}
              <div className="text-center p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Gem className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-foreground mb-2">One-of-a-Kind</h3>
                <p className="text-sm text-muted-foreground">
                  Your ring is designed specifically for you — no one else will have the same piece.
                </p>
              </div>
              
              {/* Better Value */}
              <div className="text-center p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-foreground mb-2">Better Value</h3>
                <p className="text-sm text-muted-foreground">
                  Skip the retail markup. Work directly with Diamond District craftsmen at wholesale pricing.
                </p>
              </div>
              
              {/* Personal Meaning */}
              <div className="text-center p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-foreground mb-2">Personal Meaning</h3>
                <p className="text-sm text-muted-foreground">
                  Incorporate meaningful details — birthstones, engravings, family heirloom stones.
                </p>
              </div>
              
              {/* Lifetime Guarantee */}
              <div className="text-center p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-foreground mb-2">Lifetime Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  Every ring comes with our lifetime craftsmanship warranty and free resizing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 2: THE 4 C'S OF DIAMONDS ==================== */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">Understanding Diamond Quality</h2>
              <p className="text-muted-foreground">
                The 4 C's determine a diamond's beauty and value. Here's what actually matters.
              </p>
            </div>
            
            <div className="space-y-3">
              {fourCs.map((item, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenCIndex(openCIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Diamond className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="font-serif text-foreground text-lg">{item.title}</span>
                        <span className="text-muted-foreground text-sm ml-2">— {item.subtitle}</span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${
                        openCIndex === index ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      openCIndex === index ? "max-h-48" : "max-h-0"
                    }`}
                  >
                    <p className="px-5 pb-5 pl-[4.5rem] text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button 
                variant="outline"
                onClick={() => navigate('/contact')}
                className="border-border text-foreground hover:bg-muted"
              >
                Get Expert Guidance
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: STONE SHAPE GUIDE ==================== */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">Find Your Perfect Shape</h2>
              <p className="text-muted-foreground">
                Each diamond shape has its own personality. Explore what speaks to you.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {diamondShapes.map((shape) => (
                <div 
                  key={shape.id}
                  className="p-5 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Gem className="w-10 h-10 text-primary/60 group-hover:text-primary transition-colors" />
                  </div>
                  {shape.popularity && (
                    <div className="text-center mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {shape.popularity}
                      </span>
                    </div>
                  )}
                  <h3 className="font-serif text-foreground text-center mb-2">{shape.name}</h3>
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    {shape.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: OUR PROCESS TIMELINE ==================== */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">From Vision to Forever</h2>
              <p className="text-muted-foreground">
                Our 4-week process to create your perfect ring.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  week: "Week 1",
                  title: "Design Consultation",
                  description: "Share your vision with our design team. We'll create inspirations and refine until perfect.",
                  icon: Sparkles
                },
                {
                  week: "Week 2",
                  title: "Stone Selection",
                  description: "Choose your center stone with expert guidance. We source directly from the Diamond District.",
                  icon: Gem
                },
                {
                  week: "Week 3",
                  title: "Crafting",
                  description: "Your ring is handcrafted by master jewelers in New York City. No overseas production.",
                  icon: Heart
                },
                {
                  week: "Week 4",
                  title: "Quality Check & Delivery",
                  description: "Final inspection, professional photography, and insured delivery to your door.",
                  icon: CheckCircle2
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-xs text-primary font-medium mb-1">{step.week}</p>
                  <h3 className="font-serif text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5: INVESTMENT GUIDE ==================== */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">Investment Guide</h2>
              <p className="text-muted-foreground">
                We believe in transparent pricing. Here's what to expect.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {investmentGuide.map((item, index) => (
                <div 
                  key={index}
                  className="p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-serif text-foreground mb-1">{item.name}</h3>
                  <p className="text-2xl font-serif text-primary mb-3">Starting at {item.price}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-6 italic">
              Prices shown are for setting only. Center stone priced separately based on your selection.
            </p>
            
            <div className="text-center mt-8">
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                Get a Custom Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 6: LAB VS NATURAL DIAMONDS ==================== */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">Lab-Grown vs Natural Diamonds</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Both are real diamonds — chemically, physically, and optically identical. The only difference is origin.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Natural Diamonds */}
              <div className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Gem className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-foreground text-lg">Natural Diamonds</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Formed over billions of years</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Traditional choice with resale value</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Ideal for those who value rarity</span>
                  </li>
                </ul>
              </div>
              
              {/* Lab-Grown Diamonds */}
              <div className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-foreground text-lg">Lab-Grown Diamonds</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Created in weeks using advanced technology</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">40-60% less expensive than natural</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Environmentally conscious choice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Same brilliance, fire, and durability</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <p className="text-center text-muted-foreground mt-8">
              We work with both. Your jeweler will help you choose what's right for you.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 7: RING SIZE GUIDE ==================== */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">Find Your Ring Size</h2>
              <p className="text-muted-foreground">
                Three easy ways to get the perfect fit.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {/* Option 1 */}
              <div className="p-6 bg-card rounded-xl border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Ruler className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-foreground mb-2">Measure at Home</h3>
                <p className="text-sm text-muted-foreground">
                  Wrap a string around your finger, mark where it meets, and measure in millimeters.
                </p>
              </div>
              
              {/* Option 2 */}
              <div className="p-6 bg-card rounded-xl border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Circle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-foreground mb-2">Use an Existing Ring</h3>
                <p className="text-sm text-muted-foreground">
                  Measure the inside diameter of a ring that fits well on the intended finger.
                </p>
              </div>
              
              {/* Option 3 */}
              <div className="p-6 bg-card rounded-xl border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-foreground mb-2">Free Ring Sizer</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Request a free ring sizer mailed to you.
                </p>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/contact')}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Request Free Sizer
                </Button>
              </div>
            </div>
            
            {/* Pro Tip */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8">
              <p className="text-sm text-foreground text-center">
                <strong>Pro Tip:</strong> Measure at the end of the day when fingers are largest. If between sizes, go up.
              </p>
            </div>
            
            {/* Size Chart */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-left text-foreground font-medium">US Size</th>
                    {sizeChart.slice(0, 10).map((size) => (
                      <th key={size.us} className="py-3 px-2 text-center text-foreground font-medium">{size.us}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-4 text-muted-foreground">Diameter (mm)</td>
                    {sizeChart.slice(0, 10).map((size) => (
                      <td key={size.us} className="py-3 px-2 text-center text-muted-foreground">{size.mm}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 8: TESTIMONIALS ==================== */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">Love Stories We've Helped Create</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="p-6 bg-card rounded-xl border border-border"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary/20 mb-3" />
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    — {testimonial.author}, {testimonial.location}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button 
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
              >
                Read More Reviews
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 9: FAQ ==================== */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">Frequently Asked Questions</h2>
            </div>
            
            <SimpleAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* ==================== SECTION 10: FINAL CTA ==================== */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mb-4">
              Ready to Create Her Dream Ring?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start with your vision — we'll handle the rest. Every ring is handcrafted in NYC's Diamond District by master jewelers with 30+ years of experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg"
                onClick={() => goToCustomLab()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
              >
                Start Your Design
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/contact')}
                className="border-border text-foreground hover:bg-muted font-medium px-8"
              >
                Schedule a Consultation
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-primary" />
                Free Design Consultation
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Insured Shipping
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Lifetime Warranty
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BYPASS SECTION - Direct to designer without generation */}
      <section ref={bypassRef} id="bypass-section" className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-2">Already Have a Design?</h2>
              <p className="text-muted-foreground mb-1">
                Send photos or sketches directly to our master jeweler — we'll provide a quote and work with you one-on-one.
              </p>
              <p className="text-sm text-muted-foreground/70">
                We'll review and follow up within 24 hours. No commitment until you approve.
              </p>
            </div>
            
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Upload Design or Inspiration Images
                </label>
                <p className="text-xs text-muted-foreground mb-2">Pinterest screenshots, sketches, or photos of rings you like — anything helps.</p>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBypassImageUpload}
                    className="hidden"
                    id="bypass-upload"
                  />
                  <label htmlFor="bypass-upload" className="cursor-pointer">
                    <Camera className="w-10 h-10 text-primary/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Max 6 images</p>
                  </label>
                </div>
                
                {bypassImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {bypassImages.map((file, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setBypassImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0 right-0 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-bl"
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
                <label className="block text-sm font-medium text-foreground mb-2">
                  Describe Your Vision (Optional)
                </label>
                <Textarea
                  value={bypassDescription}
                  onChange={(e) => setBypassDescription(e.target.value)}
                  placeholder="Tell us about the ring you want — metal, stones, style preferences..."
                  className="min-h-[100px] border-border"
                />
              </div>

              <Button
                onClick={handleBypassSubmit}
                disabled={isSubmittingBypass || (bypassImages.length === 0 && !bypassDescription.trim())}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
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
                className="text-muted-foreground hover:text-primary text-sm inline-flex items-center gap-1"
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
