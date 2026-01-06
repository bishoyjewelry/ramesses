import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Sparkles, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const AccountDropdown = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    setIsOpen(false);
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  // Not logged in - show user icon that links to auth
  if (!user) {
    return (
      <Link 
        to="/auth?mode=login"
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
      >
        <User className="h-5 w-5" />
      </Link>
    );
  }

  // Logged in - show user icon with dropdown
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
      >
        <User className="h-5 w-5" />
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-full right-0 pt-2 transition-all duration-200 ${
          isOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-1'
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg border border-border/50 py-2 min-w-[180px]">
          <Link 
            to="/account" 
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4" />
            My Account
          </Link>
          
          <Link 
            to="/my-designs" 
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Sparkles className="w-4 h-4" />
            My Designs
          </Link>
          
          <div className="my-1 mx-2 border-t border-border/50" />
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-muted/50 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
