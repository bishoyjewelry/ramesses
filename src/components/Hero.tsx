import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Award, MapPin, Truck, Shield, FileText, Package, CheckCircle, Sparkles, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleStartRepair = () => {
    navigate("/repairs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const commonRepairs = [
    { label: "Ring Resizing", icon: "💍" },
    { label: "Broken Chain", icon: "⛓️" },
    { label: "Prong Repair", icon: "💎" },
    { label: "Stone Replacement", icon: "✨" },
    { label: "Clasp Repair", icon: "🔗" },
    { label: "Polishing & Cleaning", icon: "✦" },
  ];
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center justify-center overflow-hidden bg-background pt-16 sm:pt-20">
        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* H1 Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-foreground mb-8 sm:mb-12 leading-[1.1] tracking-tight">
              Custom Jewelry & Repairs
            </h1>
            
            {/* Subheadline */}
            <p className="text-base sm:text-lg text-muted-foreground/80 font-body max-w-xl mx-auto leading-relaxed">
              Design and nationwide repair, handled in New York's Diamond District.
            </p>
          </div>
        </div>
      </section>

      {/* Two-Lane Split Section */}
      <section className="py-10 sm:py-14 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* LEFT — Custom Jewelry (Primary) */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-luxury">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Custom Jewelry</span>
              </div>
              <p className="text-muted-foreground font-body text-sm mb-6 leading-relaxed">
                Describe your vision. We generate concepts, refine the design together, and craft it in NYC.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/custom" className="w-full">
                  <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-5 text-base rounded-lg shadow-luxury">
                    Start Your Design
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/engagement-rings" className="w-full">
                  <Button size="lg" variant="outline" className="w-full border border-border text-foreground hover:bg-secondary font-medium px-6 py-5 text-base rounded-lg">
                    Design Engagement Ring
                  </Button>
                </Link>
                <p className="text-muted-foreground text-xs text-center font-body">
                  No commitment until you approve the final design
                </p>
              </div>
            </div>

            {/* RIGHT — Repairs (Secondary) */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Repair Services</span>
              </div>
              <p className="text-muted-foreground font-body text-sm mb-6 leading-relaxed">
                Tell us what needs fixing. We send an insured label, inspect it on video, and quote before any work begins.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleStartRepair}
                  className="w-full border border-border text-foreground hover:bg-secondary font-semibold px-6 py-5 text-base rounded-lg"
                >
                  Get a Free Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-muted-foreground text-xs text-center font-body">
                  Fully insured shipping. No repairs without your approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 sm:py-8 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground">30+ Years on 47th Street</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Fully Insured, Door to Door</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground">No Work Without Approval</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Track Everything Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mini "How Mail-In Repair Works" Section */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground text-center mb-10">
              How Our Mail-In Jewelry Repair Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-10">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">1. Describe Your Repair</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Tell us what needs fixing. Photos help but are not required.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">2. Ship It Insured</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  We email you a prepaid, insured label. Or drop off in NYC.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">3. Approve, Then We Repair</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  We inspect it on video and send a quote. No work starts without your OK.
                </p>
              </div>
            </div>
            
            {/* CTA */}
            <div className="text-center">
              <Button 
                onClick={handleStartRepair}
                variant="outline"
                className="border border-border text-foreground hover:bg-secondary font-semibold px-8 py-5 rounded"
              >
                Get a Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-muted-foreground text-xs mt-3 font-body">
                Takes about 2 minutes. Track your repair anytime in your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Jewelry Repairs */}
      <section className="py-14 sm:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground text-center mb-10">
              Common Jewelry Repairs
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {commonRepairs.map((repair, index) => (
                <Link 
                  key={index}
                  to="/repairs"
                  className="group bg-card hover:bg-background border border-border hover:border-primary/30 rounded-xl p-4 sm:p-5 text-center transition-all duration-200"
                >
                  <span className="text-2xl mb-2 block">{repair.icon}</span>
                  <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    {repair.label}
                  </span>
                </Link>
              ))}
            </div>
            
            <p className="text-center text-muted-foreground text-sm font-body">
              Select a repair type to start, or describe your issue in the form.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};