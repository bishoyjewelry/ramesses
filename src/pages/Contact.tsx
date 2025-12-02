import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Instagram, MessageCircle, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      
      <section className="pt-32 pb-16 bg-gradient-to-b from-luxury-charcoal via-luxury-charcoal to-luxury-warm text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-white">
            Get In <span className="text-luxury-gold">Touch</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Visit our showroom or reach out for a consultation
          </p>
        </div>
      </section>

      <section className="py-16 bg-luxury-warm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-luxury-gold/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-luxury-gold mt-1" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-muted-foreground">(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-luxury-gold mt-1" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-muted-foreground">info@ramessesjewelry.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-luxury-gold mt-1" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-muted-foreground">123 Diamond District<br />New York, NY 10036</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-luxury-gold mt-1" />
                    <div>
                      <p className="font-semibold">Hours</p>
                      <p className="text-muted-foreground">
                        Mon-Fri: 10AM - 7PM<br />
                        Sat: 10AM - 6PM<br />
                        Sun: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-luxury-gold/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif font-bold mb-6">Connect With Us</h2>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-luxury-gold/20 hover:border-luxury-gold hover:text-luxury-gold"
                    onClick={() => window.open('https://wa.me/', '_blank')}
                  >
                    <MessageCircle className="mr-3 h-5 w-5" />
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-luxury-gold/20 hover:border-luxury-gold hover:text-luxury-gold"
                    onClick={() => window.open('https://instagram.com', '_blank')}
                  >
                    <Instagram className="mr-3 h-5 w-5" />
                    Instagram
                  </Button>
                </div>

                <div className="mt-8 p-6 bg-luxury-gold/10 rounded-lg">
                  <h3 className="font-semibold text-luxury-gold mb-2">Walk-Ins Welcome!</h3>
                  <p className="text-sm text-muted-foreground">
                    No appointment necessary for repairs or consultations. We're here to help!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-luxury-gold/20 overflow-hidden">
            <div className="aspect-video bg-luxury-charcoal flex items-center justify-center">
              <p className="text-muted-foreground">Map integration placeholder</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;
