import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Shield, DollarSign, Clock, ArrowRight } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Diamond District Craftsmanship",
    description: "Every repair is handled by a master jeweler with 30+ years on NYC's 47th Street.",
    color: "bg-amber-100 text-amber-700"
  },
  {
    icon: Shield,
    title: "Insured From Pickup to Delivery",
    description: "Your piece is fully insured from the moment it leaves your hands until it's returned.",
    color: "bg-blue-100 text-blue-700"
  },
  {
    icon: DollarSign,
    title: "No Work Without Approval",
    description: "You receive a detailed quote and must approve before any repair begins.",
    color: "bg-green-100 text-green-700"
  },
  {
    icon: Clock,
    title: "Track in Your Account",
    description: "Follow your repair's progress online. Every step documented and visible to you.",
    color: "bg-purple-100 text-purple-700"
  },
];

interface WhyMailToUsProps {
  className?: string;
}

export const WhyMailToUs = ({ className = "" }: WhyMailToUsProps) => {
  return (
    <section className={`py-16 md:py-24 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-text mb-4">
            Why People Trust Us With Their Jewelry
          </h2>
          <div className="w-20 h-1 bg-service-gold mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {reasons.map((reason, index) => (
            <Card 
              key={index} 
              className="border-luxury-divider shadow-soft hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${reason.color} flex items-center justify-center mb-4`}>
                  <reason.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-luxury-text mb-2">{reason.title}</h3>
                <p className="text-sm text-luxury-text-muted leading-relaxed">
                  {reason.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/repairs">
            <Button className="bg-service-gold text-white hover:bg-service-gold-hover px-8 py-6 text-lg font-semibold rounded shadow-service">
              Start Your Repair
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
