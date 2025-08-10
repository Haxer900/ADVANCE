import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, MessageCircle, Mail, Phone, Clock, Headphones, HelpCircle } from "lucide-react";

export default function Support() {
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
              Customer Support
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              We're here to help! Get the support you need with our dedicated customer service team and comprehensive resources.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              How Can We Help?
            </h2>
            <p className="text-xl text-zenthra-gray">
              Choose the support option that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <MessageCircle className="w-16 h-16 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Live Chat
              </h3>
              <p className="text-zenthra-gray mb-6">
                Get instant help from our support team. Available 24/7 for urgent inquiries.
              </p>
              <Button className="w-full text-white hover:bg-zenthra-gold py-3 rounded-3xl transition-all duration-300 traveling-border">
                Start Live Chat
              </Button>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow border-2 border-zenthra-gold">
              <Mail className="w-16 h-16 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Email Support
              </h3>
              <p className="text-zenthra-gray mb-6">
                Send us a detailed message and we'll respond within 24 hours.
              </p>
              <Link href="/contact">
                <Button className="w-full text-white hover:bg-zenthra-gold py-3 rounded-3xl transition-all duration-300 traveling-border">
                  Send Email
                </Button>
              </Link>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <Phone className="w-16 h-16 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Phone Support
              </h3>
              <p className="text-zenthra-gray mb-6">
                Call us directly to speak with a customer service representative.
              </p>
              <Button className="w-full text-white hover:bg-zenthra-gold py-3 rounded-3xl transition-all duration-300 traveling-border">
                Call Us Now
              </Button>
            </Card>
          </div>

          {/* Support Hours */}
          <Card className="p-8 border-0 shadow-lg text-center">
            <Clock className="w-12 h-12 text-zenthra-primary mx-auto mb-6" />
            <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
              Support Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-zenthra-gray">
              <div>
                <h4 className="font-semibold text-zenthra-primary mb-2">Live Chat</h4>
                <p>24/7 Available</p>
              </div>
              <div>
                <h4 className="font-semibold text-zenthra-primary mb-2">Email Support</h4>
                <p>Response within 24 hours</p>
              </div>
              <div>
                <h4 className="font-semibold text-zenthra-primary mb-2">Phone Support</h4>
                <p>Mon-Fri: 9 AM - 8 PM EST<br />Weekends: 10 AM - 6 PM EST</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              Quick Help Resources
            </h2>
            <p className="text-xl text-zenthra-gray">
              Find instant answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/faq">
              <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <HelpCircle className="w-12 h-12 text-zenthra-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-poppins text-lg font-bold text-zenthra-primary mb-2">
                  FAQ
                </h3>
                <p className="text-zenthra-gray text-sm">
                  Common questions and answers
                </p>
              </Card>
            </Link>

            <Link href="/size-guide">
              <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="w-12 h-12 bg-zenthra-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold">S</span>
                </div>
                <h3 className="font-poppins text-lg font-bold text-zenthra-primary mb-2">
                  Size Guide
                </h3>
                <p className="text-zenthra-gray text-sm">
                  Find your perfect fit
                </p>
              </Card>
            </Link>

            <Link href="/shipping-info">
              <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="w-12 h-12 bg-zenthra-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold">📦</span>
                </div>
                <h3 className="font-poppins text-lg font-bold text-zenthra-primary mb-2">
                  Shipping Info
                </h3>
                <p className="text-zenthra-gray text-sm">
                  Delivery options and times
                </p>
              </Card>
            </Link>

            <Link href="/returns">
              <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="w-12 h-12 bg-zenthra-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold">↩</span>
                </div>
                <h3 className="font-poppins text-lg font-bold text-zenthra-primary mb-2">
                  Returns
                </h3>
                <p className="text-zenthra-gray text-sm">
                  Easy returns and exchanges
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Team */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-8">
                Our Support Promise
              </h2>
              <p className="text-lg text-zenthra-gray mb-6 leading-relaxed">
                At ZENTHRA, customer satisfaction is our top priority. Our dedicated support team is committed to providing you with exceptional service at every step of your journey with us.
              </p>
              <ul className="text-zenthra-gray space-y-4 mb-8">
                <li className="flex items-center">
                  <Headphones className="w-5 h-5 text-zenthra-primary mr-3" />
                  Expert product knowledge and fashion advice
                </li>
                <li className="flex items-center">
                  <Headphones className="w-5 h-5 text-zenthra-primary mr-3" />
                  Personalized sizing and fit assistance
                </li>
                <li className="flex items-center">
                  <Headphones className="w-5 h-5 text-zenthra-primary mr-3" />
                  Fast resolution of any issues or concerns
                </li>
                <li className="flex items-center">
                  <Headphones className="w-5 h-5 text-zenthra-primary mr-3" />
                  Multilingual support in English, Spanish, and French
                </li>
              </ul>
              <Button className="text-white hover:bg-zenthra-gold text-lg px-8 py-4 rounded-3xl transition-all duration-300 traveling-border">
                Contact Our Team
              </Button>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Customer support team" 
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              Contact Information
            </h2>
            <p className="text-xl text-zenthra-gray">
              Multiple ways to reach us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-0 shadow-lg">
              <Mail className="w-8 h-8 text-zenthra-primary mb-4" />
              <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                Email Addresses
              </h3>
              <div className="space-y-2 text-zenthra-gray">
                <p>General Support: support@zenthra.com</p>
                <p>Orders & Shipping: orders@zenthra.com</p>
                <p>Returns: returns@zenthra.com</p>
                <p>Business Inquiries: business@zenthra.com</p>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <Phone className="w-8 h-8 text-zenthra-primary mb-4" />
              <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                Phone Numbers
              </h3>
              <div className="space-y-2 text-zenthra-gray">
                <p>Customer Service: +1 (555) 123-4567</p>
                <p>Order Support: +1 (555) 234-5678</p>
                <p>International: +1 (555) 345-6789</p>
                <p>Business Line: +1 (555) 456-7890</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}