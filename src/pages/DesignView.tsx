import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Lock
} from "lucide-react";

interface UserDesign {
  id: string;
  name: string;
  overview: string | null;
  flow_type: string;
  spec_sheet: Record<string, unknown> | null;
  hero_image_url: string | null;
  side_image_url: string | null;
  top_image_url: string | null;
  status: string;
  created_at: string;
}

// Public view-only page for shared designs
const DesignView = () => {
  const { id } = useParams<{ id: string }>();
  
  const [design, setDesign] = useState<UserDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDesign();
    }
  }, [id]);

  const fetchDesign = async () => {
    try {
      // Use service role or anon key - this is a public view
      const { data, error } = await supabase
        .from('user_designs')
        .select('id, name, overview, flow_type, spec_sheet, hero_image_url, side_image_url, top_image_url, status, created_at')
        .eq('id', id)
        .neq('status', 'archived')
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        setNotFound(true);
        return;
      }

      setDesign(data as UserDesign);
      setActiveImage(data.hero_image_url);
    } catch (error) {
      console.error('Error fetching design:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'Draft',
      saved: 'Draft',
      submitted_for_cad: 'In Review',
      in_cad: 'In Production',
      quoted: 'Quoted',
      completed: 'Completed'
    };
    return statusMap[status] || status;
  };

  const thumbnails = [
    { url: design?.hero_image_url, label: 'Hero' },
    { url: design?.side_image_url, label: 'Side' },
    { url: design?.top_image_url, label: 'Top' }
  ].filter(t => t.url);

  if (loading) {
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

  if (notFound || !design) {
    return (
      <div className="min-h-screen bg-luxury-bg pb-mobile-nav">
        <Navigation />
        <div className="flex flex-col items-center justify-center py-40 px-4">
          <Lock className="w-16 h-16 text-luxury-champagne/30 mb-4" />
          <h1 className="text-2xl font-serif text-luxury-text mb-2">Design Not Found</h1>
          <p className="text-luxury-text-muted mb-6 text-center">This design may have been removed or the link is invalid.</p>
          <Link to="/custom">
            <Button className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover">
              Create Your Own Design
            </Button>
          </Link>
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
            {/* View-only notice */}
            <div className="bg-luxury-bg-warm border border-luxury-divider rounded-lg px-4 py-3 mb-6 text-center">
              <p className="text-sm text-luxury-text-muted">
                You're viewing a shared design. <Link to="/custom" className="text-luxury-champagne hover:underline">Create your own</Link>
              </p>
            </div>

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
              </div>

              {/* Right: Details Panel */}
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-luxury-bg-warm text-luxury-text">
                      {design.flow_type === 'engagement' ? 'Engagement Ring' : 'Custom Jewelry'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-luxury-champagne/20 text-luxury-text">
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

                {/* CTA */}
                <div className="space-y-3 pt-4 border-t border-luxury-divider">
                  <p className="text-sm text-luxury-text-muted">Like this design? Create something similar.</p>
                  <Link to="/custom">
                    <Button className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Your Custom Design
                    </Button>
                  </Link>
                </div>

                {/* Specifications (limited view) */}
                {design.spec_sheet && (
                  <Collapsible open={specsOpen} onOpenChange={setSpecsOpen}>
                    <Card className="border-luxury-divider">
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-luxury-bg-warm/50 transition-colors">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            Design Details
                            {specsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            {design.spec_sheet.metal && (
                              <div className="flex justify-between">
                                <span className="text-luxury-text-muted">Metal</span>
                                <span className="text-luxury-text">{String(design.spec_sheet.metal)}</span>
                              </div>
                            )}
                            {design.spec_sheet.setting_style && (
                              <div className="flex justify-between">
                                <span className="text-luxury-text-muted">Setting</span>
                                <span className="text-luxury-text">{String(design.spec_sheet.setting_style)}</span>
                              </div>
                            )}
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

export default DesignView;