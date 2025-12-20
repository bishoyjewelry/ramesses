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
      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
            {/* Custom Jewelry */}
            <div className="text-center">
              <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-4 font-normal tracking-tight">
                Custom Jewelry
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
                Designed from scratch. Crafted to last.
              </p>
              <Link to="/custom">
                <Button 
                  variant="outline" 
                  className="border-foreground/15 text-foreground hover:bg-foreground hover:text-background font-medium px-8 py-5 text-button tracking-wide rounded-none transition-all w-full sm:w-auto"
                >
                  Start a Design
                </Button>
              </Link>
            </div>

            {/* Engagement Rings */}
            <div className="text-center">
              <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-4 font-normal tracking-tight">
                Engagement Rings
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
                Timeless designs for your forever moment.
              </p>
              <Link to="/engagement-rings">
                <Button 
                  variant="outline" 
                  className="border-foreground/15 text-foreground hover:bg-foreground hover:text-background font-medium px-8 py-5 text-button tracking-wide rounded-none transition-all w-full sm:w-auto"
                >
                  View Collection
                </Button>
              </Link>
            </div>

            {/* Mail-In Repairs */}
            <div className="text-center">
              <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-4 font-normal tracking-tight">
                Mail-In Repairs
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
                Expert repairs, fully insured, handled in NYC.
              </p>
              <Button 
                variant="outline" 
                onClick={handleStartRepair}
                className="border-foreground/15 text-foreground hover:bg-foreground hover:text-background font-medium px-8 py-5 text-button tracking-wide rounded-none transition-all w-full sm:w-auto"
              >
                Start a Repair
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. AUTHORITY / CREDIBILITY BAND ==================== */}
      <section className="py-16 sm:py-20 bg-secondary/30 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-foreground/80 text-base sm:text-lg font-normal leading-relaxed">
              Master jewelers crafting and restoring fine jewelry on NYC's 47th Street.
              <span className="block mt-2 text-muted-foreground text-sm">
                Fully insured nationwide service — no work without your approval.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 4. FINAL CTA SECTION ==================== */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-display text-foreground mb-10 sm:mb-12 font-normal text-3xl sm:text-4xl tracking-tight">
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
