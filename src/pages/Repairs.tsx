import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Wrench, Shield, Package, FileText, 
  CheckCircle, ArrowRight, HelpCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOContentBlock } from "@/components/SEOContentBlock";
import { RepairWizard } from "@/components/RepairWizard";

// Common repair types for quick selection
const commonRepairs = [
  { value: "ring_resizing", label: "Ring Resizing", icon: "💍" },
  { value: "broken_chain", label: "Broken Chain", icon: "⛓️" },
  { value: "prong_repair", label: "Prong Repair", icon: "💎" },
  { value: "stone_loose", label: "Stone Replacement", icon: "✨" },
  { value: "clasp_repair", label: "Clasp Repair", icon: "🔗" },
  { value: "polishing", label: "Polishing & Cleaning", icon: "✦" },
];

const Repairs = () => {
  const { t } = useLanguage();
  const [preselectedRepair, setPreselectedRepair] = useState<string | null>(null);
  const [wizardMode, setWizardMode] = useState<"default" | "not_sure">("default");

  const scrollToForm = (repair?: string, mode?: "not_sure") => {
    if (repair) {
      setPreselectedRepair(repair);
      setWizardMode("default");
    } else if (mode === "not_sure") {
      setPreselectedRepair(null);
      setWizardMode("not_sure");
    } else {
      setPreselectedRepair(null);
      setWizardMode("default");
    }
    
    setTimeout(() => {
      document.getElementById('repair-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* ==================== HERO — PROCESS FIRST ==================== */}
      <section className="pt-28 pb-16 bg-service-bg relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-service-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-service-gold/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium mb-4 text-white">
              Mail-In Jewelry Repair
            </h1>
            <p className="text-lg text-service-text-muted mb-14 font-body">
              Simple, insured repairs handled by our 47th Street master jeweler.
            </p>
          </div>
          
          {/* 3-Step Process Block */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-service-gold/15 border border-service-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-service-gold" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Step 1 — Start Online</h3>
                <p className="text-service-text-muted font-body text-sm leading-relaxed">
                  Tell us about your jewelry and upload photos. If you're not sure what repair you need, that's okay.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-service-gold/15 border border-service-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-service-gold" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Step 2 — Ship or Drop Off</h3>
                <p className="text-service-text-muted font-body text-sm leading-relaxed">
                  Mail it insured, drop it off in NYC, or schedule local pickup in Manhattan or North Jersey.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-service-gold/15 border border-service-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-service-gold" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Step 3 — Repair & Return</h3>
                <p className="text-service-text-muted font-body text-sm leading-relaxed">
                  You approve the quote before work begins. We repair it and ship it back safely.
                </p>
              </div>
            </div>
            
            {/* Primary CTA */}
            <div className="text-center">
              <Button 
                onClick={() => scrollToForm()}
                className="bg-service-gold text-white hover:bg-service-gold-hover px-10 py-6 text-lg font-medium rounded"
              >
                Start Mail-In Repair
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DUAL ENTRY — KNOW VS NOT SURE ==================== */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-center mb-12 text-foreground">
              Get Started Your Way
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* LEFT — I Know What Repair I Need */}
              <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-service-gold/10 rounded-full flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-service-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">I Know What Repair I Need</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {commonRepairs.map((repair) => (
                    <button
                      key={repair.value}
                      onClick={() => scrollToForm(repair.value)}
                      className="group bg-background hover:bg-service-gold/5 border border-border hover:border-service-gold/40 rounded-lg p-4 text-center transition-all duration-200"
                    >
                      <span className="text-xl mb-1 block">{repair.icon}</span>
                      <span className="text-sm font-medium text-foreground group-hover:text-service-gold transition-colors">
                        {repair.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* RIGHT — I'm Not Sure */}
              <div className="bg-service-bg/5 border border-service-gold/20 rounded-xl p-6 sm:p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-service-gold/10 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-service-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">I'm Not Sure</h3>
                </div>
                
                <p className="text-muted-foreground font-body mb-8 leading-relaxed flex-1">
                  Not sure what's wrong? Upload photos and our jeweler will review it for you. No guesswork required.
                </p>
                
                <Button 
                  onClick={() => scrollToForm(undefined, "not_sure")}
                  variant="outline"
                  className="w-full border-service-gold text-service-gold hover:bg-service-gold hover:text-white py-5 font-medium"
                >
                  Let a Jeweler Review It
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICE METHOD PREVIEW ==================== */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-serif font-medium text-center mb-8 text-foreground">
              How would you like to get it to us?
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-background border border-border rounded-lg p-5 text-center">
                <Package className="w-8 h-8 text-service-gold mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-1">Mail-In</h4>
                <p className="text-sm text-muted-foreground">Insured Shipping</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-5 text-center">
                <Wrench className="w-8 h-8 text-service-gold mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-1">In-Person</h4>
                <p className="text-sm text-muted-foreground">Drop-Off (NYC)</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-5 text-center">
                <Shield className="w-8 h-8 text-service-gold mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-1">Local Pickup</h4>
                <p className="text-sm text-muted-foreground">Manhattan / North Jersey</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== REPAIR WIZARD ==================== */}
      <section id="repair-form" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-center mb-3 text-foreground">
              Start Your Repair Request
            </h2>
            <p className="text-center text-muted-foreground mb-10 font-body">
              Answer a few quick questions and we'll take it from there.
            </p>
            
            <RepairWizard 
              preselectedRepair={preselectedRepair} 
              notSureMode={wizardMode === "not_sure"} 
            />
          </div>
        </div>
      </section>

      {/* ==================== TRUST REASSURANCE STRIP ==================== */}
      <section className="py-8 bg-service-bg">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-service-text-muted text-sm font-body">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-service-gold" />
              Insured shipping
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-service-gold" />
              Secure handling
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-service-gold" />
              No work done without approval
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-service-gold" />
              47th Street expertise
            </span>
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
