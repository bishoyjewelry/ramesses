import { Hero } from "@/components/Hero";
import { ServicesSection } from "@/components/ServicesSection";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Instagram, MessageCircle } from "lucide-react";
import logoMain from "@/assets/logo-main.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ServicesSection />
      <FeaturedWork />
      
      {/* CTA Section */}
      <section className="py-24 bg-luxury-dark text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Contact us today for a free consultation or quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-luxury-gold text-luxury-dark hover:bg-luxury-gold-light font-semibold px-8">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </Link>
            <Link to="/repairs">
              <Button size="lg" variant="outline" className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark font-semibold px-8">
                Request Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-charcoal text-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <img 
                src={logoMain} 
                alt="Ramesses Jewelry" 
                className="h-16 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-muted-foreground">Expert jewelry repair and custom design. Serving NYC for over 30 years.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-luxury-gold">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/repairs" className="block text-muted-foreground hover:text-luxury-gold transition-colors">Repairs</Link>
                <Link to="/custom" className="block text-muted-foreground hover:text-luxury-gold transition-colors">Custom Jewelry</Link>
                <Link to="/shop" className="block text-muted-foreground hover:text-luxury-gold transition-colors">Shop</Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-luxury-gold transition-colors">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-luxury-gold">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-luxury-gold transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-luxury-gold transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-luxury-gold/20 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Ramesses Jewelry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
