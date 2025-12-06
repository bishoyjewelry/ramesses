import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Instagram, MessageCircle, Clock } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-service-bg">
      <Navigation />
      
      {/* Hero Section - Palette 1 */}
      <section className="pt-32 pb-20 bg-service-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-sans service-heading font-bold mb-6 text-white">
            Get In <span className="text-service-gold">Touch</span>
          </h1>
          <p className="text-xl text-service-text-muted max-w-2xl mx-auto font-body">
            Visit our showroom or reach out for a consultation
          </p>
        </div>
      </section>

      {/* Contact Cards - Light Section */}
      <section className="py-20 bg-service-neutral">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
            <Card className="border-0 shadow-service rounded-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-sans font-bold mb-6 text-luxury-text">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-service-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-service-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-luxury-text">Phone</p>
                      <p className="text-luxury-text-muted font-body">(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-service-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-service-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-luxury-text">Email</p>
                      <p className="text-luxury-text-muted font-body">info@ramessesjewelry.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-service-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-service-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-luxury-text">Address</p>
                      <p className="text-luxury-text-muted font-body">123 Diamond District<br />New York, NY 10036</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-service-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-service-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-luxury-text">Hours</p>
                      <p className="text-luxury-text-muted font-body">
                        Mon-Fri: 10AM - 7PM<br />
                        Sat: 10AM - 6PM<br />
                        Sun: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-service rounded-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-sans font-bold mb-6 text-luxury-text">Connect With Us</h2>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-luxury-divider hover:border-service-gold hover:text-service-gold rounded"
                    onClick={() => window.open('https://wa.me/', '_blank')}
                  >
                    <MessageCircle className="mr-3 h-5 w-5" />
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-luxury-divider hover:border-service-gold hover:text-service-gold rounded"
                    onClick={() => window.open('https://instagram.com', '_blank')}
                  >
                    <Instagram className="mr-3 h-5 w-5" />
                    Instagram
                  </Button>
                </div>

                <div className="mt-8 p-6 bg-service-gold/10 rounded-lg border border-service-gold/20">
                  <h3 className="font-semibold text-service-gold mb-2">Walk-Ins Welcome!</h3>
                  <p className="text-sm text-luxury-text-muted font-body">
                    No appointment necessary for repairs or consultations. We're here to help!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Placeholder */}
          <Card className="border-0 shadow-service overflow-hidden rounded-lg max-w-5xl mx-auto">
            <div className="aspect-video bg-service-bg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-service-gold mx-auto mb-3 opacity-50" />
                <p className="text-service-text-muted">Map integration placeholder</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;