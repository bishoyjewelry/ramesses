import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";
import bannerPendant from "@/assets/banner-pendant.png";
import bannerRing from "@/assets/banner-ring.png";
import masterJeweler from "@/assets/master-jeweler.jpg";

// Featured community designs for Inspiration Gallery preview
const featuredDesigns = [
  { id: 1, image: bannerRing, title: "Vintage Emerald Ring", creator: "Sarah M." },
  { id: 2, image: bannerPendant, title: "Sapphire Halo Pendant", creator: "Michael T." },
  { id: 3, image: bannerRing, title: "Art Deco Diamond Ring", creator: "Jennifer L." },
];

// Placeholder creations - replace with dynamic data later
const customCreations = [{
  id: 1,
  image: bannerPendant,
  title: "Sapphire Halo Pendant"
}, {
  id: 2,
  image: bannerRing,
  title: "Vintage Emerald Ring"
}, {
  id: 3,
  image: bannerPendant,
  title: "Custom Diamond Necklace"
}];

// Placeholder testimonials - replace with dynamic data later
const testimonials = [{
  id: 1,
  quote: "They restored my grandmother's ring exactly how I imagined. The craftsmanship is exceptional.",
  author: "Sarah M.",
  location: "Los Angeles, CA"
}, {
  id: 2,
  quote: "From design to delivery, the entire process was seamless. My engagement ring is absolutely perfect.",
  author: "Michael T.",
  location: "Chicago, IL"
}, {
  id: 3,
  quote: "I've sent three pieces for repair. Every time, they come back better than new. Truly professional.",
  author: "Jennifer L.",
  location: "Miami, FL"
}];
export const HomeContent = () => {
  return <>
      {/* ==================== SERVICE ROUTING ==================== */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4 md:gap-5 max-w-4xl mx-auto">
            {/* Custom Jewelry & Engagement Rings - Dominant */}
            <div className="p-10 sm:p-14 bg-background border border-border/30">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 font-normal tracking-tight leading-tight">
                Custom Jewelry & Engagement Rings
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Designed from scratch by a 47th Street master jeweler.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/custom" className="inline-block bg-primary text-primary-foreground font-medium px-7 py-3.5 text-sm tracking-wide text-center
                    hover:bg-[hsl(var(--color-gold-hover))] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
                    active:scale-[0.98] active:shadow-sm transition-all duration-150">
                  Start a Custom Design
                </Link>
                <Link to="/engagement-rings" className="inline-block bg-primary text-primary-foreground font-medium px-7 py-3.5 text-sm tracking-wide text-center
                    hover:bg-[hsl(var(--color-gold-hover))] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
                    active:scale-[0.98] active:shadow-sm transition-all duration-150">
                  Design an Engagement Ring
                </Link>
              </div>
            </div>

            {/* Repairs - Parallel but quieter */}
            <div className="p-10 sm:p-14 bg-background border border-border/20">
              <h2 className="font-display text-xl md:text-2xl text-foreground mb-4 font-normal tracking-tight leading-tight">
                Jewelry Repairs
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Nationwide service, fully insured, handled in NYC.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/repairs" onClick={() => window.scrollTo({
                top: 0,
                behavior: "smooth"
              })} className="inline-block bg-primary text-primary-foreground font-medium px-7 py-3.5 text-sm tracking-wide text-center
                    hover:bg-[hsl(var(--color-gold-hover))] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
                    active:scale-[0.98] active:shadow-sm transition-all duration-150">
                  Start Repairs
                </Link>
                <Link to="/repairs" className="inline-block border border-primary text-primary font-medium px-7 py-3.5 text-sm tracking-wide text-center
                    hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
                    active:scale-[0.98] active:shadow-sm transition-all duration-150">
                  View Services & Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DIAMOND DISTRICT CRAFTSMANSHIP ==================== */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-16 items-center">
            {/* Image - carries the weight */}
            <div className="aspect-[4/5] overflow-hidden">
              <img src={masterJeweler} alt="Master jeweler crafting jewelry at the bench in NYC's Diamond District" className="w-full h-full object-cover" />
            </div>
            
            {/* Copy - minimal, trust-anchoring */}
            <div className="md:pr-4">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6 font-normal tracking-tight leading-tight">
                Diamond District Craftsmanship
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-prose">
                With over four decades at the bench, Ramses’s journey began at age 12 in Egypt and led him to New York City, where he refined his craft working with Tiffany & Co. For the past 30 years, he has served generations of clients—many of whom still return year after year. From young couples creating their first engagement ring to high-end collectors seeking one-of-a-kind pieces, his work is built on trust, precision, and care. He sees himself as a skilled craftsman—but his customers see an artist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== RECENT CUSTOM CREATIONS ==================== */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-center text-foreground mb-10 sm:mb-12 font-normal text-xl sm:text-2xl tracking-tight">
              Recent Custom Creations
            </h2>
            
            <Carousel opts={{
            align: "center",
            loop: true
          }} className="w-full">
              <CarouselContent className="-ml-0">
                {customCreations.map(creation => <CarouselItem key={creation.id} className="pl-0">
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-md aspect-square bg-background overflow-hidden">
                        <img src={creation.image} alt={creation.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="mt-6 text-muted-foreground text-sm tracking-wide">
                        {creation.title}
                      </p>
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="left-0 sm:-left-4 bg-background/80 hover:bg-background border-border/40" />
              <CarouselNext className="right-0 sm:-right-4 bg-background/80 hover:bg-background border-border/40" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* ==================== DESIGN IDEAS PREVIEW ==================== */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 font-normal tracking-tight leading-tight">
              Design Ideas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stunning designs ready to be crafted. Order as shown or customize to make it yours.
            </p>
          </div>
          
          {/* Featured Design Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            {featuredDesigns.map((design) => (
              <Link
                key={design.id}
                to="/design-ideas"
                className="group block"
              >
                <div className="aspect-square overflow-hidden bg-secondary/30 border border-border/30 mb-3">
                  <img 
                    src={design.image} 
                    alt={design.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <h3 className="text-foreground font-medium text-sm group-hover:text-primary transition-colors">
                  {design.title}
                </h3>
                <p className="text-muted-foreground text-xs">
                  by {design.creator}
                </p>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/design-ideas"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-8 py-3.5 text-sm tracking-wide
                hover:bg-[hsl(var(--color-gold-hover))] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
                active:scale-[0.98] active:shadow-sm transition-all duration-150"
            >
              View All Designs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Carousel opts={{
            align: "center",
            loop: true
          }} className="w-full">
              <CarouselContent className="-ml-0">
                {testimonials.map(testimonial => <CarouselItem key={testimonial.id} className="pl-0">
                    <div className="text-center px-6 sm:px-12 py-4">
                      <blockquote className="font-display text-foreground text-xl md:text-2xl font-normal leading-relaxed mb-10 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <p className="text-foreground text-sm font-semibold tracking-wide">
                          {testimonial.author}
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="left-0 sm:-left-8 bg-background/80 hover:bg-background border-border/40" />
              <CarouselNext className="right-0 sm:-right-8 bg-background/80 hover:bg-background border-border/40" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* ==================== AUTHORITY BAND ==================== */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-foreground/80 text-sm sm:text-base font-normal leading-relaxed">
              Crafted and restored by master jewelers on NYC's 47th Street.
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Serving clients nationwide with fully insured service.
            </p>
          </div>
        </div>
      </section>
    </>;
};