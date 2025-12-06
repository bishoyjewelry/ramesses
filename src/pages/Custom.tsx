import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Upload, Sparkles, PenTool, Gem, Shield, Truck, DollarSign, ChevronDown, Crown, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* SECTION 1 — HERO */}
      <section className="pt-32 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold/10 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-luxury-gold" />
              <span className="text-sm font-medium text-luxury-gold">Ramessés Custom Lab™</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-luxury-charcoal mb-6 leading-tight">
              Design the Jewelry You Can't Find Anywhere Else
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Welcome to the Ramessés Custom Lab™ — an AI-powered jewelry design studio where your ideas become handcrafted pieces made by master jewelers in NYC.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                onClick={scrollToForm}
                className="bg-luxury-gold text-white hover:bg-luxury-gold-light px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Custom Design
              </Button>
              <Button 
                onClick={scrollToHowItWorks}
                variant="outline"
                className="border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold/5 px-8 py-6 text-lg font-semibold"
              >
                How It Works
              </Button>
            </div>
            
            {/* Hero Image Placeholder */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[16/9] max-w-4xl mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
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
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-charcoal mb-4">
              How the Custom Lab Works
            </h2>
            <div className="w-24 h-1 bg-luxury-gold mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Step 1 */}
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-luxury-gold/10 to-luxury-gold/5 flex items-center justify-center">
                <Upload className="w-16 h-16 text-luxury-gold/60" />
              </div>
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-luxury-gold text-white font-bold mb-4">1</div>
                <h3 className="text-2xl font-serif font-bold text-luxury-charcoal mb-4">Tell Us Your Idea</h3>
                <p className="text-gray-600 leading-relaxed">
                  Upload photos, sketches, or inspiration. Describe what you're imagining — metal, stones, style, budget, and story.
                </p>
              </CardContent>
            </Card>
            
            {/* Step 2 */}
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-luxury-gold/10 to-luxury-gold/5 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-luxury-gold/60" />
              </div>
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-luxury-gold text-white font-bold mb-4">2</div>
                <h3 className="text-2xl font-serif font-bold text-luxury-charcoal mb-4">AI Concepts + Human Refinement</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI creates concept images based on your idea. You choose your favorites, and our master jeweler refines the design into a final CAD model.
                </p>
              </CardContent>
            </Card>
            
            {/* Step 3 */}
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-luxury-gold/10 to-luxury-gold/5 flex items-center justify-center">
                <PenTool className="w-16 h-16 text-luxury-gold/60" />
              </div>
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-luxury-gold text-white font-bold mb-4">3</div>
                <h3 className="text-2xl font-serif font-bold text-luxury-charcoal mb-4">Handcrafted in NYC</h3>
                <p className="text-gray-600 leading-relaxed">
                  Once you approve the final design, our 47th Street workshops cast, set, polish, and finish your piece. Insured shipping nationwide.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={scrollToForm}
              className="bg-luxury-gold text-white hover:bg-luxury-gold-light px-8 py-6 text-lg font-semibold shadow-lg"
            >
              Start Your Custom Design
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — CUSTOM REQUEST FORM */}
      <section id="custom-form" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-charcoal mb-4">
                Start Your Custom Jewelry Project
              </h2>
              <div className="w-24 h-1 bg-luxury-gold mx-auto"></div>
            </div>
            
            {isSubmitted ? (
              <Card className="border-2 border-luxury-gold/30 shadow-xl">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-luxury-gold" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-luxury-charcoal mb-4">
                    We're Generating Concepts!
                  </h3>
                  <p className="text-gray-600 text-lg">
                    A designer will follow up shortly with AI previews.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-luxury-gold/20 shadow-xl">
                <CardContent className="p-8 md:p-12">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Piece Type */}
                    <div className="space-y-2">
                      <Label className="text-lg font-medium text-luxury-charcoal">What do you want to create?</Label>
                      <Select onValueChange={(value) => setFormData({...formData, pieceType: value})} required>
                        <SelectTrigger className="h-14 border-gray-200 focus:border-luxury-gold text-lg">
                          <SelectValue placeholder="Select piece type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ring">Ring</SelectItem>
                          <SelectItem value="pendant">Pendant</SelectItem>
                          <SelectItem value="necklace">Necklace</SelectItem>
                          <SelectItem value="bracelet">Bracelet</SelectItem>
                          <SelectItem value="earrings">Earrings</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Metal Preference */}
                    <div className="space-y-2">
                      <Label className="text-lg font-medium text-luxury-charcoal">Metal preference</Label>
                      <Select onValueChange={(value) => setFormData({...formData, metal: value})}>
                        <SelectTrigger className="h-14 border-gray-200 focus:border-luxury-gold text-lg">
                          <SelectValue placeholder="Select metal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="14k-yellow">14k Yellow Gold</SelectItem>
                          <SelectItem value="14k-white">14k White Gold</SelectItem>
                          <SelectItem value="14k-rose">14k Rose Gold</SelectItem>
                          <SelectItem value="18k">18k Gold</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                          <SelectItem value="not-sure">Not Sure Yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Stone Preference */}
                    <div className="space-y-2">
                      <Label className="text-lg font-medium text-luxury-charcoal">Stone preference</Label>
                      <Select onValueChange={(value) => setFormData({...formData, stone: value})}>
                        <SelectTrigger className="h-14 border-gray-200 focus:border-luxury-gold text-lg">
                          <SelectValue placeholder="Select stone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diamond">Diamond</SelectItem>
                          <SelectItem value="moissanite">Moissanite</SelectItem>
                          <SelectItem value="gemstones">Gemstones</SelectItem>
                          <SelectItem value="no-stones">No Stones</SelectItem>
                          <SelectItem value="not-sure">Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Budget */}
                    <div className="space-y-2">
                      <Label className="text-lg font-medium text-luxury-charcoal">Budget range</Label>
                      <Select onValueChange={(value) => setFormData({...formData, budget: value})}>
                        <SelectTrigger className="h-14 border-gray-200 focus:border-luxury-gold text-lg">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500-1000">$500 – $1,000</SelectItem>
                          <SelectItem value="1000-2500">$1,000 – $2,500</SelectItem>
                          <SelectItem value="2500-5000">$2,500 – $5,000</SelectItem>
                          <SelectItem value="5000+">$5,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Image Upload */}
                    <div className="space-y-4">
                      <Label className="text-lg font-medium text-luxury-charcoal">Upload inspiration images (up to 6)</Label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-luxury-gold/50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
                        </label>
                      </div>
                      
                      {uploadedImages.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {uploadedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
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
                      <Label className="text-lg font-medium text-luxury-charcoal">Describe your idea</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Tell us about your dream piece — the style, meaning, details you envision..."
                        rows={5}
                        className="border-gray-200 focus:border-luxury-gold text-lg resize-none"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-luxury-gold text-white hover:bg-luxury-gold-light py-6 text-lg font-semibold shadow-lg"
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
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <PenTool className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Master Craftsman at Work</p>
                  <p className="text-sm">Image placeholder</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-charcoal mb-6">
                Designed With You. Crafted By Masters.
              </h2>
              <div className="w-24 h-1 bg-luxury-gold mb-8"></div>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Every custom piece goes through our signature hybrid process:<br />
                <span className="font-semibold text-luxury-charcoal">AI-assisted creativity → Human expert refinement → Handcrafting on 47th Street.</span>
              </p>
              
              <p className="text-lg text-gray-600 mb-10">
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
                    <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-luxury-gold" />
                    </div>
                    <span className="text-lg text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — SHOWCASE GALLERY */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-charcoal mb-4">
              Recent Custom Pieces
            </h2>
            <div className="w-24 h-1 bg-luxury-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[...Array(8)].map((_, index) => (
              <div 
                key={index} 
                className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
              >
                <div className="text-center text-gray-400">
                  <Gem className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Custom piece {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — CREATOR MARKETPLACE TEASER */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-luxury-gold/20 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  {/* Content */}
                  <div className="p-10 lg:p-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold/10 rounded-full mb-6">
                      <span className="text-xs font-semibold text-luxury-gold uppercase tracking-wide">Coming Soon</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-charcoal mb-4">
                      The Ramessés Creator Marketplace
                    </h2>
                    
                    <p className="text-xl text-gray-600 mb-6">
                      Turn your custom jewelry design into a piece the world can order — and earn commissions every time someone buys it.
                    </p>
                    
                    <p className="text-gray-600 mb-6">
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
                          <div className="w-5 h-5 bg-luxury-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-luxury-gold text-xs">✓</span>
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <p className="text-sm text-gray-500 italic mb-8">
                      This creates the first-ever crowdsourced fine jewelry catalog built by customers, powered by Ramessés craftsmanship.
                    </p>
                    
                    <Button 
                      disabled
                      className="bg-gray-300 text-gray-500 cursor-not-allowed px-6 py-5"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Creator Marketplace Launching Soon
                    </Button>
                  </div>
                  
                  {/* Image */}
                  <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-gold/5 flex items-center justify-center p-12">
                    <div className="text-center text-gray-400">
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-charcoal mb-4">
                Frequently Asked Questions
              </h2>
              <div className="w-24 h-1 bg-luxury-gold mx-auto"></div>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "How does the AI design process work?",
                  a: "AI generates concepts from your inspiration. Our master jeweler then refines them into a real, manufacturable design."
                },
                {
                  q: "Is the final design AI-made or human-made?",
                  a: "AI provides inspiration. The final CAD and finished piece are created by real jewelers with 30+ years of NYC bench experience."
                },
                {
                  q: "How long does the process take?",
                  a: "Most projects take 3–5 weeks from final approval to delivery."
                },
                {
                  q: "What if I don't like the AI concepts?",
                  a: "We regenerate new ideas or adjust concepts until you're satisfied."
                },
                {
                  q: "Does this work for engagement rings?",
                  a: "Yes — our Custom Lab creates engagement rings, wedding bands, pendants, and more."
                },
                {
                  q: "When will the Creator Marketplace launch?",
                  a: "We expect to open creator publishing in 2025."
                }
              ].map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-xl px-6 data-[state=open]:border-luxury-gold/30 data-[state=open]:shadow-lg transition-all"
                >
                  <AccordionTrigger className="text-lg font-semibold text-luxury-charcoal hover:text-luxury-gold py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-lg pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-charcoal mb-6">
              Ready to Design Your Jewelry?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Upload your idea and let our AI + master jewelers bring it to life.
            </p>
            <Button 
              onClick={scrollToForm}
              className="bg-luxury-gold text-white hover:bg-luxury-gold-light px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
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