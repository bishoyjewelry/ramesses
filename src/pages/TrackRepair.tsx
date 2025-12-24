import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { 
  Search, 
  Loader2, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  UserPlus
} from "lucide-react";
import { z } from "zod";

// Validation schemas
const emailSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  repairId: z.string().trim().min(1, "Repair ID is required")
});

const phoneSchema = z.object({
  phone: z.string().trim().min(10, "Please enter a valid phone number"),
  repairId: z.string().trim().min(1, "Repair ID is required")
});

type TrackingMethod = 'email' | 'phone';

interface RepairResult {
  id: string;
  status: string;
  description: string;
  fulfillment_method: string;
  updated_at: string;
  item_type: string;
  repair_type: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending Review", color: "bg-amber-100 text-amber-800", icon: Clock },
  quoted: { label: "Quote Sent", color: "bg-blue-100 text-blue-800", icon: Package },
  approved: { label: "Quote Approved", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  in_progress: { label: "In Progress", color: "bg-purple-100 text-purple-800", icon: Package },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  shipped: { label: "Shipped", color: "bg-sky-100 text-sky-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
};

const FULFILLMENT_LABELS: Record<string, string> = {
  mail_in: "Shipped",
  drop_off: "Drop-Off",
  courier: "Courier Pickup"
};

export default function TrackRepair() {
  const { user } = useAuth();
  const [trackingMethod, setTrackingMethod] = useState<TrackingMethod>('email');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [repairId, setRepairId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RepairResult | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Rate limiting - max 5 attempts per session
    if (attempts >= 5) {
      setError("Too many attempts. Please try again later or contact support.");
      return;
    }

    // Validate input
    try {
      if (trackingMethod === 'email') {
        emailSchema.parse({ email, repairId });
      } else {
        phoneSchema.parse({ phone, repairId });
      }
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0].message);
        return;
      }
    }

    setIsLoading(true);
    setAttempts(prev => prev + 1);

    try {
      // Use edge function for secure guest tracking
      const { data, error: fnError } = await supabase.functions.invoke('track-repair', {
        body: {
          repairId: repairId.trim(),
          email: trackingMethod === 'email' ? email.trim() : undefined,
          phone: trackingMethod === 'phone' ? phone.trim() : undefined
        }
      });

      if (fnError) {
        console.error('Tracking function error:', fnError);
        setError("Unable to look up repair. Please try again.");
        return;
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.repair) {
        setResult(data.repair as RepairResult);
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return STATUS_LABELS[status] || { label: status, color: "bg-muted text-muted-foreground", icon: Package };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Track Your Repair
            </h1>
            <p className="text-muted-foreground">
              Enter your repair details below to check the current status.
            </p>
          </div>

          {/* Tracking Form */}
          {!result && (
            <Card className="border-border">
              <CardContent className="p-6">
                {/* Method Toggle */}
                <div className="flex gap-2 mb-6">
                  <Button
                    type="button"
                    variant={trackingMethod === 'email' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setTrackingMethod('email')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={trackingMethod === 'phone' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setTrackingMethod('phone')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {trackingMethod === 'email' ? (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="repairId">Repair ID</Label>
                    <Input
                      id="repairId"
                      type="text"
                      placeholder="e.g., abc123-def456-..."
                      value={repairId}
                      onChange={(e) => setRepairId(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      You can find your Repair ID in your confirmation email.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Looking up...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Track Repair
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              <Card className="border-border overflow-hidden">
                <CardContent className="p-0">
                  {/* Status Header */}
                  <div className="p-6 bg-muted/30 border-b border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">Repair Status</span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(result.status).color}`}>
                        {(() => {
                          const StatusIcon = getStatusInfo(result.status).icon;
                          return <StatusIcon className="h-4 w-4" />;
                        })()}
                        {getStatusInfo(result.status).label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Repair ID: {result.id}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Item Description</p>
                      <p className="text-foreground">
                        {result.item_type && result.repair_type 
                          ? `${result.item_type} - ${result.repair_type}`
                          : result.description || 'Jewelry Repair'}
                      </p>
                    </div>

                    <div className="flex gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Service Method</p>
                        <p className="text-foreground flex items-center gap-1.5">
                          <Truck className="h-4 w-4" />
                          {FULFILLMENT_LABELS[result.fulfillment_method] || result.fulfillment_method || 'Mail-In'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                        <p className="text-foreground flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {formatDate(result.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account CTA */}
              {!user && (
                <Card className="border-border bg-muted/30">
                  <CardContent className="p-6 text-center">
                    <UserPlus className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-medium text-foreground mb-1">
                      Create an Account
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Save your repairs and get automatic status updates via email.
                    </p>
                    <Link to="/auth?mode=signup">
                      <Button variant="outline" size="sm">
                        Create Account
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Search Again */}
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setResult(null);
                  setRepairId("");
                }}
              >
                Track Another Repair
              </Button>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Need help? <Link to="/contact" className="underline hover:text-foreground">Contact us</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
