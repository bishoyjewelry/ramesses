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
      {/* ==================== 3. PRIMARY PATHS SECTION ==================== */}
      <section className="py-20 sm:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            {/* Custom Jewelry */}
            <div className="group">
              <div className="aspect-[4/3] bg-muted/50 rounded-sm mb-6 flex items-center justify-center border border-border/30">
                <span className="text-muted-foreground/40 text-sm">Image</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-3 font-normal tracking-wide">
                Custom Jewelry
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Describe your vision — we bring it to life.
              </p>
              <Link to="/custom">
                <Button 
                  variant="outline" 
                  className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background font-medium px-6 py-5 rounded-none transition-colors"
                >
                  Start Designing
                </Button>
              </Link>
            </div>

            {/* Mail-In Repairs */}
            <div className="group">
              <div className="aspect-[4/3] bg-muted/50 rounded-sm mb-6 flex items-center justify-center border border-border/30">
                <span className="text-muted-foreground/40 text-sm">Image</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-3 font-normal tracking-wide">
                Mail-In Repairs
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Ship it to us, insured. We handle the rest.
              </p>
              <Button 
                variant="outline" 
                onClick={handleStartRepair}
                className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background font-medium px-6 py-5 rounded-none transition-colors"
              >
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. CONDENSED TRUST BLOCK ==================== */}
      <section className="py-10 sm:py-12 bg-background border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground/70">
            <span>Fully insured shipping</span>
            <span className="hidden sm:inline text-border">·</span>
            <span>No work without your approval</span>
            <span className="hidden sm:inline text-border">·</span>
            <span>Track repairs in your account</span>
          </div>
        </div>
      </section>

      {/* ==================== 5. FINAL CTA SECTION ==================== */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 
              className="font-display text-foreground mb-8 font-normal" 
              style={{ 
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
                lineHeight: '1.1', 
                letterSpacing: '0.02em' 
              }}
            >
              Ready to begin?
            </h2>
            
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
                variant="ghost"
                onClick={handleStartRepair}
                className="text-muted-foreground hover:text-foreground hover:bg-transparent underline underline-offset-4 font-normal px-4 py-6 text-base"
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
