import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-zenthra-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-zenthra-gold mb-8">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-poppins text-5xl md:text-6xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you. Get in touch with our team for any questions, concerns, or just to say hello.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-8">
                Send us a Message
              </h2>
              <Card className="p-8 border-0 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zenthra-gray mb-2">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zenthra-gray mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zenthra-gray mb-2">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zenthra-gray mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      required
                      className="w-full resize-none"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white hover:bg-zenthra-gold text-lg py-6 rounded-3xl transition-all duration-300 traveling-border"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-8">
                Get in Touch
              </h2>
              
              <div className="space-y-8">
                <Card className="p-6 border-0 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-8 h-8 text-zenthra-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-zenthra-primary mb-2">
                        Email Us
                      </h3>
                      <p className="text-zenthra-gray">
                        customer.service@zenthra.com
                      </p>
                      <p className="text-zenthra-gray">
                        business@zenthra.com
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 border-0 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <Phone className="w-8 h-8 text-zenthra-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-zenthra-primary mb-2">
                        Call Us
                      </h3>
                      <p className="text-zenthra-gray">
                        +1 (555) 123-4567
                      </p>
                      <p className="text-zenthra-gray">
                        +1 (555) 987-6543
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 border-0 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-8 h-8 text-zenthra-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-zenthra-primary mb-2">
                        Visit Our Store
                      </h3>
                      <p className="text-zenthra-gray">
                        123 Fashion Avenue<br />
                        New York, NY 10001<br />
                        United States
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 border-0 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <Clock className="w-8 h-8 text-zenthra-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-zenthra-primary mb-2">
                        Business Hours
                      </h3>
                      <p className="text-zenthra-gray">
                        Monday - Friday: 9:00 AM - 8:00 PM<br />
                        Saturday: 10:00 AM - 6:00 PM<br />
                        Sunday: 12:00 PM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-zenthra-gray">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                What are your shipping options?
              </h3>
              <p className="text-zenthra-gray">
                We offer standard (5-7 business days) and express (2-3 business days) shipping. Free shipping is available on orders over $100.
              </p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                What is your return policy?
              </h3>
              <p className="text-zenthra-gray">
                We accept returns within 30 days of purchase. Items must be unworn, with tags attached, and in original condition.
              </p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                Do you offer international shipping?
              </h3>
              <p className="text-zenthra-gray">
                Yes, we ship worldwide. International shipping rates and delivery times vary by location.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}