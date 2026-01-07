import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Privacy Policy
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
            
            {/* Information We Collect */}
            <h2 className="text-2xl font-serif text-foreground mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-6">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
              <li>Name, email address, phone number, and mailing address</li>
              <li>Payment information when you make a purchase</li>
              <li>Photos and descriptions of jewelry items for repair or custom orders</li>
              <li>Communication preferences and correspondence with us</li>
              <li>Account information if you create an account with us</li>
            </ul>

            {/* How We Use Your Information */}
            <h2 className="text-2xl font-serif text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
              <li>Process and fulfill your repair requests and custom orders</li>
              <li>Send you shipping updates and order confirmations</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Communicate with you about products, services, and promotions</li>
              <li>Improve our services and develop new features</li>
              <li>Comply with legal obligations</li>
            </ul>

            {/* Data Security */}
            <h2 className="text-2xl font-serif text-foreground mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-6">
              We take reasonable measures to help protect your personal information from loss, theft, misuse, 
              unauthorized access, disclosure, alteration, and destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Secure payment processing through trusted providers</li>
              <li>Regular security assessments and updates</li>
              <li>Limited access to personal information by employees</li>
            </ul>

            {/* Your Rights */}
            <h2 className="text-2xl font-serif text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-8">
              You may access, update, or delete your personal information at any time by contacting us. 
              You can also opt out of marketing communications by clicking the unsubscribe link in any email.
            </p>

            {/* Contact Us */}
            <h2 className="text-2xl font-serif text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Ramesses Jewelry</strong><br />
              47th Street Diamond District<br />
              New York, NY<br />
              Email: privacy@ramessesjewelry.com
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;