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
      
      {/* ==================== HERO ==================== */}
      <section className="pt-28 pb-12 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium mb-4 text-foreground">
              Jewelry Repairs
            </h1>
            <p className="text-lg text-muted-foreground mb-3 font-body">
              Handled by a Diamond District master jeweler with 30+ years at the bench.
            </p>
            <p className="text-sm text-muted-foreground/70 font-body">
              Fully insured from pickup to delivery. No work begins until you approve.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 3-STEP VISUAL PROCESS ==================== */}
      <section className="py-14 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-8 md:gap-6 mb-10">
              {/* Step 1 — Send It */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-serif font-semibold text-primary">1</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Send It</h3>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  Submit your repair and receive insured shipping instructions.
                </p>
              </div>
              
              {/* Step 2 — We Evaluate */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-serif font-semibold text-primary">2</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">We Evaluate</h3>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  Our NYC jeweler inspects your piece and sends a quote.
                </p>
              </div>
              
              {/* Step 3 — You Approve */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-serif font-semibold text-primary">3</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">You Approve</h3>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  Work begins only after approval. Tracked until return.
                </p>
              </div>
            </div>
            
            {/* Reassurance line */}
            <p className="text-center text-xs text-muted-foreground/80 font-body tracking-wide">
              Fully insured • No work without approval • NYC Diamond District
            </p>
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
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">I Know What Repair I Need</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {commonRepairs.map((repair) => (
                    <button
                      key={repair.value}
                      onClick={() => scrollToForm(repair.value)}
                      className="group bg-background hover:bg-primary/5 border border-border hover:border-primary/40 rounded-lg p-4 text-center transition-all duration-200"
                    >
                      <span className="text-xl mb-1 block">{repair.icon}</span>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {repair.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* RIGHT — I'm Not Sure */}
              <div className="bg-card border border-border rounded-xl p-6 sm:p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">I'm Not Sure</h3>
                </div>
                
                <p className="text-muted-foreground font-body mb-6 leading-relaxed">
                  Something's wrong but you're not sure what? No problem. Upload a few photos and describe what you're seeing. Our jeweler will inspect it and tell you exactly what's needed — no commitment until you approve.
                </p>
                
                <Button
                  onClick={() => scrollToForm(undefined, "not_sure")}
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-secondary py-5 font-medium"
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
            <h3 className="text-xl font-serif font-medium text-center mb-3 text-foreground">
              How would you like to get it to us?
            </h3>
            <p className="text-center text-sm text-muted-foreground mb-8 font-body">
              Choose whichever is easiest for you. All options are fully insured.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-5 text-center">
                <Package className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-1">Mail-In</h4>
                <p className="text-sm text-muted-foreground mb-2">Prepaid, Insured Label</p>
                <p className="text-xs text-muted-foreground/70">We email it to you</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-5 text-center">
                <Wrench className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-1">Drop-Off</h4>
                <p className="text-sm text-muted-foreground mb-2">47th Street, NYC</p>
                <p className="text-xs text-muted-foreground/70">By appointment</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-5 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-1">Local Pickup</h4>
                <p className="text-sm text-muted-foreground mb-2">Manhattan / North Jersey</p>
                <p className="text-xs text-muted-foreground/70">We come to you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRE-FORM TRUST SECTION ==================== */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-secondary/50 rounded-xl p-6 sm:p-8 border border-border">
              <h3 className="text-lg font-serif font-medium text-foreground mb-4 text-center">Before You Start</h3>
              <div className="space-y-4 text-sm text-muted-foreground font-body">
                <p className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Your piece is insured the entire time.</strong> From the moment you drop it in the mailbox to when it's back in your hands.</span>
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">We don't start work until you say so.</strong> You'll receive a detailed quote with photos. Approve it or decline — no pressure either way.</span>
                </p>
                <p className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Everything is documented.</strong> We record a video when your piece arrives so you can see exactly what we received.</span>
                </p>
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
            <p className="text-center text-muted-foreground mb-3 font-body">
              Answer a few quick questions. Takes about 2 minutes.
            </p>
            <p className="text-center text-xs text-muted-foreground/70 mb-10 font-body">
              You're not committing to anything. We'll follow up with next steps.
            </p>
            
            <RepairWizard 
              preselectedRepair={preselectedRepair} 
              notSureMode={wizardMode === "not_sure"} 
            />
          </div>
        </div>
      </section>

      {/* ==================== TRUST REASSURANCE STRIP ==================== */}
      <section className="py-10 bg-secondary border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-6">
            <p className="text-sm text-muted-foreground font-body">
              Your jewelry is handled by a Diamond District master jeweler with over 30 years of experience. We treat every piece as if it were our own.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-muted-foreground text-sm font-body">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Fully insured shipping
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Video documentation
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Approval required before work
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Track in your account
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
