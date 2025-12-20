import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  const handleStartRepair = () => {
    navigate("/repairs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative min-h-[60vh] sm:min-h-[65vh] flex items-center justify-center bg-background pt-20 sm:pt-24">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-2xl mx-auto text-center">
            {/* Headline */}
            <h1 
              className="font-display text-foreground mb-5 sm:mb-6 font-normal" 
              style={{ 
                fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
                lineHeight: '1.05', 
                letterSpacing: '0.02em' 
              }}
            >
              Custom Jewelry & Repairs
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground/70 mb-10 sm:mb-12 font-normal">
              Handled in New York's Diamond District
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link to="/custom">
                <Button 
                  size="lg" 
                  className="bg-foreground text-background hover:bg-foreground/90 font-medium px-8 py-6 text-base rounded-none min-w-[220px]"
                >
                  Start a Custom Design
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleStartRepair}
                className="border-foreground/20 text-foreground hover:bg-foreground/5 font-medium px-8 py-6 text-base rounded-none min-w-[220px]"
              >
                Mail-In Repair
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. QUIET CREDIBILITY STRIP ==================== */}
      <section className="py-6 sm:py-8 bg-background border-y border-border/50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground/60 tracking-wide">
            Three generations of master jewelers on New York's 47th Street — serving clients nationwide
          </p>
        </div>
      </section>
    </>
  );
};
