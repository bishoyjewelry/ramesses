import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CartDrawer } from "./CartDrawer";
import { AccountDropdown } from "./AccountDropdown";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import logoIcon from "@/assets/logo-icon.png";
import logoText from "@/assets/logo-text-only.png";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleMobileSignOut = async () => {
    setIsOpen(false);
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const handleStartRepair = () => {
    setIsOpen(false);
    navigate("/repairs");
    // Scroll to the wizard after navigation
    setTimeout(() => {
      const wizardElement = document.getElementById("repair-form");
      if (wizardElement) {
        wizardElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleTrackRepair = () => {
    setIsOpen(false);
    if (user) {
      navigate("/my-repairs");
    } else {
      navigate("/auth?mode=login&redirect=/my-repairs");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if current page is a luxury page (Custom Lab, Shop galleries)
  const isLuxuryPage = location.pathname === '/custom';
  
  // Determine if current page is a service page
  const isServicePage = ['/repairs', '/contact'].includes(location.pathname);

  const navLinks = [
    { to: "/custom", label: t('nav.custom'), isLuxury: true },
    { to: "/engagement-rings", label: "Engagement Rings", isLuxury: true },
    { to: "/repairs", label: t('nav.repairs'), isService: true },
    { to: "/shop", label: t('nav.shop') },
    { to: "/contact", label: t('nav.contact'), isService: true },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-top ${
      isScrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logoIcon} 
              alt="Ramesses Jewelry" 
              className="h-8 sm:h-10 w-auto"
            />
            <img 
              src={logoText} 
              alt="Ramesses Jewelry" 
              className="h-5 sm:h-6 w-auto hidden sm:block"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors relative group ${
                  location.pathname === link.to 
                    ? link.isLuxury 
                      ? 'text-luxury-champagne' 
                      : link.isService 
                        ? 'text-service-gold' 
                        : 'text-luxury-text'
                    : 'text-luxury-text hover:text-luxury-text/70'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  link.isLuxury ? 'bg-luxury-champagne' : link.isService ? 'bg-service-gold' : 'bg-luxury-text'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex font-medium text-luxury-text hover:text-luxury-text/70"
            >
              {t('nav.language')}
            </Button>

            {/* Start Repair CTA - Desktop */}
            <Button
              onClick={handleStartRepair}
              size="sm"
              className="hidden sm:flex bg-service-gold hover:bg-service-gold/90 text-white font-medium px-4"
            >
              Start Repair
            </Button>

            {/* Cart */}
            <CartDrawer isScrolled={true} />

            {/* Account Actions */}
            <div className="hidden sm:block">
              <AccountDropdown onTrackRepair={handleTrackRepair} />
            </div>

            {/* Start Repair CTA - Mobile (visible before menu toggle) */}
            <Button
              onClick={handleStartRepair}
              size="sm"
              className="sm:hidden bg-service-gold hover:bg-service-gold/90 text-white font-medium px-3 text-xs"
            >
              <Wrench className="h-3.5 w-3.5 mr-1" />
              Repair
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden tap-target"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-luxury-text" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-luxury-text" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-luxury-divider max-h-[calc(100vh-56px)] overflow-y-auto">
            <nav className="flex flex-col py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3.5 text-base font-medium transition-colors hover:bg-luxury-bg-warm tap-target flex items-center ${
                    location.pathname === link.to 
                      ? link.isLuxury 
                        ? 'text-luxury-champagne bg-luxury-champagne/5' 
                        : link.isService 
                          ? 'text-service-gold bg-service-gold/5' 
                          : 'text-luxury-text'
                      : 'text-luxury-text'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Track Repair - Mobile */}
              <button
                onClick={handleTrackRepair}
                className="px-4 py-3.5 text-base font-medium text-left transition-colors hover:bg-luxury-bg-warm text-service-gold tap-target flex items-center gap-2"
              >
                <Wrench className="h-4 w-4" />
                Track Repair
              </button>
              
              {/* Mobile Account Links */}
              <div className="border-t border-luxury-divider mt-2 pt-2">
                {user ? (
                  <>
                    <Link
                      to="/account"
                      className="px-4 py-3.5 text-base font-medium text-luxury-text hover:bg-luxury-bg-warm block tap-target"
                      onClick={() => setIsOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/my-repairs"
                      className="px-4 py-3.5 text-base font-medium text-luxury-text hover:bg-luxury-bg-warm block tap-target"
                      onClick={() => setIsOpen(false)}
                    >
                      My Repairs
                    </Link>
                    <Link
                      to="/orders"
                      className="px-4 py-3.5 text-base font-medium text-luxury-text hover:bg-luxury-bg-warm block tap-target"
                      onClick={() => setIsOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/my-designs"
                      className="px-4 py-3.5 text-base font-medium text-luxury-text hover:bg-luxury-bg-warm block tap-target"
                      onClick={() => setIsOpen(false)}
                    >
                      My Custom Designs
                    </Link>
                    <button
                      onClick={handleMobileSignOut}
                      className="px-4 py-3.5 text-base font-medium text-red-600 hover:bg-luxury-bg-warm block w-full text-left tap-target"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth?mode=login"
                      className="px-4 py-3.5 text-base font-medium text-luxury-text hover:bg-luxury-bg-warm block tap-target"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth?mode=signup"
                      className="px-4 py-3.5 text-base font-medium text-luxury-champagne hover:bg-luxury-bg-warm block tap-target"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
              
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="px-4 py-3.5 text-base font-medium text-left transition-colors hover:bg-luxury-bg-warm text-luxury-text tap-target"
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
