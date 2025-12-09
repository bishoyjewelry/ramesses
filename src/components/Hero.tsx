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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-luxury-bg pt-20">
        {/* Subtle decorative elements */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-luxury-champagne/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-champagne/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-champagne/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-luxury-champagne/10 border border-luxury-champagne/20 rounded-full px-4 py-2 mb-8">
              <Gem className="w-4 h-4 text-luxury-champagne" />
              <span className="text-sm font-medium text-luxury-text">NYC Diamond District Craftsmanship</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif luxury-heading text-luxury-text mb-6 leading-tight">
              Custom Jewelry & Engagement Rings{" "}
              <span className="relative inline-block">
                Crafted by a 47th Street Master Jeweler
                <span className="absolute bottom-0 left-0 w-full h-1 bg-luxury-champagne"></span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-luxury-text-muted mb-10 leading-relaxed font-body max-w-3xl mx-auto">
              NYC craftsmanship, AI-assisted design, and nationwide mail-in services. Work directly with a master jeweler to create or restore the pieces that matter most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/custom">
                <Button size="lg" className="w-full sm:w-auto bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8 py-6 text-lg rounded-lg shadow-luxury">
                  Start Custom Design
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/engagement-rings">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 font-semibold px-8 py-6 text-lg rounded-lg">
                  Explore Engagement Rings
                </Button>
              </Link>
            </div>

            {/* Tertiary Link */}
            <button 
              onClick={scrollToRepairs}
              className="inline-flex items-center gap-2 text-luxury-champagne hover:text-luxury-champagne-hover font-medium transition-colors"
            >
              Learn About Mail-In Repairs
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 bg-luxury-bg-warm border-y border-luxury-divider">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <Award className="w-6 h-6 text-luxury-champagne flex-shrink-0" />
              <span className="text-sm font-medium text-luxury-text">30+ Years Experience</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin className="w-6 h-6 text-luxury-champagne flex-shrink-0" />
              <span className="text-sm font-medium text-luxury-text">Master Jeweler on 47th Street</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Truck className="w-6 h-6 text-luxury-champagne flex-shrink-0" />
              <span className="text-sm font-medium text-luxury-text">Nationwide Mail-In Available</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-luxury-champagne flex-shrink-0" />
              <span className="text-sm font-medium text-luxury-text">Insured Shipping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blocks */}
      <section className="py-20 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Custom Jewelry Block */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-luxury border border-luxury-divider hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-luxury-champagne/20 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-luxury-champagne" />
              </div>
              <h3 className="text-2xl font-serif text-luxury-text mb-4">Design Custom Jewelry</h3>
              <p className="text-luxury-text-muted font-body mb-6 leading-relaxed">
                From rings and pendants to full redesigns, work with an expert to bring your idea to life.
              </p>
              <Link to="/custom">
                <Button className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold">
                  Start Custom Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Engagement Rings Block */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-luxury border border-luxury-divider hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-luxury-champagne/20 rounded-full flex items-center justify-center mb-6">
                <Gem className="w-7 h-7 text-luxury-champagne" />
              </div>
              <h3 className="text-2xl font-serif text-luxury-text mb-4">Create Your Engagement Ring</h3>
              <p className="text-luxury-text-muted font-body mb-6 leading-relaxed">
                Personalized guidance, premium craftsmanship, and complete customization options.
              </p>
              <Link to="/engagement-rings">
                <Button className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold">
                  Explore Engagement Rings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mail-In Repair Section */}
      <section id="mail-in-repairs" className="py-20 bg-service-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-service-gold/10 border border-service-gold/20 rounded-full px-4 py-2 mb-6">
              <Truck className="w-4 h-4 text-service-gold" />
              <span className="text-sm font-medium text-white">Ship From Anywhere in the U.S.</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-4">
              Nationwide Mail-In Jewelry Repair
            </h2>
            <p className="text-service-text-muted font-body text-lg mb-8 leading-relaxed max-w-3xl mx-auto">
              Professional repairs, polishing, resizing, soldering, and restoration with insured shipping and 47th Street craftsmanship.
            </p>
            <Link to="/repairs">
              <Button className="bg-service-gold text-white hover:bg-service-gold-hover font-semibold px-8 py-5 rounded">
                Start Mail-In Repair
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
