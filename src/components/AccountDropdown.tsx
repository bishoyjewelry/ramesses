import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Package, PenTool, Palette, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const AccountDropdown = () => {
  const { user, isCreator, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
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
            size="sm"
            className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-medium"
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
          size="icon"
          className="text-luxury-text hover:text-luxury-champagne"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border-luxury-divider">
        <div className="px-3 py-2 text-sm text-luxury-text-muted">
          {user.email}
        </div>
        <DropdownMenuSeparator className="bg-luxury-divider" />
        
        <DropdownMenuItem asChild>
          <Link to="/account" className="flex items-center gap-2 cursor-pointer">
            <User className="w-4 h-4" />
            My Account
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
            <Package className="w-4 h-4" />
            My Orders / Repairs
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/my-designs" className="flex items-center gap-2 cursor-pointer">
            <PenTool className="w-4 h-4" />
            My Custom Designs
          </Link>
        </DropdownMenuItem>
        
        {isCreator && (
          <DropdownMenuItem asChild>
            <Link to="/creator" className="flex items-center gap-2 cursor-pointer">
              <Palette className="w-4 h-4" />
              Creator Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-luxury-divider" />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
