import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Loader2, 
  FileCheck, 
  RefreshCw, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Share2,
  Copy,
  Check
} from "lucide-react";

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
  inspiration_image_urls: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  custom_inquiry_id: string | null;
}

// Customer-facing status labels (does NOT expose internal SLA or admin info)
const CUSTOMER_STATUS_MAP: Record<string, { label: string; description: string; color: string }> = {
  draft: { 
    label: 'Draft', 
    description: 'Design saved but not yet sent for review.',
    color: 'bg-muted text-muted-foreground'
  },
  saved: { 
    label: 'Draft', 
    description: 'Design saved but not yet sent for review.',
    color: 'bg-muted text-muted-foreground'
  },
  submitted_for_cad: { 
    label: 'Under Review', 
    description: 'Your design is being reviewed by our team.',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  },
  new: { 
    label: 'Under Review', 
    description: 'Your design is being reviewed by our team.',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  },
  reviewed: { 
    label: 'Quote Pending', 
    description: 'We\'re preparing a quote for your design.',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  },
  quoted: { 
    label: 'Quote Ready', 
    description: 'Your quote is ready for review.',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  },
  approved: { 
    label: 'Approved', 
    description: 'Your design has been approved and is queued for CAD.',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
  },
  in_cad: { 
    label: 'In Progress', 
    description: 'Our CAD team is working on your design.',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  },
  cad_complete: { 
    label: 'Final Review', 
    description: 'CAD work is complete. Awaiting final approval.',
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
  },
  production_ready: { 
    label: 'In Production', 
    description: 'Your piece is being crafted by our master jewelers.',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  },
  completed: { 
    label: 'Complete', 
    description: 'Your custom piece is ready!',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  declined: { 
    label: 'Closed', 
    description: 'This inquiry has been closed.',
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400'
  },
};

const DesignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [design, setDesign] = useState<UserDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isSubmittingCAD, setIsSubmittingCAD] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [inputsOpen, setInputsOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const shareUrl = design ? `${window.location.origin}/design/${design.id}` : "";

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      toast.success("Share link copied to clipboard");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?redirect=/my-designs/${id}`);
      return;
    }
    
    if (user && id) {
      fetchDesign();
    }
  }, [user, authLoading, id, navigate]);

  const fetchDesign = async () => {
    try {
      const { data, error } = await supabase
        .from('user_designs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error("Design not found");
        navigate('/my-designs');
        return;
      }

      // Verify ownership
      if (data.user_id !== user?.id) {
        toast.error("You don't have permission to view this design");
        navigate('/my-designs');
        return;
      }

      setDesign(data as UserDesign);
      setActiveImage(data.hero_image_url);
    } catch (error) {
      console.error('Error fetching design:', error);
      toast.error("Failed to load design");
      navigate('/my-designs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForCAD = async () => {
    if (!user || !design) return;
    
    setIsSubmittingCAD(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-design-for-cad', {
        body: { design_id: design.id }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success("Your design has been submitted for CAD review.");
        setDesign({ ...design, status: 'submitted_for_cad' });
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

  const handleGenerateVariations = async () => {
    if (!user || !design) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-variations-from-design', {
        body: {
          design_id: design.id,
          num_concepts: 2
        }
      });

      if (error) throw error;

      if (data?.success && data.design_ids?.length > 0) {
        toast.success(`${data.design_ids.length} new variations added to My Designs`);
      } else {
        toast.error(data?.error || "No variations were created. Please try again.");
      }
    } catch (error: any) {
      console.error('Error generating variations:', error);
      if (error?.message?.includes('429') || error?.status === 429) {
        toast.error("Rate limit exceeded. Please try again in a moment.");
      } else if (error?.message?.includes('402') || error?.status === 402) {
        toast.error("Credits exhausted. Please add credits to continue.");
      } else {
        toast.error("Failed to create variations. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this design?")) return;
    
    setIsDeleting(true);
    try {
      // Soft delete by setting status to archived
      const { error } = await supabase
        .from('user_designs')
        .update({ status: 'archived' })
        .eq('id', design?.id);

      if (error) throw error;

      toast.success("Design deleted");
      navigate('/my-designs');
    } catch (error) {
      console.error('Error deleting design:', error);
      toast.error("Failed to delete design");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusLabel = (status: string) => {
    return CUSTOMER_STATUS_MAP[status]?.label || status;
  };

  const getStatusColor = (status: string) => {
    return CUSTOMER_STATUS_MAP[status]?.color || 'bg-gray-100 text-gray-700';
  };

  const getStatusDescription = (status: string) => {
    return CUSTOMER_STATUS_MAP[status]?.description || '';
  };

  const thumbnails = [
    { url: design?.hero_image_url, label: 'Hero' },
    { url: design?.side_image_url, label: 'Side' },
    { url: design?.top_image_url, label: 'Top' }
  ].filter(t => t.url);

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

  if (!design) {
    return (
      <div className="min-h-screen bg-luxury-bg pb-mobile-nav">
        <Navigation />
        <div className="flex items-center justify-center py-40">
          <p className="text-luxury-text-muted">Design not found</p>
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
          <div className="max-w-6xl mx-auto">
            {/* Back Link */}
            <Link 
              to="/my-designs" 
              className="inline-flex items-center text-luxury-text-muted hover:text-luxury-champagne mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Designs
            </Link>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-luxury-bg-warm rounded-lg overflow-hidden">
                  {activeImage ? (
                    <img 
                      src={activeImage} 
                      alt={design.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-luxury-champagne/30" />
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {thumbnails.length > 1 && (
                  <div className="flex gap-3">
                    {thumbnails.map((thumb, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(thumb.url || null)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          activeImage === thumb.url 
                            ? 'border-luxury-champagne' 
                            : 'border-transparent hover:border-luxury-champagne/50'
                        }`}
                      >
                        <img 
                          src={thumb.url!} 
                          alt={thumb.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Inspiration Images */}
                {design.inspiration_image_urls && design.inspiration_image_urls.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-luxury-text mb-3">Inspiration</h3>
                    <div className="flex gap-3 flex-wrap">
                      {design.inspiration_image_urls.map((url, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden bg-luxury-bg-warm">
                          <img 
                            src={url} 
                            alt={`Inspiration ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Details Panel */}
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-luxury-bg-warm text-luxury-text">
                      {design.flow_type === 'engagement' ? 'Engagement Ring' : 'Custom Jewelry'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(design.status)}`}>
                      {getStatusLabel(design.status)}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif text-luxury-text mb-2">
                    {design.name}
                  </h1>
                </div>

                {/* Overview */}
                {design.overview && (
                  <p className="text-luxury-text-muted leading-relaxed">
                    {design.overview}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-luxury-divider">
                  {(design.status === 'draft' || design.status === 'saved') && (
                    <Button
                      onClick={handleSubmitForCAD}
                      disabled={isSubmittingCAD}
                      className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover"
                    >
                      {isSubmittingCAD ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-4 h-4 mr-2" />
                          Send to Designer
                        </>
                      )}
                    </Button>
                  )}

                  {design.status !== 'draft' && design.status !== 'saved' && (
                    <div className="bg-muted/30 border border-border px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(design.status)}`}>
                          {getStatusLabel(design.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{getStatusDescription(design.status)}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Last updated: {new Date(design.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleGenerateVariations}
                    disabled={isGenerating}
                    className="w-full border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate New Variations
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Design
                      </>
                    )}
                  </Button>

                  {/* Share Link */}
                  <div className="pt-3 border-t border-luxury-divider">
                    <p className="text-xs text-luxury-text-muted mb-2">Share this design (view-only)</p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={shareUrl}
                        className="flex-1 text-xs px-3 py-2 bg-luxury-bg rounded border border-luxury-divider text-luxury-text-muted"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyShareLink}
                        className="border-luxury-divider"
                      >
                        {linkCopied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                {design.spec_sheet && (
                  <Collapsible open={specsOpen} onOpenChange={setSpecsOpen}>
                    <Card className="border-luxury-divider">
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-luxury-bg-warm/50 transition-colors">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            Specifications
                            {specsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="space-y-3 text-sm">
                            {renderSpecifications(design.spec_sheet)}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                )}

                {/* Original Inputs */}
                {design.form_inputs && Object.keys(design.form_inputs).length > 0 && (
                  <Collapsible open={inputsOpen} onOpenChange={setInputsOpen}>
                    <Card className="border-luxury-divider">
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-luxury-bg-warm/50 transition-colors">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            Original Inputs
                            {inputsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {Object.entries(design.form_inputs).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-luxury-text-muted capitalize block">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                                </span>
                                <span className="text-luxury-text">
                                  {String(value) || 'Not specified'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Helper function to render specifications with pretty formatting
function renderSpecifications(spec: Record<string, unknown>) {
  const specFields = [
    { key: 'metal', label: 'Metal' },
    { key: 'center_stone', label: 'Center Stone', isObject: true },
    { key: 'setting_style', label: 'Setting Style' },
    { key: 'band', label: 'Band', isObject: true },
    { key: 'gallery_details', label: 'Gallery Details' },
    { key: 'prongs', label: 'Prongs' },
    { key: 'accent_stones', label: 'Accent Stones' },
    { key: 'manufacturing_notes', label: 'Manufacturing Notes' }
  ];

  return specFields.map(({ key, label, isObject }) => {
    const value = spec[key];
    if (!value) return null;

    if (isObject && typeof value === 'object') {
      return (
        <div key={key} className="border-b border-luxury-divider pb-3 last:border-0">
          <span className="text-luxury-text font-medium block mb-1">{label}</span>
          <div className="pl-3 space-y-1">
            {Object.entries(value as Record<string, unknown>).map(([subKey, subValue]) => (
              <div key={subKey} className="flex justify-between">
                <span className="text-luxury-text-muted capitalize">
                  {subKey.replace(/_/g, ' ')}:
                </span>
                <span className="text-luxury-text text-right">
                  {String(subValue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={key} className="flex justify-between border-b border-luxury-divider pb-2 last:border-0">
        <span className="text-luxury-text-muted">{label}</span>
        <span className="text-luxury-text text-right max-w-[60%]">{String(value)}</span>
      </div>
    );
  });
}

export default DesignDetail;
