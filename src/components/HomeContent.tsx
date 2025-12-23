import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

export const HomeContent = () => {
  const navigate = useNavigate();

  const handleStartRepair = () => {
    navigate("/repairs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ==================== SERVICE ROUTING ==================== */}
      <section className="py-14 sm:py-18 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
            {/* Custom Jewelry & Engagement Rings */}
            <Link 
              to="/custom" 
              className="group block p-10 sm:p-12 bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-border/40 transition-all duration-300"
            >
              <h2 className="font-display text-[1.6rem] sm:text-[1.85rem] text-foreground mb-4 font-normal tracking-tight leading-tight">
                Custom Jewelry & Engagement Rings
              </h2>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                From bespoke engagement rings to one-of-a-kind pieces—designed from scratch, crafted by master jewelers.
              </p>
              <span className="inline-block border border-foreground/30 text-foreground group-hover:bg-foreground group-hover:text-background font-medium px-6 py-3 text-sm tracking-wide transition-all duration-300">
                Start a Custom Design
              </span>
            </Link>

            {/* Repairs */}
            <div 
              onClick={handleStartRepair}
              className="group cursor-pointer block p-10 sm:p-12 bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-border/40 transition-all duration-300"
            >
              <h2 className="font-display text-[1.6rem] sm:text-[1.85rem] text-foreground mb-4 font-normal tracking-tight leading-tight">
                Jewelry Repairs
              </h2>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Expert repairs for rings, chains, and heirloom pieces. Fully insured, handled in NYC's Diamond District.
              </p>
              <span className="inline-block border border-foreground/30 text-foreground group-hover:bg-foreground group-hover:text-background font-medium px-6 py-3 text-sm tracking-wide transition-all duration-300">
                Start a Repair
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DIAMOND DISTRICT CRAFTSMANSHIP ==================== */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            {/* Image */}
            <div className="aspect-[4/5] overflow-hidden bg-secondary/20">
              <img
                src={masterJeweler}
                alt="Master jeweler at work in NYC Diamond District"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Copy */}
            <div className="text-center md:text-left">
              <h2 className="font-display text-foreground mb-6 font-normal text-2xl sm:text-[1.85rem] tracking-tight leading-tight">
                Diamond District Craftsmanship
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
                Every piece that passes through our hands is crafted or restored by a master jeweler with over 40 years on NYC's 47th Street.
              </p>
              <p className="text-muted-foreground/70 text-sm leading-relaxed">
                No outsourcing. No shortcuts. Just decades of precision, passed from bench to bench in the heart of the Diamond District.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== RECENT CUSTOM CREATIONS ==================== */}
      <section className="py-14 sm:py-18 bg-secondary/10">
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

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-14 sm:py-18 bg-background">
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

      {/* ==================== CREATOR MARKETPLACE ==================== */}
      <section className="py-12 sm:py-14 bg-secondary/10">
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
      <section className="py-10 sm:py-12 bg-secondary/20">
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
