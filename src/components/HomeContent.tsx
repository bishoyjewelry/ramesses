import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MailInSteps } from "@/components/MailInSteps";
import { Wrench, Gem, ShoppingBag, Play, Quote } from "lucide-react";

export const HomeContent = () => {
  const { language, setLanguage, t } = useLanguage();

  const services = [
    {
      icon: Wrench,
      title: t('services.repairs.title'),
      text: t('services.repairs.text'),
      button: t('services.repairs.button'),
      link: '/repairs',
      isService: true
    },
    {
      icon: Gem,
      title: t('services.custom.title'),
      text: t('services.custom.text'),
      button: t('services.custom.button'),
      link: '/custom',
      isLuxury: true
    },
    {
      icon: ShoppingBag,
      title: t('services.shop.title'),
      text: t('services.shop.text'),
      button: t('services.shop.button'),
      link: '/shop',
      isLuxury: true
    }
  ];

  const testimonials = [
    t('testimonials.1'),
    t('testimonials.2'),
    t('testimonials.3')
  ];

  return (
    <>
      {/* How Mail-In Repairs Work - Palette 1 styling */}
      <section className="py-20 bg-service-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-white">
            {t('mailin.title')}
          </h2>
          <p className="text-center text-service-text-muted mb-12 max-w-2xl mx-auto font-body">
            {t('mailin.spanish.note')}
          </p>
          <MailInSteps />
          <div className="text-center mt-10">
            <Link to="/repairs">
              <Button size="lg" className="bg-service-gold text-white hover:bg-service-gold-hover font-semibold rounded">
                {t('hero.cta.primary')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Watch Us Work Section */}
      <section className="py-20 bg-service-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-12 text-white">
            {t('video.title')}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-service-bg-secondary rounded-lg flex items-center justify-center border border-service-gold/20">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-service-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-service-gold" />
                </div>
                <p className="text-service-text-muted font-body">{t('video.placeholder')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview - Light section */}
      <section className="py-20 bg-service-neutral">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white border-0 shadow-service hover:shadow-lg transition-shadow rounded-lg">
                <CardContent className="p-8 text-center">
                  <service.icon className={`w-12 h-12 mx-auto mb-6 ${service.isLuxury ? 'text-luxury-champagne' : 'text-service-gold'}`} />
                  <h3 className="text-xl font-sans font-bold mb-4 text-luxury-text">{service.title}</h3>
                  <p className="text-luxury-text-muted mb-6 font-body">{service.text}</p>
                  <Link to={service.link}>
                    <Button 
                      variant="outline" 
                      className={`rounded ${
                        service.isLuxury 
                          ? 'border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text' 
                          : 'border-service-gold text-service-gold hover:bg-service-gold hover:text-white'
                      }`}
                    >
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
      <section className="py-20 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif luxury-heading text-center mb-12 text-luxury-text">
            {t('gallery.title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-luxury-bg rounded-xl flex items-center justify-center border border-luxury-divider shadow-soft">
                <p className="text-luxury-text-muted text-sm font-body">{t('gallery.placeholder')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Master Jeweler - Palette 1 */}
      <section className="py-20 bg-service-bg text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-service-bg-secondary rounded-lg flex items-center justify-center">
              <p className="text-service-text-muted font-body">{t('about.placeholder')}</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold mb-6 text-white">
                {t('about.title')}
              </h2>
              <p className="text-service-text-muted text-lg leading-relaxed font-body">
                {t('about.text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-service-neutral">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-center mb-12 text-luxury-text">
            {t('testimonials.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-service rounded-lg">
                <CardContent className="p-8">
                  <Quote className="w-8 h-8 text-service-gold mb-4" />
                  <p className="text-lg italic text-luxury-text font-body">{testimonial}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Spanish CTA */}
      {language === 'en' && (
        <section className="py-16 bg-service-gold/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-sans font-bold mb-4 text-luxury-text">{t('spanish.title')}</h2>
            <p className="text-luxury-text-muted mb-6 max-w-2xl mx-auto font-body">{t('spanish.text')}</p>
            <Button 
              onClick={() => setLanguage('es')}
              className="bg-service-gold text-white hover:bg-service-gold-hover rounded"
            >
              {t('spanish.button')}
            </Button>
          </div>
        </section>
      )}
    </>
  );
};