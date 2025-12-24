import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import bannerPendant from "@/assets/banner-pendant.png";
import bannerRing from "@/assets/banner-ring.png";
import masterJeweler from "@/assets/master-jeweler.jpg";

// Placeholder creations - replace with dynamic data later
const customCreations = [
  {
    id: 1,
    image: bannerPendant,
    title: "Sapphire Halo Pendant",
  },
  {
    id: 2,
    image: bannerRing,
    title: "Vintage Emerald Ring",
  },
  {
    id: 3,
    image: bannerPendant,
    title: "Custom Diamond Necklace",
  },
];

// Placeholder testimonials - replace with dynamic data later
const testimonials = [
  {
    id: 1,
    quote: "They restored my grandmother's ring exactly how I imagined. The craftsmanship is exceptional.",
    author: "Sarah M.",
    location: "Los Angeles, CA",
  },
  {
    id: 2,
    quote: "From design to delivery, the entire process was seamless. My engagement ring is absolutely perfect.",
    author: "Michael T.",
    location: "Chicago, IL",
  },
  {
    id: 3,
    quote: "I've sent three pieces for repair. Every time, they come back better than new. Truly professional.",
    author: "Jennifer L.",
    location: "Miami, FL",
  },
];

// Reusable section divider component
const SectionDivider = () => (
  <div className="py-6 sm:py-8">
    <div className="max-w-xs mx-auto border-t border-border/30" />
  </div>
);

export const HomeContent = () => {
  return (
    <>
      {/* ==================== SERVICE ROUTING ==================== */}
      <section className="pt-12 sm:pt-16 pb-16 sm:pb-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4 md:gap-5 max-w-4xl mx-auto">
            {/* Custom Jewelry & Engagement Rings - Dominant */}
            <div className="p-10 sm:p-14 bg-secondary/40 border border-border/30">
              <h2 className="font-display text-[1.75rem] sm:text-[2.1rem] text-foreground mb-5 font-normal tracking-tight leading-[1.1]">
                Custom Jewelry & Engagement Rings
              </h2>
              <p className="text-muted-foreground text-sm mb-10">
                Designed from scratch by a 47th Street master jeweler.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/custom"
                  className="inline-block bg-foreground text-background font-medium px-7 py-3.5 text-sm tracking-wide text-center
                    hover:bg-foreground/85 focus:outline-none focus:ring-2 focus:ring-foreground/50 focus:ring-offset-2 focus:ring-offset-background
                    active:scale-[0.98] active:shadow-sm transition-all duration-150"
                >
                  Start a Custom Design
                </Link>
                <Link 
                  to="/engagement-rings"
                  className="inline-block bg-foreground text-background font-medium px-7 py-3.5 text-sm tracking-wide text-center
                    hover:bg-foreground/85 focus:outline-none focus:ring-2 focus:ring-foreground/50 focus:ring-offset-2 focus:ring-offset-background
                    active:scale-[0.98] active:shadow-sm transition-all duration-150"
                >
                  Design an Engagement Ring
                </Link>
              </div>
            </div>

            {/* Repairs - Parallel but quieter */}
            <div className="p-10 sm:p-14 bg-secondary/25 border border-border/20">
              <h2 className="font-display text-[1.5rem] sm:text-[1.75rem] text-foreground mb-5 font-normal tracking-tight leading-[1.15]">
                Jewelry Repairs
              </h2>
              <p className="text-muted-foreground text-sm mb-10">
                Nationwide service, fully insured, handled in NYC.
              </p>
              <Link 
                to="/repairs"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-block bg-foreground text-background font-medium px-7 py-3.5 text-sm tracking-wide
                  hover:bg-foreground/85 focus:outline-none focus:ring-2 focus:ring-foreground/50 focus:ring-offset-2 focus:ring-offset-background
                  active:scale-[0.98] active:shadow-sm transition-all duration-150"
              >
                Start Repairs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ==================== DIAMOND DISTRICT CRAFTSMANSHIP ==================== */}
      <section className="pt-8 sm:pt-12 pb-20 sm:pb-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-16 items-center">
            {/* Image - carries the weight */}
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={masterJeweler}
                alt="Master jeweler crafting jewelry at the bench in NYC's Diamond District"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Copy - minimal, trust-anchoring */}
            <div className="md:pr-4">
              <h2 className="font-display text-foreground mb-8 font-normal text-[1.65rem] sm:text-[2rem] tracking-tight leading-[1.15]">
                Diamond District Craftsmanship
              </h2>
              <p className="text-muted-foreground text-[15px] sm:text-base leading-relaxed">
                Every piece is crafted or restored by the same hands that have worked New York's Diamond District for over four decades.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ==================== RECENT CUSTOM CREATIONS ==================== */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-center text-foreground mb-10 sm:mb-12 font-normal text-xl sm:text-2xl tracking-tight">
              Recent Custom Creations
            </h2>
            
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-0">
                {customCreations.map((creation) => (
                  <CarouselItem key={creation.id} className="pl-0">
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-md aspect-square bg-secondary/20 overflow-hidden">
                        <img
                          src={creation.image}
                          alt={creation.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-6 text-muted-foreground text-sm tracking-wide">
                        {creation.title}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 sm:-left-4 bg-background/80 hover:bg-background border-border/40" />
              <CarouselNext className="right-0 sm:-right-4 bg-background/80 hover:bg-background border-border/40" />
            </Carousel>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-0">
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="pl-0">
                    <div className="text-center px-4 sm:px-8">
                      <blockquote className="font-display text-foreground text-lg sm:text-xl md:text-2xl font-normal leading-relaxed mb-8 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <p className="text-foreground text-sm font-medium tracking-wide">
                          {testimonial.author}
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 sm:-left-8 bg-background/80 hover:bg-background border-border/40" />
              <CarouselNext className="right-0 sm:-right-8 bg-background/80 hover:bg-background border-border/40" />
            </Carousel>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ==================== CREATOR MARKETPLACE ==================== */}
      <section className="py-14 sm:py-18 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-4">
              Coming Soon
            </span>
            <h2 className="font-display text-foreground mb-3 font-normal text-lg sm:text-xl tracking-tight">
              Creator Marketplace
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Shop exclusive designs from independent jewelry creators, crafted and fulfilled by Ramesses.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== AUTHORITY BAND ==================== */}
      <section className="py-12 sm:py-16 bg-secondary/10 border-t border-border/20">
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
    </>
  );
};
