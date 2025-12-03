import { Wrench, Sparkles, ShoppingBag, Link as LinkIcon, Gem, Zap, Watch, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Expert Repairs",
    description: "Ring resizing, chain repair, clasp replacement, prong repair, stone setting, laser welding, and full restoration. Free quotes and fast turnaround available.",
    link: "/repairs",
  },
  {
    icon: Sparkles,
    title: "Custom Jewelry",
    description: "Engagement rings, custom designs, one-of-a-kind pieces. CAD modeling + handcrafted finishing for perfect precision.",
    link: "/custom",
  },
  {
    icon: ShoppingBag,
    title: "Fine Jewelry",
    description: "Curated gold and silver jewelry—chains, pendants, rings, and ready-to-wear pieces available in-store and online.",
    link: "/shop",
  },
];

const repairServicesColumns = [
  ["Bracelet Repair", "Chain Repair", "Chain Soldering", "Necklace Repair", "Earring Repair", "Jewelry Cleaning", "Jewelry Engraving"],
  ["Jewelry Finishing", "Jewelry Mounting", "Metal Polishing", "Jewelry Polishing", "Pearl & Bead Restringing", "Ring Repair", "Ring Sizing"],
  ["Silver Jewelry Repair", "Platinum Jewelry Repair", "Hollow Bangle Bracelet Repair", "Stone Setting", "Stone Replacement", "Watch Repair", "Advanced Laser Welding"],
];

const trustReasons = [
  "30+ years of master jeweler experience",
  "All repairs done in-house — never outsourced",
  "Fast turnaround, often same day",
  "Transparent, honest pricing",
  "Diamond District quality without the hassle",
  "Laser welding technology for clean, strong results",
  "Spanish-speaking service available",
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
        <div className="mb-20">
          <h3 className="text-3xl font-serif font-bold mb-2 text-luxury-dark text-center">
            Our Detailed Repair Services
          </h3>
          <p className="text-luxury-dark/70 text-center mb-8 max-w-2xl mx-auto">
            Comprehensive in-house jewelry repair backed by 30+ years of master craftsmanship.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {repairServicesColumns.map((column, colIndex) => (
              <div key={colIndex} className="grid gap-2">
                {column.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-luxury-gold/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-luxury-gold" />
                    </div>
                    <span className="text-luxury-dark/80 text-sm">{service}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Why Clients Trust Us */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-serif font-bold mb-6 text-luxury-dark text-center">
            Why Clients Trust Us
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
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
    </section>
  );
};
