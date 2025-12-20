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
      {/* ==================== 2. SERVICE ROUTING SECTION ==================== */}
      <section className="py-14 sm:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Custom Jewelry */}
            <Link 
              to="/custom" 
              className="group block text-center p-10 sm:p-12 bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-border/40 transition-all duration-300"
            >
              <h2 className="font-display text-[1.75rem] sm:text-[2rem] text-foreground mb-4 font-normal tracking-tight leading-tight">
                Custom Jewelry
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Designed from scratch. Crafted to last.
              </p>
              <span className="inline-block border border-foreground/30 text-foreground group-hover:bg-foreground group-hover:text-background font-medium px-8 py-4 text-sm tracking-wide transition-all duration-300">
                Start a Custom Design
              </span>
            </Link>

            {/* Engagement Rings */}
            <Link 
              to="/engagement-rings" 
              className="group block text-center p-10 sm:p-12 bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-border/40 transition-all duration-300"
            >
              <h2 className="font-display text-[1.75rem] sm:text-[2rem] text-foreground mb-4 font-normal tracking-tight leading-tight">
                Engagement Rings
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Bespoke rings, made by master jewelers.
              </p>
              <span className="inline-block border border-foreground/30 text-foreground group-hover:bg-foreground group-hover:text-background font-medium px-8 py-4 text-sm tracking-wide transition-all duration-300">
                Design an Engagement Ring
              </span>
            </Link>

            {/* Mail-In Repairs */}
            <div 
              onClick={handleStartRepair}
              className="group cursor-pointer block text-center p-10 sm:p-12 bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-border/40 transition-all duration-300"
            >
              <h2 className="font-display text-[1.75rem] sm:text-[2rem] text-foreground mb-4 font-normal tracking-tight leading-tight">
                Mail-In Repairs
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Expert repairs, fully insured, handled in NYC.
              </p>
              <span className="inline-block border border-foreground/30 text-foreground group-hover:bg-foreground group-hover:text-background font-medium px-8 py-4 text-sm tracking-wide transition-all duration-300">
                Start a Repair
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. AUTHORITY BAND ==================== */}
      <section className="py-14 sm:py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-foreground/80 text-base sm:text-lg font-normal leading-relaxed">
              Crafted and restored by master jewelers on NYC's 47th Street.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base mt-2">
              Serving clients nationwide with fully insured service.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 4. FINAL CTA SECTION ==================== */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-display text-foreground mb-8 sm:mb-10 font-normal text-2xl sm:text-3xl tracking-tight">
              Begin Your Custom Piece
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <Link to="/custom">
                <Button 
                  size="lg" 
                  className="bg-foreground text-background hover:bg-foreground/90 font-medium px-10 py-6 text-button tracking-wide rounded-none min-w-[200px]"
                >
                  Start a Custom Design
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="ghost"
                onClick={handleStartRepair}
                className="text-muted-foreground hover:text-foreground hover:bg-transparent font-medium text-button tracking-wide"
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
