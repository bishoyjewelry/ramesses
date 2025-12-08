import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Truck, FileCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-luxury-bg pt-20">
        {/* Subtle decorative elements */}
        <div className="absolute top-40 left-10 w-64 h-64 bg-luxury-champagne/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-champagne/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif luxury-heading text-luxury-text mb-6 leading-tight">
              Nationwide Mail-In Jewelry Repair & Custom Design by a{" "}
              <span className="relative inline-block">
                47th Street Master Jeweler
                <span className="absolute bottom-0 left-0 w-full h-1 bg-luxury-champagne"></span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-luxury-text-muted mb-10 leading-relaxed font-body max-w-3xl mx-auto">
              Ship your jewelry from anywhere in the U.S. or visit us in NYC for expert repairs, restorations, and custom pieces crafted with 30+ years of Diamond District experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/repairs">
                <Button size="lg" className="w-full sm:w-auto bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8 py-6 text-lg rounded-lg shadow-luxury">
                  Start Mail-In Repair
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/custom">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 font-semibold px-8 py-6 text-lg rounded-lg">
                  Design Custom Jewelry
                </Button>
              </Link>
            </div>

            {/* Tertiary Link */}
            <Link 
              to="/engagement-rings" 
              className="inline-flex items-center gap-2 text-luxury-champagne hover:text-luxury-champagne-hover font-medium transition-colors"
            >
              Learn About Engagement Rings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props Row */}
      <section className="py-12 bg-luxury-bg-warm border-y border-luxury-divider">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-luxury-champagne/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-luxury-champagne" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-text mb-2 font-body">
                30+ Years on 47th Street
              </h3>
              <p className="text-luxury-text-muted font-body text-sm leading-relaxed">
                Master jeweler craftsmanship for repairs, restorations, and custom work.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-luxury-champagne/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-7 h-7 text-luxury-champagne" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-text mb-2 font-body">
                Nationwide Mail-In
              </h3>
              <p className="text-luxury-text-muted font-body text-sm leading-relaxed">
                Insured, documented shipping from anywhere in the U.S.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-luxury-champagne/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-7 h-7 text-luxury-champagne" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-text mb-2 font-body">
                Transparent Digital Quotes
              </h3>
              <p className="text-luxury-text-muted font-body text-sm leading-relaxed">
                See your quote online and approve before any work begins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Ring Callout Band */}
      <section className="py-16 bg-service-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">
              Engagement Ring Repair, Redesign, and Custom Creation
            </h2>
            <p className="text-service-text-muted font-body text-lg mb-8 leading-relaxed max-w-3xl mx-auto">
              From prong tightening and stone security to complete redesigns and new custom engagement rings, we specialize in high-stakes work on the ring that matters most.
            </p>
            <Link to="/engagement-rings">
              <Button className="bg-service-gold text-white hover:bg-service-gold-hover font-semibold px-8 py-5 rounded">
                Explore Engagement Ring Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
