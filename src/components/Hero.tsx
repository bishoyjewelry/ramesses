import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroCraftsmanship from "@/assets/hero-craftsmanship.jpg";

export const Hero = () => {
  return (
    <>
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${heroCraftsmanship})` }}
        />
        {/* Elegant gradient - fades from left for luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--foreground))]/80 via-[hsl(var(--foreground))]/50 to-transparent" />
        
        {/* Content - Left aligned for modern luxury look */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-xl">
            <p className="text-primary uppercase tracking-widest text-sm mb-4 font-medium">
              NYC Diamond District Since 1985
            </p>
            <h1 className="font-hero text-primary-foreground mb-4 md:mb-6 font-normal text-4xl sm:text-5xl md:text-6xl leading-tight">
              Your Vision,<br />
              <span className="text-primary">Masterfully Crafted</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Bespoke jewelry designed and handcrafted by master jewelers in NYC's Diamond District
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/custom">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-[hsl(var(--color-gold-hover))] px-8 py-6 text-lg"
                >
                  Start Your Design
                </Button>
              </Link>
              <Link to="/design-ideas">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  Browse Inspirations
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-10 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                ★★★★★ 500+ Reviews
              </span>
              <span className="hidden sm:inline">•</span>
              <span>30-Day Guarantee</span>
              <span className="hidden sm:inline">•</span>
              <span>NYC Diamond District</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
