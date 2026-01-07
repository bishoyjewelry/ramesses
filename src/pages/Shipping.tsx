import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Package, Truck, Shield, Clock } from "lucide-react";

const Shipping = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Shipping & Returns
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Your jewelry is fully insured from the moment it leaves your hands until it's back with you.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-16">
            
            {/* Shipping Your Jewelry to Us */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-serif text-foreground">Shipping Your Jewelry to Us</h2>
              </div>
              <div className="prose prose-muted max-w-none text-muted-foreground space-y-4">
                <p>
                  When you submit a repair or custom jewelry request, we'll email you a prepaid, insured shipping label. 
                  Simply package your item securely and drop it off at any authorized carrier location.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the padded mailer or box we recommend for safe transit</li>
                  <li>Keep your tracking number for reference</li>
                  <li>Your item is insured from the moment it's in transit</li>
                  <li>We'll notify you when your package arrives at our Diamond District workshop</li>
                </ul>
              </div>
            </div>

            {/* Return Shipping */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-serif text-foreground">Return Shipping</h2>
              </div>
              <div className="prose prose-muted max-w-none text-muted-foreground space-y-4">
                <p>
                  Once your repair or custom piece is complete and has passed our quality inspection, 
                  we'll ship it back to you using insured, tracked delivery.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Signature required upon delivery for your protection</li>
                  <li>Real-time tracking updates sent to your email</li>
                  <li>Discreet packaging with no indication of valuable contents</li>
                  <li>Free return shipping included with all repairs and custom orders</li>
                </ul>
              </div>
            </div>

            {/* Insurance Coverage */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-serif text-foreground">Insurance Coverage</h2>
              </div>
              <div className="prose prose-muted max-w-none text-muted-foreground space-y-4">
                <p>
                  Every piece is fully insured throughout the entire process:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>In Transit to Us:</strong> Covered from the moment you drop off your package</li>
                  <li><strong>While in Our Care:</strong> Insured while in our secure Diamond District workshop</li>
                  <li><strong>Return Transit:</strong> Fully covered until it's safely in your hands</li>
                </ul>
                <p>
                  In the rare event of loss or damage, you'll be fully compensated based on the appraised value of your piece.
                </p>
              </div>
            </div>

            {/* Turnaround Times */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-serif text-foreground">Turnaround Times</h2>
              </div>
              <div className="prose prose-muted max-w-none text-muted-foreground space-y-4">
                <p>
                  Estimated turnaround times from when we receive your item:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Simple Repairs</strong> (resizing, polishing, clasp): 3-5 business days</li>
                  <li><strong>Standard Repairs</strong> (prong work, stone setting): 5-7 business days</li>
                  <li><strong>Complex Repairs</strong> (restoration, multi-step): 7-14 business days</li>
                  <li><strong>Custom Jewelry:</strong> 3-6 weeks depending on complexity</li>
                </ul>
                <p>
                  Rush service is available for most repairs. Contact us for expedited options.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shipping;