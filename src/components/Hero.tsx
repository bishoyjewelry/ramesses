import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import heroCraftsmanship from "@/assets/hero-craftsmanship.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  const handleStartRepair = () => {
    navigate("/repairs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-end justify-center pt-8 pb-20 sm:pb-28">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroCraftsmanship})` }}
        />
        {/* Dark Overlay - stronger for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/75" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-hero text-white mb-6 sm:mb-8 font-normal text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] uppercase tracking-[0.15em] leading-[0.95]">
              Custom Jewelry & Repairs
            </h1>
            
            <p className="font-sans text-sm sm:text-base text-white/40 mb-14 sm:mb-16 font-normal tracking-wide text-center">
              Crafted and restored by master jewelers in NYC's Diamond District
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link to="/custom">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/85 text-primary-foreground font-medium px-10 py-6 text-[13px] tracking-widest uppercase rounded-sm"
                >
                  Start a Custom Design
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="ghost"
                onClick={handleStartRepair}
                className="text-white/60 hover:text-white hover:bg-white/10 font-normal px-6 py-6 text-[13px] tracking-wide"
              >
                Mail-In Repair
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
