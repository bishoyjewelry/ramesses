import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-luxury-bg pt-20">
      {/* Subtle decorative elements */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-luxury-champagne/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-champagne/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif luxury-heading text-luxury-text mb-6 leading-tight">
                Where America Comes for{" "}
                <span className="relative">
                  Jewelry Repairs
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-luxury-champagne"></span>
                </span>
                {" "}& Custom Creations
              </h1>
              
              <p className="text-xl text-luxury-text-muted mb-10 leading-relaxed font-body">
                Nationwide mail-in repairs, AI-powered custom design, and master craftsmanship from NYC's 47th Street.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/repairs">
                  <Button size="lg" className="w-full sm:w-auto bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8 py-6 text-lg rounded-lg shadow-luxury">
                    Start Your Repair
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/custom">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 font-semibold px-8 py-6 text-lg rounded-lg">
                    Design a Custom Piece
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-luxury-bg-warm shadow-luxury border border-luxury-divider">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-luxury-text-muted p-8">
                    <div className="w-20 h-20 bg-luxury-champagne/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-luxury-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">Luxury Jewelry Display</p>
                    <p className="text-sm">Hero image placeholder</p>
                  </div>
                </div>
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-luxury-champagne/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};