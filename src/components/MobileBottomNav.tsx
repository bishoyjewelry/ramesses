import { Link, useLocation } from "react-router-dom";
import { Home, Wrench, Sparkles, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/repairs", icon: Wrench, label: "Repair" },
    { to: "/custom", icon: Sparkles, label: "Custom" },
    { to: user ? "/account" : "/auth?mode=login", icon: User, label: user ? "Account" : "Sign In" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-luxury-divider shadow-lg md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-[64px] transition-colors ${
                active
                  ? "text-luxury-champagne"
                  : "text-luxury-text-muted hover:text-luxury-text"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
