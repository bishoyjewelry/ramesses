import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Sparkles, Wrench, Settings, LogOut, ClipboardList } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AccountDropdownProps {
  onTrackRepair?: () => void;
}

export const AccountDropdown = ({ onTrackRepair }: AccountDropdownProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const handleTrackRepairClick = () => {
    if (onTrackRepair) {
      onTrackRepair();
    } else if (user) {
      navigate("/my-repairs");
    } else {
      navigate("/auth?mode=login&redirect=/my-repairs");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleTrackRepairClick}
          className="text-service-gold hover:text-service-gold/80 font-medium flex items-center gap-1"
        >
          <ClipboardList className="h-4 w-4" />
          Track Repair
        </Button>
        <Link to="/auth?mode=login">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-luxury-text hover:text-luxury-champagne font-medium"
          >
            Sign In
          </Button>
        </Link>
        <Link to="/auth?mode=signup">
          <Button 
            variant="outline" 
            size="sm"
            className="border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-white font-medium"
          >
            Create Account
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-luxury-text hover:text-luxury-champagne font-medium flex items-center gap-1"
        >
          My Account
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border-luxury-divider">
        <DropdownMenuItem asChild>
          <Link to="/my-repairs" className="flex items-center gap-2 cursor-pointer text-service-gold">
            <ClipboardList className="w-4 h-4" />
            Track Repair
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-luxury-divider" />
        
        <DropdownMenuItem asChild>
          <Link to="/my-designs" className="flex items-center gap-2 cursor-pointer">
            <Sparkles className="w-4 h-4" />
            My Designs
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/my-repairs" className="flex items-center gap-2 cursor-pointer">
            <Wrench className="w-4 h-4" />
            My Repairs
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/account" className="flex items-center gap-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-luxury-divider" />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};