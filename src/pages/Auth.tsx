import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(128),
});

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
});

type AuthMode = "login" | "signup" | "forgot";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { user, isLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect") || "/";
  const urlMode = searchParams.get("mode");

  useEffect(() => {
    if (urlMode === "signup") {
      setMode("signup");
    } else if (urlMode === "login") {
      setMode("login");
    } else if (urlMode === "forgot") {
      setMode("forgot");
    }
  }, [urlMode]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, isLoading, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (mode === "forgot") {
      // Validate email only
      const result = emailSchema.safeParse({ email });
      if (!result.success) {
        setErrors({ email: result.error.errors[0]?.message });
        return;
      }

      setIsSubmitting(true);

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
          // Don't expose if email exists or not
          console.error("Reset password error:", error);
        }

        // Always show success message for security
        setResetEmailSent(true);
      } catch (error) {
        // Still show success for security
        setResetEmailSent(true);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    // Login/Signup validation
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate(redirectTo, { replace: true });
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created! You can now sign in.");
          setMode("login");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-bg">
        <Loader2 className="w-8 h-8 animate-spin text-luxury-champagne" />
      </div>
    );
  }

  // Forgot password - email sent confirmation
  if (mode === "forgot" && resetEmailSent) {
    return (
      <div className="min-h-screen bg-luxury-bg">
        <Navigation />
        
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card className="border-2 border-luxury-champagne/20 shadow-luxury rounded-xl">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-luxury-champagne/20 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-luxury-champagne" />
                  </div>
                  <CardTitle className="text-3xl font-serif luxury-heading text-luxury-text">
                    Check Your Email
                  </CardTitle>
                  <CardDescription className="text-luxury-text-muted text-base">
                    If an account exists for this email, we've sent password reset instructions.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <Button
                    onClick={() => {
                      setMode("login");
                      setResetEmailSent(false);
                      setEmail("");
                    }}
                    variant="outline"
                    className="w-full border-luxury-divider text-luxury-text hover:bg-luxury-champagne/10 py-6 text-lg font-semibold rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Sign In
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

  return (
    <div className="min-h-screen bg-luxury-bg">
      <Navigation />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-luxury-champagne/20 shadow-luxury rounded-xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl font-serif luxury-heading text-luxury-text">
                  {mode === "login" && "Welcome Back"}
                  {mode === "signup" && "Create Account"}
                  {mode === "forgot" && "Reset Password"}
                </CardTitle>
                <CardDescription className="text-luxury-text-muted text-base">
                  {mode === "login" && "Sign in to access your account"}
                  {mode === "signup" && "Create a free account to save designs and submit quotes"}
                  {mode === "forgot" && "Enter your email to receive reset instructions"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-luxury-text font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-text-muted" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-10 border-luxury-divider focus:border-luxury-champagne bg-luxury-bg"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {mode !== "forgot" && (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-luxury-text font-medium">
                        Password
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
                      
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => setMode("forgot")}
                          className="text-sm text-luxury-champagne hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                  )}

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
                    {mode === "login" && "Sign In"}
                    {mode === "signup" && "Create Account"}
                    {mode === "forgot" && "Send Reset Link"}
                  </Button>
                </form>

                <div className="mt-6 text-center space-y-2">
                  {mode === "forgot" ? (
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-luxury-champagne hover:underline font-medium"
                    >
                      Back to Sign In
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMode(mode === "login" ? "signup" : "login")}
                      className="text-luxury-champagne hover:underline font-medium"
                    >
                      {mode === "login" 
                        ? "Don't have an account? Create one" 
                        : "Already have an account? Sign in"
                      }
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
