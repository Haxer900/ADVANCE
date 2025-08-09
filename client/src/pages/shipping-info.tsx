import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Truck, Clock, Globe, Shield } from "lucide-react";

export default function ShippingInfo() {
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
              Shipping Information
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Fast, reliable shipping to your door. Learn about our shipping options, delivery times, and costs.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              Shipping Options
            </h2>
            <p className="text-xl text-zenthra-gray">
              Choose the shipping method that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 border-0 shadow-lg text-center">
              <Truck className="w-16 h-16 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Standard Shipping
              </h3>
              <p className="text-zenthra-gray mb-4">
                5-7 business days delivery
              </p>
              <p className="text-3xl font-bold text-zenthra-primary mb-4">
                $9.99
              </p>
              <p className="text-sm text-zenthra-gray">
                Free on orders over $100
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg text-center border-2 border-zenthra-gold">
              <Clock className="w-16 h-16 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Express Shipping
              </h3>
              <p className="text-zenthra-gray mb-4">
                2-3 business days delivery
              </p>
              <p className="text-3xl font-bold text-zenthra-primary mb-4">
                $19.99
              </p>
              <p className="text-sm text-zenthra-gray">
                Most popular choice
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg text-center">
              <Shield className="w-16 h-16 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Overnight Shipping
              </h3>
              <p className="text-zenthra-gray mb-4">
                Next business day delivery
              </p>
              <p className="text-3xl font-bold text-zenthra-primary mb-4">
                $39.99
              </p>
              <p className="text-sm text-zenthra-gray">
                Order by 2 PM EST
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              International Shipping
            </h2>
            <p className="text-xl text-zenthra-gray">
              We deliver worldwide with secure, tracked shipping
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Card className="p-8 border-0 shadow-lg">
                <Globe className="w-12 h-12 text-zenthra-primary mb-6" />
                <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                  Worldwide Delivery
                </h3>
                <p className="text-zenthra-gray mb-6">
                  We ship to over 180 countries worldwide. International shipping costs and delivery times vary by destination.
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium text-zenthra-primary">Canada</span>
                    <span className="text-zenthra-gray">7-14 days, from $15</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium text-zenthra-primary">Europe</span>
                    <span className="text-zenthra-gray">10-16 days, from $25</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium text-zenthra-primary">Asia Pacific</span>
                    <span className="text-zenthra-gray">12-20 days, from $30</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-zenthra-primary">Rest of World</span>
                    <span className="text-zenthra-gray">15-25 days, from $35</span>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <img 
                src="https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Global shipping" 
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Policies */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              Shipping Policies
            </h2>
            <p className="text-xl text-zenthra-gray">
              Important information about our shipping process
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-8 border-0 shadow-lg">
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Processing Time
              </h3>
              <p className="text-zenthra-gray mb-4">
                All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day.
              </p>
              <p className="text-zenthra-gray">
                During peak seasons (holidays, sales events), processing times may extend to 2-3 business days.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Order Tracking
              </h3>
              <p className="text-zenthra-gray mb-4">
                Once your order ships, you'll receive a tracking number via email. You can track your package using this number on our website or the carrier's website.
              </p>
              <p className="text-zenthra-gray">
                International orders may have limited tracking information once they enter the destination country.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Shipping Address
              </h3>
              <p className="text-zenthra-gray mb-4">
                Please ensure your shipping address is correct before completing your order. We cannot redirect packages once they've been shipped.
              </p>
              <p className="text-zenthra-gray">
                We recommend shipping to addresses where someone will be available to receive the package during normal business hours.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Customs & Duties
              </h3>
              <p className="text-zenthra-gray mb-4">
                International customers are responsible for any customs duties, taxes, or fees imposed by their country's customs office.
              </p>
              <p className="text-zenthra-gray">
                These charges are not included in your order total and vary by country. We recommend checking with your local customs office for more information.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
            Questions About Shipping?
          </h2>
          <p className="text-xl text-zenthra-gray mb-12 max-w-2xl mx-auto">
            Our customer service team is here to help with any shipping questions or concerns you may have.
          </p>
          <Link href="/contact">
            <Button className="text-white hover:bg-zenthra-gold text-lg px-8 py-4 rounded-3xl transition-all duration-300 traveling-border">
              Contact Support
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}