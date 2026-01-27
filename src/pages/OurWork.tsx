import { Navigation } from "@/components/Navigation";
import { ShippingBanner } from "@/components/ShippingBanner";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Placeholder data - replace with real images later
const portfolioItems = {
  engagementRings: [
    {
      id: 1,
      title: "Classic Solitaire",
      description: "2ct round diamond in platinum setting",
      category: "Engagement Rings",
    },
    {
      id: 2,
      title: "Vintage Halo",
      description: "Cushion cut with diamond halo in rose gold",
      category: "Engagement Rings",
    },
    {
      id: 3,
      title: "Three Stone Anniversary",
      description: "Past, present, future design in white gold",
      category: "Engagement Rings",
    },
  ],
  customPieces: [
    {
      id: 4,
      title: "Custom Pendant",
      description: "Family heirloom diamonds reset into modern pendant",
      category: "Custom Pieces",
    },
    {
      id: 5,
      title: "Sapphire Earrings",
      description: "Matching Ceylon sapphires with diamond accents",
      category: "Custom Pieces",
    },
    {
      id: 6,
      title: "Men's Wedding Band",
      description: "Hammered 18k gold with hidden sapphire",
      category: "Custom Pieces",
    },
  ],
  restorations: [
    {
      id: 7,
      title: "Grandmother's Ring Restored",
      description: "Art deco ring brought back to original glory",
      category: "Restorations",
    },
    {
      id: 8,
      title: "Antique Brooch Repair",
      description: "Victorian brooch with replaced clasp and cleaned stones",
      category: "Restorations",
    },
    {
      id: 9,
      title: "Ring Resize & Refinish",
      description: "Resized and polished to look brand new",
      category: "Restorations",
    },
  ],
};

const OurWork = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header container with banner + navigation */}
      <div className="sticky top-0 z-50">
        <ShippingBanner />
        <Navigation />
      </div>

      <main>
        {/* Hero Section */}
        <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground mb-6">
                Our Work
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Four decades of craftsmanship. Every piece tells a story.
              </p>
            </div>
          </div>
        </section>

        {/* Intro Text */}
        <section className="pb-12 sm:pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-muted-foreground/70 text-base sm:text-lg leading-relaxed">
                From engagement rings that mark life's biggest moments to delicate restorations
                that preserve family heirlooms, each piece is handcrafted with care in NYC's
                Diamond District. Here's a glimpse of what we do.
              </p>
            </div>
          </div>
        </section>

        {/* Engagement Rings Section */}
        <section className="pb-16 sm:pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3 text-center">
                Engagement Rings
              </h2>
              <p className="text-muted-foreground/60 text-center mb-10 max-w-xl mx-auto">
                Custom engagement rings designed and crafted for our clients
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioItems.engagementRings.map((item) => (
                  <div key={item.id} className="group">
                    <div className="aspect-square overflow-hidden rounded-sm bg-muted mb-4 flex items-center justify-center">
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

        {/* Custom Pieces Section */}
        <section className="pb-16 sm:pb-20 bg-secondary/20">
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3 text-center">
                Custom Pieces
              </h2>
              <p className="text-muted-foreground/60 text-center mb-10 max-w-xl mx-auto">
                One-of-a-kind creations brought to life from our clients' visions
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioItems.customPieces.map((item) => (
                  <div key={item.id} className="group">
                    <div className="aspect-square overflow-hidden rounded-sm bg-muted mb-4 flex items-center justify-center">
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

        {/* Restorations Section */}
        <section className="pb-16 sm:pb-20">
          <div className="container mx-auto px-4 pt-16 sm:pt-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3 text-center">
                Restorations
              </h2>
              <p className="text-muted-foreground/60 text-center mb-10 max-w-xl mx-auto">
                Bringing treasured pieces back to life
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioItems.restorations.map((item) => (
                  <div key={item.id} className="group">
                    <div className="aspect-square overflow-hidden rounded-sm bg-muted mb-4 flex items-center justify-center">
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

        {/* CTA Section */}
        <section className="pb-24 sm:pb-32">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
                Ready to Create Something Beautiful?
              </h2>
              <p className="text-muted-foreground/70 mb-8">
                Whether you have a clear vision or just the beginning of an idea,
                we're here to help bring it to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-[hsl(var(--color-gold-hover))]">
                  <Link to="/custom">Start Your Design</Link>
                </Button>
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OurWork;
