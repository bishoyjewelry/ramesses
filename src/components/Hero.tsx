import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Award, Shield, CheckCircle, FileText, Sparkles, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleStartRepair = () => {
    navigate("/repairs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[55vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden bg-background pt-20 sm:pt-24">
        <div className="container mx-auto px-4 py-20 sm:py-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Overline */}
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-6 sm:mb-8">
              NYC Diamond District Craftsmanship
            </p>
            
            {/* H1 Headline */}
            <h1 className="font-display text-foreground mb-6 sm:mb-8 font-normal tracking-wide" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: '1.05', letterSpacing: '0.03em' }}>
              Custom Jewelry & Repairs
            </h1>
            
            {/* Subheadline */}
            <p className="text-base sm:text-lg text-muted-foreground/75 max-w-md mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
              Design and nationwide repair, handled in New York's Diamond District.
            </p>
            
            {/* Subtle CTA */}
            <Link 
              to="/custom" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span className="border-b border-muted-foreground/30 group-hover:border-foreground/50 pb-0.5 transition-colors">
                Start designing
              </span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </Link>
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
    </>
  );
};
