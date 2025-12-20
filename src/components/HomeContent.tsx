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
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Custom Jewelry */}
            <div className="group text-center p-8 sm:p-10 bg-secondary/20 hover:bg-secondary/40 transition-colors duration-300">
              <h2 className="font-display text-2xl sm:text-[1.75rem] text-foreground mb-3 font-normal tracking-tight">
                Custom Jewelry
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Designed from scratch. Crafted to last.
              </p>
              <Link to="/custom">
                <Button 
                  variant="outline" 
                  className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background font-medium px-6 py-5 text-button tracking-wide rounded-none transition-all"
                >
                  Start a Custom Design
                </Button>
              </Link>
            </div>

            {/* Engagement Rings */}
            <div className="group text-center p-8 sm:p-10 bg-secondary/20 hover:bg-secondary/40 transition-colors duration-300">
              <h2 className="font-display text-2xl sm:text-[1.75rem] text-foreground mb-3 font-normal tracking-tight">
                Engagement Rings
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Bespoke engagement rings, made by master jewelers.
              </p>
              <Link to="/engagement-rings">
                <Button 
                  variant="outline" 
                  className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background font-medium px-6 py-5 text-button tracking-wide rounded-none transition-all"
                >
                  Design an Engagement Ring
                </Button>
              </Link>
            </div>

            {/* Mail-In Repairs */}
            <div className="group text-center p-8 sm:p-10 bg-secondary/20 hover:bg-secondary/40 transition-colors duration-300">
              <h2 className="font-display text-2xl sm:text-[1.75rem] text-foreground mb-3 font-normal tracking-tight">
                Mail-In Repairs
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Expert repairs, fully insured, handled in NYC.
              </p>
              <Button 
                variant="outline" 
                onClick={handleStartRepair}
                className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background font-medium px-6 py-5 text-button tracking-wide rounded-none transition-all"
              >
                Start a Repair
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. AUTHORITY / CREDIBILITY BAND ==================== */}
      <section className="py-12 sm:py-14 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-foreground/70 text-sm sm:text-base font-normal">
              Fully insured nationwide service — no work without your approval.
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
