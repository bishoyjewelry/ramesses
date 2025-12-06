import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Wrench, Gem, ShoppingBag, Play, Check, Quote } from "lucide-react";

export const HomeContent = () => {
  const { language, setLanguage, t } = useLanguage();

  const services = [
    {
      icon: Wrench,
      title: t('services.repairs.title'),
      text: t('services.repairs.text'),
      button: t('services.repairs.button'),
      link: '/repairs'
    },
    {
      icon: Gem,
      title: t('services.custom.title'),
      text: t('services.custom.text'),
      button: t('services.custom.button'),
      link: '/custom'
    },
    {
      icon: ShoppingBag,
      title: t('services.shop.title'),
      text: t('services.shop.text'),
      button: t('services.shop.button'),
      link: '/shop'
    }
  ];

  const testimonials = [
    t('testimonials.1'),
    t('testimonials.2'),
    t('testimonials.3')
  ];

  return (
    <>
      {/* Watch Us Work Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            {t('video.title')}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">{t('video.placeholder')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <service.icon className="w-12 h-12 text-primary mx-auto mb-6" />
                  <h3 className="text-xl font-serif font-bold mb-4">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.text}</p>
                  <Link to={service.link}>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      {service.button}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            {t('gallery.title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border">
                <p className="text-muted-foreground text-sm">{t('gallery.placeholder')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Master Jeweler */}
      <section className="py-20 bg-luxury-charcoal text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
              <p className="text-white/50">{t('about.placeholder')}</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                {t('about.title')}
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                {t('about.text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            {t('testimonials.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-8">
                  <Quote className="w-8 h-8 text-primary mb-4" />
                  <p className="text-lg italic">{testimonial}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Spanish CTA */}
      {language === 'en' && (
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">{t('spanish.title')}</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{t('spanish.text')}</p>
            <Button 
              onClick={() => setLanguage('es')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t('spanish.button')}
            </Button>
          </div>
        </section>
      )}
    </>
  );
};
