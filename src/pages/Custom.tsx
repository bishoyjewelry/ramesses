import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const Custom = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    budget: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Custom quote request received! We'll contact you soon.");
    setFormData({ name: "", email: "", phone: "", type: "", budget: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      
      <section className="pt-32 pb-16 bg-luxury-dark text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Custom <span className="text-luxury-gold">Jewelry Design</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your vision into a one-of-a-kind masterpiece crafted by expert jewelers.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-luxury-gold/20">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-serif font-bold text-luxury-gold mb-3">1</div>
                <h3 className="text-xl font-semibold mb-2">Share Your Vision</h3>
                <p className="text-muted-foreground">Tell us your ideas, upload inspiration photos, or describe your dream piece.</p>
              </CardContent>
            </Card>
            <Card className="border-luxury-gold/20">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-serif font-bold text-luxury-gold mb-3">2</div>
                <h3 className="text-xl font-semibold mb-2">Expert Design</h3>
                <p className="text-muted-foreground">Our master jewelers create detailed designs and provide quotes.</p>
              </CardContent>
            </Card>
            <Card className="border-luxury-gold/20">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-serif font-bold text-luxury-gold mb-3">3</div>
                <h3 className="text-xl font-semibold mb-2">Masterpiece Creation</h3>
                <p className="text-muted-foreground">Watch your vision come to life with meticulous craftsmanship.</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">What We Create</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {["Custom Engagement Rings", "Personalized Pendants", "Unique Nameplates"].map((item, index) => (
                <Card key={index} className="border-luxury-gold/20 hover:border-luxury-gold/40 transition-colors">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-lg text-luxury-gold">{item}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="max-w-2xl mx-auto border-luxury-gold/20 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-bold mb-6 text-center">Request a Custom Quote</h3>
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
                  <Label htmlFor="type">Jewelry Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Engagement Ring, Pendant"
                    required
                    className="border-luxury-gold/20 focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g., $2,000 - $5,000"
                    className="border-luxury-gold/20 focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Your Vision</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your dream piece in detail..."
                    rows={4}
                    required
                    className="border-luxury-gold/20 focus:border-luxury-gold"
                  />
                </div>
                <Button type="submit" className="w-full bg-luxury-gold text-luxury-dark hover:bg-luxury-gold-light font-semibold py-6">
                  Request Custom Quote
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Custom;
