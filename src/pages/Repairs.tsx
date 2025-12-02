import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const services = [
  { name: "Ring Resizing", price: "From $50" },
  { name: "Prong Repair", price: "From $40" },
  { name: "Stone Replacement", price: "Custom Quote" },
  { name: "Chain Repair", price: "From $30" },
  { name: "Laser Welding", price: "From $60" },
  { name: "Engraving", price: "From $25" },
  { name: "Polishing & Rhodium", price: "From $45" },
  { name: "Bangle Repair", price: "From $55" },
];

const Repairs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Quote request received! We'll contact you soon.");
    setFormData({ name: "", email: "", phone: "", service: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      
      <section className="pt-32 pb-16 bg-gradient-to-b from-luxury-charcoal via-luxury-charcoal to-luxury-warm text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-white">
            Expert <span className="text-luxury-gold">Jewelry Repair</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            30+ years of master craftsmanship. We restore your treasured pieces to perfection.
          </p>
        </div>
      </section>

      <section className="py-16 bg-luxury-warm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center text-luxury-dark">Our Repair Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="border-luxury-gold/20 hover:border-luxury-gold/40 transition-colors">
                <CardContent className="p-6">
                  <Check className="h-6 w-6 text-luxury-gold mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                  <p className="text-luxury-gold font-medium">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-2xl mx-auto border-luxury-gold/20 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-bold mb-6 text-center">Request a Free Quote</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-luxury-gold/20 focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-luxury-gold/20 focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="border-luxury-gold/20 focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="service">Service Needed</Label>
                  <Input
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    placeholder="e.g., Ring Resizing"
                    required
                    className="border-luxury-gold/20 focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Description</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your jewelry and what needs to be repaired..."
                    rows={4}
                    required
                    className="border-luxury-gold/20 focus:border-luxury-gold"
                  />
                </div>
                <Button type="submit" className="w-full bg-luxury-gold text-luxury-dark hover:bg-luxury-gold-light font-semibold py-6">
                  Request Quote
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Repairs;
