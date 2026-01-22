import { Navigation } from "@/components/Navigation";
import { ShippingBanner } from "@/components/ShippingBanner";
import { Hero } from "@/components/Hero";
import { HomeContent } from "@/components/HomeContent";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header container with banner + navigation */}
      <div className="sticky top-0 z-50">
        <ShippingBanner />
        <Navigation />
      </div>
      
      <main>
        <Hero />
        <HomeContent />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
