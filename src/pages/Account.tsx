import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  Wrench, 
  Eye,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  User,
  Mail,
  Pencil,
  Gem,
  Palette,
  TrendingUp,
  ExternalLink,
  ImageIcon
} from "lucide-react";
import { format } from "date-fns";

interface RepairQuote {
  id: string;
  name: string;
  email: string;
  item_type: string | null;
  repair_type: string | null;
  description: string;
  image_urls: string[] | null;
  status: string | null;
  quoted_price: number | null;
  approved: boolean | null;
  tracking_number: string | null;
  created_at: string;
  payment_status: string | null;
}

interface CustomInquiry {
  id: string;
  name: string;
  email: string;
  piece_type: string;
  description: string;
  image_urls: string[] | null;
  status: string | null;
  budget_range: string | null;
  created_at: string;
}

interface CreatorProfile {
  id: string;
  display_name: string;
  status: string;
}

interface CreatorStats {
  designCount: number;
  totalEarnings: number;
  pendingEarnings: number;
}

const Account = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [repairs, setRepairs] = useState<RepairQuote[]>([]);
  const [customInquiries, setCustomInquiries] = useState<CustomInquiry[]>([]);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [creatorStats, setCreatorStats] = useState<CreatorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState<RepairQuote | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<CustomInquiry | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?mode=login&redirect=/account");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      // Load repairs
      const { data: repairsData } = await supabase
        .from('repair_quotes')
        .select('id, name, email, item_type, repair_type, description, image_urls, status, quoted_price, approved, tracking_number, created_at, payment_status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRepairs(repairsData || []);

      // Load custom inquiries
      const { data: inquiriesData } = await supabase
        .from('custom_inquiries')
        .select('id, name, email, piece_type, description, image_urls, status, budget_range, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      setCustomInquiries(inquiriesData || []);

      // Check creator profile
      const { data: profileData } = await supabase
        .from('creator_profiles')
        .select('id, display_name, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      setCreatorProfile(profileData);

      if (profileData) {
        // Load creator stats
        const { count: designCount } = await supabase
          .from('designs')
          .select('*', { count: 'exact', head: true })
          .eq('creator_profile_id', profileData.id);

        const { data: earningsData } = await supabase
          .from('creator_earnings')
          .select('commission_amount, status')
          .eq('creator_profile_id', profileData.id);

        const totalEarnings = earningsData?.reduce((sum, e) => sum + Number(e.commission_amount), 0) || 0;
        const pendingEarnings = earningsData?.filter(e => e.status === 'pending' || e.status === 'ready_to_pay')
          .reduce((sum, e) => sum + Number(e.commission_amount), 0) || 0;

        setCreatorStats({
          designCount: designCount || 0,
          totalEarnings,
          pendingEarnings
        });
      }
    } catch (error) {
      console.error('Error loading account data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string | null, type: 'repair' | 'inquiry' = 'repair') => {
    const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
      received: { bg: "bg-blue-100", text: "text-blue-700", label: "Received" },
      in_progress: { bg: "bg-purple-100", text: "text-purple-700", label: "In Progress" },
      completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
      shipped: { bg: "bg-teal-100", text: "text-teal-700", label: "Shipped" },
      quoted: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Quoted" },
      approved: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <Card className="border-luxury-divider shadow-soft mb-8">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-service-gold/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-service-gold" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-sans font-bold text-luxury-text">
                      My Account
                    </h1>
                    <div className="flex items-center gap-2 text-luxury-text-muted mt-1">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="border-service-gold text-service-gold hover:bg-service-gold/10"
                  disabled
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="repairs" className="w-full">
            <TabsList className="w-full md:w-auto grid grid-cols-3 bg-service-neutral/50 p-1 rounded-lg mb-8">
              <TabsTrigger 
                value="repairs" 
                className="data-[state=active]:bg-white data-[state=active]:text-service-gold data-[state=active]:shadow-sm"
              >
                <Wrench className="w-4 h-4 mr-2 hidden sm:inline" />
                My Repairs
              </TabsTrigger>
              <TabsTrigger 
                value="custom" 
                className="data-[state=active]:bg-white data-[state=active]:text-service-gold data-[state=active]:shadow-sm"
              >
                <Gem className="w-4 h-4 mr-2 hidden sm:inline" />
                Custom Requests
              </TabsTrigger>
              {creatorProfile && (
                <TabsTrigger 
                  value="creator" 
                  className="data-[state=active]:bg-white data-[state=active]:text-service-gold data-[state=active]:shadow-sm"
                >
                  <Palette className="w-4 h-4 mr-2 hidden sm:inline" />
                  Creator
                </TabsTrigger>
              )}
            </TabsList>

            {/* Repairs Tab */}
            <TabsContent value="repairs">
              <Card className="border-luxury-divider shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between border-b border-luxury-divider">
                  <CardTitle className="text-xl font-sans text-luxury-text">Recent Repairs</CardTitle>
                  <Link to="/my-repairs">
                    <Button variant="ghost" size="sm" className="text-service-gold hover:text-service-gold-hover">
                      View All
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  {repairs.length === 0 ? (
                    <div className="p-8 text-center">
                      <Wrench className="w-12 h-12 text-luxury-text-muted/50 mx-auto mb-3" />
                      <p className="text-luxury-text-muted mb-4">No repair requests yet</p>
                      <Link to="/repairs">
                        <Button className="bg-service-gold text-white hover:bg-service-gold-hover">
                          Start a Repair
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-luxury-divider">
                      {repairs.map((repair) => (
                        <div 
                          key={repair.id} 
                          className="p-4 hover:bg-service-neutral/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedRepair(repair)}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-luxury-text capitalize truncate">
                                  {repair.item_type || 'Jewelry'} Repair
                                </span>
                                {getStatusBadge(repair.status)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-luxury-text-muted">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(new Date(repair.created_at), 'MMM d, yyyy')}
                                </span>
                                {repair.quoted_price && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    ${Number(repair.quoted_price).toFixed(2)}
                                  </span>
                                )}
                                {repair.payment_status === 'paid' && (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                    Paid
                                  </span>
                                )}
                              </div>
                            </div>
                            <Eye className="w-5 h-5 text-luxury-text-muted" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom Requests Tab */}
            <TabsContent value="custom">
              <Card className="border-luxury-divider shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between border-b border-luxury-divider">
                  <CardTitle className="text-xl font-sans text-luxury-text">Custom Jewelry Requests</CardTitle>
                  <Link to="/custom">
                    <Button variant="ghost" size="sm" className="text-service-gold hover:text-service-gold-hover">
                      New Request
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  {customInquiries.length === 0 ? (
                    <div className="p-8 text-center">
                      <Gem className="w-12 h-12 text-luxury-text-muted/50 mx-auto mb-3" />
                      <p className="text-luxury-text-muted mb-4">No custom jewelry requests yet</p>
                      <Link to="/custom">
                        <Button className="bg-service-gold text-white hover:bg-service-gold-hover">
                          Design Something Custom
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-luxury-divider">
                      {customInquiries.map((inquiry) => (
                        <div 
                          key={inquiry.id} 
                          className="p-4 hover:bg-service-neutral/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-luxury-text capitalize truncate">
                                  {inquiry.piece_type}
                                </span>
                                {getStatusBadge(inquiry.status, 'inquiry')}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-luxury-text-muted">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                                </span>
                                {inquiry.budget_range && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    {inquiry.budget_range}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Eye className="w-5 h-5 text-luxury-text-muted" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Creator Tab */}
            {creatorProfile && (
              <TabsContent value="creator">
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-luxury-divider shadow-soft">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Palette className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-luxury-text-muted">Published Designs</p>
                            <p className="text-2xl font-bold text-luxury-text">{creatorStats?.designCount || 0}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-luxury-divider shadow-soft">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-luxury-text-muted">Total Earnings</p>
                            <p className="text-2xl font-bold text-luxury-text">
                              ${creatorStats?.totalEarnings.toFixed(2) || '0.00'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-luxury-divider shadow-soft">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm text-luxury-text-muted">Pending Payout</p>
                            <p className="text-2xl font-bold text-luxury-text">
                              ${creatorStats?.pendingEarnings.toFixed(2) || '0.00'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Creator Dashboard Link */}
                  <Card className="border-luxury-divider shadow-soft">
                    <CardContent className="p-6 text-center">
                      <p className="text-luxury-text-muted mb-4">
                        Access your full creator dashboard for design management, earnings details, and more.
                      </p>
                      <Link to="/creator">
                        <Button className="bg-service-gold text-white hover:bg-service-gold-hover px-8">
                          <Palette className="w-4 h-4 mr-2" />
                          Open Creator Dashboard
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>

      {/* Repair Detail Sheet */}
      <Sheet open={!!selectedRepair} onOpenChange={() => setSelectedRepair(null)}>
        <SheetContent className="w-full sm:max-w-lg bg-white border-luxury-divider overflow-y-auto">
          {selectedRepair && (
            <>
              <SheetHeader className="pb-4 border-b border-luxury-divider">
                <SheetTitle className="text-xl font-sans text-luxury-text capitalize">
                  {selectedRepair.item_type || 'Jewelry'} Repair
                </SheetTitle>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(selectedRepair.status)}
                  {selectedRepair.payment_status === 'paid' && (
                    <Badge className="bg-green-100 text-green-700 border-0">Paid</Badge>
                  )}
                </div>
              </SheetHeader>
              
              <div className="space-y-6 py-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-luxury-text-muted">Submitted</span>
                    <p className="text-luxury-text font-medium">
                      {format(new Date(selectedRepair.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <span className="text-luxury-text-muted">Repair Type</span>
                    <p className="text-luxury-text font-medium capitalize">
                      {selectedRepair.repair_type || 'General'}
                    </p>
                  </div>
                  {selectedRepair.quoted_price && (
                    <div>
                      <span className="text-luxury-text-muted">Quoted Price</span>
                      <p className="text-luxury-text font-medium">
                        ${Number(selectedRepair.quoted_price).toFixed(2)}
                      </p>
                    </div>
                  )}
                  {selectedRepair.tracking_number && (
                    <div>
                      <span className="text-luxury-text-muted">Tracking</span>
                      <p className="text-luxury-text font-medium">
                        {selectedRepair.tracking_number}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-sm text-luxury-text-muted">Description</span>
                  <p className="text-luxury-text mt-1">{selectedRepair.description}</p>
                </div>

                {selectedRepair.image_urls && selectedRepair.image_urls.length > 0 && (
                  <div>
                    <span className="text-sm text-luxury-text-muted mb-2 block">Photos</span>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedRepair.image_urls.map((url, idx) => (
                        <img 
                          key={idx} 
                          src={url} 
                          alt={`Repair photo ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-luxury-divider"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <Link to="/my-repairs" className="block">
                  <Button className="w-full bg-service-gold text-white hover:bg-service-gold-hover">
                    View Full Details
                  </Button>
                </Link>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Custom Inquiry Detail Sheet */}
      <Sheet open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <SheetContent className="w-full sm:max-w-lg bg-white border-luxury-divider overflow-y-auto">
          {selectedInquiry && (
            <>
              <SheetHeader className="pb-4 border-b border-luxury-divider">
                <SheetTitle className="text-xl font-sans text-luxury-text capitalize">
                  {selectedInquiry.piece_type}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(selectedInquiry.status, 'inquiry')}
                </div>
              </SheetHeader>
              
              <div className="space-y-6 py-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-luxury-text-muted">Submitted</span>
                    <p className="text-luxury-text font-medium">
                      {format(new Date(selectedInquiry.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {selectedInquiry.budget_range && (
                    <div>
                      <span className="text-luxury-text-muted">Budget</span>
                      <p className="text-luxury-text font-medium">{selectedInquiry.budget_range}</p>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-sm text-luxury-text-muted">Description</span>
                  <p className="text-luxury-text mt-1">{selectedInquiry.description}</p>
                </div>

                {selectedInquiry.image_urls && selectedInquiry.image_urls.length > 0 && (
                  <div>
                    <span className="text-sm text-luxury-text-muted mb-2 block">Inspiration Images</span>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedInquiry.image_urls.map((url, idx) => (
                        <img 
                          key={idx} 
                          src={url} 
                          alt={`Inspiration ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-luxury-divider"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
};

export default Account;
