import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-muted">
            
            {/* Agreement to Terms */}
            <h2 className="text-2xl font-serif text-foreground mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground mb-8">
              By accessing or using the services of Ramesses Jewelry, you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access our services. These terms apply to all 
              visitors, users, and others who access or use our services.
            </p>

            {/* Services Description */}
            <h2 className="text-2xl font-serif text-foreground mb-4">Services Description</h2>
            <p className="text-muted-foreground mb-6">
              Ramesses Jewelry provides the following services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
              <li><strong>Jewelry Repair:</strong> Professional repair services including resizing, prong work, stone setting, chain repair, and restoration</li>
              <li><strong>Custom Jewelry:</strong> Design and creation of custom jewelry pieces including engagement rings, pendants, and other items</li>
              <li><strong>Retail Sales:</strong> Sale of jewelry items through our online store</li>
            </ul>

            {/* Payment Terms */}
            <h2 className="text-2xl font-serif text-foreground mb-4">Payment Terms</h2>
            <p className="text-muted-foreground mb-6">
              Payment terms for our services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
              <li>Repair quotes are provided after inspection of your item</li>
              <li>No work begins until you approve the quoted price</li>
              <li>Payment is due upon completion before items are returned</li>
              <li>Custom orders may require a deposit before work begins</li>
              <li>We accept major credit cards and other payment methods as displayed at checkout</li>
            </ul>

            {/* Limitation of Liability */}
            <h2 className="text-2xl font-serif text-foreground mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground mb-6">
              While we take every precaution to protect your jewelry:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
              <li>All items are fully insured while in our care and during transit</li>
              <li>In case of loss or damage, compensation is based on appraised value</li>
              <li>We are not responsible for items lost in transit before reaching our facility</li>
              <li>Pre-existing damage will be documented and communicated before work begins</li>
            </ul>

            {/* Intellectual Property */}
            <h2 className="text-2xl font-serif text-foreground mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground mb-8">
              All content on this website, including designs, images, text, and graphics, is the property of 
              Ramesses Jewelry and is protected by applicable intellectual property laws. Custom designs created 
              for clients remain the client's property upon full payment.
            </p>

            {/* Changes to Terms */}
            <h2 className="text-2xl font-serif text-foreground mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground mb-8">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon 
              posting to this page. Your continued use of our services after changes constitutes acceptance of 
              the modified terms.
            </p>

            {/* Contact */}
            <h2 className="text-2xl font-serif text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Ramesses Jewelry</strong><br />
              47th Street Diamond District<br />
              New York, NY<br />
              Email: legal@ramessesjewelry.com
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;