import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { MailInSteps } from "@/components/MailInSteps";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const repairServicesColumns = [
  ["Bracelet Repair", "Chain Repair", "Chain Soldering", "Necklace Repair", "Earring Repair", "Jewelry Cleaning", "Jewelry Engraving"],
  ["Jewelry Finishing", "Jewelry Mounting", "Metal Polishing", "Jewelry Polishing", "Pearl & Bead Restringing", "Ring Repair", "Ring Sizing"],
  ["Silver Jewelry Repair", "Platinum Jewelry Repair", "Hollow Bangle Bracelet Repair", "Stone Setting", "Stone Replacement", "Watch Repair", "Advanced Laser Welding"],
];

const Repairs = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    repairType: "mailin",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('repairs.form.success'));
    setFormData({ name: "", email: "", phone: "", repairType: "mailin", description: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="pt-32 pb-16 bg-gradient-to-b from-luxury-charcoal via-luxury-charcoal to-luxury-warm text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-white">
            {t('repairs.title')}
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            {t('repairs.subtitle')}
          </p>
        </div>
      </section>

      {/* How It Works Section - At the TOP */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-center">
            {t('repairs.howitworks')}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t('mailin.spanish.note')}
          </p>
          <MailInSteps />
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-luxury-warm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-center text-luxury-dark">
            {t('repairs.services.title')}
          </h2>
          <p className="text-luxury-dark/70 text-center mb-10 max-w-2xl mx-auto">
            Comprehensive in-house jewelry repair backed by 30+ years of master craftsmanship.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {repairServicesColumns.map((column, colIndex) => (
              <div key={colIndex} className="grid gap-2">
                {column.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-luxury-gold/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-luxury-gold" />
                    </div>
                    <span className="text-luxury-dark/80 text-sm">{service}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Quote Form */}
          <Card className="max-w-2xl mx-auto border-luxury-gold/20 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-bold mb-6 text-center">{t('repairs.form.title')}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">{t('repairs.form.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-luxury-gold/20 focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('repairs.form.email')}</Label>
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
                  <Label htmlFor="phone">{t('repairs.form.phone')}</Label>
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
                  <Label>{t('repairs.form.repairType')}</Label>
                  <RadioGroup 
                    value={formData.repairType} 
                    onValueChange={(value) => setFormData({ ...formData, repairType: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mailin" id="mailin" />
                      <Label htmlFor="mailin" className="font-normal cursor-pointer">
                        {t('repairs.form.repairType.mailin')}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inperson" id="inperson" />
                      <Label htmlFor="inperson" className="font-normal cursor-pointer">
                        {t('repairs.form.repairType.inperson')}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="description">{t('repairs.form.description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell us about your jewelry and what needs to be repaired..."
                    rows={4}
                    required
                    className="border-luxury-gold/20 focus:border-luxury-gold"
                  />
                </div>
                <Button type="submit" className="w-full bg-luxury-gold text-luxury-dark hover:bg-luxury-gold-light font-semibold py-6">
                  {t('repairs.form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* In-Person Repairs Section - Secondary */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-border">
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold mb-4">
                {t('repairs.inperson.title')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('repairs.inperson.text')}
              </p>
              <Link to="/contact">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  {t('repairs.inperson.button')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Repairs;