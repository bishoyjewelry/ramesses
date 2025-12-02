import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-luxury-dark">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark via-luxury-charcoal to-luxury-dark opacity-90"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-luxury-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <span className="text-luxury-gold font-medium tracking-wider uppercase text-sm">
              Master Jewelers Since 1993
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-foreground leading-tight">
            Expert Jewelry Repair &{" "}
            <span className="text-luxury-gold">Custom Design</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            30 years of craftsmanship excellence. Transform your vision into timeless pieces or restore your treasured jewelry to perfection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/repairs">
              <Button 
                size="lg" 
                className="bg-luxury-gold text-luxury-dark hover:bg-luxury-gold-light font-semibold px-8 py-6 text-lg group"
              >
                Get Free Repair Quote
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button 
                size="lg" 
                variant="outline"
                className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark font-semibold px-8 py-6 text-lg"
              >
                Shop Collection
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-luxury-gold mb-2">30+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Years Experience</div>
            </div>
            <div className="text-center border-x border-luxury-gold/20">
              <div className="text-3xl font-bold text-luxury-gold mb-2">5000+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Repairs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-luxury-gold mb-2">100%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
