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
      <section className="py-24 sm:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 md:gap-20 max-w-4xl mx-auto">
            {/* Custom Jewelry */}
            <div className="text-center md:text-left">
              <div className="aspect-[4/3] bg-secondary/40 mb-8 flex items-center justify-center">
                <span className="text-muted-foreground/30 text-xs tracking-widest uppercase">Image</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-4 font-normal tracking-wide">
                Custom Jewelry
              </h2>
              <p className="text-muted-foreground/70 text-sm mb-8 max-w-xs mx-auto md:mx-0">
                Describe your vision — we bring it to life.
              </p>
              <Link to="/custom">
                <Button 
                  variant="outline" 
                  className="border-foreground/15 text-foreground hover:bg-foreground hover:text-background font-normal px-8 py-5 text-sm tracking-wide rounded-none transition-all"
                >
                  Start Designing
                </Button>
              </Link>
            </div>

            {/* Mail-In Repairs */}
            <div className="text-center md:text-left">
              <div className="aspect-[4/3] bg-secondary/40 mb-8 flex items-center justify-center">
                <span className="text-muted-foreground/30 text-xs tracking-widest uppercase">Image</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-4 font-normal tracking-wide">
                Mail-In Repairs
              </h2>
              <p className="text-muted-foreground/70 text-sm mb-8 max-w-xs mx-auto md:mx-0">
                Ship it to us, insured. We handle the rest.
              </p>
              <Button 
                variant="outline" 
                onClick={handleStartRepair}
                className="border-foreground/15 text-foreground hover:bg-foreground hover:text-background font-normal px-8 py-5 text-sm tracking-wide rounded-none transition-all"
              >
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. CONDENSED TRUST BLOCK ==================== */}
      <section className="py-12 sm:py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-xs text-muted-foreground/50 tracking-wide">
            <span>Fully insured shipping</span>
            <span className="hidden sm:inline">·</span>
            <span>No work without your approval</span>
            <span className="hidden sm:inline">·</span>
            <span>Track repairs in your account</span>
          </div>
        </div>
      </section>

      {/* ==================== 5. FINAL CTA SECTION ==================== */}
      <section className="py-28 sm:py-36 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 
              className="font-display text-foreground mb-10 sm:mb-12 font-normal" 
              style={{ 
                fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', 
                lineHeight: '1.1', 
                letterSpacing: '0.01em' 
              }}
            >
              Ready to begin?
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <Link to="/custom">
                <Button 
                  size="lg" 
                  className="bg-foreground text-background hover:bg-foreground/90 font-normal px-10 py-6 text-sm tracking-wide rounded-none min-w-[200px]"
                >
                  Start a Custom Design
                </Button>
              </Link>
              <Button 
                size="lg" 
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
