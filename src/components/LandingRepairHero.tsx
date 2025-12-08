import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Package, 
  Video, 
  FileText, 
  CreditCard,
  Shield,
  DollarSign,
  Truck,
  Activity,
  Wrench
} from "lucide-react";

const repairServices = [
  "Ring resizing",
  "Chain soldering", 
  "Prong repairs",
  "Rhodium plating",
  "Polishing",
  "Stone tightening",
  "Stone replacement",
  "Bracelet repair",
  "Clasp repair",
  "Antique restoration",
  "Engagement ring refurbishment"
];

const trustPoints = [
  { icon: Shield, label: "47th Street craftsmanship" },
  { icon: Video, label: "Video intake & documentation" },
  { icon: DollarSign, label: "Transparent pricing" },
  { icon: Truck, label: "Insured shipping" },
  { icon: Activity, label: "Real-time status tracking" },
];

const howItWorksSteps = [
  { step: "1", title: "Submit your repair online", description: "Upload photos and describe the issue." },
  { step: "2", title: "Choose your method", description: "Mail-In, NYC Drop-Off, or Courier Pickup." },
  { step: "3", title: "We document everything", description: "Video intake and digital quote sent to you." },
  { step: "4", title: "Approve & pay securely", description: "Repairs completed within 3–5 days." },
];

export const LandingRepairHero = () => {
  const scrollToForm = () => {
    document.getElementById('repair-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pb-24 bg-gradient-to-b from-service-neutral to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-text mb-6 leading-tight">
              Nationwide Mail-In Jewelry Repair by a 47th Street Master Jeweler
            </h1>
            <p className="text-xl md:text-2xl text-luxury-text-muted mb-10 font-body max-w-3xl mx-auto">
              Ship your jewelry from anywhere in the U.S., or choose NYC drop-off and local courier pickup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={scrollToForm}
                className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded shadow-service"
              >
                Start Your Repair
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link to="#gallery">
                <Button 
                  variant="outline" 
                  className="border-2 border-service-gold text-service-gold hover:bg-service-gold/10 px-8 py-6 text-lg font-semibold rounded"
                >
                  See Before & After Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-text text-center mb-4">
            How It Works
          </h2>
          <div className="w-20 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-service-gold text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-luxury-text mb-2">{step.title}</h3>
                <p className="text-sm text-luxury-text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why People Trust Us */}
      <section className="py-12 bg-service-neutral">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-semibold text-luxury-text text-center mb-8">
            Why People Trust Us
          </h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {trustPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2 text-luxury-text-muted">
                <point.icon className="w-5 h-5 text-service-gold" />
                <span className="text-sm md:text-base font-medium">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Repair */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-text text-center mb-4">
            What We Repair
          </h2>
          <div className="w-20 h-1 bg-service-gold mx-auto mb-12"></div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {repairServices.map((service, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 p-3 bg-service-neutral rounded-lg"
                >
                  <Wrench className="w-4 h-4 text-service-gold flex-shrink-0" />
                  <span className="text-sm text-luxury-text">{service}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button 
              onClick={scrollToForm}
              className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded"
            >
              Get a Free Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
