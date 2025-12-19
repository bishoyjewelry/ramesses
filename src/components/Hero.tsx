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
      <section className="relative min-h-[60vh] sm:min-h-[65vh] flex items-center justify-center overflow-hidden bg-luxury-bg pt-16 sm:pt-20">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg via-luxury-bg to-luxury-bg-warm opacity-50"></div>

        <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-luxury-champagne mb-6 sm:mb-8">
              NYC Diamond District Craftsmanship
            </p>

            {/* H1 Headline - SEO optimized */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-luxury-text mb-6 sm:mb-8 leading-[1.2] sm:leading-[1.25] tracking-tight">
              Custom Jewelry & Engagement Rings
              <br className="hidden sm:block" />
              <span className="block sm:inline"> by a 47th Street Master Jeweler</span>
            </h1>
            
            {/* Subheadline with SEO keywords */}
            <p className="text-base sm:text-lg md:text-xl text-luxury-text-muted mb-10 sm:mb-12 leading-relaxed font-body max-w-2xl mx-auto">
              Design from anywhere. Repair with confidence.
              <br />
              Handcrafted in New York's Diamond District.
            </p>
          </div>
        </div>
      </section>

      {/* Two-Lane Split Section */}
      <section className="py-10 sm:py-14 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* LEFT — Custom Jewelry (Primary) */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-luxury-divider shadow-luxury">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-luxury-champagne" />
                <span className="text-sm font-semibold text-luxury-text uppercase tracking-wide">Custom Jewelry</span>
              </div>
              <p className="text-luxury-text-muted font-body text-sm mb-6 leading-relaxed">
                Work directly with a master jeweler to design your dream piece — engagement rings, pendants, bracelets, and more.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/custom" className="w-full">
                  <Button size="lg" className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-6 py-5 text-base rounded-lg shadow-luxury">
                    Create Custom Jewelry
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/engagement-rings" className="w-full">
                  <Button size="lg" variant="outline" className="w-full border border-luxury-divider text-luxury-text hover:bg-luxury-bg-warm font-medium px-6 py-5 text-base rounded-lg">
                    Design Engagement Ring
                  </Button>
                </Link>
              </div>
            </div>

            {/* RIGHT — Repairs (Secondary) */}
            <div className="bg-[hsl(35_15%_91%)] rounded-2xl p-6 sm:p-8 border border-luxury-divider">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-service-gold-text" />
                <span className="text-sm font-semibold text-luxury-text uppercase tracking-wide">Repair Services</span>
              </div>
              <p className="text-luxury-text-muted font-body text-sm mb-6 leading-relaxed">
                Ship from anywhere in the U.S. — fully insured mail-in jewelry repair by an experienced NYC jeweler.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleStartRepair}
                  className="w-full border-2 border-luxury-text/20 text-luxury-text hover:bg-luxury-bg hover:border-luxury-text/40 font-semibold px-6 py-5 text-base rounded-lg"
                >
                  Start Repair / Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-luxury-text-muted text-xs text-center font-body">
                  Free quotes • Insured shipping • Expert craftsmanship
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 sm:py-8 bg-luxury-bg border-y border-luxury-divider">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-champagne flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-luxury-text">30+ Years Experience</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-champagne flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-luxury-text">47th Street Jeweler</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-champagne flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-luxury-text">Nationwide Jewelry Repair</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-champagne flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-luxury-text">Insured Shipping</span>
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
                <div className="w-14 h-14 bg-luxury-champagne/15 border border-luxury-champagne/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-luxury-champagne" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Start Online</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Tell us about your jewelry and upload photos.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-luxury-champagne/15 border border-luxury-champagne/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-luxury-champagne" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Ship or Drop Off</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Mail it insured, drop it off in NYC, or schedule local pickup.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-luxury-champagne/15 border border-luxury-champagne/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-luxury-champagne" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Repair & Return</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  You approve the quote. We repair it and ship it back safely.
                </p>
              </div>
            </div>
            
            {/* CTA */}
            <div className="text-center">
              <Button 
                onClick={handleStartRepair}
                variant="outline"
                className="border-2 border-luxury-text/20 text-luxury-text hover:bg-luxury-bg-warm hover:border-luxury-text/40 font-semibold px-8 py-5 rounded"
              >
                Start Mail-In Repair
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Common Jewelry Repairs */}
      <section className="py-14 sm:py-16 bg-luxury-bg-warm">
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
                  className="group bg-card hover:bg-luxury-bg border border-luxury-divider hover:border-luxury-champagne/30 rounded-xl p-4 sm:p-5 text-center transition-all duration-200"
                >
                  <span className="text-2xl mb-2 block">{repair.icon}</span>
                  <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-luxury-champagne transition-colors">
                    {repair.label}
                  </span>
                </Link>
              ))}
            </div>
            
            <p className="text-center text-muted-foreground text-sm font-body">
              Click any repair type to get started — our jeweler handles all kinds of repairs.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};