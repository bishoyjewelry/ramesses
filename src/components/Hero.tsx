import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroCraftsmanship from "@/assets/hero-craftsmanship.jpg";

export const Hero = () => {
  return (
    <>
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-end justify-center pt-8 pb-20 sm:pb-28">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat bg-[position:50%_40%]"
          style={{ backgroundImage: `url(${heroCraftsmanship})` }}
        />
        {/* Dark Overlay - subtle but reliable behind type */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/80" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-black/40 backdrop-blur-[2px] px-5 sm:px-8 py-8 sm:py-10 rounded-sm">
            <h1 className="font-hero text-primary-foreground mb-4 md:mb-6 font-normal text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] uppercase tracking-[0.12em] leading-[0.92]">
              Your Vision, Masterfully Crafted
            </h1>
            
            <p className="font-sans text-base md:text-lg text-primary-foreground/70 mb-10 sm:mb-12 font-normal tracking-wide text-center mx-auto max-w-xl">
              Bespoke jewelry designed and handcrafted by master jewelers in NYC's Diamond District
            </p>
            
            {/* Primary CTA */}
            <div className="flex flex-col items-center gap-5">
              <Link to="/custom">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-[hsl(var(--color-gold-hover))] border-primary px-12 py-6 rounded-sm text-[14px] tracking-widest uppercase font-medium"
                >
                  Start Your Design
                </Button>
              </Link>
              
              {/* Repairs text link */}
              <Link 
                to="/repairs" 
                className="text-primary-foreground/50 hover:text-primary-foreground/70 text-sm underline underline-offset-4 transition-colors"
              >
                Looking for repairs? Browse services with transparent pricing →
              </Link>
              
              {/* Phone number */}
              <p className="text-primary-foreground/50 text-sm">
                Or call us directly:{" "}
                <a 
                  href="tel:+12123910352" 
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors underline underline-offset-2"
                >
                  (212) 391-0352
                </a>
              </p>
            </div>
            
            {/* Trust Bar */}
            <div className="mt-10 pt-8 border-t border-primary-foreground/10">
              <p className="text-primary-foreground/50 text-xs sm:text-sm tracking-wide">
                <span>★★★★★ 500+ Reviews</span>
                <span className="mx-3 text-primary-foreground/20">•</span>
                <span>30-Day Guarantee</span>
                <span className="mx-3 text-primary-foreground/20">•</span>
                <span>NYC Diamond District</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
