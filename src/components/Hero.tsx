import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, MapPin, Truck, Shield, Gem, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();

  const scrollToRepairs = () => {
    document.getElementById('mail-in-repairs')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-luxury-bg pt-16 sm:pt-20">
        {/* Subtle decorative elements - hidden on smallest screens for performance */}
        <div className="absolute top-40 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-luxury-champagne/10 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-luxury-champagne/5 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-luxury-champagne/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-8 sm:py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-luxury-champagne/10 border border-luxury-champagne/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8">
              <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-luxury-champagne" />
              <span className="text-xs sm:text-sm font-medium text-luxury-text">NYC Diamond District Craftsmanship</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif luxury-heading text-luxury-text mb-4 sm:mb-6 leading-tight px-2">
              Custom Jewelry & Engagement Rings{" "}
              <span className="relative inline-block">
                Crafted by a 47th Street Master Jeweler
                <span className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-luxury-champagne"></span>
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-luxury-text-muted mb-8 sm:mb-10 leading-relaxed font-body max-w-3xl mx-auto px-2">
              NYC craftsmanship, AI-assisted design, and nationwide mail-in services. Work directly with a master jeweler to create or restore the pieces that matter most.
            </p>

            <div className="flex flex-col gap-3 sm:gap-4 justify-center px-2 sm:px-0 mb-4 sm:mb-6">
              <Link to="/custom" className="w-full sm:w-auto sm:inline-block">
                <Button size="lg" className="w-full sm:w-auto bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-lg shadow-luxury tap-target">
                  Start Custom Design
                  <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link to="/engagement-rings" className="w-full sm:w-auto sm:inline-block">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-lg tap-target">
                  Explore Engagement Rings
                </Button>
              </Link>
            </div>

            {/* Tertiary Link */}
            <button 
              onClick={scrollToRepairs}
              className="inline-flex items-center gap-2 text-luxury-text-muted hover:text-luxury-text font-medium transition-colors tap-target py-2"
            >
              Learn About Mail-In Repairs
              <ArrowRight className="h-4 w-4" />
            </button>
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

      {/* Featured Blocks */}
      <section className="py-12 sm:py-20 bg-luxury-bg pb-mobile-nav">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Custom Jewelry Block */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-luxury border border-luxury-divider hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-luxury-champagne/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-luxury-champagne" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-luxury-text mb-3 sm:mb-4">Design Custom Jewelry</h3>
              <p className="text-luxury-text-muted font-body mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
                From rings and pendants to full redesigns, work with an expert to bring your idea to life.
              </p>
              <Link to="/custom" className="block sm:inline-block">
                <Button className="w-full sm:w-auto bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold tap-target">
                  Start Custom Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Engagement Rings Block */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-luxury border border-luxury-divider hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-luxury-champagne/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Gem className="w-6 h-6 sm:w-7 sm:h-7 text-luxury-champagne" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-luxury-text mb-3 sm:mb-4">Create Your Engagement Ring</h3>
              <p className="text-luxury-text-muted font-body mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Personalized guidance, premium craftsmanship, and complete customization options.
              </p>
              <Link to="/engagement-rings" className="block sm:inline-block">
                <Button className="w-full sm:w-auto bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold tap-target">
                  Explore Engagement Rings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mail-In Repair Section */}
      <section id="mail-in-repairs" className="py-12 sm:py-20 bg-service-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-service-gold/10 border border-service-gold/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-service-gold" />
              <span className="text-xs sm:text-sm font-medium text-white">Ship From Anywhere in the U.S.</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-3 sm:mb-4 px-2">
              Nationwide Mail-In Jewelry Repair
            </h2>
            <p className="text-service-text-muted font-body text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-2">
              Professional repairs, polishing, resizing, soldering, and restoration with insured shipping and 47th Street craftsmanship.
            </p>
            <Link to="/repairs" className="block sm:inline-block px-4 sm:px-0">
              <Button className="w-full sm:w-auto bg-service-gold text-white hover:bg-service-gold-hover font-semibold px-6 sm:px-8 py-5 rounded tap-target">
                Start Mail-In Repair
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
