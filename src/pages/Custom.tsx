import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { LoginModal } from "@/components/LoginModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Sparkles, Gem, Heart, ArrowRight, CheckCircle2, MessageCircle, Palette, FileCheck, Package } from "lucide-react";
import { SimpleSelect } from "@/components/SimpleSelect";

type DesignFlow = "general" | "engagement" | null;

const Custom = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const styleParam = searchParams.get('style');
  
  const [activeFlow, setActiveFlow] = useState<DesignFlow>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  
  // Set mode from URL params on mount
  useEffect(() => {
    if (modeParam === 'engagement') {
      setActiveFlow('engagement');
      if (styleParam) {
        setEngagementForm(prev => ({ ...prev, style: styleParam }));
      }
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (modeParam === 'general') {
      setActiveFlow('general');
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [modeParam, styleParam]);
  
  // General jewelry form state
  const [generalForm, setGeneralForm] = useState({
    pieceType: "",
    metal: "",
    stonePreferences: "",
    budget: "",
    description: "",
  });
  
  // Engagement ring form state
  const [engagementForm, setEngagementForm] = useState({
    style: styleParam || "",
    centerStoneType: "",
    centerStoneSize: "",
    metal: "",
    ringSize: "",
    budget: "",
    specialRequests: "",
  });
  
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (uploadedImages.length + files.length > 6) {
        toast.error("Maximum 6 images allowed");
        return;
      }
      setUploadedImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCardSelect = (flow: DesignFlow) => {
    setActiveFlow(flow);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = activeFlow === "engagement" ? {
        piece_type: `Engagement Ring - ${engagementForm.style || 'Custom'}`,
        description: `Style: ${engagementForm.style}\nCenter Stone: ${engagementForm.centerStoneType} (${engagementForm.centerStoneSize})\nMetal: ${engagementForm.metal}\nRing Size: ${engagementForm.ringSize}\n\nSpecial Requests:\n${engagementForm.specialRequests}`,
        budget_range: engagementForm.budget,
        name: user.email?.split('@')[0] || 'Customer',
        email: user.email || '',
        user_id: user.id,
      } : {
        piece_type: generalForm.pieceType,
        description: `Metal: ${generalForm.metal}\nStone Preferences: ${generalForm.stonePreferences}\n\nDescription:\n${generalForm.description}`,
        budget_range: generalForm.budget,
        name: user.email?.split('@')[0] || 'Customer',
        email: user.email || '',
        user_id: user.id,
      };
      
      const { error } = await supabase
        .from('custom_inquiries')
        .insert([formData]);
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast.success("Your custom project request has been received!");
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const processSteps = [
    { step: 1, title: "Share Your Inspiration", icon: MessageCircle },
    { step: 2, title: "We Design 3–5 Concepts", icon: Palette },
    { step: 3, title: "Approve the Final CAD", icon: FileCheck },
    { step: 4, title: "Cast, Set & Polish in NYC", icon: Gem },
    { step: 5, title: "Ships Fully Insured", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-luxury-bg">
      <Navigation />
      
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 bg-luxury-bg overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-luxury-champagne/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-champagne/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-champagne/15 border border-luxury-champagne/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-luxury-champagne" />
              <span className="text-sm font-medium text-luxury-text">Ramessés Custom Lab</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif luxury-heading text-luxury-text mb-6 leading-tight">
              Start Your Custom Jewelry Project
            </h1>
            
            <p className="text-lg md:text-xl text-luxury-text-muted mb-12 max-w-3xl mx-auto leading-relaxed font-body">
              Work directly with a NYC master jeweler to create a custom engagement ring, redesign an heirloom piece, or bring any idea to life.
            </p>
          </div>
        </div>
      </section>

      {/* SELECTION CARDS */}
      <section className="py-12 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Engagement Ring Card - Premium emphasized */}
            <div 
              className={`relative group cursor-pointer rounded-2xl border-2 p-8 transition-all duration-300 ${
                activeFlow === 'engagement'
                  ? 'border-luxury-champagne bg-luxury-champagne/10 shadow-xl'
                  : 'border-luxury-divider bg-white hover:border-luxury-champagne/50 hover:shadow-luxury'
              }`}
              onClick={() => handleCardSelect('engagement')}
            >
              {/* Premium badge */}
              <div className="absolute -top-3 left-6 px-3 py-1 bg-luxury-champagne text-luxury-text text-xs font-semibold rounded-full">
                Most Popular
              </div>
              
              <div className="flex items-start gap-5">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  activeFlow === 'engagement' ? 'bg-luxury-champagne' : 'bg-luxury-champagne/20'
                }`}>
                  <Heart className={`w-8 h-8 ${activeFlow === 'engagement' ? 'text-luxury-text' : 'text-luxury-champagne'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-serif text-luxury-text mb-2">Design an Engagement Ring</h3>
                  <p className="text-luxury-text-muted font-body mb-4 leading-relaxed">
                    Custom engagement rings with stone selection, setting styles, and premium craftsmanship.
                  </p>
                  <Button 
                    className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardSelect('engagement');
                    }}
                  >
                    Start Engagement Ring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Any Jewelry Card */}
            <div 
              className={`relative group cursor-pointer rounded-2xl border-2 p-8 transition-all duration-300 ${
                activeFlow === 'general'
                  ? 'border-luxury-champagne bg-luxury-champagne/10 shadow-xl'
                  : 'border-luxury-divider bg-white hover:border-luxury-champagne/50 hover:shadow-luxury'
              }`}
              onClick={() => handleCardSelect('general')}
            >
              <div className="flex items-start gap-5">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  activeFlow === 'general' ? 'bg-luxury-champagne' : 'bg-luxury-champagne/20'
                }`}>
                  <Gem className={`w-8 h-8 ${activeFlow === 'general' ? 'text-luxury-text' : 'text-luxury-champagne'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-serif text-luxury-text mb-2">Design Any Jewelry</h3>
                  <p className="text-luxury-text-muted font-body mb-4 leading-relaxed">
                    Rings, pendants, chains, earrings, bracelets, redesigns, and more.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-luxury-champagne text-luxury-champagne hover:bg-luxury-champagne hover:text-luxury-text font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardSelect('general');
                    }}
                  >
                    Start Custom Jewelry
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section ref={formRef} className="py-16 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {isSubmitted ? (
              <Card className="border-2 border-luxury-champagne/30 shadow-luxury rounded-2xl">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-luxury-champagne/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-luxury-champagne" />
                  </div>
                  <h3 className="text-2xl font-serif text-luxury-text mb-4">
                    Your custom project request has been received!
                  </h3>
                  <p className="text-luxury-text-muted text-lg font-body">
                    A master jeweler will review your ideas and contact you shortly.
                  </p>
                </CardContent>
              </Card>
            ) : activeFlow ? (
              <Card className="border border-luxury-divider shadow-luxury rounded-2xl bg-white">
                <CardContent className="p-8 md:p-10">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif text-luxury-text mb-2">
                      {activeFlow === 'engagement' ? 'Design Your Engagement Ring' : 'Design Your Custom Piece'}
                    </h2>
                    <p className="text-luxury-text-muted">Fill out the details below and we'll follow up with design options.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {activeFlow === "general" ? (
                      <>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Jewelry Type</Label>
                          <SimpleSelect
                            value={generalForm.pieceType}
                            onValueChange={(value) => setGeneralForm({...generalForm, pieceType: value})}
                            placeholder="Select jewelry type"
                            options={[
                              { value: "ring", label: "Ring" },
                              { value: "pendant", label: "Pendant" },
                              { value: "chain", label: "Chain" },
                              { value: "bracelet", label: "Bracelet" },
                              { value: "earrings", label: "Earrings" },
                              { value: "redesign", label: "Redesign / Heirloom" },
                              { value: "other", label: "Other" },
                            ]}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Metal Preference</Label>
                          <SimpleSelect
                            value={generalForm.metal}
                            onValueChange={(value) => setGeneralForm({...generalForm, metal: value})}
                            placeholder="Select metal"
                            options={[
                              { value: "14k-yellow", label: "14k Yellow Gold" },
                              { value: "14k-white", label: "14k White Gold" },
                              { value: "14k-rose", label: "14k Rose Gold" },
                              { value: "18k", label: "18k Gold" },
                              { value: "platinum", label: "Platinum" },
                              { value: "silver", label: "Silver" },
                              { value: "not-sure", label: "Not Sure Yet" },
                            ]}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Stone Preferences (optional)</Label>
                          <Textarea
                            value={generalForm.stonePreferences}
                            onChange={(e) => setGeneralForm({...generalForm, stonePreferences: e.target.value})}
                            placeholder="E.g., Diamond center stone, sapphire accents, no stones..."
                            rows={2}
                            className="border-luxury-divider focus:border-luxury-champagne bg-white rounded-lg font-body"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Budget Range</Label>
                          <SimpleSelect
                            value={generalForm.budget}
                            onValueChange={(value) => setGeneralForm({...generalForm, budget: value})}
                            placeholder="Select budget range"
                            options={[
                              { value: "500-1000", label: "$500 – $1,000" },
                              { value: "1000-2500", label: "$1,000 – $2,500" },
                              { value: "2500-5000", label: "$2,500 – $5,000" },
                              { value: "5000-10000", label: "$5,000 – $10,000" },
                              { value: "10000+", label: "$10,000+" },
                            ]}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Project Description</Label>
                          <Textarea
                            value={generalForm.description}
                            onChange={(e) => setGeneralForm({...generalForm, description: e.target.value})}
                            placeholder="Tell us about your vision — style, details, occasion, or any specific requirements..."
                            rows={4}
                            className="border-luxury-divider focus:border-luxury-champagne resize-none bg-white rounded-lg font-body"
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Ring Style</Label>
                          <SimpleSelect
                            value={engagementForm.style}
                            onValueChange={(value) => setEngagementForm({...engagementForm, style: value})}
                            placeholder="Select ring style"
                            options={[
                              { value: "solitaire", label: "Solitaire" },
                              { value: "hidden-halo", label: "Hidden Halo" },
                              { value: "halo", label: "Halo" },
                              { value: "three-stone", label: "Three-Stone" },
                              { value: "pave", label: "Pavé" },
                              { value: "vintage", label: "Vintage" },
                              { value: "other", label: "Other / Custom" },
                            ]}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Center Stone Type</Label>
                          <SimpleSelect
                            value={engagementForm.centerStoneType}
                            onValueChange={(value) => setEngagementForm({...engagementForm, centerStoneType: value})}
                            placeholder="Select stone type"
                            options={[
                              { value: "natural-diamond", label: "Natural Diamond" },
                              { value: "lab-diamond", label: "Lab-Grown Diamond" },
                              { value: "moissanite", label: "Moissanite" },
                              { value: "sapphire", label: "Sapphire" },
                              { value: "emerald", label: "Emerald" },
                              { value: "ruby", label: "Ruby" },
                              { value: "other", label: "Other Gemstone" },
                            ]}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Approximate Size</Label>
                          <SimpleSelect
                            value={engagementForm.centerStoneSize}
                            onValueChange={(value) => setEngagementForm({...engagementForm, centerStoneSize: value})}
                            placeholder="Select approximate size"
                            options={[
                              { value: "0.5-0.75", label: "0.5 – 0.75 carat" },
                              { value: "0.75-1.0", label: "0.75 – 1.0 carat" },
                              { value: "1.0-1.5", label: "1.0 – 1.5 carat" },
                              { value: "1.5-2.0", label: "1.5 – 2.0 carat" },
                              { value: "2.0-3.0", label: "2.0 – 3.0 carat" },
                              { value: "3.0+", label: "3.0+ carat" },
                            ]}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Metal Preference</Label>
                          <SimpleSelect
                            value={engagementForm.metal}
                            onValueChange={(value) => setEngagementForm({...engagementForm, metal: value})}
                            placeholder="Select metal"
                            options={[
                              { value: "14k-yellow", label: "14k Yellow Gold" },
                              { value: "14k-white", label: "14k White Gold" },
                              { value: "14k-rose", label: "14k Rose Gold" },
                              { value: "18k", label: "18k Gold" },
                              { value: "platinum", label: "Platinum" },
                            ]}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Ring Size (if known)</Label>
                          <Input
                            value={engagementForm.ringSize}
                            onChange={(e) => setEngagementForm({...engagementForm, ringSize: e.target.value})}
                            placeholder="E.g., 6, 7.5, or 'not sure yet'"
                            className="border-luxury-divider focus:border-luxury-champagne bg-white rounded-lg font-body"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Budget Range</Label>
                          <SimpleSelect
                            value={engagementForm.budget}
                            onValueChange={(value) => setEngagementForm({...engagementForm, budget: value})}
                            placeholder="Select budget range"
                            options={[
                              { value: "1000-2500", label: "$1,000 – $2,500" },
                              { value: "2500-5000", label: "$2,500 – $5,000" },
                              { value: "5000-10000", label: "$5,000 – $10,000" },
                              { value: "10000-20000", label: "$10,000 – $20,000" },
                              { value: "20000+", label: "$20,000+" },
                            ]}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-luxury-text">Special Requests (optional)</Label>
                          <Textarea
                            value={engagementForm.specialRequests}
                            onChange={(e) => setEngagementForm({...engagementForm, specialRequests: e.target.value})}
                            placeholder="E.g., hidden diamond detail, custom engraving, timeline needs..."
                            rows={3}
                            className="border-luxury-divider focus:border-luxury-champagne bg-white rounded-lg font-body"
                          />
                        </div>
                      </>
                    )}
                    
                    {/* Image Upload */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-luxury-text">Inspiration Images (optional, up to 6)</Label>
                      <div className="border-2 border-dashed border-luxury-divider rounded-xl p-6 text-center hover:border-luxury-champagne/50 transition-colors bg-luxury-bg/50">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-luxury-text-muted mx-auto mb-2" />
                          <p className="text-sm text-luxury-text-muted font-body">Click to upload inspiration photos</p>
                        </label>
                      </div>
                      
                      {uploadedImages.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {uploadedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="w-16 h-16 bg-luxury-bg-warm rounded-lg flex items-center justify-center overflow-hidden">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover py-6 text-lg font-semibold rounded-lg shadow-luxury"
                    >
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Submit Project Request
                        </>
                      )}
                    </Button>
                    
                    {!user && (
                      <p className="text-center text-sm text-luxury-text-muted">
                        You'll be asked to sign in before submitting.
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-16">
                <Gem className="w-16 h-16 text-luxury-champagne/50 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-luxury-text mb-2">Select a project type above to get started</h3>
                <p className="text-luxury-text-muted">Choose "Engagement Ring" or "Any Jewelry" to begin your custom design.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-text mb-4">
              How Our Custom Process Works
            </h2>
            <p className="text-luxury-text-muted max-w-2xl mx-auto">
              From inspiration to finished piece, we guide you every step of the way.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {processSteps.map((step) => (
                <div key={step.step} className="text-center relative">
                  <div className="w-14 h-14 bg-luxury-champagne/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-luxury-champagne">
                    <step.icon className="w-6 h-6 text-luxury-champagne" />
                  </div>
                  <div className="text-xs font-semibold text-luxury-champagne mb-1">Step {step.step}</div>
                  <h3 className="text-sm font-medium text-luxury-text leading-snug">{step.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-service-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Why Work With Ramessés
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Master Jeweler Quality", desc: "30+ years of Diamond District expertise in every piece" },
              { title: "Transparent Pricing", desc: "Know exactly what you're paying for—no hidden fees" },
              { title: "Unlimited Revisions", desc: "We refine until you're 100% satisfied with the design" },
              { title: "Made in NYC", desc: "Designed and crafted on 47th Street" },
              { title: "1-on-1 Support", desc: "Work directly with your dedicated jeweler" },
              { title: "Insured Shipping", desc: "Fully insured nationwide delivery" },
            ].map((item, index) => (
              <div key={index} className="bg-service-bg-secondary rounded-xl p-6 border border-service-gold/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-service-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-service-text-muted">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-text mb-4">
              Ready to Start Your Custom Project?
            </h2>
            <p className="text-lg text-luxury-text-muted mb-8">
              Choose your path and let's create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/custom?mode=engagement">
                <Button size="lg" className="w-full sm:w-auto bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold px-8">
                  Start Engagement Ring
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/custom?mode=general">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 font-semibold px-8">
                  Start Custom Jewelry
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        redirectTo="/custom"
      />
    </div>
  );
};

export default Custom;
