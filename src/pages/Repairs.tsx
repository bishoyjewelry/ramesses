import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, Package, FileText, 
  CheckCircle, ArrowRight, HelpCircle, Search, X
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOContentBlock } from "@/components/SEOContentBlock";
import { RepairWizard } from "@/components/RepairWizard";
import { repairServices, categories, getServicesByCategory, type RepairService } from "@/data/repairServices";

const trendingTags = [
  { label: "Ring Sizing", slug: "ring-sizing-up" },
  { label: "Chain Repair", slug: "chain-repair" },
  { label: "Watch Battery", slug: "watch-battery-replacement" },
];

const Repairs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<RepairService | null>(null);
  const [wizardMode, setWizardMode] = useState<"default" | "not_sure">("default");

  // Filter services based on search and category
  const filteredServices = useMemo(() => {
    let services = repairServices;
    
    if (selectedCategory) {
      services = getServicesByCategory(selectedCategory as RepairService["category"]);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      services = services.filter(
        s => s.name.toLowerCase().includes(query) || 
             s.shortDescription.toLowerCase().includes(query)
      );
    }
    
    return services;
  }, [searchQuery, selectedCategory]);

  const handleServiceSelect = (service: RepairService) => {
    setSelectedService(service);
    setTimeout(() => {
      document.getElementById('repair-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleNotSure = () => {
    setSelectedService(null);
    setWizardMode("not_sure");
    setTimeout(() => {
      document.getElementById('repair-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
    setSearchQuery("");
  };

  const handleTagClick = (slug: string) => {
    const service = repairServices.find(s => s.slug === slug);
    if (service) {
      handleServiceSelect(service);
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* ==================== HERO WITH SEARCH ==================== */}
      <section className="pt-28 pb-12 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium mb-4 text-foreground">
              Jewelry & Watch Repair
            </h1>
            <p className="text-lg text-muted-foreground mb-8 font-body">
              Transparent pricing. Insured shipping. Master jeweler craftsmanship.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for a repair service..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedCategory(null);
                  }}
                  className="pl-12 pr-4 py-6 text-base bg-background border-border"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Trending Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground/70">Popular:</span>
              {trendingTags.map((tag) => (
                <button
                  key={tag.slug}
                  onClick={() => handleTagClick(tag.slug)}
                  className="px-3 py-1.5 text-sm bg-background border border-border rounded-full hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BROWSE BY CATEGORY ==================== */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-serif font-medium text-center mb-8 text-foreground">
              What can we help you repair?
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((category) => {
                const serviceCount = getServicesByCategory(category.id as RepairService["category"]).length;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`p-4 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{category.icon}</span>
                    <span className="text-sm font-medium text-foreground block">{category.label}</span>
                    <span className="text-xs text-muted-foreground">{serviceCount} services</span>
                  </button>
                );
              })}
            </div>
            
            {/* Active filter indicator */}
            {(selectedCategory || searchQuery) && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
                  {selectedCategory && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== SERVICES GRID ==================== */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <span className="text-2xl mb-3 block">{service.icon}</span>
                    <h3 className="font-medium text-foreground mb-1 text-sm">{service.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {service.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        From ${service.basePrice}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 px-3"
                        onClick={() => handleServiceSelect(service)}
                      >
                        Select
                      </Button>
                    </div>
                    {service.priceNote && (
                      <p className="text-[10px] text-muted-foreground/70 mt-2">
                        {service.priceNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No services found matching your search.</p>
                <Button variant="outline" onClick={clearFilters}>
                  View all services
                </Button>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground/80 text-center mt-6 font-body">
              Final pricing confirmed after inspection. No work begins without your approval.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== I'M NOT SURE SECTION ==================== */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Not sure what repair you need?</h3>
              </div>
              
              <p className="text-muted-foreground font-body mb-6 leading-relaxed">
                Something's wrong but you're not sure what? No problem. Upload a few photos and describe what you're seeing. Our jeweler will inspect it and tell you exactly what's needed — no commitment until you approve.
              </p>
              
              <Button
                onClick={handleNotSure}
                variant="outline"
                className="w-full border-border text-foreground hover:bg-secondary py-5 font-medium"
              >
                Let a Jeweler Review It
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
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
                <Package className="w-8 h-8 text-primary mx-auto mb-3" />
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
              {selectedService 
                ? `Start Your ${selectedService.name} Request`
                : 'Start Your Repair Request'
              }
            </h2>
            {selectedService && (
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                  <span>{selectedService.icon}</span>
                  <span>{selectedService.name}</span>
                  <span>•</span>
                  <span>From ${selectedService.basePrice}</span>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}
            <p className="text-center text-muted-foreground mb-3 font-body">
              Answer a few quick questions. Takes about 2 minutes.
            </p>
            <p className="text-center text-xs text-muted-foreground/70 mb-10 font-body">
              You're not committing to anything. We'll follow up with next steps.
            </p>
            
            <RepairWizard 
              preselectedRepair={selectedService?.id || null} 
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