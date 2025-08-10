import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, HelpCircle, Search } from "lucide-react";

export default function FAQ() {
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
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Find quick answers to the most common questions about ZENTHRA, our products, and services.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              Quick Help Topics
            </h2>
            <p className="text-xl text-zenthra-gray">
              Browse by category to find what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-zenthra-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-poppins text-lg font-bold text-zenthra-primary">
                Orders & Shipping
              </h3>
            </Card>

            <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-zenthra-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-poppins text-lg font-bold text-zenthra-primary">
                Returns & Exchanges
              </h3>
            </Card>

            <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-zenthra-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-poppins text-lg font-bold text-zenthra-primary">
                Products & Sizing
              </h3>
            </Card>

            <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-zenthra-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-poppins text-lg font-bold text-zenthra-primary">
                Account & Payment
              </h3>
            </Card>
          </div>

          {/* Orders & Shipping */}
          <div className="mb-16">
            <h2 className="font-poppins text-3xl font-bold text-zenthra-primary mb-8">
              Orders & Shipping
            </h2>
            <div className="space-y-6">
              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  How long does shipping take?
                </h3>
                <p className="text-zenthra-gray">
                  Standard shipping takes 5-7 business days, express shipping takes 2-3 business days, and overnight shipping delivers the next business day. International shipping varies by location, typically 10-20 business days.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  Do you offer free shipping?
                </h3>
                <p className="text-zenthra-gray">
                  Yes! We offer free standard shipping on all orders over $100 within the United States. International shipping rates apply for orders outside the US.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  Can I track my order?
                </h3>
                <p className="text-zenthra-gray">
                  Absolutely! Once your order ships, you'll receive a tracking number via email. You can track your package on our website or directly on the carrier's website.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  Can I change or cancel my order?
                </h3>
                <p className="text-zenthra-gray">
                  You can modify or cancel your order within 1 hour of placing it. After that, we begin processing your order and changes may not be possible. Contact customer service immediately if you need help.
                </p>
              </Card>
            </div>
          </div>

          {/* Returns & Exchanges */}
          <div className="mb-16">
            <h2 className="font-poppins text-3xl font-bold text-zenthra-primary mb-8">
              Returns & Exchanges
            </h2>
            <div className="space-y-6">
              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  What is your return policy?
                </h3>
                <p className="text-zenthra-gray">
                  We accept returns within 30 days of delivery. Items must be unworn, with tags attached, and in original condition. We offer free return shipping on domestic orders.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  How do I start a return?
                </h3>
                <p className="text-zenthra-gray">
                  Log into your account, go to order history, and select the items you want to return. You'll receive a prepaid return label via email with instructions.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  Do you offer exchanges?
                </h3>
                <p className="text-zenthra-gray">
                  Yes! We offer free exchanges for different sizes or colors (subject to availability). Follow the same return process and indicate you want an exchange.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  How long do refunds take?
                </h3>
                <p className="text-zenthra-gray">
                  Once we receive your return, we process refunds within 3-5 business days. Credit card refunds may take 5-10 business days to appear on your statement.
                </p>
              </Card>
            </div>
          </div>

          {/* Products & Sizing */}
          <div className="mb-16">
            <h2 className="font-poppins text-3xl font-bold text-zenthra-primary mb-8">
              Products & Sizing
            </h2>
            <div className="space-y-6">
              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  How do I find my size?
                </h3>
                <p className="text-zenthra-gray">
                  Check our detailed size guide which includes measurement instructions and size charts for all our collections. If you're between sizes, we recommend sizing up for a more comfortable fit.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  Are your products true to size?
                </h3>
                <p className="text-zenthra-gray">
                  Yes, our products are designed to fit true to size according to our size charts. However, fit can be subjective, so we recommend checking the measurements against your own for the best fit.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  What materials do you use?
                </h3>
                <p className="text-zenthra-gray">
                  We use premium materials including organic cotton, silk, wool, and sustainable fabrics. Each product page lists detailed material information and care instructions.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  Do you have a size guide?
                </h3>
                <p className="text-zenthra-gray">
                  Yes! Our comprehensive size guide includes measurement instructions, size charts for all categories, and international size conversions. You can find it in our customer service section.
                </p>
              </Card>
            </div>
          </div>

          {/* Account & Payment */}
          <div className="mb-16">
            <h2 className="font-poppins text-3xl font-bold text-zenthra-primary mb-8">
              Account & Payment
            </h2>
            <div className="space-y-6">
              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  Do I need an account to place an order?
                </h3>
                <p className="text-zenthra-gray">
                  No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, manage returns, and receive exclusive offers.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-zenthra-gray">
                  We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay for your convenience.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  Is my payment information secure?
                </h3>
                <p className="text-zenthra-gray">
                  Yes, we use industry-standard SSL encryption to protect your payment information. We never store your complete credit card information on our servers.
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <h3 className="font-semibold text-lg text-zenthra-primary mb-3">
                  Can I save my payment information?
                </h3>
                <p className="text-zenthra-gray">
                  Yes, when you create an account, you can securely save your payment methods for faster checkout on future orders.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-zenthra-gray mb-12 max-w-2xl mx-auto">
            Can't find what you're looking for? Our customer service team is here to help with any questions or concerns.
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