import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Plus, Loader2, ArrowLeft, Filter, SortAsc, SortDesc, Edit3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RevisionRequestModal } from "@/components/RevisionRequestModal";
import { ProgressTracker, mapDesignStatusToProgress } from "@/components/ProgressTracker";

interface UserDesign {
  id: string;
  name: string;
  overview: string | null;
  flow_type: string;
  form_inputs: Record<string, unknown>;
  spec_sheet: Record<string, unknown> | null;
  hero_image_url: string | null;
  side_image_url: string | null;
  top_image_url: string | null;
  status: string;
  created_at: string;
  revision_notes?: string | null;
  revision_requested_at?: string | null;
}

const MyDesigns = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<UserDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmittingCAD, setIsSubmittingCAD] = useState(false);
  
  // Filter & Sort state
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredDesigns = useMemo(() => {
    let result = [...designs];
    
    // Filter by type
    if (typeFilter !== "all") {
      result = result.filter(d => d.flow_type === typeFilter);
    }
    
    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(d => d.status === statusFilter);
    }
    
    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    return result;
  }, [designs, typeFilter, statusFilter, sortOrder]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/my-designs");
      return;
    }
    
    if (user) {
      fetchDesigns();
    }
  }, [user, authLoading, navigate]);

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('user_designs')
        .select('*')
        .neq('status', 'archived')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns((data || []) as UserDesign[]);
    } catch (error) {
      console.error('Error fetching designs:', error);
      toast.error("Failed to load designs");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'Draft',
      saved: 'Draft',
      submitted: 'Submitted',
      submitted_for_cad: 'Sent to Designer',
      revision_requested: 'Revision Requested',
      in_cad: 'In CAD',
      quoted: 'Quoted',
      completed: 'Completed'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
      case 'saved':
        return 'bg-luxury-champagne/20 text-luxury-text';
      case 'submitted':
      case 'submitted_for_cad':
        return 'bg-blue-100 text-blue-700';
      case 'revision_requested':
        return 'bg-orange-100 text-orange-700';
      case 'in_cad':
        return 'bg-amber-100 text-amber-700';
      case 'quoted':
        return 'bg-purple-100 text-purple-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // State for revision modal
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedDesignForRevision, setSelectedDesignForRevision] = useState<UserDesign | null>(null);

  const canRequestRevision = (status: string) => {
    return ['submitted', 'submitted_for_cad', 'quoted', 'in_cad'].includes(status);
  };

  const handleOpenRevisionModal = (design: UserDesign) => {
    setSelectedDesignForRevision(design);
    setRevisionModalOpen(true);
  };

  const activeFiltersCount = (typeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  const handleSubmitForCAD = async (design: UserDesign) => {
    if (!user) return;
    
    setIsSubmittingCAD(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-design-for-cad', {
        body: { design_id: design.id }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success("Your design has been submitted for CAD review.");
        fetchDesigns();
      } else {
        throw new Error(data?.error || "Failed to submit design");
      }
    } catch (error: any) {
      console.error('Error submitting for CAD:', error);
      toast.error(error?.message || "Failed to submit design. Please try again.");
    } finally {
      setIsSubmittingCAD(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-luxury-bg pb-mobile-nav">
        <Navigation />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-luxury-champagne" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg pb-mobile-nav">
      <Navigation />
      
      <section className="pt-20 sm:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-6xl mx-auto">
            <Link to="/account" className="inline-flex items-center text-luxury-text-muted hover:text-luxury-champagne mb-6 text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif text-luxury-text mb-2">My Designs</h1>
                <p className="text-luxury-text-muted">Your saved design inspirations — edit, refine, or send to our master jewelers.</p>
              </div>
              <Link to="/custom">
                <Button className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Design
                </Button>
              </Link>
            </div>

            {/* Filters & Sorting */}
            {designs.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-luxury-divider">
                {/* Type Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-luxury-divider text-luxury-text">
                      <Filter className="w-4 h-4 mr-2" />
                      Type: {typeFilter === "all" ? "All" : typeFilter === "engagement" ? "Engagement" : "Custom"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white border-luxury-divider">
                    <DropdownMenuItem onClick={() => setTypeFilter("all")}>All Types</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("engagement")}>Engagement Ring</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("general")}>Custom Jewelry</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-luxury-divider text-luxury-text">
                      <Filter className="w-4 h-4 mr-2" />
                      Status: {statusFilter === "all" ? "All" : getStatusLabel(statusFilter)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white border-luxury-divider">
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("submitted_for_cad")}>Sent to Designer</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("revision_requested")}>Revision Requested</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("in_cad")}>In CAD</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("quoted")}>Quoted</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-luxury-divider text-luxury-text"
                  onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
                >
                  {sortOrder === "newest" ? (
                    <><SortDesc className="w-4 h-4 mr-2" /> Newest</>
                  ) : (
                    <><SortAsc className="w-4 h-4 mr-2" /> Oldest</>
                  )}
                </Button>

                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => { setTypeFilter("all"); setStatusFilter("all"); }}
                    className="text-luxury-text-muted hover:text-luxury-text"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}

            {/* Designs Grid */}
            {filteredDesigns.length === 0 && designs.length > 0 ? (
              <Card className="border-luxury-divider">
                <CardContent className="py-16 text-center">
                  <Filter className="w-16 h-16 text-luxury-champagne/30 mx-auto mb-4" />
                  <h3 className="text-xl font-serif text-luxury-text mb-2">No designs match your filters.</h3>
                  <p className="text-luxury-text-muted mb-6">Try adjusting your filter settings.</p>
                  <Button 
                    variant="outline"
                    onClick={() => { setTypeFilter("all"); setStatusFilter("all"); }}
                    className="border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : designs.length === 0 ? (
              <Card className="border-luxury-divider">
                <CardContent className="py-16 text-center">
                  <Sparkles className="w-16 h-16 text-luxury-champagne/30 mx-auto mb-4" />
                  <h3 className="text-xl font-serif text-luxury-text mb-2">No saved designs yet.</h3>
                  <p className="text-luxury-text-muted mb-6">Use the Design Studio to create new inspirations instantly.</p>
                  <Link to="/custom">
                    <Button className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover">
                      Start Designing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDesigns.map((design) => (
                  <Card 
                    key={design.id}
                    className="border-luxury-divider hover:border-luxury-champagne/50 transition-colors overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[4/3] bg-luxury-bg-warm">
                      {design.hero_image_url ? (
                        <img 
                          src={design.hero_image_url} 
                          alt={design.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-luxury-champagne/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-luxury-bg-warm text-luxury-text">
                          {design.flow_type === 'engagement' ? 'Engagement Ring' : 'Custom Jewelry'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(design.status)}`}>
                          {getStatusLabel(design.status)}
                        </span>
                      </div>
                      <h3 className="font-serif text-luxury-text truncate mb-1">{design.name}</h3>
                      
                      {/* Progress Tracker for submitted designs */}
                      {design.status !== 'draft' && design.status !== 'saved' && (
                        <div className="my-3 py-3 border-t border-b border-luxury-divider">
                          <ProgressTracker 
                            currentStep={mapDesignStatusToProgress(design.status)}
                            showReassurance={false}
                            variant="compact"
                          />
                        </div>
                      )}
                      
                      {design.overview && (design.status === 'draft' || design.status === 'saved') && (
                        <p className="text-xs text-luxury-text-muted mb-3 line-clamp-2">
                          {design.overview.slice(0, 80)}{design.overview.length > 80 ? '...' : ''}
                        </p>
                      )}
                      <p className="text-xs text-luxury-text-muted mb-3">
                        {new Date(design.created_at).toLocaleDateString()}
                      </p>
                      <div className="mt-auto flex flex-col gap-2 pt-3 border-t border-luxury-divider">
                        <Button 
                          onClick={() => navigate(`/my-designs/${design.id}`)}
                          className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover text-sm"
                        >
                          View Details
                        </Button>
                        {(design.status === 'draft' || design.status === 'saved') && (
                          <Button 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubmitForCAD(design);
                            }}
                            disabled={isSubmittingCAD}
                            className="w-full border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text text-sm"
                          >
                            {isSubmittingCAD ? 'Submitting...' : 'Send to Designer'}
                          </Button>
                        )}
                        {canRequestRevision(design.status) && (
                          <Button 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenRevisionModal(design);
                            }}
                            className="w-full border-orange-400 text-orange-600 hover:bg-orange-50 text-sm"
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Request Changes
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Revision Request Modal */}
      {selectedDesignForRevision && (
        <RevisionRequestModal
          open={revisionModalOpen}
          onOpenChange={setRevisionModalOpen}
          designId={selectedDesignForRevision.id}
          designName={selectedDesignForRevision.name}
          onSuccess={fetchDesigns}
        />
      )}

      <Footer />
    </div>
  );
};

export default MyDesigns;