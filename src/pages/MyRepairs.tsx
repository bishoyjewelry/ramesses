import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Loader2, 
  Wrench, 
  Eye,
  LogIn,
  UserPlus,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  Package,
  Sparkles,
  AlertCircle,
  Mail,
  X,
  Check,
  CreditCard,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { ProgressTracker, mapRepairStatusToProgress } from "@/components/ProgressTracker";

interface RepairQuote {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  item_type: string | null;
  repair_type: string | null;
  description: string;
  image_urls: string[] | null;
  status: string | null;
  quoted_price: number | null;
  approved: boolean | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string | null;
  payment_status: string | null;
  payment_link_url: string | null;
  shopify_order_id: string | null;
  approved_at: string | null;
}

const MyRepairs = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [repairs, setRepairs] = useState<RepairQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState<RepairQuote | null>(null);
  const [isCreatingPaymentLink, setIsCreatingPaymentLink] = useState(false);

  useEffect(() => {
    if (user) {
      loadRepairs();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const loadRepairs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('repair_quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRepairs(data || []);
    } catch (error) {
      console.error('Error loading repairs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAndPay = async (repairId: string) => {
    setIsCreatingPaymentLink(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-repair-payment-link', {
        body: { repair_id: repairId },
      });
      
      if (error) throw error;
      
      if (data?.payment_link_url) {
        // Open payment link in new tab
        window.open(data.payment_link_url, '_blank');
        toast.success("Payment page opened in new tab");
        
        // Update local state
        if (selectedRepair?.id === repairId) {
          setSelectedRepair({ 
            ...selectedRepair, 
            payment_status: 'pending',
            payment_link_url: data.payment_link_url 
          });
        }
        loadRepairs();
      } else {
        throw new Error("No payment link returned");
      }
    } catch (error: any) {
      console.error('Error creating payment link:', error);
      toast.error(error.message || "Failed to create payment link. Please try again.");
    } finally {
      setIsCreatingPaymentLink(false);
    }
  };

  // Status timeline configuration
  const statusSteps = [
    { key: 'pending', label: 'Submitted', icon: Clock, description: 'Your request is being reviewed' },
    { key: 'received', label: 'Received', icon: Package, description: 'We have your item in our workshop' },
    { key: 'in_progress', label: 'In Progress', icon: Wrench, description: 'Repair work is underway' },
    { key: 'polishing', label: 'Polishing', icon: Sparkles, description: 'Final finishing touches' },
    { key: 'awaiting_parts', label: 'Awaiting Parts', icon: AlertCircle, description: 'Waiting for required materials' },
    { key: 'completed', label: 'Completed', icon: CheckCircle, description: 'Repair is complete' },
    { key: 'shipped', label: 'Shipped', icon: Truck, description: 'On its way back to you' },
  ];

  const getStatusIndex = (status: string | null) => {
    const idx = statusSteps.findIndex(s => s.key === (status || 'pending'));
    return idx >= 0 ? idx : 0;
  };

  const getStatusBadge = (status: string | null) => {
    const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Submitted" },
      received: { bg: "bg-blue-100", text: "text-blue-700", label: "Received" },
      in_progress: { bg: "bg-purple-100", text: "text-purple-700", label: "In Progress" },
      polishing: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Polishing" },
      awaiting_parts: { bg: "bg-orange-100", text: "text-orange-700", label: "Awaiting Parts" },
      completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
      shipped: { bg: "bg-teal-100", text: "text-teal-700", label: "Shipped" },
    };
    
    const style = statusStyles[status || 'pending'] || statusStyles.pending;
    
    return (
      <Badge className={`${style.bg} ${style.text} border-0`}>
        {style.label}
      </Badge>
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-service-gold" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 bg-service-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wrench className="w-10 h-10 text-service-gold" />
              </div>
              <h1 className="text-3xl font-sans service-heading font-bold text-luxury-text mb-4">
                Sign In to View Your Repair History
              </h1>
              <p className="text-luxury-text-muted mb-8">
                Track your repair status, view quotes, and access your repair history.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?mode=login&redirect=/my-repairs">
                  <Button className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded w-full sm:w-auto">
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup&redirect=/my-repairs">
                  <Button variant="outline" className="border-2 border-service-gold text-service-gold hover:bg-service-gold/10 px-8 py-6 text-lg font-semibold rounded w-full sm:w-auto">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-sans service-heading font-bold text-luxury-text mb-4">
              My Repairs
            </h1>
            <div className="w-24 h-1 bg-service-gold mb-6"></div>
            <p className="text-luxury-text-muted">
              Track your repair requests and view your history.
            </p>
          </div>

          {repairs.length === 0 ? (
            <Card className="border-luxury-divider shadow-soft">
              <CardContent className="p-12 text-center">
                <Wrench className="w-16 h-16 text-luxury-text-muted/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-luxury-text mb-2">No Repairs Yet</h3>
                <p className="text-luxury-text-muted mb-6">
                  You haven't submitted any repair requests yet.
                </p>
                <Link to="/repairs">
                  <Button className="bg-service-gold text-white hover:bg-service-gold-hover px-6 py-5 font-semibold rounded">
                    Start a Repair Request
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {repairs.map((repair) => (
                <Card key={repair.id} className="border-luxury-divider shadow-soft hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-luxury-text text-lg capitalize">
                            {repair.item_type || 'Jewelry'} Repair
                          </h3>
                          {getStatusBadge(repair.status)}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-luxury-text-muted">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Submitted {format(new Date(repair.created_at), 'MMM d, yyyy')}</span>
                          </div>
                          
                          {repair.quoted_price && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>Quote: ${Number(repair.quoted_price).toFixed(2)}</span>
                            </div>
                          )}
                          
                          {repair.payment_status === 'paid' ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Paid</span>
                            </div>
                          ) : repair.approved ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Approved</span>
                            </div>
                          ) : repair.quoted_price && (
                            <div className="flex items-center gap-1 text-amber-600">
                              <CreditCard className="w-4 h-4" />
                              <span>Awaiting Payment</span>
                            </div>
                          )}
                          
                          {repair.tracking_number && (
                            <div className="flex items-center gap-1">
                              <Truck className="w-4 h-4" />
                              <span>Tracking: {repair.tracking_number}</span>
                            </div>
                          )}
                        </div>
                        
                        {repair.repair_type && (
                          <p className="text-luxury-text-muted mt-2 line-clamp-1">
                            {repair.repair_type}
                          </p>
                        )}
                      </div>
                      
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedRepair(repair)}
                        className="border-service-gold text-service-gold hover:bg-service-gold/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Start New Repair CTA */}
          {repairs.length > 0 && (
            <div className="mt-12 text-center">
              <Link to="/repairs">
                <Button className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded">
                  Start Another Repair
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Repair Detail Drawer */}
      <Sheet open={!!selectedRepair} onOpenChange={() => setSelectedRepair(null)}>
        <SheetContent className="w-full sm:max-w-xl bg-white border-luxury-divider overflow-y-auto">
          {selectedRepair && (
            <>
              <SheetHeader className="pb-6 border-b border-luxury-divider">
                <SheetTitle className="text-2xl font-sans font-bold text-luxury-text">
                  Repair Details
                </SheetTitle>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-lg capitalize text-luxury-text-muted">
                    {selectedRepair.item_type || 'Jewelry'} Repair
                  </span>
                  {getStatusBadge(selectedRepair.status)}
                </div>
              </SheetHeader>
              
              <div className="space-y-8 py-6">
                {/* Progress Tracker - Horizontal Bar */}
                <div className="bg-muted/30 rounded-lg p-6">
                  <ProgressTracker 
                    currentStep={mapRepairStatusToProgress(selectedRepair.status)}
                    showReassurance={true}
                  />
                </div>

                {/* Repair ID & Dates */}
                <div className="bg-service-neutral/30 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-luxury-text-muted">Repair ID</span>
                      <p className="font-mono text-luxury-text text-xs mt-1">{selectedRepair.id.slice(0, 8)}...</p>
                    </div>
                    <div>
                      <span className="text-luxury-text-muted">Submitted</span>
                      <p className="text-luxury-text mt-1">{format(new Date(selectedRepair.created_at), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <span className="text-luxury-text-muted">Last Updated</span>
                      <p className="text-luxury-text mt-1">
                        {selectedRepair.updated_at 
                          ? format(new Date(selectedRepair.updated_at), 'MMM d, yyyy h:mm a')
                          : 'Not yet updated'}
                      </p>
                    </div>
                    <div>
                      <span className="text-luxury-text-muted">Repair Type</span>
                      <p className="text-luxury-text mt-1 capitalize">{selectedRepair.repair_type || 'General'}</p>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div>
                  <h4 className="font-semibold text-luxury-text mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-service-gold" />
                    Status Timeline
                  </h4>
                  <div className="relative">
                    {statusSteps.map((step, index) => {
                      const currentIndex = getStatusIndex(selectedRepair.status);
                      const isCompleted = index < currentIndex;
                      const isCurrent = index === currentIndex;
                      const isFuture = index > currentIndex;
                      const StepIcon = step.icon;
                      
                      return (
                        <div key={step.key} className="flex items-start gap-4 pb-6 last:pb-0">
                          {/* Timeline Line */}
                          <div className="flex flex-col items-center">
                            <div className={`
                              w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                              ${isCompleted 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : isCurrent 
                                  ? 'bg-service-gold border-service-gold text-white animate-pulse' 
                                  : 'bg-white border-luxury-divider text-luxury-text-muted'}
                            `}>
                              {isCompleted ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <StepIcon className="w-5 h-5" />
                              )}
                            </div>
                            {index < statusSteps.length - 1 && (
                              <div className={`w-0.5 h-12 mt-2 ${
                                isCompleted ? 'bg-green-500' : 'bg-luxury-divider'
                              }`} />
                            )}
                          </div>
                          
                          {/* Step Content */}
                          <div className={`pt-2 ${isFuture ? 'opacity-40' : ''}`}>
                            <p className={`font-medium ${isCurrent ? 'text-service-gold' : 'text-luxury-text'}`}>
                              {step.label}
                            </p>
                            <p className="text-sm text-luxury-text-muted mt-0.5">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-luxury-text mb-2">Description</h4>
                  <p className="text-luxury-text-muted bg-service-neutral/30 rounded-lg p-4">
                    {selectedRepair.description || 'No description provided'}
                  </p>
                </div>

                {/* Uploaded Images */}
                {selectedRepair.image_urls && selectedRepair.image_urls.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-luxury-text mb-3">Submitted Photos</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedRepair.image_urls.map((url, index) => (
                        <a 
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aspect-square rounded-lg overflow-hidden border border-luxury-divider hover:border-service-gold transition-colors"
                        >
                          <img 
                            src={url} 
                            alt={`Repair photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quote & Payment Status */}
                {selectedRepair.quoted_price && (
                  <div className="bg-service-gold/10 border border-service-gold/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-luxury-text flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-service-gold" />
                        Quote Details
                      </h4>
                      <span className="text-2xl font-bold text-service-gold">
                        ${Number(selectedRepair.quoted_price).toFixed(2)}
                      </span>
                    </div>
                    
                    {selectedRepair.payment_status === 'paid' ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Paid – Repair in queue</span>
                        </div>
                        {selectedRepair.approved_at && (
                          <p className="text-sm text-luxury-text-muted">
                            Approved on {format(new Date(selectedRepair.approved_at), 'MMM d, yyyy h:mm a')}
                          </p>
                        )}
                        {selectedRepair.shopify_order_id && (
                          <p className="text-xs text-luxury-text-muted font-mono">
                            Order: #{selectedRepair.shopify_order_id}
                          </p>
                        )}
                      </div>
                    ) : selectedRepair.approved ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Quote Approved</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-luxury-text-muted">
                          Review and pay to start your repair.
                        </p>
                        <Button 
                          onClick={() => handleApproveAndPay(selectedRepair.id)}
                          disabled={isCreatingPaymentLink}
                          className="w-full bg-service-gold text-white hover:bg-service-gold-hover font-semibold"
                        >
                          {isCreatingPaymentLink ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating Payment Link...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Approve & Pay Online
                            </>
                          )}
                        </Button>
                        
                        {selectedRepair.payment_status === 'pending' && selectedRepair.payment_link_url && (
                          <Button
                            variant="outline"
                            onClick={() => window.open(selectedRepair.payment_link_url!, '_blank')}
                            className="w-full border-service-gold text-service-gold hover:bg-service-gold/10"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Resume Payment
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tracking Information */}
                {selectedRepair.tracking_number && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-luxury-text flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      Shipping Information
                    </h4>
                    <div className="text-sm">
                      <span className="text-luxury-text-muted">Tracking Number:</span>
                      <p className="font-mono text-blue-600 mt-1">{selectedRepair.tracking_number}</p>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="border-t border-luxury-divider pt-6">
                  <h4 className="font-semibold text-luxury-text mb-3">Your Contact Info</h4>
                  <div className="text-sm text-luxury-text-muted space-y-2 bg-service-neutral/30 rounded-lg p-4">
                    <p><span className="font-medium text-luxury-text">Name:</span> {selectedRepair.name}</p>
                    <p><span className="font-medium text-luxury-text">Email:</span> {selectedRepair.email}</p>
                    {selectedRepair.phone && (
                      <p><span className="font-medium text-luxury-text">Phone:</span> {selectedRepair.phone}</p>
                    )}
                  </div>
                </div>

                {/* Help & Support */}
                <div className="border-t border-luxury-divider pt-6">
                  <h4 className="font-semibold text-luxury-text mb-2">Need Help?</h4>
                  <p className="text-sm text-luxury-text-muted mb-4">
                    Have questions about this repair? Our support team is here to help.
                  </p>
                  <a 
                    href="mailto:support@ramessesjewelry.com?subject=Repair%20Inquiry%20-%20" 
                    className="inline-flex items-center gap-2 text-service-gold hover:text-service-gold-hover font-medium transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Support About This Repair
                  </a>
                </div>

                {/* Close Button */}
                <Button 
                  variant="outline"
                  onClick={() => setSelectedRepair(null)}
                  className="w-full border-luxury-divider text-luxury-text hover:bg-service-neutral/50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
};

export default MyRepairs;
