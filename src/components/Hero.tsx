import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bannerRing from "@/assets/banner-ring.png";
export const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-luxury-charcoal">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{
      backgroundImage: `url(${bannerRing})`
    }}></div>
      
      {/* Gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-luxury-warm"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-luxury-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block animate-fade-in">
            <span className="text-luxury-gold font-medium tracking-wider uppercase text-sm">
              Trusted by New York for Over 30 Years
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white leading-tight animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            Professional Jewelry Repair &{" "}
            <span className="text-luxury-gold">Custom Design</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>
            With master-level skill honed in NYC's Diamond District, we provide expert jewelry repair, custom design, and full restoration services — all completed in-house with precise craftsmanship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>
            <Link to="/repairs">
              <Button size="lg" className="bg-luxury-gold text-luxury-dark hover:bg-luxury-gold-light font-semibold px-8 py-6 text-lg group transition-all hover-scale">
                Get Free Repair Quote
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark font-semibold px-8 py-6 text-lg transition-all hover-scale">
                Shop Collection
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in" style={{
          animationDelay: '0.4s'
        }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-luxury-gold mb-2">30+</div>
              <div className="text-sm text-white/70 uppercase tracking-wide">Years Experience</div>
            </div>
            <div className="text-center border-x border-luxury-gold/30">
              <div className="text-3xl font-bold text-luxury-gold mb-2">In-House</div>
              <div className="text-sm text-white/70 uppercase tracking-wide">All Repairs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-luxury-gold mb-2">Same-Day</div>
              <div className="text-sm text-white/70 uppercase tracking-wide">Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};