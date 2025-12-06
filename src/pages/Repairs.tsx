import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, MapPin, Package, Shield, Clock, Truck } from "lucide-react";
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
    <div className="min-h-screen bg-service-bg">
      <Navigation />
      
      {/* Hero Section - Palette 1 */}
      <section className="pt-32 pb-20 bg-service-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-sans service-heading font-bold mb-6 text-white">
            {t('repairs.title')}
          </h1>
          <p className="text-xl text-service-text-muted max-w-2xl mx-auto font-body">
            {t('repairs.subtitle')}
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-service-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold mb-4 text-center text-white">
            {t('repairs.howitworks')}
          </h2>
          <p className="text-center text-service-text-muted mb-12 max-w-2xl mx-auto font-body">
            {t('mailin.spanish.note')}
          </p>
          <MailInSteps />
        </div>
      </section>

      {/* Services List - Palette 1 Navy */}
      <section className="py-20 bg-service-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold mb-2 text-center text-white">
            {t('repairs.services.title')}
          </h2>
          <p className="text-service-text-muted text-center mb-12 max-w-2xl mx-auto font-body">
            Comprehensive in-house jewelry repair backed by 30+ years of master craftsmanship.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
            {repairServicesColumns.map((column, colIndex) => (
              <div key={colIndex} className="grid gap-3">
                {column.map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-service-gold/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-service-gold" />
                    </div>
                    <span className="text-service-text-muted text-sm font-body">{service}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            {[
              { icon: Shield, text: "Fully Insured" },
              { icon: Clock, text: "Fast Turnaround" },
              { icon: Truck, text: "Free Return Shipping" },
              { icon: Package, text: "Secure Packaging" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-service-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-7 h-7 text-service-gold" />
                </div>
                <span className="text-sm text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form - Light Section */}
      <section className="py-20 bg-service-neutral">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-0 shadow-service rounded-lg">
            <CardContent className="p-8 md:p-10">
              <h3 className="text-2xl font-sans font-bold mb-6 text-center text-luxury-text">{t('repairs.form.title')}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-luxury-text">{t('repairs.form.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-luxury-divider focus:border-service-gold bg-white rounded"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-luxury-text">{t('repairs.form.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-luxury-divider focus:border-service-gold bg-white rounded"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-luxury-text">{t('repairs.form.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="border-luxury-divider focus:border-service-gold bg-white rounded"
                  />
                </div>
                <div>
                  <Label className="text-luxury-text">{t('repairs.form.repairType')}</Label>
                  <RadioGroup 
                    value={formData.repairType} 
                    onValueChange={(value) => setFormData({ ...formData, repairType: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mailin" id="mailin" className="border-service-gold text-service-gold" />
                      <Label htmlFor="mailin" className="font-normal cursor-pointer text-luxury-text">
                        {t('repairs.form.repairType.mailin')}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inperson" id="inperson" className="border-service-gold text-service-gold" />
                      <Label htmlFor="inperson" className="font-normal cursor-pointer text-luxury-text">
                        {t('repairs.form.repairType.inperson')}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="description" className="text-luxury-text">{t('repairs.form.description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell us about your jewelry and what needs to be repaired..."
                    rows={4}
                    required
                    className="border-luxury-divider focus:border-service-gold bg-white rounded"
                  />
                </div>
                <Button type="submit" className="w-full bg-service-gold text-white hover:bg-service-gold-hover font-semibold py-6 rounded">
                  {t('repairs.form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* In-Person Repairs Section */}
      <section className="py-20 bg-service-bg-secondary">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-service-bg border-service-gold/20 rounded">
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-service-gold mx-auto mb-4" />
              <h3 className="text-2xl font-sans font-bold mb-4 text-white">
                {t('repairs.inperson.title')}
              </h3>
              <p className="text-service-text-muted mb-6 font-body">
                {t('repairs.inperson.text')}
              </p>
              <Link to="/contact">
                <Button variant="outline" className="border-service-gold text-service-gold hover:bg-service-gold hover:text-white rounded">
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