import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Phone, Mail, MapPin, Clock, Wrench, Sparkles, Users,
  Send, Check, Loader2, Upload, X
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type IntentType = 'repair' | 'custom' | 'general' | null;

const INTENT_OPTIONS = [
  {
    id: 'repair' as IntentType,
    icon: Wrench,
    title: 'Jewelry Repair',
    description: 'Questions about repairs, existing repair status, shipping, or drop-off.',
  },
  {
    id: 'custom' as IntentType,
    icon: Sparkles,
    title: 'Custom Jewelry / Engagement Rings',
    description: 'Questions about custom designs, engagement rings, timelines, or design changes.',
  },
  {
    id: 'general' as IntentType,
    icon: Users,
    title: 'In-Person / Courier / General',
    description: 'NYC appointments, local pickup/drop-off, or general questions.',
  },
];

const LOCATION_OPTIONS = ['NYC', 'North NJ', 'Other'];
const CONTACT_OPTIONS = ['Email', 'Phone', 'WhatsApp'];
const URGENCY_OPTIONS = ['No rush', 'Within 2 weeks', 'Within 1 week', 'Urgent'];

const Contact = () => {
  const { user } = useAuth();
  const [selectedIntent, setSelectedIntent] = useState<IntentType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [repairId, setRepairId] = useState('');
  const [designLink, setDesignLink] = useState('');
  const [location, setLocation] = useState('');
  const [preferredContact, setPreferredContact] = useState('Email');
  const [urgency, setUrgency] = useState('');
  const [phone, setPhone] = useState('');

  const resetForm = () => {
    setEmail('');
    setName('');
    setMessage('');
    setRepairId('');
    setDesignLink('');
    setLocation('');
    setPreferredContact('Email');
    setUrgency('');
    setPhone('');
    setSelectedIntent(null);
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const submission = {
        email: email.trim(),
        name: name.trim() || 'Anonymous',
        message: message.trim(),
        phone: phone.trim() || null,
        intent_type: selectedIntent,
        user_id: user?.id || null,
        related_repair_id: repairId.trim() || null,
        design_link: designLink.trim() || null,
        location: location || null,
        preferred_contact: preferredContact.toLowerCase(),
        timeline_urgency: urgency || null,
      };

      const { error } = await supabase
        .from('contact_submissions')
        .insert(submission);

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-serif text-foreground mb-4">Message Sent</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for reaching out. We'll get back to you within 1 business day.
              </p>
              <Button onClick={resetForm} variant="outline">
                Send Another Message
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            How Can We Help?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Choose the option that best fits your request so we can assist you faster.
          </p>
        </div>
      </section>

      {/* Intent Selection */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Intent Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {INTENT_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedIntent === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedIntent(option.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-lg' 
                        : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Conditional Forms */}
            {selectedIntent && (
              <Card className="border shadow-sm">
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Common Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Repair-specific fields */}
                    {selectedIntent === 'repair' && (
                      <div className="space-y-2">
                        <Label htmlFor="repairId">Repair ID or Order ID (optional)</Label>
                        <Input
                          id="repairId"
                          value={repairId}
                          onChange={(e) => setRepairId(e.target.value)}
                          placeholder="e.g., RQ-12345 or order number"
                        />
                      </div>
                    )}

                    {/* Custom/Engagement-specific fields */}
                    {selectedIntent === 'custom' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="designLink">Link to Design (optional)</Label>
                          <Input
                            id="designLink"
                            value={designLink}
                            onChange={(e) => setDesignLink(e.target.value)}
                            placeholder="Paste a link to your saved design"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Timeline Urgency (optional)</Label>
                          <div className="flex flex-wrap gap-2">
                            {URGENCY_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setUrgency(urgency === opt ? '' : opt)}
                                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                                  urgency === opt
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background border-border text-foreground hover:border-primary/50'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* General/In-Person-specific fields */}
                    {selectedIntent === 'general' && (
                      <>
                        <div className="space-y-2">
                          <Label>Your Location</Label>
                          <div className="flex flex-wrap gap-2">
                            {LOCATION_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setLocation(location === opt ? '' : opt)}
                                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                                  location === opt
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background border-border text-foreground hover:border-primary/50'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone (optional)</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Preferred Contact Method</Label>
                            <div className="flex flex-wrap gap-2">
                              {CONTACT_OPTIONS.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setPreferredContact(opt)}
                                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                                    preferredContact === opt
                                      ? 'bg-primary text-primary-foreground border-primary'
                                      : 'bg-background border-border text-foreground hover:border-primary/50'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        {selectedIntent === 'repair' && 'Describe your issue *'}
                        {selectedIntent === 'custom' && 'Your question *'}
                        {selectedIntent === 'general' && 'Message *'}
                      </Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          selectedIntent === 'repair' 
                            ? "Describe the issue with your repair or what you need help with..."
                            : selectedIntent === 'custom'
                            ? "What would you like to know about your custom piece?"
                            : "How can we help you?"
                        }
                        rows={4}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full md:w-auto"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {selectedIntent === 'repair' && 'Send Repair Question'}
                          {selectedIntent === 'custom' && 'Send Design Question'}
                          {selectedIntent === 'general' && 'Send Inquiry'}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Prompt to select intent */}
            {!selectedIntent && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Select an option above to continue</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Direct Contact (Secondary) */}
      <section className="py-12 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              Or Contact Us Directly
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Business Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Mon–Fri: 10am–7pm<br />
                    Sat: 10am–6pm
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">
                    47th Street Diamond District<br />
                    New York, NY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;
