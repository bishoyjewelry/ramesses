import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AuthCallout } from "@/components/AuthCallout";
import { LoginModal } from "@/components/LoginModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Sparkles, PenTool, Gem, Shield, Truck, DollarSign, Crown, Users, Heart, Diamond, ArrowRight } from "lucide-react";
import { SimpleSelect } from "@/components/SimpleSelect";
import { SimpleAccordion } from "@/components/SimpleAccordion";

type DesignFlow = "any" | "engagement";

const Custom = () => {
  const { user, isCreator } = useAuth();
  const [activeFlow, setActiveFlow] = useState<DesignFlow>("engagement");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // General jewelry form state
  const [generalForm, setGeneralForm] = useState({
    pieceType: "",
    metal: "",
    stonePreferences: "",
    budget: "",
    description: "",
    deadline: "",
  });
  
  // Engagement ring form state
  const [engagementForm, setEngagementForm] = useState({
    style: "",
    centerStoneType: "",
    centerStoneSize: "",
    metal: "",
    ringSize: "",
    budget: "",
    specialRequests: "",
    timeline: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = activeFlow === "engagement" ? {
        piece_type: `Engagement Ring - ${engagementForm.style}`,
        description: `Style: ${engagementForm.style}\nCenter Stone: ${engagementForm.centerStoneType} (${engagementForm.centerStoneSize})\nMetal: ${engagementForm.metal}\nRing Size: ${engagementForm.ringSize}\nTimeline: ${engagementForm.timeline}\n\nSpecial Requests:\n${engagementForm.specialRequests}`,
        budget_range: engagementForm.budget,
        name: user.email?.split('@')[0] || 'Customer',
        email: user.email || '',
      } : {
        piece_type: generalForm.pieceType,
        description: `Metal: ${generalForm.metal}\nStone Preferences: ${generalForm.stonePreferences}\nDeadline/Occasion: ${generalForm.deadline}\n\nDescription:\n${generalForm.description}`,
        budget_range: generalForm.budget,
        name: user.email?.split('@')[0] || 'Customer',
        email: user.email || '',
      };
      
      const { error } = await supabase
        .from('custom_inquiries')
        .insert([formData]);
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast.success("Your custom design request has been submitted!");
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('custom-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-luxury-bg">
      <Navigation />
      
      {/* SECTION 1 — HERO */}
      <section className="pt-32 pb-16 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-champagne/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-luxury-champagne" />
              <span className="text-sm font-medium text-luxury-text">Ramessés Custom Lab™</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif luxury-heading text-luxury-text mb-8 leading-tight">
              Start Your Custom Jewelry Project With a 47th Street Master Jeweler
            </h1>
            
            <p className="text-lg md:text-xl text-luxury-text-muted mb-12 max-w-3xl mx-auto leading-relaxed font-body">
              Work directly with a master jeweler on NYC's Diamond District to design the exact piece you've been imagining. From engagement rings to pendants, chains, bracelets, and heirloom redesigns, our Custom Lab combines expert craftsmanship with modern tools to bring your ideas to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={scrollToForm}
                className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover px-8 py-6 text-lg font-semibold rounded-lg shadow-luxury transition-all"
              >
                Start Your Custom Design
              </Button>
              <Button 
                onClick={scrollToHowItWorks}
                variant="outline"
                className="border-2 border-luxury-text text-luxury-text hover:bg-luxury-text/5 px-8 py-6 text-lg font-semibold rounded-lg"
              >
                How It Works
              </Button>
            </div>
          </div>
          
          {/* Auth Callout - Below Hero */}
          <div className="max-w-4xl mx-auto">
            <AuthCallout redirectTo="/custom" />
          </div>
        </div>
      </section>

      {/* SECTION 2 — HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif luxury-heading text-luxury-text mb-4">
              How Our Custom Design Process Works
            </h2>
            <div className="w-24 h-1 bg-luxury-champagne mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-6">
              {[
                { step: 1, text: "Share your ideas and upload inspiration images." },
                { step: 2, text: "We propose design options and price ranges." },
                { step: 3, text: "You select a direction and we create detailed CAD models." },
                { step: 4, text: "Once approved, we cast, set, and finish your piece in NYC." },
                { step: 5, text: "We ship your finished jewelry insured and ready to wear." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-luxury-champagne rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-luxury-text">{item.step}</span>
                  </div>
                  <p className="text-luxury-text-muted font-body text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button 
              onClick={scrollToForm}
              className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover px-8 py-5 font-semibold rounded-lg shadow-luxury"
            >
              Start Your Custom Design
            </Button>
          </div>
        </div>
      </section>

      {/* ENGAGEMENT RING SPECIALIZATION BLOCK */}
      <section className="py-16 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-champagne/20 rounded-full mb-6">
              <Diamond className="w-4 h-4 text-luxury-champagne" />
              <span className="text-sm font-medium text-luxury-text">Specialized in Engagement Rings</span>
            </div>
            
            <p className="text-lg text-luxury-text-muted font-body leading-relaxed mb-8">
              We handle high-stakes engagement ring projects every day — from first-time designs to upgrades and complete redesigns. Every ring receives microscope-level setting work and thorough quality control.
            </p>
            
            <Button 
              onClick={() => {
                setActiveFlow("engagement");
                scrollToForm();
              }}
              className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover px-8 py-5 font-semibold rounded-lg"
            >
              Start a Custom Engagement Ring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — CUSTOM REQUEST FORM WITH TWO FLOWS */}
      <section id="custom-form" className="py-24 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif luxury-heading text-luxury-text mb-4">
                Start Your Custom Jewelry Project
              </h2>
              <div className="w-24 h-1 bg-luxury-champagne mx-auto"></div>
            </div>
            
            {isSubmitted ? (
              <Card className="border-2 border-luxury-champagne/30 shadow-luxury rounded-xl">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-luxury-champagne/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-luxury-champagne" />
                  </div>
                  <h3 className="text-2xl font-serif luxury-heading text-luxury-text mb-4">
                    Thanks, we've received your design!
                  </h3>
                  <p className="text-luxury-text-muted text-lg font-body">
                    A jeweler will review it and follow up with a quote.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Flow Selector Tabs */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setActiveFlow("engagement")}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      activeFlow === "engagement"
                        ? "border-luxury-champagne bg-luxury-champagne/10 shadow-luxury"
                        : "border-luxury-divider bg-luxury-bg hover:border-luxury-champagne/50"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        activeFlow === "engagement" ? "bg-luxury-champagne" : "bg-luxury-divider"
                      }`}>
                        <Heart className={`w-6 h-6 ${activeFlow === "engagement" ? "text-luxury-text" : "text-luxury-text-muted"}`} />
                      </div>
                      <h3 className="text-xl font-serif luxury-heading text-luxury-text">Design an Engagement Ring</h3>
                    </div>
                    <p className="text-luxury-text-muted font-body text-sm leading-relaxed">
                      Build a custom engagement ring with your choice of style, stone shape, metal, and details. Use your own diamond or let us source one that fits your budget.
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setActiveFlow("any")}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      activeFlow === "any"
                        ? "border-luxury-champagne bg-luxury-champagne/10 shadow-luxury"
                        : "border-luxury-divider bg-luxury-bg hover:border-luxury-champagne/50"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        activeFlow === "any" ? "bg-luxury-champagne" : "bg-luxury-divider"
                      }`}>
                        <Gem className={`w-6 h-6 ${activeFlow === "any" ? "text-luxury-text" : "text-luxury-text-muted"}`} />
                      </div>
                      <h3 className="text-xl font-serif luxury-heading text-luxury-text">Design Any Jewelry</h3>
                    </div>
                    <p className="text-luxury-text-muted font-body text-sm leading-relaxed">
                      Create custom pendants, chains, bracelets, earrings, or redesigned heirloom pieces with expert guidance and transparent pricing.
                    </p>
                  </button>
                </div>
                
                {/* Form Card */}
                <Card className="border-2 border-luxury-champagne/20 shadow-luxury rounded-xl">
                  <CardContent className="p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {activeFlow === "any" ? (
                        <>
                          {/* Flow 1: Design Any Jewelry */}
                          <div className="space-y-2">
                            <Label className="text-lg font-medium text-luxury-text">What type of jewelry?</Label>
                            <SimpleSelect
                              value={generalForm.pieceType}
                              onValueChange={(value) => setGeneralForm({...generalForm, pieceType: value})}
                              placeholder="Select piece type"
                              options={[
                                { value: "ring", label: "Ring" },
                                { value: "pendant", label: "Pendant" },
                                { value: "chain", label: "Chain" },
                                { value: "bracelet", label: "Bracelet" },
                                { value: "earrings", label: "Earrings" },
                                { value: "other", label: "Other" },
                              ]}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-lg font-medium text-luxury-text">Metal preference</Label>
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
                              ]}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-lg font-medium text-luxury-text">Stone preferences (optional)</Label>
                            <Textarea
                              value={generalForm.stonePreferences}
                              onChange={(e) => setGeneralForm({...generalForm, stonePreferences: e.target.value})}
                              placeholder="E.g., Diamond center stone, sapphire accents..."
                              rows={2}
                              className="border-luxury-divider focus:border-luxury-champagne bg-luxury-bg rounded-lg font-body"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-lg font-medium text-luxury-text">Budget range</Label>
                            <SimpleSelect
                              value={generalForm.budget}
                              onValueChange={(value) => setGeneralForm({...generalForm, budget: value})}
                              placeholder="Select budget"
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
                            <Label className="text-lg font-medium text-luxury-text">Describe your idea</Label>
                            <Textarea
                              value={generalForm.description}
                              onChange={(e) => setGeneralForm({...generalForm, description: e.target.value})}
                              placeholder="Tell us about your dream piece — the style, meaning, details you envision..."
                              rows={5}
                              className="border-luxury-divider focus:border-luxury-champagne text-lg resize-none bg-luxury-bg rounded-lg font-body"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-lg font-medium text-luxury-text">Deadline / occasion (optional)</Label>
                            <Input
                              value={generalForm.deadline}
                              onChange={(e) => setGeneralForm({...generalForm, deadline: e.target.value})}
                              placeholder="E.g., Anniversary in March, wedding gift..."
                              className="border-luxury-divider focus:border-luxury-champagne bg-luxury-bg rounded-lg font-body"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Flow 2: Design an Engagement Ring */}
                          <div className="space-y-2">
                            <Label className="text-lg font-medium text-luxury-text">Ring Style</Label>
                            <SimpleSelect
                              value={engagementForm.style}
                              onValueChange={(value) => setEngagementForm({...engagementForm, style: value})}
                              placeholder="Select style"
                              options={[
                                { value: "solitaire", label: "Solitaire" },
                                { value: "halo", label: "Halo" },
                                { value: "three-stone", label: "Three-Stone" },
                                { value: "pave", label: "Pavé" },
                                { value: "vintage", label: "Vintage" },
                                { value: "other", label: "Other" },
                              ]}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-lg font-medium text-luxury-text">Center Stone Type</Label>
                            <SimpleSelect
                              value={engagementForm.centerStoneType}
                              onValueChange={(value) => setEngagementForm({...engagementForm, centerStoneType: value})}
                              placeholder="Select stone type"
                              options={[
                                { value: "natural-diamond", label: "Natural Diamond" },
                                { value: "lab-diamond", label: "Lab-Grown Diamond" },
                                { value: "moissanite", label: "Moissanite" },
                                { value: "colored-stone", label: "Colored Gemstone" },
                                { value: "other", label: "Other" },
                              ]}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-lg font-medium text-luxury-text">Approximate Center Stone Size</Label>
                            <SimpleSelect
                              value={engagementForm.centerStoneSize}
                              onValueChange={(value) => setEngagementForm({...engagementForm, centerStoneSize: value})}
                              placeholder="Select size"
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
                            <Label className="text-lg font-medium text-luxury-text">Metal</Label>
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
                            <Label className="text-lg font-medium text-luxury-text">Ring Size</Label>
                            <Input
                              value={engagementForm.ringSize}
                              onChange={(e) => setEngagementForm({...engagementForm, ringSize: e.target.value})}
                              placeholder="E.g., 6, 7.5, or 'not sure'"
                              className="border-luxury-divider focus:border-luxury-champagne bg-luxury-bg rounded-lg font-body"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-lg font-medium text-luxury-text">Budget Range</Label>
                            <SimpleSelect
                              value={engagementForm.budget}
                              onValueChange={(value) => setEngagementForm({...engagementForm, budget: value})}
                              placeholder="Select budget"
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
                            <Label className="text-lg font-medium text-luxury-text">Any special requests or engraving?</Label>
                            <Textarea
                              value={engagementForm.specialRequests}
                              onChange={(e) => setEngagementForm({...engagementForm, specialRequests: e.target.value})}
                              placeholder="E.g., hidden diamond under the setting, custom engraving..."
                              rows={3}
                              className="border-luxury-divider focus:border-luxury-champagne bg-luxury-bg rounded-lg font-body"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-lg font-medium text-luxury-text">Timeline (when do you need the ring?)</Label>
                            <Input
                              value={engagementForm.timeline}
                              onChange={(e) => setEngagementForm({...engagementForm, timeline: e.target.value})}
                              placeholder="E.g., proposing in April, need by March 15th..."
                              className="border-luxury-divider focus:border-luxury-champagne bg-luxury-bg rounded-lg font-body"
                            />
                          </div>
                        </>
                      )}
                      
                      {/* Image Upload - Common to both flows */}
                      <div className="space-y-4">
                        <Label className="text-lg font-medium text-luxury-text">Upload inspiration images (up to 6)</Label>
                        <div className="border-2 border-dashed border-luxury-divider rounded-xl p-8 text-center hover:border-luxury-champagne/50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <Upload className="w-10 h-10 text-luxury-text-muted mx-auto mb-3" />
                            <p className="text-luxury-text-muted font-body">Click to upload or drag and drop</p>
                            <p className="text-sm text-luxury-text-muted/70 mt-1">PNG, JPG up to 10MB each</p>
                          </label>
                        </div>
                        
                        {uploadedImages.length > 0 && (
                          <div className="flex flex-wrap gap-3">
                            {uploadedImages.map((file, index) => (
                              <div key={index} className="relative group">
                                <div className="w-20 h-20 bg-luxury-bg-warm rounded-lg flex items-center justify-center overflow-hidden">
                                  <img 
                                    src={URL.createObjectURL(file)} 
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
                            Submit Design for Quote
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4 — WHY RAMESSÉS CUSTOM */}
      <section className="py-24 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-luxury bg-luxury-bg aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-luxury-text-muted">
                  <PenTool className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Master Craftsman at Work</p>
                  <p className="text-sm">Image placeholder</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-serif luxury-heading text-luxury-text mb-6">
                Designed With You. Crafted By Masters.
              </h2>
              <div className="w-24 h-1 bg-luxury-champagne mb-8"></div>
              
              <p className="text-xl text-luxury-text-muted mb-8 leading-relaxed font-body">
                Every custom piece goes through our signature hybrid process:<br />
                <span className="font-semibold text-luxury-text">AI-assisted creativity → Human expert refinement → Handcrafting on 47th Street.</span>
              </p>
              
              <p className="text-lg text-luxury-text-muted mb-10 font-body">
                Our master jeweler brings 30+ years of craftsmanship to every ring, pendant, chain, and bracelet.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Sparkles, text: "AI-powered concept exploration" },
                  { icon: Crown, text: "30+ years bench experience behind every piece" },
                  { icon: Gem, text: "NYC 47th Street production quality" },
                  { icon: Truck, text: "Insured nationwide shipping" },
                  { icon: DollarSign, text: "Transparent pricing and updates" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-luxury-champagne/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-luxury-champagne" />
                    </div>
                    <span className="text-lg text-luxury-text font-body">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — SHOWCASE GALLERY */}
      <section className="py-24 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif luxury-heading text-luxury-text mb-4">
              Recent Custom Pieces
            </h2>
            <div className="w-24 h-1 bg-luxury-champagne mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[...Array(8)].map((_, index) => (
              <div 
                key={index} 
                className="aspect-square bg-luxury-bg-warm rounded-xl overflow-hidden shadow-soft hover:shadow-luxury transition-shadow flex items-center justify-center"
              >
                <div className="text-center text-luxury-text-muted">
                  <Gem className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Custom piece {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — CREATOR MARKETPLACE PUBLISH SECTION */}
      <section className="py-24 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-luxury-champagne/20 shadow-luxury overflow-hidden rounded-xl">
              <CardContent className="p-10 lg:p-12">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-champagne/20 rounded-full mb-6">
                    <Users className="w-4 h-4 text-luxury-champagne" />
                    <span className="text-xs font-semibold text-luxury-text uppercase tracking-wide">Creator Opportunity</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-serif luxury-heading text-luxury-text mb-4">
                    Turn Your Custom Design Into a Marketplace Piece
                  </h2>
                  
                  <p className="text-xl text-luxury-text-muted font-body max-w-2xl mx-auto">
                    Once your custom piece is completed, you may be eligible to publish the design on the Ramessés Creator Marketplace. 
                    When your design is published and ordered by others, you earn creator commissions.
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <Link 
                    to="/marketplace"
                    className="inline-flex items-center gap-2 text-luxury-champagne hover:text-luxury-champagne-hover font-semibold transition-colors"
                  >
                    Learn about the Creator Marketplace
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 7 — FAQ */}
      <section className="py-24 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif luxury-heading text-luxury-text mb-4">
                Frequently Asked Questions
              </h2>
              <div className="w-24 h-1 bg-luxury-champagne mx-auto"></div>
            </div>
            
            <SimpleAccordion
              items={[
                { question: "How does the AI design process work?", answer: "AI generates concepts from your inspiration. Our master jeweler then refines them into a real, manufacturable design." },
                { question: "Is the final design AI-made or human-made?", answer: "AI provides inspiration. The final CAD and finished piece are created by real jewelers with 30+ years of NYC bench experience." },
                { question: "How long does the process take?", answer: "Most projects take 3–5 weeks from final approval to delivery." },
                { question: "What if I don't like the AI concepts?", answer: "We regenerate new ideas or adjust concepts until you're satisfied." },
                { question: "Does this work for engagement rings?", answer: "Yes — our Custom Lab creates engagement rings, wedding bands, pendants, and more." },
                { question: "When will the Creator Marketplace launch?", answer: "We expect to open creator publishing in 2025." }
              ]}
            />
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA */}
      <section className="py-24 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif luxury-heading text-luxury-text mb-6">
              Ready to Design Your Jewelry?
            </h2>
            <p className="text-xl text-luxury-text-muted mb-10 font-body">
              Upload your idea and let our AI + master jewelers bring it to life.
            </p>
            <Button 
              onClick={scrollToForm}
              className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover px-10 py-6 text-lg font-semibold rounded-lg shadow-luxury hover:shadow-xl transition-all"
            >
              Start Your Custom Design
            </Button>
            
            {/* Creator Dashboard Link */}
            {isCreator && (
              <p className="mt-8 text-luxury-text-muted">
                Already a Ramessés Creator?{" "}
                <Link to="/creator" className="text-luxury-champagne hover:underline font-medium">
                  Visit your Creator Dashboard
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        redirectTo="/custom"
      />
    </div>
  );
};

export default Custom;
