import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { AccountDropdown } from "./AccountDropdown";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import logoIcon from "@/assets/logo-icon.png";
import logoText from "@/assets/logo-text-only.png";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
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

  const handleTrackRepair = () => {
    setIsOpen(false);
    if (user) {
      navigate("/my-repairs");
    } else {
      navigate("/track-repair");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Primary navigation links (excluding Shop which has dropdown)
  const navLinks = [
    { to: "/custom", label: "Custom Jewelry" },
    { to: "/engagement-rings", label: "Engagement Rings" },
    { to: "/repairs", label: "Repairs" },
    { to: "/contact", label: "Contact" },
  ];

  const isShopActive = location.pathname === '/shop' || location.pathname === '/creator-marketplace';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-top ${
      isScrolled 
        ? 'bg-white shadow-md' 
        : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[72px]">
          {/* Left side: Logo + Nav Links */}
          <div className="flex items-center">
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

            {/* Desktop Navigation - Primary Links with 32px gap */}
            <nav className="hidden lg:flex items-center ml-12" style={{ gap: '32px' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors relative group whitespace-nowrap ${
                    location.pathname === link.to 
                      ? 'text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}

              {/* Shop with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <button
                  className={`text-sm font-medium transition-colors relative group whitespace-nowrap flex items-center gap-1 ${
                    isShopActive
                      ? 'text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Shop
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180' : ''}`} />
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    isShopActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>

                {/* Shop Dropdown Menu */}
                <div 
                  className={`absolute top-full left-0 pt-2 transition-all duration-200 ${
                    shopDropdownOpen 
                      ? 'opacity-100 visible translate-y-0' 
                      : 'opacity-0 invisible -translate-y-1'
                  }`}
                >
                  <div className="bg-white rounded-lg shadow-lg border border-border/50 py-2 min-w-[200px]">
                    <Link
                      to="/shop"
                      className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => setShopDropdownOpen(false)}
                    >
                      Our Collection
                    </Link>
                    <Link
                      to="/creator-marketplace"
                      className="block px-4 py-2.5 text-sm transition-colors hover:bg-muted/50"
                      onClick={() => setShopDropdownOpen(false)}
                    >
                      <span className="font-medium text-muted-foreground hover:text-foreground">Community Designs</span>
                      <span className="block text-xs text-primary mt-0.5">Earn commission</span>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Right side actions with consistent spacing */}
          <div className="flex items-center" style={{ gap: '24px' }}>
            {/* Phone Number */}
            <a
              href="tel:+12123910352"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">(212) 391-0352</span>
            </a>

            {/* Track Repair - Desktop (text only) */}
            <button
              onClick={handleTrackRepair}
              className={`hidden lg:block text-sm font-medium transition-colors whitespace-nowrap ${
                location.pathname === '/my-repairs' || location.pathname === '/track-repair'
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Track Repair
            </button>

            {/* Account - Desktop */}
            <div className="hidden lg:block">
              <AccountDropdown />
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
              {/* Primary Nav Links */}
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

              {/* Shop Section - Mobile */}
              <div className="px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">Shop</span>
              </div>
              <Link
                to="/shop"
                className={`px-6 py-3 text-base font-medium transition-colors hover:bg-muted tap-target flex items-center ${
                  location.pathname === '/shop' 
                    ? 'text-foreground bg-muted/50' 
                    : 'text-muted-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Our Collection
              </Link>
              <Link
                to="/creator-marketplace"
                className={`px-6 py-3 text-base font-medium transition-colors hover:bg-muted tap-target flex items-center justify-between ${
                  location.pathname === '/creator-marketplace' 
                    ? 'text-foreground bg-muted/50' 
                    : 'text-muted-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span>Community Designs</span>
                <span className="text-xs text-primary">Earn commission</span>
              </Link>

              {/* Track Repair - Mobile */}
              <button
                onClick={handleTrackRepair}
                className="px-4 py-3.5 text-base font-medium text-left transition-colors hover:bg-muted text-muted-foreground tap-target flex items-center mt-2 border-t border-border"
              >
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
                      to="/my-repairs"
                      className="px-4 py-3.5 text-base font-medium text-muted-foreground hover:bg-muted block tap-target"
                      onClick={() => setIsOpen(false)}
                    >
                      My Repairs
                    </Link>
                    <Link
                      to="/my-designs"
                      className="px-4 py-3.5 text-base font-medium text-muted-foreground hover:bg-muted block tap-target"
                      onClick={() => setIsOpen(false)}
                    >
                      My Designs
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
