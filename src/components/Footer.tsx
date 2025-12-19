import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logoIcon from "@/assets/logo-icon.png";
import logoText from "@/assets/logo-text-only.png";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-service-bg text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logoIcon} 
                alt="Ramesses Jewelry" 
                className="h-14 w-auto"
              />
              <img 
                src={logoText} 
                alt="Ramesses Jewelry" 
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-service-text-muted max-w-md leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-semibold mb-6 text-service-gold text-lg">Quick Links</h2>
            <div className="space-y-3">
              <Link to="/repairs" className="block text-service-text-muted hover:text-service-gold transition-colors">
                {t('nav.repairs')}
              </Link>
              <Link to="/custom" className="block text-service-text-muted hover:text-service-gold transition-colors">
                {t('nav.custom')}
              </Link>
              <Link to="/shop" className="block text-service-text-muted hover:text-service-gold transition-colors">
                {t('nav.shop')}
              </Link>
              <Link to="/contact" className="block text-service-text-muted hover:text-service-gold transition-colors">
                {t('nav.contact')}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold mb-6 text-service-gold text-lg">Contact</h2>
            <div className="space-y-4 text-service-text-muted text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-service-gold" />
                <span>47th Street, NYC<br />(Address coming soon)</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-service-gold" />
                <span>(Phone coming soon)</span>
              </div>
              <p>{t('footer.hours')}</p>
            </div>
            <div className="flex gap-4 mt-6">
              <a 
                href="https://wa.me/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Contact us on WhatsApp"
                className="w-10 h-10 rounded-full bg-service-bg-secondary flex items-center justify-center text-service-text-muted hover:text-service-gold hover:bg-service-gold/10 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Follow us on Instagram"
                className="w-10 h-10 rounded-full bg-service-bg-secondary flex items-center justify-center text-service-text-muted hover:text-service-gold hover:bg-service-gold/10 transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-service-bg-secondary pt-8 text-center text-service-text-muted text-sm">
          <p>&copy; {new Date().getFullYear()} Ramesses Jewelry. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};