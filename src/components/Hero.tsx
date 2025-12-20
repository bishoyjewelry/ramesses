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
      <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-end justify-center pt-16 pb-16 sm:pb-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroCraftsmanship})` }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/70" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-white mb-4 sm:mb-5 font-normal text-[3rem] sm:text-[4rem] md:text-[4.5rem] tracking-tight leading-[1.05]">
              Custom Jewelry & Repairs
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 mb-8 sm:mb-10 font-normal tracking-wide">
              Handled in New York's Diamond District
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link to="/custom">
                <Button 
                  size="lg" 
                  className="bg-white text-foreground hover:bg-white/95 font-medium px-12 py-7 text-[15px] tracking-wide rounded-none min-w-[220px] shadow-lg"
                >
                  Start a Custom Design
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="ghost"
                onClick={handleStartRepair}
                className="text-white/70 hover:text-white hover:bg-transparent font-normal px-6 py-6 text-sm tracking-wide"
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
