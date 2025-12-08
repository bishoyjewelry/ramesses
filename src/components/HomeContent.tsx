import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Award, Shield, Truck, CheckCircle, Sparkles, Wrench,
  Video, FileText, DollarSign, Package, Star, Quote,
  Users, ArrowRight, Crown, Clock
} from "lucide-react";
import { SimpleAccordion } from "@/components/SimpleAccordion";
import { WhyMailToUs } from "@/components/WhyMailToUs";
import { FAQSection } from "@/components/FAQSection";
import { SEOContentBlock } from "@/components/SEOContentBlock";

export const HomeContent = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      {/* ==================== SECTION 2 — CREDIBILITY BAR ==================== */}
      <section className="py-8 bg-luxury-bg border-y border-luxury-divider">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { icon: Crown, text: "Master Jeweler — 30+ Years" },
              { icon: Award, text: "47th Street Quality" },
              { icon: Shield, text: "Insured Nationwide" },
              { icon: CheckCircle, text: "Thousands Repaired" },
              { icon: Sparkles, text: "AI-Powered Custom Design" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <item.icon className="w-5 h-5 text-luxury-champagne" />
                <span className="text-sm font-medium text-luxury-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3 — TWO PATHWAYS ==================== */}
      <section className="py-20 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif luxury-heading text-center mb-4 text-luxury-text">
            What Would You Like Today?
          </h2>
          <div className="w-24 h-1 bg-luxury-champagne mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1 — Mail-In Repairs (Palette 1) */}
            <Card className="bg-service-bg border-0 overflow-hidden rounded-xl shadow-service">
              <CardContent className="p-8 md:p-10">
                <div className="w-14 h-14 bg-service-gold/20 rounded-full flex items-center justify-center mb-6">
                  <Wrench className="w-7 h-7 text-service-gold" />
                </div>
                <h3 className="text-2xl md:text-3xl font-sans service-heading font-bold text-white mb-4">
                  Mail-In Jewelry Repairs
                </h3>
                <p className="text-service-text-muted mb-6 font-body leading-relaxed">
                  Professional repairs, sizing, polishing, stone tightening, and restorations — all handled by a master jeweler.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Insured shipping both ways",
                    "Video unboxing & intake",
                    "Transparent quotes",
                    "3–5 day turnaround"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-service-gold flex-shrink-0" />
                      <span className="text-white font-body">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/repairs">
                  <Button className="w-full bg-service-gold text-white hover:bg-service-gold-hover font-semibold py-5 rounded">
                    Start Your Repair
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Card 2 — Custom Lab (Palette 2) */}
            <Card className="bg-luxury-bg border-2 border-luxury-champagne/20 overflow-hidden rounded-xl shadow-luxury">
              <CardContent className="p-8 md:p-10">
                <div className="w-14 h-14 bg-luxury-champagne/20 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-luxury-champagne" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif luxury-heading text-luxury-text mb-4">
                  Ramessés Custom Lab™
                </h3>
                <p className="text-luxury-text-muted mb-6 font-body leading-relaxed">
                  Create one-of-a-kind jewelry using AI concepting + expert human craftsmanship from 47th Street.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Upload your idea or inspiration",
                    "AI-generated concepts",
                    "Human-refined CAD",
                    "Handcrafted in NYC"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-luxury-champagne flex-shrink-0" />
                      <span className="text-luxury-text font-body">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/custom">
                  <Button className="w-full bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover font-semibold py-5 rounded-lg">
                    Create a Custom Piece
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3.5 — WHY MAIL TO US (NEW) ==================== */}
      <WhyMailToUs />

      {/* ==================== SECTION 4 — HOW MAIL-IN WORKS (Palette 1) ==================== */}
      <section className="py-20 bg-service-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold text-center mb-4 text-white">
            How Our Mail-In Repair Service Works
          </h2>
          <div className="w-24 h-1 bg-service-gold mx-auto mb-16"></div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: 1, icon: FileText, title: "Submit your repair request", text: "Tell us what needs fixing" },
                { step: 2, icon: Package, title: "Get an insured shipping label", text: "We email it right to you" },
                { step: 3, icon: Video, title: "We record a video unboxing", text: "Full documentation on camera" },
                { step: 4, icon: DollarSign, title: "Receive a detailed quote", text: "Approve before we start" },
                { step: 5, icon: Wrench, title: "Master jeweler completes repair", text: "Expert craftsmanship" },
                { step: 6, icon: Truck, title: "We ship it back insured", text: "Cleaned & polished" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 bg-service-gold rounded-full flex items-center justify-center mx-auto">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-service-bg font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-sans font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-service-text-muted font-body text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/repairs">
              <Button className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-5 font-semibold rounded">
                Start Your Repair
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5 — FEATURED CUSTOM WORK (Palette 2) ==================== */}
      <section className="py-20 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif luxury-heading text-center mb-4 text-luxury-text">
            Recent Custom Creations
          </h2>
          <div className="w-24 h-1 bg-luxury-champagne mx-auto mb-12"></div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="group">
                <div className="aspect-square bg-luxury-bg-warm rounded-xl overflow-hidden shadow-soft hover:shadow-luxury transition-shadow border border-luxury-divider flex items-center justify-center">
                  <div className="text-center text-luxury-text-muted">
                    <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-40 text-luxury-champagne" />
                    <p className="text-sm">Custom piece {index + 1}</p>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-luxury-text font-medium">Designed in the Custom Lab™</p>
                  <div className="w-12 h-0.5 bg-luxury-champagne mx-auto mt-2"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/custom">
              <Button className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover px-8 py-5 font-semibold rounded-lg">
                Design Your Own Jewelry
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 6 — WHY RAMESSÉS (Hybrid) ==================== */}
      <section className="py-20 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Image Placeholder */}
            <div className="relative rounded-2xl overflow-hidden bg-luxury-bg aspect-square shadow-luxury border border-luxury-divider">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-luxury-text-muted">
                  <Wrench className="w-16 h-16 mx-auto mb-4 opacity-40 text-luxury-champagne" />
                  <p className="text-lg font-medium">Master Jeweler at Bench</p>
                  <p className="text-sm">Image placeholder</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif luxury-heading text-luxury-text mb-6">
                The Only Full-Service National Jewelry Platform
              </h2>
              <div className="w-24 h-1 bg-luxury-champagne mb-8"></div>
              
              <p className="text-lg text-luxury-text-muted mb-10 leading-relaxed font-body">
                At Ramessés, we combine insured nationwide repairs, AI-driven design, and 47th Street craftsmanship into a single, trusted experience.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Crown, text: "30+ Years Bench Experience" },
                  { icon: Shield, text: "Insured Shipping Nationwide" },
                  { icon: Sparkles, text: "AI-Powered Design Studio" },
                  { icon: CheckCircle, text: "Master Jeweler QC" },
                  { icon: DollarSign, text: "Transparent Pricing" },
                  { icon: Truck, text: "National Coverage" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-luxury-champagne/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-luxury-champagne" />
                    </div>
                    <span className="text-luxury-text font-medium font-body">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 7 — CUSTOMER REVIEWS (Palette 2) ==================== */}
      <section className="py-20 bg-luxury-bg-warm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif luxury-heading text-center mb-4 text-luxury-text">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-luxury-champagne mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { text: "My ring came back looking brand new. Incredible service.", author: "Sarah M." },
              { text: "The Custom Lab helped me design the perfect pendant.", author: "Emily R." },
              { text: "Fast, insured, and trustworthy. Highly recommend.", author: "Alex T." },
              { text: "They fixed my grandmother's vintage bracelet beautifully.", author: "Michael K." },
              { text: "The AI concepts were amazing. My custom ring is perfect.", author: "Jessica L." },
            ].map((review, index) => (
              <Card key={index} className="bg-luxury-bg border-0 shadow-soft hover:shadow-luxury transition-shadow rounded-xl">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-luxury-champagne text-luxury-champagne" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-luxury-champagne/30 mb-3" />
                  <p className="text-luxury-text font-body mb-4 italic leading-relaxed">"{review.text}"</p>
                  <p className="text-sm text-luxury-text-muted font-semibold">— {review.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 8 — CREATOR MARKETPLACE TEASER (Palette 2) ==================== */}
      <section className="py-20 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-luxury-champagne/20 shadow-luxury overflow-hidden rounded-xl">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  <div className="p-10 lg:p-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-champagne/20 rounded-full mb-6">
                      <span className="text-xs font-semibold text-luxury-text uppercase tracking-wide">Coming Soon</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-serif luxury-heading text-luxury-text mb-4">
                      The Ramessés Creator Marketplace
                    </h2>
                    
                    <p className="text-luxury-text-muted mb-6 font-body leading-relaxed">
                      Soon you'll be able to publish your custom design and earn commissions whenever someone orders it.
                    </p>
                    
                    <p className="text-luxury-text-muted mb-8 font-body">
                      A community-powered jewelry ecosystem — built on Ramessés craftsmanship.
                    </p>
                    
                    <Button 
                      disabled
                      className="bg-luxury-divider text-luxury-text-muted cursor-not-allowed px-6 py-5 rounded-lg"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Launching Soon
                    </Button>
                  </div>
                  
                  <div className="bg-luxury-champagne/10 flex items-center justify-center p-12">
                    <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-square bg-luxury-bg rounded-lg shadow-soft flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-luxury-champagne/40" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 9 — FAQ SNAPSHOT (NEW COMPONENT) ==================== */}
      <FAQSection className="bg-luxury-bg-warm" />

      {/* ==================== SECTION 10 — FINAL CTA (Palette 1) ==================== */}
      <section className="py-20 bg-service-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-sans service-heading font-bold mb-6 text-white">
              Ready to Begin?
            </h2>
            <p className="text-xl text-service-text-muted mb-10 font-body">
              Start a repair or design a custom piece today — your jewelry is in trusted hands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/repairs">
                <Button className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded">
                  Start Your Repair
                </Button>
              </Link>
              <Link to="/custom">
                <Button variant="outline" className="border-2 border-service-gold text-service-gold hover:bg-service-gold/10 px-8 py-6 text-lg font-semibold rounded">
                  Design a Custom Piece
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SEO CONTENT BLOCK ==================== */}
      <SEOContentBlock />

      {/* Spanish CTA */}
      {language === 'en' && (
        <section className="py-12 bg-luxury-champagne/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-sans font-bold mb-3 text-luxury-text">{t('spanish.title')}</h2>
            <p className="text-luxury-text-muted mb-5 max-w-xl mx-auto font-body">{t('spanish.text')}</p>
            <Button 
              onClick={() => setLanguage('es')}
              className="bg-luxury-champagne text-luxury-text hover:bg-luxury-champagne-hover rounded-lg"
            >
              {t('spanish.button')}
            </Button>
          </div>
        </section>
      )}
    </>
  );
};