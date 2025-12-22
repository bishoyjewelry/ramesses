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
            <h1 className="font-hero text-white mb-8 sm:mb-10 font-light text-[2.25rem] sm:text-[3rem] md:text-[3.5rem] uppercase tracking-[0.12em] leading-[1.05]">
              Custom Jewelry & Repairs
            </h1>
            
            <p className="font-sans text-base sm:text-lg text-white/55 mb-12 sm:mb-14 font-normal tracking-wide">
              Handled in New York's Diamond District
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
              <Link to="/custom">
                <Button 
                  size="lg" 
                  className="bg-[hsl(38,45%,42%)] hover:bg-[hsl(38,45%,35%)] text-white font-medium px-10 py-6 text-[14px] tracking-widest uppercase rounded-none border-0"
                >
                  Start a Custom Design
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="link"
                onClick={handleStartRepair}
                className="text-white/65 hover:text-white font-normal px-4 py-6 text-[13px] tracking-wide underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
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
