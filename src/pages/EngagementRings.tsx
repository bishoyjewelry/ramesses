import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { 
  Shield, 
  Award, 
  CheckCircle2, 
  Gem, 
  Sparkles,
  Truck,
  MapPin,
  ArrowRight,
  Heart,
  CircleDot,
  Hexagon,
  Circle,
  Triangle,
  Square,
  Star,
  MessageCircle,
  Palette,
  FileCheck,
  Package,
  Clock
} from "lucide-react";

const trustItems = [
  { icon: Award, label: "30+ Years Craftsmanship" },
  { icon: Gem, label: "Master Jeweler Oversight" },
  { icon: Truck, label: "Nationwide Mail-In Friendly" },
  { icon: Shield, label: "Insured Shipping" },
  { icon: MapPin, label: "NYC Diamond District Expertise" },
];

const ringStyles = [
  { 
    name: "Solitaire", 
    description: "Timeless elegance with a single stunning center stone",
    icon: CircleDot,
    style: "solitaire"
  },
  { 
    name: "Hidden Halo", 
    description: "Subtle sparkle hidden beneath the center stone",
    icon: Circle,
    style: "hidden-halo"
  },
  { 
    name: "Halo", 
    description: "Maximum brilliance with diamonds surrounding the center",
    icon: Sparkles,
    style: "halo"
  },
  { 
    name: "Three-Stone", 
    description: "Past, present, and future in one meaningful design",
    icon: Triangle,
    style: "three-stone"
  },
  { 
    name: "Pavé", 
    description: "Diamonds set into the band for continuous sparkle",
    icon: Star,
    style: "pave"
  },
  { 
    name: "Vintage", 
    description: "Intricate details inspired by classic eras",
    icon: Hexagon,
    style: "vintage"
  },
];

const stoneShapes = [
  "Round", "Oval", "Cushion", "Pear", "Radiant", "Emerald", "Princess", "Marquise"
];

const processSteps = [
  { 
    step: 1, 
    title: "Share Your Inspiration", 
    description: "Tell us your vision, share photos, or describe your dream ring",
    icon: MessageCircle
  },
  { 
    step: 2, 
    title: "We Design 3–5 Concepts", 
    description: "Our master jeweler creates custom design options for you",
    icon: Palette
  },
  { 
    step: 3, 
    title: "Approve the Final CAD", 
    description: "Review detailed 3D renderings and make revisions until perfect",
    icon: FileCheck
  },
  { 
    step: 4, 
    title: "We Cast, Set & Polish in NYC", 
    description: "Your ring is handcrafted on 47th Street with expert precision",
    icon: Gem
  },
  { 
    step: 5, 
    title: "Your Ring Ships Fully Insured", 
    description: "Delivered safely to your door with complete documentation",
    icon: Package
  },
];

const whyChooseUs = [
  { title: "Master Jeweler Quality Control", description: "Every ring inspected by a 30+ year Diamond District expert" },
  { title: "Transparent Pricing", description: "Know exactly what you're paying for—no hidden fees" },
  { title: "Unlimited Revisions", description: "We refine until you're 100% satisfied with the design" },
  { title: "Designed & Crafted in NYC", description: "Made on 47th Street, the heart of the Diamond District" },
  { title: "Personalized 1-on-1 Support", description: "Work directly with your dedicated jeweler throughout" },
];

export default function EngagementRings() {
  const scrollToStyles = () => {
    document.getElementById('ring-styles')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-luxury-bg pt-20">
        {/* Decorative elements */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-luxury-champagne/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-champagne/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luxury-champagne/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-luxury-champagne/10 border border-luxury-champagne/20 rounded-full px-4 py-2 mb-8">
              <Gem className="w-4 h-4 text-luxury-champagne" />
              <span className="text-sm font-medium text-luxury-text">Custom Engagement Rings</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif luxury-heading text-luxury-text mb-6 leading-tight">
              Design Your Custom Engagement Ring{" "}
              <span className="relative inline-block">
                With a 47th Street Master Jeweler
                <span className="absolute bottom-0 left-0 w-full h-1 bg-luxury-champagne"></span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-luxury-text-muted mb-10 leading-relaxed font-body max-w-3xl mx-auto">
              Personalized guidance, premium craftsmanship, and fully custom designs. Bring your vision to life with expert NYC jewelry makers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/custom?mode=engagement">
                <Button size="lg" className="w-full sm:w-auto bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8 py-6 text-lg rounded-lg shadow-luxury">
                  Start Your Engagement Ring
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={scrollToStyles}
                className="w-full sm:w-auto border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 font-semibold px-8 py-6 text-lg rounded-lg"
              >
                View Ring Styles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 bg-luxury-bg-warm border-y border-luxury-divider">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <item.icon className="w-5 h-5 text-luxury-champagne flex-shrink-0" />
                <span className="text-sm font-medium text-luxury-text whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ring Styles Section */}
      <section id="ring-styles" className="py-20 md:py-24 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-text mb-4">
              Choose Your Ring Style
            </h2>
            <p className="text-lg text-luxury-text-muted max-w-2xl mx-auto">
              Explore the most popular engagement ring settings. Every design is custom-made and tailored to your center stone, metal preference, and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {ringStyles.map((style, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-luxury border border-luxury-divider hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-luxury-champagne/15 rounded-full flex items-center justify-center mb-5 group-hover:bg-luxury-champagne/25 transition-colors">
                  <style.icon className="w-8 h-8 text-luxury-champagne" />
                </div>
                <h3 className="text-xl font-serif text-luxury-text mb-2">{style.name}</h3>
                <p className="text-luxury-text-muted text-sm mb-5">{style.description}</p>
                <Link to={`/custom?mode=engagement&style=${style.style}`}>
                  <Button variant="outline" className="w-full border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text">
                    Start This Style
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diamond & Gemstone Options */}
      <section className="py-20 md:py-24 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-luxury-champagne/10 border border-luxury-champagne/20 rounded-full px-4 py-2 mb-6">
                <Gem className="w-4 h-4 text-luxury-champagne" />
                <span className="text-sm font-medium text-luxury-text">Stones & Settings</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-luxury-text mb-4">
                Select the Perfect Center Stone
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Diamond Options */}
              <div className="bg-white rounded-2xl p-8 shadow-luxury border border-luxury-divider">
                <h3 className="text-xl font-serif text-luxury-text mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-luxury-champagne" />
                  Diamond Options
                </h3>
                <p className="text-luxury-text-muted mb-4">
                  We offer both <strong className="text-luxury-text">natural diamonds</strong> and <strong className="text-luxury-text">lab-grown diamonds</strong>, allowing you to choose based on your preferences and budget without compromising on brilliance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-luxury-text-muted">
                    <CheckCircle2 className="w-4 h-4 text-luxury-champagne flex-shrink-0" />
                    GIA & IGI certified stones available
                  </li>
                  <li className="flex items-center gap-2 text-sm text-luxury-text-muted">
                    <CheckCircle2 className="w-4 h-4 text-luxury-champagne flex-shrink-0" />
                    Expert guidance on 4Cs selection
                  </li>
                </ul>
              </div>

              {/* Gemstone Options */}
              <div className="bg-white rounded-2xl p-8 shadow-luxury border border-luxury-divider">
                <h3 className="text-xl font-serif text-luxury-text mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-luxury-champagne" />
                  Gemstone Options
                </h3>
                <p className="text-luxury-text-muted mb-4">
                  For a unique touch, choose from stunning gemstones like <strong className="text-luxury-text">sapphire</strong>, <strong className="text-luxury-text">emerald</strong>, <strong className="text-luxury-text">ruby</strong>, and more.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-luxury-text-muted">
                    <CheckCircle2 className="w-4 h-4 text-luxury-champagne flex-shrink-0" />
                    Ethically sourced gemstones
                  </li>
                  <li className="flex items-center gap-2 text-sm text-luxury-text-muted">
                    <CheckCircle2 className="w-4 h-4 text-luxury-champagne flex-shrink-0" />
                    Custom color matching available
                  </li>
                </ul>
              </div>
            </div>

            {/* Stone Shapes */}
            <div className="bg-white rounded-2xl p-8 shadow-luxury border border-luxury-divider">
              <h3 className="text-lg font-serif text-luxury-text mb-4 text-center">Available Stone Shapes</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {stoneShapes.map((shape, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 bg-luxury-bg rounded-full text-sm font-medium text-luxury-text border border-luxury-divider"
                  >
                    {shape}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center mt-10">
              <Link to="/custom?mode=engagement">
                <Button size="lg" className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8">
                  Start Your Engagement Ring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How Custom Works */}
      <section className="py-20 md:py-24 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-text mb-4">
              How Our Custom Engagement Ring Process Works
            </h2>
            <p className="text-lg text-luxury-text-muted max-w-2xl mx-auto">
              From your first idea to the final polish, we guide you every step of the way.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-6">
              {processSteps.map((step, index) => (
                <div key={index} className="text-center relative">
                  {/* Connector line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-luxury-divider"></div>
                  )}
                  <div className="relative z-10 w-16 h-16 bg-luxury-champagne/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-luxury-champagne">
                    <step.icon className="w-7 h-7 text-luxury-champagne" />
                  </div>
                  <div className="text-xs font-semibold text-luxury-champagne mb-2">Step {step.step}</div>
                  <h3 className="text-sm font-semibold text-luxury-text mb-2">{step.title}</h3>
                  <p className="text-xs text-luxury-text-muted leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/custom?mode=engagement">
              <Button size="lg" className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8">
                Begin Your Custom Design
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Ramessés */}
      <section className="py-20 md:py-24 bg-service-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Why Choose Ramessés
            </h2>
            <p className="text-lg text-service-text-muted max-w-2xl mx-auto">
              Experience the difference of working with a true master jeweler.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <div 
                key={index} 
                className="bg-service-bg-secondary rounded-xl p-6 border border-service-gold/20"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-service-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-service-text-muted">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-24 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Gem className="w-12 h-12 text-luxury-champagne mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-text mb-4">
              Ready to Create Your Ring?
            </h2>
            <p className="text-lg text-luxury-text-muted mb-10">
              Start your custom engagement ring journey with a 47th Street master jeweler today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/custom?mode=engagement">
                <Button size="lg" className="w-full sm:w-auto bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8 py-6 text-lg shadow-luxury">
                  Start Your Engagement Ring
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 font-semibold px-8 py-6 text-lg">
                  Schedule a Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
