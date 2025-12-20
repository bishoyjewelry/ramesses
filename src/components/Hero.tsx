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
      <section className="relative min-h-[70vh] sm:min-h-[75vh] flex items-center justify-center pt-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroCraftsmanship})` }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-white mb-5 sm:mb-6 font-normal text-[2.75rem] sm:text-[3.5rem] md:text-[4rem] tracking-tight leading-[1.1]">
              Custom Jewelry & Repairs
            </h1>
            
            <p className="text-lg sm:text-xl text-white/85 mb-8 sm:mb-10 font-normal tracking-wide">
              Handled in New York's Diamond District
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <Link to="/custom">
                <Button 
                  size="lg" 
                  className="bg-white text-foreground hover:bg-white/90 font-medium px-10 py-6 text-button tracking-wide rounded-none min-w-[200px]"
                >
                  Start a Custom Design
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="ghost"
                onClick={handleStartRepair}
                className="text-white/90 hover:text-white hover:bg-white/10 font-medium px-6 py-6 text-button tracking-wide"
              >
                Mail-In Repair
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. QUIET CREDIBILITY STRIP ==================== */}
      <section className="py-6 sm:py-8 bg-background">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs sm:text-sm text-muted-foreground/50 tracking-widest uppercase font-normal">
            NYC Diamond District • Master Jewelers • Nationwide Service
          </p>
        </div>
      </section>
    </>
  );
};
