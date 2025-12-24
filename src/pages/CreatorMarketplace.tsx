import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

const CreatorMarketplace = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground mb-6">
              Creator Marketplace
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
              A curated selection of jewelry designs created by the Ramesses community, 
              each piece handcrafted by our master jewelers.
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
          ) : designs && designs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {designs.map((design) => (
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
                    <p className="text-sm text-muted-foreground/70">
                      Designed by {design.creator_profiles?.display_name || "Ramesses"}
                    </p>
                    <Link to={`/contact?design=${design.slug}`}>
                      <Button
                        size="sm"
                        className="mt-3 bg-primary text-primary-foreground hover:bg-[hsl(var(--color-gold-hover))] rounded-sm text-xs tracking-widest uppercase"
                      >
                        Order This Design
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground/70 text-lg mb-2">
                New designs coming soon.
              </p>
              <p className="text-muted-foreground/50 text-sm">
                Our creators are working on exciting new pieces.
              </p>
            </div>
          )}
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

      <Footer />
    </div>
  );
};

export default CreatorMarketplace;
