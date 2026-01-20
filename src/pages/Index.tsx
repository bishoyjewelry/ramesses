import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HomeContent } from "@/components/HomeContent";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Free Shipping Banner */}
      <div className="bg-foreground text-background text-center py-2 text-sm">
        <span className="text-primary">✦</span> Free Insured Shipping on All Orders <span className="text-primary">✦</span>
      </div>
      
      <Navigation />
      <main>
        <Hero />
        <HomeContent />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
