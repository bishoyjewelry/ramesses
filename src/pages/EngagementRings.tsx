import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FAQSection } from "@/components/FAQSection";
import { SEOContentBlock } from "@/components/SEOContentBlock";
import { 
  Shield, 
  Camera, 
  Award, 
  CheckCircle2, 
  Diamond, 
  Gem, 
  Sparkles,
  Package,
  FileText,
  Clock,
  Heart
} from "lucide-react";

const engagementRingFAQs = [
  {
    question: "Is it safe to send my engagement ring by mail?",
    answer: "Yes. We use insured labels, tamper-evident packaging, and complete photo/video documentation before any work begins."
  },
  {
    question: "How long do repairs take?",
    answer: "Most repairs are completed within 3–5 days after you approve your quote."
  },
  {
    question: "How do you prevent diamond switching?",
    answer: "We photograph inclusions and unique identifiers so you can verify your stone before and after."
  },
  {
    question: "Can you redesign or upgrade my ring?",
    answer: "Yes. Our Custom Lab can create a new setting, improve structure, or completely modernize your design."
  },
  {
    question: "Do you work with all stone shapes?",
    answer: "Yes — round, oval, pear, radiant, cushion, emerald, and more."
  },
  {
    question: "Can I use my existing diamond?",
    answer: "Absolutely. We specialize in reset projects using your center stone."
  }
];

const services = [
  "Prong tightening",
  "Prong retipping & rebuilding",
  "Stone tightening (all shapes)",
  "Pavé and micro-pavé repair",
  "Halo repair and restructuring",
  "Head replacement",
  "Shank repair or replacement",
  "Rhodium plating for white gold",
  "Resizing (up or down)",
  "Polishing and refinishing",
  "Diamond or gemstone replacement",
  "Full restoration for vintage rings",
  "Custom redesign and upgrades"
];

const trustPoints = [
  { icon: Camera, title: "30+ Years on NYC's Diamond District", description: "Master-level craftsmanship for delicate pavé, halo, solitaire, and vintage engagement rings." },
  { icon: Shield, title: "Secure & Documented", description: "Every ring is photographed and video-documented before work begins for total transparency." },
  { icon: Gem, title: "Precision Stone & Prong Work", description: "Microscope-level stone tightening, prong rebuilding, and setting repair." }
];

const safetyPoints = [
  "High-resolution photography of inclusions before work",
  "Video intake of your ring upon arrival",
  "Insured shipping and courier pickup options",
  "Secure chain-of-custody from intake to return",
  "Master jeweler QC before sending back"
];

const howItWorks = [
  { step: 1, title: "Tell Us About Your Ring", description: "Share details about your ring or design vision" },
  { step: 2, title: "Choose Your Method", description: "Ship it, drop it off, or request courier pickup" },
  { step: 3, title: "Get Your Quote", description: "Receive a digital quote or design preview" },
  { step: 4, title: "We Complete Your Ring", description: "Approve online — we repair with precision" }
];

const customBullets = [
  "Upload your ideas or inspiration photos",
  "AI-assisted concept suggestions",
  "Real-time quote estimates",
  "CAD modeling with revisions",
  "Casting & stone setting on 47th Street",
  "3–5 week timeline",
  "Option to upgrade or redesign existing rings"
];

export default function EngagementRings() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Diamond className="w-12 h-12 text-service-gold mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-text mb-6 leading-tight">
              Design, Repair, or Upgrade Your Engagement Ring With a 47th Street Master Jeweler
            </h1>
            <p className="text-lg md:text-xl text-luxury-text-muted mb-10 max-w-3xl mx-auto">
              From custom ring design to expert repairs, upgrades, and full restorations — your engagement ring is handled with Diamond District precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-service-gold hover:bg-service-gold-hover text-foreground font-semibold px-8">
                <Link to="/custom?mode=engagement">Design an Engagement Ring</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-luxury-text text-luxury-text hover:bg-luxury-text hover:text-background">
                <Link to="/repairs">Start an Engagement Ring Repair</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-text text-center mb-4">
            Why People Trust Us With Their Engagement Rings
          </h2>
          <div className="w-20 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {trustPoints.map((point, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-luxury-bg-warm rounded-full flex items-center justify-center mx-auto mb-5">
                  <point.icon className="w-8 h-8 text-service-gold" />
                </div>
                <h3 className="text-xl font-semibold text-luxury-text mb-3">{point.title}</h3>
                <p className="text-luxury-text-muted">{point.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-service-gold text-service-gold hover:bg-service-gold hover:text-foreground">
              <Link to="/repairs">See Before & After Results</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-16 md:py-20 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-text text-center mb-4">
            Everything Your Engagement Ring May Need — Done Properly
          </h2>
          <div className="w-20 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
            {services.map((service, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-background rounded-lg shadow-soft">
                <CheckCircle2 className="w-5 h-5 text-service-gold flex-shrink-0" />
                <span className="text-sm text-luxury-text">{service}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="bg-service-gold hover:bg-service-gold-hover text-foreground font-semibold">
              <Link to="/repairs">Start an Engagement Ring Repair</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Custom Design Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Sparkles className="w-10 h-10 text-service-gold mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-text mb-4">
                Design Your Custom Engagement Ring
              </h2>
              <p className="text-lg text-luxury-text-muted">
                Upload inspiration, choose your style, and bring your vision to life through our Custom Lab.
              </p>
            </div>
            
            <div className="bg-luxury-bg-warm rounded-2xl p-8 md:p-10">
              <ul className="space-y-4 mb-8">
                {customBullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-service-gold mt-0.5 flex-shrink-0" />
                    <span className="text-luxury-text">{bullet}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-service-gold hover:bg-service-gold-hover text-foreground font-semibold">
                  <Link to="/custom?mode=engagement">Design an Engagement Ring</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-luxury-text text-luxury-text hover:bg-luxury-text hover:text-background">
                  <Link to="/shop">See Customer-Designed Rings</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 md:py-20 bg-service-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-12 h-12 text-service-gold mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-service-text mb-4">
              Your Diamond Is Always Safe
            </h2>
            <div className="w-20 h-1 bg-service-gold mx-auto mb-10"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {safetyPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-service-bg-secondary rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-service-gold flex-shrink-0" />
                  <span className="text-sm text-service-text text-left">{point}</span>
                </div>
              ))}
            </div>
            
            <p className="text-service-text-muted italic flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-service-gold" />
              "We treat every engagement ring like it belongs to our own family."
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-text text-center mb-4">
            How It Works
          </h2>
          <div className="w-20 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-10">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-service-gold text-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="font-semibold text-luxury-text mb-2">{step.title}</h3>
                <p className="text-sm text-luxury-text-muted">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="bg-service-gold hover:bg-service-gold-hover text-foreground font-semibold">
              <Link to="/repairs">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection 
        title="Engagement Ring FAQ"
        faqs={engagementRingFAQs}
      />

      {/* SEO Block */}
      <SEOContentBlock 
        title="Engagement Ring Repair & Custom Design | Ramessés Jewelry"
        content="Ramessés specializes in engagement ring repair, custom design, and full restoration using over 30 years of experience on NYC's Diamond District. We handle everything from prong tightening and pavé repair to complete redesigns and custom engagement ring creation. Customers nationwide use our insured mail-in service or NYC drop-off. Every ring is documented, photographed, and handled with museum-grade care."
      />

      <Footer />
    </div>
  );
}
