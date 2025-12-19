import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HomeContent } from "@/components/HomeContent";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
