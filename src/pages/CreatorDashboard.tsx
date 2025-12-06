import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Calendar,
  Eye,
  Mail,
  HelpCircle,
  Palette,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";

interface CreatorProfile {
  id: string;
  display_name: string;
  status: string;
  created_at: string;
  bio: string | null;
  location: string | null;
  profile_image_url: string | null;
  user_id: string;
}

interface Design {
  id: string;
  title: string;
  description: string | null;
  main_image_url: string;
  gallery_image_urls: string[] | null;
  category: string;
  base_price: number;
  status: string;
  allowed_metals: string[] | null;
  commission_type: string;
  commission_value: number;
  created_at: string;
  is_featured: boolean;
}

interface Earning {
  id: string;
  period: string;
  sale_amount: number;
  commission_amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
  design_id: string | null;
  designs?: { title: string } | null;
}

const CreatorDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  
  // Earnings stats
  const [thisMonthEarnings, setThisMonthEarnings] = useState(0);
  const [totalPaidOut, setTotalPaidOut] = useState(0);
  const [lifetimeSales, setLifetimeSales] = useState(0);

  useEffect(() => {
    if (user) {
      loadCreatorData();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const loadCreatorData = async () => {
    if (!user) return;
    
    try {
      // Check if user has an active creator profile
      const { data: profile, error: profileError } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      if (profileError) throw profileError;
      
      if (!profile) {
        setIsLoading(false);
        return;
      }
      
      setCreatorProfile(profile);
      
      // Load designs
      const { data: designsData, error: designsError } = await supabase
        .from('designs')
        .select('*')
        .eq('creator_profile_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (designsError) throw designsError;
      setDesigns(designsData || []);
      
      // Load earnings with design info
      const { data: earningsData, error: earningsError } = await supabase
        .from('creator_earnings')
        .select('*, designs(title)')
        .eq('creator_profile_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (earningsError) throw earningsError;
      setEarnings(earningsData || []);
      
      // Calculate earnings stats
      const currentMonth = format(new Date(), 'yyyy-MM');
      
      const thisMonth = (earningsData || [])
        .filter(e => e.period === currentMonth && ['pending', 'ready_to_pay', 'paid'].includes(e.status))
        .reduce((sum, e) => sum + Number(e.commission_amount), 0);
      
      const paidOut = (earningsData || [])
        .filter(e => e.status === 'paid')
        .reduce((sum, e) => sum + Number(e.commission_amount), 0);
      
      const lifetime = (earningsData || [])
        .reduce((sum, e) => sum + Number(e.sale_amount), 0);
      
      setThisMonthEarnings(thisMonth);
      setTotalPaidOut(paidOut);
      setLifetimeSales(lifetime);
      
    } catch (error) {
      console.error('Error loading creator data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700",
      pending_approval: "bg-yellow-100 text-yellow-700",
      published: "bg-green-100 text-green-700",
      archived: "bg-gray-100 text-gray-500",
      rejected: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700",
      ready_to_pay: "bg-blue-100 text-blue-700",
      paid: "bg-green-100 text-green-700",
    };
    
    return (
      <Badge className={`${statusStyles[status] || 'bg-gray-100 text-gray-700'} border-0`}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-luxury-bg">
        <Navigation />
        <div className="pt-32 pb-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-luxury-champagne" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-luxury-bg">
        <Navigation />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 bg-luxury-champagne/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-10 h-10 text-luxury-champagne" />
              </div>
              <h1 className="text-3xl font-serif luxury-heading text-luxury-text mb-4">
                Sign In to Access Your Creator Dashboard
              </h1>
              <p className="text-luxury-text-muted mb-8">
                Please sign in to view your designs, earnings, and creator profile.
              </p>
              <Link to="/auth?mode=login&redirect=/creator">
                <Button className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover px-8 py-6 text-lg font-semibold rounded-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not an active creator
  if (!creatorProfile) {
    return (
      <div className="min-h-screen bg-luxury-bg">
        <Navigation />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 bg-luxury-champagne/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-10 h-10 text-luxury-champagne" />
              </div>
              <h1 className="text-3xl font-serif luxury-heading text-luxury-text mb-4">
                You are not an active Ramessés Creator yet.
              </h1>
              <p className="text-luxury-text-muted mb-8">
                Join our creator community to publish your custom designs and earn commissions when others order them.
              </p>
              <Link to="/marketplace#apply">
                <Button className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover px-8 py-6 text-lg font-semibold rounded-lg">
                  Apply to Become a Creator
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
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
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif luxury-heading text-luxury-text mb-4">
              Welcome, {creatorProfile.display_name}
            </h1>
            <div className="w-24 h-1 bg-luxury-champagne mb-6"></div>
            
            <div className="flex flex-wrap gap-6 text-luxury-text-muted">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700 border-0">
                  {creatorProfile.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {format(new Date(creatorProfile.created_at), 'MMMM yyyy')}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Earnings Summary */}
          <section className="mb-12">
            <h2 className="text-2xl font-serif luxury-heading text-luxury-text mb-6">
              Earnings Summary
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-luxury-divider shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-luxury-champagne/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-luxury-champagne" />
                    </div>
                    <div>
                      <p className="text-sm text-luxury-text-muted">This Month's Earnings</p>
                      <p className="text-2xl font-bold text-luxury-text">${thisMonthEarnings.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-luxury-divider shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-luxury-text-muted">Total Paid Out</p>
                      <p className="text-2xl font-bold text-luxury-text">${totalPaidOut.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-luxury-divider shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-luxury-text-muted">Total Lifetime Sales</p>
                      <p className="text-2xl font-bold text-luxury-text">${lifetimeSales.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 2: My Designs */}
          <section className="mb-12">
            <h2 className="text-2xl font-serif luxury-heading text-luxury-text mb-6">
              My Designs
            </h2>
            
            {designs.length === 0 ? (
              <Card className="border-luxury-divider shadow-soft">
                <CardContent className="p-12 text-center">
                  <Palette className="w-12 h-12 text-luxury-text-muted mx-auto mb-4" />
                  <p className="text-luxury-text-muted">No designs yet. Your published designs will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designs.map((design) => (
                  <Card key={design.id} className="border-luxury-divider shadow-soft overflow-hidden">
                    <div className="aspect-square bg-luxury-bg-warm">
                      {design.main_image_url ? (
                        <img 
                          src={design.main_image_url} 
                          alt={design.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Palette className="w-12 h-12 text-luxury-text-muted/50" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-luxury-text truncate">{design.title}</h3>
                        {getStatusBadge(design.status)}
                      </div>
                      <p className="text-luxury-champagne font-bold mb-3">${Number(design.base_price).toFixed(2)}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-luxury-text-muted">
                          {format(new Date(design.created_at), 'MMM d, yyyy')}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedDesign(design)}
                          className="border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Section 3: Recent Earnings */}
          <section className="mb-12">
            <h2 className="text-2xl font-serif luxury-heading text-luxury-text mb-6">
              Recent Earnings
            </h2>
            
            {earnings.length === 0 ? (
              <Card className="border-luxury-divider shadow-soft">
                <CardContent className="p-12 text-center">
                  <DollarSign className="w-12 h-12 text-luxury-text-muted mx-auto mb-4" />
                  <p className="text-luxury-text-muted">No earnings yet. Your commission earnings will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-luxury-divider shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-luxury-bg-warm">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-luxury-text">Period</th>
                        <th className="text-left p-4 text-sm font-semibold text-luxury-text">Design</th>
                        <th className="text-right p-4 text-sm font-semibold text-luxury-text">Sale Amount</th>
                        <th className="text-right p-4 text-sm font-semibold text-luxury-text">Commission</th>
                        <th className="text-center p-4 text-sm font-semibold text-luxury-text">Status</th>
                        <th className="text-left p-4 text-sm font-semibold text-luxury-text">Paid At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-luxury-divider">
                      {earnings.map((earning) => (
                        <tr key={earning.id} className="hover:bg-luxury-bg-warm/50">
                          <td className="p-4 text-luxury-text">{earning.period}</td>
                          <td className="p-4 text-luxury-text">{earning.designs?.title || '-'}</td>
                          <td className="p-4 text-right text-luxury-text">${Number(earning.sale_amount).toFixed(2)}</td>
                          <td className="p-4 text-right font-semibold text-luxury-champagne">
                            ${Number(earning.commission_amount).toFixed(2)}
                          </td>
                          <td className="p-4 text-center">{getStatusBadge(earning.status)}</td>
                          <td className="p-4 text-luxury-text-muted">
                            {earning.paid_at ? format(new Date(earning.paid_at), 'MMM d, yyyy') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </section>

          {/* Section 4: Help & Support */}
          <section>
            <Card className="border-luxury-divider shadow-soft">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-luxury-champagne/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-luxury-champagne" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif luxury-heading text-luxury-text mb-2">
                      Help & Support
                    </h3>
                    <p className="text-luxury-text-muted">
                      Have questions about your designs or payouts? Contact support at{" "}
                      <a 
                        href="mailto:creators@ramesses.com" 
                        className="text-luxury-champagne hover:underline font-medium"
                      >
                        creators@ramesses.com
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Design Detail Dialog */}
      <Dialog open={!!selectedDesign} onOpenChange={() => setSelectedDesign(null)}>
        <DialogContent className="max-w-2xl bg-luxury-bg border-luxury-divider max-h-[90vh] overflow-y-auto">
          {selectedDesign && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif luxury-heading text-luxury-text">
                  {selectedDesign.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                {/* Main Image */}
                <div className="aspect-video bg-luxury-bg-warm rounded-lg overflow-hidden">
                  {selectedDesign.main_image_url ? (
                    <img 
                      src={selectedDesign.main_image_url} 
                      alt={selectedDesign.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Palette className="w-16 h-16 text-luxury-text-muted/50" />
                    </div>
                  )}
                </div>
                
                {/* Gallery Images */}
                {selectedDesign.gallery_image_urls && selectedDesign.gallery_image_urls.length > 0 && (
                  <div>
                    <h4 className="font-medium text-luxury-text mb-2">Gallery</h4>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedDesign.gallery_image_urls.map((url, index) => (
                        <img 
                          key={index}
                          src={url} 
                          alt={`Gallery ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Description */}
                {selectedDesign.description && (
                  <div>
                    <h4 className="font-medium text-luxury-text mb-2">Description</h4>
                    <p className="text-luxury-text-muted">{selectedDesign.description}</p>
                  </div>
                )}
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-luxury-text mb-1">Category</h4>
                    <p className="text-luxury-text-muted capitalize">{selectedDesign.category}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-luxury-text mb-1">Base Price</h4>
                    <p className="text-luxury-champagne font-bold">${Number(selectedDesign.base_price).toFixed(2)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-luxury-text mb-1">Status</h4>
                    {getStatusBadge(selectedDesign.status)}
                  </div>
                  <div>
                    <h4 className="font-medium text-luxury-text mb-1">Commission</h4>
                    <p className="text-luxury-text-muted">
                      {selectedDesign.commission_value}
                      {selectedDesign.commission_type === 'percentage' ? '%' : ' (fixed)'}
                    </p>
                  </div>
                </div>
                
                {/* Allowed Metals */}
                {selectedDesign.allowed_metals && selectedDesign.allowed_metals.length > 0 && (
                  <div>
                    <h4 className="font-medium text-luxury-text mb-2">Allowed Metals</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDesign.allowed_metals.map((metal) => (
                        <Badge key={metal} variant="outline" className="border-luxury-divider">
                          {metal.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default CreatorDashboard;
