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
      <section className="relative min-h-[70vh] sm:min-h-[75vh] flex items-center justify-center bg-background pt-20 sm:pt-24">
        <div className="container mx-auto px-4 py-28 sm:py-36">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-display text-foreground mb-6 sm:mb-8 font-normal text-5xl sm:text-6xl tracking-tight">
              Custom Jewelry & Repairs
            </h1>
            
            <p className="text-base sm:text-subhead text-muted-foreground/70 mb-14 sm:mb-16 font-normal tracking-wide">
              Handled in New York's Diamond District
            </p>
            
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
                className="text-muted-foreground hover:text-foreground hover:bg-transparent font-medium px-6 py-6 text-button tracking-wide"
              >
                Mail-In Repair
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. QUIET CREDIBILITY STRIP ==================== */}
      <section className="py-8 sm:py-10 bg-background">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground/50 tracking-wide font-normal">
            Master jewelers crafting and restoring fine jewelry on NYC's 47th Street — serving clients nationwide.
          </p>
        </div>
      </section>
    </>
  );
};
