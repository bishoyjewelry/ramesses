import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Upload, Sparkles, PenTool, Gem, Shield, Truck, DollarSign, Crown, Users } from "lucide-react";
import { SimpleSelect } from "@/components/SimpleSelect";
import { SimpleAccordion } from "@/components/SimpleAccordion";

const Custom = () => {
  const [formData, setFormData] = useState({
    pieceType: "",
    metal: "",
    stone: "",
    budget: "",
    description: ""
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast.success("Your custom design request has been submitted!");
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
      <section className="pt-32 pb-24 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-champagne/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-luxury-champagne" />
              <span className="text-sm font-medium text-luxury-text">Ramessés Custom Lab™</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif luxury-heading text-luxury-text mb-8 leading-tight">
              Design the Jewelry You Can't Find Anywhere Else
            </h1>
            
            <p className="text-xl md:text-2xl text-luxury-text-muted mb-12 max-w-3xl mx-auto leading-relaxed font-body">
              Welcome to the Ramessés Custom Lab™ — an AI-powered jewelry design studio where your ideas become handcrafted pieces made by master jewelers in NYC.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
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
            
            {/* Hero Image Placeholder */}
            <div className="relative rounded-2xl overflow-hidden shadow-luxury bg-luxury-bg-warm aspect-[16/9] max-w-4xl mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-luxury-text-muted">
                  <Gem className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">CAD Model + Sketch + Final Piece</p>
                  <p className="text-sm">Studio hero image placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif luxury-heading text-luxury-text mb-4">
              How the Custom Lab Works
            </h2>
            <div className="w-24 h-1 bg-luxury-champagne mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Step 1 */}
            <Card className="bg-luxury-bg border-0 shadow-soft hover:shadow-luxury transition-shadow overflow-hidden rounded-xl">
              <div className="aspect-[4/3] bg-luxury-champagne/10 flex items-center justify-center">
                <Upload className="w-16 h-16 text-luxury-champagne/60" />
              </div>
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-luxury-champagne text-luxury-text font-bold mb-4">1</div>
                <h3 className="text-2xl font-serif luxury-heading text-luxury-text mb-4">Tell Us Your Idea</h3>
                <p className="text-luxury-text-muted leading-relaxed font-body">
                  Upload photos, sketches, or inspiration. Describe what you're imagining — metal, stones, style, budget, and story.
                </p>
              </CardContent>
            </Card>
            
            {/* Step 2 */}
            <Card className="bg-luxury-bg border-0 shadow-soft hover:shadow-luxury transition-shadow overflow-hidden rounded-xl">
              <div className="aspect-[4/3] bg-luxury-champagne/10 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-luxury-champagne/60" />
              </div>
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-luxury-champagne text-luxury-text font-bold mb-4">2</div>
                <h3 className="text-2xl font-serif luxury-heading text-luxury-text mb-4">AI Concepts + Human Refinement</h3>
                <p className="text-luxury-text-muted leading-relaxed font-body">
                  Our AI creates concept images based on your idea. You choose your favorites, and our master jeweler refines the design into a final CAD model.
                </p>
              </CardContent>
            </Card>
            
            {/* Step 3 */}
            <Card className="bg-luxury-bg border-0 shadow-soft hover:shadow-luxury transition-shadow overflow-hidden rounded-xl">
              <div className="aspect-[4/3] bg-luxury-champagne/10 flex items-center justify-center">
                <PenTool className="w-16 h-16 text-luxury-champagne/60" />
              </div>
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-luxury-champagne text-luxury-text font-bold mb-4">3</div>
                <h3 className="text-2xl font-serif luxury-heading text-luxury-text mb-4">Handcrafted in NYC</h3>
                <p className="text-luxury-text-muted leading-relaxed font-body">
                  Once you approve the final design, our 47th Street workshops cast, set, polish, and finish your piece. Insured shipping nationwide.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={scrollToForm}
              className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover px-8 py-6 text-lg font-semibold rounded-lg shadow-luxury"
            >
              Start Your Custom Design
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — CUSTOM REQUEST FORM */}
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
                    We're Generating Concepts!
                  </h3>
                  <p className="text-luxury-text-muted text-lg font-body">
                    A designer will follow up shortly with AI previews.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-luxury-champagne/20 shadow-luxury rounded-xl">
                <CardContent className="p-8 md:p-12">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Piece Type */}
                    <div className="space-y-2">
                      <Label className="text-lg font-medium text-luxury-text">What do you want to create?</Label>
                      <SimpleSelect
                        value={formData.pieceType}
                        onValueChange={(value) => setFormData({...formData, pieceType: value})}
                        placeholder="Select piece type"
                        options={[
                          { value: "ring", label: "Ring" },
                          { value: "pendant", label: "Pendant" },
                          { value: "necklace", label: "Necklace" },
                          { value: "bracelet", label: "Bracelet" },
                          { value: "earrings", label: "Earrings" },
                          { value: "other", label: "Other" },
                        ]}
                      />
                    </div>
                    
                    {/* Metal Preference */}
                    <div className="space-y-2">
                      <Label className="text-lg font-medium text-luxury-text">Metal preference</Label>
                      <SimpleSelect
                        value={formData.metal}
                        onValueChange={(value) => setFormData({...formData, metal: value})}
                        placeholder="Select metal"
                        options={[
                          { value: "14k-yellow", label: "14k Yellow Gold" },
                          { value: "14k-white", label: "14k White Gold" },
                          { value: "14k-rose", label: "14k Rose Gold" },
                          { value: "18k", label: "18k Gold" },
                          { value: "platinum", label: "Platinum" },
                          { value: "not-sure", label: "Not Sure Yet" },
                        ]}
                      />
                    </div>
                    
                    {/* Stone Preference */}
                    <div className="space-y-2">
                      <Label className="text-lg font-medium text-luxury-text">Stone preference</Label>
                      <SimpleSelect
                        value={formData.stone}
                        onValueChange={(value) => setFormData({...formData, stone: value})}
                        placeholder="Select stone"
                        options={[
                          { value: "diamond", label: "Diamond" },
                          { value: "moissanite", label: "Moissanite" },
                          { value: "gemstones", label: "Gemstones" },
                          { value: "no-stones", label: "No Stones" },
                          { value: "not-sure", label: "Not Sure" },
                        ]}
                      />
                    </div>
                    
                    {/* Budget */}
                    <div className="space-y-2">
                      <Label className="text-lg font-medium text-luxury-text">Budget range</Label>
                      <SimpleSelect
                        value={formData.budget}
                        onValueChange={(value) => setFormData({...formData, budget: value})}
                        placeholder="Select budget"
                        options={[
                          { value: "500-1000", label: "$500 – $1,000" },
                          { value: "1000-2500", label: "$1,000 – $2,500" },
                          { value: "2500-5000", label: "$2,500 – $5,000" },
                          { value: "5000+", label: "$5,000+" },
                        ]}
                      />
                    </div>
                    
                    {/* Image Upload */}
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
                    
                    {/* Description */}
                    <div className="space-y-2">
                      <Label className="text-lg font-medium text-luxury-text">Describe your idea</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Tell us about your dream piece — the style, meaning, details you envision..."
                        rows={5}
                        className="border-luxury-divider focus:border-luxury-champagne text-lg resize-none bg-luxury-bg rounded-lg font-body"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover py-6 text-lg font-semibold rounded-lg shadow-luxury"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate My AI Designs
                    </Button>
                  </form>
                </CardContent>
              </Card>
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

      {/* SECTION 6 — CREATOR MARKETPLACE TEASER */}
      <section className="py-24 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-luxury-champagne/20 shadow-luxury overflow-hidden rounded-xl">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  {/* Content */}
                  <div className="p-10 lg:p-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-champagne/20 rounded-full mb-6">
                      <span className="text-xs font-semibold text-luxury-text uppercase tracking-wide">Coming Soon</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif luxury-heading text-luxury-text mb-4">
                      The Ramessés Creator Marketplace
                    </h2>
                    
                    <p className="text-xl text-luxury-text-muted mb-6 font-body">
                      Turn your custom jewelry design into a piece the world can order — and earn commissions every time someone buys it.
                    </p>
                    
                    <p className="text-luxury-text-muted mb-6 font-body">
                      Soon, every customer whose custom piece we create will be able to:
                    </p>
                    
                    <ul className="space-y-3 mb-8">
                      {[
                        "Publish their design on the Ramessés marketplace",
                        "Share their creation with the community",
                        "Earn a commission when others order their design",
                        "Track earnings inside their account"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-luxury-champagne/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-luxury-champagne text-xs">✓</span>
                          </div>
                          <span className="text-luxury-text font-body">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <p className="text-sm text-luxury-text-muted italic mb-8 font-body">
                      This creates the first-ever crowdsourced fine jewelry catalog built by customers, powered by Ramessés craftsmanship.
                    </p>
                    
                    <Button 
                      disabled
                      className="bg-luxury-divider text-luxury-text-muted cursor-not-allowed px-6 py-5 rounded-lg"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Creator Marketplace Launching Soon
                    </Button>
                  </div>
                  
                  {/* Image */}
                  <div className="bg-luxury-champagne/10 flex items-center justify-center p-12">
                    <div className="text-center text-luxury-text-muted">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Marketplace Grid Mockup</p>
                      <p className="text-sm">Image placeholder</p>
                    </div>
                  </div>
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Custom;