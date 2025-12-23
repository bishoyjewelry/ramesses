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
          className="absolute inset-0 bg-cover bg-no-repeat bg-[position:50%_40%]"
          style={{ backgroundImage: `url(${heroCraftsmanship})` }}
        />
        {/* Dark Overlay - subtle but reliable behind type */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/80" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-foreground/15 backdrop-blur-[2px] px-5 sm:px-8 py-8 sm:py-10 rounded-sm">
            <h1 className="font-hero text-primary-foreground mb-6 sm:mb-8 font-normal text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] uppercase tracking-[0.15em] leading-[0.92]">
              Custom Jewelry & Repairs
            </h1>
            
            <p className="font-sans text-sm sm:text-base text-primary-foreground/60 mb-14 sm:mb-16 font-normal tracking-wide text-center mx-auto">
              Crafted and restored by master jewelers in NYC's Diamond District
            </p>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-center gap-4 sm:gap-6">
              <Link to="/custom">
                <Button
                  size="lg"
                  className="px-10 rounded-sm text-[13px] tracking-widest uppercase"
                >
                  Start a Custom Design
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={handleStartRepair}
                className="bg-transparent border-primary-foreground/25 text-primary-foreground/75 hover:text-primary-foreground hover:bg-primary-foreground/10 px-8 rounded-sm text-[13px] tracking-wide"
              >
                Start Repairs
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
