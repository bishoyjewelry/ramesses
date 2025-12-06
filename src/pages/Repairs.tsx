import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Wrench, Shield, DollarSign, Package, Video, FileText, 
  Sparkles, Lock, CheckCircle, ArrowRight, Star, Quote,
  Upload, UserPlus, LogIn
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SimpleSelect } from "@/components/SimpleSelect";
import { SimpleAccordion } from "@/components/SimpleAccordion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Repairs = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jewelryType: "",
    repairNeeded: "",
    notes: "",
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Build the repair quote data
      const repairData: {
        name: string;
        email: string;
        phone: string;
        item_type: string;
        repair_type: string;
        description: string;
        status: string;
        user_id?: string;
      } = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        item_type: formData.jewelryType,
        repair_type: formData.repairNeeded,
        description: formData.notes || formData.repairNeeded,
        status: 'pending',
      };
      
      // Attach user_id if authenticated
      if (user) {
        repairData.user_id = user.id;
      }
      
      const { error } = await supabase
        .from('repair_quotes')
        .insert([repairData]);
      
      if (error) throw error;
      
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", jewelryType: "", repairNeeded: "", notes: "" });
      setUploadedImages([]);
    } catch (error) {
      console.error('Error submitting repair quote:', error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('repair-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Success confirmation component
  const SuccessConfirmation = () => (
    <Card className="border-2 border-service-gold/30 shadow-service rounded-lg">
      <CardContent className="p-8 md:p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-sans font-bold text-luxury-text mb-4">
          Your Repair Request Has Been Submitted!
        </h3>
        
        {user ? (
          // Logged-in user confirmation
          <>
            <p className="text-luxury-text-muted mb-8 font-body">
              We'll send your insured shipping label shortly. You can track your repair status anytime in your account.
            </p>
            <Link to="/my-repairs">
              <Button className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded">
                View My Repairs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </>
        ) : (
          // Guest user confirmation
          <>
            <p className="text-luxury-text-muted mb-4 font-body">
              We'll send your insured shipping label to your email shortly.
            </p>
            <p className="text-luxury-text mb-6 font-body font-medium">
              Want to track your repair status?
            </p>
            <p className="text-luxury-text-muted mb-8 font-body text-sm">
              Create a free Ramessés account to see updates, shipping instructions, and repair history.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup&redirect=/my-repairs">
                <Button className="bg-service-gold text-white hover:bg-service-gold-hover px-6 py-5 font-semibold rounded w-full sm:w-auto">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </Link>
              <Link to="/auth?mode=login&redirect=/my-repairs">
                <Button variant="outline" className="border-2 border-service-gold text-service-gold hover:bg-service-gold/10 px-6 py-5 font-semibold rounded w-full sm:w-auto">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          </>
        )}
        
        <button 
          onClick={() => setIsSubmitted(false)}
          className="mt-8 text-sm text-luxury-text-muted hover:text-service-gold transition-colors"
        >
          Submit Another Repair Request
        </button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-service-bg">
      <Navigation />
      
      {/* ==================== SECTION 1 — HERO ==================== */}
      <section className="pt-32 pb-24 bg-service-bg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-service-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-service-gold/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans service-heading font-bold mb-6 text-white leading-tight">
              Nationwide Mail-In Jewelry Repairs.<br />
              <span className="text-service-gold">Trusted by 47th Street.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-service-text-muted mb-10 max-w-3xl mx-auto leading-relaxed font-body">
              Professional repairs, polishing, sizing, stone tightening, prong work, and restorations — expertly completed by a master jeweler with 30+ years experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                onClick={scrollToForm}
                className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded"
              >
                Start Your Mail-In Repair
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={scrollToHowItWorks}
                variant="outline"
                className="border-2 border-service-gold text-service-gold hover:bg-service-gold/10 px-8 py-6 text-lg font-semibold rounded"
              >
                How It Works
              </Button>
            </div>
            
            {/* Hero Image Placeholder */}
            <div className="relative rounded-xl overflow-hidden bg-service-bg-secondary aspect-[16/9] max-w-4xl mx-auto border border-service-gold/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-service-text-muted">
                  <Wrench className="w-16 h-16 mx-auto mb-4 opacity-50 text-service-gold" />
                  <p className="text-lg">Master Jeweler at Work</p>
                  <p className="text-sm">Hero image placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 2 — WHY CHOOSE RAMESSÉS ==================== */}
      <section className="py-20 bg-service-neutral">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-luxury-text">
            Why People Trust Us With Their Jewelry
          </h2>
          <div className="w-24 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Wrench,
                title: "Master Bench Work",
                text: "All repairs are inspected and finished by a 47th Street master jeweler with 30+ years of experience."
              },
              {
                icon: Shield,
                title: "Fully Insured Shipping",
                text: "We provide insured shipping labels and secure packaging for every mail-in repair."
              },
              {
                icon: DollarSign,
                title: "Transparent Pricing",
                text: "No surprises. You approve the quote before any work begins."
              }
            ].map((item, index) => (
              <Card key={index} className="bg-white border-0 shadow-service hover:shadow-lg transition-shadow rounded-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-service-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-service-gold" />
                  </div>
                  <h3 className="text-xl font-sans font-bold mb-4 text-luxury-text">{item.title}</h3>
                  <p className="text-luxury-text-muted font-body leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3 — HOW IT WORKS TIMELINE ==================== */}
      <section id="how-it-works" className="py-20 bg-service-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-white">
            How Mail-In Repairs Work
          </h2>
          <div className="w-24 h-1 bg-service-gold mx-auto mb-16"></div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  step: 1,
                  title: "Tell Us About Your Repair",
                  text: "Submit a short form and upload photos.",
                  icon: FileText
                },
                {
                  step: 2,
                  title: "Get Your Insured Shipping Label",
                  text: "We send a prepaid, insured label + packing instructions.",
                  icon: Package
                },
                {
                  step: 3,
                  title: "We Record a Video Unboxing",
                  text: "Your item is opened under camera and logged into our system.",
                  icon: Video
                },
                {
                  step: 4,
                  title: "Receive a Transparent Quote",
                  text: "You get a detailed repair plan + cost before we begin.",
                  icon: DollarSign
                },
                {
                  step: 5,
                  title: "Our Master Jeweler Completes the Repair",
                  text: "Stone tightening, polishing, soldering, restoration — all done professionally.",
                  icon: Wrench
                },
                {
                  step: 6,
                  title: "We Ship It Back Securely",
                  text: "Your repaired jewelry is cleaned, polished, and shipped back insured.",
                  icon: Shield
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-service-gold rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{item.step}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-sans font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-service-text-muted font-body">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={scrollToForm}
              className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded"
            >
              Start Your Repair
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4 — PRICING CARDS ==================== */}
      <section className="py-20 bg-service-neutral">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-luxury-text">
            Popular Repair Services & Typical Prices
          </h2>
          <div className="w-24 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            {[
              {
                title: "Ring Sizing",
                price: "From $45–$95",
                description: "Up or down; gold, silver, platinum options"
              },
              {
                title: "Stone Tightening / Prong Work",
                price: "From $35–$120",
                description: "Prong tightening, re-tipping, securing loose stones"
              },
              {
                title: "Chain / Bracelet Repair",
                price: "From $25–$75",
                description: "Solder breaks, clasp repair, jump ring fixes"
              },
              {
                title: "Polishing & Deep Cleaning",
                price: "From $35–$65",
                description: "Restore shine, remove scratches, ultrasonic clean"
              },
              {
                title: "Restoration / Heavy Damage",
                price: "Custom Quote",
                description: "Reshaping, rebuilding channels, replacing stones"
              },
              {
                title: "Laser Welding",
                price: "From $55–$150",
                description: "Precision repairs for delicate or complex pieces"
              }
            ].map((item, index) => (
              <Card key={index} className="bg-white border-0 shadow-service hover:shadow-lg transition-all hover:translate-y-[-2px] rounded-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-sans font-bold text-luxury-text mb-2">{item.title}</h3>
                  <p className="text-2xl font-bold text-service-gold mb-3">{item.price}</p>
                  <p className="text-sm text-luxury-text-muted font-body">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <p className="text-center text-luxury-text-muted font-body text-sm max-w-2xl mx-auto">
            Actual price is confirmed after inspection. No work begins until you approve the quote.
          </p>
        </div>
      </section>

      {/* ==================== SECTION 5 — BEFORE & AFTER GALLERY ==================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-luxury-text">
            Before & After Transformations
          </h2>
          <div className="w-24 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              "Bent ring reshaped + polished",
              "Broken chain soldered cleanly",
              "Worn prongs rebuilt to secure stones",
              "Deep scratches removed + refinished",
              "Missing stone replaced perfectly",
              "Tarnished silver restored to shine",
              "Clasp repaired + reinforced",
              "Antique ring carefully restored"
            ].map((caption, index) => (
              <div key={index} className="group">
                <div className="aspect-square bg-service-neutral rounded-lg flex items-center justify-center border border-luxury-divider overflow-hidden">
                  <div className="text-center text-luxury-text-muted p-4">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50 text-service-gold" />
                    <p className="text-xs">Before/After</p>
                  </div>
                </div>
                <p className="text-sm text-luxury-text-muted text-center mt-2 font-body">{caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 6 — TRUST & SECURITY STACK ==================== */}
      <section className="py-20 bg-service-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-white">
            Your Jewelry Is Protected Every Step of the Way
          </h2>
          <div className="w-24 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { icon: Lock, text: "Insured Shipping Both Ways" },
              { icon: Video, text: "Video Unboxing & Intake" },
              { icon: FileText, text: "Transparent Repair Quotes" },
              { icon: Wrench, text: "Master Jeweler Quality Control" },
              { icon: Package, text: "Tamper-Proof Packaging" },
              { icon: Sparkles, text: "Complimentary Cleaning & Polish" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-service-bg/50 rounded-lg p-4">
                <div className="w-12 h-12 bg-service-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-service-gold" />
                </div>
                <span className="text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              onClick={scrollToForm}
              className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded"
            >
              Start Your Mail-In Repair
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 7 — REPAIR FORM ==================== */}
      <section id="repair-form" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-luxury-text">
              Start Your Mail-In Repair
            </h2>
            <div className="w-24 h-1 bg-service-gold mx-auto mb-12"></div>
            
            {isSubmitted ? (
              <SuccessConfirmation />
            ) : (
              <Card className="border-2 border-service-gold/20 shadow-service rounded-lg">
                <CardContent className="p-8 md:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-luxury-text font-medium">Full Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="border-luxury-divider focus:border-service-gold bg-white rounded h-12"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-luxury-text font-medium">Email</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="border-luxury-divider focus:border-service-gold bg-white rounded h-12"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-luxury-text font-medium">Phone</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="border-luxury-divider focus:border-service-gold bg-white rounded h-12"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-luxury-text font-medium">Type of Jewelry</Label>
                        <SimpleSelect
                          value={formData.jewelryType}
                          onValueChange={(value) => setFormData({...formData, jewelryType: value})}
                          placeholder="Select type"
                          options={[
                            { value: "ring", label: "Ring" },
                            { value: "necklace", label: "Necklace" },
                            { value: "chain", label: "Chain" },
                            { value: "bracelet", label: "Bracelet" },
                            { value: "earrings", label: "Earrings" },
                            { value: "pendant", label: "Pendant" },
                            { value: "watch", label: "Watch" },
                            { value: "other", label: "Other" },
                          ]}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-luxury-text font-medium">What repair is needed?</Label>
                      <Textarea
                        value={formData.repairNeeded}
                        onChange={(e) => setFormData({ ...formData, repairNeeded: e.target.value })}
                        placeholder="Describe what's wrong and what repair you need..."
                        rows={3}
                        required
                        className="border-luxury-divider focus:border-service-gold bg-white rounded"
                      />
                    </div>
                    
                    {/* Image Upload */}
                    <div className="space-y-4">
                      <Label className="text-luxury-text font-medium">Upload photos (up to 6)</Label>
                      <div className="border-2 border-dashed border-luxury-divider rounded-lg p-6 text-center hover:border-service-gold/50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="repair-image-upload"
                        />
                        <label htmlFor="repair-image-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-luxury-text-muted mx-auto mb-2" />
                          <p className="text-luxury-text-muted font-body text-sm">Click to upload photos</p>
                        </label>
                      </div>
                      
                      {uploadedImages.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {uploadedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="w-16 h-16 bg-service-neutral rounded-lg flex items-center justify-center overflow-hidden">
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
                    
                    <div className="space-y-2">
                      <Label className="text-luxury-text font-medium">Additional Notes (optional)</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any other details we should know..."
                        rows={2}
                        className="border-luxury-divider focus:border-service-gold bg-white rounded"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-service-gold text-white hover:bg-service-gold-hover font-semibold py-6 text-lg rounded"
                    >
                      {isSubmitting ? "Submitting..." : "Get My Insured Shipping Label"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 8 — TESTIMONIALS ==================== */}
      <section className="py-20 bg-service-neutral">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-luxury-text">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                text: "Perfect work. They resized my ring and polished it like new. Fast and safe shipping!",
                author: "Sarah M."
              },
              {
                text: "My chain was snapped in half. They repaired it and you can't even see the break.",
                author: "Emily R."
              },
              {
                text: "Sent in my grandmother's vintage ring. They restored it beautifully and kept me updated the whole time.",
                author: "Michael T."
              },
              {
                text: "The video unboxing gave me so much peace of mind. Truly professional service.",
                author: "Jessica L."
              },
              {
                text: "Fair pricing and exceptional quality. My bracelet looks brand new!",
                author: "David K."
              }
            ].map((review, index) => (
              <Card key={index} className="bg-white border-0 shadow-service rounded-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-service-gold text-service-gold" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-service-gold/30 mb-2" />
                  <p className="text-luxury-text font-body mb-4 italic">"{review.text}"</p>
                  <p className="text-sm text-luxury-text-muted font-semibold">— {review.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 9 — FAQ ==================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-luxury-text">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-service-gold mx-auto mb-12"></div>
            
            <SimpleAccordion
              items={[
                { question: "How long do repairs take?", answer: "Most repairs are completed in 3–5 business days once approved." },
                { question: "Is shipping insured?", answer: "Yes. Every shipment is insured both ways." },
                { question: "What if I decline the repair quote?", answer: "We ship your jewelry back at no cost." },
                { question: "Do you work with diamonds and gemstones?", answer: "Yes. We tighten, secure, replace, and restore stones of all types." },
                { question: "Do you repair luxury jewelry?", answer: "Yes. We handle high-end and sentimental pieces with extreme care." },
                { question: "How do I track my repair?", answer: "You'll receive email updates at every stage, from intake to shipping. Create an account to view your repair history anytime." }
              ]}
            />
          </div>
        </div>
      </section>

      {/* ==================== SECTION 10 — FINAL CTA ==================== */}
      <section className="py-20 bg-service-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold mb-6 text-white">
              Ready to Repair Your Jewelry?
            </h2>
            <p className="text-xl text-service-text-muted mb-10 font-body">
              Insured. Professional. 47th Street quality you can trust.
            </p>
            <Button 
              onClick={scrollToForm}
              className="bg-service-gold text-white hover:bg-service-gold-hover px-10 py-6 text-lg font-semibold rounded"
            >
              Start Your Mail-In Repair
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Repairs;
