import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { z } from "zod";

const passwordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(128),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Listen for auth state changes (recovery event)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsValidSession(true);
        } else if (session) {
          setIsValidSession(true);
        }
      });

      // If already have a session, allow password reset
      if (session) {
        setIsValidSession(true);
      } else {
        // Give a moment for the auth state to resolve
        setTimeout(() => {
          setIsValidSession((prev) => prev === null ? false : prev);
        }, 1000);
      }

      return () => subscription.unsubscribe();
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = passwordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: { password?: string; confirmPassword?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "password") fieldErrors.password = err.message;
        if (err.path[0] === "confirmPassword") fieldErrors.confirmPassword = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success("Password updated successfully!");
        
        // Redirect to home after a short delay
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-bg">
        <Loader2 className="w-8 h-8 animate-spin text-luxury-champagne" />
      </div>
    );
  }

  // Invalid or expired link
  if (isValidSession === false) {
    return (
      <div className="min-h-screen bg-luxury-bg">
        <Navigation />
        
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card className="border-2 border-luxury-champagne/20 shadow-luxury rounded-xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-3xl font-serif luxury-heading text-luxury-text">
                    Invalid or Expired Link
                  </CardTitle>
                  <CardDescription className="text-luxury-text-muted text-base">
                    This password reset link is invalid or has expired. Please request a new one.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <Button
                    onClick={() => navigate("/auth?mode=forgot")}
                    className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover py-6 text-lg font-semibold rounded-lg shadow-luxury"
                  >
                    Request New Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-luxury-bg">
        <Navigation />
        
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card className="border-2 border-luxury-champagne/20 shadow-luxury rounded-xl">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-3xl font-serif luxury-heading text-luxury-text">
                    Password Updated
                  </CardTitle>
                  <CardDescription className="text-luxury-text-muted text-base">
                    Your password has been successfully updated. Redirecting you now...
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg">
      <Navigation />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-luxury-champagne/20 shadow-luxury rounded-xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl font-serif luxury-heading text-luxury-text">
                  Set New Password
                </CardTitle>
                <CardDescription className="text-luxury-text-muted text-base">
                  Enter your new password below
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-luxury-text font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-text-muted" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 border-luxury-divider focus:border-luxury-champagne bg-luxury-bg"
                        required
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-luxury-text font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-text-muted" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 border-luxury-divider focus:border-luxury-champagne bg-luxury-bg"
                        required
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover py-6 text-lg font-semibold rounded-lg shadow-luxury"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <ArrowRight className="w-5 h-5 mr-2" />
                    )}
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
