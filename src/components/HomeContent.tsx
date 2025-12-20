import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HomeContent = () => {
  const navigate = useNavigate();

  const handleStartRepair = () => {
    navigate("/repairs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ==================== SERVICE ROUTING ==================== */}
      <section className="py-12 sm:py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
            {/* Custom Jewelry */}
            <Link 
              to="/custom" 
              className="group block text-center p-8 sm:p-10 bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-border/40 transition-all duration-300"
            >
              <h2 className="font-display text-[1.5rem] sm:text-[1.75rem] text-foreground mb-3 font-normal tracking-tight leading-tight">
                Custom Jewelry
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Designed from scratch. Crafted to last.
              </p>
              <span className="inline-block border border-foreground/30 text-foreground group-hover:bg-foreground group-hover:text-background font-medium px-6 py-3 text-sm tracking-wide transition-all duration-300">
                Start a Custom Design
              </span>
            </Link>

            {/* Engagement Rings */}
            <Link 
              to="/engagement-rings" 
              className="group block text-center p-8 sm:p-10 bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-border/40 transition-all duration-300"
            >
              <h2 className="font-display text-[1.5rem] sm:text-[1.75rem] text-foreground mb-3 font-normal tracking-tight leading-tight">
                Engagement Rings
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Bespoke rings, made by master jewelers.
              </p>
              <span className="inline-block border border-foreground/30 text-foreground group-hover:bg-foreground group-hover:text-background font-medium px-6 py-3 text-sm tracking-wide transition-all duration-300">
                Design an Engagement Ring
              </span>
            </Link>

            {/* Mail-In Repairs */}
            <div 
              onClick={handleStartRepair}
              className="group cursor-pointer block text-center p-8 sm:p-10 bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-border/40 transition-all duration-300"
            >
              <h2 className="font-display text-[1.5rem] sm:text-[1.75rem] text-foreground mb-3 font-normal tracking-tight leading-tight">
                Mail-In Repairs
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Expert repairs, fully insured, handled in NYC.
              </p>
              <span className="inline-block border border-foreground/30 text-foreground group-hover:bg-foreground group-hover:text-background font-medium px-6 py-3 text-sm tracking-wide transition-all duration-300">
                Start a Repair
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== AUTHORITY BAND ==================== */}
      <section className="py-10 sm:py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-foreground/80 text-sm sm:text-base font-normal leading-relaxed">
              Crafted and restored by master jewelers on NYC's 47th Street.
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Serving clients nationwide with fully insured service.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-14 sm:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-display text-foreground mb-6 sm:mb-8 font-normal text-2xl sm:text-[1.75rem] tracking-tight">
              Begin Your Custom Piece
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <Link to="/custom">
                <Button 
                  size="lg" 
                  className="bg-foreground text-background hover:bg-foreground/90 font-medium px-10 py-6 text-sm tracking-wide rounded-none min-w-[200px]"
                >
                  Start a Custom Design
                </Button>
              </Link>
              <Button 
                variant="ghost"
                onClick={handleStartRepair}
                className="text-muted-foreground hover:text-foreground hover:bg-transparent font-normal text-sm tracking-wide"
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
