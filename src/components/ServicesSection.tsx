import { Wrench, Sparkles, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Wrench,
    title: "Expert Repairs",
    description: "Ring resizing, prong repair, stone replacement, chain repair, laser welding, and more. Free quotes available.",
    link: "/repairs",
  },
  {
    icon: Sparkles,
    title: "Custom Jewelry",
    description: "Transform your vision into reality. Custom engagement rings, pendants, and nameplates crafted by master jewelers.",
    link: "/custom",
  },
  {
    icon: ShoppingBag,
    title: "Fine Jewelry",
    description: "Curated collection of gold and silver jewelry. Chains, pendants, rings, and exclusive ready-to-wear pieces.",
    link: "/shop",
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive jewelry services backed by three decades of expertise
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
      </div>
    </section>
  );
};
