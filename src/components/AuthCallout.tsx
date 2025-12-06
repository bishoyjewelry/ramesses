import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuthCalloutProps {
  redirectTo?: string;
}

export const AuthCallout = ({ redirectTo = "/custom" }: AuthCalloutProps) => {
  const { user, isLoading } = useAuth();

  // Don't show if user is authenticated or still loading
  if (isLoading || user) {
    return null;
  }

  return (
    <Card className="border-2 border-luxury-champagne/30 bg-luxury-champagne/5 shadow-soft rounded-xl">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-serif luxury-heading text-luxury-text mb-2">
              Create a Free Account to Save and Publish Your Designs
            </h3>
            <p className="text-luxury-text-muted font-body">
              You can explore the Custom Lab freely, but to submit a design for a quote, save your ideas, 
              or publish your finished piece to the Ramessés Creator Marketplace, you'll need to sign in 
              or create a free account.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link to={`/auth?mode=login&redirect=${encodeURIComponent(redirectTo)}`}>
              <Button 
                className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover px-6 py-5 font-semibold rounded-lg w-full sm:w-auto"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to={`/auth?mode=signup&redirect=${encodeURIComponent(redirectTo)}`}>
              <Button 
                variant="outline"
                className="border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 px-6 py-5 font-semibold rounded-lg w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
