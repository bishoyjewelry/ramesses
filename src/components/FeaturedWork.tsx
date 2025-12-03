import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import bannerRing from "@/assets/banner-ring.png";
import bannerPendant from "@/assets/banner-pendant.png";
export const FeaturedWork = () => {
  return <section className="py-24 bg-background relative">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-luxury-warm to-transparent"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-luxury-dark">
            Featured <span className="text-luxury-gold">Work</span>
          </h2>
          <p className="text-xl text-luxury-dark/70 max-w-2xl mx-auto">
            Exquisite craftsmanship in every detail
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-luxury-gold/20 overflow-hidden group hover:border-luxury-gold/40 transition-all">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={bannerRing} alt="Custom Diamond Engagement Ring" className="w-full h-full group-hover:scale-105 transition-transform duration-500 object-scale-down" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-2xl font-serif font-semibold mb-2 text-luxury-gold">
                Custom Engagement Rings
              </h3>
              <p className="text-muted-foreground">
                Handcrafted with premium diamonds and precious metals.
              </p>
            </CardContent>
          </Card>

          <Card className="border-luxury-gold/20 overflow-hidden group hover:border-luxury-gold/40 transition-all">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={bannerPendant} alt="Elegant Gemstone Pendant" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-2xl font-serif font-semibold mb-2 text-luxury-gold">
                Elegant Pendants
              </h3>
              <p className="text-muted-foreground">
                Stunning gemstone pendants designed for timeless beauty.
              </p>
            </CardContent>
          </Card>

          <Card className="border-luxury-gold/20 overflow-hidden group hover:border-luxury-gold/40 transition-all">
            <div className="relative aspect-[4/3] overflow-hidden bg-luxury-charcoal/5 flex items-center justify-center">
              <div className="text-center p-6">
                <Sparkles className="h-16 w-16 text-luxury-gold/40 mx-auto mb-4" />
                <span className="text-luxury-dark/40 text-sm">Custom Design Photo</span>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-2xl font-serif font-semibold mb-2 text-luxury-gold">
                Custom Creations
              </h3>
              <p className="text-muted-foreground">
                One-of-a-kind pieces tailored to your vision.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};