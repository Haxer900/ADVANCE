import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-zenthra-light py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-zenthra-black mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-zenthra-gray max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with our team for any questions or assistance.
          </p>
        </div>
      </div>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="font-playfair text-3xl font-bold text-zenthra-black mb-6">
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="mt-2"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="mt-2"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="mt-2"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mt-2 min-h-32"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-zenthra-black text-white hover:bg-zenthra-gold hover:text-black transition-colors duration-300 h-12 text-lg font-semibold"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-zenthra-black mb-6">
                    Get in Touch
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-zenthra-gold mt-1" />
                      <div>
                        <h4 className="font-semibold text-zenthra-black">Visit Our Showroom</h4>
                        <p className="text-zenthra-gray">
                          123 Luxury Avenue<br />
                          Premium District<br />
                          New York, NY 10001
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-zenthra-gold mt-1" />
                      <div>
                        <h4 className="font-semibold text-zenthra-black">Call Us</h4>
                        <p className="text-zenthra-gray">
                          +1 (555) 123-4567<br />
                          Toll-free: 1-800-ZENTHRA
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-zenthra-gold mt-1" />
                      <div>
                        <h4 className="font-semibold text-zenthra-black">Email Us</h4>
                        <p className="text-zenthra-gray">
                          hello@zenthra.com<br />
                          support@zenthra.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-zenthra-gold mt-1" />
                      <div>
                        <h4 className="font-semibold text-zenthra-black">Business Hours</h4>
                        <p className="text-zenthra-gray">
                          Monday - Friday: 9:00 AM - 7:00 PM<br />
                          Saturday: 10:00 AM - 6:00 PM<br />
                          Sunday: 12:00 PM - 5:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-zenthra-black mb-4">
                    Family-Friendly Experience
                  </h3>
                  <p className="text-zenthra-gray mb-4">
                    Our showroom is designed with families in mind. We provide:
                  </p>
                  <ul className="text-zenthra-gray space-y-2">
                    <li>• Children's play area</li>
                    <li>• Family consultation rooms</li>
                    <li>• Complimentary refreshments</li>
                    <li>• Personal shopping assistance</li>
                    <li>• Private viewing appointments</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-0">
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-zenthra-gold mx-auto mb-4" />
            <p className="text-zenthra-gray">Interactive Map Coming Soon</p>
          </div>
        </div>
      </section>
    </div>
  );
}
