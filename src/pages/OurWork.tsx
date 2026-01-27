import { Navigation } from "@/components/Navigation";
import { ShippingBanner } from "@/components/ShippingBanner";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Placeholder data - replace with real images later
const portfolioItems = [
  { id: 1, title: "Classic Solitaire", description: "2ct round diamond in platinum" },
  { id: 2, title: "Vintage Halo Ring", description: "Cushion cut with rose gold setting" },
  { id: 3, title: "Three Stone Ring", description: "Past, present, future in white gold" },
  { id: 4, title: "Sapphire Pendant", description: "Ceylon sapphire with diamond halo" },
  { id: 5, title: "Custom Earrings", description: "Matching diamond drops" },
  { id: 6, title: "Men's Wedding Band", description: "Hammered 18k gold" },
  { id: 7, title: "Oval Engagement Ring", description: "1.5ct oval in yellow gold" },
  { id: 8, title: "Emerald Cut Solitaire", description: "Step-cut elegance in platinum" },
  { id: 9, title: "Pear Shaped Halo", description: "Delicate pear with pavé band" },
  { id: 10, title: "Ruby Anniversary Ring", description: "Burma ruby with diamond accents" },
  { id: 11, title: "Tennis Bracelet", description: "5ct total weight diamond line" },
  { id: 12, title: "Pearl Necklace Clasp", description: "Custom diamond clasp for heirloom pearls" },
  { id: 13, title: "Marquise Vintage Ring", description: "Art deco inspired design" },
  { id: 14, title: "Bezel Set Band", description: "Modern flush-set diamonds" },
  { id: 15, title: "Eternity Band", description: "Full circle of brilliance" },
  { id: 16, title: "Custom Cufflinks", description: "Monogrammed gold cufflinks" },
  { id: 17, title: "Heart Pendant", description: "Diamond heart on delicate chain" },
  { id: 18, title: "Princess Cut Ring", description: "Cathedral setting in white gold" },
  { id: 19, title: "Stackable Rings Set", description: "Three complementary bands" },
  { id: 20, title: "Aquamarine Cocktail Ring", description: "8ct aquamarine statement piece" },
];

const OurWork = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header container with banner + navigation */}
      <div className="sticky top-0 z-50">
        <ShippingBanner />
        <Navigation />
      </div>

      <main>
        {/* Header */}
        <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground mb-6">
                Our Work
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Four decades of craftsmanship from NYC's Diamond District
              </p>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="pb-20 sm:pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="group">
                    <div className="aspect-square overflow-hidden rounded-sm bg-muted mb-4 flex items-center justify-center">
                      {/* Placeholder - replace with real images later */}
                      <span className="text-muted-foreground/40 text-sm">
                        Photo Coming Soon
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground/60 mt-1">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 sm:pb-32 bg-secondary/20">
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
                Ready to Create Something Beautiful?
              </h2>
              <p className="text-muted-foreground/70 mb-8">
                Let's bring your vision to life.
              </p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-[hsl(var(--color-gold-hover))]">
                <Link to="/custom">Start Your Design</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OurWork;
