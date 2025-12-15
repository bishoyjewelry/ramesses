import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Plus, RefreshCw, FileCheck, Trash2, ChevronDown, ChevronUp, Loader2, ArrowLeft } from "lucide-react";

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
}

const MyDesigns = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<UserDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<UserDesign | null>(null);
  const [showSpecs, setShowSpecs] = useState(false);
  const [isSubmittingCAD, setIsSubmittingCAD] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleSubmitForCAD = async (design: UserDesign) => {
    if (!user) return;
    
    setIsSubmittingCAD(true);
    try {
      // Create a custom inquiry linked to this design
      const { data: inquiry, error: inquiryError } = await supabase
        .from('custom_inquiries')
        .insert([{
          piece_type: design.flow_type === 'engagement' ? 'Engagement Ring' : 'Custom Jewelry',
          description: `AI Design: ${design.name}\n\n${design.overview || ''}\n\nSpec Sheet: ${JSON.stringify(design.spec_sheet, null, 2)}`,
          budget_range: (design.form_inputs as Record<string, string>)?.budget || 'Not specified',
          name: user.email?.split('@')[0] || 'Customer',
          email: user.email || '',
          user_id: user.id,
          image_urls: [design.hero_image_url, design.side_image_url, design.top_image_url].filter(Boolean) as string[]
        }])
        .select()
        .single();

      if (inquiryError) throw inquiryError;

      // Update design status
      const { error: updateError } = await supabase
        .from('user_designs')
        .update({ 
          status: 'submitted_for_cad',
          cad_submitted_at: new Date().toISOString(),
          custom_inquiry_id: inquiry.id
        })
        .eq('id', design.id);

      if (updateError) throw updateError;

      toast.success("Your selected design has been sent to our 47th Street jeweler for CAD review.");
      setSelectedDesign(null);
      fetchDesigns();
    } catch (error) {
      console.error('Error submitting for CAD:', error);
      toast.error("Failed to submit design. Please try again.");
    } finally {
      setIsSubmittingCAD(false);
    }
  };

  const handleDelete = async (designId: string) => {
    if (!confirm("Are you sure you want to delete this design?")) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('user_designs')
        .delete()
        .eq('id', designId);

      if (error) throw error;

      toast.success("Design deleted");
      setSelectedDesign(null);
      fetchDesigns();
    } catch (error) {
      console.error('Error deleting design:', error);
      toast.error("Failed to delete design");
    } finally {
      setIsDeleting(false);
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
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif text-luxury-text mb-2">My Designs</h1>
                <p className="text-luxury-text-muted">Your saved AI-generated jewelry concepts</p>
              </div>
              <Link to="/custom">
                <Button className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Design
                </Button>
              </Link>
            </div>

            {/* Designs Grid */}
            {designs.length === 0 ? (
              <Card className="border-luxury-divider">
                <CardContent className="py-16 text-center">
                  <Sparkles className="w-16 h-16 text-luxury-champagne/30 mx-auto mb-4" />
                  <h3 className="text-xl font-serif text-luxury-text mb-2">No designs yet</h3>
                  <p className="text-luxury-text-muted mb-6">Start creating AI-powered jewelry concepts</p>
                  <Link to="/custom">
                    <Button className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover">
                      Start Designing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {designs.map((design) => (
                  <Card 
                    key={design.id}
                    className="border-luxury-divider hover:border-luxury-champagne/50 transition-colors cursor-pointer overflow-hidden"
                    onClick={() => setSelectedDesign(design)}
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
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-serif text-luxury-text truncate">{design.name}</h3>
                          <p className="text-xs text-luxury-text-muted mt-1">
                            {new Date(design.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                          design.status === 'submitted_for_cad' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-luxury-champagne/20 text-luxury-text'
                        }`}>
                          {design.status === 'submitted_for_cad' ? 'Submitted' : 'Saved'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Design Detail Modal */}
      <Dialog open={!!selectedDesign} onOpenChange={() => setSelectedDesign(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDesign && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-serif">{selectedDesign.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Images */}
                <div className="grid grid-cols-3 gap-3">
                  {['hero', 'side', 'top'].map((view) => {
                    const imageUrl = selectedDesign[`${view}_image_url` as keyof UserDesign] as string;
                    return (
                      <div key={view} className="aspect-square bg-luxury-bg-warm rounded-lg overflow-hidden">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={`${view} view`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-luxury-text-muted text-xs uppercase">
                            {view}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Overview */}
                {selectedDesign.overview && (
                  <p className="text-luxury-text-muted">{selectedDesign.overview}</p>
                )}

                {/* Specs */}
                {selectedDesign.spec_sheet && (
                  <div>
                    <button
                      onClick={() => setShowSpecs(!showSpecs)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-luxury-bg rounded-lg text-sm font-medium text-luxury-text hover:bg-luxury-bg-warm transition-colors"
                    >
                      <span>Full Specifications</span>
                      {showSpecs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {showSpecs && (
                      <div className="mt-3 bg-luxury-bg rounded-lg p-4 text-sm space-y-2">
                        <pre className="whitespace-pre-wrap text-luxury-text font-mono text-xs">
                          {JSON.stringify(selectedDesign.spec_sheet, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Original Inputs */}
                <div className="bg-luxury-bg rounded-lg p-4">
                  <h4 className="text-sm font-medium text-luxury-text mb-2">Original Inputs</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedDesign.form_inputs).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-luxury-text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="ml-1 text-luxury-text">{String(value) || 'Not specified'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-luxury-divider">
                  {selectedDesign.status !== 'submitted_for_cad' && (
                    <>
                      <Button
                        onClick={() => handleSubmitForCAD(selectedDesign)}
                        disabled={isSubmittingCAD}
                        className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover"
                      >
                        {isSubmittingCAD ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FileCheck className="w-4 h-4 mr-2" />
                            Submit for CAD Review
                          </>
                        )}
                      </Button>
                      <Link to={`/custom?regenerate=${selectedDesign.id}`}>
                        <Button variant="outline" className="border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate Variations
                        </Button>
                      </Link>
                    </>
                  )}
                  
                  {selectedDesign.status === 'submitted_for_cad' && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                      <FileCheck className="w-4 h-4" />
                      <span className="text-sm font-medium">Submitted for CAD Review</span>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(selectedDesign.id)}
                    disabled={isDeleting}
                    className="border-red-200 text-red-600 hover:bg-red-50 ml-auto"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
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

export default MyDesigns;
