import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Wrench, Shield, DollarSign, Package, Video, FileText, 
  Sparkles, Lock, CheckCircle, ArrowRight, Star, Quote,
  Upload, UserPlus, LogIn, MapPin, Truck, Clock, Building
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SimpleSelect } from "@/components/SimpleSelect";
import { SimpleAccordion } from "@/components/SimpleAccordion";
import { FAQSection } from "@/components/FAQSection";
import { SEOContentBlock } from "@/components/SEOContentBlock";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type FulfillmentMethod = "mail_in" | "drop_off" | "courier";

interface FormData {
  name: string;
  email: string;
  phone: string;
  jewelryType: string;
  repairNeeded: string;
  notes: string;
  // Fulfillment
  fulfillmentMethod: FulfillmentMethod;
  // Drop-off specific
  preferredDropoffDate: string;
  preferredDropoffTime: string;
  dropoffNotes: string;
  // Courier specific
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  pickupWindow: string;
  courierNotes: string;
}

const Repairs = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    jewelryType: "",
    repairNeeded: "",
    notes: "",
    fulfillmentMethod: "mail_in",
    preferredDropoffDate: "",
    preferredDropoffTime: "",
    dropoffNotes: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    pickupWindow: "",
    courierNotes: "",
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

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
      // Build the repair quote data based on fulfillment method
      const repairData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        item_type: formData.jewelryType,
        repair_type: formData.repairNeeded,
        description: formData.notes || formData.repairNeeded,
        status: 'pending' as const,
        fulfillment_method: formData.fulfillmentMethod,
        preferred_dropoff_time: formData.fulfillmentMethod === "drop_off" 
          ? (formData.preferredDropoffDate ? `${formData.preferredDropoffDate} - ${formData.preferredDropoffTime || 'Any time'}` : formData.preferredDropoffTime) 
          : null,
        logistics_notes: formData.fulfillmentMethod === "drop_off" 
          ? formData.dropoffNotes 
          : formData.fulfillmentMethod === "courier" 
            ? formData.courierNotes 
            : null,
        street_address: formData.fulfillmentMethod === "courier" ? formData.streetAddress : null,
        city: formData.fulfillmentMethod === "courier" ? formData.city : null,
        state: formData.fulfillmentMethod === "courier" ? formData.state : null,
        zip: formData.fulfillmentMethod === "courier" ? formData.zip : null,
        pickup_window: formData.fulfillmentMethod === "courier" ? formData.pickupWindow : null,
        user_id: user?.id || null,
      };
      
      const { data: insertedRepair, error } = await supabase
        .from('repair_quotes')
        .insert([repairData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Send confirmation email via edge function
      try {
        await supabase.functions.invoke('send-repair-status-email', {
          body: {
            repair_id: insertedRepair.id,
            previous_status: null,
            new_status: 'pending'
          }
        });
        console.log('Repair confirmation email sent');
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
      
      setSubmittedData(formData);
      setIsSubmitted(true);
      setFormData({ 
        name: "", email: "", phone: "", jewelryType: "", repairNeeded: "", notes: "",
        fulfillmentMethod: "mail_in", preferredDropoffDate: "", preferredDropoffTime: "",
        dropoffNotes: "", streetAddress: "", city: "", state: "", zip: "", pickupWindow: "", courierNotes: ""
      });
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

  // Success confirmation component with method-specific messaging
  const SuccessConfirmation = () => {
    const method = submittedData?.fulfillmentMethod || "mail_in";
    
    return (
      <Card className="border-2 border-service-gold/30 shadow-service rounded-lg">
        <CardContent className="p-8 md:p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          {method === "mail_in" && (
            <>
              <h3 className="text-2xl font-sans font-bold text-luxury-text mb-4">
                Your Mail-In Repair Request Has Been Submitted!
              </h3>
              <p className="text-luxury-text-muted mb-6 font-body">
                We'll email you an insured shipping label and packing instructions shortly.
              </p>
            </>
          )}
          
          {method === "drop_off" && (
            <>
              <h3 className="text-2xl font-sans font-bold text-luxury-text mb-4">
                Your In-Person Drop Off Has Been Scheduled!
              </h3>
              <div className="bg-luxury-bg-warm rounded-lg p-6 mb-6 text-left">
                <h4 className="font-semibold text-luxury-text mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-service-gold" />
                  Drop-Off Details
                </h4>
                <div className="space-y-2 text-luxury-text-muted">
                  <p><strong>Location:</strong> 47th Street, NYC (Diamond District)</p>
                  <p><strong>Hours:</strong> Mon–Sat, 10am – 6pm</p>
                  {submittedData?.preferredDropoffDate && (
                    <p><strong>Your Preferred Date:</strong> {submittedData.preferredDropoffDate}</p>
                  )}
                  {submittedData?.preferredDropoffTime && (
                    <p><strong>Preferred Time:</strong> {submittedData.preferredDropoffTime}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-luxury-text-muted mb-6 font-body">
                We'll confirm your drop-off time by email if needed.
              </p>
            </>
          )}
          
          {method === "courier" && (
            <>
              <h3 className="text-2xl font-sans font-bold text-luxury-text mb-4">
                Your Courier Pickup Request Has Been Submitted!
              </h3>
              <div className="bg-luxury-bg-warm rounded-lg p-6 mb-6 text-left">
                <h4 className="font-semibold text-luxury-text mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-service-gold" />
                  Pickup Details
                </h4>
                <div className="space-y-2 text-luxury-text-muted">
                  <p><strong>Address:</strong> {submittedData?.streetAddress}</p>
                  <p>{submittedData?.city}, {submittedData?.state} {submittedData?.zip}</p>
                  {submittedData?.pickupWindow && (
                    <p><strong>Preferred Window:</strong> {submittedData.pickupWindow}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-luxury-text-muted mb-6 font-body">
                We'll review your request and confirm your pickup time by email or SMS.
              </p>
            </>
          )}
          
          {user ? (
            <Link to="/my-repairs">
              <Button className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded">
                View My Repairs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <>
              <p className="text-luxury-text mb-6 font-body font-medium">
                Want to track your repair status?
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
            onClick={() => { setIsSubmitted(false); setSubmittedData(null); }}
            className="mt-8 text-sm text-luxury-text-muted hover:text-service-gold transition-colors"
          >
            Submit Another Repair Request
          </button>
        </CardContent>
      </Card>
    );
  };

  // Fulfillment method selector component
  const FulfillmentMethodSelector = () => (
    <div className="mb-8 p-6 bg-service-neutral rounded-lg">
      <h3 className="text-lg font-sans font-bold text-luxury-text mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-service-gold" />
        How would you like to get your jewelry to us?
      </h3>
      
      <RadioGroup 
        value={formData.fulfillmentMethod} 
        onValueChange={(value) => setFormData({...formData, fulfillmentMethod: value as FulfillmentMethod})}
        className="space-y-3"
      >
        <label 
          className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            formData.fulfillmentMethod === "mail_in" 
              ? "border-service-gold bg-service-gold/5" 
              : "border-luxury-divider hover:border-service-gold/50 bg-white"
          }`}
        >
          <RadioGroupItem value="mail_in" id="mail_in" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-5 h-5 text-service-gold" />
              <span className="font-semibold text-luxury-text">Mail-In Kit (Nationwide)</span>
            </div>
            <p className="text-sm text-luxury-text-muted">
              We'll send you an insured shipping label and secure packaging.
            </p>
          </div>
        </label>
        
        <label 
          className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            formData.fulfillmentMethod === "drop_off" 
              ? "border-service-gold bg-service-gold/5" 
              : "border-luxury-divider hover:border-service-gold/50 bg-white"
          }`}
        >
          <RadioGroupItem value="drop_off" id="drop_off" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-service-gold" />
              <span className="font-semibold text-luxury-text">Drop Off In Person (NYC)</span>
            </div>
            <p className="text-sm text-luxury-text-muted">
              Visit our 47th Street location in the Diamond District.
            </p>
          </div>
        </label>
        
        <label 
          className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            formData.fulfillmentMethod === "courier" 
              ? "border-service-gold bg-service-gold/5" 
              : "border-luxury-divider hover:border-service-gold/50 bg-white"
          }`}
        >
          <RadioGroupItem value="courier" id="courier" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-5 h-5 text-service-gold" />
              <span className="font-semibold text-luxury-text">Local Courier Pickup (Manhattan & North Jersey)</span>
            </div>
            <p className="text-sm text-luxury-text-muted">
              We'll send a courier to pick up your jewelry from your location.
            </p>
          </div>
        </label>
      </RadioGroup>
    </div>
  );

  // Drop-off specific fields
  const DropOffFields = () => (
    <div className="space-y-6 p-6 bg-luxury-bg-warm rounded-lg mb-6">
      <h4 className="font-semibold text-luxury-text flex items-center gap-2">
        <Clock className="w-5 h-5 text-service-gold" />
        Drop-Off Preferences
      </h4>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-luxury-text font-medium">Preferred Drop-Off Date</Label>
          <Input
            type="date"
            value={formData.preferredDropoffDate}
            onChange={(e) => setFormData({ ...formData, preferredDropoffDate: e.target.value })}
            className="border-luxury-divider focus:border-service-gold bg-white rounded h-12"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-luxury-text font-medium">Preferred Time Window</Label>
          <SimpleSelect
            value={formData.preferredDropoffTime}
            onValueChange={(value) => setFormData({...formData, preferredDropoffTime: value})}
            placeholder="Select time"
            options={[
              { value: "morning", label: "Morning (10am - 12pm)" },
              { value: "afternoon", label: "Afternoon (12pm - 4pm)" },
              { value: "evening", label: "Evening (4pm - 6pm)" },
            ]}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-luxury-text font-medium">Notes for Drop-Off (optional)</Label>
        <Textarea
          value={formData.dropoffNotes}
          onChange={(e) => setFormData({ ...formData, dropoffNotes: e.target.value })}
          placeholder="Any special instructions for your visit..."
          rows={2}
          className="border-luxury-divider focus:border-service-gold bg-white rounded"
        />
      </div>
      
      <div className="p-4 bg-white rounded-lg border border-luxury-divider">
        <p className="text-sm text-luxury-text font-medium mb-2">📍 Drop-Off Location</p>
        <p className="text-sm text-luxury-text-muted">47th Street, NYC (Diamond District)</p>
        <p className="text-sm text-luxury-text-muted">Hours: Mon–Sat, 10am – 6pm</p>
      </div>
    </div>
  );

  // Courier specific fields
  const CourierFields = () => (
    <div className="space-y-6 p-6 bg-luxury-bg-warm rounded-lg mb-6">
      <h4 className="font-semibold text-luxury-text flex items-center gap-2">
        <Building className="w-5 h-5 text-service-gold" />
        Pickup Address
      </h4>
      
      <div className="space-y-2">
        <Label className="text-luxury-text font-medium">Street Address *</Label>
        <Input
          value={formData.streetAddress}
          onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
          required
          className="border-luxury-divider focus:border-service-gold bg-white rounded h-12"
          placeholder="123 Main Street, Apt 4B"
        />
      </div>
      
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-luxury-text font-medium">City *</Label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            className="border-luxury-divider focus:border-service-gold bg-white rounded h-12"
            placeholder="New York"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-luxury-text font-medium">State *</Label>
          <SimpleSelect
            value={formData.state}
            onValueChange={(value) => setFormData({...formData, state: value})}
            placeholder="State"
            options={[
              { value: "NY", label: "New York" },
              { value: "NJ", label: "New Jersey" },
            ]}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-luxury-text font-medium">ZIP Code *</Label>
          <Input
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            required
            className="border-luxury-divider focus:border-service-gold bg-white rounded h-12"
            placeholder="10001"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-luxury-text font-medium">Preferred Pickup Window *</Label>
        <SimpleSelect
          value={formData.pickupWindow}
          onValueChange={(value) => setFormData({...formData, pickupWindow: value})}
          placeholder="Select a time window"
          options={[
            { value: "weekday_morning", label: "Weekday Morning (9am - 12pm)" },
            { value: "weekday_afternoon", label: "Weekday Afternoon (12pm - 5pm)" },
            { value: "weekday_evening", label: "Weekday Evening (5pm - 8pm)" },
            { value: "saturday", label: "Saturday (10am - 4pm)" },
          ]}
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-luxury-text font-medium">Building Access Notes (optional)</Label>
        <Textarea
          value={formData.courierNotes}
          onChange={(e) => setFormData({ ...formData, courierNotes: e.target.value })}
          placeholder="Apartment number, doorman, gate code, office name, etc."
          rows={2}
          className="border-luxury-divider focus:border-service-gold bg-white rounded"
        />
      </div>
      
      <div className="p-4 bg-service-gold/10 rounded-lg border border-service-gold/20">
        <p className="text-sm text-luxury-text">
          🚚 <strong>Available in Manhattan and select North Jersey areas.</strong><br/>
          We will confirm your pickup time by email or SMS.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-service-bg">
      <Navigation />
      
      {/* ==================== SECTION 1 — HERO ==================== */}
      <section className="pt-32 pb-24 bg-service-bg relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-service-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-service-gold/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans service-heading font-bold mb-6 text-white leading-tight">
              Professional Jewelry Repairs.<br />
              <span className="text-service-gold">Your Way.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-service-text-muted mb-10 max-w-3xl mx-auto leading-relaxed font-body">
              Mail-in nationwide, drop off in NYC, or request local courier pickup in Manhattan & North Jersey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                onClick={scrollToForm}
                className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded"
              >
                Start Your Repair Request
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
            How It Works
          </h2>
          <div className="w-24 h-1 bg-service-gold mx-auto mb-16"></div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  step: 1,
                  title: "Tell Us About Your Repair",
                  text: "Submit a short form and upload photos. Choose mail-in, drop-off, or courier.",
                  icon: FileText
                },
                {
                  step: 2,
                  title: "Get Your Jewelry to Us",
                  text: "Mail it with our insured label, drop off in NYC, or schedule a local pickup.",
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
                  title: "We Return It Securely",
                  text: "Your repaired jewelry is cleaned, polished, and returned to you insured.",
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
              { title: "Ring Sizing", price: "From $45–$95", description: "Up or down; gold, silver, platinum options" },
              { title: "Stone Tightening / Prong Work", price: "From $35–$120", description: "Prong tightening, re-tipping, securing loose stones" },
              { title: "Chain / Bracelet Repair", price: "From $25–$75", description: "Solder breaks, clasp repair, jump ring fixes" },
              { title: "Polishing & Deep Cleaning", price: "From $35–$65", description: "Restore shine, remove scratches, ultrasonic clean" },
              { title: "Restoration / Heavy Damage", price: "Custom Quote", description: "Reshaping, rebuilding channels, replacing stones" },
              { title: "Laser Welding", price: "From $55–$150", description: "Precision repairs for delicate or complex pieces" }
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
              Start Your Repair Request
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 7 — REPAIR FORM ==================== */}
      <section id="repair-form" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-luxury-text">
              Start Your Repair Request
            </h2>
            <div className="w-24 h-1 bg-service-gold mx-auto mb-12"></div>
            
            {isSubmitted ? (
              <SuccessConfirmation />
            ) : (
              <Card className="border-2 border-service-gold/20 shadow-service rounded-lg">
                <CardContent className="p-8 md:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Fulfillment Method Selector */}
                    <FulfillmentMethodSelector />
                    
                    {/* Method-specific fields */}
                    {formData.fulfillmentMethod === "drop_off" && <DropOffFields />}
                    {formData.fulfillmentMethod === "courier" && <CourierFields />}
                    
                    {/* Standard fields */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-luxury-text font-medium">Full Name *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="border-luxury-divider focus:border-service-gold bg-white rounded h-12"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-luxury-text font-medium">Email *</Label>
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
                        <Label className="text-luxury-text font-medium">Phone *</Label>
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
                        <Label className="text-luxury-text font-medium">Type of Jewelry *</Label>
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
                      <Label className="text-luxury-text font-medium">What repair is needed? *</Label>
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
                      {isSubmitting ? "Submitting..." : (
                        formData.fulfillmentMethod === "mail_in" ? "Get My Insured Shipping Label" :
                        formData.fulfillmentMethod === "drop_off" ? "Schedule My Drop-Off" :
                        "Request Courier Pickup"
                      )}
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
              { text: "Perfect work. They resized my ring and polished it like new. Fast and safe shipping!", author: "Sarah M." },
              { text: "My chain was snapped in half. They repaired it and you can't even see the break.", author: "Emily R." },
              { text: "Sent in my grandmother's vintage ring. They restored it beautifully and kept me updated the whole time.", author: "Michael T." },
              { text: "The video unboxing gave me so much peace of mind. Truly professional service.", author: "Jessica L." },
              { text: "Fair pricing and exceptional quality. My bracelet looks brand new!", author: "David K." }
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
      <FAQSection 
        faqs={[
          { question: "Is mailing jewelry safe?", answer: "Yes. We use insured labels, tamper-evident packaging, and full video intake before work begins." },
          { question: "How long does a repair take?", answer: "Most repairs are completed within 3–5 business days after quote approval." },
          { question: "Who performs the repairs?", answer: "A master jeweler with 30+ years of experience on NYC's Diamond District." },
          { question: "Do you offer drop-off or pickup?", answer: "Yes. We offer Manhattan + North Jersey courier pickup and NYC in-person drop-off." },
          { question: "How do I pay for the repair?", answer: "You approve your quote online and pay securely through Shopify Checkout." },
          { question: "Can I track my repair?", answer: "Yes. Your account shows real-time status: received, inspected, quoted, in progress, completed, shipped." },
          { question: "What if I decline the repair quote?", answer: "We ship your jewelry back at no cost." },
          { question: "Do you repair luxury jewelry?", answer: "Yes. We handle high-end and sentimental pieces with extreme care." },
        ]}
      />

      {/* ==================== SECTION 10 — FINAL CTA ==================== */}
      <section className="py-20 bg-service-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold mb-6 text-white">
              Ready to Repair Your Jewelry?
            </h2>
            <p className="text-xl text-service-text-muted mb-10 font-body">
              Mail it in, drop it off, or schedule a pickup — we have got you covered.
            </p>
            <Button 
              onClick={scrollToForm}
              className="bg-service-gold text-white hover:bg-service-gold-hover px-10 py-6 text-lg font-semibold rounded"
            >
              Start Your Repair Request
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== SEO CONTENT BLOCK ==================== */}
      <SEOContentBlock />

      <Footer />
    </div>
  );
};

export default Repairs;
