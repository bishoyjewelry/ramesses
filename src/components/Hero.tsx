import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Award, MapPin, Truck, Shield, Gem, Sparkles, Wrench, FileText, Package, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleStartRepair = () => {
    navigate("/repairs");
    setTimeout(() => {
      document.getElementById("repair-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-luxury-bg pt-16 sm:pt-20">
        {/* Subtle decorative elements */}
        <div className="absolute top-40 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-luxury-champagne/10 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-luxury-champagne/5 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-luxury-champagne/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-8 sm:py-16 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-luxury-champagne/10 border border-luxury-champagne/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8">
              <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-luxury-champagne" />
              <span className="text-xs sm:text-sm font-medium text-luxury-text">NYC Diamond District Craftsmanship</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif luxury-heading text-luxury-text mb-4 sm:mb-6 leading-tight px-2">
              Custom Design, Engagement Rings & Nationwide Mail-In Jewelry Repair by a{" "}
              <span className="relative inline-block">
                47th Street Master Jeweler
                <span className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-luxury-champagne"></span>
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-luxury-text-muted mb-10 sm:mb-14 leading-relaxed font-body max-w-3xl mx-auto px-2">
              Work directly with a master jeweler to create, customize, or restore the pieces that matter most.
            </p>

            {/* Two Clear Paths */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto px-2">
              {/* LEFT — Custom Jewelry (Primary) */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-luxury-champagne/20 shadow-luxury">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-luxury-champagne" />
                  <span className="text-sm font-semibold text-luxury-text uppercase tracking-wide">Custom Jewelry</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Link to="/custom" className="w-full">
                    <Button size="lg" className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-6 py-5 text-base rounded-lg shadow-luxury tap-target">
                      Design Custom Jewelry
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/engagement-rings" className="w-full">
                    <Button size="lg" variant="outline" className="w-full border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 font-semibold px-6 py-5 text-base rounded-lg tap-target">
                      Design an Engagement Ring
                      <Gem className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* RIGHT — Mail-In Repair (Secondary) */}
              <div className="bg-service-bg/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-service-gold/20 shadow-service">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Wrench className="w-5 h-5 text-service-gold" />
                  <span className="text-sm font-semibold text-white uppercase tracking-wide">Need a Repair?</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Button 
                    size="lg" 
                    onClick={handleStartRepair}
                    className="w-full bg-service-gold text-white hover:bg-service-gold-hover font-semibold px-6 py-5 text-base rounded-lg tap-target"
                  >
                    Start Mail-In Repair
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-service-text-muted text-sm text-center font-body">
                    Ship from anywhere in the U.S. — fully insured
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 sm:py-8 bg-luxury-bg-warm border-y border-luxury-divider">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-champagne flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-luxury-text">30+ Years Experience</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-champagne flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-luxury-text">Master Jeweler on 47th St</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-champagne flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-luxury-text">Nationwide Mail-In</span>
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
                <div className="w-14 h-14 bg-service-gold/15 border border-service-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-service-gold" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Start Online</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Tell us about your jewelry and upload photos.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-service-gold/15 border border-service-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-service-gold" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Ship or Drop Off</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Mail it insured, drop it off in NYC, or schedule local pickup.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-service-gold/15 border border-service-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-service-gold" />
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
                className="bg-service-gold text-white hover:bg-service-gold-hover font-semibold px-8 py-5 rounded"
              >
                Start Mail-In Repair
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Common Jewelry Repairs */}
      <section className="py-14 sm:py-16 bg-secondary/50">
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
                  className="group bg-background hover:bg-service-gold/5 border border-border hover:border-service-gold/30 rounded-xl p-4 sm:p-5 text-center transition-all duration-200"
                >
                  <span className="text-2xl mb-2 block">{repair.icon}</span>
                  <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-service-gold transition-colors">
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
