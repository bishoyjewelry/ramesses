import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { ShippingBanner } from "@/components/ShippingBanner";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DesignOrderModal } from "@/components/DesignOrderModal";
import { CustomizeDesignModal } from "@/components/CustomizeDesignModal";
import { Clock, Truck } from "lucide-react";
import bannerRing from "@/assets/banner-ring.png";
import bannerPendant from "@/assets/banner-pendant.png";

interface DesignWithCreator {
  id: string;
  title: string;
  description: string | null;
  main_image_url: string;
  slug: string;
  creator_profiles: {
    display_name: string;
  };
}

// Curated designs to show when no real designs exist
const curatedDesigns: (DesignWithCreator & { startingPrice: number })[] = [
  {
    id: "curated-1",
    title: "Vintage Rose Halo Ring",
    description: "Rose gold with diamond halo",
    main_image_url: bannerRing,
    slug: "vintage-rose-halo",
    creator_profiles: { display_name: "Sarah M." },
    startingPrice: 3500,
  },
  {
    id: "curated-2",
    title: "Modern Solitaire Band",
    description: "Minimalist platinum design",
    main_image_url: bannerPendant,
    slug: "modern-solitaire",
    creator_profiles: { display_name: "Michael T." },
    startingPrice: 2500,
  },
  {
    id: "curated-3",
    title: "Art Deco Emerald Ring",
    description: "Inspired by 1920s glamour",
    main_image_url: bannerRing,
    slug: "art-deco-emerald",
    creator_profiles: { display_name: "Jennifer L." },
    startingPrice: 4500,
  },
  {
    id: "curated-4",
    title: "Three-Stone Anniversary",
    description: "Past, present, future",
    main_image_url: bannerPendant,
    slug: "three-stone-anniversary",
    creator_profiles: { display_name: "David K." },
    startingPrice: 3500,
  },
  {
    id: "curated-5",
    title: "Twisted Vine Band",
    description: "Nature-inspired white gold",
    main_image_url: bannerRing,
    slug: "twisted-vine",
    creator_profiles: { display_name: "Emma R." },
    startingPrice: 1500,
  },
  {
    id: "curated-6",
    title: "Cathedral Setting Classic",
    description: "Timeless elegance",
    main_image_url: bannerPendant,
    slug: "cathedral-classic",
    creator_profiles: { display_name: "James W." },
    startingPrice: 2500,
  },
];

// Price mapping based on design complexity
const getStartingPrice = (title: string): number => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('solitaire') || titleLower.includes('band') || titleLower.includes('simple')) {
    return 1500;
  }
  if (titleLower.includes('three-stone') || titleLower.includes('halo') || titleLower.includes('cathedral')) {
    return 3500;
  }
  if (titleLower.includes('vintage') || titleLower.includes('art deco') || titleLower.includes('complex')) {
    return 4500;
  }
  return 2500;
};

const CreatorMarketplace = () => {
  const [selectedDesign, setSelectedDesign] = useState<(DesignWithCreator & { startingPrice: number }) | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [selectedDesignForCustomize, setSelectedDesignForCustomize] = useState<(DesignWithCreator & { startingPrice: number }) | null>(null);

  const { data: designs, isLoading } = useQuery({
    queryKey: ["marketplace-designs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("designs")
        .select(`
          id,
          title,
          description,
          main_image_url,
          slug,
          creator_profiles (
            display_name
          )
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DesignWithCreator[];
    },
  });

  // Use real designs if they exist, otherwise show curated designs
  const displayDesigns = designs && designs.length > 0 
    ? designs.map(d => ({ ...d, startingPrice: getStartingPrice(d.title) }))
    : curatedDesigns;

  const handleOrderClick = (design: DesignWithCreator & { startingPrice: number }) => {
    setSelectedDesign(design);
    setIsOrderModalOpen(true);
  };

  const handleCustomizeClick = (design: DesignWithCreator & { startingPrice: number }) => {
    setSelectedDesignForCustomize(design);
    setIsCustomizeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header container with banner + navigation */}
      <div className="sticky top-0 z-50">
        <ShippingBanner />
        <Navigation />
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-16 sm:pt-20 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground mb-6">
              Design Ideas
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Get inspired by these designs. Order as shown or customize to make it uniquely yours.
            </p>
          </div>
        </div>
      </section>

      {/* Designs Grid */}
      <section className="pb-20 sm:pb-28">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-sm" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {displayDesigns.map((design) => (
                <div key={design.id} className="group">
                  <div className="aspect-square overflow-hidden rounded-sm bg-muted mb-4">
                    <img
                      src={design.main_image_url}
                      alt={design.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg text-foreground">
                      {design.title}
                    </h3>
                    {design.description && (
                      <p className="text-sm text-muted-foreground/60">
                        {design.description}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground/70">
                      Designed by {design.creator_profiles?.display_name || "Ramesses"}
                    </p>
                    
                    {/* Price & Turnaround */}
                    <div className="pt-2 space-y-1">
                      <p className="text-primary font-medium">
                        Starting at ${design.startingPrice.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                        <Clock className="w-3 h-3" />
                        <span>Made to order • Ready in ~1 week</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3">
                      <Button
                        size="sm"
                        onClick={() => handleOrderClick(design)}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-[hsl(var(--color-gold-hover))] rounded-sm text-xs tracking-widest uppercase"
                      >
                        Order This Design
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCustomizeClick(design)}
                        className="flex-1 border-primary text-primary hover:bg-primary/5 rounded-sm text-xs tracking-widest uppercase"
                      >
                        Customize
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Elements */}
      <section className="pb-16 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground/70">
              <span className="flex items-center gap-1.5">
                ✓ Handcrafted in NYC
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                Free Insured Shipping
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                1 Week Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Context */}
      <section className="pb-24 sm:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground/70 text-base sm:text-lg">
              Each design can be ordered as-is or customized further to match your vision.
            </p>
          </div>
        </div>
      </section>

      {/* Order Modal */}
      {selectedDesign && (
        <DesignOrderModal
          design={selectedDesign}
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedDesign(null);
          }}
        />
      )}

      {/* Customize Modal */}
      <CustomizeDesignModal
        design={selectedDesignForCustomize}
        isOpen={isCustomizeModalOpen}
        onClose={() => {
          setIsCustomizeModalOpen(false);
          setSelectedDesignForCustomize(null);
        }}
      />

      <Footer />
    </div>
  );
};

export default CreatorMarketplace;
