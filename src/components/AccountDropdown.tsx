import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Sparkles, Wrench, LogOut, Search } from "lucide-react";
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
      navigate("/track-repair");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleTrackRepairClick}
          className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1.5 h-9"
        >
          <Search className="h-4 w-4" />
          Track Repair
        </Button>
        <Link to="/auth?mode=login">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground font-medium h-9"
          >
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleTrackRepairClick}
        className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1.5 h-9"
      >
        <Search className="h-4 w-4" />
        Track Repair
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1.5 h-9"
          >
            <User className="h-4 w-4" />
            My Account
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 bg-background border-border">
          <DropdownMenuItem asChild>
            <Link to="/account" className="flex items-center gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              My Account
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/my-designs" className="flex items-center gap-2 cursor-pointer">
              <Sparkles className="w-4 h-4" />
              My Designs
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/my-repairs" className="flex items-center gap-2 cursor-pointer">
              <Wrench className="w-4 h-4" />
              Repairs
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-border" />
          
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
