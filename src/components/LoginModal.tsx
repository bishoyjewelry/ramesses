import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus, LogIn } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export const LoginModal = ({ isOpen, onClose, redirectTo = "/custom" }: LoginModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-luxury-bg border-luxury-divider">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-serif luxury-heading text-luxury-text">
            Create a Free Account to Submit Your Design
          </DialogTitle>
          <DialogDescription className="text-luxury-text-muted text-base pt-2">
            Sign in or create an account to submit your custom jewelry design for a quote. 
            Your design information will be saved.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 pt-4">
          <Link to={`/auth?mode=login&redirect=${encodeURIComponent(redirectTo)}`}>
            <Button 
              className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover py-6 text-lg font-semibold rounded-lg"
              onClick={onClose}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </Link>
          <Link to={`/auth?mode=signup&redirect=${encodeURIComponent(redirectTo)}`}>
            <Button 
              variant="outline"
              className="w-full border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 py-6 text-lg font-semibold rounded-lg"
              onClick={onClose}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Account
            </Button>
          </Link>
        </div>
        
        <p className="text-center text-sm text-luxury-text-muted mt-2">
          Creating an account is free and takes less than a minute.
        </p>
      </DialogContent>
    </Dialog>
  );
};
