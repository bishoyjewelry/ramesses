import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Package } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Custom = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    budget: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('custom.form.success'));
    setFormData({
      name: "",
      email: "",
      phone: "",
      type: "",
      budget: "",
      description: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="pt-32 pb-16 bg-gradient-to-b from-luxury-charcoal via-luxury-charcoal to-luxury-warm text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-white">
            {t('custom.title')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/70">
            {t('custom.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 bg-luxury-warm">
        <div className="container mx-auto px-4">
          {/* Mail-In Note */}
          <Card className="max-w-2xl mx-auto mb-12 border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex items-center gap-4">
              <Package className="w-8 h-8 text-primary flex-shrink-0" />
              <p className="text-foreground">
                {t('custom.mailin.note')}
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="border-luxury-gold/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-serif font-bold text-luxury-gold mb-3">1</div>
                <h3 className="text-lg font-semibold mb-2">{t('custom.step1').split('.')[0]}</h3>
                <p className="text-muted-foreground text-sm">{t('custom.step1')}</p>
              </CardContent>
            </Card>
            <Card className="border-luxury-gold/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-serif font-bold text-luxury-gold mb-3">2</div>
                <h3 className="text-lg font-semibold mb-2">{t('custom.step2').split('.')[0]}</h3>
                <p className="text-muted-foreground text-sm">{t('custom.step2')}</p>
              </CardContent>
            </Card>
            <Card className="border-luxury-gold/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-serif font-bold text-luxury-gold mb-3">3</div>
                <h3 className="text-lg font-semibold mb-2">{t('custom.step3').split('.')[0]}</h3>
                <p className="text-muted-foreground text-sm">{t('custom.step3')}</p>
              </CardContent>
            </Card>
            <Card className="border-luxury-gold/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-serif font-bold text-luxury-gold mb-3">4</div>
                <h3 className="text-lg font-semibold mb-2">{t('custom.step4').split('.')[0]}</h3>
                <p className="text-muted-foreground text-sm">{t('custom.step4')}</p>
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
              <h3 className="text-2xl font-serif font-bold mb-6 text-center">{t('custom.form.title')}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">{t('repairs.form.name')}</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({
                    ...formData,
                    name: e.target.value
                  })} required className="border-luxury-gold/20 focus:border-luxury-gold" />
                </div>
                <div>
                  <Label htmlFor="email">{t('repairs.form.email')}</Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
                    ...formData,
                    email: e.target.value
                  })} required className="border-luxury-gold/20 focus:border-luxury-gold" />
                </div>
                <div>
                  <Label htmlFor="phone">{t('repairs.form.phone')}</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({
                    ...formData,
                    phone: e.target.value
                  })} required className="border-luxury-gold/20 focus:border-luxury-gold" />
                </div>
                <div>
                  <Label htmlFor="type">{t('custom.form.type')}</Label>
                  <Input id="type" value={formData.type} onChange={e => setFormData({
                    ...formData,
                    type: e.target.value
                  })} placeholder="e.g., Engagement Ring, Pendant" required className="border-luxury-gold/20 focus:border-luxury-gold" />
                </div>
                <div>
                  <Label htmlFor="budget">{t('custom.form.budget')}</Label>
                  <Input id="budget" value={formData.budget} onChange={e => setFormData({
                    ...formData,
                    budget: e.target.value
                  })} placeholder="e.g., $2,000 - $5,000" className="border-luxury-gold/20 focus:border-luxury-gold" />
                </div>
                <div>
                  <Label htmlFor="description">{t('custom.form.description')}</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({
                    ...formData,
                    description: e.target.value
                  })} placeholder="Describe your dream piece in detail..." rows={4} required className="border-luxury-gold/20 focus:border-luxury-gold" />
                </div>
                <Button type="submit" className="w-full bg-luxury-gold text-luxury-dark hover:bg-luxury-gold-light font-semibold py-6">
                  {t('custom.form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Custom;