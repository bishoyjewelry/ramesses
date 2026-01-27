import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logoIcon from "@/assets/logo-icon.png";
import logoText from "@/assets/logo-text-only.png";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-background py-20 sm:py-24 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Logo & Tagline */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img 
                src={logoIcon} 
                alt="Ramesses Jewelry" 
                className="h-10 w-auto opacity-80"
              />
              <img 
                src={logoText} 
                alt="Ramesses Jewelry" 
                className="h-5 w-auto opacity-80"
              />
            </div>
            <p className="text-sm text-muted-foreground/50 max-w-sm mx-auto">
              Diamond District craftsmanship since 1992
            </p>
          </div>

          {/* Links - minimal horizontal layout */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 mb-10 text-sm">
            <Link to="/custom" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Custom
            </Link>
            <Link to="/our-work" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Our Work
            </Link>
            <Link to="/design-ideas" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Design Ideas
            </Link>
            <Link to="/repairs" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Repairs
            </Link>
            <Link to="/shop" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Shop
            </Link>
            <Link to="/contact" className="text-muted-foreground/60 hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mb-16 text-xs">
            <Link to="/shipping" className="text-muted-foreground/50 hover:text-foreground transition-colors">
              Shipping & Returns
            </Link>
            <Link to="/privacy" className="text-muted-foreground/50 hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground/50 hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground/40">
              &copy; {new Date().getFullYear()} Ramesses Jewelry. {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
