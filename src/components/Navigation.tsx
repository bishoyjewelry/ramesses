import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
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
    // Scroll to top of page
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Simplified navigation links
  const navLinks = [
    { to: "/custom", label: "Custom Jewelry" },
    { to: "/engagement-rings", label: "Engagement Rings" },
    { to: "/repairs", label: "Repairs" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-top ${
      isScrolled 
        ? 'bg-white shadow-md' 
        : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img 
              src={logoIcon} 
              alt="Ramesses Jewelry" 
              className="h-8 sm:h-9 w-auto"
            />
            <img 
              src={logoText} 
              alt="Ramesses Jewelry" 
              className="h-4 sm:h-5 w-auto hidden sm:block"
            />
          </Link>

          {/* Desktop Navigation - Primary Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors relative group ${
                  location.pathname === link.to 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-foreground transition-all duration-300 ${
                  location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Start Repair CTA - Desktop Only */}
            <Button
              onClick={handleStartRepair}
              size="sm"
              className="hidden lg:flex bg-service-gold hover:bg-service-gold/90 text-white font-medium px-4 h-9"
            >
              Start Repair
            </Button>

            {/* Account Dropdown - Desktop */}
            <div className="hidden lg:block">
              <AccountDropdown onTrackRepair={handleTrackRepair} />
            </div>

            {/* Cart */}
            <CartDrawer isScrolled={true} />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden tap-target h-9 w-9"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-border max-h-[calc(100vh-56px)] overflow-y-auto">
            <nav className="flex flex-col py-2">
              {/* Primary CTA - Mobile */}
              <button
                onClick={handleStartRepair}
                className="mx-4 my-2 py-3 rounded-lg bg-service-gold text-white font-medium text-center"
              >
                Start Repair
              </button>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3.5 text-base font-medium transition-colors hover:bg-muted tap-target flex items-center ${
                    location.pathname === link.to 
                      ? 'text-foreground bg-muted/50' 
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Track Repair - Mobile */}
              <button
                onClick={handleTrackRepair}
                className="px-4 py-3.5 text-base font-medium text-left transition-colors hover:bg-muted text-muted-foreground tap-target flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Track Repair
              </button>
              
              {/* Mobile Account Links */}
              <div className="border-t border-border mt-2 pt-2">
                {user ? (
                  <>
                    <Link
                      to="/account"
                      className="px-4 py-3.5 text-base font-medium text-muted-foreground hover:bg-muted block tap-target"
                      onClick={() => setIsOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/my-designs"
                      className="px-4 py-3.5 text-base font-medium text-muted-foreground hover:bg-muted block tap-target"
                      onClick={() => setIsOpen(false)}
                    >
                      My Designs
                    </Link>
                    <Link
                      to="/my-repairs"
                      className="px-4 py-3.5 text-base font-medium text-muted-foreground hover:bg-muted block tap-target"
                      onClick={() => setIsOpen(false)}
                    >
                      My Repairs
                    </Link>
                    <button
                      onClick={handleMobileSignOut}
                      className="px-4 py-3.5 text-base font-medium text-destructive hover:bg-muted block w-full text-left tap-target"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth?mode=login"
                    className="px-4 py-3.5 text-base font-medium text-muted-foreground hover:bg-muted block tap-target"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
              
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="px-4 py-3.5 text-base font-medium text-left transition-colors hover:bg-muted text-muted-foreground tap-target"
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
