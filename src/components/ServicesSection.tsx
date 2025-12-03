import { Wrench, Sparkles, ShoppingBag, Link as LinkIcon, Gem, Zap, Watch, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Expert Repairs",
    description: "Ring resizing, chain repair, clasp replacement, stone setting, laser welding, and full restoration. Free quotes available.",
    link: "/repairs",
  },
  {
    icon: Sparkles,
    title: "Custom Jewelry",
    description: "From engagement rings to one-of-a-kind pieces, we create custom jewelry using CAD modeling + handcrafted finishing.",
    link: "/custom",
  },
  {
    icon: ShoppingBag,
    title: "Fine Jewelry",
    description: "Curated collection of gold and silver jewelry. Chains, pendants, rings, and exclusive ready-to-wear pieces.",
    link: "/shop",
  },
];

const repairServices = [
  "Ring resizing (up or down)",
  "Chain and bracelet repair",
  "Clasp repair & replacement",
  "Diamond and gemstone setting",
  "Stone replacement",
  "Precision laser jewelry repair",
  "Jewelry polishing & restoration",
  "Watch battery & link adjustments",
  "Nationwide mail-in available",
];

const trustReasons = [
  "30+ years of master jeweler experience",
  "All repairs done in-house — never outsourced",
  "Fast turnaround (same-day for many repairs)",
  "Laser welding technology for clean results",
  "Transparent, honest pricing",
  "Spanish-speaking service available",
  "Diamond District quality without the hassle",
];

export const ServicesSection = () => {
  return (
    <section className="py-24 bg-luxury-warm relative">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-luxury-warm to-transparent"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-luxury-dark">
            Our Jewelry Repair Services
          </h2>
          <p className="text-xl text-luxury-dark/70 max-w-3xl mx-auto">
            If you're searching for jewelry repair near me, you're in the right place. Expert repairs completed in-house with precise craftsmanship.
          </p>
        </div>

        {/* Main Services Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link key={index} to={service.link}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-luxury-gold/20 bg-card group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-6 group-hover:bg-luxury-gold/20 transition-colors">
                      <Icon className="h-8 w-8 text-luxury-gold" />
                    </div>
                    <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground group-hover:text-luxury-gold transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Repair Services List */}
        <div className="grid md:grid-cols-2 gap-16 items-start mb-20">
          <div>
            <h3 className="text-3xl font-serif font-bold mb-6 text-luxury-dark">
              Complete Repair Services
            </h3>
            <div className="grid gap-3">
              {repairServices.map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-luxury-gold/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-luxury-gold" />
                  </div>
                  <span className="text-luxury-dark/80">{service}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-serif font-bold mb-6 text-luxury-dark">
              Why Clients Trust Us
            </h3>
            <div className="grid gap-3">
              {trustReasons.map((reason, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-luxury-gold/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-luxury-gold" />
                  </div>
                  <span className="text-luxury-dark/80">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
