import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logoIcon from "@/assets/logo-icon.png";
import logoText from "@/assets/logo-text-only.png";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-luxury-charcoal text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logoIcon} 
                alt="Ramesses Jewelry" 
                className="h-12 w-auto"
              />
              <img 
                src={logoText} 
                alt="Ramesses Jewelry" 
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/70 max-w-md">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/repairs" className="block text-white/70 hover:text-primary transition-colors">
                {t('nav.repairs')}
              </Link>
              <Link to="/custom" className="block text-white/70 hover:text-primary transition-colors">
                {t('nav.custom')}
              </Link>
              <Link to="/shop" className="block text-white/70 hover:text-primary transition-colors">
                {t('nav.shop')}
              </Link>
              <Link to="/contact" className="block text-white/70 hover:text-primary transition-colors">
                {t('nav.contact')}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Contact</h4>
            <div className="space-y-3 text-white/70 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>47th Street, NYC<br />(Address coming soon)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>(Phone coming soon)</span>
              </div>
              <p>{t('footer.hours')}</p>
            </div>
            <div className="flex gap-4 mt-4">
              <a 
                href="https://wa.me/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-primary transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/50">
          <p>&copy; {new Date().getFullYear()} Ramesses Jewelry. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};
