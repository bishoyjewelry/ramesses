import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  Wrench, 
  Package, 
  Eye,
  LogIn,
  UserPlus,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";

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
}

const MyRepairs = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [repairs, setRepairs] = useState<RepairQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState<RepairQuote | null>(null);

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
                          
                          {repair.approved && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Approved</span>
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

      {/* Repair Detail Dialog */}
      <Dialog open={!!selectedRepair} onOpenChange={() => setSelectedRepair(null)}>
        <DialogContent className="max-w-2xl bg-white border-luxury-divider max-h-[90vh] overflow-y-auto">
          {selectedRepair && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-sans service-heading font-bold text-luxury-text flex items-center gap-3">
                  <span className="capitalize">{selectedRepair.item_type || 'Jewelry'} Repair</span>
                  {getStatusBadge(selectedRepair.status)}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                {/* Status Timeline */}
                <div className="bg-service-neutral/50 rounded-lg p-4">
                  <h4 className="font-medium text-luxury-text mb-3">Repair Status</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedRepair.status === 'pending' ? 'bg-service-gold' : 'bg-green-500'}`}></div>
                    <span className="text-sm text-luxury-text-muted">
                      {selectedRepair.status === 'pending' ? 'Awaiting review' : 
                       selectedRepair.status === 'received' ? 'We have received your item' :
                       selectedRepair.status === 'in_progress' ? 'Repair in progress' :
                       selectedRepair.status === 'completed' ? 'Repair complete' :
                       selectedRepair.status === 'shipped' ? 'On its way back to you' :
                       'Processing'}
                    </span>
                  </div>
                </div>
                
                {/* Images */}
                {selectedRepair.image_urls && selectedRepair.image_urls.length > 0 && (
                  <div>
                    <h4 className="font-medium text-luxury-text mb-2">Submitted Photos</h4>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedRepair.image_urls.map((url, index) => (
                        <img 
                          key={index}
                          src={url} 
                          alt={`Repair photo ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Description */}
                <div>
                  <h4 className="font-medium text-luxury-text mb-2">Repair Description</h4>
                  <p className="text-luxury-text-muted">{selectedRepair.description || selectedRepair.repair_type}</p>
                </div>
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-luxury-text mb-1">Item Type</h4>
                    <p className="text-luxury-text-muted capitalize">{selectedRepair.item_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-luxury-text mb-1">Submitted</h4>
                    <p className="text-luxury-text-muted">{format(new Date(selectedRepair.created_at), 'MMMM d, yyyy')}</p>
                  </div>
                  {selectedRepair.quoted_price && (
                    <div>
                      <h4 className="font-medium text-luxury-text mb-1">Quoted Price</h4>
                      <p className="text-service-gold font-bold">${Number(selectedRepair.quoted_price).toFixed(2)}</p>
                    </div>
                  )}
                  {selectedRepair.approved !== null && (
                    <div>
                      <h4 className="font-medium text-luxury-text mb-1">Quote Approved</h4>
                      <p className="text-luxury-text-muted">{selectedRepair.approved ? 'Yes' : 'Pending'}</p>
                    </div>
                  )}
                  {selectedRepair.tracking_number && (
                    <div className="col-span-2">
                      <h4 className="font-medium text-luxury-text mb-1">Tracking Number</h4>
                      <p className="text-luxury-text-muted font-mono">{selectedRepair.tracking_number}</p>
                    </div>
                  )}
                </div>
                
                {/* Contact Info */}
                <div className="border-t border-luxury-divider pt-4">
                  <h4 className="font-medium text-luxury-text mb-2">Contact Information</h4>
                  <div className="text-sm text-luxury-text-muted space-y-1">
                    <p>{selectedRepair.name}</p>
                    <p>{selectedRepair.email}</p>
                    {selectedRepair.phone && <p>{selectedRepair.phone}</p>}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default MyRepairs;
