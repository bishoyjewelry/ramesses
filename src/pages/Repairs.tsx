import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wrench, Shield, DollarSign, Package, Video, FileText, 
  Sparkles, Lock, CheckCircle, ArrowRight, Star, Quote
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FAQSection } from "@/components/FAQSection";
import { SEOContentBlock } from "@/components/SEOContentBlock";
import { RepairWizard } from "@/components/RepairWizard";


const Repairs = () => {
  const { t } = useLanguage();

  const scrollToForm = () => {
    document.getElementById('repair-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-service-bg">
      <Navigation />
      
      {/* ==================== SECTION 1 — HERO ==================== */}
      <section className="pt-32 pb-20 bg-service-bg relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-service-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-service-gold/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans service-heading font-bold mb-6 text-white leading-tight">
              Nationwide Mail-In Jewelry Repair, Backed by{" "}
              <span className="text-service-gold">47th Street Craftsmanship</span>
            </h1>
            
            <p className="text-lg md:text-xl text-service-text-muted mb-16 max-w-3xl mx-auto leading-relaxed font-body">
              Ship your jewelry to our NYC workshop for expert repair, restoration, and polishing. Every piece is fully documented, insured, and handled by a master jeweler.
            </p>
          </div>
          
          {/* Embedded How It Works - 3 Steps */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-serif font-medium text-white mb-3">
                How Our Mail-In Jewelry Repair Works
              </h2>
              <p className="text-service-text-muted font-body">
                Simple, insured, and handled by our 47th Street master jeweler.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-service-gold/15 border border-service-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
                  <FileText className="w-6 h-6 text-service-gold" />
                </div>
                <h3 className="text-lg font-medium text-white mb-3">Start Your Repair</h3>
                <p className="text-service-text-muted font-body text-sm leading-relaxed">
                  Tell us about your jewelry and upload a few photos. If you're not sure what repair you need, that's okay — we'll review it for you.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-service-gold/15 border border-service-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Package className="w-6 h-6 text-service-gold" />
                </div>
                <h3 className="text-lg font-medium text-white mb-3">Ship or Drop Off</h3>
                <p className="text-service-text-muted font-body text-sm leading-relaxed">
                  Mail your piece using insured shipping, drop it off in person, or schedule local pickup in Manhattan or North Jersey.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-service-gold/15 border border-service-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-6 h-6 text-service-gold" />
                </div>
                <h3 className="text-lg font-medium text-white mb-3">Repair & Return</h3>
                <p className="text-service-text-muted font-body text-sm leading-relaxed">
                  Our 47th Street jeweler completes the repair. You approve the quote before work begins, and we ship it safely back to you.
                </p>
              </div>
            </div>
            
            {/* CTA */}
            <div className="text-center">
              <Button 
                onClick={scrollToForm}
                className="bg-service-gold text-white hover:bg-service-gold-hover px-10 py-6 text-lg font-medium rounded mb-4"
              >
                Start Mail-In Repair
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              {/* Trust micro-copy */}
              <p className="text-service-text-muted/70 text-sm font-body">
                Insured shipping • Secure handling • No work done without approval
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ==================== SECTION 2 — HOW IT WORKS (4 STEPS) ==================== */}
      <section id="how-it-works" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-center mb-4 text-foreground">
            How Mail-In Jewelry Repair Works
          </h2>
          <div className="w-24 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: 1,
                title: "Tell Us About Your Jewelry",
                text: "Fill out the repair form and upload photos so we can understand the problem.",
                icon: FileText
              },
              {
                step: 2,
                title: "Choose How to Send It",
                text: "Select Mail-In Kit, NYC Drop-Off, or Local Courier Pickup (Manhattan and North Jersey).",
                icon: Package
              },
              {
                step: 3,
                title: "We Inspect and Send a Digital Quote",
                text: "We record video intake, photograph your piece, and send a clear quote for your approval.",
                icon: Video
              },
              {
                step: 4,
                title: "Approve Online, We Repair and Return",
                text: "You approve and pay online. We complete the repair in 3–5 business days and return it insured.",
                icon: Shield
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-service-gold rounded-full flex items-center justify-center mx-auto">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button 
              onClick={scrollToForm}
              className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-5 font-medium rounded"
            >
              Start Your Repair
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3 — TRUST & SAFETY ==================== */}
      <section className="py-16 bg-service-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-white">
            Safe, Documented, and Insured
          </h2>
          <div className="w-24 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Video, text: "Video unboxing and inspection of every piece on arrival" },
                { icon: Sparkles, text: "High-resolution photos of stones, settings, and any existing damage" },
                { icon: Shield, text: "Insured, trackable shipping both ways" },
                { icon: Lock, text: "Chain-of-custody tracking from intake to final quality check" },
                { icon: Wrench, text: "All work overseen by a 47th Street master jeweler" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-service-bg/50 rounded-lg p-4">
                  <div className="w-10 h-10 bg-service-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-service-gold" />
                  </div>
                  <span className="text-white font-body">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4 — WHAT WE REPAIR ==================== */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-center mb-4 text-foreground">
            Common Repairs We Handle
          </h2>
          <div className="w-24 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Ring resizing (up or down)",
                "Prong tightening, retipping, and rebuilding",
                "Stone tightening and replacement",
                "Chain and bracelet soldering",
                "Clasp repair and replacement",
                "Polishing, refinishing, and rhodium plating",
                "Shank repair or replacement",
                "Engagement ring overhauls and restoration",
                "Vintage and heirloom restoration",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-card rounded-lg p-4 shadow-sm border border-border">
                  <CheckCircle className="w-5 h-5 text-service-gold flex-shrink-0" />
                  <span className="text-foreground font-body">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button 
              onClick={scrollToForm}
              className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-5 font-medium rounded"
            >
              Start Your Repair
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5 — WHY CHOOSE RAMESSÉS ==================== */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-center mb-4 text-foreground">
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
              <Card key={index} className="bg-card border border-border shadow-soft hover:shadow-luxury transition-shadow rounded-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-service-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-service-gold" />
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground font-body leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 6 — PRICING CARDS ==================== */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-center mb-4 text-foreground">
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
              <Card key={index} className="bg-card border border-border shadow-soft hover:shadow-luxury transition-all hover:translate-y-[-2px] rounded-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-2xl font-semibold text-service-gold mb-3">{item.price}</p>
                  <p className="text-sm text-muted-foreground font-body">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <p className="text-center text-muted-foreground font-body text-sm max-w-2xl mx-auto">
            Actual price is confirmed after inspection. No work begins until you approve the quote.
          </p>
        </div>
      </section>

      {/* ==================== SECTION 7 — BEFORE & AFTER GALLERY ==================== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-center mb-4 text-foreground">
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
                <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center border border-border overflow-hidden">
                  <div className="text-center text-muted-foreground p-4">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50 text-service-gold" />
                    <p className="text-xs">Before/After</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2 font-body">{caption}</p>
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

      {/* ==================== SECTION 7 — REPAIR WIZARD ==================== */}
      <section id="repair-form" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-center mb-4 text-foreground">
              Start Your Repair Request
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              Answer a few quick questions and we'll take it from there.
            </p>
            
            <RepairWizard />
          </div>
        </div>
      </section>

      {/* ==================== SECTION 10 — TESTIMONIALS ==================== */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-center mb-4 text-foreground">
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
              <Card key={index} className="bg-card border border-border shadow-soft rounded-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-service-gold text-service-gold" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-service-gold/30 mb-2" />
                  <p className="text-foreground font-body mb-4 italic">"{review.text}"</p>
                  <p className="text-sm text-muted-foreground font-medium">— {review.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <FAQSection 
        title="Frequently Asked Questions"
        faqs={[
          { question: "Is mailing jewelry safe?", answer: "Yes. We use insured labels, tamper-evident packaging, and full video/photo documentation on arrival." },
          { question: "How long does a repair take?", answer: "Most repairs are completed within 3–5 business days after you approve the quote." },
          { question: "Who performs the repairs?", answer: "All work is overseen by a master jeweler with over 30 years on NYC's Diamond District." },
          { question: "Can I drop off or use a courier instead?", answer: "Yes. You can drop off in NYC or request a local courier pickup in Manhattan and North Jersey, when available." },
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
