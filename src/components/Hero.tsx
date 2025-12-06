import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import bannerRing from "@/assets/banner-ring.png";

export const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-luxury-charcoal">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{
        backgroundImage: `url(${bannerRing})`
      }}></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-charcoal/50 to-luxury-charcoal"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white leading-tight animate-fade-in">
            {t('hero.title')}
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t('hero.subtitle')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/repairs">
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-6 text-lg group">
                {t('hero.cta.primary')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/custom">
              <Button size="lg" variant="outline" className="w-full border-2 border-white text-white hover:bg-white hover:text-luxury-charcoal font-semibold px-6 py-6 text-lg">
                {t('hero.cta.custom')}
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="w-full border-2 border-white text-white hover:bg-white hover:text-luxury-charcoal font-semibold px-6 py-6 text-lg">
                {t('hero.cta.shop')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full border-2 border-white/70 text-white/90 hover:bg-white hover:text-luxury-charcoal font-semibold px-6 py-6 text-lg">
                <MapPin className="mr-2 h-5 w-5" />
                {t('hero.cta.secondary')}
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">30+</div>
              <div className="text-sm text-white/70 uppercase tracking-wide">Years</div>
            </div>
            <div className="text-center border-x border-primary/30">
              <div className="text-3xl font-bold text-primary mb-2">Nationwide</div>
              <div className="text-sm text-white/70 uppercase tracking-wide">Mail-In</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Insured</div>
              <div className="text-sm text-white/70 uppercase tracking-wide">Shipping</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};