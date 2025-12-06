import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CartDrawer } from "./CartDrawer";
import logoIcon from "@/assets/logo-icon.png";
import logoText from "@/assets/logo-text-only.png";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: t('nav.home') },
    { to: "/repairs", label: t('nav.repairs') },
    { to: "/custom", label: t('nav.custom') },
    { to: "/shop", label: t('nav.shop') },
    { to: "/contact", label: t('nav.contact') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-luxury-charcoal/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logoIcon} 
              alt="Ramesses Jewelry" 
              className="h-10 w-auto"
            />
            <img 
              src={logoText} 
              alt="Ramesses Jewelry" 
              className={`h-6 w-auto hidden sm:block ${isScrolled ? '' : 'brightness-0 invert'}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to 
                    ? 'text-primary' 
                    : isScrolled ? 'text-foreground' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={`hidden sm:flex font-medium ${isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-primary'}`}
            >
              {t('nav.language')}
            </Button>

            {/* Cart */}
            <CartDrawer />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className={`h-6 w-6 ${isScrolled ? 'text-foreground' : 'text-white'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isScrolled ? 'text-foreground' : 'text-white'}`} />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <nav className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 text-sm font-medium transition-colors hover:bg-muted ${
                    location.pathname === link.to ? 'text-primary' : 'text-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="px-4 py-3 text-sm font-medium text-left transition-colors hover:bg-muted text-foreground"
              >
                {t('nav.language')}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
