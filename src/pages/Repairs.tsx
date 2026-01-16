import { useState, useMemo } from "react";
import { Search, Filter, X, ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { RepairServiceCard } from "@/components/RepairServiceCard";
import { repairServices, categories, serviceTypes, getPopularServices, searchServices } from "@/data/repairServices";

// Track service with quantity
interface SelectedServiceWithQuantity {
  service: (typeof repairServices)[0];
  quantity: number;
}

const Repairs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedServices, setSelectedServices] = useState<SelectedServiceWithQuantity[]>([]);

  const filteredServices = useMemo(() => {
    let results = repairServices;
    if (searchQuery.trim()) {
      results = searchServices(searchQuery);
    }
    if (selectedCategory) {
      results = results.filter((s) => s.category === selectedCategory);
    }
    if (selectedServiceType) {
      results = results.filter((s) => s.serviceType === selectedServiceType);
    }
    return results;
  }, [searchQuery, selectedCategory, selectedServiceType]);

  const popularServices = getPopularServices();

  const handleSelectService = (service: (typeof repairServices)[0]) => {
    const exists = selectedServices.find((s) => s.service.id === service.id);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.service.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, { service, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove service if quantity goes below 1
      setSelectedServices(selectedServices.filter((s) => s.service.id !== serviceId));
    } else if (newQuantity <= 10) {
      setSelectedServices(
        selectedServices.map((s) =>
          s.service.id === serviceId ? { ...s, quantity: newQuantity } : s
        )
      );
    }
  };

  const getQuantity = (serviceId: string): number => {
    const found = selectedServices.find((s) => s.service.id === serviceId);
    return found?.quantity || 0;
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedServiceType(null);
    setSearchQuery("");
  };

  // Calculate totals with bulk discount
  const totalQuantity = selectedServices.reduce((sum, s) => sum + s.quantity, 0);
  const subtotal = selectedServices.reduce((sum, s) => sum + s.service.basePrice * s.quantity, 0);
  const hasBulkDiscount = totalQuantity >= 2;
  const discountedTotal = hasBulkDiscount ? Math.round(subtotal * 0.8) : subtotal;
  
  const trendingSearches = ["ring sizing", "chain repair", "watch battery", "engraving", "gold plating"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero */}
      <section className="bg-secondary pt-28 pb-12 md:pb-16">
        <div className="container-wide mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-3">
              Jewelry & Watch Repair
            </h1>
            <p className="text-muted-foreground mb-8">
              Transparent pricing. Insured shipping. Master jeweler craftsmanship.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services (e.g., ring sizing, chain repair)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-10 py-6 text-base bg-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Trending */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">🔥 Trending:</span>
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="text-sm px-3 py-1 bg-white border border-border rounded-full hover:border-primary transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="flex-1 py-8 md:py-12">
        <div className="container-wide mx-auto px-4">
          <div className="flex gap-8">
            
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-medium text-foreground mb-3">Item Type</h3>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedCategory === cat.id 
                          ? "bg-primary/10 text-primary" 
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-3">Service Type</h3>
                  {serviceTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedServiceType(selectedServiceType === type.id ? null : type.id)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedServiceType === type.id 
                          ? "bg-primary/10 text-primary" 
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                {(selectedCategory || selectedServiceType) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            </aside>

            {/* Mobile Filters */}
            <div className="lg:hidden w-full mb-4">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
              {showFilters && (
                <div className="mt-4 p-4 bg-secondary rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          selectedCategory === cat.id 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "bg-white border-border"
                        }`}
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Services */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-6">
                {filteredServices.length} services
              </p>

              {/* Popular */}
              {!searchQuery && !selectedCategory && !selectedServiceType && (
                <div className="mb-10">
                  <h2 className="text-xl font-medium text-foreground mb-4">Popular Services</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {popularServices.map((service) => (
                      <RepairServiceCard
                        key={service.id}
                        service={service}
                        onSelect={handleSelectService}
                        isSelected={selectedServices.some((s) => s.service.id === service.id)}
                        quantity={getQuantity(service.id)}
                        onQuantityChange={handleQuantityChange}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Services */}
              <h2 className="text-xl font-medium text-foreground mb-4">
                {searchQuery ? `Results for "${searchQuery}"` : "All Services"}
              </h2>
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service) => (
                    <RepairServiceCard
                      key={service.id}
                      service={service}
                      onSelect={handleSelectService}
                      isSelected={selectedServices.some((s) => s.service.id === service.id)}
                      quantity={getQuantity(service.id)}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No services found.</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cart Bar */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-foreground text-background py-4 px-4 z-50 shadow-lg">
          <div className="container-wide mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">
                {totalQuantity} {totalQuantity === 1 ? 'service' : 'services'} selected
              </span>
              <div className="hidden sm:flex items-center gap-2 text-sm opacity-80">
                {selectedServices.slice(0, 3).map((s) => (
                  <span key={s.service.id} className="bg-background/20 px-2 py-0.5 rounded">
                    {s.quantity > 1 ? `${s.quantity}× ` : ''}{s.service.name}
                  </span>
                ))}
                {selectedServices.length > 3 && (
                  <span className="opacity-70">+{selectedServices.length - 3} more</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs opacity-70">Estimate</p>
                {hasBulkDiscount ? (
                  <div className="flex items-center gap-2">
                    <span className="line-through opacity-50">${subtotal}</span>
                    <span className="font-semibold">${discountedTotal}</span>
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                      20% bulk discount
                    </span>
                  </div>
                ) : (
                  <p className="font-semibold">${subtotal}</p>
                )}
              </div>
              <Button variant="secondary" size="lg">
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Trust */}
      <section className="bg-secondary py-12">
        <div className="container-wide mx-auto px-4 text-center">
          <h2 className="text-xl font-medium text-foreground mb-4">Why Trust Ramesses?</h2>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-muted-foreground">
            <span>✓ Fully insured</span>
            <span>✓ Video documentation</span>
            <span>✓ No work without approval</span>
            <span>✓ 30-day guarantee</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Repairs;
